<template>
    <div class="ui small modal">
        <div class="header">{{header}}</div>
        <div class="content">
            <slot></slot>
        </div>
        <div class="actions">
            <div v-if="approve" class="ui approve button">{{approve}}</div>
            <div v-if="cancel" class="ui cancel button">{{cancel}}</div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['header', 'approve', 'cancel'],
    data() {
        return {
            context: null
        }
    },
    mounted() {
        $(this.$el).modal({
            detachable: false,
            onApprove: () => {
                this.$emit('accept', this.context);
            },
            onDeny: () => {
                this.$emit('deny', this.context);
            }
        });
    },
    methods: {
        show(context) {
            this.context = context;
            $(this.$el).modal('show');
        }
    }
}
</script>
