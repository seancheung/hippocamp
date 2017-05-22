<template>
    <div class="ui contianer">
        <table class="ui very basic selectable table">
            <thead>
                <tr class="borderless">
                    <th :colspan="3">
                        <div class="ui search">
                            <div class="ui small icon input">
                                <input type="text" placeholder="搜索...">
                                <i class="search icon"></i>
                            </div>
                        </div>
                    </th>
                    <th>
                        <div class="options">
                            <router-link to="/orgs/add" :class="{disabled: pending}">
                                <i class="large add icon"></i>
                            </router-link>
                            <a :class="{disabled: pending}" @click="list">
                                <i class="large refresh icon"></i>
                            </a>
                        </div>
                    </th>
                </tr>
                <tr>
                    <th></th>
                    <th>名称</th>
                    <th>描述</th>
                    <th></th>
                </tr>
            </thead>
            <transition-group name="fade" tag="tbody">
                <tr v-for="(item, index) in items" :key="index">
                    <td>
                        {{index + 1}}
                    </td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.desc }}</td>
                    <td>
                        <div class="actions" :class="{disabled:pending}">
                            <router-link :to="{name: 'Users', params: {id: item._id}}">
                                <i class="large users icon"></i>
                            </router-link>
                            <router-link :to="{name: 'Serials', params: {id: item._id}}">
                                <i class="large qrcode icon"></i>
                            </router-link>
                            <router-link :to="{name: 'OrgnizationEdit', params: {id: item._id}}">
                                <i class="large edit icon"></i>
                            </router-link>
                            <router-link :to="{name: 'Orgnization', params: {id: item._id}}">
                                <i class="large horizontal ellipsis icon"></i>
                            </router-link>
                        </div>
                    </td>
                </tr>
            </transition-group>
        </table>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    computed: mapGetters('orgnizations', ['items', 'item', 'pending', 'error']),
    methods: mapActions('orgnizations', ['list']),
    created() {
        this.list();
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

.actions,
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
