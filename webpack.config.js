var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var extractPlugin = new ExtractTextPlugin({
	filename: 'main.css'
})

module.exports = {
	devServer: {
        inline:true,
        port: 8080
    },
	entry: './public/javascripts/index.js',
	output: {
		path: __dirname + '/public/dist',
		filename: 'bundle.js',
		publicPath: '/public/dist',
	    library: 'bundle',
		libraryTarget: 'var'
	},
	module: {
		rules: [
		    {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                        	presets: ['es2015']
                        }
                    }
                ]
	     	},
	     	{
		        test: /\.css$/,
            	use: extractPlugin.extract({
            		use: ["css-loader"]
            	})
		    }
            /* For SASS */
            // {
            // 	test: /\.scss$/,
            // 	use: extractPlugin.extract({
            // 		use: ['css-loader', 'sass-loader']
            // 	})
            // }
		]	
	},
	plugins: [
        extractPlugin
	]
};