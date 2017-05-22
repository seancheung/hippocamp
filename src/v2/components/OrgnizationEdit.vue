<template>
    <div class="ui container" v-if="item">
        <div class="ui breadcrumb">
            <router-link :to="{name: 'Orgnizations'}" class="section">Orgnizations</router-link>
            <i class="right angle icon divider"></i>
            <router-link :to="{name: 'Orgnization', params: {id: item._id}}" class="section">{{item.name}}</router-link>
            <i class="right angle icon divider"></i>
            <div class="active section">编辑</div>
        </div>
    </div>
</template>

<script>
import moment from 'moment';
import { mapGetters, mapActions } from 'vuex';

export default {
    computed: {
        ...mapGetters('orgnizations', ['item', 'pending', 'error'])
    },
    methods: mapActions('orgnizations', ['show', 'update']),
    filters: {
        moment(date) {
            return moment(date).format('L');
        }
    },
    created() {
        this.show(this.$route.params.id);
    }
}
</script>

<style scoped>

</style>