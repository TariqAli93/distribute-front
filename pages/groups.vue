<template>
  <div class="name-page">
    <v-card elevation="6" class="pa-5 mb-10">
      <v-card-title>
        <h3>البحث عن مجموعة</h3>
        <v-spacer />
        <v-chep color="primary" elevation="6">
          المجموعات: {{ items.length }}
        </v-chep>
      </v-card-title>

      <v-divider />

      <v-text-field
        v-model="search"
        class="mt-5"
        label="ابحث في المجموعات"
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
          <v-toolbar-title>تحديث المجموعة</v-toolbar-title>

          <v-spacer />
          <v-btn icon color="white" @click="closeUpdate">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-form
          v-model="updateForm"
          ref="updateRef"
          lazy-validation
          @submit.prevent="updateGroup"
        >
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="groupName"
                label="اسم المجموعة"
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
            :disabled="!updateForm"
            >حفظ</v-btn
          >
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
                  انشاء مجموعة جديدة
                </v-btn>
              </template>

              <v-card elevation="6" color="primary" class="pa-10">
                <v-toolbar
                  color="secondary"
                  elevation="6"
                  rounded
                  class="mb-10"
                >
                  <v-toolbar-title>انشاء مجموعة جديدة</v-toolbar-title>
                  <v-spacer />
                  <v-btn icon color="white" @click="createDialog = false">
                    <v-icon>close</v-icon>
                  </v-btn>
                </v-toolbar>

                <v-form
                  v-model="createForm"
                  ref="createRef"
                  lazy-validation
                  @submit.prevent="createGroup"
                >
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="groupName"
                        label="اسم المجموعة"
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
                    :disabled="!createForm"
                    >حفظ</v-btn
                  >
                </v-form>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>

        <template #[`item.actions`]="{ item }">
          <v-btn icon color="warning" @click="openUpdate(item)">
            <v-icon>edit</v-icon>
          </v-btn>

          <v-btn icon color="error" @click="deleteGroup(item)">
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
      updateDialog: false,
      createDialog: false,
      createForm: false,
      updateForm: false,
      groupName: null,
      search: '',
      headers: [
        {
          text: 'ت',
          value: 'idGroup',
          sortable: false,
          align: 'start',
        },
        {
          text: 'اسم المجموعة',
          value: 'GroupName',
        },
        {
          text: 'الاجرائات',
          value: 'actions',
        },
      ],
      items: [],
      idGroup: null,
    }
  },

  mounted() {
    this.GetGroups()
  },

  methods: {
    async createGroup() {
      if (this.$refs.createRef.validate()) {
        try {
          const group = await this.$axios.post('groups/add', {
            GroupName: this.groupName,
          })

          this.$toast.success('تم انشاء المجموعة بنجاح')
          this.GetGroups()
          console.log(group.data)
          this.createDialog = false
        } catch (error) {
          console.error(error)
        }
      }
    },

    openUpdate(item) {
      this.groupName = item.GroupName
      this.idGroup = item.idGroup
      this.updateDialog = true
    },

    closeUpdate() {
      this.groupName = null
      this.updateDialog = false
    },

    async updateGroup() {
      if (this.$refs.updateRef.validate()) {
        try {
          const group = await this.$axios.patch(`group/${this.idGroup}`, {
            GroupName: this.groupName,
          })
          this.$toast.success('تم تحديث المجموعة بنجاح')
          this.GetGroups()
          this.closeUpdate()
          console.log(group.data)
        } catch (error) {
          console.error(error)
        }
      }
    },

    async deleteGroup(item) {
      if (confirm('هل تريد حذف المجموعة ؟')) {
        try {
          const group = await this.$axios.delete(`group/${item.idGroup}`)
          this.$toast.success('تم حذف المجموعة بنجاح')
          this.GetGroups()
          console.log(group.data)
        } catch (error) {
          console.error(error)
        }
      }
    },

    async GetGroups() {
      try {
        const groups = await this.$axios.get('groups')
        this.items = groups.data
        console.table(groups.data)
      } catch (error) {
        console.error(error)
      }
    },
  },
}
</script>

<style>
</style>
