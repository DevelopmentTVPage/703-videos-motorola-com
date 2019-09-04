const path = require("path");
const autoprefixer  = require("autoprefixer");
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    devtool : "cheap-module-eval-source-map",
    entry : {
        home: "./src/containers/home.jsx",
        channel: "./src/containers/channel.jsx",
        video: "./src/containers/video.jsx",
        search: "./src/containers/search.jsx"
    },
    output : {
        path : path.resolve(__dirname,"dist"),
        filename : "[name].js",
        chunkFilename: '[name].[chunkhash].js',
        jsonpFunction: "tvpageJsonp",
        publicPath : "/dist/"
    },
    resolve : {
        extensions : [".js", ".jsx"]
    },
    module : {
        rules : [
            {
                test: /\.(js|jsx)$/,
                loader : "babel-loader",
                exclude : /node_modules/
            },
            {
                test: /\.(css|scss)$/,
                use : [
                    { 
                        loader : "style-loader" 
                    },
                    { 
                        loader : "css-loader",
                    },
                    { 
                        loader:  "sass-loader",
                        options: {
                            outputStyle : "compressed"
                        }
                    },
                    {
                        loader : "postcss-loader",
                        options : {
                            ident : "postcss",
                            plugins : ()=>[
                                autoprefixer({
                                    browsers : [
                                        "> 5%",
                                        "last 2 versions",
                                        "IE 10"
                                    ]
                                })
                            ]
                        }
                    }
                ]
            },
            {
                test : /\.(png|jpe?g\gif)$/,
                loader : "url-loader?limit=8000&name=images/[name].[ext]"
            }
        ]
    }
};