const path = require("path");

module.exports = {
   entry: "./scripts/ts/Main.ts",
   output: {
      path: path.resolve(__dirname, "./scripts/webpack"),
      filename: "bundle.js",
   },
   module: {
      rules: [
         {
            test: /\.tsx?$/,
            use: "ts-loader",
            exclude: /node_modules/,
         },
      ],
   },
   resolve: {
      extensions: [".tsx", ".ts", ".js"],
   },
   watch: true,
};
