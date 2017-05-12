<template>
    <div class="ui basic segment">
        <div class="ui inverted dimmer" :class="{active:pending}">
            <div class="content">
                <div class="center">
                    <div v-if="progress" id="progress-bar" class="ui tiny progress">
                        <div class="bar"></div>
                    </div>
                    <h1 v-else class="ui header">
                        <i class="big icons">
                            <i class="inverted grey big loading spinner icon"></i>
                            <i class="inverted grey small cloud icon"></i>
                        </i>
                    </h1>
                    <button class="ui small labeled icon button" @click="abort"><i class="cancel icon"></i>取消</button>
                </div>
            </div>
        </div>
        <table v-if="entry" class="ui very basic selectable table" :class="{highlight}" @dragenter.stop.prevent="dragenter" @dragleave="dragleave" @drop.stop.prevent="drop" @dragover.stop.prevent="dragover">
            <thead>
                <tr>
                    <th colspan="6">
                        <input type="file" id="pick-files" v-show="false" multiple @change="upload({files: $event.target.files}); $event.target.value = null;">
                        <input type="file" id="pick-archives" v-show="false" multiple  @change="upload({files: $event.target.files, archive: true}); $event.target.value = null;" accept=".zip">
                        <input type="file" id="pick-dir" v-show="false" @change="uploadDir($event.target.files); $event.target.value = null;" webkitdirectory directory multiple>
                        <div class="ui small floating labeled icon dropdown button" :class="{disabled:busy}">
                            <i class="cloud upload icon"></i>
                            <span>上传</span>
                            <div class="menu">
                                <a class="item" @click="pickFiles"><i class="small file icon"></i>文件</a>
                                <a v-if="supportDir" class="item" @click="pickDir"><i class="small folder icon"></i>文件夹</a>
                                <a class="item" @click="pickArchives"><i class="small archive icon"></i>压缩包</a>
                            </div>
                        </div>
                        <div class="ui small floating labeled icon dropdown button" :class="{disabled:busy}">
                            <i class="add icon"></i>
                            <span>新建</span>
                            <div class="menu">
                                <a class="item" @click="insert"><i class="small folder icon"></i>文件夹</a>
                            </div>
                        </div>
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
                                <li v-if="supportDir">支持文件夹上传</li>
                                <li v-else><strike>当前浏览器不支持文件夹上传</strike></li>
                                <li>支持多文件同时上传</li>
                                <li>支持拖拽文件进行上传</li>
                                <li>支持上传zip文件并解压到当前路径</li>
                            </ul>
                        </div>
                    </th>
                </tr>
                <tr v-show="error" class="message box">
                    <th colspan="6">
                        <div class="ui small error message">
                            <i class="close icon" @click="dismiss"></i>
                            <div class="header">
                                错误
                            </div>
                            <p>{{ error }}</p>
                        </div>
                    </th>
                </tr>
                <tr>
                    <th v-if="!isRoot">
                        <a class="ui small basic label" @click="select('/')"><i class="ellipsis horizontal icon"></i>根目录</a> 
                    </th>
                    <th v-else>
                        <a class="ui small basic label" @click="select('/')"><i class="refresh icon"></i>全部文件</a>                         
                    </th>
                    <th colspan="5">
                        <span v-if="!isRoot">{{entry.path}}</span>
                    </th>
                </tr>
                <tr>
                    <th class="two wide"><a class="ui small basic label" v-if="entry.path != '/'" @click="select(`${entry.path}/../`)"><i class="level up icon"></i>返回上级</a></th>
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
                            <a @click="remove()"><i class="large trash icon"></i></a>
                        </div>
                    </td>
                </tr>
                <tr v-if="inserting" key="new-folder">
                    <td>
                        <div class="ui checkbox">
                            <input type="checkbox">
                            <label></label>
                        </div>
                        <i class="large folder icon"></i>
                    </td>
                    <td>
                        <div class="ui mini action input">
                            <input id="cf" type="text" placeholder="新建文件夹" v-model="name" @blur="reset">
                            <button class="ui icon button" :class="{disabled:busy||!name}" @click="create({name}); reset();"><i class="checkmark icon"></i></button>
                            <button class="ui icon button" :class="{disabled:busy}" @click="reset"><i class="remove icon"></i></button>
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
                        <i class="large icons">
                            <i v-if="content.mime" :class="toIcon(content.mime)"></i>
                            <a v-else @click="select(content.path)"><i :class="toIcon(content.mime)"></i></a>
                            <i v-if="isShared(content)" class="corner grey share alternate icon"></i>
                        </i>
                    </td>
                    <td>
                        <div v-if="editing === content" class="ui mini action input">
                            <input type="text" placeholder="名称" v-model="name" @blur="reset">
                            <button class="ui icon button" :class="{disabled:busy||!name}" @click="rename({entry: content, name}); reset();"><i class="checkmark icon"></i></button>
                            <button class="ui icon button" :class="{disabled:busy}" @click="reset"><i class="remove icon"></i></button>
                        </div>
                        <span v-else-if="content.mime">{{content.name}}</span>
                        <a v-else @click="select(content.path)">{{content.name}}</a>
                    </td>
                    <td>{{content.mime}}</td>
                    <td>{{content.size | toSize}}</td>
                    <td>{{content.time | toDate}}</td>
                    <td>
                        <div class="actions" :class="{disabled:busy}">
                            <a @click="download(content)"><i class="large cloud download icon" :class="{disabled:busy}"></i></a>
                            <a @click="edit(content)"><i class="large edit icon" :class="{disabled:busy}"></i></a>
                            <a @click="remove(content)"><i class="large trash icon" :class="{disabled:busy}"></i></a>
                            <div class="ui icon floating dropdown" v-if="isShared(content)">
                                <i class="large horizontal ellipsis icon" :class="{disabled:busy}"></i>
                                <div class="menu">
                                    <div class="header">{{toSharing(content)}}</div>
                                    <a class="copy item" :data-clipboard-text="`${host}/api/v1/storage/dl/${toSharing(content)}`"><i class="large copy icon"></i>复制分享链接</a>
                                    <a class="item" @click="removeSharing(content.path)"><i class="large ban icon"></i>取消分享</a>
                                </div>
                            </div>
                            <a v-else @click="createSharing({path: content.path})"><i class="large share alternate icon" :class="{disabled:busy}"></i></a>
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
import { saveAs } from 'file-saver';
import Promise from 'bluebird';
import Clipboard from 'clipboard';
import toastr from 'toastr';
import { mapGetters, mapActions } from 'vuex';
export default {
    data() {
        return {
            inserting: null,
            name: null,
            editing: null,
            highlight: null,
            supportDir: false,
            clipboard: null,
            host: 'http://localhost'
        }
    },
    computed: {
        ...mapGetters('storage', ['entry', 'busy', 'error', 'progress', 'pending', 'sharings']),
        allChecked() {
            return this.entry && this.entry.contents && this.entry.contents.filter(e => e.checked).length == this.entry.contents.length;
        },
        anyChecked() {
            return this.entry && this.entry.contents && this.entry.contents.filter(e => e.checked).length > 0;
        },
        isRoot() {
            return this.entry && this.entry.path === '/';
        },
        isIE() {
            return /msie|trident/i.test(window.navigator.userAgent);
        }
    },
    methods: {
        ...mapActions('storage', ['select', 'check', 'create', 'remove', 'rename', 'move', 'upload', 'abort', 'listSharings', 'createSharing', 'removeSharing']),
        reset() {
            this.editing = null; 
            this.name = null; 
            this.inserting = null;
        },
        edit(item) {
            this.editing = item; 
            this.name = item.name; 
            this.inserting = null;
        },
        insert() {
            this.editing = null; 
            this.name = null; 
            this.inserting = true;
        },
        download(item) {
            this.$store.dispatch('storage/download', item.path)
                .then(res => {
                    saveAs(new Blob([res.data], {type: res.headers.get('content-type')}), res.headers.get('content-disposition').match(/filename="([^"]+)"/)[1]);
                });
        },
        dragenter(e) {
            this.highlight = true;
        },
        dragover(e) {
            this.highlight = true;
        },
        dragleave(e) {
            this.highlight = null;
        },
        drop(e) {
           this.highlight = null;
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
        isShared(item) {
            return this.sharings && this.sharings.length && this.sharings.some(s => s.path == item.path);
        },
        toSharing(item) {
            return this.sharings.find(s => s.path == item.path).hash;
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
            return moment(time).format('DD/MM/YY HH:mm');
        }        
    },
    created() {
        this.select()
            .then(() => {
                this.listSharings();
            });
    },
    updated() {
        $('.ui.dropdown').not('.ready').addClass('ready').dropdown();
        $('.action.input>input').not(':focus').select().focus();       
    },
    watch: {
        progress(val) {
            $('#progress-bar').progress({
                percent: val
            }); 
        }
    },
    mounted() {
        $('<input/>').each((i, el) => {
            this.supportDir = 'webkitdirectory' in el 
                || 'mozdirectory' in el 
                || 'odirectory' in el 
                || 'msdirectory' in el 
                || 'directory' in el;
        })
        .remove();    
        if (!this.clipboard) {
            this.clipboard = new Clipboard('a.copy');
            this.clipboard.on('success', e => {
                toastr.clear();
                toastr.success('复制分享链接到剪贴板成功');
                e.clearSelection();
            });
        }
        this.host = window.location.origin;
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
@import url('~toastr/build/toastr.css');

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
.ui.segment {
    padding: 0;
    padding-bottom: 40px;
    margin: 0;
}
.actions.disabled>a {
    pointer-events: none;
    cursor: default;
}
.dimmer .progress {
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
}
</style>

