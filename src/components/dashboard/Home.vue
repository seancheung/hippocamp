<template>
    <div class="ui container">
        <h3 class="ui top attached header">{{profile.name}}, 你好!</h3>
        <div class="ui attached piled segment">
            <dl>
                <dt>用户名</dt>
                <dd>{{profile.name}}</dd>
                <dt>邮箱</dt>
                <dd>{{profile.email}}</dd>
                <dt>身份</dt>
                <dd>{{profile.role}}</dd>
                <dt>注册于</dt>
                <dd>{{profile.createdAt | moment}}</dd>
                <dt>修改于</dt>
                <dd>{{profile.modifiedAt | moment}}</dd>
                <dt>上次登录</dt>
                <dd>{{profile.lastLogin | moment}}</dd>
            </dl>
        </div>
    </div>
</template>

<script>
import moment from 'moment';
import { mapGetters, mapActions } from 'vuex';

export default {
    data() {
        return {

        }
    },
    computed: mapGetters(['profile']),
    filters: {
        moment(date) {
            return moment(date).format('L');
        }
    }
}
</script>

<style scoped>
dl {
    padding: 0.5em;
    margin: 0;
}

dt {
    float: left;
    clear: left;
    width: 100px;
    text-align: right;
    font-weight: bold;
}

dt::after {
    content: ":";
}

dd {
    margin: 0 0 0 200px;
    padding: 0 0 0.5em 0;
}
</style>