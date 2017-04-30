<template>
    <div class="ui contianer">
        <table class="ui very basic celled striped table">
            <thead class="full-width">
                <th colspan="4">
                    <div class="ui right floated tiny buttons">
                        <button class="ui new positive icon button" :class="{loading:waiting}" @click="create">
                        <i class="add icon"></i>
                    </button>
                        <button class="ui icon button" :class="{loading:waiting}" @click="list">
                        <i class="refresh icon"></i>
                    </button>
                    </div>
                    <div class="ui search">
                        <div class="ui small icon input">
                            <input type="text" placeholder="搜索..." v-model="search"><i class="search icon"></i>
                        </div>
                    </div>
                </th>
                <tr>
                    <th>名称</th>
                    <th>描述</th>
                    <th>创建于</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in filtered">
                    <td><a href="#" @click.prevent="show(item)">{{item.name}}</a></td>
                    <td>{{item.desc}}</td>
                    <td>{{item.createdAt | moment}}</td>
                    <td>
                        <div class="ui two small icon buttons">
                            <button class="ui edit button" @click="edit(item)"><i class="edit icon"></i></button>
                            <button class="ui negative delete button" @click="remove(item)"><i class="delete icon"></i></button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="ui small new modal">
            <div class="header">新建组织</div>
            <div class="ui form content">
                <div class="required field">
                    <label>名称</label>
                    <input type="text" v-model="selected.name" placeholder="请输入组织名称"></input>
                </div>
                <div class="field">
                    <label>描述</label>
                    <textarea v-model="selected.desc" rows="2" placeholder="描述..."></textarea>
                </div>
            </div>
            <div class="actions">
                <button class="ui cancel button" :class="{loading:waiting}">取消</button>
                <button class="ui positive button" :class="{disabled:!selected.name, loading:waiting}">确认</button>
            </div>
        </div>
        <div class="ui edit modal">
            <div class="header">修改组织</div>
            <div class="ui form content">
                <div class="required field">
                    <label>名称</label>
                    <input type="text" v-model="selected.name" placeholder="请输入组织名称"></input>
                </div>
                <div class="field">
                    <label>描述</label>
                    <textarea v-model="selected.desc" rows="2" placeholder="描述..."></textarea>
                </div>
            </div>
            <div class="actions">
                <button class="ui cancel button" :class="{loading:waiting}">取消</button>
                <button class="ui positive button" :class="{disabled:!selected.name, loading:waiting}">确认</button>
            </div>
        </div>
        <div class="ui small show modal">
            <div class="header">组织信息</div>
            <div class="ui center aligned container content">
                <h2 class="ui icon header">
                    <i class="group icon"></i>
                    <div class="content">
                        {{selected.name}}
                        <div class="sub header">{{selected.createdAt | moment}}</div>
                        <div>{{selected.desc}}</div>
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
                <div class="ui warning message">确认删除? 此操作不可撤销</div>
            </div>
            <div class="actions">
                <div class="ui ok button" :class="{loading:waiting}">取消</div>
                <div class="ui negative button" :class="{loading:waiting}">确认</div>
            </div>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';
    export default {
        data() {
            return {
                items: [],
                selected: {
                    _id: '',
                    name: '',
                    desc: '',
                    set(value) {
                        this._id = value._id;
                        this.name = value.name;
                        this.desc = value.desc;
                    },
                    reset() {
                        this._id = '';
                        this.name = '';
                        this.desc = '';
                    }
                },
                search: '',
                waiting: false
            }
        },
        filters: {
            moment(date) {
                return moment(date).format('LL');
            },
            search(data) {
                return data.filter(item => item.name.includes(this.search));
            }
        },
        computed: {
            filtered() {
                return this.items.filter(org => org.name.includes(this.search));
            }
        },
        methods: {
            list() {
                this.waiting = true;
                this.$http.get('/api/v1/orgnizations')
                    .then(res => {
                        this.items = res.body;
                        console.log(this.items);
                    })
                    .catch(err => {
                        console.log(err);
                    })
                    .finally(() => {
                        this.waiting = false;
                    });
            },
            create() {
                $('.ui.new.modal').modal({
                    onApprove: () => {
                        this.waiting = true;
                        this.$http.post('/api/v1/orgnizations', {
                                name: this.selected.name,
                                desc: this.selected.desc
                            })
                            .then(res => {
                                this.items.push(res.body);
                                $('.ui.new.modal').modal('hide');
                            })
                            .catch(err => {
                                console.log(err);
                            })
                            .finally(() => {
                                this.waiting = false;
                            });
                        return false;
                    },
                    onHidden: () => {
                        this.selected.reset();
                    }
                }).modal('show');
            },
            edit(item) {
                this.selected.set(item);
                $('.ui.edit.modal').modal({
                    onApprove: () => {
                        this.waiting = true;
                        this.$http.put('/api/v1/orgnizations/' + this.selected._id, {
                                name: this.selected.name,
                                desc: this.selected.desc
                            })
                            .then(res => {
                                console.log(res.body);
                                const index = this.items.findIndex(item => item._id == res.body._id);
                                if (index >= 0) {
                                    this.$set(this.items, index, res.body);
                                }
                                $('.ui.edit.modal').modal('hide');
                            })
                            .catch(err => {
                                console.log(err);
                            })
                            .finally(() => {
                                this.waiting = false;
                            });
                        return false;
                    },
                    onHidden: () => {
                        this.selected.reset();
                    }
                }).modal('show');
            },
            remove(item) {
                this.selected.set(item);
                $('.ui.remove.modal').modal({
                    onDeny: () => {
                        this.waiting = true;
                        this.$http.delete('/api/v1/orgnizations/' + this.selected._id)
                            .then(res => {
                                const index = this.items.findIndex(item => item._id == this.selected._id);
                                if (index >= 0) {
                                    this.items.splice(index, 1);
                                }
                                $('.ui.remove.modal').modal('hide');
                            })
                            .catch(err => {
                                console.log(err);
                            })
                            .finally(() => {
                                this.waiting = false;
                            });
                    },
                    onHidden: () => {
                        this.selected.reset();
                    }
                }).modal('show');
            },
            show(item) {
                this.selected.set(item);
                $('.ui.show.modal').modal({
                    onHidden: () => {
                        this.selected.reset();
                    }
                }).modal('show');
            }
        },
        mounted() {
            this.list();
        }
    }
</script>

<style scoped>
    .ui.search {
        display: inline-block;
    }
</style>