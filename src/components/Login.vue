<template>
    <div class="ui main middle aligned center aligned grid">
        <div class="column">
            <div v-if="!loading">
                <h2 class="ui blue icon header"><i class="user icon"></i><div class="content">用户登陆</div></h2>
                <form class="ui large form" @submit.prevent="login" :class="{loading:waiting, error:loginError}">
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
    
                    <div class="ui error message">
                        <div class="header">登陆失败</div>
                        <p>{{ loginError }}</p>
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

import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'Login',
    data() {
        return {
            account: '',
            password: '',
            loading: false,
            waiting: false
        }
    },
    computed: mapGetters(['profile', 'loginError']),
    methods: {
        login() {
            this.waiting = true;
            this.$store.dispatch('login', {
                account: this.account,
                password: this.password
            })
                .finally(() => {
                    this.waiting = false;
                    this.tryRedirect();
                });
        },

        tryRedirect() {
            if (this.profile) {
                this.$router.push({ name: 'Dashboard' });
            }
        }
    },
    created() {
        this.loading = true;
        this.$store.dispatch('checkCookie')
            .finally(() => {
                this.loading = false;
                this.tryRedirect();
            });
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