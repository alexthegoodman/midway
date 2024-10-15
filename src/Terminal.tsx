import React, { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";
import { invoke } from "@tauri-apps/api/core";
import useAsyncEffect from "use-async-effect";
import { listen } from "@tauri-apps/api/event";
import { useMountEffect } from "use-mount-effect";

const CmnTerminal: React.FC = () => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<Terminal | null>(null);

  useMountEffect(() => {
    const setupXterm = async () => {
      if (!terminalRef.current) return;

      const term = new Terminal({
        cursorBlink: true,
        cursorStyle: "block",
      });
      termRef.current = term;
      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
      term.open(terminalRef.current);
      fitAddon.fit();

      // Set up communication with Rust backend
      await invoke("init_terminal");

      let currentLine = "";

      term.onKey(({ key, domEvent }) => {
        const printable =
          !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;

        if (domEvent.keyCode === 13) {
          // Enter key
          term.write("\r\n");
          invoke("send_to_terminal", { input: currentLine + "\r" });
          currentLine = "";
        } else if (domEvent.keyCode === 8) {
          // Backspace
          if (currentLine.length > 0) {
            currentLine = currentLine.slice(0, -1);
            term.write("\b \b");
          }
        } else if (printable) {
          currentLine += key;
          term.write(key);
        }
      });

      // Listen for terminal output
      const unlisten = await listen("terminal-output", (event) => {
        term.write(event.payload as string);
      });

      return () => {
        unlisten();
        term.dispose();
      };
    };

    setupXterm();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (termRef.current) {
        const fitAddon = new FitAddon();
        termRef.current.loadAddon(fitAddon);
        fitAddon.fit();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      ref={terminalRef}
      style={{ height: "90vh", width: "calc(100vw - 300px)" }}
    />
  );
};

export default CmnTerminal;
