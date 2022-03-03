const resolve = require('path').resolve

module.exports = {
	target: 'node',
	node: {
		__dirname: false,
		__filename: false
	},
	entry: [ './src/main.js' ],

	output: {
		filename: 'index.js',
		path: resolve(__dirname, './../dist')
	}
}
// module.exports = {
// 	target: 'node',
// 	node: {
// 		__dirname: false,
// 		__filename: false
// 	},
// 	entry: [ './src/main.js' ],
// 	output: {
// 		filename: 'index.js',
// 		path: resolve(__dirname, './../dist')
// 	}
// }
