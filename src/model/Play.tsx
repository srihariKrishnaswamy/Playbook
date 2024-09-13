import Player from "./Player";

export class Play {
    name: string;
    players: Player[];
    baseFormationId: string;

    constructor(name: string, players: Player[], baseFormationId: string) {
        this.name = name;
        this.players = players;
        this.baseFormationId = baseFormationId;
    }
}