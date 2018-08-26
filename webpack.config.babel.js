const path = require('path');



const createConfig = (env, args) => {
  const config = {
    entry: './src',
    stats: {
      colors: true,
      hash: true,
      timings: true,
      assets: true,
      chunks: true,
      chunkModules: true,
      modules: true,
      children: true,
    },
    output: {
      path: path.resolve(__dirname, 'lib'),
      umdNamedDefine: true,
      filename: 'index.js',
      libraryTarget: 'umd',
      globalObject: 'this',
      library: 'Modals',
    },
    module: {
      rules: [
        {
          test: /\.(js)$/,
          exclude: /(node_modules|bower_components)/,
          use: 'babel-loader',
        },
      ],
    },
    devtool: 'source-map',
    watch: false,
    watchOptions: {
      ignored: [/node_modules/, 'scripts/**/*.js'],
    },

    devServer: {
      contentBase: path.join(__dirname, 'lib'),
      filename: 'index.js',
      port: 9000,
      overlay: true,
    },
  }

  return config;
}

export default createConfig;