import React, { useEffect, useState } from "react";
import { Playbook } from "../../model/Playbook";
import { Play } from "../../model/Play";
import { useNavigate } from "react-router-dom";
import "./PlaysDisplay.css";
import "../../App.css";
import PlayPanel from "../play-panel/PlayPanel";

interface PlaysDisplayProps {
    currentPlaybook: Playbook | undefined;
    setCurrentPlaybook: (playbook: Playbook) => void;
}

const PlaysDisplay: React.FC<PlaysDisplayProps> = ({
    currentPlaybook,
    setCurrentPlaybook
}) => {
    const navigate = useNavigate();
    const [showPlayPanelForCreate, setShowPlayPanelForCreate] = useState<boolean>(true);
    const [currentPlay, setCurrentPlay] = useState<Play>();

    useEffect(() => {
        if (!currentPlaybook) {
            navigate("/");
        }
    }, [])

    const addPlay = () => {
        setCurrentPlay(undefined);
        setShowPlayPanelForCreate(true);
    };

    const selectPlay = (play: Play) => {
        setShowPlayPanelForCreate(false);
        setCurrentPlay(play);
    };

    const backToPlaybooks = () => {
        navigate("/");
    }

    if (!currentPlaybook) {
        return <div></div>;
    }

    return (
        <div className="plays-list-component-container">
            <div className="list-container">
                <div className="title-container">
                    <div className="back-button" onClick={backToPlaybooks}>
                        ←
                    </div>
                    <div className="title">{currentPlaybook.name}</div>
                    <div className="add-play-button" onClick={addPlay}>
                        +
                    </div>
                </div>
                <div className="plays-list-scrollable">
                    <div className="plays-list">
                        {currentPlaybook.plays.map((play: Play) => (
                            <div
                                key={play.name}
                                className={`play-card ${currentPlay === play ? 'selected-play' : ''}`}
                                onClick={() => selectPlay(play)}
                            >
                                <h3>{play.name}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {showPlayPanelForCreate && <PlayPanel playbook={currentPlaybook} play={undefined} setCurrentPlaybook={setCurrentPlaybook} />}
            {currentPlay && <PlayPanel playbook={currentPlaybook} play={currentPlay} setCurrentPlaybook={setCurrentPlaybook} />}
        </div>
    );
};

export default PlaysDisplay;
