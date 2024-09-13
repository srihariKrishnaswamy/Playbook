import React, { useState } from "react";
import { Playbook } from "../../../model/Playbook";
import "../../../App.css";
import './NewPlaybookModal.css'; 


interface NewPlaybookModalProps {
    onClose: () => void;
    createPlaybook: (name: string, playbooks: Playbook[]) => void;
    playbooks: Playbook[];
}

const NewPlaybookModal: React.FC<NewPlaybookModalProps> = ({
    onClose,
    createPlaybook,
    playbooks,
}) => {
  const [playbookName, setPlaybookName] = useState<string>("");

  const handlePlaybookNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlaybookName(e.target.value);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          X
        </button>
        <h2>New Playbook</h2>
        <input
          type="text"
          placeholder="Playbook name"
          className="name-input"
          value={playbookName}
          onChange={handlePlaybookNameChange}
        />
        <button className="create-playbook-button" onClick={() => createPlaybook(playbookName, playbooks)}>
          Create playbook
        </button>
      </div>
    </div>
  );
};

export default NewPlaybookModal;
