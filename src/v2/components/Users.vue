<template>
    <div class="ui contianer">
        <table class="ui very basic selectable table" v-if="items">
            <thead>
                <tr class="borderless" v-if="orgnization">
                    <th :colspan="4">
                        <div class="ui breadcrumb">
                            <template v-if="permission('orgnizations', 'list')">
                                <router-link :to="{name: 'Orgnizations'}" class="section">组织</router-link>
                                <i class="right caret icon divider"></i>
                            </template>
                            <template v-if="permission('orgnizations', 'show', orgnization)">
                                <router-link :to="{name: 'Orgnization', params: {id}}" class="section">{{orgnization.name}}</router-link>
                                <i class="right angle icon divider"></i>
                            </template>
                            <div class="active section">用户</div>
                        </div>
                    </th>
                    <th>
                        <div class="hover-links options">
                            <router-link v-if="permission('users', 'create', orgnization)" :to="{name: 'UserAdd', params: {id}}" :class="{disabled: pending}" data-content="添加">
                                <i class="large add icon"></i>
                            </router-link>
                            <a :class="{disabled: pending}" @click="list(id)" data-content="刷新">
                                <i class="large refresh icon"></i>
                            </a>
                        </div>
                    </th>
                </tr>
                <tr>
                    <th></th>
                    <th>名称</th>
                    <th>邮箱</th>
                    <th>身份</th>
                    <th></th>
                </tr>
            </thead>
            <transition-group name="fade" tag="tbody">
                <tr v-for="(item, index) in items" :key="index">
                    <td>
                        {{index + 1}}
                    </td>
                    <td>
                        <router-link v-if="permission('users', 'show', {_id: item._id, org: id})" :to="{name: 'User', params: {id: item._id}}">
                            {{item.name}}
                        </router-link>
                    </td>
                    <td>{{item.email}}</td>
                    <td>{{item.role}}</td>
                    <td>
                        <div class="hover-links actions options" :class="{disabled: pending}">
                            <router-link v-if="permission('storage', 'show', {_id: item._id, role: item.role, org: id})" :to="{name: 'Storage', params: {id: item._id}}" data-content="云存储">
                                <i class="large teal cloud icon"></i>
                            </router-link>
                            <router-link v-if="permission('users', 'update', {_id: item._id, role: item.role, org: id})" :to="{name: 'UserEdit', params: {id: item._id}}" data-content="编辑">
                                <i class="large blue edit icon"></i>
                            </router-link>
                            <a v-if="permission('users', 'remove', {_id: item._id, role: item.role, org: id})" data-content="删除" @click="$refs.modal.show(item._id)">
                                <i class="large red trash icon"></i>
                            </a>
                        </div>
                    </td>
                </tr>
            </transition-group>
        </table>
        <modal ref="modal" :header="'删除用户?'" :approve="'确认'" :cancel="'取消'" @accept="id => remove(id).then(postRemove)">此操作不可撤销</modal>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    props: ['id'],
    computed: {
        ...mapGetters('users', ['items', 'pending', 'error']),
        ...mapGetters('orgnizations', {
            orgnization: 'item'
        }),
        ...mapGetters(['permission'])
    },
    methods: {
        ...mapActions('users', ['list', 'remove']),
        ...mapActions('orgnizations', ['show']),
        postRemove() {
            this.list(this.id);
        }
    },
    created() {
        this.show(this.id);
        this.list(this.id);
    },
    updated() {
        $('.options>a').popup({
            position: 'bottom center'
        });
    }
}
</script>

<style scoped>
.ui.search {
    display: inline-block;
}

a {
    color: inherit;
}

a:hover {
    cursor: pointer;
}

.ui.celled.table tr.borderless th {
    border-left: 0;
}

.options {
    text-align: right;
}

tr .actions {
    visibility: hidden;
    padding-right: 32px;
}

tr:hover .actions {
    visibility: visible;
}

tr .actions.disabled>a {
    pointer-events: none;
    cursor: default;
}

table.basic.selectable.table tr>td {
    padding-left: 12px !important;
}

table.basic.selectable.table th span {
    padding-right: 12px;
}
</style>
