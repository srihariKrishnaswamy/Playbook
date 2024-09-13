import React, { useState, MouseEvent, useEffect } from "react";
import FormationsModal from "./formations-modal/FormationsModal";
import { motion } from "framer-motion";
import Player from "../../model/Player";
import {
  formationOptions,
} from "../../presets/FormationOptions";
import { Play } from "../../model/Play";
import { Playbook } from "../../model/Playbook";
import lodash from "lodash";
import "../../App.css";
import "./PlayPanel.css";

interface PlayPanelProps { // gotta figure out how to use this play object, it doesnt do anything for now
  play: Play | undefined;
  playbook: Playbook | undefined;
}

const PlayPanel: React.FC<PlayPanelProps> = ({play, playbook}) => {
  const [playName, setPlayName] = useState<string>("");
  const [currentFormationIndex, setCurrentFormationIndex] = useState<number>(0);
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
  const [activePlayerIndex, setActivePlayerIndex] = useState<number | null>(
    null
  );
  const [players, setPlayers] = useState<Player[]>(
    formationOptions[currentFormationIndex].players
  );
  const [strokeColors, setStrokeColors] = useState<string[]>(
    players.map((player) => player.color)
  );
  const [addPlayerOnClick, setAddPlayerOnClick] = useState<boolean>(false);
  const [formationsModalOpen, setFormationsModalOpen] =
    useState<boolean>(false);

  // When we change formations, we also erase routes.
  useEffect(() => {
    completeReset();
    setPlayers(formationOptions[currentFormationIndex].players);
  }, [currentFormationIndex]);

  const addPlayer = (e: MouseEvent<SVGElement>, svg: SVGSVGElement) => {
    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newPlayer = new Player(x, y, 100);
    setPlayers([...players, newPlayer]);
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

    if (
      clickedOnPlayerIndex !== -1 &&
      clickedOnPlayerIndex !== activePlayerIndex
    ) {
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

  const execute = () => {
    const updatedPlayers = players.map((player) => {
      if (player.path.length > 1) {
        const totalDistance = player.path.reduce((acc, point, index, path) => {
          if (index === 0) return acc;
          const dx = point.x - path[index - 1].x;
          const dy = point.y - path[index - 1].y;
          return acc + Math.sqrt(dx * dx + dy * dy);
        }, 0);

        const duration = player.calculateDuration(totalDistance);
        const { cx, cy } = player.getPath();
        player.setRouteAnimation(cx, cy, duration);
      }
      return player;
    });
    setPlayers(updatedPlayers);
  };

  const resetState = () => {
    const resetPlayers = players.map((player) => {
      player.setRouteAnimation([player.origin.x], [player.origin.y], 1);
      return player;
    });
    setPlayers(resetPlayers);
  };

  const completeReset = () => {
    const resetPlayers = players.map((player) => {
      player.resetState();
      player.setRouteAnimation([player.origin.x], [player.origin.y], 1);
      return player;
    });
    setPlayers(resetPlayers);

    setStrokeColors(resetPlayers.map((player) => player.color));
  };

  const selectPlayer = (e: MouseEvent, index: number) => {
    e.stopPropagation();
    setActivePlayerIndex(index);
  };

  const handleSpeedChange = (index: number, newSpeed: number) => {
    const updatedPlayers = [...players];
    updatedPlayers[index].setSpeed(newSpeed);
    setPlayers(updatedPlayers);
  };

  const handleAddPlayerButtonClick = (e: MouseEvent) => {
    e.stopPropagation();
    setAddPlayerOnClick(true);
    console.log("adding player");
  };

  const openFormationsModal = () => {
    setFormationsModalOpen(true);
  };

  const closeModal = () => {
    setFormationsModalOpen(false);
  };

  const handleFormationSelect = (formationIndex: number) => {
    console.log("Selected formation: ", formationOptions[formationIndex].name);
    setCurrentFormationIndex(formationIndex);
  };

  const handlePlayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayName(e.target.value);
  };

  const savePlay = () => {
    if (playName === "") {
      alert("Specify a play name");
      return;
    }
    if (!playbook) {
      alert("No playbook selected");
      return;
    }
    const play = new Play(
      playName,
      lodash.cloneDeep(players),
      formationOptions[currentFormationIndex].id
    );
    playbook.addPlay(play);
    playbook.save();
  };

  return (
    <div className="component-container">
      <div className="play-panel-container">
        <input
          type="text"
          placeholder="Play name"
          className="name-input"
          value={playName}
          onChange={handlePlayNameChange}
        />
        <div className="svg-container">
          <div className="formation-button" onClick={openFormationsModal}>
            Formations
          </div>
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
                onDoubleClick={() => {
                  const updatedColors = [...strokeColors];
                  updatedColors[index] = "yellow";
                  setStrokeColors(updatedColors);
                }}
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
            <button onClick={savePlay} className="button" id="save-button">
              Save Play
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
                value={players[index].speed}
                onChange={(e) =>
                  handleSpeedChange(index, Number(e.target.value))
                }
                className="slider"
              />
              <span>{players[index].speed} px/sec</span>
            </div>
          ))}
        </div>
        {formationsModalOpen && (
          <FormationsModal
            currentFormationIndex={currentFormationIndex}
            formations={formationOptions}
            onClose={closeModal}
            onSelectFormation={handleFormationSelect}
          />
        )}
      </div>
    </div>
  );
}

export default PlayPanel;
