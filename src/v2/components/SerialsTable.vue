<template>
    <div class="ui basic segment">
        <table class="ui very basic selectable table">
            <transition-group name="fade" tag="tbody">
                <tr v-for="(item, index) in items" :key="index">
                    <td>
                        {{index + 1}}
                    </td>
                    <td>
                        {{item.sno}}
                    </td>
                    <td>{{item.device && item.device.uuid || ''}}</td>
                    <td>{{(item.device && item.device.createdAt | moment) || ''}}</td>
                    <td>{{item.createdAt | moment}}</td>
                    <td>
                        <div class="hover-links actions options" :class="{disabled:pending}">
                            <a data-content="删除此序列号" @click="$refs.remove.show(item.sno)">
                                <i class="large red trash icon"></i>
                            </a>
                        </div>
                    </td>
                </tr>
            </transition-group>
        </table>
        <modal ref="remove" :header="'删除序列号?'" :approve="'确认'" :cancel="'取消'" @accept="sno => remove({id, context: {sno}}).then(postRemove)">此操作不可撤销</modal>
    </div>
</template>

<script>
import moment from 'moment';
import { mapGetters, mapActions } from 'vuex';

export default {
    props: ['id'],
    computed: mapGetters('serials', ['items', 'pending']),
    methods: {
        ...mapActions('serials', ['list', 'remove']),
        ...mapActions('orgnizations', ['show']),
        postRemove() {
            this.list(this.id);
        }
    },
    filters: {
        moment(date) {
            return moment(date).format('L');
        }
    }
}
</script>

<style scoped>
a {
    color: inherit;
}

a:hover {
    cursor: pointer;
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
