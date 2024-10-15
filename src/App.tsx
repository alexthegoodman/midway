import { useMemo, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import {
  Box,
  Button,
  createTheme,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { getThemeOptions } from "./theme";
import FileTree from "./FileTree";
import CmnTerminal from "./Terminal";

function App() {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const theme = useMemo(() => createTheme(getThemeOptions(mode)), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <Box display="flex" flexDirection="row">
        <FileTree />
        <Box>Chat</Box>
        <CmnTerminal />
      </Box>
    </ThemeProvider>
  );
}

export default App;
