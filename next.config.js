const withCSS = require('@zeit/next-css')
const cssLoaderConfig = require('@zeit/next-css/css-loader-config')

// Code from @zeit/next-stylus (hot-fixed)
const withStylus = (nextConfig = {}) => {
  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      if (!options.defaultLoaders) {
        throw new Error(
          'This plugin is not compatible with Next.js versions below 5.0.0 https://err.sh/next-plugins/upgrade'
        )
      }

      const { dev, isServer } = options
      const {
        cssModules,
        cssLoaderOptions,
        postcssLoaderOptions,
        stylusLoaderOptions = {}
      } = nextConfig

      options.defaultLoaders.stylus = cssLoaderConfig(config, {
        extensions: ['styl'],
        cssModules,
        cssLoaderOptions,
        postcssLoaderOptions,
        dev,
        isServer,
        loaders: [
          {
            loader: 'stylus-loader',
            options: stylusLoaderOptions
          }
        ]
      })

      // HOTFIX
      try {
        delete options.defaultLoaders.stylus[2].options.minimize
      } catch {}

      config.module.rules.push({
        test: /\.styl$/,
        use: options.defaultLoaders.stylus
      })

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options)
      }

      return config
    }
  })
}


module.exports = withStylus(withCSS());
