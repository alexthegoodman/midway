import { invoke } from "@tauri-apps/api/core";
import React, { useState, useEffect } from "react";

interface FileNode {
  name: string;
  type: "file" | "directory";
  children?: FileNode[];
}

const FileTree: React.FC = () => {
  const [files, setFiles] = useState<FileNode[]>([]);

  useEffect(() => {
    invoke<FileNode[]>("get_file_structure").then(setFiles);
  }, []);

  const renderNode = (node: FileNode) => (
    <li key={node.name}>
      {node.name}
      {node.type === "directory" && node.children && (
        <ul>{node.children.map(renderNode)}</ul>
      )}
    </li>
  );

  return <ul>{files.map(renderNode)}</ul>;
};

export default FileTree;
