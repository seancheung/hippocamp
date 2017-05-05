<template>
  <div class="qrcode">
  </div>
</template>

<script>
import kjua from 'kjua';

export default {
  props: {
    mode: String,
    text: String,
    label: String,
    size: Number,
    mSize: Number,
    fontcolor: String,
    ecLevel: String,
    quiet: Number,
    tooltip: String
  },
  mounted() {
    this.generate();
  },
  methods: {
    generate() {
      const el = kjua({
        mode: this.mode || 'label',
        text: this.text,
        label: this.label,
        size: this.size || 200,
        mSize: this.mSize || 10,
        fontcolor: this.fontcolor || '#4286f4',
        ecLevel: this.ecLevel || 'H',
        quiet: this.quiet || 1
      });
      $(el).attr('name', this.label);
      this.$el.appendChild(el);
      if (this.tooltip) {
        $(this.$el).attr('data-tooltip', this.tooltip);
      }
    }
  }
}
</script>

<style scoped>
div.qrcode {
  display: inline-block;
}
</style>