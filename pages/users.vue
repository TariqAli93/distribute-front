<template>
  <div class="name-page">
    <v-card elevation="6" class="pa-5 mb-10">
      <v-card-title>
        <h3>البحث...</h3>
        <v-spacer />
        <v-chep color="primary" elevation="6"> رقم: 0 </v-chep>
      </v-card-title>

      <v-divider />

      <v-text-field
        v-model="search"
        class="mt-5"
        label="ابحث..."
        color="white"
        hide-details
      ></v-text-field>
    </v-card>

    <v-dialog
      v-model="dialog"
      persistent
      max-width="750px"
      transition="slide-y-transition"
    >
      <v-card elevation="6" color="primary" class="pa-10">
        <v-toolbar color="secondary" elevation="6" rounded class="mb-10">
          <v-toolbar-title>dialog</v-toolbar-title>

          <v-spacer />
          <v-btn icon color="white" @click="dialog = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-form>
          <v-row>
            <v-col cols="12">
              <v-text-field
                label="label"
                outlined
                color="white"
                :rules="[(v) => !!v || 'لا يمكن ترك الحقل فارغ']"
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-text-field
                label="label"
                outlined
                color="white"
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
            <v-toolbar-title>title</v-toolbar-title>

            <v-spacer />

            <v-dialog
              v-model="dialog2"
              persistent
              max-width="750px"
              transition="slide-y-transition"
            >
              <template #activator="{ on, attrs }">
                <v-btn
                  color="secondary"
                  elevation="6"
                  v-bind="attrs"
                  @click="dialog2 = true"
                  v-on="on"
                >
                  open dialog 2
                </v-btn>
              </template>

              <v-card elevation="6" color="primary" class="pa-10">
                <v-toolbar
                  color="secondary"
                  elevation="6"
                  rounded
                  class="mb-10"
                >
                  <v-toolbar-title>dialog 2</v-toolbar-title>
                  <v-spacer />
                  <v-btn icon color="white" @click="dialog2 = false">
                    <v-icon>close</v-icon>
                  </v-btn>
                </v-toolbar>

                <v-form>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        label="اسم الاستاذ"
                        outlined
                        color="white"
                        :rules="[(v) => !!v || 'لا يمكن ترك الحقل فارغ']"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12">
                      <v-text-field
                        label="اسم الاستاذ"
                        outlined
                        color="white"
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
                    >حفظ</v-btn
                  >
                </v-form>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>

        <template #[`item.actions`]>
          <v-btn icon color="warning">
            <v-icon>edit</v-icon>
          </v-btn>

          <v-btn icon color="error">
            <v-icon>delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'GroupPage',
  data() {
    return {
      dialog: false,
      dialog2: false,
      search: '',
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
          text: 'اختصار اللقب',
          value: 'role.rolePrefix',
        },
        {
          text: 'اللقب العلمي',
          value: 'role.roleName',
        },
        {
          text: 'الاولوية في التوزيع',
          value: 'role.rolePriority',
        },
        {
          text: 'الاجرائات',
          value: 'actions',
        },
      ],
      items: [],
    }
  },
}
</script>

<style>
</style>
