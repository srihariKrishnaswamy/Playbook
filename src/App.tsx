import React from "react";
import PlayPanel from "./components/play-panel/PlayPanel";
import "./App.css";
import PlaybookAppBar from "./components/playbook-app-bar/PlaybookAppBar";

function App() {
  return (
    <div>
      <PlaybookAppBar />
      <div style={{paddingTop: '24px'}}/>
      <PlayPanel />
    </div>
  );
}

export default App;
