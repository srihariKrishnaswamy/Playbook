import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Playbook } from "./model/Playbook";
import PlaybookAppBar from "./components/playbook-app-bar/PlaybookAppBar";
import PlaybooksDisplay from "./components/playbooks-display/PlaybooksDisplay";
import "./App.css";
import PlaysDisplay from "./components/plays-display/PlaysDisplay";

function App() {
  const [currentPlaybook, setCurrentPlaybook] = useState<Playbook>();

  return (
    <Router>
      <PlaybookAppBar />
      <div style={{ paddingTop: "24px" }} />
      <Routes>
        <Route
          path="/"
          element={<PlaybooksDisplay setCurrentPlaybook={setCurrentPlaybook} />}
        />
        <Route
          path="/play-list"
          element={<PlaysDisplay currentPlaybook={currentPlaybook} setCurrentPlaybook={setCurrentPlaybook}/>}
        />
      </Routes>
    </Router>
  );
}

export default App;
