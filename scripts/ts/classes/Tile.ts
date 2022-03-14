import { Settings } from "../Settings";
import { Coords } from "../interfaces/Coords";
import { Orb } from "./Orb";
import { PathFinder } from "./PathFinder";

import { showMotivationQuote } from "./Decorators";

export class Tile implements Coords {
   private div: HTMLDivElement;
   private orb: Orb;
   private orbDiv: HTMLDivElement;

   public x: number;
   public y: number;
   private previewTile: boolean;

   private gameHasSelectedOrb: () => boolean;
   private getSelectedOrb: () => Orb;
   private moveOrb: (startCoords: Coords, endCoords: Coords) => void;
   private setActive: (active: boolean) => void;
   private prepareNextRound: () => void;

   private PathFinder: PathFinder;

   constructor(
      x: number,
      y: number,
      previewTile: boolean,
      gameHasSelectedOrb: () => boolean,
      getSelectedOrb: () => Orb,
      moveOrb: (startCoords: Coords, endCoords: Coords) => void,
      setActive: (active: boolean) => void,
      prepareNextRound: () => void,
      pathFinder: PathFinder
   ) {
      this.div = document.createElement("div");
      this.div.className = "tile";

      this.orb = null;
      this.orbDiv = null;

      this.previewTile = previewTile;

      this.x = x;
      this.y = y;

      this.gameHasSelectedOrb = gameHasSelectedOrb;
      this.getSelectedOrb = getSelectedOrb;
      this.moveOrb = moveOrb;
      this.setActive = setActive;
      this.prepareNextRound = prepareNextRound;

      this.PathFinder = pathFinder;

      if (!this.previewTile) this.prepareListeners();
   }

   private prepareListeners(): void {
      this.div.addEventListener("mouseover", event => {
         if (this.gameHasSelectedOrb()) this.mouseOverFunction();
      });

      this.div.addEventListener("click", event => {
         if (this.gameHasSelectedOrb()) this.clickFunction();
      });
   }

   private mouseOverFunction(): void {
      let selectedOrb = this.getSelectedOrb();

      let startCoords: Coords = {
         x: selectedOrb.x,
         y: selectedOrb.y
      };

      let endCoords: Coords = {
         x: this.x,
         y: this.y
      };

      if (!(startCoords.x == endCoords.x && startCoords.y == endCoords.y))
         this.PathFinder.findPath(startCoords, endCoords);
      else this.PathFinder.reset(false);
   }

   @showMotivationQuote
   private clickFunction(): void {
      if (this.PathFinder.pathFound) {
         let selectedOrb = this.getSelectedOrb();

         let startCoords: Coords = {
            x: selectedOrb.x,
            y: selectedOrb.y
         };

         let endCoords: Coords = {
            x: this.x,
            y: this.y
         };

         this.moveOrb(startCoords, endCoords);

         this.PathFinder.markPath();
         this.PathFinder.reset(true);
         this.setActive(false);
         this.PathFinder.updateNodeArray();

         setTimeout(() => {
            this.prepareNextRound();
            this.setActive(true);
         }, Settings.timeoutValue);
      } else {
      }
   }

   public getDiv(): HTMLDivElement {
      return this.div;
   }

   public hasOrb(): boolean {
      if (!this.orb) return false;
      else return true;
   }

   public setOrb(orb: Orb) {
      this.orb = orb;

      if (this.orb) {
         this.orbDiv = this.orb.getDiv();

         this.div.appendChild(this.orbDiv);
      }
   }

   public removeOrb(): void {
      if (this.hasOrb()) {
         this.div.removeChild(this.orbDiv);

         this.orb = null;
         this.orbDiv = null;
      }
   }

   public highlightTile(): void {
      this.div.className = "highlightedTile";
   }

   public clearHighlight(): void {
      this.div.className = "tile";
   }

   public markPath(): void {
      this.div.className = "pathTile";

      setTimeout(() => {
         this.clearHighlight();
      }, Settings.timeoutValue);
   }
}
