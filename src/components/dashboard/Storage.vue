<template>
    <div class="ui container">
        <table v-if="entry" class="ui very basic selectable table">
            <thead>
                <tr>
                    <th colspan="6">
                        <input type="file" id="upload" v-show="false" @change="upload({files: $event.target.files, decomp})">
                        <button class="ui small labeled icon button" @click="pick(false)"><i class="upload icon"></i>上传</button>
                        <button class="ui small labeled icon button" @click="pick(true)"><i class="cloud upload icon"></i>解压</button>
                        <button class="ui small labeled icon button" @click="visible = true; name = null;"><i class="folder icon"></i>新建</button>
                    </th>
                </tr>
                <tr>
                    <th v-if="entry.path != '/'" colspan="6">
                        <span>{{entry.path}}</span>
                        <a @click.prevent="select('/')"><i class="ellipsis horizontal icon"></i>根目录</a> 
                        <a @click.prevent="select(`${entry.path}/../`)"><i class="level up icon"></i>上一级</a>                        
                    </th>
                    <th v-else colspan="6">
                        <a @click.prevent="select('/')"><i class="refresh icon"></i>全部文件</a> 
                    </th>
                </tr>
                <tr>
                    <th class="two wide"></th>
                    <th class="three wide">名称</th>
                    <th class="three wide">类型</th>
                    <th class="two wide">大小</th>
                    <th class="three wide">创建于</th>
                    <th class="three wide"></th>
                </tr>
            </thead>
            <transition-group v-if="entry.contents" name="fade" tag="tbody">
                <tr v-if="entry.contents.length" key="checkbox">
                    <td>
                        <div class="ui checkbox">
                            <input type="checkbox" :checked="allChecked" @click="check({checked: $event.target.checked})">
                            <label>文件名</label>
                        </div>
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                        <div v-if="anyChecked">
                            <a @click.prevent="remove()"><i class="large trash icon"></i></a>
                        </div>
                    </td>
                </tr>
                <tr v-if="visible" key="new-folder">
                    <td>
                        <div class="ui checkbox">
                            <input type="checkbox">
                            <label></label>
                        </div>
                        <i class="large folder icon"></i>
                    </td>
                    <td>
                        <div class="ui mini action input">
                            <input id="cf" type="text" placeholder="新建文件夹" v-model="name">
                            <button class="ui icon button" :class="{disabled:busy||!name}" @click="create({name}); visible = false; name = null;"><i class="checkmark icon"></i></button>
                            <button class="ui icon button" @click="name = null; visible = false;"><i class="remove icon"></i></button>
                        </div>
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr v-for="(content, index) in entry.contents" :key="index">
                    <td>
                        <div class="ui checkbox">
                            <input type="checkbox" :checked="content.checked" @click="check({index, checked: $event.target.checked})">
                            <label></label>
                        </div>
                        <i v-if="content.mime" class="large" :class="toIcon(content.mime)"></i>
                        <a v-else @click.prevent="select(content.path)"><i class="large" :class="toIcon(content.mime)"></i></a>
                    </td>
                    <td>
                        <div v-if="item === content" class="ui mini action input">
                            <input type="text" placeholder="名称" v-model="name">
                            <button class="ui icon button" :class="{disabled:busy||!name}" @click="rename({entry: content, name}); item = null; name = null;"><i class="checkmark icon"></i></button>
                            <button class="ui icon button" @click="item = null; name = null;"><i class="remove icon"></i></button>
                        </div>
                        <span v-else-if="content.mime">{{content.name}}</span>
                        <a v-else @click.prevent="select(content.path)">{{content.name}}</a>
                    </td>
                    <td>{{content.mime}}</td>
                    <td>{{content.size | toSize}}</td>
                    <td>{{content.time | toDate}}</td>
                    <td>
                        <div class="actions">
                            <a><i class="large cloud download icon"></i></a>
                            <a><i class="large share alternate icon"></i></a>
                            <a @click.prevent="item = content; name = content.name"><i class="large edit icon"></i></a>
                            <a @click.prevent="remove(content)"><i class="large trash icon"></i></a>
                        </div>
                    </td>
                </tr>
            </transition-group>
        </table>
    </div>
</template>

<script>
import moment from 'moment';
import { mapGetters, mapActions } from 'vuex';
export default {
    data() {
        return {
            visible: false,
            name: null,
            item: null,
            decomp: false
        }
    },
    computed: {
        ...mapGetters('storage', ['entry', 'busy', 'error']),
        allChecked() {
            return this.entry && this.entry.contents && this.entry.contents.filter(e => e.checked).length == this.entry.contents.length;
        },
        anyChecked() {
            return this.entry && this.entry.contents && this.entry.contents.filter(e => e.checked).length > 0;
        }
    },
    methods: {
        ...mapActions('storage', ['select', 'check', 'create', 'remove', 'rename', 'move', 'upload']),
        toIcon(mime) {
            if(!mime) {
                return 'folder icon';
            }
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
                case 'audio/mpeg':
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
        pick(decomp) {
            this.decomp = decomp;
            $('#upload').click();
        }
    },
    filters:{
        toSize(bytes) {
            if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
            const units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB'],
                number = Math.floor(Math.log(bytes) / Math.log(1024));
            return (bytes / Math.pow(1024, Math.floor(number))).toFixed(1) +  ' ' + units[number];
        },
        toDate(time) {
            return moment(time).format('DD/MM/YY hh:mm');
        }
    },
    created() {
        this.select();
    }
}
</script>

<style scoped>
a {
    color: inherit;
}
a:hover {
    cursor: pointer;
}
tr .actions {
    visibility: hidden; 
}
tr:hover .actions {
    visibility: visible;
}
table.basic.selectable.table tr>td {
    padding-left: 12px !important;
}
table.basic.selectable.table th span {
    padding-right: 12px;
}
.ui.checkbox label {
    display: inline;
}
</style>

