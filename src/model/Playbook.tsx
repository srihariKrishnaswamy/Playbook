import { Play } from "./Play";

export class Playbook {
    name: string;
    plays: Play[];
    // FUTURE: Add ownerID & things like that when we get to making accounts

    constructor(name: string, plays: Play[]) {
        this.name = name;
        this.plays = plays;
    }

    addPlay(play: Play) {
        this.plays.push(play);
    }

    save() {
        localStorage.setItem("playbook", JSON.stringify(this));
        console.log(localStorage.getItem("playbook"));
    }

}