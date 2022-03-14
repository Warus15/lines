import { Tile } from "./Tile";
import { Settings } from "../Settings";
import { Preview } from "./Preview";
import { Coords } from "../interfaces/Coords";
import { Orb } from "./Orb";
import { SquareField } from "../interfaces/SquareField";
import { PathFinder } from "./PathFinder";
import { Popper } from "./Popper";
import { Time } from "../interfaces/Time";

import { BoardArray } from "../interfaces/BoardArray";

export class Game {
   private gameField = document.getElementById("gameField") as HTMLDivElement;

   private readonly boardSize: number = Settings.BoardSize;

   private preview: Preview;

   private currentsCoords: Coords[];
   private nextOrbs: Orb[];

   private boardRepresentation: BoardArray = new Array<SquareField[]>();
   private selectedOrb: Orb;

   private active: boolean = true;

   private timer: number = 0;
   private timerInterval: any;
   private timerDisplay = document.getElementById("timer") as HTMLElement;

   private PathFinder: PathFinder;

   private Popper: Popper;

   private GameOver: boolean = false;

   constructor() {
      this.initiateGame();
   }

   private initiateGame(): void {
      this.initializeBoardRepresentation();
      this.PathFinder = new PathFinder(this.boardRepresentation);
      this.Popper = new Popper(this.boardRepresentation);

      this.getNextOrbs();
      this.getCoords();

      this.initializeGameField();
      this.initializePreview();
      this.initializeTimer();

      this.placeOrbs();
      this.getNextOrbs();
      this.preview.setPreview(this.nextOrbs);
   }

   private initializeBoardRepresentation(): void {
      for (let i = 0; i < this.boardSize; i++) this.boardRepresentation[i] = [];

      for (let i = 0; i < this.boardSize; i++)
         for (let j = 0; j < this.boardSize; j++) {
            this.boardRepresentation[i][j] = {
               occupied: false,
               colorID: null,
               tile: null,
               orb: null,
               position: {
                  x: j,
                  y: i
               }
            };
         }
   }

   private initializePreview(): void {
      this.preview = new Preview();
   }

   private initializeTimer() {
      this.timerInterval = setInterval(() => {
         this.timer++;

         const time = Settings.convertTime(this.timer);

         this.timerDisplay.innerText = `${time.minutes} m ${time.seconds} s`;
      }, 1000);
   }

   private getCoords(): void {
      if (!this.GameOver) {
         let nextCoords = Settings.getCoords(this.boardRepresentation);
         this.currentsCoords = nextCoords.coords;
      }
   }

   private checkGameOver = (): void => {
      if (Settings.checkGameOver(this.boardRepresentation)) {
         this.GameOver = true;

         clearInterval(this.timerInterval);

         const time: Time = Settings.convertTime(this.timer);

         const points = this.Popper.getPoints();
         window.alert(
            `Game Over! You've scored ${points} points! You've been playing for ${time.minutes} minutes ${time.seconds} seconds.`
         );

         this.preview.clearPreview();
      }
   };

   private getGameOver = (): boolean => {
      return this.GameOver;
   };

   private getNextOrbs(): void {
      const NextOrbs: Orb[] = new Array();

      for (let i = 0; i < 3; i++) {
         const colorData = Settings.getRandomColor();

         let orb = new Orb(
            colorData.color,
            colorData.colorID,
            null,
            null,
            this.PathFinder,
            this.setCurrentOrb,
            this.hasSelectedOrb,
            this.getSelectedOrb,
            this.getActive,
            this.getGameOver
         );

         NextOrbs.push(orb);
      }

      this.nextOrbs = NextOrbs;
   }

   private initializeGameField(): void {
      for (let i = 0; i < this.boardSize; i++) {
         let newRow: HTMLDivElement = document.createElement("div");
         newRow.className = "row";

         for (let j = 0; j < this.boardSize; j++) {
            let tile: Tile = new Tile(
               j,
               i,
               false,
               this.hasSelectedOrb,
               this.getSelectedOrb,
               this.moveOrb,
               this.setActive,
               this.prepareNextRound,
               this.PathFinder
            );

            let squareFieldDiv: HTMLDivElement = tile.getDiv();

            newRow.appendChild(squareFieldDiv);

            this.boardRepresentation[i][j].tile = tile;
         }

         this.gameField.appendChild(newRow);
      }
   }

   private placeOrbs(): void {
      for (let i = 0; i < this.currentsCoords.length; i++) {
         let x: number = this.currentsCoords[i].x;
         let y: number = this.currentsCoords[i].y;

         let currentTile: Tile = this.boardRepresentation[y][x].tile;

         let orb: Orb = this.nextOrbs[i];
         orb.setX(x);
         orb.setY(y);

         this.boardRepresentation[y][x].orb = orb;
         this.boardRepresentation[y][x].colorID = orb.getColorID();

         currentTile.setOrb(orb);

         setTimeout(() => {
            this.Popper.checkPop({ x: x, y: y });
         }, 500);
      }

      this.currentsCoords = null;
      this.nextOrbs = null;
   }

   private prepareNextRound = (): void => {
      this.checkGameOver();

      this.getCoords();

      if (!this.GameOver) {
         this.placeOrbs();
         this.getNextOrbs();
         this.preview.setPreview(this.nextOrbs);
      }
   };

   private getActive = (): boolean => {
      return this.active;
   };

   private setActive = (active: boolean): void => {
      this.active = active;
   };

   //Handling Orb Selection
   private hasSelectedOrb = (): boolean => {
      if (this.selectedOrb) return true;
      else return false;
   };

   private setCurrentOrb = (orb: Orb, deselect: boolean): void => {
      if (!deselect) {
         this.selectedOrb = orb;
      } else {
         this.selectedOrb = null;
      }
   };

   private getSelectedOrb = (): Orb => {
      return this.selectedOrb;
   };

   private moveOrb = (startCoords: Coords, endCoords: Coords): void => {
      this.updateOrbDestination(startCoords, endCoords);
      this.clearOrbStartingPosition(startCoords);

      this.selectedOrb.getDiv().className = "orb";
      this.selectedOrb.x = endCoords.x;
      this.selectedOrb.y = endCoords.y;

      setTimeout(() => {
         this.Popper.checkPop(endCoords);
      }, Settings.timeoutValue);

      this.setCurrentOrb(null, true);
   };

   private updateOrbDestination(startCoords: Coords, endCoords: Coords): void {
      this.boardRepresentation[endCoords.y][
         endCoords.x
      ].orb = this.boardRepresentation[startCoords.y][startCoords.x].orb;

      this.boardRepresentation[endCoords.y][
         endCoords.x
      ].colorID = this.boardRepresentation[startCoords.y][
         startCoords.x
      ].colorID;

      this.boardRepresentation[endCoords.y][endCoords.x].tile.setOrb(
         this.selectedOrb
      );

      this.boardRepresentation[endCoords.y][endCoords.x].occupied = true;
   }

   private clearOrbStartingPosition(startCoords: Coords): void {
      this.boardRepresentation[startCoords.y][startCoords.x].orb = null;
      this.boardRepresentation[startCoords.y][startCoords.x].colorID = null;
      this.boardRepresentation[startCoords.y][startCoords.x].occupied = false;
      this.boardRepresentation[startCoords.y][startCoords.x].tile.setOrb(null);
   }
}
