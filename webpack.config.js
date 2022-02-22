const path = require('path')

module.exports = {
	mode: 'production', // "production" | "development" | "none"
	// Chosen mode tells webpack to use its built-in optimizations accordingly.
	entry: './src/main.js' // string | object | array
	// defaults to ./src
	// Here the application starts executing
	// and webpack starts bundling
}
