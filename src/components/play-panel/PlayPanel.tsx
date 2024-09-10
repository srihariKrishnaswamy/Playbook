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
    new Player(300, 257),
    new Player(300, 300),
  ]);

  const [speeds, setSpeeds] = useState<number[]>([100, 100]);
  const [strokeColors, setStrokeColors] = useState<string[]>(
    players.map((player) => player.color)
  );
  const [addPlayerOnClick, setAddPlayerOnClick] = useState<boolean>(false);

  const addPlayer = (e: MouseEvent<SVGElement>, svg: SVGSVGElement) => {
    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newPlayer = new Player(x, y);
    setPlayers([...players, newPlayer]);
    setSpeeds([...speeds, 100]);
    setAddPlayerOnClick(false);
    setStrokeColors([...strokeColors, newPlayer.color]);

    console.log("Player added at X: " + x + " Y: " + y);
  };

  const startDrawingRoute = (e: MouseEvent<SVGElement>, svg: SVGSVGElement) => {
    if (activePlayerIndex === null) return;

    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsMouseDown(true);

    const updatedPlayers = [...players];
    updatedPlayers[activePlayerIndex].startDrawing(x, y);
    setPlayers(updatedPlayers);
  };

  const handleMouseDown = (e: MouseEvent<SVGElement>) => {
    const svg = e.currentTarget.closest("svg");
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if the click is on any player
    const clickedOnPlayerIndex = players.findIndex((player, index) => {
      const playerRadius = 10; // radius of player circle
      const distance = Math.sqrt(
        (x - player.position.x) ** 2 + (y - player.position.y) ** 2
      );
      return distance <= playerRadius;
    });

    if (clickedOnPlayerIndex !== -1 && clickedOnPlayerIndex !== activePlayerIndex) {
      return;
    }

    // If addPlayerOnClick is true, add a player instead of drawing
    if (addPlayerOnClick) {
      addPlayer(e, svg);
    } else {
      startDrawingRoute(e, svg);
    }
  };

  const handleMouseMove = (e: MouseEvent<SVGElement>) => {
    if (!isMouseDown || activePlayerIndex === null) return;

    const svg = e.currentTarget.closest("svg");
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const updatedPlayers = [...players];
    updatedPlayers[activePlayerIndex].addPoint(x, y);
    setPlayers(updatedPlayers);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
    if (activePlayerIndex !== null) {
      const updatedPlayers = [...players];
      updatedPlayers[activePlayerIndex].finishDrawing();
      setPlayers(updatedPlayers);
      setActivePlayerIndex(null);
    }
  };

  const handleDoubleClick = (index: number) => {
    const updatedColors = [...strokeColors];
    updatedColors[index] = "darkred";
    setStrokeColors(updatedColors);
  };

  const execute = () => {
    const updatedPlayers = players.map((player, index) => {
      if (player.path.length > 1) {
        const xKeyframes = player.path.map((point) => point.x);
        const yKeyframes = player.path.map((point) => point.y);

        const totalDistance = calculateTotalDistance(player.path);
        const speed = speeds[index];
        const duration = totalDistance / speed;

        player.setRouteAnimation(xKeyframes, yKeyframes, duration);

        console.log("Player " + index + "Path: " + player.toString());
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

    // Reset stroke colors to red for all players
    setStrokeColors(resetPlayers.map((player) => player.color));
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

  const handleAddPlayerButtonClick = (e: MouseEvent) => {
    e.stopPropagation();
    setAddPlayerOnClick(true);
    console.log("adding player");
  };

  return (
    <div className="component-container">
      <div className="play-panel-container">
        <div className="svg-container">
          <div
            className="plus-button"
            onClick={(e) => handleAddPlayerButtonClick(e)}
          >
            +
          </div>
          {addPlayerOnClick && <div className="overlay"></div>}
          <svg
            width="600"
            height="400"
            className="svg-drawing-area"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <line
              x1="33"
              y1="245"
              x2="565"
              y2="245"
              stroke="navy"
              strokeWidth="5"
            />

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
                fill={index === activePlayerIndex ? "yellow" : "black"}
                onClick={(e) => selectPlayer(e, index)}
                onDoubleClick={() => handleDoubleClick(index)}
                animate={{
                  cx: player.animation.cx,
                  cy: player.animation.cy,
                }}
                className="player-circle"
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
            <button
              onClick={completeReset}
              className="button"
              id="reset-button"
            >
              Complete Reset
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
                className="slider"
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
