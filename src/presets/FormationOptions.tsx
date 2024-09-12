import { Formation } from "../model/Formation";
import Player from "../model/Player";
import { Playbook } from "../model/Playbook";

const deuceLeft = new Formation([
    new Player(300, 300, 100), 
    new Player(300, 257, 100), 
    new Player(330, 260, 100), 
    new Player(270, 260, 100),
    new Player(500, 260, 100),
    new Player(200, 260, 100),
    new Player(100, 260, 100)
    ],
    "Deuce left",
    "0"
);

const deuceRight = new Formation([
    new Player(300, 300, 100), 
    new Player(300, 257, 100), 
    new Player(330, 260, 100), 
    new Player(270, 260, 100),
    new Player(500, 260, 100),
    new Player(410, 260, 100),
    new Player(100, 260, 100)
    ],
    "Deuce right",
    "1"
);

export const formationOptions = [deuceLeft, deuceRight];

// Deleting this soon as we have a create playbook thing:

export const temporaryPlaybook = new Playbook("temporaryPlaybook", []);