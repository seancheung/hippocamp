<template>
    <div id="app">
        <transition name="fade">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
export default {
    name: 'app',
    created() {
        const jwt = this.$cookie.get('jwt');
        this.$store.commit('grant', jwt);
    }
}
</script>

<style>
#app {
    font-family: Helvetica Neue,
    Helvetica,
    PingFang SC,
    Hiragino Sans GB,
    Microsoft YaHei,
    Noto Sans CJK SC,
    WenQuanYi Micro Hei,
    Arial,
    sans-serif;
    height: 100%;
}

#app *:not(i) {
    font-family: inherit;
}

.fade-enter-active,
.fade-leave-active {
    transition-property: opacity;
    transition-duration: .25s;
}

.fade-enter-active {
    transition-delay: .25s;
}

.fade-enter,
.fade-leave-active {
    opacity: 0
}
</style>
