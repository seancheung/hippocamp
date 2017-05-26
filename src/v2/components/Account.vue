<template>
    <div class="ui container">
        <h3 class="ui top attached header">{{account.name}}, 你好!</h3>
        <div class="ui attached piled segment">
            <dl>
                <dt>用户名</dt>
                <dd>{{account.name}}</dd>
                <dt>邮箱</dt>
                <dd>{{account.email}}</dd>
                <dt v-if="account.org && account.org.name">组织</dt>
                <dd v-if="account.org && account.org.name">{{account.org.name}}</dd>
                <dt>身份</dt>
                <dd>{{account.role}}</dd>
                <dt>注册于</dt>
                <dd>{{account.createdAt | moment}}</dd>
                <dt>修改于</dt>
                <dd>{{account.modifiedAt | moment}}</dd>
                <dt>上次登录</dt>
                <dd>{{account.lastLogin | moment}}</dd>
            </dl>
        </div>
    </div>
</template>

<script>
import moment from 'moment';
import { mapGetters, mapActions } from 'vuex';

export default {
    computed: mapGetters(['account']),
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