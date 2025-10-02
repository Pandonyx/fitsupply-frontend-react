import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "./App.css";
import { Navbar, Footer } from "./components/layout";
import Landing from "./pages/Landing";
import Products from "./pages/products";
import ProductDetail from "./pages/products/[slug]";

// MUI Theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#2563eb", // Blue
    },
    secondary: {
      main: "#7c3aed", // Purple
    },
    error: {
      main: "#dc2626", // Red for cart badge
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
        <div className='flex flex-col min-h-screen w-full'>
          <Navbar />
          <main className='flex-grow'>
            <Routes>
              <Route
                path='/'
                element={<Landing />}
              />
              <Route
                path='/products'
                element={<Products />}
              />
              <Route
                path='/products/:slug'
                element={<ProductDetail />}
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
