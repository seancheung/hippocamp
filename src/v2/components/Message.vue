<template>
    <div class="ui message" :class="variation">
        <i v-if="dismissable" class="close icon" @click="dismiss"></i>
        <div class="content">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    props: ['dismissable', 'variation'],
    methods: {
        dismiss() {
            $(this.$el).transition('fade');
        }
    }
}
</script>
