<template>
    <div class="ui stackable grid container">
        <div class="twelve wide column">
            <div class="ui card">
            </div>
        </div>
        <div class="four wide column">
            <div class="ui card"></div>
        </div>
    </div>
</template>

<script>
import JSZip from 'jszip';
import saveAs from 'file-saver';
import kjua from 'kjua';

export default {
    data() {
        return {
            serials: [],
            serial: {
                sno: '12345'
            }
        }
    },
    mounted() {
        this.createImage(this.serial);
    },
    methods: {
        getSerials() {

        },
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
        }
    },
    filters: {

    }
}
</script>

<style scoped>
.grid.container .ui.card {
    height: 200px;
    width: 100%;
}
</style>