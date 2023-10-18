<template>
  <div class="serivice-item">
    <div class="font-size-20 mr-20">{{ service.name }}</div>
    <div class="color-gray font-size-14">
      <div class="d-flex align-center font-bold">
        {{ service.size }}
      </div>
      {{ sevice.qty }}
    </div>
    <div>
      {{ service.price }}
      <span>Upload</span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    service: {
      type: Object,
      default: () => {},
    },
  },
};
</script>
<style lang="scss" scoped>
.service-item {
  display: grid;
  grid-template-columns: 40% 20% 20% 20%;
  padding: 30px 0;
  .file-name {
    text-decoration: underline;
  }
}
</style>