<template>
    <div class="ui basic segment">
        <div class="ui secondary menu">
            <div class="ui dropdown item">
                尺寸({{selected}})
                <i class="dropdown icon"></i>
                <div class="menu">
                    <a class="item" v-for="size in sizes" :class="{active: size === selected}" @click="selected = size">{{size}}</a>
                </div>
            </div>
            <a class="ui button item" :class="{active: labeled}" @click="labeled = !labeled">文字</a>
            <div class="ui right floated secondary menu">
                <a class="item" @click="download">
                    <i class="large cloud download icon"></i>
                </a>
            </div>
        </div>
        <qrcode v-for="item in items" :key="item._id" :text="item.sno" :label="labeled? item.sno : ''" :size="selected" :fontcolor="item.device? '#f44265':'#4286f4'"></qrcode>
    </div>
</template>

<script>
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { mapGetters } from 'vuex';
import Qrcode from './Qrcode';

export default {
    components: {
        'qrcode': Qrcode
    },
    data() {
        return {
            selected: 128,
            sizes: [256, 200, 196, 168, 128, 96, 64],
            labeled: true
        }
    },
    computed: mapGetters('serials', ['items']),
    methods: {
        download() {
            const trim = src => {
                const index = src.indexOf(",");
                if (index !== -1) {
                    return src.substr(index + 1, src.length);
                }
                return src;
            };
            const zip = new JSZip();
            const folder = zip.folder('qrcodes');
            $('.qrcode>img').each((i, img) => {
                folder.file(`${$(img).attr('name')}.jpg`, trim($(img).attr('src')), { base64: true });
            });
            zip.generateAsync({ type: 'blob' })
                .then(data => { saveAs(data, `serialz(x${this.selected}).zip`); });
        }
    },
    mounted() {
        $('.ui.dropdown').dropdown();
    }
}
</script>

