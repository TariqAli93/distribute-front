<template>
  <div class="distribute-page">
    <v-card elevation="6" class="pa-5 mb-10">
      <v-card-title>
        <h3>توزيع الاساتذة</h3>
      </v-card-title>

      <v-divider />
      <v-form
        v-model="distributeForm"
        ref="distributeRef"
        lazy-validation
        @submit.prevent="distribute"
      >
        <v-row class="mt-5">
          <v-col cols="12" sm="12" md="6" lg="6" xl="6">
            <v-select
              v-model="theGroup"
              :items="groups"
              label="المجموعة"
              item-color="white"
              color="white"
              outlined
              item-text="GroupName"
              item-value="idGroup"
              :rules="[(v) => !!v || 'لا يمكن ترك الحقل فارغ']"
              return-object
            ></v-select>
          </v-col>
          <v-col cols="12" sm="12" md="6" lg="6" xl="6">
            <v-select
              v-model="theHalls"
              :items="halls"
              label="القاعات"
              item-color="white"
              color="white"
              outlined
              item-text="HallName"
              item-value="idHall"
              :rules="[(v) => v.length > 0 || 'لا يمكن ترك الحقل فارغ']"
              return-object
              multiple
            ></v-select>
          </v-col>
        </v-row>

        <v-btn
          block
          large
          color="primary"
          :disabled="!distributeForm"
          type="submit"
        >
          <span>توزيع</span>
        </v-btn>
      </v-form>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'DistributePage',
  data() {
    return {
      distributeForm: false,
      theGroup: '',
      theHalls: [],
      teachers: [],
      halls: [],
      groups: [],
      distributed: [],
    }
  },

  mounted() {
    this.GetTeachers()
    this.GetHalls()
    this.GetGroups()
  },

  methods: {
    async GetTeachers() {
      try {
        const teachers = await this.$axios.get('teachers')
        this.teachers = teachers.data
        console.log(teachers.data)
      } catch (error) {
        console.error(error)
      }
    },
    async GetHalls() {
      try {
        const halls = await this.$axios.get('halls')
        this.halls = halls.data
        console.log(halls.data)
      } catch (error) {
        console.error(error)
      }
    },
    async GetGroups() {
      try {
        const groups = await this.$axios.get('groups')
        this.groups = groups.data
      } catch (error) {
        console.error(error)
      }
    },

    distribute() {
      if (this.$refs.distributeRef.validate()) {
        console.log({ halls: this.theHalls, group: this.theGroup })
        const selectedHalls = this.theHalls

        const distributed = [
          
        ]

        // for (let i = 0; i < selectedHalls.length; i++) {
        //   distributed.push({
        //     group: this.theGroup.GroupName,
        //     leader: this.teachers.map((teacher) => {
        //       return (
        //         teacher.role.rolePriority ===
        //         this.teachers.reduce(
        //           (prev, curr) =>
        //             prev < curr.role.rolePriority
        //         )
        //       )
        //     }),
        //   })

        //   console.log(distributed)
        // }
      }
    },
  },
}
</script>

<style>
</style>
