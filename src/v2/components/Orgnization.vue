<template>
    <div class="ui container" v-if="item">
        <div class="ui breadcrumb">
            <template v-if="permission('orgnizations', 'list')">
                <router-link :to="{name: 'Orgnizations'}" class="section">组织</router-link>
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
                    <div class="description">
                        {{item.desc}}
                    </div>
                    <div class="meta">
                        <i class="calendar icon"></i>{{item.createdAt | moment}}</div>
                </div>
                <div class="extra content">
                    <div class="ui basic four buttons" :class="{disabled: pending}">
                        <router-link v-if="permission('users', 'list', item)" :to="{name: 'Users', params: {id: item._id}}" data-content="成员" class="ui button">
                            <i class="purple users icon"></i>
                        </router-link>
                        <router-link v-if="permission('serials', 'list', item)" :to="{name: 'Serials', params: {id: item._id}}" data-content="序列号" class="ui button">
                            <i class="green qrcode icon"></i>
                        </router-link>
                        <router-link v-if="permission('orgnizations', 'update', item)" :to="{name: 'OrgnizationEdit', params: {id: item._id}}" data-content="编辑" class="ui button">
                            <i class="blue edit icon"></i>
                        </router-link>
                        <a v-if="permission('orgnizations', 'remove', item)" data-content="删除" @click="$refs.modal.show(item._id)" class="ui button">
                            <i class="red trash icon"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <modal ref="modal" :header="'删除组织?'" :approve="'确认'" :cancel="'取消'" @accept="id => remove(id).then(postRemove)">此操作不可撤销</modal>
    </div>
</template>

<script>
import moment from 'moment';
import { mapGetters, mapActions } from 'vuex';

export default {
    props: ['id'],
    computed: {
        ...mapGetters('orgnizations', ['item', 'pending', 'error']),
        ...mapGetters(['permission'])
    },
    methods: {
        ...mapActions('orgnizations', ['show', 'remove']),
        postRemove() {
            this.$router.push({ name: 'Orgnizations' });
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