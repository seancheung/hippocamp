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
                        二维码
                    </div>
                    <div v-else class="ui container" key="list">
                        <crud-table :fields="fields" :index="'name'" @add="create" @refresh="list()" :disabled="busy" :items="items" @show="show" @edit="edit" @remove="remove" :pagination="pagination" @paginate="paginate"></crud-table>
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
    </div>
</template>

<script>
import JSZip from 'jszip';
import saveAs from 'file-saver';
import kjua from 'kjua';
import moment from 'moment';
import {
    mapGetters,
    mapActions
} from 'vuex';
import CrudTable from '../shared/CrudTable';

export default {
    components: {
        'crud-table': CrudTable
    },
    data() {
        return {
            mode: 'list',
            amount: 10,
            orgnization: null,
            fields: [{
                width: 'four',
                name: '序列号',
                key: 'sno',
                primary: true
            },
            {
                width: 'two',
                name: '组织',
                key: 'org',
                format: value => {
                    if (value) {
                        for (var i = 0; i < this.orgnizations.length; i++) {
                            if (this.orgnizations[i]._id == value) {
                                return this.orgnizations[i].name;
                            }
                        }
                    }
                    return '';
                }
            },
            {
                width: 'four',
                name: '设备',
                key: 'device'
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
        ...mapGetters('serials', ['items', 'busy', 'error', 'pagination', 'count']),
        ...mapGetters('orgnizations', { orgnizations: 'items' }),
        isValid() {
            return this.amount > 0 && this.orgnization;
        }
    },
    methods: {
        ...mapActions('serials', ['list', 'paginate']),
        createImage(serial) {
            const el = kjua({
                mode: 'label',
                text: serial.sno,
                label: serial.sno,
                size: 200,
                mSize: 10,
                fontcolor: serial.device ? '#f44141' : '#4286f4',
                ecLevel: 'H',
                quiet: 1
            });
            $('#qrcode').append(el);
        },
        reset() {
            this.amount = 10;
            this.orgnization = null;
        },
        create() {
            $('.ui.new.serial.modal').modal({
                detachable: false,
                onApprove: () => {
                    this.$store.dispatch('orgnizations/list', true).then(() => {
                        this.$store.dispatch('serials/create', {
                            amount: this.amount,
                            orgnization: this.orgnization
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
        edit(item) {

        },
        remove(item) {

        },
        show(item) {

        }
    },
    created() {
        this.list();
    }
}
</script>

<style scoped>

</style>