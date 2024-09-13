import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Playbook } from '../../model/Playbook';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import './PlaybooksDisplay.css'
import "../../App.css";

interface PlaybooksDisplayProps {
  setCurrentPlaybook(playbook: Playbook) : void;

}

const PlaybooksDisplay: React.FC<PlaybooksDisplayProps> = ({setCurrentPlaybook}) => {
  const [playbooks, setPlaybooks] = useState<Playbook[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Declare an async function inside the useEffect
    const fetchPlaybooks = async () => {
      try {
        const playbooksCollection = collection(db, "Playbook"); // Reference to 'Playbook' collection
        const playbooksSnapshot = await getDocs(playbooksCollection); // Fetch all documents
        const playbooksList = playbooksSnapshot.docs.map(doc => {
          const data = doc.data();
          console.log(data);
          // Assuming 'plays' is part of the document data
          return new Playbook(data.name, data.plays, doc.id);
        });

        setPlaybooks(playbooksList); // Update state with playbooks list
      } catch (error) {
        console.error("Error fetching playbooks:", error);
      }
    };

    fetchPlaybooks(); // Call the async function inside useEffect
    console.log(playbooks)
  }, []); // Empty dependency array to run only once

  const selectPlaybook = (playbook: Playbook) => {
    setCurrentPlaybook(playbook)
    navigate("/play-list");
  } 

  const addPlaybook = () => {

  }

  return (
    <div className="playbooks-list-component-container">
      <div className="playbooks-title-container">
        <div className="title">My Playbooks</div>
        <div
            className="add-playbook-button"
            onClick={addPlaybook}
          > {/* No functionality yet */}
            +
        </div>
      </div>
      <div className="playbooks-list">
        {playbooks.map((playbook) => (
          <div key={playbook.id} className="playbook-card" onClick={() => selectPlaybook(playbook)}>
            <h3>{playbook.name}</h3>
            <p>{playbook.plays.length} plays</p>
          </div>
        ))}
      </div>
    </div>

  );
};

export default PlaybooksDisplay;
