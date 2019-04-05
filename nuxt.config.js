const pkg = require('./package')
const webpack = require('webpack')

module.exports = {
  server: {
    port: 5000,
    host: '0.0.0.0'
  },
  mode: 'spa',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/png', href: '/favicon.png' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Montserrat:100,200,300,400,500,600,700,800,900&subset=latin-ext'
      },
      {
        rel: 'stylesheet',
        href: 'https://use.fontawesome.com/releases/v5.7.2/css/all.css'
      }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#90ca2a' },

  /*
  ** Global CSS
  */
  css: [
    '@/assets/scss/fonts.scss',
    '@/assets/scss/buttons.scss',
    '@/assets/scss/card.scss',
    '@/assets/scss/fades.scss'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/axios',
    '~/plugins/click-outside',
    '~/plugins/vue-async-computed',
    '~/plugins/lodash',
    '~/plugins/order',
    '~/plugins/timezone',
    '~/plugins/api',
    { src: '~/plugins/localStorage.js', ssr: false },
    { src: '~/plugins/notifications', ssr: false }
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios',
    // Doc: https://bootstrap-vue.js.org/docs/
    'bootstrap-vue/nuxt',
    // Global scss
    [
      'nuxt-sass-resources-loader',
      ['@/assets/scss/ui_colors.scss', 'sass-mediaqueries/_media-queries.scss']
    ],
    // Using FontAwesome as module
    [
      'nuxt-fontawesome',
      {
        component: 'fa',
        imports: [
          {
            set: '@fortawesome/free-solid-svg-icons',
            icons: ['fas']
          },
          {
            set: '@fortawesome/free-brands-svg-icons',
            icons: ['fab']
          },
          {
            set: '@fortawesome/pro-regular-svg-icons',
            icons: ['far']
          },
          {
            set: '@fortawesome/pro-light-svg-icons',
            icons: ['fal']
          }
        ]
      }
    ]
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    baseURL:
      'https://swfy-weworktogethersoftware-staging.eks.swfy.co.uk/api/v3/web'
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
