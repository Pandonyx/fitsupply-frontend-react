import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

// Temporary test component
function Home() {
  return (
    <div className='bg-blue-500 text-white p-4'>Tailwind is working! 🎉</div>
  );
}

function App() {
  return (
    <Router>
      <div className='App flex flex-col min-h-screen'>
        <Navbar />
        <main className='flex-grow'>
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
  );
}

export default App;
