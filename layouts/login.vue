<template>
  <v-app>
    <v-layout class="d-flex" style="width: 100vw; height: 100vh">
      <v-sheet
        color="secondary"
        style="
          width: 30%;
          height: 100%;
          justify-content: center;
          flex-direction: column;
        "
        class="d-flex pa-10"
      >
        <Nuxt />
      </v-sheet>

      <v-sheet
        color="primary"
        style="
          width: 70%;
          height: 100%;
          justify-content: center;
          flex-direction: column;
        "
        class="d-flex pa-10"
      >
        <h1 class="text-h1">برنامج التوزيع</h1>
        <p class="text-h4 mt-10">مرحبا بكم في برنامج التوزيع</p>
      </v-sheet>
    </v-layout>
  </v-app>
</template>

<script>
export default {
  name: 'LoginLayout',
}
</script>

<style>
</style>
