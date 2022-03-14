import { Coords } from "../interfaces/Coords";
import { PathFinder } from "./PathFinder";

export class Orb implements Coords {
   private readonly color: string;
   private readonly colorID: number;

   public x: number;
   public y: number;

   private div: HTMLDivElement;

   private PathFinder: PathFinder;

   private setCurrentGameOrb: (orb: Orb, deselect: boolean) => void;
   private gameHasSelectedOrb: () => boolean;
   private getSelectedOrb: () => Orb;
   private getActive: () => boolean;
   private checkGameOver: () => boolean;

   constructor(
      color: string,
      colorID: number,
      x: number,
      y: number,
      pathFinder: PathFinder,
      setCurrentGameOrb: (orb: Orb, deselect: boolean) => void,
      gameHasSelectedOrb: () => boolean,
      getSelectedOrb: () => Orb,
      getActive: () => boolean,
      checkGameOver: () => boolean
   ) {
      this.color = color;
      this.colorID = colorID;
      this.x = x;
      this.y = y;
      this.PathFinder = pathFinder;

      this.setCurrentGameOrb = setCurrentGameOrb;
      this.gameHasSelectedOrb = gameHasSelectedOrb;
      this.getSelectedOrb = getSelectedOrb;
      this.getActive = getActive;
      this.checkGameOver = checkGameOver;

      this.prepareDiv();
      this.prepareListener();
   }

   private prepareDiv(): void {
      this.div = document.createElement("div");
      this.div.className = "orb";
      this.div.style["backgroundColor"] = this.color;
   }

   private prepareListener(): void {
      this.div.addEventListener("click", event => {
         event.stopPropagation();

         if (this.getActive() && !this.checkGameOver()) this.checkSelection();
      });
   }

   private checkSelection(): void {
      this.PathFinder.updateNodeArray();
      if (!this.gameHasSelectedOrb()) {
         //There's no selected orb
         this.selectOrb();
      } else {
         //There's selected orb'
         let currentOrb: Orb = this.getSelectedOrb();

         this.setCurrentGameOrb(null, true);

         //Selected orb is the same as clicked orb
         if (currentOrb.x == this.x && currentOrb.y == this.y)
            this.deselectOrb();
         else {
            currentOrb.deselectOrb();

            this.selectOrb();
         }
      }
   }

   private selectOrb(): void {
      this.div.className = "selectedOrb";
      this.setCurrentGameOrb(this, false);
   }

   private deselectOrb(): void {
      this.div.className = "orb";
   }

   public setX(x: number): void {
      this.x = x;
   }

   public setY(y: number): void {
      this.y = y;
   }

   public getColor(): string {
      return this.color;
   }

   public getColorID(): number {
      return this.colorID;
   }

   public getDiv(): HTMLDivElement {
      return this.div;
   }
}
