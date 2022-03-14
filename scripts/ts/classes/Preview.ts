import { Tile } from "./Tile";
import { Orb } from "./Orb";

export class Preview {
   private previewTilesDiv = document.getElementById(
      "tilesPreview"
   ) as HTMLDivElement;

   private previewTiles: Tile[];

   constructor() {
      this.initiateTilesPreview();
   }

   private initiateTilesPreview(): void {
      this.previewTiles = new Array<Tile>();

      for (let i = 0; i < 3; i++) {
         let previewTile = new Tile(
            null,
            null,
            true,
            null,
            null,
            null,
            null,
            null,
            null
         );

         this.previewTiles.push(previewTile);
         this.previewTilesDiv.appendChild(previewTile.getDiv());
      }
   }

   public setPreview(orbs: Orb[]): void {
      orbs.forEach((orb, index) => {
         this.previewTiles[index].setOrb(orb);
      });
   }

   public clearPreview(): void {
      this.previewTiles.forEach(tile => {
         tile.removeOrb();
      });
   }
}
