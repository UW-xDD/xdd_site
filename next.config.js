const withCSS = require('@zeit/next-css');
const withStylus = require('@zeit/next-stylus');
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/
});
const withCoffeescript = require('next-coffeescript');

const cfg = {
  cssModules: false,
  pageExtensions: ['js', 'jsx', 'md', 'mdx','coffee']
};

module.exports = withMDX(withCoffeescript(withCSS(withStylus(cfg))));
