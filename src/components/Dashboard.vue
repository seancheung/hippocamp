<template>
    <div class="ui main container">
        <div class="ui inverted segment">
            <div class="ui inverted secondary pointing attached stackable menu">
                <div class="ui container">
                    <div class="header item">酷糖</div>
                    <router-link :to="{name: 'Dashboard'}" class="item" :class="{active: $route.name == 'Dashboard'}"><i class="home icon"></i>主页</router-link>
                    <router-link v-if="isAdmin" :to="{name: 'Serials'}" class="item" :class="{active: $route.name == 'Serials'}"><i class="qrcode icon"></i>序列号</router-link>
                    <router-link v-if="isAdmin" :to="{name: 'Orgnizations'}" class="item" :class="{active: $route.name == 'Orgnizations'}"><i class="sitemap icon"></i>组织</router-link>
                    <router-link v-if="isSuperAdmin" :to="{name: 'Users'}" class="item" :class="{active: $route.name == 'Users'}"><i class="users icon"></i>用户</router-link>
                    <router-link :to="{name: 'Storages'}" class="item" :class="{active: $route.name == 'Storages'}"><i class="cloud icon"></i>存储</router-link>
                    <router-link :to="{name: 'Settings'}" class="item" :class="{active: $route.name == 'Settings'}"><i class="setting icon"></i>设置</router-link>
                    <div class="right menu">
                        <a class="ui item" @click.prevent="logout">
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
"use strict";

import { mapGetters, mapActions } from 'vuex';
export default {
    name: 'Dashboard',
    computed: {
        isAdmin() {
            return this.$store.getters.profile && /^(Super)?Admin$/.test(this.$store.getters.profile.role)
        },
        isSuperAdmin() {
            return this.$store.getters.profile && /^SuperAdmin$/.test(this.$store.getters.profile.role)
        }
    },
    methods: {
        logout() {
            this.$store.dispatch('logout')
                .then(() => {
                    this.tryRedirect();
                });
        },
        tryRedirect() {
            if (!this.$store.getters.profile) {
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