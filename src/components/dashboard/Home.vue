<template>
    <div class="profile">
        <h3 class="ui top attached header">{{profile.name}}, 你好!</h3>
        <div class="ui attached piled segment">
            <div v-if="!active" class="ui grid container">
                <div class="row">
                    <div class="six wide column">
                        <div class="ui tiny header">用户名</div>
                    </div>
                    <div class="ten wide column">{{profile.name}}</div>
                </div>
                <div class="row">
                    <div class="six wide column">
                        <div class="ui tiny header">邮箱</div>
                    </div>
                    <div class="ten wide column">{{profile.email}}</div>
                </div>
                <div class="row">
                    <div class="six wide column">
                        <div class="ui tiny header">身份</div>
                    </div>
                    <div class="ten wide column">{{profile.role}}</div>
                </div>
                <div class="row">
                    <div class="six wide column">
                        <div class="ui tiny header">注册于</div>
                    </div>
                    <div class="ten wide column">{{profile.createdAt | moment}}</div>
                </div>
                <div class="row">
                    <div class="six wide column">
                        <div class="ui tiny header">修改于</div>
                    </div>
                    <div class="ten wide column">{{profile.modifiedAt | moment}}</div>
                </div>
                <div class="row">
                    <div class="six wide column">
                        <div class="ui tiny header">上次登录</div>
                    </div>
                    <div class="ten wide column">{{profile.lastLogin | moment}}</div>
                </div>
            </div>
        </div>
        <div class="ui inverted dimmer" :class="{active}">
            <div class="ui text loader">加载中</div>
        </div>
    </div>
</template>

<script>
import moment from 'moment';
export default {
    data() {
        return {
            profile: {},
            active: true
        }
    },
    filters: {
        moment(date) {
            return moment(date).format('LL');
        }
    },
    methods: {
        getProfile() {
            this.active = true;
            this.$http.get('/api/v1/users/profile')
                .then(res => {
                    this.profile = res.body;
                    this.active = false;
                })
                .catch(err => {
                    this.active = false;
                    this.$router.push('/login');
                });
        }
    },
    mounted() {
        this.getProfile();
    }
}
</script>

<style scoped>
.profile {
    margin-top: 60px;
}
</style>