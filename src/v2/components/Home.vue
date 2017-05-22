<template>
    <div v-if="profile" class="ui main container">
        <div class="ui inverted segment">
            <div class="ui inverted secondary pointing attached stackable menu">
                <div class="ui container">
                    <div class="header item">酷糖</div>
                    <router-link :to="'/'" class="item" :class="{active: $route.name == 'Account'}"><i class="home icon"></i>主页</router-link>
                    <router-link v-if="isAdmin" :to="'/orgs'" class="item" :class="{active: /^\/orgs/.test($route.path)}"><i class="sitemap icon"></i>组织</router-link>
                    <router-link v-else-if="profile.org" :to="`/orgs/${profile.org}`" class="item" :class="{active: /^\/orgs/.test($route.path)}"><i class="qrcode icon"></i>组织</router-link>
                    <router-link v-if="!isAdmin" :to="`/users/${profile._id}/storage`" class="item" :class="{active: /^\/users/.test($route.path)}"><i class="cloud icon"></i>存储</router-link>
                    <router-link :to="'/edit'" class="item" :class="{active: /^\/edit/.test($route.path)}"><i class="setting icon"></i>设置</router-link>
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
import { mapGetters, mapActions } from 'vuex';
export default {
    name: 'Home',
    computed: mapGetters(['profile', 'isAdmin']),
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