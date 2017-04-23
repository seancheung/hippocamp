<template>
  <div class="container">
    <h1>Login</h1>
    <form>
      <b-form-fieldset label="用户名">
        <b-form-input v-model="name" type="text" placeholder="用户名" :variant="name?'success':'warning'"></b-form-input>
      </b-form-fieldset>
      <b-form-fieldset label="密码">
        <b-form-input v-model="password" type="password" placeholder="密码" :variant="password?'success':'warning'"></b-form-input>
      </b-form-fieldset>
    </form>
    <b-button @click="login">
      Sign In
    </b-button>
    <b-alert variant="danger" dismissible :show="show" @dismissed="show=false">
      {{message}}
    </b-alert>
  </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      name: '',
      password: '',
      message: '',
      show: false
    }
  },
  methods: {
    login() {
      this.$http.post('/api/v1/auth', {
        account: this.name,
        password: this.password
      }).then(res => {
        console.log(res.body);
        if (res.body.success) {
          this.message = 'Success';
          this.$router.push('/');
        }
        else {
          this.message = res.body.message;
        }
        this.show = true;
      });
    }
  },
  mounted() {

  },
  computed: {
  }
}
</script>