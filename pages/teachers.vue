<template>
  <div class="teachers-page">
    <v-card elevation="6" class="pa-5 mb-10">
      <v-card-title>
        <h3>البحث عن استاذ</h3>
        <v-spacer />
        <v-chip color="primary" elevation="6">
          مجموع الاساتذة: {{ teacherCount }}
        </v-chip>
      </v-card-title>

      <v-divider />

      <v-text-field
        v-model="search"
        class="mt-5"
        label="ابحث في الاساتذة..."
        color="white"
        hide-details
      ></v-text-field>
    </v-card>

    <v-dialog
      v-model="updateDialog"
      persistent
      max-width="750px"
      transition="slide-y-transition"
    >
      <v-card elevation="6" color="primary" class="pa-10">
        <v-toolbar color="secondary" elevation="6" rounded class="mb-10">
          <v-toolbar-title>تحديث الاستاذ</v-toolbar-title>

          <v-spacer />
          <v-btn icon color="white" @click="CloseUpdateDialog">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-form
          ref="updateFormRef"
          v-model="updateForm"
          lazy-validation
          @submit.prevent="UpdateTeacher"
        >
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="teacherName"
                label="اسم الاستاذ"
                outlined
                color="white"
                :rules="[(v) => !!v || 'لا يمكن ترك الحقل فارغ']"
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-select
                v-model="role"
                :items="roles"
                item-color="white"
                label="الصلاحيات"
                outlined
                color="white"
                :rules="[(v) => !!v || 'لا يمكن ترك الحقل فارغ']"
              ></v-select>
            </v-col>
          </v-row>

          <v-btn
            large
            block
            color="secondary"
            class="white--text"
            type="submit"
            :disabled="!updateForm"
          >
            حفظ المعلومات
          </v-btn>
        </v-form>
      </v-card>
    </v-dialog>

    <v-card elevation="6" class="pa-10">
      <v-data-table :headers="headers" :items="items" :search="search">
        <template #top>
          <v-toolbar color="primary" elevation="6" class="mb-10" rounded>
            <v-toolbar-title>الاساتذة</v-toolbar-title>

            <v-spacer />

            <v-dialog
              v-model="createDialog"
              persistent
              max-width="750px"
              transition="slide-y-transition"
            >
              <template #activator="{ on, attrs }">
                <v-btn
                  color="secondary"
                  elevation="6"
                  v-bind="attrs"
                  @click="createDialog = true"
                  v-on="on"
                >
                  ادخال استاذ جديد
                </v-btn>
              </template>

              <v-card elevation="6" color="primary" class="pa-10">
                <v-toolbar
                  color="secondary"
                  elevation="6"
                  rounded
                  class="mb-10"
                >
                  <v-toolbar-title>اضافة استاذ جديد</v-toolbar-title>
                  <v-spacer />
                  <v-btn icon color="white" @click="createDialog = false">
                    <v-icon>close</v-icon>
                  </v-btn>
                </v-toolbar>

                <v-form
                  ref="createFormRef"
                  v-model="createForm"
                  lazy-validation
                  @submit.prevent="CreateTeachers"
                >
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="teacherName"
                        label="اسم الاستاذ"
                        outlined
                        color="white"
                        :rules="[(v) => !!v || 'لا يمكن ترك الحقل فارغ']"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12">
                      <v-select
                        v-model="role"
                        :items="roles"
                        item-color="white"
                        label="الصلاحيات"
                        outlined
                        color="white"
                        :rules="[(v) => !!v || 'لا يمكن ترك الحقل فارغ']"
                      ></v-select>
                    </v-col>
                  </v-row>

                  <v-btn
                    large
                    block
                    color="secondary"
                    class="white--text"
                    type="submit"
                    :disabled="!createForm"
                    >اضافة الاستاذ</v-btn
                  >
                </v-form>
              </v-card>
            </v-dialog>

            <v-btn icon color="success" class="mr-5" @click="uploadHandler">
              <v-icon>cloud_upload</v-icon>
            </v-btn>

            <input
              ref="excelFile"
              type="file"
              class="d-none"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              @change="uploadTheExcel"
            />
          </v-toolbar>
        </template>

        <template #[`item.role.rolePriority`]="{ item }">
          <v-chip color="primary" elevation="6">
            <span>{{ item | getRole }}</span>
          </v-chip>
        </template>

        <template #[`item.actions`]="{ item }">
          <v-btn icon color="warning" @click="OpenUpdateDialog(item)">
            <v-icon>edit</v-icon>
          </v-btn>

          <v-btn icon color="error" @click="DeleteTeacher(item)">
            <v-icon>delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'TeacherPage',

  filters: {
    getRole(item) {
      return item.role === 'CHIEF' ? 'مدير قاعة' : 'مساعد مدير'
    },
  },
  data() {
    return {
      headers: [
        {
          text: 'ت',
          value: 'idTeacher',
          sortable: false,
          align: 'start',
        },
        {
          text: 'اسم الاستاذ',
          value: 'teacherName',
        },
        {
          text: 'الصلاحيات',
          value: 'role.rolePriority',
        },
        {
          text: 'الاجرائات',
          value: 'actions',
        },
      ],
      items: [],
      roles: [
        { text: 'مدير قاعة', value: 'CHIEF' },
        { text: 'مساعد', value: 'ASSISTANT' },
      ],
      role: null,
      teacherName: null,
      createDialog: false,
      updateDialog: false,
      createForm: false,
      updateForm: false,
      search: null,
      idTeacher: null,
      teacherCount: 0,
    }
  },

  mounted() {
    this.GetTeachers()
  },

  methods: {
    uploadHandler() {
      this.$refs.excelFile.click()
    },

    uploadTheExcel() {
      const File = this.$refs.excelFile.files[0]
      const Form = new FormData()
      Form.append('excel', File)

      this.$axios
        .post('upload-teacher', Form)
        .then((result) => {
          this.$toast.success('تم رفع الملف و اضافة الاساتذة بنجاح')
          console.log(result)
          this.GetTeachers()
        })
        .catch((err) => {
          console.log(err)
        })
    },

    async GetTeachers() {
      try {
        const getTeachers = await this.$axios.get('/teachers')
        this.items = getTeachers.data.reverse()
        this.teacherCount = getTeachers.data.length
      } catch (error) {
        console.error(error)
      }
    },

    async CreateTeachers() {
      if (this.$refs.createFormRef.validate()) {
        try {
          const teacher = await this.$axios.post('/teachers/add', {
            teacherName: this.teacherName,
            role: this.role,
          })
          console.log(
            '🚀 ~ file: teachers.vue ~ line 200 ~ CreateTeachers ~ teacher',
            teacher.data
          )
          this.$toast.success('تم حفظ ملف الاستاذ')
          this.GetTeachers()
          this.createDialog = false
          this.$refs.createFormRef.reset()
        } catch (error) {
          console.log(
            '🚀 ~ file: teachers.vue ~ line 203 ~ CreateTeachers ~ error',
            error
          )
        }
      }
    },

    OpenUpdateDialog(item) {
      this.updateDialog = true
      this.teacherName = item.teacherName
      this.role = item.role
      this.idTeacher = item.idTeacher
    },

    CloseUpdateDialog() {
      this.$refs.updateFormRef.reset()

      this.teacherName = null
      this.role = null
      this.idTeacher = null
      this.updateDialog = false
    },

    async UpdateTeacher() {
      if (this.$refs.updateFormRef.validate()) {
        try {
          const updateTeacher = await this.$axios.patch(
            `/teacher/${this.idTeacher}`,
            {
              teacherName: this.teacherName,
              role: this.role,
            }
          )
          console.log(
            '🚀 ~ file: teachers.vue ~ line 311 ~ UpdateTeacher ~ updateTeacher',
            updateTeacher
          )
          this.$toast.success('تم تحديث ملف الاستاذ بنجاح')
          this.CloseUpdateDialog()
          this.GetTeachers()
        } catch (error) {
          console.log(
            '🚀 ~ file: teachers.vue ~ line 314 ~ UpdateTeacher ~ error',
            error
          )
        }
      }
    },

    async DeleteTeacher(item) {
      console.log(
        '🚀 ~ file: teachers.vue ~ line 219 ~ DeleteTeacher ~ item',
        item
      )

      try {
        if (confirm('هل تريد حذف الاستاذ')) {
          const deleteTeacher = await this.$axios.delete(
            `/teacher/${item.idTeacher}`
          )
          console.log(
            '🚀 ~ file: teachers.vue ~ line 226 ~ DeleteTeacher ~ deleteTeacher',
            deleteTeacher
          )

          this.$toast.success('تم حذف ملف الاستاذ بنجاح')
          this.GetTeachers()
        }
      } catch (error) {
        console.log(
          '🚀 ~ file: teachers.vue ~ line 227 ~ DeleteTeacher ~ error',
          error
        )
      }
    },
  },
}
</script>

<style>
</style>
