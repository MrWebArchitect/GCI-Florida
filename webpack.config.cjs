const path = require('path');
const webpack = require('webpack');
const HandlebarsPlugin = require('handlebars-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const mergeJSON = require('handlebars-webpack-plugin/utils/mergeJSON');

// Load JSON data for Handlebars
const projectData = mergeJSON(path.join(__dirname, '/src/data/**/*.json'));

const paths = {
  src: {
    imgs: './src/assets/images',
    scss: './src/assets/scss',
    fonts: './src/assets/fonts',
    js: './src/assets/js',
    favicon: './src/assets/favicon',
    html: './src/html',
  },
  dist: {
    imgs: './assets/images',
    css: './assets/css',
    fonts: './assets/fonts',
    js: './assets/js',
    favicon: './assets/favicon',
  }
};

const wPackConfig = {
  entry: {
    libs: [paths.src.scss + '/libs.scss'],
    theme: [paths.src.js + '/theme.js', paths.src.scss + '/theme.scss']
  },

  output: {
    path: path.resolve(__dirname, 'dist'), // ✅ ensures build outputs here
    filename: paths.dist.js + '/[name].bundle.js',
    clean: true, // ✅ clears old dist on rebuild
  },

  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    watchFiles: ['src/**/*'],
    port: 8080,
    open: true,
    hot: true,
    compress: true,
  },

  devtool: 'source-map',
  mode: 'development',

  module: {
    rules: [
      {
        test: /\.hbs$/,
        use: 'handlebars-loader',
      },
      {
        test: /\.html$/,
        include: path.resolve(__dirname, paths.src.html.slice(2)),
        use: 'html-loader',
      },
      {
        test: /\.(sass|scss|css)$/,
        include: path.resolve(__dirname, paths.src.scss.slice(2)),
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { url: false }
          },
          'postcss-loader',
          'sass-loader'
        ],
      },
    ],
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/].+\.js$/,
          name: 'vendor',
          chunks: 'all'
        }
      }
    },
    minimize: false, // ✅ Faster dev builds (no CSS/JS minification in dev)
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin({ extractComments: false })
    ],
  },

  plugins: [
    new webpack.ProgressPlugin(),

    new CopyPlugin({
      patterns: [
        { from: paths.src.fonts, to: paths.dist.fonts, noErrorOnMissing: true },
        { from: paths.src.imgs, to: paths.dist.imgs, noErrorOnMissing: true },
        { from: paths.src.favicon, to: paths.dist.favicon, noErrorOnMissing: true },
      ],
    }),

    new HandlebarsPlugin({
      entry: path.join(process.cwd(), 'src', 'html', '**', '*.html'),
      output: path.join(process.cwd(), 'dist', '[path]', '[name].html'),
      partials: [path.join(process.cwd(), 'src', 'partials', '**', '*.{html,svg}')],
      data: projectData,
      helpers: {
        webRoot: () => '{{webRoot}}',
        config: data => data,
        ifEquals: (a, b, options) => (a === b ? options.fn(this) : options.inverse(this)),
        limit: (arr, n) => Array.isArray(arr) ? arr.slice(0, n) : [],
      },
      onBeforeSave: (Handlebars, res, file) => {
        const depth = file.split('//').pop().split('/').length;
        return res.split('{{webRoot}}').join('.'.repeat(depth));
      },
    }),

    new MiniCssExtractPlugin({
      filename: paths.dist.css + '/[name].bundle.css',
    }),
  ],
};

module.exports = wPackConfig;
