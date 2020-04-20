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
    ignoreBuildErrors: true
  }
};

module.exports = withMDX(withCSS(withCoffeescript(withStylus(cfg))));
