<template>
  <div class="home-page">
    <v-row>
      <v-col cols="12" sm="12" md="4" lg="4" xl="4">
        <v-card elevation="6" class="pa-5 mb-10 custom__card">
          <div class="d-flex align-center">
            <v-icon>people_alt</v-icon>
            <span>الاساتذة</span>
          </div>

          <h1>{{teachersCount}}</h1>
        </v-card>
      </v-col>

      <v-col cols="12" sm="12" md="4" lg="4" xl="4">
        <v-card elevation="6" class="pa-5 mb-10 custom__card">
          <div class="d-flex align-center">
            <v-icon>people_alt</v-icon>
            <span>القاعات</span>
          </div>

          <h1>{{hallsCount}}</h1>
        </v-card>
      </v-col>

      <v-col cols="12" sm="12" md="4" lg="4" xl="4">
        <v-card elevation="6" class="pa-5 mb-10 custom__card">
          <div class="d-flex align-center">
            <v-icon>people_alt</v-icon>
            <span>المجموعات</span>
          </div>

          <h1>{{groupsCount}}</h1>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      teachersCount: null,
      hallsCount: null,
      groupsCount: null,
    }
  },

  mounted() {
    this.CountTeachers()
    this.CountHalls()
    this.CountGroups()
  },
  methods: {
    async CountTeachers() {
      try {
        const count = await this.$axios.get('countTeachers');
        this.teachersCount = count.data.count;
      } catch (error) {
        console.log(error)
      }
    },

    async CountHalls() {
      try {
        const count = await this.$axios.get('countHalls')
        this.hallsCount = count.data.count;
      } catch (error) {
        console.log(error)
      }
    },
    async CountGroups() {
      try {
        const count = await this.$axios.get('countGroups')
        this.groupsCount = count.data.count;
      } catch (error) {
        console.log(error)
      }
    },
  },
}
</script>

<style lang="scss">
.custom__card {
  i {
    font-size: 4em !important;
    margin-left: 0.7em;
  }

  span {
    font-size: 2.5em;
    font-weight: lighter;
  }

  h1 {
    font-weight: lighter;
    font-size: 5.4em;
    position: relative;
    padding-right: 0.5em;

    &:before {
      content: "";
      width: 40px;
      height: 5px;
      background: white;
      position: absolute;
      top: 50%;
      border-radius: 400px;
      right: 0;
      transform: translateY(-50%);
    }
  }
}
</style>
