<template>
  <div class="distribute-page">
    <v-card elevation="6" class="pa-5 mb-10">
      <v-card-title>
        <h3>توزيع الاساتذة</h3>
      </v-card-title>

      <v-divider />
      <v-form
        ref="distributeRef"
        v-model="distributeForm"
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
// import _ from 'lodash'
const ExcelJS = require('exceljs')
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
      } catch (error) {
        console.error(error)
      }
    },
    async GetHalls() {
      try {
        const halls = await this.$axios.get('halls')
        this.halls = halls.data
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
      // array of chiefs
      const chiefs = this.teachers.filter((teacher) => teacher.role === 'CHIEF')

      // array of assistants
      const assistants = this.teachers.filter(
        (teacher) => teacher.role === 'ASSISTANT'
      )

      // array of remaining chiefs
      let remainingChiefs = []

      // array of remaining assistants
      let remainingAssistants = []

      const eachHall = []
      const randomChief = Math.floor(Math.random() * chiefs.length)

      for (let i = 0; i < this.theHalls.length; i++) {
        const HallContainment = this.theHalls[i].HallContainment
        const assistant = []
        let assistantsIndex = null
        const chiefsIndex = chiefs.indexOf(chiefs[randomChief])

        for (let j = 0; j < HallContainment - 1; j++) {
          const randomAssistants = Math.floor(Math.random() * assistants.length)
          assistantsIndex = assistants[randomAssistants]
          assistant.push(assistants[randomAssistants])
        }

        eachHall.push({
          HallName: this.theHalls[i].HallName,
          chief: chiefs[randomChief],
          assistants: assistant,
        })

        chiefs.splice(chiefsIndex, 1)
        assistants.splice(assistantsIndex, 1)
      }

      remainingChiefs = chiefs
      remainingAssistants = assistants

      const toExport = {
        group: this.theGroup,
        hall: eachHall,
        remaining: {
          chiefs: remainingChiefs,
          assistants: remainingAssistants,
        },
      }

      const workbook = new ExcelJS.Workbook()
      const sheet = workbook.addWorksheet('توزيع الاساتذة', {
        properties: { tabColor: { argb: 'FF00FF00' } },
      })

      sheet.columns = [
        { header: 'القاعة', key: 'HallName', width: 10, outlineLevel: 1 },
        { header: 'رئيس القاعة', key: 'cheifs', width: 32, outlineLevel: 1 },
        { header: 'المساعد', key: 'assistants', width: 10, outlineLevel: 1 },
      ]

      const newRows = sheet.addRows(eachHall)

      console.log(toExport);
      console.log(newRows);
    },
  },
}
</script>

<style>
</style>
