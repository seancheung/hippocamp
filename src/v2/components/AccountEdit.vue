<template>
    <div class="ui container">
        <div class="ui center aligned basic segment">
            <div class="ui fluid card" v-if="profile">
                <div class="content">
                    <div class="header">{{profile.name}}</div>
                </div>
                <div class="content">
                    <div class="ui sub header">
                        <i class="mail icon"></i>{{profile.email}}</div>
                    <div class="meta">{{profile | display}}</div>
                    <div class="meta">
                        <i class="user icon"></i>{{profile.role}}</div>
                    <div class="meta">
                        <i class="calendar icon"></i>{{profile.createdAt | moment}}</div>
                </div>
                <div class="extra content">
                    <div class="ui basic three buttons">
                        <router-link :to="{name: 'Storage', params: {id: profile._id}}" data-content="访问此用户云存储" class="ui button">
                            <i class="teal cloud icon"></i>
                        </router-link>
                        <router-link :to="{name: 'UserEdit', params: {id: profile._id}}" data-content="修改用户信息" class="ui button">
                            <i class="blue edit icon"></i>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment';
import { mapGetters, mapActions } from 'vuex';

export default {
    props: ['id'],
    computed: {
        ...mapGetters(['profile'])
    },
    methods: {
        ...mapActions('users', ['show'])
    },
    filters: {
        moment(date) {
            return moment(date).format('L');
        },
        display(profile) {
            return `${profile && profile.lastName || ''} ${profile && profile.firstName || ''}`.trim();
        }
    },
    updated() {
        $('.buttons>a').popup({
            position: 'bottom center'
        });
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