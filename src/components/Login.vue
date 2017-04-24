<template>
    <div class="ui center aligned grid container">
        <div class="center aligned sixteen wide mobile eight wide tablet six wide computer column">
            <form class="ui form" @submit.prevent="login" :class="{loading, success, error}">
                <div class="field">
                    <label>用户名/邮箱</label>
                    <input type="text" name="account" v-model="account" placeholder="用户名/邮箱">
                </div>
                <div class="field">
                    <label>密码</label>
                    <input type="password" name="password" v-model="password" placeholder="密码">
                </div>
                <div class="ui success message">
                    <div class="header">登录成功</div>
                    <p>{{ message }}</p>
                </div>
                <div class="ui error message">
                    <div class="header">登陆失败</div>
                    <p>{{ message }}</p>
                </div>
                <button class="ui button" type="submit">登陆</button>
            </form>
        </div>
    </div>
</template>

<script>
"use strict";

export default {
    name: 'Login',
    data() {
        return {
            account: '',
            password: '',
            success: false,
            loading: false,
            error: false,
            message: ''
        }
    },
    methods: {
        login() {
            this.loading = true;
            this.$http.post('/api/v1/auth/login', {
                account: this.account,
                password: this.password
            }).then(res => {
                this.loading = false;
                if (res.body.success) {
                    this.success = true;
                    this.error = false;
                    this.$store.commit('auth', res.body.token);
                    this.$router.push('/');
                }
                else {
                    this.success = false;
                    this.error = true;
                    this.message = res.body.message;
                }
                this.show = true;
            });
        }
    }
}
</script>

<style scoped>
div.grid.container {
    margin-top: 60px;
}
</style>