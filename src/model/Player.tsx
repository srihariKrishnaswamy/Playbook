import * as turf from "@turf/turf";
import { Point } from "./Point";
import { RouteAnimation } from "./RouteAnimation";

class Player {
    origin: Point;
    position: Point;
    path: Point[];
    animation: {cx: number[], cy: number[]};

    constructor(originX: number, originY: number) {
        this.origin = { x: originX, y: originY };
        this.position = { x: originX, y: originY };
        this.animation = { cx: [originX], cy: [originY] };
        this.path = [];
    }

    startDrawing(x: number, y: number): void {
        this.path = [{ x, y }];
    }

    addPoint(x: number, y: number): void {
        this.path.push({ x, y });
    }

    finishDrawing(): void {
        this.simplifyAndStraightenPath();
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

    setRouteAnimation(cx: number[], cy: number[]) {
        this.animation = {cx: cx, cy: cy};
    }

    resetState(): void {
        this.position = { x: this.origin.x, y: this.origin.y };
        this.path = [];
    }

    toString(): string {
        let res : string = "";
        for (const point of this.path) {
            res += `${point.x}, ${point.y} |`
        }
        return res;
    }

}

export default Player;
