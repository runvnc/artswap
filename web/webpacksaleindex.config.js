const path = require('path');
const webpack = require('webpack')

module.exports = {
  entry: './index_sale.mjs',
  mode: 'development',
  //mode: 'production', 
  output: {
    path: path.resolve(__dirname, '.'),
    filename: 'index_sale_dist.js',
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
