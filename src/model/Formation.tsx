import Player from "./Player";

export class Formation {
    players: Player[];
    name: string;

    constructor(players: Player[], name: string) {
        this.players = players;
        this.name = name;
    }
}