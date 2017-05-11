<template>
    <div class="ui container">
        <table v-if="entry" class="ui very basic selectable table" :class="{highlight}" @dragenter.stop.prevent="dragenter" @dragleave="dragleave" @drop.stop.prevent="drop" @dragover.stop.prevent="dragover">
            <thead>
                <tr>
                    <th colspan="6">
                        <input type="file" id="pick-files" v-show="false" multiple @change="upload({files: $event.target.files})">
                        <input type="file" id="pick-archives" v-show="false" multiple  @change="upload({files: $event.target.files, archive: true})" accept=".zip">
                        <input type="file" id="pick-dir" v-show="false" @change="uploadDir($event.target.files)" webkitdirectory directory multiple>
                        <button class="ui small labeled icon button" @click="pickFiles"><i class="upload icon"></i>文件</button>
                        <button class="ui small labeled icon button" @click="pickArchives"><i class="cloud upload icon"></i>ZIP</button>
                        <button class="ui small labeled icon button" @click="pickDir"><i class="folder icon"></i>目录</button>
                        <button class="ui small labeled icon button" @click="visible = true; name = null;"><i class="add icon"></i>新建</button>                        
                    </th>
                </tr>
                <tr class="message box">
                    <th colspan="6">
                        <div class="ui small info message">
                            <i class="close icon" @click="dismiss"></i>
                            <div class="header">
                                提示
                            </div>
                            <ul class="list">
                                <li>可同时上传多个文件</li>
                                <li>ZIP: 上传zip文件并解压到当前路径</li>
                                <li>目录: 选取目录并进行上传</li>
                                <li>拖拽文件到文件列表可进行上传</li>
                            </ul>
                        </div>
                    </th>
                </tr>
                <tr>
                    <th v-if="!isRoot">
                        <a class="ui small basic label" @click.prevent="select('/')"><i class="ellipsis horizontal icon"></i>根目录</a> 
                    </th>
                    <th v-else>
                        <a class="ui small basic label" @click.prevent="select('/')"><i class="refresh icon"></i>全部文件</a>                         
                    </th>
                    <th colspan="5">
                        <span v-if="!isRoot">{{entry.path}}</span>
                    </th>
                </tr>
                <tr>
                    <th class="two wide"><a class="ui small basic label" v-if="entry.path != '/'" @click.prevent="select(`${entry.path}/../`)"><i class="level up icon"></i>返回上级</a></th>
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
import JSZip from 'jszip';
import Promise from 'bluebird';
import { mapGetters, mapActions } from 'vuex';
export default {
    data() {
        return {
            visible: false,
            name: null,
            item: null,
            highlight: false
        }
    },
    computed: {
        ...mapGetters('storage', ['entry', 'busy', 'error']),
        allChecked() {
            return this.entry && this.entry.contents && this.entry.contents.filter(e => e.checked).length == this.entry.contents.length;
        },
        anyChecked() {
            return this.entry && this.entry.contents && this.entry.contents.filter(e => e.checked).length > 0;
        },
        isRoot() {
            return this.entry.path === '/';
        }
    },
    methods: {
        ...mapActions('storage', ['select', 'check', 'create', 'remove', 'rename', 'move', 'upload']),
        dragenter(e) {
            this.highlight = true;
        },
        dragover(e) {
            this.highlight = true;
        },
        dragleave(e) {
            this.highlight = false;
        },
        drop(e) {
           this.highlight = false;
           const files = [];
           if(e.dataTransfer.items) {
               for (let i = 0; i < e.dataTransfer.items.length; i++) {
                   const item = e.dataTransfer.items[i];
                   if(item.kind == 'file' && item.type) {
                       files.push(item.getAsFile());
                   }
               }
           } else {
                for (let i = 0; i < e.dataTransfer.files.length; i++) {
                    const file = e.dataTransfer.files[i];
                    if(file.type) {
                        files.push(file);
                    }
                }
           }
           if(files.length) {
               this.upload({files});
           }
        },
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
                case 'text/plain':
                    return 'file text outline icon';
                case 'application/json':
                case 'application/xml':
                case 'application/javascript':
                case 'text/html':
                case 'text/css':
                    return 'file code outline icon';
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
                case 'application/zip':
                    return 'file archive outline icon';
                default:
                    return 'file outline icon';
            }
        },
        pickFiles() {
            $('#pick-files').click();
        },
        pickArchives() {
            $('#pick-archives').click();
        },
        pickDir() {
            $('#pick-dir').click();
        },
        dismiss(e) {
            $(e.target).closest('.message.box').transition('fade');
        },
        uploadDir(files) {
            if(files.length) {
                const promises = [];
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    if(/\^.DS_Store$/.test(file.name)) {
                        continue;
                    }             
                    promises.push(new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.readAsArrayBuffer(file);
                        reader.onload = () => {                            
                            resolve({path: file.webkitRelativePath, buffer: reader.result});
                        };
                        reader.onerror = err => {
                            reject(err);
                        };
                    }));                    
                }
                Promise.all(promises)
                    .then(items => {
                        const zip = new JSZip();
                        for (let i = 0; i < items.length; i++) {
                            if(/\.DS_Store$/.test(items[i].path)) {
                                continue;
                            }
                            zip.file(items[i].path, items[i].buffer);
                        }
                        return zip.generateAsync({ type: 'blob' });
                    })
                    .then(blob => {
                        blob.name = 'blob.zip';
                        return this.upload({files: [blob], archive: true});
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        }
    },
    filters:{
        toSize(bytes) {
            if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
            if(bytes == 0) return '0 B';
            const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
            const number = Math.floor(Math.log(bytes) / Math.log(1024));
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
div.dropzone:hover {
    cursor: pointer;
}
.table.highlight {
    border: 2px dashed #dddddd;
    padding: 4px;
}
.ui.container {
    padding-bottom: 40px;
}
</style>

