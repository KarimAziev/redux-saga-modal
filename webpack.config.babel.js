const path = require('path');

export default () => (
    {
        mode: 'production',
        entry: './src/index.js',
        output: {
            path: path.resolve(__dirname, './lib'),
            filename: 'index.js',
            libraryTarget: 'umd',
            globalObject: 'this',
            // libraryExport: 'default',
            library: 'Modals'
        },
        externals: {
            'react': {
                root: 'React',
                commonjs2: 'react',
                commonjs: 'react',
                amd: 'react'
            },

        },
        module: {
            rules: [
                {
                    test: /\.(js)$/,
                    exclude: /(node_modules|bower_components)/,
                    use: 'babel-loader'
                }
            ]
        },
    }
);
