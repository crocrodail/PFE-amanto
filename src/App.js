import * as React from "react";
import { Routes, Route, Link } from "react-router-dom";
import GameApp from "./game";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="game" element={<GameApp />} />
      </Routes>
    </div>
  );
}

function Home() {
  return (
    <>
      <main>
        <h2>Welcome to the homepage!</h2>
        <p>You can do this, I believe in you.</p>
      </main>
      <nav>
        <Link to="/game">game</Link>
      </nav>
    </>
  );
}

export default App;