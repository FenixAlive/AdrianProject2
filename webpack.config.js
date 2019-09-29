module.exports = {
    entry: __dirname + '/src/index.js',
    output: {
        path: __dirname+'/public/',
        publicPath: '/',
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react']
                }
            },
            {
                test:/\.css$/,
                use:['style-loader', 'css-loader']
            }
        ]
    },
    mode: 'development' //production
};