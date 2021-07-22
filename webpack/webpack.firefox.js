const webpack = require("webpack");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const srcDir = path.join(__dirname, "..", "src");

module.exports = {
  entry: {
    popup: path.join(srcDir, "popup.tsx"),
    content_script: path.join(srcDir, "content_script.tsx"),
    worker: path.join(srcDir, "kuromoji.worker.ts"),
  },
  output: {
    path: path.join(__dirname, "../dist-firefox/js"),
    filename: "[name].js",
    clean: {
      keep: "kuromoji/",
    },
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
    extensions: [".ts", ".tsx", ".js"],
    fallback: { path: require.resolve("path-browserify") },
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: ".",
          to: "..",
          context: "public",
          filter: async (resourcePath) => {
            return !resourcePath.includes("manifest.json");
          },
        },
        { from: ".", to: "../_locales", context: "_locales" },
        { from: ".", to: "../kuromoji/dict", context: "src/kuromoji/dict" },
      ],
    }),
  ],
  devtool: "inline-source-map",
  mode: "development",
};
