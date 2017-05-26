<template>
    <div class="ui main middle aligned center aligned grid">
        <div class="column">
            <div v-if="!loading">
                <h2 class="ui blue icon header"><i class="user icon"></i><div class="content">用户登陆</div></h2>
                <form class="ui large form" @submit.prevent="login({account: username, password}).finally(tryRedirect)" :class="{loading:pending, error:error}">
                    <div class="ui raised segment">
                        <div class="field">
                            <div class="ui left icon input">
                                <i class="user icon"></i>
                                <input type="text" v-model="username" placeholder="用户名/邮箱">
                            </div>
                        </div>
                        <div class="field">
                            <div class="ui left icon input">
                                <i class="lock icon"></i>
                                <input type="password" v-model="password" placeholder="密码">
                            </div>
                        </div>
                        <button class="ui fluid large blue submit button" type="submit">登陆</button>
                    </div>
    
                    <message :variation="'error'">
                        <div class="header">登陆失败</div>
                        <p>{{ error }}</p>
                    </message>
    
                </form>
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
            username: null,
            password: null,
            loading: false
        }
    },
    computed: mapGetters(['account', 'error', 'pending', 'route']),
    methods: {
        ...mapActions(['login', 'auth']),
        tryRedirect() {
            if (this.account) {
                this.$router.push(this.route || { name: 'Account' });
            }
        }
    },
    created() {
        this.loading = true;
        this.auth()
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