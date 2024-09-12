import Player from "./Player";

export class Formation {
    players: Player[];
    name: string;
    id: string;

    constructor(players: Player[], name: string, id: string) {
        this.players = players;
        this.name = name;
        this.id = id;
    }
}