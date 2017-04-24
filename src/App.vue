<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {

    }
  },
  methods: {

  },
  mounted() {
    $('a.nav-link').on("click", function () {
      $('a.active').removeClass('active');
      $(this).addClass('active');
    });
  }
}
</script>

<style>

</style>
