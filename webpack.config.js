const fs = require('fs');
const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

function findFilesWithExtension(dir, extension) {
  const files = [];

  function traverseDirectory(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        traverseDirectory(fullPath); // Recursively traverse subdirectories
      } else if (entry.isFile() && entry.name.endsWith(extension)) {
        files.push(fullPath);
      }
    }
  }

  traverseDirectory(dir);
  return files;
}

function getFileName(filePath) {
	const fileNameWithExtension = filePath.split('/').pop();
	const extension = '.addin.js';
	const fileNameWithoutExtension = fileNameWithExtension.slice(0, -extension.length);
	return fileNameWithoutExtension;
}

function convertToKebabCase(str) {
	return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

module.exports = (env, argv) => {
	const isProduction = argv.mode === 'production';
	const matchingFiles = findFilesWithExtension('./src', '.addin.js');
	let [entry, plugins] = [{}, []];

	matchingFiles.forEach(path => {
		let name = convertToKebabCase(getFileName(path))
		if(!isProduction) entry[name] = ['./.dev', `./${path}`];
		else entry[name] = `./${path}`;
		plugins.push(new HtmlWebpackPlugin({
			template: './assets/template.html',
			filename: `${name}.html`,
			chunks: [name],
		}))
	}) 

	return {
		output: {
			path: path.resolve(__dirname, 'build'),
			filename: isProduction ? 'assets/js/[name].[contentcontenthash].js' : 'js/[name].js',
			chunkFilename: isProduction ? 'assets/js/[name].[contentcontenthash].js' : 'js/[name].js',
		},
		entry,
		plugins: [
			new CopyWebpackPlugin({
				patterns: [
					{ from: 'assets/favicon.ico', to: '.' },
					{ 
						from: 'assets/', 
						to: './assets',
						filter: (resourcePath) => {
						  const fileName = path.basename(resourcePath);
						  return fileName !== 'template.html' && fileName !== 'favicon.ico';
						} 
					}
				]
			}),
			...plugins,
			new MiniCssExtractPlugin({
				filename: (argv.mode === 'development') ? 'assets/css/[name].css' : 'assets/css/[name].[contenthash].css'
			})
		],
		module: {
			rules: [
				{
					test: /\.(js|jsx)$/, // what to do with JS files
					exclude: /node_modules/,
					resolve: {
						extensions: ['.js', '.jsx']
					},
					use: {
						loader: 'babel-loader',
						options: {
							presets: [
								'@babel/preset-env',
								'@babel/preset-react'
							]
						}
					}
				}, {
					test: /\.(ts|tsx)$/, // what to do with TS/TSX files
					use: 'ts-loader',
					exclude: /node_modules/,
					resolve: {
						extensions: ['.ts', '.tsx']
					},
				}, {
					test: /\.(css|sass|scss)$/, // what to do with CSS files
					exclude: /node_modules/,
					use: [
						{
							loader: MiniCssExtractPlugin.loader
						},
						{
							loader: 'css-loader',
							options: {
								importLoaders: 1,
								modules: {
									localIdentName: (argv.mode === 'development') ? '[path][name]__[local]' : '[contenthash:base64]'
								}
							}
						},
						{
							loader: 'sass-loader',
							options: {
								sassOptions: {
									fiber: false,
								},
							}
						}
					],
					exclude: /node_modules/,
				}, {
					test: /\.(svg|jpg|gif|png)$/, // what to do with image files
					exclude: /node_modules/,
					use: [{
						loader: 'file-loader',
						options: {
							name: (argv.mode === 'development') ? '[name].[ext]' : '[name].[contenthash].[ext]',
							outputPath: (url, resourcePath, context) => { // where the target file will be placed
								return `assets/${url}`;
							},
							publicPath: (url, resourcePath, context) => { // will be written in the img/src
								return `assets/${url}`;
							}
						}
					}]
				}
			]
		},
		optimization:  {
			minimize: true,
			minimizer: [
			  new TerserPlugin({ extractComments: false }),
			  new CssMinimizerPlugin(),
			]
		  }
	}
};