<template>
  <div class="attachment-tag-list">
    <div class="attachment-tag" v-for="(attachment, index) in attachments" :key="index" :class="theme">
      <img :src="theme === 'red' ? `${$iconURL}common/pin-red.svg` : `${$iconURL}common/pin-purple.svg`" />
      <a
        :class="{ 'color-red': theme === 'red', 'color-purple': theme === 'purple' }"
        :href="attachment.url"
        target="_blank"
        >{{ attachment.name }}</a
      >
      <md-button class="md-simple md-white edit-btn" @click="remove(attachment, index)">
        <img :src="`${$iconURL}common/trash-dark.svg`" />
      </md-button>
    </div>
    <div class="attachment-tag add" @click="addNew" :class="theme">
      <md-icon :class="{ 'color-red': theme === 'red', 'color-purple': theme === 'purple' }">add</md-icon>
      Add document
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
export default {
  props: {
    defaultValue: {
      type: Array,
      default: () => [],
    },
    theme: {
      type: String,
      default: "red",
    },
  },
  data() {
    return {
      attachments: [],
    };
  },
  created() {
    this.attachments = Object.assign([], this.defaultValue);
  },
  methods: {
    addNew() {
      this.$refs.legalDocument.click();
    },
    onFilePicked(event) {
      let file = event.target.files || event.dataTransfer.files;
      if (!file.length) {
        return;
      }
      this.attachments.push({
        name: file[0].name,
        isLoading: true,
      });
      this.$emit("add", file[0]);
    },
    remove(item, index) {
      this.attachments.splice(index, 1);
      this.$emit("remove");
    },
  },
  watch: {
    defaultValue(newValue, oldValue) {
      this.attachments = Object.assign([], newValue);
    },
  },
};
</script>
<style lang="scss" scoped>
.attachment-tag-list {
  .attachment-tag {
    padding: 17px 27.3px 18px 29px;
    border-radius: 3px;

    background-color: #ffffff;
    margin-right: 40px;
    margin-bottom: 20px;
    display: inline-block;
    &.red {
      border: solid 1px #f51355;
      color: #f51355;
    }
    &.purple {
      border: solid 1px #641856;
      color: #641856;
    }
    button {
      opacity: 0;
      img {
        width: 20px;
        height: 22px;
      }
    }
    &:hover {
      button {
        opacity: 1;
      }
    }
    &.add {
      cursor: pointer;
      &.red {
        border: dashed 1px #f51355;
        color: #f51355;
      }
      &.purple {
        border: dashed 1px #641856;
        color: #641856;
      }
    }
  }
}
</style>
