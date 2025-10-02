import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "./App.css";
import { Navbar, Footer } from "./components/layout";
import Home from "./index.jsx";

// MUI Theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#2563eb", // Blue
    },
    secondary: {
      main: "#7c3aed", // Purple
    },
    background: {
      default: "#f8fafc",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className='flex flex-col min-h-screen w-ful'>
          <Navbar />
          <main className='flex-grow bg-gray-50'>
            <Routes>
              <Route
                path='/'
                element={<Home />}
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
