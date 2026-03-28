import { Node } from './node.js';
import {getAddress} from "./utils.js";

export function NodeMap(config) {
    this.nodeChance = config.nodeChance;
    this.edgeChance = config.edgeChance;
    this.diagonalEdgeGate = config.diagonalEdgeGate;
    this.maxStraightSpan = config.maxStraightSpan;
    this.maxDiagonalSpan = config.maxDiagonalSpan;

    this.maxX = config.maxX;
    this.maxY = config.maxY;
    this.map = new Map();

    this.init(this.nodeChance);
}

NodeMap.prototype.init = function (chance) {
    for (let x = 0; x < this.maxX; x++) {
        for (let y = 0; y < this.maxY; y++) {
            const r = Math.random();
            if (r < chance) {
                this.addNode(new Node(this, x, y));
            }
        }
    }
}

NodeMap.prototype.addNode = function (node) {
    this.map.set(getAddress(node.x, node.y), node);
}

NodeMap.prototype.getNode = function (x, y) {
    return this.map.get(getAddress(x, y));
}

NodeMap.prototype.connect = function () {
    for (let x = 0; x < this.maxX; x++) {
        for (let y = 0; y < this.maxY; y++) {
            const node = this.getNode(x, y);
            node.reachAround(0.5);
        }
    }
}

NodeMap.prototype.getEdgeChance = function (cx, cy) {
    const gradX = Math.max(0.25 * Math.sin(1 * Math.PI * (cx / this.maxX)), 0) + 0.1;
    const gradY = Math.max(0.25 * Math.sin(2 * Math.PI * (cy / this.maxY)), 0) + 0.05;

    return this.edgeChance;
}
