<template>
  <v-app dark>
    <v-app-bar app color="secondary" elevation="6">
      <v-container class="d-flex align-center justify-center">
        <v-list max-width="300px" flat color="transparent">
          <v-list-item to="/" link>
            <v-list-item-avatar rounded="0">
              <img src="~/static/distributed.png" />
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>برنامج التوزيع</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-spacer />

        <v-list
          dense
          nav
          width="70%"
          color="transparent"
          class="d-flex align-center justify-space-around"
        >
          <v-list-item
            v-for="item in items"
            :key="item.title"
            :to="item.to"
            link
            style="margin: 0 10px"
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-spacer />

        <v-menu
          v-if="$auth.loggedIn"
          class="pa-0"
          transition="slide-y-transition"
        >
          <template #activator="{ on, attrs }">
            <v-list dense nav elevation="0" class="pa-0" color="transparent">
              <v-list-item v-bind="attrs" v-on="on">
                <v-list-item-avatar>
                  <v-icon>person</v-icon>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title>{{
                    $auth.user.userName
                  }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </template>

          <v-list>
            <v-list-item @click="logout()">
              <v-list-item-title>تسجيل الخروج</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-container>
    </v-app-bar>

    <v-main class="mt-15">
      <v-container>
        <transition name="slide-y-reverse-transition">
          <Nuxt />
        </transition>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'home',
          title: 'الرئيسية',
          to: '/',
        },
        {
          icon: 'people_alt',
          title: 'الاساتذة',
          to: '/teachers',
        },
        {
          icon: 'meeting_room',
          title: 'القاعات',
          to: '/halls',
        },
        {
          icon: 'dashboard',
          title: 'التوزيع',
          to: '/distribute',
        },
      ],
      title: 'Vuetify.js',
    }
  },

  mounted() {
    this.$auth.$storage.syncUniversal(
      'user',
      this.$auth.$storage.getUniversal('user')
    )
  },

  methods: {
    async logout() {
      try {
        if (confirm('تسجيل الخروج ؟')) {
          const logout = await this.$auth.logout()
          console.log(logout)
          this.$toast.success('تم تسجيل الخروج بنجاح')
        }
      } catch (error) {
        console.log(error)
      }
    },
  },
}
</script>
