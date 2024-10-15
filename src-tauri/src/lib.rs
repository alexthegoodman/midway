use ignore::{Walk, WalkBuilder};
use serde::Serialize;
use std::collections::HashMap;
use std::fs;
use std::io::{BufRead, BufReader, Write};
use std::path::{Path, PathBuf};
use std::process::{Command, Stdio};
use std::sync::mpsc::{channel, Receiver, Sender};
use std::sync::Mutex;
use std::thread;
use tauri::Emitter;
use tauri::Manager;

#[derive(Serialize, Debug, Clone)]
pub struct FileNode {
    name: String,
    #[serde(rename = "type")]
    node_type: String,
    children: Option<Vec<FileNode>>,
}

pub fn get_directory_structure(root_path: &str) -> Result<Vec<FileNode>, std::io::Error> {
    let root_path = Path::new(root_path);
    let mut tree: HashMap<PathBuf, Vec<FileNode>> = HashMap::new();

    let walker = WalkBuilder::new(root_path)
        .hidden(false) // Show hidden files
        .git_ignore(true) // Respect .gitignore
        .build();

    for entry in walker {
        match entry {
            Ok(entry) => {
                let path = entry.path();
                if path == root_path {
                    continue; // Skip the root directory itself
                }

                let node = FileNode {
                    name: path.file_name().unwrap().to_str().unwrap().to_string(),
                    node_type: if path.is_dir() { "directory" } else { "file" }.to_string(),
                    children: if path.is_dir() {
                        Some(Vec::new())
                    } else {
                        None
                    },
                };

                let parent_path = path.parent().unwrap().to_path_buf();
                tree.entry(parent_path).or_insert_with(Vec::new).push(node);
            }
            Err(err) => eprintln!("Error: {}", err),
        }
    }

    // Build the tree structure
    fn build_tree(path: &Path, tree: &HashMap<PathBuf, Vec<FileNode>>) -> Vec<FileNode> {
        tree.get(path)
            .map(|children| {
                children
                    .iter()
                    .map(|node| {
                        let mut node = node.clone();
                        if node.node_type == "directory" {
                            node.children = Some(build_tree(&path.join(&node.name), tree));
                        }
                        node
                    })
                    .collect()
            })
            .unwrap_or_default()
    }

    Ok(build_tree(root_path, &tree))
}

struct TerminalState(Mutex<Terminal>);

pub struct Terminal {
    input_tx: Option<Sender<String>>,
    output_rx: Option<Receiver<String>>,
}

impl Terminal {
    pub fn new() -> Self {
        Terminal {
            input_tx: None,
            output_rx: None,
        }
    }

    pub fn init(&mut self, app_handle: tauri::AppHandle) {
        let (input_tx, input_rx) = channel();
        let (output_tx, output_rx) = channel();

        self.input_tx = Some(input_tx);
        self.output_rx = Some(output_rx);

        let shell = if cfg!(target_os = "windows") {
            "powershell.exe"
        } else {
            "bash"
        };

        thread::spawn(move || {
            let mut child = Command::new(shell)
                .stdin(Stdio::piped())
                .stdout(Stdio::piped())
                .stderr(Stdio::piped())
                .spawn()
                .expect("Failed to spawn shell");

            let mut stdin = child.stdin.take().expect("Failed to open stdin");
            let stdout = child.stdout.take().expect("Failed to open stdout");
            let stderr = child.stderr.take().expect("Failed to open stderr");

            thread::spawn(move || {
                for input in input_rx {
                    stdin
                        .write_all(input.as_bytes())
                        .expect("Failed to write to stdin");
                }
            });

            let handle_output = move |mut reader: BufReader<Box<dyn std::io::Read + Send>>| {
                let mut line = String::new();
                while let Ok(n) = reader.read_line(&mut line) {
                    if n == 0 {
                        break;
                    }
                    output_tx.send(line.clone()).expect("Failed to send output");
                    app_handle
                        .emit("terminal-output", line.clone())
                        .expect("Failed to emit terminal output");
                    line.clear();
                }
            };

            let handle_output_clone = handle_output.clone();

            thread::spawn(move || handle_output(BufReader::new(Box::new(stdout))));
            thread::spawn(move || handle_output_clone(BufReader::new(Box::new(stderr))));
        });
    }

    pub fn send_input(&self, input: String) {
        if let Some(tx) = &self.input_tx {
            tx.send(input).expect("Failed to send input to terminal");
        }
    }
}

#[tauri::command]
fn init_terminal(
    app_handle: tauri::AppHandle,
    state: tauri::State<TerminalState>,
) -> Result<(), String> {
    let mut terminal = state
        .0
        .lock()
        .map_err(|_| "Failed to lock terminal state")?;
    terminal.init(app_handle);
    Ok(())
}

#[tauri::command]
fn send_to_terminal(input: String, state: tauri::State<TerminalState>) -> Result<(), String> {
    let mut terminal = state
        .0
        .lock()
        .map_err(|_| "Failed to lock terminal state")?;
    terminal.send_input(input);
    Ok(())
}

#[tauri::command]
fn get_file_structure() -> Result<Vec<FileNode>, String> {
    get_directory_structure(".").map_err(|e| e.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let terminal = Terminal::new();
            app.manage(TerminalState(Mutex::new(terminal)));
            Ok(())
        })
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            init_terminal,
            send_to_terminal,
            get_file_structure
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
