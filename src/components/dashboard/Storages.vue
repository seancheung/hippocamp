<template>
    <div class="ui full grid container">
        <div class="four wide column">
            <h4 class="ui top attached center aligned inverted header">容器</h4>
            <div class="ui attached segment">
                <div class="fluid ui small basic icon buttons">
                    <button class="ui button" @click="create"><i class="file icon"></i></button>
                    <button class="ui button"><i class="save icon"></i></button>
                    <button class="ui button"><i class="upload icon"></i></button>
                    <button class="ui button" @click="listBuckets"><i class="refresh icon"></i></button>
                </div>
                <transition-group class="fluid ui vertical menu" name="fade" tag="div">
                    <a v-for="bucket in buckets" class="item" :class="{active: selected && selected._id == bucket._id}" :key="bucket._id" @click="select(bucket)">
                        <h5 class="ui header">
                                    <i :class="selected && selected._id == bucket._id ? 'folder open icon':'folder icon'" ></i>
                                    <div class="content">
                                        {{bucket.name}}
                                        <div class="sub header">{{bucket.desc}}</div>
                                    </div>
                                </h5>
                    </a>
                </transition-group>
            </div>
        </div>
        <div class="twelve wide column">
            <table class="ui very basic table">
                <thead>
                    <tr>
                        <th colspan="7">
                            <i class="spy icon"></i>
                            <i class="world icon"></i>
                            <i class="group icon"></i>
                            <i class="lock icon"></i>
                        </th>
                        <th>
                            <div class="ui small icon buttons">
                                <button class="ui new positive icon button" :class="{disabled:busy}" >
                                    <i class="add icon"></i>
                                </button>
                                <button class="ui icon button" :class="{disabled:busy}" >
                                    <i class="refresh icon"></i>
                                </button>
                            </div>
                        </th>
                    </tr>
                    <tr>
                        <th></th>
                        <th>分享码</th>
                        <th>名称</th>
                        <th>类型</th>
                        <th>大小</th>
                        <th>描述</th>
                        <th>创建于</th>
                        <th></th>
                    </tr>
                </thead>
                <transition-group name="fade" tag="tbody">
                    <tr v-for="(resource, index) in resources" :key="index">
                        <td>{{index + 1}}</td>
                        <td>{{resource.hash}}</td>
                        <td>{{resource.name}}</td>
                        <td><i :class="iconfy(resource.mime)"></i>{{resource.mime}}</td>
                        <td>{{resource.size | kilofy}}</td>
                        <td>{{resource.desc}}</td>
                        <td>{{resource.createdAt | moment}}</td>
                        <td>
                            <div class="ui small icon buttons">
                                <button class="ui share button" :class="{disabled:busy}" :data-clipboard-text="`http://localhost:3000/api/v1/files/resources/${resource.hash}`"><i class="share icon"></i></button>
                                <button class="ui negative delete button" :class="{disabled:busy}"><i class="delete icon"></i></button>
                            </div>
                        </td>
                    </tr>
                </transition-group>
            </table>
        </div>
        <div class="ui small new bucket modal">
            <div class="header">新建容器</div>
            <div class="ui form content" :class="{error}">
                <div class="required field">
                    <label>名称</label>
                    <input type="text" v-model="name" placeholder="请输入容器名称"></input>
                </div>
                <div class="field">
                    <label>描述</label>
                    <textarea v-model="desc" rows="2" placeholder="描述..."></textarea>
                </div>
                <div class="required field">
                    <label>读取权限</label>
                    <select class="ui dropdown" v-model="read">
                        <option value="Public">Public</option>
                        <option value="Internal">Internal</option>
                        <option value="Protected">Protected</option>
                        <option value="Private">Private</option>
                    </select>
                </div>
                <div class="required field">
                    <label>写入权限</label>
                    <select class="ui dropdown" v-model="write">
                        <option value="Public">Public</option>
                        <option value="Internal">Internal</option>
                        <option value="Protected">Protected</option>
                        <option value="Private">Private</option>
                    </select>
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
    </div>
</template>

<script>
import moment from 'moment';
import Clipboard from 'clipboard';
import 'toastr/build/toastr.css';
import toastr from 'toastr';
import {
    mapGetters,
    mapActions
} from 'vuex';
export default {
    data() {
        return {
            name: null,
            desc: null,
            read: 'Private',
            write: 'Private',
            createdAt: null,
            clipboard: null
        }
    },
    filters: {
        moment(date) {
            return moment(date).format('L');
        },
        kilofy(data) {
            return `${Math.floor(data / 1024)}KB`;
        }
    },
    methods: {
        ...mapActions('buckets', {
            'listBuckets': 'list',
            'select': 'select'
        }),
        reset() {
            this.name = null;
            this.desc = null;
            this.read = 'Private';
            this.write = 'Private';
            this.createdAt = null;
        },
        iconfy(mime) {
            switch (mime) {
                case 'application/pdf':
                    return 'file pdf outline icon';
                case 'image/png':
                case 'image/jpg':
                case 'image/jpeg':
                case 'image/gif':
                case 'image/svg':
                    return 'file image outline icon';
                case 'application/json':
                case 'application/xml':
                case 'plain/text':
                    return 'file text outline icon';
                case 'audio/mp3':
                case 'audio/wav':
                case 'audio/ogg':
                    return 'file audio outline icon';
                case 'video/mp4':
                case 'video/avi':
                case 'video/mov':
                case 'video/flv':
                    return 'file video outline icon';
                default:
                    return 'file outline icon';
            }
        },
        create() {
            $('.ui.new.bucket.modal').modal({
                detachable: false,
                onApprove: () => {
                    this.$store.dispatch('buckets/create', {
                        name: this.name,
                        desc: this.desc,
                        access: {
                            read: this.read,
                            write: this.write
                        }
                    })
                        .finally(() => {
                            if (!this.error) {
                                $('.ui.new.bucket.modal').modal('hide');
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
    },
    computed: {
        ...mapGetters('buckets', {
            'buckets': 'items',
            'busy': 'busy',
            'error': 'error',
            'resources': 'resources',
            'selected': 'selected'
        })
    },
    created() {
        this.listBuckets();
        if (!this.clipboard) {
            this.clipboard = new Clipboard('.ui.share.button');
            this.clipboard.on('success', () => {
                toastr.clear();
                toastr.success('复制分享链接到剪贴板成功');
            });
        }
    },
    beforeDestroy() {
        if (this.clipboard) {
            this.clipboard.destroy();
            this.clipboard = null;
        }
    }
}
</script>

<style scoped>
.ui.full.grid {
    height: 100%;
}

.ui.full.grid>.column {
    height: 100%;
}

.ui.full.grid .segment {
    height: 100%;
}

.ui.segment {
    padding: 0;
}

.ui.segment>.fluid.buttons {
    border: 0;
}

.fluid.vertical.menu {
    margin-top: 0px;
    border-left: 0;
    border-right: 0;
    border-bottom: 0;
    border-radius: 0;
}
</style>