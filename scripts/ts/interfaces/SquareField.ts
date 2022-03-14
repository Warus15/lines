import { Tile } from "../classes/Tile";
import { Orb } from "../classes/Orb";
import { Coords } from "../interfaces/Coords";

export interface SquareField {
   occupied: boolean;
   colorID: number;
   tile: Tile;
   orb: Orb;
   position: Coords;
}
