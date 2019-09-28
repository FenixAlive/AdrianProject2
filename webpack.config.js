module.exports = {
    entry: __dirname + '/src',
    output: {
        path: '/',
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
    mode: 'production' //production
};