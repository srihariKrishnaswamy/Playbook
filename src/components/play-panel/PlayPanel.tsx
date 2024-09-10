import React, { useState, MouseEvent } from "react";
import { motion } from "framer-motion";
import { Point } from "../../model/Point";
import Player from "../../model/Player";
import "../../App.css";
import "./PlayPanel.css";

function PlayPanel() {
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
  const [activePlayerIndex, setActivePlayerIndex] = useState<number | null>(
    null
  );
  const [players, setPlayers] = useState<Player[]>([
    new Player(100, 300),
    new Player(200, 300),
  ]);

  // Add speed control for each player (default speed = 1)
  const [speeds, setSpeeds] = useState<number[]>([100, 100]); // Speed in pixels per second

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
    console.log("Drawing route for player: " + activePlayerIndex);
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
    console.log("Updating route for player: " + activePlayerIndex);
  };

  // Function to stop drawing
  const handleMouseUp = () => {
    setIsMouseDown(false);
    if (activePlayerIndex !== null) {
      const updatedPlayers = [...players];
      updatedPlayers[activePlayerIndex].finishDrawing(); // Mark path as finished
      setPlayers(updatedPlayers);
      console.log("Finished route for player: " + activePlayerIndex);
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

        // Calculate total path distance
        const totalDistance = calculateTotalDistance(player.path);

        // Get the user's chosen speed (pixels per second)
        const speed = speeds[index];

        // Calculate duration based on total distance and speed
        const duration = totalDistance / speed;

        // Pass the duration and keyframes to the player
        player.setRouteAnimation(xKeyframes, yKeyframes, duration);
        console.log(
          "Running route for player: " +
            index +
            " with speed: " +
            speed +
            " px/sec"
        );
      }
      return player;
    });
    setPlayers(updatedPlayers);
  };

  // Function to calculate total distance of a path
  const calculateTotalDistance = (path: Point[]): number => {
    let totalDistance = 0;
    for (let i = 1; i < path.length; i++) {
      const dx = path[i].x - path[i - 1].x;
      const dy = path[i].y - path[i - 1].y;
      totalDistance += Math.sqrt(dx * dx + dy * dy);
    }
    console.log("This is total distance" + totalDistance);
    return totalDistance;
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
      player.setRouteAnimation([player.origin.x], [player.origin.y], 1); // Reset animation back to origin points
      return player;
    });
    setPlayers(resetPlayers);
  };

  const selectPlayer = (e: MouseEvent, index: number) => {
    e.stopPropagation();
    setActivePlayerIndex(index);
    console.log("Active player: " + index);
  };

  // Function to handle speed change for each player
  const handleSpeedChange = (index: number, newSpeed: number) => {
    const updatedSpeeds = [...speeds];
    updatedSpeeds[index] = newSpeed;
    setSpeeds(updatedSpeeds);
  };

  return (
    <div className="component-container">
      <div className="play-panel-container">
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
                  duration: player.animation.duration || 1, // Set dynamic duration
                  ease: "linear",
                }}
              />
            ))}
          </svg>
          <div className="button-container">
            <button onClick={execute} className="button">
              Run routes
            </button>
            <button onClick={resetState} className="button" id="reset-button">
              Reset
            </button>
          </div>
        </div>

        <div className="speed-controls">
          {players.map((_, index) => (
            <div key={index}>
              <label>Player {index + 1} Speed: </label>
              <input
                type="range"
                min="50"
                max="300"
                step="10"
                value={speeds[index]}
                onChange={(e) =>
                  handleSpeedChange(index, Number(e.target.value))
                }
              />
              <span>{speeds[index]} px/sec</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PlayPanel;
