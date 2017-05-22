<template>
    <div class="ui container" v-if="item">
        <div class="ui breadcrumb">
            <router-link :to="{name: 'Orgnizations'}" class="section">Orgnizations</router-link>
            <i class="right angle icon divider"></i>
            <div class="active section">{{item.name}}</div>
        </div>
        <div class="ui fluid card">
            <div class="content">
                <div class="header">{{item.name}}</div>
            </div>
            <div class="content">
                <div class="ui sub header">创建于 {{item.createdAt | moment}}</div>
                <div class="ui small feed">
                    <div class="event">
                        <div class="content">
                            <div class="summary meta">
                                {{item.desc || '无描述内容'}}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="extra content">
                <div class="ui basic buttons" :class="isSuperAdmin?'four':'two'">
                    <router-link :to="{name: 'Users', params: {id: item._id}}" class="ui button">
                        <i class="purple users icon"></i>
                    </router-link>
                    <router-link :to="{name: 'Serials', params: {id: item._id}}" class="ui button">
                        <i class="green qrcode icon"></i>
                    </router-link>
                    <router-link v-if="isSuperAdmin" :to="{name: 'OrgnizationEdit', params: {id: item._id}}" class="ui  button">
                        <i class="blue edit icon"></i>
                    </router-link>
                    <a v-if="isSuperAdmin" class="ui button">
                        <i class="red trash icon"></i>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment';
import { mapGetters, mapActions } from 'vuex';

export default {
    computed: {
        ...mapGetters('orgnizations', ['item', 'pending', 'error']),
        ...mapGetters(['isSuperAdmin'])
    },
    methods: mapActions('orgnizations', ['show']),
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