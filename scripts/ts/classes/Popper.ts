import { SquareField } from "../interfaces/SquareField";
import { Coords } from "../interfaces/Coords";
import { Settings } from "../Settings";
import { BoardArray } from "../interfaces/BoardArray";

export class Popper {
   private boardRepresentation: BoardArray;

   private readonly OrbsToPopNumber: number = Settings.OrbsToPop;
   private popped: boolean;

   private pointsDisplay = document.getElementById("points") as HTMLElement;
   private points: number = 0;

   private startCoords: Coords;

   private colorIDToPop: number;

   private rowToPop: Coords[];
   private columnToPop: Coords[];
   private stDiagonalToPop: Coords[];
   private ndDiagonalToPop: Coords[];

   constructor(boardRepresentation: BoardArray) {
      this.boardRepresentation = boardRepresentation;

      this.popped = false;

      this.rowToPop = new Array<Coords>();
      this.columnToPop = new Array<Coords>();
      this.stDiagonalToPop = new Array<Coords>();
      this.ndDiagonalToPop = new Array<Coords>();
   }

   public checkPop(coords: Coords): void {
      this.startCoords = coords;

      this.colorIDToPop = this.boardRepresentation[coords.y][coords.x].colorID;

      this.findOrbsToPop();
      this.preparePopOrbs();
   }

   private findOrbsToPop(): void {
      this.startRowSearching();
      this.startColumnSearching();
      this.startStDiagonalSearching();
      this.startNdDiagonalSearching();
   }

   private startRowSearching(): void {
      this.findRowOrbs(this.startCoords, true);
      this.findRowOrbs(this.startCoords, false);
   }

   private startColumnSearching(): void {
      this.findColumnOrbs(this.startCoords, true);
      this.findColumnOrbs(this.startCoords, false);
   }

   private startStDiagonalSearching(): void {
      this.findStDiagonalOrbs(this.startCoords, true);
      this.findStDiagonalOrbs(this.startCoords, false);
   }

   private startNdDiagonalSearching(): void {
      this.findNdDiagonalOrbs(this.startCoords, true);
      this.findNdDiagonalOrbs(this.startCoords, false);
   }

   //Checking Directions
   private findRowOrbs(coords: Coords, left: boolean): void {
      try {
         let currentCoords;

         if (left) {
            currentCoords = {
               x: coords.x - 1,
               y: coords.y
            };

            if (this.checkEqualOrbs(currentCoords, "ROW"))
               this.findRowOrbs(currentCoords, true);
         } else {
            currentCoords = {
               x: coords.x + 1,
               y: coords.y
            };

            if (this.checkEqualOrbs(currentCoords, "ROW"))
               this.findRowOrbs(currentCoords, false);
         }
      } catch (error) {}
   }

   private findColumnOrbs(coords: Coords, top: boolean) {
      try {
         let currentCoords;

         if (top) {
            currentCoords = {
               x: coords.x,
               y: coords.y - 1
            };

            if (this.checkEqualOrbs(currentCoords, "COLUMN"))
               this.findColumnOrbs(currentCoords, true);
         } else {
            currentCoords = {
               x: coords.x,
               y: coords.y + 1
            };

            if (this.checkEqualOrbs(currentCoords, "COLUMN"))
               this.findColumnOrbs(currentCoords, false);
         }
      } catch (error) {}
   }

   private findStDiagonalOrbs(coords: Coords, topLeft: boolean): void {
      try {
         let currentCoords;

         if (topLeft) {
            currentCoords = {
               x: coords.x - 1,
               y: coords.y - 1
            };

            if (this.checkEqualOrbs(currentCoords, "ST_DIAGONAL"))
               this.findStDiagonalOrbs(currentCoords, true);
         } else {
            currentCoords = {
               x: coords.x + 1,
               y: coords.y + 1
            };

            if (this.checkEqualOrbs(currentCoords, "ST_DIAGONAL"))
               this.findStDiagonalOrbs(currentCoords, false);
         }
      } catch (error) {}
   }

   private findNdDiagonalOrbs(coords: Coords, topRight: boolean): void {
      try {
         let currentCoords;

         if (topRight) {
            currentCoords = {
               x: coords.x + 1,
               y: coords.y - 1
            };

            if (this.checkEqualOrbs(currentCoords, "ND_DIAGONAL"))
               this.findNdDiagonalOrbs(currentCoords, true);
         } else {
            currentCoords = {
               x: coords.x - 1,
               y: coords.y + 1
            };

            if (this.checkEqualOrbs(currentCoords, "ND_DIAGONAL"))
               this.findNdDiagonalOrbs(currentCoords, false);
         }
      } catch (error) {}
   }

   private checkEqualOrbs(coords: Coords, direction: string): boolean {
      if (
         this.boardRepresentation[coords.y][coords.x].colorID ==
         this.colorIDToPop
      ) {
         switch (direction) {
            case "ROW":
               this.rowToPop.push(coords);
               break;
            case "COLUMN":
               this.columnToPop.push(coords);
               break;
            case "ST_DIAGONAL":
               this.stDiagonalToPop.push(coords);
               break;
            case "ND_DIAGONAL":
               this.ndDiagonalToPop.push(coords);
               break;
         }

         return true;
      } else return false;
   }

   private preparePopOrbs(): void {
      if (this.rowToPop.length >= this.OrbsToPopNumber - 1)
         this.popOrbs(this.rowToPop);

      if (this.columnToPop.length >= this.OrbsToPopNumber - 1)
         this.popOrbs(this.columnToPop);

      if (this.stDiagonalToPop.length >= this.OrbsToPopNumber - 1)
         this.popOrbs(this.stDiagonalToPop);

      if (this.ndDiagonalToPop.length >= this.OrbsToPopNumber - 1)
         this.popOrbs(this.ndDiagonalToPop);

      if (this.popped) {
         this.popOrbs([this.startCoords]);
      }

      this.reset();
   }

   private popOrbs(orbsToPop: Coords[]): void {
      this.popped = true;

      this.updatePoints(orbsToPop.length);

      orbsToPop.forEach(orbCoords => {
         this.boardRepresentation[orbCoords.y][orbCoords.x].orb = null;
         this.boardRepresentation[orbCoords.y][orbCoords.x].colorID = null;
         this.boardRepresentation[orbCoords.y][orbCoords.x].occupied = false;
         this.boardRepresentation[orbCoords.y][orbCoords.x].tile.removeOrb();
      });

      //   console.log(this.boardRepresentation);
   }

   private updatePoints(points: number): void {
      this.points += points;

      this.pointsDisplay.innerHTML = `${this.points}`;
   }

   public getPoints(): number {
      return this.points;
   }

   private reset(): void {
      this.rowToPop = null;
      this.rowToPop = new Array<Coords>();

      this.columnToPop = null;
      this.columnToPop = new Array<Coords>();

      this.stDiagonalToPop = null;
      this.stDiagonalToPop = new Array<Coords>();

      this.ndDiagonalToPop = null;
      this.ndDiagonalToPop = new Array<Coords>();

      this.popped = false;
   }
}
