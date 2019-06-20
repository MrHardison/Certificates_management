const pkg = require('./package')
const webpack = require('webpack')
require('dotenv').config()

console.log(process.env.BASE_URL)

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
    '~/plugins/find',
    '~/plugins/timezone',
    '~/plugins/api',
    { src: '~/plugins/localStorage', ssr: false },
    { src: '~/plugins/notifications', ssr: false },
    { src: '~/plugins/dateTime', ssr: false }
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios',

    '@nuxtjs/sentry',
    // Doc: https://bootstrap-vue.js.org/docs/
    'bootstrap-vue/nuxt',

    // Global scss
    '@nuxtjs/style-resources',

    ['@nuxtjs/dotenv', { systemvars: true }],

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
    // baseURL: process.env.BASE_URL || 'https://swfy-weworktogethersoftware-staging.eks.swfy.co.uk/api/v3/web'
  },

  env: {
    domains: {
      default:
        'https://swfy-weworktogethersoftware-staging.eks.swfy.co.uk/api/v3/web',
      'https://app.weworktogethersoftware.com':
        'https://api.weworktogethersoftware.com/api/v3/web',
      'https://swfy-wwt-web-app.eks.swfy.co.uk': 
        'https://api.weworktogethersoftware.com/api/v3/web',
      'http://localhost:5000':
        'https://swfy-weworktogethersoftware-staging.eks.swfy.co.uk/api/v3/web',
    }
  },

  sentry: {
    dsn: process.env.SENTRY_DSN,
    config: {
      release: process.env.RELEASE,
      publishRelease: true
    }
  },

  // Styles
  styleResources: {
    scss: ['@/assets/scss/ui_colors.scss'] // alternative: scss
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
