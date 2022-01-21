export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - برنامج توزيع الاساتذة',
    title: 'جدول المراقبات',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'material-design-icons-iconfont/dist/material-design-icons.css'
  ],


  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  loading: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  router: {
    middleware: ['auth']
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    '@nuxtjs/auth-next',
    '@nuxtjs/toast',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    // baseURL: 'http://109.224.62.102:6789/api/',
    baseURL: 'http://localhost:6789/api/',
  },

  // server: {
  //   port: 5678,
  //   host: '0'
  // },

  toast: {
    position: 'top-center',
    duration: 3000,
    theme: 'bubble',
    singleton: true
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en',
    },
  },

  auth: {
    redirect: {
      login: '/login',
      logout: '/login',
      callback: '/login',
      home: '/'
    },
    strategies: {
      local: {
        token: {
          property: 'token',
          global: true,
          required: true,
          type: 'Bearer',
          prefix: '_token.',
        },
        user: {},
        endpoints: {
          login: { url: '/login', method: 'post' },
          logout: false,
          user: false
        }
      }
    }
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    treeShake: true,
    rtl: true,
    icons: {
      iconfont: 'md',
    },
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: "#212529",
          secondary: "#343A40",
          accent: "#495057",
          info: "#8AC4FF",
          warning: "#FFD166",
          error: "#EF476F",
          success: "#06D6A0",
        },

        light: {
          primary: "#1d3557",
          secondary: "#457b9d",
          accent: "#dafeff",
          info: "#8AC4FF",
          warning: "#FFD166",
          error: "#EF476F",
          success: "#06D6A0",
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
}
