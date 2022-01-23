<template>
  <div class="login-page">
    <transition name="slide-y-transition">
      <v-form
        style="text-align: center"
        v-model="loginModel"
        light
        ref="loginRef"
        lazy-validation
        @submit.prevent="login"
      >
        <img
          src="~/static/distributed.png"
          style="
            width: 120px;
            height: 120px;
            margin: 0 auto;
            text-align: center;
            margin-top: -100px;
            margin-bottom: 20px;
          "
        />

        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="username"
              outlined
              color="white"
              label="اسم المستخدم"
              prepend-inner-icon="person"
              type="text"
              :rules="[(v) => !!v || 'لا يمكن ترك الحقل فارغ']"
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model="password"
              outlined
              color="white"
              label="كلمة المرور"
              prepend-inner-icon="password"
              :append-icon="showPass ? 'visibility_off' : 'visibility'"
              :type="showPass ? 'text' : 'password'"
              :rules="[(v) => !!v || 'لا يمكن ترك الحقل فارغ']"
              @click:append="showPass = !showPass"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-btn block large color="primary" class="white--text" type="submit">
          <span>تسجيل الدخول</span>
        </v-btn>
      </v-form>
    </transition>
  </div>
</template>

<script>
export default {
  layout: 'login',
  name: 'LoginPage',
  data() {
    return {
      username: null,
      password: null,
      showPass: false,
      loginModel: false,
    }
  },

  methods: {
    parseToken(token) {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
          })
          .join('')
      )
      return JSON.parse(jsonPayload)
    },

    async login() {
      try {
        this.$toast.show("تسجيل الدخول...")
        const user = await this.$auth.loginWith('local', {
          data: {
            userName: this.username,
            password: this.password,
          },
        })

        this.$auth.setUser(this.parseToken(user.data.token))
        this.$auth.strategy.token.set(user.data.token)
        this.$auth.$storage.setUniversal(
          'user',
          this.parseToken(user.data.token)
        )
        this.$toast.success('تم تسجيل الدخول بنجاح')
      } catch (e) {
        console.error(e.response)
        this.$toast.error('خطأ في تسجيل الدخول...')
      }
    },
  },
}
</script>

<style>
</style>
