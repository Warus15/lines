import { Coords } from "../interfaces/Coords";
import { Node } from "../interfaces/Node";
import { BoardArray } from "../interfaces/BoardArray";

import { highlightCurrentTile } from "./Decorators";
import { Settings } from "../Settings";

export class PathFinder {
  private boardRepresentation: BoardArray;
  public nodeArray: Node[][] = new Array<Node[]>();

  // private active: boolean = false;

  private startNode: Node;
  private endNode: Node;
  private readonly distanceFromStart: number = 0;

  public pathFound: boolean;
  private path: Node[] = new Array<Node>();

  constructor(boardRepresentation: BoardArray) {
    this.boardRepresentation = boardRepresentation;

    this.initiateNodeArray();
  }

  private initiateNodeArray(): void {
    for (let i = 0; i < Settings.BoardSize; i++) this.nodeArray[i] = [];

    for (let i = 0; i < Settings.BoardSize; i++)
      for (let j = 0; j < Settings.BoardSize; j++) {
        if (!this.boardRepresentation[i][j].occupied) {
          let node: Node = {
            x: j,
            y: i,
            path: null,
            distanceFromStart: 999,
            visited: false,
            type: "NODE"
          };

          this.nodeArray[i][j] = node;
        } else this.nodeArray[i][j] = null;
      }
  }

  private resetNodeArray(): void {
    this.nodeArray = null;
    this.nodeArray = new Array<Node[]>();
  }

  public updateNodeArray(): void {
    this.resetNodeArray();
    this.initiateNodeArray();

    // console.table(this.nodeArray);
  }

  public findPath(startCoords: Coords, endCoords: Coords): void {
    if (this.nodeArray[endCoords.y][endCoords.x]) {
      let startNode: Node = {
        x: startCoords.x,
        y: startCoords.y,
        path: null,
        distanceFromStart: 999,
        visited: false,
        type: "START"
      };

      this.startNode = startNode;
      this.nodeArray[startCoords.y][startCoords.x] = startNode;
      this.endNode = this.nodeArray[endCoords.y][endCoords.x];

      if (this.pathFound) this.reset(false);

      let currentCoords: Coords = {
        x: this.startNode.x,
        y: this.startNode.y
      };

      let previousCoords: Coords = {
        x: this.startNode.x,
        y: this.startNode.y
      };

      this.calculateNodeDistance(
        currentCoords,
        previousCoords,
        this.distanceFromStart
      );

      if (this.endNode.path != null) {
        this.pathFound = true;

        this.getPath();

        this.highlightPath();
      }
    } else this.reset(false);
  }

  private calculateNodeDistance(
    currentCoords: Coords,
    previousCoords: Coords,
    distanceFromStart: number
  ): void {
    let distance = distanceFromStart;

    let x: number = currentCoords.x;
    let y: number = currentCoords.y;

    this.nodeArray[y][x].visited = true;

    if (distance < this.nodeArray[y][x].distanceFromStart)
      this.nodeArray[y][x].distanceFromStart = distance;

    this.nodeArray[y][x].path =
      this.nodeArray[previousCoords.y][previousCoords.x];

    distance++;

    try {
      if (
        !this.nodeArray[y - 1][x].visited ||
        (this.nodeArray[y - 1][x].visited &&
          this.nodeArray[y - 1][x].distanceFromStart > distance)
      )
        this.calculateNodeDistance(
          { x: x, y: y - 1 },
          { x: x, y: y },
          distance
        );
    } catch (error) {}

    try {
      if (
        !this.nodeArray[y + 1][x].visited ||
        (this.nodeArray[y + 1][x].visited &&
          this.nodeArray[y + 1][x].distanceFromStart > distance)
      )
        this.calculateNodeDistance(
          { x: x, y: y + 1 },
          { x: x, y: y },
          distance
        );
    } catch (error) {}

    try {
      if (
        !this.nodeArray[y][x - 1].visited ||
        (this.nodeArray[y][x - 1].visited &&
          this.nodeArray[y][x - 1].distanceFromStart > distance)
      )
        this.calculateNodeDistance(
          { x: x - 1, y: y },
          { x: x, y: y },
          distance
        );
    } catch (error) {}

    try {
      if (
        !this.nodeArray[y][x + 1].visited ||
        (this.nodeArray[y][x + 1].visited &&
          this.nodeArray[y][x + 1].distanceFromStart > distance)
      )
        this.calculateNodeDistance(
          { x: x + 1, y: y },
          { x: x, y: y },
          distance
        );
    } catch (error) {}
  }

  private getPath(): void {
    let previusNode: Node = this.endNode;

    do {
      this.path.unshift(previusNode);
      previusNode = previusNode.path;
    } while (previusNode.type != "START");

    this.path.unshift(this.nodeArray[this.startNode.y][this.startNode.x]);
  }

  @highlightCurrentTile
  private highlightPath(): void {
    this.path.forEach(node => {
      this.boardRepresentation[node.y][node.x].tile.highlightTile();
    });
  }

  public markPath(): void {
    this.path.forEach(node => {
      this.boardRepresentation[node.y][node.x].tile.markPath();
    });
  }

  public reset(clicked: boolean): void {
    if (!clicked) this.clearHighlight();
    this.pathFound = false;
    this.path = null;
    this.path = new Array<Node>();
  }

  private clearHighlight(): void {
    this.path.forEach(node => {
      this.boardRepresentation[node.y][node.x].tile.clearHighlight();
    });
  }
}
