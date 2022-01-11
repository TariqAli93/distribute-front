<template>
  <div class="name-page">
    <v-card elevation="6" class="pa-5 mb-10">
      <v-card-title>
        <h3>البحث عن قاعة</h3>
        <v-spacer />
        <v-chep color="primary" elevation="6">
          مجموع القاعات: {{ hallsCount }}
        </v-chep>
      </v-card-title>

      <v-divider />

      <v-text-field
        v-model="search"
        class="mt-5"
        label="ابحث في القاعات..."
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
          <v-toolbar-title>updateDialog</v-toolbar-title>

          <v-spacer />

          <v-btn icon color="white" @click="CloseUpdateDialog">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-form
          ref="updateFormRef"
          v-model="updateForm"
          lazy-validation
          @submit.prevent="UpdateHall"
        >
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="HallName"
                label="اسم القاعة"
                outlined
                color="white"
                :rules="[(v) => !!v || 'لا يمكن ترك الحقل فارغ']"
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="HallContainment"
                label="القدرة الاستيعابية"
                outlined
                color="white"
                type="number"
                :rules="[(v) => !!v || 'لا يمكن ترك الحقل فارغ']"
              ></v-text-field>
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
            <v-toolbar-title>القاعات</v-toolbar-title>

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
                  انشاء قاعة جديدة
                </v-btn>
              </template>

              <v-card elevation="6" color="primary" class="pa-10">
                <v-toolbar
                  color="secondary"
                  elevation="6"
                  rounded
                  class="mb-10"
                >
                  <v-toolbar-title>انشاء قاعة جديدة</v-toolbar-title>
                  <v-spacer />
                  <v-btn icon color="white" @click="createDialog = false">
                    <v-icon>close</v-icon>
                  </v-btn>
                </v-toolbar>

                <v-form
                  ref="createFormRef"
                  v-model="createForm"
                  lazy-validation
                  @submit.prevent="CreateHall"
                >
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="HallName"
                        label="اسم القاعة"
                        outlined
                        color="white"
                        :rules="[(v) => !!v || 'لا يمكن ترك الحقل فارغ']"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12">
                      <v-text-field
                        v-model="HallContainment"
                        label="القدرة الاستيعابية"
                        outlined
                        color="white"
                        type="number"
                        :rules="[(v) => !!v || 'لا يمكن ترك الحقل فارغ']"
                      ></v-text-field>
                    </v-col>
                  </v-row>

                  <v-btn
                    large
                    block
                    color="secondary"
                    class="white--text"
                    type="submit"
                    :disabled="!createForm"
                  >
                    حفظ المعلومات
                  </v-btn>
                </v-form>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>

        <template #[`item.actions`]="{ item }">
          <v-btn icon color="warning" @click="OpenUpdateDialog(item)">
            <v-icon>edit</v-icon>
          </v-btn>

          <v-btn icon color="error" @click="DeleteHall(item)">
            <v-icon>delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'hallsPage',
  data() {
    return {
      updateDialog: false,
      createDialog: false,
      updateForm: false,
      createForm: false,
      search: '',
      headers: [
        {
          text: 'ت',
          value: 'idHall',
          sortable: false,
          align: 'start',
        },
        {
          text: 'اسم القاعة',
          value: 'HallName',
        },
        {
          text: 'القدرة الاستيعابية',
          value: 'HallContainment',
        },
        {
          text: 'الاجرائات',
          value: 'actions',
        },
      ],
      items: [],
      hallsCount: 0,
      HallContainment: 2,
      HallName: null,
      idHall: null,
    }
  },

  mounted() {
    this.GetHalls()
  },

  methods: {
    async GetHalls() {
      try {
        const halls = await this.$axios.get('halls')
        this.items = halls.data
        this.hallsCount = halls.data.length
      } catch (error) {
        console.error(error)
      }
    },

    OpenUpdateDialog(item) {
      this.updateDialog = true

      this.HallName = item.HallName
      this.HallContainment = item.HallContainment
      this.idHall = item.idHall
    },

    CloseUpdateDialog() {
      this.$refs.updateFormRef.reset()

      this.HallName = null
      this.HallContainment = 2
      this.idHall = null

      this.updateDialog = false
    },

    async UpdateHall() {
      if (this.$refs.updateFormRef.validate()) {
        const update = await this.$axios.patch(`hall/${this.idHall}`, {
          HallName: this.HallName,
          hallCount: this.HallContainment * 1,
        })
        console.log(
          '🚀 ~ file: halls.vue ~ line 248 ~ UpdateHall ~ update',
          update
        )

        this.$toast.success('تم حفظ المعلومات بنجاح')
        this.CloseUpdateDialog()
        this.GetHalls()
      }
    },
    async DeleteHall(item) {
      if (confirm('هل تريد حذف القاعة ؟')) {
        const remove = await this.$axios.delete(`hall/${item.idHall}`)
        console.log(
          '🚀 ~ file: halls.vue ~ line 259 ~ DeleteHall ~ remove',
          remove
        )
        this.$toast.success('تم حذف القاعة بنجاح')
        this.GetHalls()
      }
    },

    async CreateHall() {
      if (this.$refs.createFormRef.validate()) {
        const create = await this.$axios.post(`halls/add`, {
          hallName: this.HallName,
          hallCount: this.HallContainment * 1,
        })
        console.log(
          '🚀 ~ file: halls.vue ~ line 264 ~ CreateHall ~ create',
          create
        )

        this.$toast.success('تم حفظ المعلومات بنجاح')
        this.createDialog = false
        this.GetHalls()
      }
    },
  },
}
</script>

<style>
</style>
