<template>
    <div class="ui contianer">
        <table class="ui very basic celled striped table">
            <thead class="full-width">
                <tr class="borderless">
                    <th colspan="6" >
                        <div class="ui search">
                            <div class="ui small icon input">
                                <input type="text" placeholder="搜索..." v-model="search"><i class="search icon"></i>
                            </div>
                        </div>
                    </th>
                    <th>
                        <div class="ui two small icon buttons">
                            <button class="ui new positive icon button" :class="{disabled:busy}" @click="create">
                                <i class="add icon"></i>
                            </button>
                            <button class="ui icon button" :class="{disabled:busy}" @click="list">
                                <i class="refresh icon"></i>
                            </button>
                        </div>
                    </th>
                </tr>
                <tr>
                    <th class="one wide"></th>
                    <th class="three wide">用户名</th>
                    <th class="three wide">邮箱</th>
                    <th class="three wide">姓名</th>
                    <th class="two wide">身份</th>
                    <th class="two wide">创建于</th>
                    <th class="two wide"></th>
                </tr>
            </thead>
            <!--<tbody>-->
            <transition-group name="fade" tag="tbody">
                <tr v-for="(item, index) in items" v-bind:key="index">
                    <td>
                        {{index + 1}}
                    </td>
                    <td><a @click.prevent="show(item)">{{item.name}}</a></td>
                    <td>{{item.email}}</td>
                    <td>{{item.profile | formatName }}</td>
                    <td>{{item.role}}</td>
                    <td>{{item.createdAt | moment}}</td>
                    <td>
                        <div class="ui two small icon buttons">
                            <button class="ui edit button" :class="{disabled:busy}" @click="edit(item)"><i class="edit icon"></i></button>
                            <button class="ui negative delete button" :class="{disabled:busy}" @click="remove(item)"><i class="delete icon"></i></button>
                        </div>
                    </td>
                </tr>
            </transition-group>
            <!--</tbody>-->
            <tfoot class="full-width" v-if="items.length > 0">
                <tr>
                    <th colspan="7">
                        <div class="ui center aligned container" v-if="pagination.total > 1">
                            <div class="ui borderless pagination menu">
                                <a class="icon item" :class="{disabled: pagination.current <= 1}" @click="paginate(pagination.current - 1)">
                                    <i class="left chevron icon"></i>
                                </a>
                                <a v-for="p in pagination.total" class="item" :class="{active: p == pagination.current}" @click="paginate(p)">{{p}}</a>
                                <a class="icon item" :class="{disabled: pagination.current >= pagination.total}" @click="paginate(pagination.current + 1)">
                                    <i class="right chevron icon"></i>
                                </a>
                            </div>
                        </div>
                    </th>
                </tr>
            </tfoot>
        </table>
        <div class="ui small new user modal">
            <div class="header">新建用户</div>
            <div class="ui form content" :class="{error}">
                <div class="required field">
                    <label>用户名</label>
                    <input type="text" v-model="name" placeholder="请输入用户名"></input>
                </div>
                <div class="required field">
                    <label>邮箱</label>
                    <input type="text" v-model="email" placeholder="请输入邮箱"></input>
                </div>
                <div class="required field">
                    <label>密码</label>
                    <input type="password" v-model="password" placeholder="请输入密码"></input>
                </div>
                <div class="required field">
                    <label>确认密码</label>
                    <input type="password" v-model="confirm" placeholder="请确认密码"></input>
                </div>
                <div class="required field">
                    <label>身份</label>
                    <select class="ui dropdown" v-model="role">
                        <option v-for="role in roles" :value="role">{{role}}</option>
                    </select>
                </div>
                <div class="field">
                    <label>姓</label>
                    <input type="text" v-model="lastName" placeholder="请输入姓"></input>
                </div>
                <div class="field">
                    <label>名</label>
                    <input type="text" v-model="firstName" placeholder="请输入名"></input>
                </div>
                <div class="ui error message">
                    <div class="header">操作失败</div>
                    <p>{{ error }}</p>
                </div>
            </div>
            <div class="actions">
                <button class="ui cancel button" :class="{loading:busy}">取消</button>
                <button class="ui positive button" :class="{disabled:!isValid, loading:busy}">确认</button>
            </div>
        </div>
        <div class="ui small edit user modal">
            <div class="header">修改用户</div>
            <div class="ui form content" :class="{error}">
                <div class="required field">
                    <label>用户名</label>
                    <input type="text" v-model="name" placeholder="请输入组织名称"></input>
                </div>
                <div class="field">
                    <label>邮箱</label>
                    <input type="text" v-model="email" placeholder="描述..."></input>
                </div>
                <div class="ui error message">
                    <div class="header">操作失败</div>
                    <p>{{ error }}</p>
                </div>
            </div>
            <div class="actions">
                <button class="ui cancel button" :class="{loading:busy}">取消</button>
                <button class="ui positive button" :class="{disabled:!name, loading:busy}">确认</button>
            </div>
        </div>
        <div class="ui small show usr modal">
            <div class="header">用户信息</div>
            <div class="ui center aligned container content">
                <h2 class="ui icon header">
                                                        <i class="group icon"></i>
                                                        <div class="content">
                                                            {{name}}
                                                            <div class="sub header">{{createdAt | moment}}</div>
                                                            <div>{{email}}</div>
                                                        </div>
                                                    </h2>
            </div>
            <div class="actions">
                <div class="ui ok button">确认</div>
            </div>
        </div>
        <div class="ui small remove user modal">
            <div class="header">删除用户</div>
            <div class="content">
                <div class="ui icon warning message">
                    <i class="warning icon"></i>
                    <div class="content">
                        <div class="header">确认删除<b>{{name}}</b>?</div>
                        此操作不可撤销
                    </div>
                </div>
            </div>
            <div class="actions">
                <div class="ui ok button" :class="{loading:busy}">取消</div>
                <div class="ui negative button" :class="{loading:busy}">确认</div>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment';
import { mapGetters, mapActions } from 'vuex';
export default {
    data() {
        return {
            name: null,
            email: null,
            createdAt: null,
            password: null,
            confirm: null,
            firstName: null,
            lastName: null,
            role: 'Member',
            roles: ['Member', 'Client', 'Admin', 'SuperAdmin']
        }
    },
    filters: {
        moment(date) {
            return moment(date).format('L');
        },
        formatName(data) {
            return data ? (data.firstName + ' ' + data.lastName).trim() : '';
        }
    },
    computed: {
        ...mapGetters('users', ['items', 'busy', 'error', 'pagination']),
        search: {
            get() {
                return this.$store.state.users.filter || '';
            },
            set(value) {
                this.$store.dispatch('users/filter', value);
            }
        },
        isValid() {
            return this.name && this.email && this.password && this.confirm == this.password && this.role;
        }
    },
    methods: {
        ...mapActions('users', ['list', 'paginate']),
        reset() {
            this.name = null;
            this.email = null;
            this.createdAt = null;
            this.password = null;
            this.confirm = null;
            this.firstName = null;
            this.lastName = null;
            this.role = 'Member';
        },
        create() {
            $('.ui.new.user.modal').modal({
                onApprove: () => {
                    this.$store.dispatch('users/create', {
                        name: this.name,
                        desc: this.desc
                    })
                        .finally(() => {
                            if (!this.err) {
                                $('.ui.new.user.modal').modal('hide');
                            } else {
                                console.log(err);
                            }
                        });
                    return false;
                },
                onHidden: () => {
                    this.reset();
                }
            }).modal('show');
        },
        edit(item) {
            this.name = item.name;
            this.email = item.email;
            $('.ui.edit.user.modal').modal({
                onApprove: () => {
                    this.$store.dispatch('users/update', {
                        id: item.id,
                        data: {
                            name: this.name,
                            desc: this.desc
                        }
                    })
                        .finally(() => {
                            if (!this.err) {
                                $('.ui.edit.user.modal').modal('hide');
                            } else {
                                console.log(err);
                            }
                        });
                    return false;
                },
                onHidden: () => {
                    this.reset();
                }
            }).modal('show');
        },
        remove(item) {
            this.name = item.name;
            this.email = item.email;
            $('.ui.remove.user.modal').modal({
                onDeny: () => {
                    this.$store.dispatch('users/delete', item._id)
                        .finally(() => {
                            if (!this.err) {
                                $('.ui.remove.user.modal').modal('hide');
                            } else {
                                console.log(err);
                            }
                        });
                    return false;
                },
                onHidden: () => {
                    this.reset();
                }
            }).modal('show');
        },
        show(item) {
            this.name = item.name;
            this.email = item.email;
            this.createdAt = item.createdAt;
            $('.ui.show.user.modal').modal({
                onHidden: () => {
                    this.reset();
                }
            }).modal('show');
        }
    },
    created() {
        this.list();
    }
}
</script>

<style scoped>
.ui.search {
    display: inline-block;
}

a:hover {
    cursor: pointer;
}

.ui.celled.table tr.borderless th {
    border-left: 0;
}
</style>