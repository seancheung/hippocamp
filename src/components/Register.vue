<template>
    <div class="ui main middle aligned center aligned grid">
        <div class="column">
            <h2 class="ui blue icon header"><i class="add user icon"></i><div class="content">用户注册</div></h2>
            <form class="ui large form" @submit.prevent="register" :class="{loading, success, error}">
                <div class="ui raised segment">
                    <div class="field">
                        <div class="ui left icon input">
                            <i class="user icon"></i>
                            <input type="text" name="name" v-model="name" placeholder="用户名">
                        </div>
                    </div>
                    <div class="field">
                        <div class="ui left icon input">
                            <i class="mail icon"></i>
                            <input type="text" name="email" v-model="email" placeholder="邮箱">
                        </div>
                    </div>
                    <div class="field">
                        <div class="ui left icon input">
                            <i class="lock icon"></i>
                            <input type="password" name="password" v-model="password" placeholder="密码">
                        </div>
                    </div>
                    <div class="field">
                        <div class="ui left icon input">
                            <i class="lock icon"></i>
                            <input type="password" name="confirm" v-model="confirm" placeholder="确认密码">
                        </div>
                    </div>
                    <button class="ui fluid large blue submit button" type="submit">注册</button>
                </div>
    
                <div class="ui success message">
                    <div class="header">注册成功</div>
                    <p>{{ message }}</p>
                </div>
                <div class="ui error message">
                    <div class="header">注册失败</div>
                    <p>{{ message }}</p>
                </div>
    
            </form>
            <div class="ui basic segment" :class="{disabled:loading}">
                <div class="ui message">
                    已有账号?
                    <router-link :to="{name: 'Login'}">现在登录</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
"use strict";

export default {
    name: 'Register',
    data() {
        return {
            name: '',
            email: '',
            password: '',
            confirm: '',
            success: false,
            loading: false,
            error: false,
            message: ''
        }
    },
    methods: {
        register() {
            this.loading = true;
            this.$http.post('/api/v1/auth/register', {
                name: this.name,
                email: this.email,
                password: this.password
            }).then(res => {
                this.loading = false;
                if (res.body.success) {
                    this.success = true;
                    this.error = false;
                    this.$router.push('/login');
                }
                else {
                    this.success = false;
                    this.error = true;
                    this.message = res.body.message;
                }
                this.show = true;
            }).catch(err => {
                this.loading = false;
                this.success = false;
                this.error = true;
                this.message = err.statusText;
            });
        }
    },
    mounted() {
        $('.ui.form').form({
            fields: {
                name: {
                    identifier: 'name',
                    rules: [
                        {
                            type: 'empty',
                            prompt: '请输入用户名'
                        }
                    ]
                },
                email: {
                    identifier: 'email',
                    rules: [
                        {
                            type: 'email',
                            prompt: '请输入合法邮箱'
                        }
                    ]
                },
                password: {
                    identifier: 'password',
                    rules: [
                        {
                            type: 'empty',
                            prompt: '请输入密码'
                        }
                    ]
                },
                confirm: {
                    identifier: 'confirm',
                    rules: [
                        {
                            type: 'empty',
                            prompt: '请确认密码'
                        }
                    ]
                }

            }
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