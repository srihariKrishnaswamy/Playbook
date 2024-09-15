import * as turf from "@turf/turf";
import { Point } from "./Point";
import { RouteAnimation } from "./RouteAnimation";

class Player {
    origin: Point;
    position: Point;
    path: Point[];
    animation: { cx: number[]; cy: number[]; duration: number };
    color: string;
    speed: number;
    defaultColor: string = "red";

    constructor(originX: number, originY: number, speed: number = 100, path: Point[] = []) {
        this.origin = { x: originX, y: originY };
        this.position = { x: originX, y: originY };
        this.animation = { cx: [originX], cy: [originY], duration: 2 }; // Default duration
        this.path = path;
        this.speed = speed;
        this.color = this.defaultColor;
    }

    getPathD(): string {
        if (this.path.length === 0) return "";

        const [start, ...points] = this.path;
        return `M${start.x},${start.y} ${points
            .map((point) => `L${point.x},${point.y}`)
            .join(" ")}`;
    }

    getPath(): RouteAnimation {
        return {
            cx: this.path.map((point) => point.x),
            cy: this.path.map((point) => point.y),
        };
    }

    startDrawing(x: number, y: number): void {
        this.path = [{ x, y }];
    }

    addPoint(x: number, y: number): void {
        this.path.push({ x, y });
    }

    finishDrawing(): void {
        if (this.path.length > 1) {
            this.simplifyAndStraightenPath();
        }
    }

    private simplifyAndStraightenPath(): void {
        if (this.path.length > 1) {
            const turfPoints = this.path.map((point) => [point.x, point.y]);
            const line = turf.lineString(turfPoints);
            const simplifiedLine = turf.simplify(line, {
                tolerance: 1,
                highQuality: true,
            });
            this.path = simplifiedLine.geometry.coordinates.map(([x, y]) => ({
                x,
                y,
            }));
        }
    }


    setRouteAnimation(cx: number[], cy: number[], duration: number) {
        this.animation = { cx, cy, duration };
    }

    calculateDuration(totalDistance: number): number {
        return totalDistance / this.speed;
    }

    resetState(): void {
        this.position = { x: this.origin.x, y: this.origin.y };
        this.path = [];
        this.animation = { cx: [this.origin.x], cy: [this.origin.y], duration: 1 }; // Reset animation with default duration
        this.color = this.defaultColor;
    }

    setSpeed(newSpeed: number): void {
        this.speed = newSpeed;
    }

    toString(): string {
        let res: string = "";
        for (const point of this.path) {
            res += `${point.x}, ${point.y} | `;
        }
        return res;
    }
}

export default Player;
