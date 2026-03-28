import {getAddress, shuffleArray} from "./utils.js";

export function Drawer(nodeMap, config) {
    this.frameId = 0;
    this.startTime = 0;
    this.lastTime = 0;
    this.nodeMap = nodeMap;

    this.ctx = config.ctx;

    this.bgColor = config.bgColor;

    this.nodeSize = config.nodeSize;
    this.nodeColor = config.nodeColor;
    this.nodeSpacing = config.nodeSpacing;

    this.edgeWidth = config.edgeWidth;
    this.edgeColor = config.edgeColor;

    this.traversalStrategy = diagonalTopToBottom;
    this.nodeSequence = Array.from(nodeMap.map.values());
    this.edgeSequence = Array.from(nodeMap.map.values());
    arrangeSequence(this.nodeSequence, this.traversalStrategy);
    arrangeSequence(this.edgeSequence, this.traversalStrategy);

    this.animateNodes = config.animateNodes;
    this.generateInfinitely = config.generateInfinitely;
    this.nodesPerSecond = config.nodesPerSecond;
    this.exhibitTimeMs = config.exhibitTimeMs;
}

Drawer.prototype.drawNodes = function(map) {
    const ctx = this.ctx;

    for (let x = 0; x < map.maxX; x++) {
        for (let y = 0; y < map.maxY; y++) {
            const node = map.getNode(x, y);
            if (!node) continue;
            const p = this.screenPos(node);

            ctx.beginPath();
            ctx.fillStyle = this.nodeColor;
            ctx.arc(p.x, p.y, this.nodeSize, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

Drawer.prototype.drawEdges = function(map) {
    const ctx = this.ctx;

    ctx.lineCap = "round";
    ctx.strokeStyle = this.edgeColor;

    for (let x = 0; x < map.maxX; x++) {
        for (let y = 0; y < map.maxY; y++) {

            const node = map.getNode(x, y)
            if (!node) continue;
            const p1 = this.screenPos(node);

            for (const conn of node.connections) {
                const p2 = this.screenPos(conn);
                if (p1.x !== p2.x && p1.y !== p2.y) {
                    ctx.lineWidth = this.edgeWidth;
                } else {
                    ctx.lineWidth = this.edgeWidth;
                }

                ctx.beginPath()
                ctx.moveTo(p1.x, p1.y)
                ctx.lineTo(p2.x, p2.y)
                ctx.stroke()
            }
        }
    }
}

Drawer.prototype.clear = function() {
    const ctx = this.ctx;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = this.bgColor;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

Drawer.prototype.draw = function() {
    if (this.animateNodes)
        this.frameId = requestAnimationFrame((ts) => {
            this.startTime = ts;
            this.nodeStep(ts);
        });
    else this.frameId = requestAnimationFrame((ts) => {
        this.startTime = ts;
        this.edgeStep(ts);
    });
}

Drawer.prototype.fadeOut = function() {
    this.stop();
    this.frameId = requestAnimationFrame((ts) => {
        this.startTime = ts;
        this.fadeStep(ts);
    });
}

Drawer.prototype.stop = function() {
    cancelAnimationFrame(this.frameId);
}

Drawer.prototype.nodeStep = function (timestamp) {
    let elapsed = (timestamp ?? 0) - this.startTime;

    let nodesToProcess = Math.floor(elapsed / 1000 * this.nodesPerSecond);

    if (!this.animateNodes) {
        this.frameId = requestAnimationFrame((ts) => this.edgeStep(ts));
        return;
    }

    if (nodesToProcess < this.nodeSequence.length) {
        const nodes = this.nodeSequence.slice(0, nodesToProcess);
        const nm = Object.create(this.nodeMap);
        nm.map = new Map(
            nodes.map(node => [getAddress(node.x, node.y), this.nodeMap.getNode(node.x, node.y)])
        );

        this.clear();
        this.drawNodes(nm);

        this.frameId = requestAnimationFrame((ts) => this.nodeStep(ts));
    } else {
        this.startTime = timestamp ?? 0;
        this.lastTime = 0;
        this.frameId = requestAnimationFrame((ts) => this.edgeStep(ts));
    }
}

Drawer.prototype.edgeStep = function (timestamp) {
    let elapsed = (timestamp ?? 0) - this.startTime;
    let delta = elapsed - this.lastTime;

    let nodesToProcess = Math.floor(delta / 1000 * this.nodesPerSecond);
    if (nodesToProcess >= 1) {
        this.lastTime = elapsed;
    }

    if (this.edgeSequence.length > 0) {
        for (let i = 0; i < nodesToProcess; i++) {
            if (this.edgeSequence.length === 0) break;

            const { x: cx, y: cy } = this.edgeSequence.shift();
            const node = this.nodeMap.getNode(cx, cy);
            if (node) {
                node.reachAround(this.nodeMap.getEdgeChance(cx, cy), this.nodeMap.maxX, this.nodeMap.maxY)
            }
        }

        this.clear();
        this.drawEdges(this.nodeMap);
        this.drawNodes(this.nodeMap);

        this.frameId = requestAnimationFrame((ts) => this.edgeStep(ts))
    } else if (this.generateInfinitely) {
        setTimeout(() => {
            this.startTime = timestamp + this.exhibitTimeMs;
            this.frameId = requestAnimationFrame((ts) => {
                this.startTime = ts;
                this.fadeStep(ts);
            })
        }, this.exhibitTimeMs);
    }
}

Drawer.prototype.fadeStep = function (timestamp) {
    const elapsed = (timestamp ?? 0) - this.startTime;

    this.ctx.fillStyle = `hsla(210, 20%, 6%, ${elapsed / 200})`;
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    if (elapsed < 200) {
        this.frameId = requestAnimationFrame((ts) => this.fadeStep(ts));
    } else {
        this.startTime = timestamp ?? 0;
    }
}

Drawer.prototype.screenPos = function(node) {
    const canvasWidth = this.ctx.canvas.width;
    const compositionWidth = (this.nodeMap.maxX - 1) * this.nodeSpacing;
    const offsetX = (canvasWidth - compositionWidth) / 2;

    const canvasHeight = this.ctx.canvas.height;
    const compositionHeight = (this.nodeMap.maxY - 1) * this.nodeSpacing;
    const offsetY = (canvasHeight - compositionHeight) / 2;

    return {
        x: offsetX + node.x * this.nodeSpacing,
        y: offsetY + node.y * this.nodeSpacing
    }
}

function arrangeSequence(sequence, fn) {
    fn(sequence);
}

function original(sequence) {
    return sequence;
}

function diagonalTopToBottom(sequence) {
    sequence.sort((a, b) => (a.x + a.y) - (b.x + b.y));
}

function random(sequence) {
    shuffleArray(sequence);
}
