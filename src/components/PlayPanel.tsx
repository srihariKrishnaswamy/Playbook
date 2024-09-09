import React, { useState, MouseEvent } from "react";
import { motion } from "framer-motion";
import { Point } from "../model/Point";
import Player from "../model/Player";
import "../App.css";

function PlayPanel() {
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
  const [activePlayerIndex, setActivePlayerIndex] = useState<number | null>(
    null
  ); // Ensure activePlayerIndex is nullable
  const [players, setPlayers] = useState<Player[]>([
    new Player(100, 300),
    new Player(200, 300)
  ]);

  // Function to handle starting the drawing
  const handleMouseDown = (e: MouseEvent<SVGElement>) => {
    if (activePlayerIndex === null) return;

    const svg = e.currentTarget.closest("svg");
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsMouseDown(true);

    const updatedPlayers = [...players];
    updatedPlayers[activePlayerIndex].path = [{ x, y }]; // Start a new path for the active player
    setPlayers(updatedPlayers);
    console.log("Drawing route for player: " + activePlayerIndex)
  };

  // Function to handle mouse movements while drawing
  const handleMouseMove = (e: MouseEvent<SVGElement>) => {
    if (!isMouseDown || activePlayerIndex === null) return;

    const svg = e.currentTarget.closest("svg");
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const updatedPlayers = [...players];
    updatedPlayers[activePlayerIndex].addPoint(x, y); // Add points to the active player's path
    setPlayers(updatedPlayers);
    console.log("Updating route for player: " + activePlayerIndex)
  };

  // Function to stop drawing
  const handleMouseUp = () => {
    setIsMouseDown(false);
    if (activePlayerIndex !== null) {
      const updatedPlayers = [...players];
      updatedPlayers[activePlayerIndex].finishDrawing(); // Mark path as finished
      setPlayers(updatedPlayers);
      console.log("Finished route for player: " + activePlayerIndex)
      setActivePlayerIndex(null);
    }
  };

  // Function to smoothly move through all points without pausing
  const execute = () => {
    const updatedPlayers = players.map((player, index) => {
      console.log("Player " + index + " path: " + player.toString());
      if (player.path.length > 0) {
        const xKeyframes = player.path.map((point) => point.x);
        const yKeyframes = player.path.map((point) => point.y);
        player.setRouteAnimation(xKeyframes, yKeyframes);
        console.log("Running route for player: " + index);
      }
      return player;
    });
    setPlayers(updatedPlayers);
  };

  // Function to generate the path 'd' attribute for each player's SVG path element
  const generatePathD = (player: Player): string => {
    if (player.path.length === 0) return "";

    const [start, ...points] = player.path;
    return `M${start.x},${start.y} ${points
      .map((point) => `L${point.x},${point.y}`)
      .join(" ")}`;
  };

  // Update the reset function to animate players back to their origin
  const resetState = () => {
    const resetPlayers = players.map((player) => {
      player.resetState();
      player.setRouteAnimation([player.origin.x], [player.origin.y]); // Set animation back to the origin points
      return player;
    });
    setPlayers(resetPlayers);
  };

  const selectPlayer = (e : MouseEvent, index: number) => {
    e.stopPropagation(); 
    setActivePlayerIndex(index);
    console.log("active player: " + index);
  }

  return (
    <div>
      <div className="svg-container">
        <svg
          width="400"
          height="400"
          className="svg-drawing-area"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {/* Render the paths for all players */}
          {players.map((player, index) => (
            <path
              key={`path-${index}`}
              d={generatePathD(player)}
              stroke="red"
              strokeWidth="2"
              fill="none"
            />
          ))}

          {/* Render all players */}
          {players.map((player, index) => (
            <motion.circle
              key={index}
              cx={player.position.x}
              cy={player.position.y}
              r="10"
              fill={
                index === activePlayerIndex
                  ? "rgb(140, 140, 140)"
                  : "rgb(0, 0, 0)"
              }
              onClick={(e) => selectPlayer(e, index)}
              animate={{
                cx: player.animation.cx,
                cy: player.animation.cy,
              }}
              transition={{
                duration: 1, // Set duration for reset animation
                ease: "linear",
              }}
            />
          ))}
        </svg>
      </div>

      <div className="button-container">
        <button onClick={execute} className="button">
          Run routes
        </button>
        <button onClick={resetState} className="button" id="reset-button">
          Reset
        </button>
      </div>
    </div>
  );
}

export default PlayPanel;
