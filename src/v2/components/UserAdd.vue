<template>
    <div class="ui container">
        <div class="ui breadcrumb">
            <router-link :to="{name: 'Orgnizations'}" class="section">组织</router-link>
            <i class="right caret icon divider"></i>
            <router-link :to="{name: 'Orgnization', params: {id}}" class="section">{{item && item.name}}</router-link>
            <i class="right angle icon divider"></i>
            <router-link :to="{name: 'Users', params: {id}}" class="section">用户</router-link>
            <i class="right angle icon divider"></i>
            <div class="active section">添加</div>
        </div>
        <div class="ui center aligned segment">
            <form class="ui equal width form" :class="{loading: pending, error, success}" @submit.prevent="create({id, context: {name, email, password, role, firstName, lastName}}).then(postCreate)">
                <div class="fields">
                    <div class="required field">
                        <label>名称</label>
                        <input v-model="name" type="text" placeholder="请输入用户名称">
                    </div>
                </div>
                <div class="fields">
                    <div class="required field">
                        <label>邮箱</label>
                        <input v-model="email" type="text" placeholder="请输入用户邮箱">
                    </div>
                </div>
                <div class="fields">
                    <div class="required field">
                        <label>密码</label>
                        <input v-model="password" type="password" placeholder="请输入用户密码">
                    </div>
                </div>
                <div class="required field">
                    <label>身份</label>
                    <select class="ui dropdown" v-model="role">
                        <option value="Member">普通成员</option>
                        <option value="Client">组织管理员</option>
                        <option value="Admin">管理员</option>
                        <option value="SuperAdmin">超级管理员</option>
                    </select>
                </div>
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
                <button class="ui button" :class="{disabled: !valid}" type="submit">添加</button>
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
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    props: ['id'],
    data() {
        return {
            name: null,
            email: null,
            password: null,
            role: 'Member',
            firstName: null,
            lastName: null
        }
    },
    computed: {
        ...mapGetters('users', ['pending', 'error', 'success']),
        ...mapGetters('orgnizations', ['item']),
        valid() {
            return this.name && this.email && this.password && this.role
        }
    },
    methods: {
        ...mapActions('users', ['create']),
        ...mapActions('orgnizations', ['show']),
        postCreate() {
            if (!this.error) {
                this.name = null;
                this.email = null;
                this.password = null;
                this.role = 'Member';
                this.firstName = null;
                this.lastName = null;
            }
        }
    },
    created() {
        this.show(this.id);
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