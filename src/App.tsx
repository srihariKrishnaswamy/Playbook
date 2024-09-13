import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Playbook } from "./model/Playbook";
import { Play } from "./model/Play";
import PlayPanel from "./components/play-panel/PlayPanel";
import PlaybookAppBar from "./components/playbook-app-bar/PlaybookAppBar";
import PlaybooksDisplay from "./components/playbooks-display/PlaybooksDisplay";
import "./App.css";
import PlaysDisplay from "./components/plays-display/PlaysDisplay";

function App() {
  const [currentPlaybook, setCurrentPlaybook] = useState<Playbook>();
  const [currentPlay, setCurrentPlay] = useState<Play>();

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
          element={<PlaysDisplay currentPlaybook={currentPlaybook} setCurrentPlay={setCurrentPlay}/>}
        />
        <Route path="/play-panel" element={<PlayPanel play={currentPlay}/>} />
      </Routes>
    </Router>
  );
}

export default App;
