const path = require("path");
const htmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	mode: "development",
	entry: {
		index: "./src/index.js",
	},
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "[name].bundle.js",
		clean: true,
	},
	plugins: [new htmlWebpackPlugin({ title: "To-do" })],
	devtool: "inline-source-map",
	devServer: { contentBase: "./dist" },
	module: {
		rules: [
			{
				test: /\.css/,
				use: ["style-loader", "css-loader"],
			},
			{
				test: /\.(jpg|png|jpeg|webp|gif|svg)/,
				type: "asset/resource",
			},
		],
	},
};
