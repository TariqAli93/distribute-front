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
import moment from 'moment'
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
      if (this.$refs.distributeRef.validate() && this.teachers.length > 0) {
        const workbook = new ExcelJS.Workbook()
        const worksheet = workbook.addWorksheet('جدول المراقبات - الاساتذة')
        worksheet.views = [{ rightToLeft: true }]

        worksheet.getCell(`A1`).value = 'جامعة دجلة' // Assign title to cell A1 -- THIS IS WHAT YOU'RE LOOKING FOR.
        worksheet.mergeCells('A1:F1') // Extend cell over all column headers
        worksheet.getCell(`A1`).alignment = { horizontal: 'center' } // Horizontally center your text

        worksheet.getCell(`A2`).value = `التاريخ: ${moment(new Date()).format(
          'YYYY-MM-DD'
        )}` // Assign title to cell A1 -- THIS IS WHAT YOU'RE LOOKING FOR.
        worksheet.mergeCells('A2:C2') // Extend cell over all column headers
        worksheet.getCell(`A2`).alignment = { horizontal: 'center' } // Horizontally center your text

        worksheet.getCell(`D2`).value = `المجموعة: ${this.theGroup.GroupName}` // Assign title to cell A1 -- THIS IS WHAT YOU'RE LOOKING FOR.
        worksheet.mergeCells('D2:F2') // Extend cell over all column headers
        worksheet.getCell(`D2`).alignment = { horizontal: 'center' } // Horizontally center your text

        worksheet.getRow(1).eachCell((cell) => {
          cell.font = {
            name: 'Comic Sans MS',
            family: 4,
            size: 20,
            underline: false,
            bold: true,
          }

          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {
              argb: 'cccccccc',
            },
          }
        })

        worksheet.getRow(3).values = [
          'اسم القاعة',
          'رئيس القاعة',
          'المساعد الاول',
          'المساعد الثاني',
          'المساعد الثالث',
          'المساعد الرابع',
        ]

        worksheet.columns = [
          { key: 'hallName', width: 55 },
          { key: 'chief', width: 55 },
          { key: 'assistantOne', width: 55 },
          { key: 'assistantTwo', width: 55 },
          { key: 'assistantThree', width: 55 },
          { key: 'assistantFour', width: 55 },
        ]

        worksheet.getRow(2).eachCell((cell) => {
          cell.font = {
            name: 'Comic Sans MS',
            family: 4,
            size: 11,
            underline: false,
            bold: true,
          }

          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {
              argb: 'eeeeeeee',
            },
          }
        })

        // array of chiefs
        const chiefs = this.teachers.filter(
          (teacher) => teacher.role === 'CHIEF'
        )

        // array of assistants
        const assistants = this.teachers.filter(
          (teacher) => teacher.role === 'ASSISTANT'
        )

        const eachHall = []
        // const date = moment(new Date()).format("YYYY-MM-DD")
        const randomChief = Math.floor(Math.random() * chiefs.length)

        for (let i = 0; i < this.theHalls.length; i++) {
          const HallContainment = this.theHalls[i].HallContainment
          const assistant = []
          let assistantsIndex = null
          const chiefsIndex = chiefs.indexOf(chiefs[randomChief])

          for (let j = 0; j < HallContainment - 1; j++) {
            const randomAssistants = Math.floor(
              Math.random() * assistants.length
            )
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

        // const remainingChiefs = chiefs
        // const remainingAssistants = assistants

        eachHall.forEach((hall) => {
          worksheet.addRow({
            hallName: hall.HallName,
            chief: hall.chief.teacherName,
            assistantOne: hall.assistants[0].teacherName,
            assistantTwo:
              hall.assistants.length > 1
                ? hall.assistants[1].teacherName
                : 'لا يوجد',
            assistantThree:
              hall.assistants.length > 2
                ? hall.assistants[2].teacherName
                : 'لا يوجد',
            assistantFour:
              hall.assistants.length > 3
                ? hall.assistants[3].teacherName
                : 'لا يوجد',
          })
        })

        worksheet.getRow(3).eachCell((cell) => {
          cell.font = {
            name: 'Comic Sans MS',
            family: 4,
            size: 16,
            underline: false,
            bold: true,
          }
        })

        worksheet.columns.forEach((column) => {
          column.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          }
        })

        workbook.xlsx.writeBuffer().then((data) => {
          const blob = new Blob([data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          })
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          document.body.appendChild(a)
          a.setAttribute('style', 'display: none')
          a.href = url
          a.download = `جدول المراقبات - ${this.theGroup.GroupName}.xlsx`
          a.click()
          window.URL.revokeObjectURL(url)
          a.remove()
        })
      }
    },
  },
}
</script>

<style>
</style>
