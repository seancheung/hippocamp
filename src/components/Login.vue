<template>
    <div class="ui main middle aligned center aligned grid">
        <div class="column">
            <div v-if="!loading">
                <h2 class="ui blue icon header"><i class="user icon"></i><div class="content">用户登陆</div></h2>
                <form class="ui large form" @submit.prevent="login" :class="{loading:waiting, success, error}">
                    <div class="ui raised segment">
                        <div class="field">
                            <div class="ui left icon input">
                                <i class="user icon"></i>
                                <input type="text" name="account" v-model="account" placeholder="用户名/邮箱">
                            </div>
                        </div>
                        <div class="field">
                            <div class="ui left icon input">
                                <i class="lock icon"></i>
                                <input type="password" name="password" v-model="password" placeholder="密码">
                            </div>
                        </div>
                        <button class="ui fluid large blue submit button" type="submit">登陆</button>
                    </div>
    
                    <div class="ui success message">
                        <div class="header">登录成功</div>
                        <p>{{ message }}</p>
                    </div>
                    <div class="ui error message">
                        <div class="header">登陆失败</div>
                        <p>{{ message }}</p>
                    </div>
    
                </form>
                <div class="ui basic segment" :class="{disabled:waiting}">
                    <div class="ui message">
                        新用户?
                        <router-link :to="{name: 'Register'}">立即注册</router-link>
                    </div>
                </div>
            </div>
            <div class="ui inverted dimmer" :class="{active:loading}">
                <div class="ui indeterminate text loader">加载中</div>
            </div>
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
            waiting: false,
            error: false,
            message: '',
            jwt: null
        }
    },
    methods: {
        setState(success, message = '') {
            this.success = success;
            this.error = !success;
            this.message = message;
        },

        getProfile(jwt) {
            this.$http.get('/api/v1/account', {
                headers: { 'Authorization': jwt }
            })
                .then(res => {
                    this.$store.commit('grant', {
                        jwt,
                        profile: res.body
                    });
                    this.$cookie.set('jwt', jwt, {
                        expires: '7D'
                    });
                    this.setState(true);
                    this.$router.push({ name: 'Dashboard' });
                    this.waiting = false;
                })
                .catch(err => {
                    this.waiting = false;
                    this.setState(false, err.statusText);
                });
        },

        login() {
            if (!this.account) {
                return this.setState(false, '请输入用户名或邮箱');
            }
            if (!this.password) {
                return this.setState(false, '请输入密码');
            }
            this.waiting = true;
            this.$http.post('/api/v1/auth/login', {
                account: this.account,
                password: this.password
            })
                .then(res => {
                    if (res.body.success) {
                        this.getProfile(res.body.token);
                    }
                    else {
                        this.waiting = false;
                        this.setState(false, res.body.message);
                    }
                })
                .catch(err => {
                    this.waiting = false;
                    this.setState(false, err.statusText);
                });
        }
    },
    mounted() {
        this.loading = true;
        const jwt = this.$cookie.get('jwt');
        if (!jwt) {
            this.loading = false;
        }
        else {
            this.$http.get('/api/v1/account', {
                headers: { 'Authorization': jwt }
            })
                .then(res => {
                    this.$store.commit('grant', {
                        jwt,
                        profile: res.body
                    });
                    this.$router.push({ name: 'Dashboard' });
                    this.loading = false;
                })
                .catch(err => {
                    this.loading = false;
                });
        }
    }
}
</script>

<style scoped>
.ui.main.grid {
    height: 100%;
}

.column {
    max-width: 450px;
}
</style>