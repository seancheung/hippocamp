<template>
    <div class="ui container">
        <div class="ui breadcrumb">
            <router-link :to="{name: 'Orgnizations'}" class="section">组织</router-link>
            <i class="right caret icon divider"></i>
            <router-link :to="{name: 'Orgnization', params: {id: $route.params.id}}" class="section">{{item && item.name}}</router-link>
            <i class="right angle icon divider"></i>
            <div class="active section">编辑</div>
        </div>
        <div class="ui center aligned segment">
            <form class="ui equal width form" :class="{loading: pending, error, success}" @submit.prevent="update({id: $route.params.id, context: {desc}}).then(postUpdate)">
                <div class="fields">
                    <div class="disabled field">
                        <label>名称</label>
                        <input :value="item && item.name" type="text">
                    </div>
                </div>
                <div class="fields">
                    <div class="field">
                        <label>描述</label>
                        <textarea v-model="desc" rows="2"></textarea>
                    </div>
                </div>
                <button class="ui button" type="submit" :class="{disabled: !valid}">更新</button>
                <div class="ui error message">
                    <div class="header">操作失败</div>
                    <p>{{ error }}</p>
                </div>
                <div class="ui success message">
                    <div class="header">操作成功</div>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    data() {
        return {
            desc: null
        }
    },
    computed: {
        ...mapGetters('orgnizations', ['item', 'pending', 'error', 'success']),
        valid() {
            return this.item && this.item.desc != this.desc;
        }
    },
    methods: {
        ...mapActions('orgnizations', ['show', 'update']),
        postUpdate() {
            this.sync();
        },
        sync() {
            this.desc = this.item && this.item.desc;
        }
    },
    created() {
        this.show(this.$route.params.id).then(this.sync);
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