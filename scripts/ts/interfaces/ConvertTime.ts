import { Time } from "./Time";

export interface ConvertTime {
   (seconds: number): Time;
}
