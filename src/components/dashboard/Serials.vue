<template>
    <div class="ui contianer">
        <div class="ui grid">
            <div class="three wide column">
                <div class="ui fluid secondary vertical menu">
                    <a class="item" :class="{active:mode == 'list'}" @click.prevent="mode = 'list'">列表</a>
                    <a class="item" :class="{active:mode == 'qrcode'}" @click.prevent="mode = 'qrcode'">二维码</a>
                </div>
            </div>
            <div class="thirteen wide stretched column">
                <transition name="fade">
                    <div v-if="mode == 'qrcode'" class="ui container" key="qrcode">
                        <div class="ui secondary menu">
                            <div class="item">
                                <select class="ui compact selection dropdown" v-model="size">
                                    <option disabled>尺寸(px)</option>
                                    <option value="96">96</option>
                                    <option value="128">128</option>
                                    <option value="256">256</option>
                                </select>
                            </div>
                            <div class="right item">
                                <div class="ui small icon buttons">
                                    <button class="ui new positive icon button" :class="{disabled: busy}" @click="create">
                                        <i class="add icon"></i>
                                    </button>
                                    <button class="ui icon button" :class="{disabled: busy}" @click="list">
                                        <i class="refresh icon"></i>
                                    </button>
                                    <button class="ui purple icon button" :class="{disabled: busy}" @click="download">
                                        <i class="download icon"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="ui container">
                            <qrcode v-for="item in items" :key="item._id" :text="item.sno" :label="item.sno" :size="size" :tooltip="getOrgnization(item.org)" :fontcolor="item.device? '#f44265':'#4286f4'"></qrcode>
                        </div>
                        <div class="ui center aligned basic segment" v-if="pages > 1">
                            <div class="ui borderless pagination menu">
                                <a class="icon item" :class="{disabled: page <= 1}" @click="paginate({page: page - 1, limit})">
                                    <i class="left chevron icon"></i>
                                </a>
                                <a v-for="p in pages" class="item" :class="{active: p == page}" @click="paginate({page: p, limit})">{{p}}</a>
                                <a class="icon item" :class="{disabled: page >= pages}" @click="paginate({page: page + 1, limit})">
                                    <i class="right chevron icon"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div v-else class="ui container" key="list">
                        <crud-table :fields="fields" :index="'sno'" @add="create" @refresh="list" :disabled="busy" :items="items" @remove="remove" :page="page" :pages="pages" :limit="limit" @paginate="paginate" readonly></crud-table>
                    </div>
                </transition>
            </div>
        </div>
        <div class="ui small new serial modal">
            <div class="header">生成序列号</div>
            <div class="ui form content" :class="{error}">
                <div class="required field">
                    <label>数量</label>
                    <input type="text" v-model="amount" placeholder="请输入数量"></input>
                </div>
                <div class="field">
                    <label>组织</label>
                    <select class="ui dropdown" v-model="orgnization">
                        <option v-for="orgnization in orgnizations" :value="orgnization._id">{{orgnization.name}}</option>
                    </select>
                </div>
                <div class="ui error message">
                    <div class="header">操作失败</div>
                    <p>{{ error }}</p>
                </div>
            </div>
            <div class="actions">
                <button class="ui cancel button" :class="{disabled:busy}">取消</button>
                <button class="ui positive button" :class="{disabled:!isValid, loading:busy}">确认</button>
            </div>
        </div>
        <div class="ui small remove serial modal">
            <div class="header">删除序列号</div>
            <div class="content">
                <div class="ui icon warning message">
                    <i class="warning icon"></i>
                    <div class="content">
                        <div class="header">确认删除<b>{{sno}}</b>?</div>
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
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import moment from 'moment';
import {
    mapGetters,
    mapActions
} from 'vuex';
import CrudTable from '../shared/CrudTable';
import Qrcode from '../shared/Qrcode';

export default {
    components: {
        'crud-table': CrudTable,
        'qrcode': Qrcode,
    },
    data() {
        return {
            mode: 'list',
            amount: 10,
            orgnization: null,
            size: 128,
            sno: null,
            fields: [{
                width: 'four',
                name: '序列号',
                key: 'sno'
            },
            {
                width: 'three',
                name: '组织',
                key: 'org',
                format: value => {
                    if (value) {
                        for (let i = 0; i < this.orgnizations.length; i++) {
                            if (this.orgnizations[i]._id == value) {
                                return this.orgnizations[i].name;
                            }
                        }
                    }
                    return '';
                }
            },
            {
                width: 'three',
                name: '设备',
                key: 'device',
                format: value => value? `${value.uuid}(${moment(value.date).format('L')})` : ''
            },
            {
                width: 'two',
                name: '创建于',
                key: 'createdAt',
                format: value => moment(value).format('L')
            }]
        }
    },
    computed: {
        ...mapGetters('serials', ['items', 'busy', 'error', 'pages', 'page', 'limit']),
        ...mapGetters('orgnizations', { 'orgnizations': 'all' }),
        isValid() {
            return this.amount > 0 && this.orgnization;
        }
    },
    methods: {
        ...mapActions('serials', ['list', 'paginate']),
        ...mapActions('orgnizations', { 'listOrgs': 'list' }),
        reset() {
            this.amount = 10;
            this.orgnization = null;
            this.sno = null;
        },
        create() {
            $('.ui.new.serial.modal').modal({
                detachable: false,
                onApprove: () => {
                    this.$store.dispatch('orgnizations/list', true).then(() => {
                        this.$store.dispatch('serials/bulk', {
                            count: this.amount,
                            org: this.orgnization
                        })
                            .finally(() => {
                                if (!this.error) {
                                    $('.ui.new.serial.modal').modal('hide');
                                } else {
                                    console.log(this.error);
                                }
                            });
                    });
                    return false;
                },
                onHidden: () => {
                    this.reset();
                }
            }).modal('show');
        },
        remove(item) {
            this.sno = item.sno;
            $('.ui.remove.serial.modal').modal({
                detachable: false,
                onDeny: () => {
                    this.$store.dispatch('serials/delete', item._id)
                        .finally(() => {
                            if (!this.error) {
                                $('.ui.remove.serial.modal').modal('hide');
                            } else {
                                console.log(this.error);
                            }
                        });
                    return false;
                },
                onHidden: () => {
                    this.reset();
                }
            }).modal('show');
        },
        getOrgnization(data) {
            if (data) {
                for (let i = 0; i < this.orgnizations.length; i++) {
                    if (this.orgnizations[i]._id == data) {
                        return this.orgnizations[i].name;
                    }
                }
            }
            return '';
        },
        download() {
            const trim = src => {
                let index = src.indexOf(",");
                if (index !== -1) {
                    return src.substring(index + 1, src.length);
                }
                return src;
            };
            const zip = new JSZip();
            const folder = zip.folder('qrcodes');
            for (let i = 0; i < this.$children.length; i++) {
                let image = this.$children[i].$el.children[0];
                folder.file(image.getAttribute('name') + '.jpg', trim(image.getAttribute('src')), { base64: true });
            }
            zip.generateAsync({ type: 'blob' })
                .then(content => {
                    saveAs(content, 'serials.zip');
                });
        }
    },
    created() {
        this.listOrgs();
        this.list();
    }
}
</script>

<style scoped>

</style>