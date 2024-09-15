import { PlayerMetadata } from "./PlayerMetadata";

export class Formation {
    players: PlayerMetadata[];
    name: string;
    id: number;

    constructor(players: PlayerMetadata[], name: string, id: number) {
        this.players = players;
        this.name = name;
        this.id = id;
    }
}