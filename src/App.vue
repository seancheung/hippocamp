<template>
  <div id="app">
    <img src="./assets/logo.png">
    <b-nav tabs>
      <b-nav-item to='/' active>Home</b-nav-item>
      <b-nav-item to='/login'>Login</b-nav-item>
    </b-nav>
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
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
