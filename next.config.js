const withCSS = require('@zeit/next-css');
const withStylus = require('@zeit/next-stylus');
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/
});
const withCoffeescript = require('next-coffeescript');

const cfg = {
  cssModules: false,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  typescript: {
    /*
    We ignore build errors in order to take advantage of typescript editor
    integrations only.
    */
    ignoreDevErrors: true,
    ignoreBuildErrors: true,
  },
  alias: {
    "react": "node_modules/react",
    "react-dom": "node_modules/react-dom"
  }
};

module.exports = withMDX(withCSS(withCoffeescript(withStylus(cfg))));
