<template>
    <div class="ui contianer">
        <crud-table :fields="fields" :index="'name'" @add="create" @refresh="list" :disabled="busy" :items="items" @show="show" @edit="edit" @remove="remove" :pagination="pagination" @paginate="paginate" ></crud-table>
        <div class="ui small new org modal">
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
                <button class="ui cancel button" :class="{disabled:busy}">取消</button>
                <button class="ui positive button" :class="{disabled:!name, loading:busy}">确认</button>
            </div>
        </div>
        <div class="ui small edit org modal">
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
                <button class="ui cancel button" :class="{disabled:busy}">取消</button>
                <button class="ui positive button" :class="{disabled:!name, loading:busy}">确认</button>
            </div>
        </div>
        <div class="ui small show org modal">
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
        <div class="ui small remove org modal">
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
                <div class="ui ok button" :class="{disabled:busy}">取消</div>
                <div class="ui negative button" :class="{loading:busy}">确认</div>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment';
import { mapGetters, mapActions } from 'vuex';
import CrudTable from '../shared/CrudTable';
export default {
    components: {
        'crud-table': CrudTable
    },
    data() {
        return {
            name: null,
            desc: null,
            createdAt: null,
            fields: [{
                width: 'four',
                name: '名称',
                key: 'name',
                primary: true
            },
            {
                width: 'five',
                name: '描述',
                key: 'desc'
            },
            {
                width: 'four',
                name: '创建于',
                key: 'createdAt',
                format: value => moment(value).format('L')
            }]
        }
    },
    filters: {
        moment(date) {
            return moment(date).format('L');
        }
    },
    computed: {
        ...mapGetters('orgnizations', ['items', 'busy', 'error', 'pagination', 'count']),
    },
    methods: {
        ...mapActions('orgnizations', ['list', 'paginate']),
        reset() {
            this.name = null;
            this.desc = null;
            this.createdAt = null;
        },
        create() {
            $('.ui.new.org.modal').modal({
                onApprove: () => {
                    this.$store.dispatch('orgnizations/create', {
                        name: this.name,
                        desc: this.desc
                    })
                        .finally(() => {
                            if (!this.err) {
                                $('.ui.new.org.modal').modal('hide');
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
            $('.ui.edit.org.modal').modal({
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
                                $('.ui.edit.org.modal').modal('hide');
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
            $('.ui.remove.org.modal').modal({
                onDeny: () => {
                    this.$store.dispatch('orgnizations/delete', item._id)
                        .finally(() => {
                            if (!this.err) {
                                $('.ui.remove.org.modal').modal('hide');
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
            $('.ui.show.org.modal').modal({
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