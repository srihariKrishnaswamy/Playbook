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
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import { PlayerMetadata } from "../../model/PlayerMetadata";
import "../../App.css";
import "./PlayPanel.css";

interface PlayPanelProps {
  play: Play;
  playbook: Playbook;
  playId: number;
  setCurrentPlaybook: (playbook: Playbook) => void;
}

const PlayPanel: React.FC<PlayPanelProps> = ({ play, playbook, playId, setCurrentPlaybook }) => {
  // State that will get saved to DB eventually if we save this play
  const [playName, setPlayName] = useState<string>("");
  const [players, setPlayers] = useState<Player[]>([]);

  // Utility state for this component to work
  const [currentFormationIndex, setCurrentFormationIndex] = useState<number>(-1);
  const [formationsModalOpen, setFormationsModalOpen] = useState<boolean>(false);
  const [strokeColors, setStrokeColors] = useState<string[]>([]);
  const [activePlayerIndex, setActivePlayerIndex] = useState<number>(-1);
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);

  const totalReset = () => {
    setPlayName("");
    setPlayers([]);
    setCurrentFormationIndex(-1);
    setFormationsModalOpen(false);
    setStrokeColors([]);
    setActivePlayerIndex(-1);
    setIsMouseDown(false);
  }

  // Reset the component when the play prop changes
  useEffect(() => {
    totalReset();
    setPlayName(play.name);

    const playersWithMethods = play.players.map(player =>
      new Player(player.origin.x, player.origin.y, player.speed, player.path)
    );

    setPlayers(playersWithMethods);
    setStrokeColors(playersWithMethods.map((player) => player.color));
    setCurrentFormationIndex(play.baseFormationId); 
  }, [play]);

  const handlePlayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayName(e.target.value);
  };

  const openFormationsModal = () => {
    setFormationsModalOpen(true);
  };

  const selectPlayer = (e: MouseEvent, index: number) => {
    e.stopPropagation();
    setActivePlayerIndex(index);
  };

  const startDrawingRoute = (e: MouseEvent<SVGElement>, svg: SVGSVGElement) => {
    if (activePlayerIndex === -1) return;

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
    startDrawingRoute(e, svg);
  };

  const handleMouseMove = (e: MouseEvent<SVGElement>) => {
    if (!isMouseDown || activePlayerIndex === -1) return;

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
    if (activePlayerIndex !== -1) {
      const updatedPlayers = [...players];
      updatedPlayers[activePlayerIndex].finishDrawing();
      setPlayers(updatedPlayers);
      setActivePlayerIndex(-1);
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
    setPlayers([...updatedPlayers]);
  };

  const backtoLOS = () => {
    const resetPlayers = players.map((player) => {
      player.setRouteAnimation([player.origin.x], [player.origin.y], 1);
      return player;
    });
    setPlayers(resetPlayers);
  };

  const isDuplicatePlayNameExcludingIndex = (playName: string, playbook: Playbook, excludeIndex: number): boolean => {
    for (let i = 0; i < playbook.plays.length; i++) {
      const play = playbook.plays[i];
      if (play.name === playName && i !== excludeIndex) return true;
    }
    return false;
  }

  const updateLocalPlaybook = async () => {
    if (!playbook) return;
    const id = playbook.id;
    if (!id) return;

    try {
      const playbookRef = doc(db, "Playbook", id);
      const playbookSnapshot = await getDoc(playbookRef);

      if (playbookSnapshot.exists()) {
        const playbookData = playbookSnapshot.data();
        const fetchedPlaybook = new Playbook(playbookData.name, playbookData.plays, id);
        setCurrentPlaybook(fetchedPlaybook);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching playbook:", error);
    }
  }

  const savePlay = async () => {
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

    if (isDuplicatePlayNameExcludingIndex(playName, playbook, playId)) {
      alert("Duplicate Play Name");
      return;
    }

    if (playId === -1) { // we're making a new play
      playbook.addPlay(play);
    } else { // we're modifying an existing play
      playbook.updatePlay(playId, play);
    }
    await playbook.save();
    await updateLocalPlaybook();
    totalReset();
    alert("Play saved successfully");
  };

  const handleSpeedChange = (index: number, newSpeed: number) => {
    const updatedPlayers = [...players];
    updatedPlayers[index].setSpeed(newSpeed);
    setPlayers(updatedPlayers);
  };

  const closeFormationsModal = () => {
    setFormationsModalOpen(false);
  };

  const handleFormationSelect = (formationIndex: number) => {
    console.log("Selected formation: ", formationOptions[formationIndex].name);
    setCurrentFormationIndex(formationIndex);
    const newPlayers = formationOptions[formationIndex].players.map((playerMetadata: PlayerMetadata) => new Player(playerMetadata.originX, playerMetadata.originY, playerMetadata.speed));
    setPlayers(newPlayers);
    setStrokeColors(newPlayers.map((player) => player.color));
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

            {players.map((player: Player, index) => (
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
            <button onClick={backtoLOS} className="button" id="reset-button">
              Come back
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
            onClose={closeFormationsModal}
            onSelectFormation={handleFormationSelect}
          />
        )}
      </div>
    </div>
  );
};

export default PlayPanel;