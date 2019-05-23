module.exports = {
  // entry: set by the plugin
  // output: set by the plugin
  mode: "production",
  target: 'node',
  externals: [
    /aws-sdk/, // Available on AWS Lambda
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: [
            [
              '@babel/env',
              {
                targets: { node: '8.10' }, // Node version on AWS Lambda
                useBuiltIns: 'entry',
                modules: false,
                loose: true,
              },
            ]
          ],
          "plugins": [
            // Stage 0
            "@babel/plugin-proposal-function-bind",

            // Stage 1
            "@babel/plugin-proposal-export-default-from",
            "@babel/plugin-proposal-logical-assignment-operators",
            ["@babel/plugin-proposal-optional-chaining", { "loose": false }],
            ["@babel/plugin-proposal-pipeline-operator", { "proposal": "minimal" }],
            ["@babel/plugin-proposal-nullish-coalescing-operator", { "loose": false }],
            "@babel/plugin-proposal-do-expressions",

            // Stage 2
            ["@babel/plugin-proposal-decorators", { "legacy": true }],
            "@babel/plugin-proposal-function-sent",
            "@babel/plugin-proposal-export-namespace-from",
            "@babel/plugin-proposal-numeric-separator",
            "@babel/plugin-proposal-throw-expressions",

            // Stage 3
            "@babel/plugin-syntax-dynamic-import",
            "@babel/plugin-syntax-import-meta",
            ["@babel/plugin-proposal-class-properties", { "loose": false }],
            "@babel/plugin-proposal-json-strings"
          ]
        },
      },
    ],
  },
};