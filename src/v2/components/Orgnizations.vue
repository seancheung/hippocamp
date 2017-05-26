<template>
    <div class="ui contianer">
        <table class="ui very basic selectable table">
            <thead>
                <tr class="borderless">
                    <th :colspan="2">
                        <div class="ui breadcrumb">
                            <div class="active section">组织</div>
                        </div>
                    </th>
                    <th>
                        <div class="hover-links options">
                            <router-link v-if="permission('orgnizations', 'create')" :to="{name: 'OrgnizationAdd'}" :class="{disabled: pending}" data-content="添加">
                                <i class="large add icon"></i>
                            </router-link>
                            <a :class="{disabled: pending}" @click="list" data-content="刷新">
                                <i class="large refresh icon"></i>
                            </a>
                        </div>
                    </th>
                </tr>
                <tr>
                    <th></th>
                    <th>名称</th>
                    <th></th>
                </tr>
            </thead>
            <transition-group name="fade" tag="tbody">
                <tr v-for="(item, index) in items" :key="index">
                    <td>
                        {{index + 1}}
                    </td>
                    <td>
                        <router-link v-if="permission('orgnizations', 'show', item)" :to="{name: 'Orgnization', params: {id: item._id}}">
                            {{ item.name }}
                        </router-link>
                    </td>
                    <td>
                        <div class="hover-links actions options" :class="{disabled: pending}">
                            <router-link v-if="permission('users', 'list', item)" :to="{name: 'Users', params: {id: item._id}}" data-content="成员">
                                <i class="large purple users icon"></i>
                            </router-link>
                            <router-link v-if="permission('serials', 'list', item)" :to="{name: 'Serials', params: {id: item._id}}" data-content="序列号">
                                <i class="large green qrcode icon"></i>
                            </router-link>
                            <router-link v-if="permission('orgnizations', 'update', item)" :to="{name: 'OrgnizationEdit', params: {id: item._id}}" data-content="编辑">
                                <i class="large blue edit icon"></i>
                            </router-link>
                            <a v-if="permission('orgnizations', 'remove', item)" data-content="删除" @click="$refs.modal.show(item._id)">
                                <i class="large red trash icon"></i>
                            </a>
                        </div>
                    </td>
                </tr>
            </transition-group>
        </table>
        <modal ref="modal" :header="'删除组织?'" :approve="'确认'" :cancel="'取消'" @accept="id => remove(id).then(postRemove)">此操作不可撤销</modal>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    computed: {
        ...mapGetters('orgnizations', ['items', 'pending', 'error']),
        ...mapGetters(['permission'])
    },
    methods: {
        ...mapActions('orgnizations', ['list', 'remove']),
        postRemove() {
            this.list();
        }
    },
    created() {
        this.list();
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
