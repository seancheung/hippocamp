<template>
    <div class="ui container">
        <div class="ui breadcrumb">
            <router-link :to="{name: 'Orgnizations'}" class="section">组织</router-link>
            <i class="right caret icon divider"></i>
            <router-link v-if="item" :to="{name: 'Orgnization', params: {id: item.org._id}}" class="section">{{item.org.name}}</router-link>
            <i class="right angle icon divider"></i>
            <router-link v-if="item" :to="{name: 'Users', params: {id: item.org._id}}" class="section">用户</router-link>
            <i class="right caret icon divider"></i>
            <router-link :to="{name: 'User', params: {id}}" class="section">{{item && item.name}}</router-link>
            <i class="right angle icon divider"></i>
            <div class="active section">编辑</div>
        </div>
        <div class="ui center aligned segment">
            <form class="ui equal width form" :class="{loading: pending, error, success}" @submit.prevent="update({id, context: {role, firstName, lastName}}).then(postUpdate)">
                <div class="fields">
                    <div class="disabled field">
                        <label>名称</label>
                        <input :value="item && item.name" type="text">
                    </div>
                </div>
                <div class="fields">
                    <div class="disabled field">
                        <label>邮箱</label>
                        <input :value="item && item.email" type="text">
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
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    props: ['id'],
    data() {
        return {
            role: null,
            firstName: null,
            lastName: null
        }
    },
    computed: {
        ...mapGetters('users', ['item', 'pending', 'error', 'success']),
        valid() {
            return this.item && (this.role != this.item.role || !this.item.profile || this.firstName != this.item.profile.firstName || this.lastName != this.item.profile.lastName)
        }
    },
    methods: {
        ...mapActions('users', ['show', 'update']),
        postUpdate() {
            this.sync();
        },
        sync() {
            this.role = this.item && this.item.role;
            this.firstName = this.item && this.item.profile && this.item.profile.firstName;
            this.lastName = this.item && this.item.profile && this.item.profile.lastName;
        }
    },
    created() {
        this.show(this.id).then(this.sync);
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