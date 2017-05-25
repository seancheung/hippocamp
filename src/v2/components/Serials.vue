<template>
    <div class="ui contianer">
        <div class="ui breadcrumb">
            <router-link :to="{name: 'Orgnizations'}" class="section">组织</router-link>
            <i class="right caret icon divider"></i>
            <router-link :to="{name: 'Orgnization', params: {id}}" class="section">{{item && item.name}}</router-link>
            <i class="right angle icon divider"></i>
            <div class="active section">序列号</div>
        </div>
        <div class="hover-links options">
            <a :class="{disabled: pending}" @click="$refs.generate.show()" data-content="生成序列号">
                <i class="large add icon"></i>
            </a>
            <a :class="{disabled: pending}" @click="$refs.clear.show()" data-content="清空序列号">
                <i class="large trash icon"></i>
            </a>
            <a :class="{disabled: pending}" @click="list(id)" data-content="刷新列表">
                <i class="large refresh icon"></i>
            </a>
            <div class="ui tiny icon compact menu">
                <router-link class="item" :to="{name: 'Serials'}" :class="{active: $route.name === 'Serials'}">
                    <i class="list layout icon"></i>
                </router-link>
                <router-link class="item" :to="{name: 'SerialsGrid'}" :class="{active: $route.name === 'SerialsGrid'}">
                    <i class="grid layout icon"></i>
                </router-link>
            </div>
        </div>
        <transition name="fade">
            <router-view></router-view>
        </transition>
        <modal ref="clear" :header="'清空所有序列号?'" :approve="'确认'" :cancel="'取消'" @accept="clear(id).then(postClear)">此操作不可撤销</modal>
        <modal ref="generate" :header="'生成序列号'" :approve="'确认'" :cancel="'取消'" :unacceptable="!valid" @accept="generate({id, context: {count}}).then(postCreate)">
            <div class="ui labeled input">
                <div class="ui label">数量</div>
                <input type="number" step="1" v-model="count"></input>
            </div>
        </modal>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    props: ['id'],
    data() {
        return {
            count: 20
        }
    },
    computed: {
        ...mapGetters('serials', ['items', 'pending', 'error']),
        ...mapGetters('orgnizations', ['item']),
        valid() {
            return !isNaN(this.count) && Number.isInteger(Number(this.count)) && this.count > 0;
        }
    },
    methods: {
        ...mapActions('serials', ['list', 'clear', 'generate']),
        ...mapActions('orgnizations', ['show']),
        postClear() {
            this.list(this.id);
        },
        postCreate() {
            this.list(this.id);
        }
    },
    created() {
        this.show(this.id);
        this.list(this.id);
    },
    updated() {
        $('.options>a').popup({
            position: 'bottom center',
            prefer: 'opposite'
        });
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
</style>