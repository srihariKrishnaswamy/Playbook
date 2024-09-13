import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Playbook } from '../../model/Playbook';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import './PlaybooksDisplay.css'
import "../../App.css";
import NewPlaybookModal from './new-playbook-modal/NewPlaybookModal';

interface PlaybooksDisplayProps {
  setCurrentPlaybook(playbook: Playbook) : void;
}

const PlaybooksDisplay: React.FC<PlaybooksDisplayProps> = ({ setCurrentPlaybook }) => {
  const [playbooks, setPlaybooks] = useState<Playbook[]>([]);
  const [showAddPlaybooksModal, setShowAddPlaybooksModal] = useState<boolean>(false);

  const navigate = useNavigate();

  // Extract fetchPlaybooks function so it can be called from anywhere
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

  useEffect(() => {
    fetchPlaybooks(); // Call fetchPlaybooks on component mount
  }, []); // Empty dependency array to run only once

  const selectPlaybook = (playbook: Playbook) => {
    setCurrentPlaybook(playbook);
    navigate("/play-list");
  }

  const closeModal = () => {
    setShowAddPlaybooksModal(false);
  };

  const showModal = () => {
    setShowAddPlaybooksModal(true);
  }

  const isDuplicatePlaybookName = (name: string, playbooks: Playbook[]): boolean => {
    return playbooks.some(playbook => playbook.name === name);
  }

  const createPlaybook = async (name: string) => {
    if (name === "") {
      alert("Enter a playbook name");
      return;
    }

    if (isDuplicatePlaybookName(name, playbooks)) {
      alert("Duplicate playbook name");
      return;
    }

    const newPlaybook = new Playbook(name, []);
    await newPlaybook.save();
    console.log("Playbook created successfully");
    
    await fetchPlaybooks();

    closeModal(); 
  }

  return (
    <div className="playbooks-list-component-container">
      <div className="playbooks-title-container">
        <div className="title">My Playbooks</div>
        <div
          className="add-playbook-button"
          onClick={showModal}
        >
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
      {showAddPlaybooksModal && <NewPlaybookModal onClose={closeModal} createPlaybook={createPlaybook} playbooks={playbooks} />}
    </div>
  );
};

export default PlaybooksDisplay;
