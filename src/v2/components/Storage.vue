<template>
    <div class="ui basic segment">
        <div class="ui breadcrumb" v-if="user">
            <template v-if="permission('orgnizations', 'list')">
                <router-link :to="{name: 'Orgnizations'}" class="section">组织</router-link>
                <i class="right caret icon divider"></i>
            </template>
            <template v-if="permission('orgnizations', 'show', user.org)">
                <router-link :to="{name: 'Orgnization', params: {id: user.org._id}}" class="section">{{user.org.name}}</router-link>
                <i class="right angle icon divider"></i>
            </template>
            <template v-if="permission('users', 'list', user.org)">
                <router-link :to="{name: 'Users', params: {id: user.org._id}}" class="section">用户</router-link>
                <i class="right caret icon divider"></i>
            </template>
            <template v-if="permission('users', 'show', user)">
                <router-link :to="{name: 'User', params: {id}}" class="section">{{user && user.name}}</router-link>
                <i class="right angle icon divider"></i>
            </template>
            <div class="active section">存储</div>
        </div>
        <div class="ui inverted dimmer" :class="{active: wait}">
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
                    <button v-if="permission('storage', 'abort', user)" class="ui small labeled icon button" @click="abort">
                        <i class="cancel icon"></i>取消</button>
                </div>
            </div>
        </div>
        <table v-if="item" class="ui very basic selectable table" :class="{highlight}" @dragenter.stop.prevent="dragenter" @dragleave="dragleave" @drop.stop.prevent="drop" @dragover.stop.prevent="dragover">
            <thead>
                <template v-if="permission('storage', 'upload', user)">
                    <tr>
                        <th colspan="6">
                            <input type="file" id="pick-files" v-show="false" multiple @change="uploadFiles">
                            <input type="file" id="pick-archives" v-show="false" multiple @change="uploadArchives" accept=".zip">
                            <input type="file" id="pick-dir" v-show="false" @change="uploadDir" webkitdirectory directory multiple>
                            <div class="ui small floating labeled icon dropdown button" :class="{disabled:pending}">
                                <i class="cloud upload icon"></i>
                                <span>上传</span>
                                <div class="menu">
                                    <a class="item" @click="pickFiles">
                                        <i class="small file icon"></i>文件</a>
                                    <a v-if="supportDir" class="item" @click="pickDir">
                                        <i class="small folder icon"></i>文件夹</a>
                                    <a class="item" @click="pickArchives">
                                        <i class="small archive icon"></i>压缩包</a>
                                </div>
                            </div>
                            <div class="ui small floating labeled icon dropdown button" :class="{disabled:pending}">
                                <i class="add icon"></i>
                                <span>新建</span>
                                <div class="menu">
                                    <a class="item" @click="insert">
                                        <i class="small folder icon"></i>文件夹</a>
                                </div>
                            </div>
                        </th>
                    </tr>
                    <tr class="message box">
                        <th colspan="6">
                            <message :dismissable="true" :variation="'small info'">
                                <div class="header">
                                    提示
                                </div>
                                <ul class="list">
                                    <li v-if="supportDir">支持文件夹上传</li>
                                    <li v-else>
                                        <strike>当前浏览器不支持文件夹上传</strike>
                                    </li>
                                    <li>支持多文件同时上传</li>
                                    <li>支持拖拽文件进行上传</li>
                                    <li>支持上传zip文件并解压到当前路径</li>
                                </ul>
                            </message>
                        </th>
                    </tr>
                </template>
                <tr v-show="error" class="message box">
                    <th colspan="6">
                        <message :dismissable="true" :variant="'small error'">
                            <div class="header">
                                错误
                            </div>
                            <p>{{ error }}</p>
                        </message>
                    </th>
                </tr>
                <tr>
                    <th v-if="!isRoot">
                        <a class="ui small basic label" @click="listDir('/')">
                            <i class="ellipsis horizontal icon"></i>根目录</a>
                    </th>
                    <th v-else>
                        <a class="ui small basic label" @click="listDir('/')">
                            <i class="refresh icon"></i>全部文件</a>
                    </th>
                    <th colspan="5">
                        <span v-if="!isRoot">{{item.path}}</span>
                    </th>
                </tr>
                <tr>
                    <th class="two wide">
                        <a class="ui small basic label" v-if="!isRoot" @click="listParent(item)">
                            <i class="level up icon"></i>返回上级</a>
                    </th>
                    <th class="three wide">名称</th>
                    <th class="three wide">类型</th>
                    <th class="two wide">大小</th>
                    <th class="three wide">创建于</th>
                    <th class="three wide"></th>
                </tr>
            </thead>
            <transition-group v-if="item.contents" name="fade" tag="tbody">
                <tr v-if="item.contents.length" key="checkbox">
                    <td>
                        <div class="ui checkbox">
                            <input type="checkbox" :checked="allChecked" @click="checkAll($event.target.checked)">
                            <label>文件名</label>
                        </div>
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                        <div v-if="permission('storage', 'bulkRemove', user) && anyChecked">
                            <a @click="$refs.bulk.show()">
                                <i class="large trash icon"></i>
                            </a>
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
                            <input id="cf" type="text" placeholder="新建文件夹" v-model="name" @blur="close">
                            <button class="ui icon button" :class="{disabled:pending||!name}" @click="createDir">
                                <i class="checkmark icon"></i>
                            </button>
                            <button class="ui icon button" :class="{disabled:pending}" @click="reset">
                                <i class="remove icon"></i>
                            </button>
                        </div>
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr v-for="(content, index) in item.contents" :key="index">
                    <td>
                        <div class="ui checkbox">
                            <input type="checkbox" :checked="isChecked(content)" @click="check(content, $event.target.checked)">
                            <label></label>
                        </div>
                        <i class="large icons">
                            <i v-if="content.mime" :class="toIcon(content.mime)"></i>
                            <a v-else @click="listDir(content.path)">
                                <i :class="toIcon(content.mime)"></i>
                            </a>
                        </i>
                    </td>
                    <td>
                        <div v-if="editing === content" class="ui mini action input">
                            <input type="text" placeholder="名称" v-model="name" @blur="close">
                            <button class="ui icon button" :class="{disabled:pending||!name}" @click="renameFile(content)">
                                <i class="checkmark icon"></i>
                            </button>
                            <button class="ui icon button" :class="{disabled:pending}" @click="reset">
                                <i class="remove icon"></i>
                            </button>
                        </div>
                        <span v-else-if="content.mime">{{content.name}}</span>
                        <a v-else @click="listDir(content.path)">{{content.name}}</a>
                    </td>
                    <td>{{content.mime}}</td>
                    <td>{{content.size | toSize}}</td>
                    <td>{{content.time | toDate}}</td>
                    <td>
                        <div class="hover-links actions" :class="{disabled:pending}">
                            <a v-if="permission('storage', 'download', user)" @click="downloadFile(content)">
                                <i class="large cloud download icon" :class="{disabled:pending}"></i>
                            </a>
                            <a v-if="permission('storage', 'rename', user)" @click="edit(content)">
                                <i class="large edit icon" :class="{disabled:pending}"></i>
                            </a>
                            <a v-if="permission('storage', 'remove', user)" @click="$refs.remove.show(content)">
                                <i class="large trash icon" :class="{disabled:pending}"></i>
                            </a>
                        </div>
                    </td>
                </tr>
            </transition-group>
        </table>
        <modal ref="bulk" :header="'删除选中的文件?'" :approve="'确认'" :cancel="'取消'" @accept="removeChecked">此操作不可撤销</modal>
        <modal ref="remove" :header="'删除文件?'" :approve="'确认'" :cancel="'取消'" @accept="content => removeFile(content)">此操作不可撤销</modal>
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
    props: ['id'],
    data() {
        return {
            inserting: null,
            name: null,
            editing: null,
            highlight: null,
            supportDir: false,
            clipboard: null,
            checked: null
        }
    },
    computed: {
        ...mapGetters('storage', ['item', 'pending', 'error', 'progress', 'wait']),
        ...mapGetters('users', { user: 'item' }),
        ...mapGetters(['permission']),
        allChecked() {
            return this.item && this.checked && this.item.contents && this.item.contents.filter(e => this.checked.includes(e.path)).length == this.item.contents.length;
        },
        anyChecked() {
            return this.item && this.checked && this.item.contents && this.item.contents.filter(e => this.checked.includes(e.path)).length > 0;
        },
        isRoot() {
            return this.item && this.item.path === '/';
        },
        isIE() {
            return /msie|trident/i.test(window.navigator.userAgent);
        }
    },
    methods: {
        ...mapActions('storage', ['show', 'remove', 'rename', 'move', 'upload', 'abort', 'bulkRemove', 'download']),
        ...mapActions('users', { showUser: 'show' }),
        reset() {
            this.editing = null;
            this.name = null;
            this.inserting = null;
        },
        close() {
            setTimeout(this.reset, 500);
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
        downloadFile(item) {
            this.download({ id: this.id, path: item.path })
                .then(res => {
                    saveAs(new Blob([res.data], { type: res.headers.get('content-type') }), res.headers.get('content-disposition').match(/filename="([^"]+)"/)[1]);
                });
        },
        listDir(path) {
            this.show({ id: this.id, path });
        },
        listParent(item) {
            this.show({ id: this.id, path: item.path.substr(0, item.path.length - item.name.length) || '/' });
        },
        checkAll(checked) {
            this.checked = checked ? this.item.contents.map(i => i.path) : null;
        },
        removeChecked() {
            if (this.checked && this.checked.length) {
                this.bulkRemove({ id: this.id, files: this.checked });
            }
        },
        createDir() {
            this.upload({ id: this.id, path: this.item.path + '/' + this.name })
                .finally(this.reset);
        },
        isChecked(item) {
            return this.checked && this.checked.length && this.checked.includes(item.path);
        },
        check(item, checked) {
            if (checked) {
                if (!this.checked) {
                    this.checked = [item.path];
                } else if (this.checked.includes(item.path)) {
                    this.checked.push(item.path);
                }
            } else if (this.checked && this.checked.length) {
                const index = this.checked.indexOf(item.path);
                if (index >= 0) {
                    this.checked.splice(index, 1);
                }
            }
        },
        renameFile(item) {
            this.rename({ id: this.id, path: item.path, name: this.name })
                .finally(this.reset);
        },
        removeFile(item) {
            this.remove({ id: this.id, path: item.path });
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
            if (e.dataTransfer.items) {
                for (let i = 0; i < e.dataTransfer.items.length; i++) {
                    const item = e.dataTransfer.items[i];
                    if (item.kind == 'file') {
                        const file = item.getAsFile();
                        if (file.size || item.type) {
                            files.push(file);
                        }
                    }
                }
            } else {
                for (let i = 0; i < e.dataTransfer.files.length; i++) {
                    const file = e.dataTransfer.files[i];
                    if (file.file || file.type) {
                        files.push(file);
                    }
                }
            }
            if (files.length) {
                this.upload({ id: this.id, files });
            }
        },
        toIcon(mime) {
            if (!mime) {
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
        uploadFiles(e) {
            const files = e.target.files;
            this.upload({ id: this.id, files });
            e.target.value = null;
        },
        uploadArchives(e) {
            const files = e.target.files;
            this.upload({ id: this.id, files, unarchive: true });
            e.target.value = null;
        },
        uploadDir(e) {
            const files = e.target.files;
            if (files.length) {
                const promises = [];
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    if (/\^.DS_Store$/.test(file.name)) {
                        continue;
                    }
                    promises.push(new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.readAsArrayBuffer(file);
                        reader.onload = () => {
                            resolve({ path: file.webkitRelativePath, buffer: reader.result });
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
                            if (/\.DS_Store$/.test(items[i].path)) {
                                continue;
                            }
                            zip.file(items[i].path, items[i].buffer);
                        }
                        return zip.generateAsync({ type: 'blob' });
                    })
                    .then(blob => {
                        blob.name = 'blob.zip';
                        return this.upload({ id: this.id, files: [blob], unarchive: true });
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
            e.target.value = null;
        }
    },
    filters: {
        toSize(bytes) {
            if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
            if (bytes == 0) return '0 B';
            const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
            const number = Math.floor(Math.log(bytes) / Math.log(1024));
            return (bytes / Math.pow(1024, Math.floor(number))).toFixed(1) + ' ' + units[number];
        },
        toDate(time) {
            return moment(time).format('DD/MM/YY HH:mm');
        }
    },
    created() {
        this.showUser(this.id);
        this.show({ id: this.id });
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

table.highlight {
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

#progress-bar {
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
}
</style>

