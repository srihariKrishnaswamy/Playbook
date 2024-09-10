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

  const [speeds, setSpeeds] = useState<number[]>([100, 100]); // Speed for each player
  const [strokeColors, setStrokeColors] = useState<string[]>(
    new Array(players.length).fill("red")
  ); // Initialize stroke color for each player

  const handleMouseDown = (e: MouseEvent<SVGElement>) => {
    if (activePlayerIndex === null) return;

    const svg = e.currentTarget.closest("svg");
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsMouseDown(true);

    const updatedPlayers = [...players];
    updatedPlayers[activePlayerIndex].startDrawing(x, y); // Start a new path for the active player
    setPlayers(updatedPlayers);
  };

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
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
    if (activePlayerIndex !== null) {
      const updatedPlayers = [...players];
      updatedPlayers[activePlayerIndex].finishDrawing(); // Mark path as finished
      setPlayers(updatedPlayers);
      setActivePlayerIndex(null);
    }
  };

  const handleDoubleClick = (index: number) => {
    const updatedColors = [...strokeColors];
    updatedColors[index] = "darkred"; // Change the stroke color to dark red on double-click
    setStrokeColors(updatedColors);
  };

  const execute = () => {
    const updatedPlayers = players.map((player, index) => {
      if (player.path.length > 0) {
        const xKeyframes = player.path.map((point) => point.x);
        const yKeyframes = player.path.map((point) => point.y);

        const totalDistance = calculateTotalDistance(player.path);
        const speed = speeds[index];
        const duration = totalDistance / speed;

        player.setRouteAnimation(xKeyframes, yKeyframes, duration);
      }
      return player;
    });
    setPlayers(updatedPlayers);
  };

  const calculateTotalDistance = (path: Point[]): number => {
    let totalDistance = 0;
    for (let i = 1; i < path.length; i++) {
      const dx = path[i].x - path[i - 1].x;
      const dy = path[i].y - path[i - 1].y;
      totalDistance += Math.sqrt(dx * dx + dy * dy);
    }
    return totalDistance;
  };

  const resetState = () => {
    const resetPlayers = players.map((player) => {
      // Move player back to origin without clearing the path
      player.setRouteAnimation([player.origin.x], [player.origin.y], 1); // Reset animation back to origin points
      return player;
    });
    setPlayers(resetPlayers);
  };

  const completeReset = () => {
    const resetPlayers = players.map((player) => {
      player.resetState(); // Clear path and move player to origin
      player.setRouteAnimation([player.origin.x], [player.origin.y], 1); // Reset animation back to origin points
      return player;
    });
    setPlayers(resetPlayers);
  };

  const selectPlayer = (e: MouseEvent, index: number) => {
    e.stopPropagation();
    setActivePlayerIndex(index);
  };

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
            {players.map((player, index) => (
              <path
                key={`path-${index}`}
                d={player.getPathD()}
                stroke={strokeColors[index]}
                strokeWidth="4"
                fill="none"
              />
            ))}
            {players.map((player, index) => (
              <motion.circle
                key={index}
                cx={player.position.x}
                cy={player.position.y}
                r="10"
                fill={
                  index === activePlayerIndex ? "rgb(140, 140, 140)" : "black"
                }
                onClick={(e) => selectPlayer(e, index)}
                onDoubleClick={() => handleDoubleClick(index)}
                animate={{
                  cx: player.animation.cx,
                  cy: player.animation.cy,
                }}
                transition={{
                  duration: player.animation.duration || 1,
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
