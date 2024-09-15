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
    const [currentPlayId, setCurrentPlayId] = useState<number>(-1);


    useEffect(() => {
        if (!currentPlaybook) {
            navigate("/");
        }
    }, [])

    const addPlay = () => {
        setCurrentPlayId(-1);
    };

    const selectPlay = (play: Play, index: number) => {
        setCurrentPlayId(index);
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
                        {currentPlaybook.plays.map((play: Play, index: number) => (
                            <div
                                key={play.name}
                                className={`play-card ${currentPlayId === index ? 'selected-play' : ''}`}
                                onClick={() => selectPlay(play, index)}
                            >
                                <h3>{play.name}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {currentPlayId === -1 ?  (
                    <PlayPanel playbook={currentPlaybook} play={new Play("", [], 0)} setCurrentPlaybook={setCurrentPlaybook} playId={currentPlayId}/>
                ) : (
                    <PlayPanel playbook={currentPlaybook} play={currentPlaybook.plays[currentPlayId]} setCurrentPlaybook={setCurrentPlaybook} playId={currentPlayId}/>
                )
            }
        </div>
    );
};

export default PlaysDisplay;
