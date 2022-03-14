export interface Node {
   x: number;
   y: number;
   path: Node;
   distanceFromStart: number;
   visited: boolean;
   type: string;
}
