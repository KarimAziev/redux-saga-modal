const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const uglifyOptions = {
  ecma: 8,
  warnings: false,
  output: {
    comments: true,
    beautify: true,
  },
  toplevel: true,
  nameCache: null,
  ie8: false,
  keep_classnames: true,
  keep_fnames: true,
}



const createConfig = () => (env, args) => {
  const config = {
    entry: './src/index.js',
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
    externals: {
      'react': {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react',
      },
    
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
    watch: true,
    watchOptions: {
      ignored: [/node_modules/, 'scripts/**/*.js'],
    },
    optimization: {
      namedChunks: true,

      
      minimizer: [
        new UglifyJsPlugin({
          sourceMap: true,
          uglifyOptions: uglifyOptions,
        }),
      ],
    },
    devServer: {
      contentBase: path.join(__dirname, 'lib'),
      filename: 'index.js',
      port: 9000,
      overlay: true,
    },
  }
  
  console.log('config env: ', env, config);

  return config;
}

export default createConfig();