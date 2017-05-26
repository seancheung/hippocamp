<template>
    <div class="ui container" v-if="item">
        <div class="ui breadcrumb">
            <template v-if="permission('orgnizations', 'list')">
                <router-link :to="{name: 'Orgnizations'}" class="section">组织</router-link>
                <i class="right caret icon divider"></i>
            </template>
            <template v-if="permission('orgnizations', 'show', item.org)">
                <router-link :to="{name: 'Orgnization', params: {id: item.org._id}}" class="section">{{item.org.name}}</router-link>
                <i class="right angle icon divider"></i>
            </template>
            <template v-if="permission('users', 'list', item.org)">
                <router-link :to="{name: 'Users', params: {id: item.org._id}}" class="section">用户</router-link>
                <i class="right caret icon divider"></i>
            </template>
            <div class="active section">{{item.name}}</div>
        </div>
        <div class="ui center aligned basic segment">
            <div class="ui fluid card">
                <div class="content">
                    <div class="header">{{item.name}}</div>
                </div>
                <div class="content">
                    <div class="ui sub header">
                        <i class="mail icon"></i>{{item.email}}</div>
                    <div class="meta">{{item.profile | profile}}</div>
                    <div class="meta">
                        <i class="user icon"></i>{{item.role}}</div>
                    <div class="meta">
                        <i class="calendar icon"></i>{{item.createdAt | moment}}</div>
                </div>
                <div class="extra content">
                    <div class="ui basic three buttons" :class="{disabled: pending}">
                        <router-link v-if="permission('storage', 'show', item)" :to="{name: 'Storage', params: {id: item._id}}" data-content="云存储" class="ui button">
                            <i class="teal cloud icon"></i>
                        </router-link>
                        <router-link v-if="permission('users', 'update', item)" :to="{name: 'UserEdit', params: {id: item._id}}" data-content="编辑" class="ui button">
                            <i class="blue edit icon"></i>
                        </router-link>
                        <a v-if="permission('users', 'remove', item)" data-content="删除" @click="$refs.modal.show(item._id)" class="ui button">
                            <i class="red trash icon"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <modal ref="modal" :header="'删除用户?'" :approve="'确认'" :cancel="'取消'" @accept="id => remove(id).then(postRemove)">此操作不可撤销</modal>
    </div>
</template>

<script>
import moment from 'moment';
import { mapGetters, mapActions } from 'vuex';

export default {
    props: ['id'],
    data() {
        return {
            orgnization: null
        }
    },
    computed: {
        ...mapGetters('users', ['item', 'pending', 'error']),
        ...mapGetters(['permission'])
    },
    methods: {
        ...mapActions('users', ['show', 'remove']),
        postRemove() {
            this.$router.push({ name: 'Users', params: { id: this.orgnization } });
        },
        sync() {
            this.orgnization = this.item && this.item.org._id;
        }
    },
    filters: {
        moment(date) {
            return moment(date).format('L');
        },
        profile(profile) {
            return `${profile && profile.lastName || ''} ${profile && profile.firstName || ''}`.trim();
        }
    },
    updated() {
        $('.buttons>a').popup({
            position: 'bottom center'
        });
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