<template>
    <div class="ui container">
        <div class="ui breadcrumb">
            <template v-if="permission('orgnizations', 'list')">
                <router-link :to="{name: 'Orgnizations'}" class="section">组织</router-link>
                <i class="right angle icon divider"></i>
            </template>
            <div class="active section">添加</div>
        </div>
        <div class="ui center aligned segment">
            <form class="ui equal width form" :class="{loading: pending, error, success}" @submit.prevent="create({name, desc}).then(postCreate)">
                <div class="fields">
                    <div class="required field">
                        <label>名称</label>
                        <input v-model="name" type="text" placeholder="请输入组织名称">
                    </div>
                </div>
                <div class="fields">
                    <div class="field">
                        <label>描述</label>
                        <textarea v-model="desc" rows="2"></textarea>
                    </div>
                </div>
                <button class="ui button" :class="{disabled: !name}" type="submit">添加</button>
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
    data() {
        return {
            name: null,
            desc: null
        }
    },
    computed: {
        ...mapGetters('orgnizations', ['pending', 'error', 'success']),
        ...mapGetters(['permission'])
    },
    methods: {
        ...mapActions('orgnizations', ['create']),
        postCreate() {
            if (!this.error) {
                this.name = null;
                this.desc = null;
            }
        }
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