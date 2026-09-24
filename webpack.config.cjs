const path = require("path");

const webpack = require("webpack");

const HandlebarsPlugin = require("handlebars-webpack-plugin");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const CopyPlugin = require("copy-webpack-plugin");

const TerserPlugin = require("terser-webpack-plugin");

const mergeJSON = require("handlebars-webpack-plugin/utils/mergeJSON");

const buildVersion = Date.now();

// ==================================================
// Load JSON Data for Handlebars
// ==================================================

const projectData = mergeJSON(
  path.join(__dirname, "src", "data", "**", "*.json"),
);

projectData.buildVersion = buildVersion;
// ==================================================
// Project Paths
// ==================================================

const paths = {
  src: {
    imgs: "./src/assets/images",
    scss: "./src/assets/scss",
    fonts: "./src/assets/fonts",
    js: "./src/assets/js",
    favicon: "./src/assets/favicon",
    html: "./src/html",
    data: "./src/data",
  },

  dist: {
    imgs: "assets/images",
    css: "assets/css",
    fonts: "assets/fonts",
    js: "assets/js",
    favicon: "assets/favicon",
    data: "data",
  },
};

// ==================================================
// Webpack Configuration
// ==================================================

const wPackConfig = {
  entry: {
    libs: [paths.src.scss + "/libs.scss"],

    theme: [paths.src.js + "/theme.js", paths.src.scss + "/theme.scss"],
  },

  // ==================================================
  // Output
  // ==================================================

  output: {
    path: path.resolve(__dirname, "dist"),

    filename: paths.dist.js + "/[name].bundle.js",

    // Clear old dist files before rebuilding
    clean: true,
  },

  // ==================================================
  // Development Server
  // ==================================================

  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },

    watchFiles: ["src/**/*"],

    port: 8080,

    open: true,

    allowedHosts: "all",

    hot: true,

    compress: true,
  },

  // ==================================================
  // Development Settings
  // ==================================================

  devtool: "source-map",

  mode: "development",

  // ==================================================
  // Module Rules
  // ==================================================

  module: {
    rules: [
      // Handlebars
      {
        test: /\.hbs$/,
        use: "handlebars-loader",
      },

      // HTML
      {
        test: /\.html$/,

        include: path.resolve(__dirname, paths.src.html.slice(2)),

        use: "html-loader",
      },

      // SCSS / SASS / CSS
      {
        test: /\.(sass|scss|css)$/,

        include: path.resolve(__dirname, paths.src.scss.slice(2)),

        use: [
          MiniCssExtractPlugin.loader,

          {
            loader: "css-loader",

            options: {
              url: false,
            },
          },

          "postcss-loader",

          "sass-loader",
        ],
      },
    ],
  },

  // ==================================================
  // Optimization
  // ==================================================

  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/].+\.js$/,

          name: "vendor",

          chunks: "all",
        },
      },
    },

    // Faster development builds
    minimize: false,

    minimizer: [
      new CssMinimizerPlugin(),

      new TerserPlugin({
        extractComments: false,
      }),
    ],
  },

  // ==================================================
  // Plugins
  // ==================================================

  plugins: [
    new webpack.ProgressPlugin(),

    // --------------------------------------------------
    // Copy Static Assets
    // --------------------------------------------------

    new CopyPlugin({
      patterns: [
        // Fonts
        {
          from: paths.src.fonts,
          to: paths.dist.fonts,
          noErrorOnMissing: true,
        },

        // Images
        {
          from: paths.src.imgs,
          to: paths.dist.imgs,
          noErrorOnMissing: true,
        },

        // Favicons
        {
          from: paths.src.favicon,
          to: paths.dist.favicon,
          noErrorOnMissing: true,
        },

        // JSON Data
        // src/data/* -> dist/data/*
        {
          from: paths.src.data,
          to: paths.dist.data,
          noErrorOnMissing: true,
        },
      ],
    }),

    // --------------------------------------------------
    // Handlebars
    // --------------------------------------------------

    new HandlebarsPlugin({
      entry: path.join(process.cwd(), "src", "html", "**", "*.html"),

      output: path.join(process.cwd(), "dist", "[path]", "[name].html"),

      partials: [
        path.join(process.cwd(), "src", "partials", "**", "*.{html,svg}"),
      ],

      data: projectData,

      helpers: {
        webRoot: () => "{{webRoot}}",

        config: (data) => data,

        ifEquals: (a, b, options) =>
          a === b ? options.fn(this) : options.inverse(this),

        limit: (arr, n) => (Array.isArray(arr) ? arr.slice(0, n) : []),
      },

      onBeforeSave: (Handlebars, res, file) => {
        const depth = file.split("//").pop().split("/").length;

        return res.split("{{webRoot}}").join(".".repeat(depth));
      },
    }),

    // --------------------------------------------------
    // Extract Compiled CSS
    // --------------------------------------------------

    new MiniCssExtractPlugin({
      filename: paths.dist.css + "/[name].bundle.css",
    }),
  ],
};

module.exports = wPackConfig;
