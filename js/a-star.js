import {NodeMap} from './nodeMap.js';
import {Drawer} from './drawer.js';
import {randRange} from './utils.js';

export function init() {
  const canvas = document.getElementById("graph");
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;

  const WIDTH = canvas.width;
  const HEIGHT = canvas.height;
  let NODE_SPACING = 28 * dpr * Math.sqrt(WIDTH / 480);
  let NODES_X = Math.floor(WIDTH / NODE_SPACING);
  let NODES_Y = Math.floor(HEIGHT / NODE_SPACING);
  while (WIDTH / NODE_SPACING - NODES_X > 0.1) {
    NODE_SPACING -= 0.1;
    NODES_X = Math.floor(WIDTH / NODE_SPACING);
    NODES_Y = Math.floor(HEIGHT / NODE_SPACING);
  }

  const NODE_SIZE = 4 * Math.sqrt(Math.sqrt(WIDTH / 720));
  const EDGE_WIDTH = 1.5 * Math.sqrt(Math.sqrt(WIDTH / 480));

  const NODE_CHANCE = randRange(0.05, 0.7);
  const BASE_EDGE_CHANCE = randRange(0.4, 0.8);
  const DIAGONAL_EDGE_GATE = 0.5;
  const MAX_STRAIGHT_SPAN = randRange(4, 10);
  const MAX_DIAGONAL_SPAN = randRange(2, 4);

  const MAX_X = NODES_X;
  const MAX_Y = NODES_Y;

  const BG_COLOR = "hsla(210, 20%, 6%, 1)";
  const NODE_COLOR = "rgba(0,0,225,1)";
  const EDGE_COLOR = "rgba(0,0,225,0.75)";

  const NODES_PER_SECOND = 300;
  const ANIMATE_NODES = true;
  const GENERATE_INFINITELY = false;
  const EXHIBIT_TIME_MS = 3000;

  const config = {
    ctx,

    width: WIDTH,
    height: HEIGHT,
    nodeSpacing: NODE_SPACING,
    nodesX: NODES_X,
    nodesY: NODES_Y,

    nodeSize: NODE_SIZE * dpr,
    edgeWidth: EDGE_WIDTH * dpr,

    nodeChance: NODE_CHANCE,
    edgeChance: BASE_EDGE_CHANCE,
    diagonalEdgeGate: DIAGONAL_EDGE_GATE,
    maxStraightSpan: MAX_STRAIGHT_SPAN,
    maxDiagonalSpan: MAX_DIAGONAL_SPAN,
    // traversalStrategy: TRAVERSAL_STRATEGY,

    maxX: MAX_X,
    maxY: MAX_Y,

    bgColor: BG_COLOR,
    nodeColor: NODE_COLOR,
    edgeColor: EDGE_COLOR,

    nodesPerSecond: NODES_PER_SECOND,
    animateNodes: ANIMATE_NODES,
    generateInfinitely: GENERATE_INFINITELY,
    exhibitTimeMs: EXHIBIT_TIME_MS,
  };

  const nodeMap = new NodeMap(config);
  const drawer = new Drawer(nodeMap, config);
  drawer.draw();

  return drawer;
}
