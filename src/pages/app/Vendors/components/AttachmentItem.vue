<template>
  <div class="attachment-item d-flex justify-content-between">
    <div class="d-flex align-center">
      <div class="font-size-20 mr-20" :class="{ 'font-bold': !!attachment.fileName }">{{ attachment.name }}</div>
      <div class="color-gray font-size-14" :class="{ 'font-bold': attachment.isRequired }">
        {{ attachment.isRequired ? "Required" : "Optional" }}
      </div>
    </div>
    <div v-if="attachment.fileName" class="d-flex align-center font-bold">
      <img :src="`${$iconURL}common/pin-dark.svg`" class="mr-20 ml-20" />
      <a :href="attachment.url" target="_blank" class="file-name color-black">{{ attachment.fileName }}</a>
      <img src="/static/icons/vendor/proposalBoard/filter-won.svg" class="mr-20 ml-20" />
      <md-button class="md-simple md-black edit-btn" @click="remove"><md-icon>close</md-icon></md-button>
    </div>
    <div v-else class="d-flex">
      <md-progress-spinner
        class="md-accent"
        v-if="isLoading"
        :md-stroke="3"
        :md-diameter="30"
        md-mode="indeterminate"
      ></md-progress-spinner>
      <md-button
        v-else
        class="md-simple edit-btn"
        :class="{ 'md-red': theme === 'red', 'md-vendor': theme === 'purple' }"
        @click="upload"
      >
        <md-icon class="font-size-18 font-bold">north</md-icon>
        Upload
      </md-button>
    </div>
    <input
      type="file"
      class="d-none"
      ref="legalDocument"
      accept="application/text, application/pdf"
      @change="onFilePicked"
    />
  </div>
</template>
<script>
import S3Service from "@/services/s3.service";
export default {
  props: {
    attachment: {
      type: Object,
      default: () => {},
    },
    vendor: {
      type: Object,
      default: () => {},
    },
    theme: {
      type: String,
      default: "red",
    },
  },
  data() {
    return {
      isLoading: false,
    };
  },
  methods: {
    upload() {
      this.$refs.legalDocument.click();
    },
    remove() {
      this.$emit("remove", this.attachment);
    },
    onFilePicked(event) {
      let file = event.target.files || event.dataTransfer.files;
      if (!file.length) {
        return;
      }
      if (file[0].size <= 5000000) {
        this.isLoading = true;
        S3Service.fileUpload(file[0], this.attachment.name, `vendors/attachments/${this.vendor.id}`).then((res) => {
          this.isLoading = false;
          this.$emit("uploaded", {
            ...this.attachment,
            fileName: file[0].name,
            url: `${res}`,
          });
        });
      } else {
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.attachment-item {
  padding: 20px 0;
  .file-name {
    text-decoration: underline;
  }
}
</style>