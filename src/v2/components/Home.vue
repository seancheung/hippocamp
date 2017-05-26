<template>
    <div v-if="account" class="ui main container">
        <div class="ui inverted segment">
            <div class="ui inverted secondary pointing attached stackable menu">
                <div class="ui container">
                    <div class="header item">酷糖</div>
                    <router-link :to="{name: 'Account'}" class="item" :class="{active: $route.name == 'Account'}">
                        <i class="home icon"></i>主页</router-link>
                    <router-link v-if="permission('orgnizations', 'list')" :to="{name: 'Orgnizations'}" class="item" :class="{active: !/Account(Edit)?|Home|Login/.test($route.name)}">
                        <i class="group icon"></i>组织</router-link>
                    <template v-else>
                        <router-link v-if="permission('users', 'list', account.org) && account.org" :to="{name: 'Users', params: {id: account.org._id}}" class="item" :class="{active: !/Account(Edit)?|Home|Login|Storage/.test($route.name)}">
                            <i class="cloud icon"></i>成员</router-link>
                        <router-link v-if="permission('storage', 'show', account)" :to="{name: 'Storage', params: {id: account._id}}" class="item" :class="{active: $route.name === 'Storage'}">
                            <i class="cloud icon"></i>存储</router-link>
                    </template>
                    <router-link :to="{name: 'AccountEdit'}" class="item" :class="{active: $route.name == 'AccountEdit'}">
                        <i class="setting icon"></i>账户</router-link>
                    <div class="right menu">
                        <a class="ui item" @click.prevent="logout().then(tryRedirect)">
                            <div class="ui animated button">
                                <div class="visible content">注销</div>
                                <div class="hidden content">
                                    <i class="sign out icon"></i>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <div class="ui divider"></div>
        <transition name="fade">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
export default {
    name: 'Home',
    computed: mapGetters(['account', 'permission']),
    methods: {
        ...mapActions(['logout']),
        tryRedirect() {
            if (!this.account) {
                this.$router.push({ name: 'Login' });
            }
        }
    }
}
</script>

<style scoped>
.main.container {
    margin-top: 30px;
    height: 80%;
}
</style>