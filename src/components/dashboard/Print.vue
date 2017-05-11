<template>
    <div class="ui contianer">
        <div class="ui grid">
            <div class="stretched column">
                <transition name="fade">
                    <div class="ui container" key="qrcode">
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
                                    <button class="ui purple icon button" @click="download">
                                        <i class="download icon"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="ui container">
                            <qrcode v-for="n in (end - start + 1)" :key="n" :text="prefix+(n+1000000+start-1).toString().substring(1)" :label="prefix+(n+1000000+start-1).toString().substring(1)" :size="size"></qrcode>
                        </div>
                    </div>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import Qrcode from '../shared/Qrcode';
export default {
    components: {
        'qrcode': Qrcode,
    },
    data() {
        return {
            size: 128,
            start: 73,
            end: 84,
            prifix: 'CT'
        }
    },
    methods: {
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
                    saveAs(content, 'qrcodes.zip');
                });
        }
    }
}
</script>

<style scoped>

</style>