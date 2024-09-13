import React, { useEffect, useState } from "react";
import { Playbook } from "../../model/Playbook";
import { Play } from "../../model/Play";
import { useNavigate } from "react-router-dom";
import "./PlaysDisplay.css";
import "../../App.css";

interface PlaysDisplayProps {
    currentPlaybook: Playbook | undefined;
    setCurrentPlay: (play: Play) => void;
}

const PlaysDisplay: React.FC<PlaysDisplayProps> = ({
    currentPlaybook,
    setCurrentPlay,
}) => {
    const navigate = useNavigate();

    const addPlay = () => {
        navigate("/play-panel");
    };

    const selectPlay = (play: Play) => {
        setCurrentPlay(play);
        navigate("/play-panel");
    };

    const backToPlaybooks = () => {
        navigate("/");
    }

    if (!currentPlaybook) {
        return <div></div>;
    }

    return (
        <div className="plays-list-component-container">
            <div className="title-container">
                <div className="back-button" onClick={backToPlaybooks}>
                   ←
                </div>
                <div className="title">{currentPlaybook.name}</div>
                <div className="add-play-button" onClick={addPlay}>
                    +
                </div>
            </div>
            <div className="plays-list">
                {currentPlaybook.plays.map((play: Play) => (
                    <div
                        key={play.name}
                        className="play-card"
                        onClick={() => selectPlay(play)}
                    >
                        <h3>{play.name}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlaysDisplay;
