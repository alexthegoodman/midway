import { useMemo, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { Box, Button, createTheme, ThemeProvider, Typography } from "@mui/material";
import { getThemeOptions } from "./theme";

function App() {
  const [mode, setMode] = useState<"light" | "dark">(
    // isDarkMode ? "dark" : "light"
    "light"
  );

  const theme = useMemo(() => createTheme(getThemeOptions(mode)), [mode]);

  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <ThemeProvider theme={theme}>
      <Box>
        <Typography variant="h1">Welcome</Typography>
        <Button variant="contained" color="success">Test Button</Button>
      </Box>
    </ThemeProvider>
  );
}

export default App;
