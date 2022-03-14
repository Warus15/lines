import { Coords } from "./interfaces/Coords";

import { Time } from "./interfaces/Time";
import { Quote } from "./interfaces/Quote";

import { BoardArray } from "./interfaces/BoardArray";
import { GetRandomNumber } from "./interfaces/RandomNumber";
import { ConvertTime } from "./interfaces/ConvertTime";

export class Settings {
  public static readonly BoardSize: number = 9;

  public static readonly OrbsToPop: number = 5;

  public static readonly timeoutValue: number = 1500;

  public static readonly colors: string[] = [
    "red",
    "blue",
    "aquamarine",
    "pink",
    "purple",
    "yellow",
    "lime"
  ];

  public static readonly quoteDisplay = document.getElementById("quote");

  public static readonly quotes: Quote[] = [
    {
      quote: "Don't hate the player hate the game.",
      author: "Ice T"
    },
    {
      quote:
        "Better by far you should forget and smile, than that you should remember and be sad.",
      author: "Christina Rossetti"
    },
    {
      quote:
        "Of all sad words of tongue or pen, the saddest are these, 'It might have been.",
      author: "John Greenleaf Whittier"
    },
    {
      quote:
        "The pain I feel now is the happiness I had before. That's the deal.",
      author: "C.S. Lewis"
    },
    {
      quote: `This thing we call "failure" is not the falling down, but the staying down.`,
      author: "Mary Pickford"
    },
    {
      quote: "Whenever I climb I am followed by a dog called Ego.",
      author: "Friedrich Nietzsche"
    },
    {
      quote: "In the end… We only regret the chances we didn’t take",
      author: "Lewis Carroll"
    }
  ];

  //Methods
  public static getRandomColor(): { color: string; colorID: number } {
    let index = this.getRandomNumber(0, this.colors.length);
    let color: string = this.colors[index];

    return { color: color, colorID: index };
  }

  private static RandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * max + min);
  }

  public static getRandomNumber: GetRandomNumber = Settings.RandomNumber;

  public static getCoords(boardRepresentation: BoardArray): {
    canPlace: boolean;
    coords: Coords[];
  } {
    let coordsArray: Coords[] = new Array();

    if (this.checkGameOver(boardRepresentation))
      return { canPlace: false, coords: null };

    for (let i = 0; i < 3; i++) {
      let x: number;
      let y: number;

      do {
        x = this.getRandomNumber(0, 9);
        y = this.getRandomNumber(0, 9);
      } while (boardRepresentation[y][x].occupied);

      let coords: Coords = {
        x: x,
        y: y
      };

      boardRepresentation[y][x].occupied = true;

      coordsArray.push(coords);
    }

    return { canPlace: true, coords: coordsArray };
  }

  public static checkGameOver(boardRepresentation: BoardArray): boolean {
    const possiblePlacesCounter: number =
      this.countPossiblePlaces(boardRepresentation);

    if (possiblePlacesCounter <= 3) return true;
    else return false;
  }

  public static countPossiblePlaces(boardRepresentation: BoardArray): number {
    let possiblePlacesCounter: number = 0;
    for (let i = 0; i < this.BoardSize; i++)
      for (let j = 0; j < boardRepresentation[i].length; j++) {
        if (!boardRepresentation[i][j].occupied) possiblePlacesCounter++;
      }

    return possiblePlacesCounter;
  }

  private static changeTime(seconds: number): Time {
    let minutes: number = 0;

    while (seconds >= 60) {
      minutes++;
      seconds -= 60;
    }

    const time: Time = { minutes: minutes, seconds: seconds };

    return time;
  }

  public static convertTime: ConvertTime = Settings.changeTime;

  public static getRandomQuote(): Quote {
    return this.quotes[this.getRandomNumber(0, this.quotes.length)];
  }
}
