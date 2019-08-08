module.exports = function(api) {
  api.cache(true);
  let plugins = [
    [
      "@babel/plugin-transform-runtime",
      {
        "absoluteRuntime": false,
        "corejs": false,
        "helpers": true,
        "regenerator": true,
        "useESModules": false
      }
    ],
    "@babel/plugin-proposal-function-sent",
    "@babel/plugin-proposal-export-namespace-from",
    "@babel/plugin-proposal-numeric-separator",
    "@babel/plugin-syntax-dynamic-import",
    "@babel/plugin-syntax-import-meta",
    [
      "@babel/plugin-proposal-private-methods",
      {
        loose: false
      }
    ],
    [
      "@babel/plugin-proposal-class-properties",
      {
        loose: false
      }
    ],
    "@babel/plugin-proposal-json-strings"
  ]
  if (process.env.NODE_ENV === 'production') {
    // Remove console logs in production.
    // Since we are using a logger, we do not need
    // console.log
    plugins.push(['transform-remove-console'])
  }

  return {
    presets: [["@babel/preset-env", { targets: { node: true } }]],
    plugins: plugins
  }
}