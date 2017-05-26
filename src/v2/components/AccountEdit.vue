<template>
    <div class="ui container">
        <div class="ui center aligned basic segment">
            <div class="ui fluid card" v-if="account">
                <div class="content">
                    <div class="header">{{account.name}}</div>
                </div>
                <div class="content">
                    <div class="ui sub header">
                        <i class="mail icon"></i>{{account.email}}</div>
                    <div class="meta">
                        <i class="user icon"></i>{{account.role}}</div>
                    <div class="meta">
                        <i class="calendar icon"></i>{{account.createdAt | moment}}</div>
                </div>
                <div class="extra content">
                    <form class="ui equal width form" :class="{loading: pending, error, success}" @submit.prevent="update(context).then(postUpdate)">
                        <div class="fields">
                            <div class="field">
                                <label>姓</label>
                                <input v-model="lastName" type="text">
                            </div>
                            <div class="field">
                                <label>名</label>
                                <input v-model="firstName" type="text">
                            </div>
                        </div>
                        <div class="fields">
                            <div class="field">
                                <label>修改密码</label>
                                <input v-model="password" type="password">
                            </div>
                        </div>
                        <div class="fields">
                            <div class="field" :class="{disabled: !password}">
                                <label>确认密码</label>
                                <input v-model="repeatPassword" type="password">
                            </div>
                        </div>
                        <button class="ui button" :class="{disabled: !valid}" type="submit">更新</button>
                        <message :variation="'error'">
                            <div class="header">操作失败</div>
                            <p>{{ error }}</p>
                        </message>
                        <message :variation="'success'">
                            <div class="header">操作成功</div>
                        </message>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment';
import { mapGetters, mapActions } from 'vuex';

export default {
    data() {
        return {
            firstName: null,
            lastName: null,
            password: null,
            repeatPassword: null
        }
    },
    computed: {
        ...mapGetters(['account', 'pending', 'error', 'success']),
        valid() {
            return this.account && (!this.account.profile || this.firstName !== this.account.profile.firstName || this.lastName !== this.account.profile.lastName) && this.password === this.repeatPassword && (this.firstName || this.lastName || this.password);
        },
        context() {
            const context = { firstName: this.firstName, lastName: this.lastName };
            if (this.password) {
                context.password = this.password;
            }
            return context;
        }
    },
    methods: {
        ...mapActions('users', ['show']),
        ...mapActions(['update']),
        postUpdate() {
            this.sync();
        },
        sync() {
            this.firstName = this.account && this.account.profile && this.account.profile.firstName;
            this.lastName = this.account && this.account.profile && this.account.profile.lastName;
            this.password = null;
            this.repeatPassword = null;
        }
    },
    filters: {
        moment(date) {
            return moment(date).format('L');
        }
    },
    updated() {
        $('.buttons>a').popup({
            position: 'bottom center'
        });
    },
    created() {
        this.sync();
    }
}
</script>

<style scoped>
.ui.segment {
    max-width: 640px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 64px;
    padding: 32px 64px;
}
</style>