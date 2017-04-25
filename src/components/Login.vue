<template>
    <div class="ui main middle aligned center aligned grid">
        <div class="column">
            <h2 class="ui blue icon header"><i class="user icon"></i><div class="content">用户登陆</div></h2>
            <form class="ui large form" @submit.prevent="login" :class="{loading, success, error}">
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
            <div class="ui message">
                新用户? <a href="#">立即注册</a>
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
                    this.$store.commit('grant', res.body.token);
                    this.$cookie.set('jwt', res.body.token, {
                        expires: '7D'
                    });
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
.ui.main.grid {
    height: 100%;
}

.column {
    max-width: 450px;
}
</style>