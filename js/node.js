export function Node(nodeMap, x, y) {
    this.nodeMap = nodeMap;
    this.x = x;
    this.y = y;
    this.connections = [];
}

Node.prototype.connect = function (node) {
    if (this.isConnected(node)) return;

    this.connections.push(node);
    node.connections.push(this);
}

Node.prototype.isConnected = function (node) {
    return this.connections.some(n => n === node);
}

Node.prototype.eNeighbor = function () {
    let x = this.x;

    let i = 0;
    while (x + 1 < this.nodeMap.maxX) {
        if (i >= this.nodeMap.maxStraightSpan) break;

        x += 1;
        let node = this.nodeMap.getNode(x, this.y);
        if (node) return node;
        i += 1;
    }

    return null;
}

Node.prototype.wNeighbor = function () {
    let x = this.x;
    while (x - 1 > 0) {
        x -= 1;
        let node = this.nodeMap.getNode(x, this.y);
        if (node) return node;
    }
    return null;
}

Node.prototype.nNeighbor = function () {
    let y = this.y;

    let i = 0;
    while (y + 1 < this.nodeMap.maxY) {
        if (i >= this.nodeMap.maxStraightSpan) break;

        y += 1;
        let node = this.nodeMap.getNode(this.x, y);
        if (node) return node;
        i += 1;
    }

    return null;
}

Node.prototype.neNeighbor = function () {
    let y = this.y;
    let x = this.x;

    let i = 0;
    while (x + 1 < this.nodeMap.maxX && y + 1 < this.nodeMap.maxY) {
        if (i >= this.nodeMap.maxDiagonalSpan) break;
        x += 1;
        y += 1;
        let node = this.nodeMap.getNode(x, y);
        if (node) return node;
        i += 1;
    }

    return null;
}

Node.prototype.sNeighbor = function () {
    let y = this.y;
    while (y - 1 > 0) {
        y -= 1;
        let node = this.nodeMap.getNode(this.x, y);
        if (node) return node;
    }
    return null;
}

Node.prototype.seNeighbor = function () {
    let y = this.y;
    let x = this.x;

    let i = 0;
    while (x + 1 < this.nodeMap.maxX && y - 1 > 0) {
        if (i >= this.nodeMap.maxDiagonalSpan) break;
        x += 1;
        y -= 1;
        let node = this.nodeMap.getNode(x, y);
        if (node) return node;
        i += 1;
    }

    return null;
}

Node.prototype.reachAround = function(chance) {
    const straightNeighbors = [
        this.nNeighbor(),
        this.eNeighbor(),
    ].filter(Boolean);

    const diagonalNeighbors = [
        this.neNeighbor(),
        this.seNeighbor(),
    ].filter(Boolean);

    for (const node of straightNeighbors) {
        if (this.isConnected(node)) continue;

        const r = Math.random();
        if (r < chance) {
            this.connect(node);
        }
    }

    for (const node of diagonalNeighbors) {
        if (this.isConnected(node)) continue;

        const r = Math.random();
        if (r < chance * this.nodeMap.diagonalEdgeGate) {
            this.connect(node);
        }
    }
}
