import { Settings } from "../Settings";
import { Quote } from "../interfaces/Quote";

export function showMotivationQuote(a: any, b: string, c: any) {
   const original = c.value;

   c.value = function (...args: any[]) {
      let result = original.apply(this, args);

      const quote: Quote = Settings.getRandomQuote();

      Settings.quoteDisplay.innerHTML = `<i>"${quote.quote}" ~ ${quote.author}</i>`;

      return result;
   };
}

export function highlightCurrentTile(a: any, b: string, c: any): void {
   const original = c.value;

   c.value = function (...args: any[]) {
      let result = original.apply(this, args);

      this.boardRepresentation[this.endNode.y][
         this.endNode.x
      ].tile.div.className = "currentTile";

      return result;
   };
}
