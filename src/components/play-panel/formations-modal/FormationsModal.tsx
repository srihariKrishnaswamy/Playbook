import React from "react";
import "./FormationsModal.css"; // For styling, create this CSS file if needed.
import { Formation } from "../../../model/Formation";

interface FormationsModalProps {
  currentFormationIndex: number;
  formations: Formation[];
  onClose: () => void; // Assuming formations are strings, adjust as necessary.
  onSelectFormation: (formationIndex: number) => void;
}

const FormationsModal: React.FC<FormationsModalProps> = ({
  currentFormationIndex,
  formations,
  onClose,
  onSelectFormation,
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          X
        </button>
        <h2>{formations[currentFormationIndex].name}</h2>
        <ul>
          {formations.map((formation, index) => (
            <li
              key={index}
              className="formation-item"
              onClick={() => onSelectFormation(index)}
            >
              {formation.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FormationsModal;
