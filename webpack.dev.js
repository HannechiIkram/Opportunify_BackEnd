const path = require("path");

module.exports = {
  mode: "development", // Set mode here

  entry: {
    main: "./app.js", // Specify entry points here
  },

  output: {
    path: path.join(__dirname, "dev_build"),
    publicPath: "/",
    filename: "[name].js",
    clean: true,
  },

  target: "node",

  module: {
     noParse: /mock-aws-s3|aws-sdk|nock/,
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /\.html$/,
        loader: "html-loader",
      },
    ],
  },
};
