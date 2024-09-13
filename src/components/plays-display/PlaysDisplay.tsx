import React, { useEffect, useState } from 'react';
import { Playbook } from '../../model/Playbook';
import { Play } from '../../model/Play';
import { useNavigate } from 'react-router-dom';
import "./PlaysDisplay.css";
import "../../App.css";

interface PlaysDisplayProps {
    currentPlaybook: Playbook | undefined;
    setCurrentPlay: (play: Play) => void;
}

const PlaysDisplay: React.FC<PlaysDisplayProps> = ({currentPlaybook, setCurrentPlay}) => {
    const navigate = useNavigate();
    
    const addPlay = () => {

    }

    const selectPlay = (play: Play) => {
        setCurrentPlay(play);
        navigate("/play-panel");
    }

    if (!currentPlaybook) {
        return <div></div>
    }

    return (
        <div className="plays-list-component-container">
            <div className="plays-title-container">
                <div className="title">{currentPlaybook.name}</div>
                <div
                    className="add-play-button"
                    onClick={addPlay}
                > {/* No functionality yet */}
                    + 
                </div>
            </div>
            <div className="plays-list">
                {currentPlaybook.plays.map((play: Play) => (
                    <div key={play.name} className="play-card" onClick={() => selectPlay(play)}>
                        <h3>{play.name}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlaysDisplay;
