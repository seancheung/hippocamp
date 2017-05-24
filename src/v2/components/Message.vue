<template>
    <div class="ui message">
        <i v-if="dissmisable" class="close icon" @click="hide"></i>
        <div class="content">
            <div v-if="count" class="header">
                <i class="clock icon"></i>
                {{count}}
            </div>
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    props: ['duration', 'dissmisable'],
    data() {
        return {
            count: 0,
            interval: null
        }
    },
    methods: {
        show() {
            if (this.interval || !this.duration) {
                return;
            }
            this.count = this.duration;
            if (this.count > 0) {
                this.interval = window.setInterval(() => {
                    if (this.count <= 1) {
                        this.hide();
                    } else {
                        this.count--;
                    }
                }, 1000);
            }
        },
        hide() {
            if (this.interval) {
                window.clearInterval(this.interval);
                this.interval = null;
            }
            this.count = 0;
            $(this.$el).transition('fade');
        }
    },
    mounted() {
        this.show();
    }
}
</script>
