const path = require('path');
const webpack = require('webpack')

module.exports = {
  entry: './index.mjs',
  mode: 'development',
  output: {
    path: path.resolve(__dirname, '.'),
    filename: 'dist.js',
  },
  resolve: {
      fallback: { 
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify"),
      "events": require.resolve("events-browserify"),
      "buffer": require.resolve('buffer/')              
    },
  },
  plugins: [
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        })
  ]
}
