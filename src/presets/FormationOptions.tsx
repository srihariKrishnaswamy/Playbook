import { Formation } from "../model/Formation";
import Player from "../model/Player";
import { Playbook } from "../model/Playbook";

const deuceLeft = new Formation([
    {originX: 300, originY: 300, speed: 100}, 
    {originX: 300, originY: 257, speed: 100}, 
    {originX: 330, originY: 260, speed: 100}, 
    {originX: 270, originY: 260, speed: 100}, 
    {originX: 500, originY: 260, speed: 100}, 
    {originX: 200, originY: 260, speed: 100}, 
    {originX: 100, originY: 260, speed: 100}, 
    ],
    "Deuce left",
    0
);

const deuceRight = new Formation([
    {originX: 300, originY: 300, speed: 100}, 
    {originX: 300, originY: 257, speed: 100}, 
    {originX: 330, originY: 260, speed: 100}, 
    {originX: 270, originY: 260, speed: 100}, 
    {originX: 500, originY: 260, speed: 100}, 
    {originX: 410, originY: 260, speed: 100}, 
    {originX: 100, originY: 260, speed: 100}, 
    ],
    "Deuce right",
    1
);

export const formationOptions = [deuceLeft, deuceRight];