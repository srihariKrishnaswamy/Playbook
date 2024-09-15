import Player from "./Player";

export class Play {
    name: string;
    players: Player[];
    baseFormationId: number;

    constructor(name: string, players: Player[], baseFormationId: number) {
        this.name = name;
        this.players = players;
        this.baseFormationId = baseFormationId;
    }

    setPlayers(players: Player[]) {
        this.players = players;
    }

    setName(name: string) {
        this.name = name;
    }

    setBaseFormationId(id: number) {
        this.baseFormationId = id;
    }

    toString() {
        return `${this.name}, ${this.players.length} players, base formation id ${this.baseFormationId}`;
    }
}