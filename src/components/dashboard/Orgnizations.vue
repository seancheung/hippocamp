<template>
    <div class="ui contianer">
        <table class="ui very basic celled striped table">
            <thead class="full-width">
                <tr>
                    <th colspan="5">
                        <div class="ui right floated tiny buttons">
                            <button class="ui new positive icon button" :class="{disabled:busy}" @click="create">
                                <i class="add icon"></i>
                            </button>
                            <button class="ui icon button" :class="{disabled:busy}" @click="list">
                                <i class="refresh icon"></i>
                            </button>
                        </div>
                        <div class="ui search">
                            <div class="ui small icon input">
                                <input type="text" placeholder="搜索..." v-model="search"><i class="search icon"></i>
                            </div>
                        </div>
                    </th>
                </tr>
                <tr>
                    <th class="one wide"></th>
                    <th class="four wide">名称</th>
                    <th class="five wide">描述</th>
                    <th class="four wide">创建于</th>
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
                    <td>{{item.desc}}</td>
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
            <tfoot class="full-width">
                <tr>
                    <th colspan="5">
                        <div class="ui center aligned container">
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
        <div class="ui small new modal">
            <div class="header">新建组织</div>
            <div class="ui form content" :class="{error}">
                <div class="required field">
                    <label>名称</label>
                    <input type="text" v-model="name" placeholder="请输入组织名称"></input>
                </div>
                <div class="field">
                    <label>描述</label>
                    <textarea v-model="desc" rows="2" placeholder="描述..."></textarea>
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
        <div class="ui edit modal">
            <div class="header">修改组织</div>
            <div class="ui form content" :class="{error}">
                <div class="required field">
                    <label>名称</label>
                    <input type="text" v-model="name" placeholder="请输入组织名称"></input>
                </div>
                <div class="field">
                    <label>描述</label>
                    <textarea v-model="desc" rows="2" placeholder="描述..."></textarea>
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
        <div class="ui small show modal">
            <div class="header">组织信息</div>
            <div class="ui center aligned container content">
                <h2 class="ui icon header">
                        <i class="group icon"></i>
                        <div class="content">
                            {{name}}
                            <div class="sub header">{{createdAt | moment}}</div>
                            <div>{{desc}}</div>
                        </div>
                    </h2>
            </div>
            <div class="actions">
                <div class="ui ok button">确认</div>
            </div>
        </div>
        <div class="ui small remove modal">
            <div class="header">删除组织</div>
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
            desc: null,
            createdAt: null
        }
    },
    filters: {
        moment(date) {
            return moment(date).format('LL');
        }
    },
    computed: {
        ...mapGetters('orgnizations', ['items', 'busy', 'error', 'pagination']),
        search: {
            get() {
                return this.$store.state.orgnizations.filter || '';
            },
            set(value) {
                this.$store.dispatch('orgnizations/filter', value);
            }
        }
    },
    methods: {
        ...mapActions('orgnizations', ['list', 'paginate']),
        reset() {
            this.name = null;
            this.desc = null;
            this.createdAt = null;
        },
        create() {
            $('.ui.new.modal').modal({
                onApprove: () => {
                    this.$store.dispatch('orgnizations/create', {
                        name: this.name,
                        desc: this.desc
                    })
                        .finally(() => {
                            if (!this.err) {
                                $('.ui.new.modal').modal('hide');
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
            this.desc = item.desc;
            $('.ui.edit.modal').modal({
                onApprove: () => {
                    this.$store.dispatch('orgnizations/update', {
                        id: item.id,
                        data: {
                            name: this.name,
                            desc: this.desc
                        }
                    })
                        .finally(() => {
                            if (!this.err) {
                                $('.ui.edit.modal').modal('hide');
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
            this.desc = item.desc;
            $('.ui.remove.modal').modal({
                onDeny: () => {
                    this.$store.dispatch('orgnizations/delete', item._id)
                        .finally(() => {
                            if (!this.err) {
                                $('.ui.remove.modal').modal('hide');
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
            this.desc = item.desc;
            this.createdAt = item.createdAt;
            $('.ui.show.modal').modal({
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
</style>