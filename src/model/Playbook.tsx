import { Play } from "./Play";
import { db } from '../config/FirebaseConfig';
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";

export class Playbook {
    name: string;
    plays: Play[];
    id: string | undefined;
    // FUTURE: Add ownerID & things like that when we get to making accounts

    constructor(name: string, plays: Play[], id: string | undefined = undefined) {
        this.name = name;
        this.plays = plays;
        this.id = id;
    }

    addPlay(play: Play) {
        this.plays.push(play);
    }

    async save() {
        if (this.id) { // update the playbook if it already exists in DB
            const playDocRef = doc(db, "Playbook", this.id);

            try {
                await updateDoc(playDocRef, {
                    name: this.name,
                    plays: JSON.parse(JSON.stringify(this.plays))
                });
                console.log("Playbook updated successfully");
            } catch (error) {
                console.error("Error updating Playbook:", error);
            }
        } else { // if we haven't saved this playbook before, create a new doc for it
            try {
                const docRef = await addDoc(collection(db, "Playbook"), {
                    name: this.name,
                    plays: JSON.parse(JSON.stringify(this.plays))
                });
                this.id = docRef.id;
                console.log("Document written with ID: ", docRef.id);
            } catch (error) {
                console.error("Error adding document: ", error);
            }
        }
    }

    updatePlay(index: number, play: Play) {
        this.plays[index] = play;
    }
}