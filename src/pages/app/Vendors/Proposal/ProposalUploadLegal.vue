<template>
  <div class="upload-files-wrapper">
    <div class="title-cont">
      <h3>
        <!-- <img :src="`${$iconURL}NewSubmitPorposal/Asset 608.svg`" /> -->
        <md-icon class="color-black" style="font-size: 30px !important; font-weight: normal; margin-right: 10px">
          arrow_circle_up
        </md-icon>
        Upload These Files:
      </h3>
      <h5>And add additional if you want</h5>
    </div>
    <div class="files-cont">
      <div class="item" v-for="legalDoc in vendor.eventCategory.legalDocuments" :key="legalDoc">
        <div class="left">
          <span class="filename">{{ legalDoc }}</span>
          <span
            class="req"
            v-if="
              vendor.eventCategory.mandatoryLegalDocs &&
              vendor.eventCategory.mandatoryLegalDocs.findIndex((item) => item === legalDoc) >= 0
            "
            >*Required</span
          >
          <span class="req" v-else>Optional</span>
        </div>
        <div class="right" @click="uploadDocument(legalDoc)" v-if="!legalDocs[legalDoc]">
          <img :src="`${$iconURL}NewSubmitPorposal/Asset 609.svg`" />Upload
        </div>
        <div class="right" v-else>
          <span class="filename">{{ legalDocs[legalDoc].filename }}</span>
          <img class="check" :src="`${$iconURL}NewSubmitPorposal/Group 3599 (2).svg`" />
          <img
            class="remove"
            :src="`${$iconURL}NewSubmitPorposal/Group 3671 (2).svg`"
            @click="removeFileByTag(legalDoc)"
          />
        </div>
      </div>
      <input
        type="file"
        class="d-none"
        ref="legalDocument"
        accept="application/text, application/pdf"
        @change="onFilePicked"
      />
      <div class="option">
        <div class="left">
          <span class="filename">Other</span>
          <span class="req">*Optional</span>
        </div>
        <div class="right" @click="uploadDocument('other')" v-if="!legalDocs['other']">
          <img :src="`${$iconURL}NewSubmitPorposal/Asset 609.svg`" />Upload
          <input
            type="file"
            class="d-none"
            ref="optionDocument"
            accept="application/text, application/pdf"
            @change="onFilePicked"
          />
        </div>
        <div class="right" v-else>
          <span class="filename">{{ legalDocs["other"].filename }}</span>
          <img class="check" :src="`${$iconURL}NewSubmitPorposal/Group 3599 (2).svg`" />
          <img
            class="remove"
            :src="`${$iconURL}NewSubmitPorposal/Group 3671 (2).svg`"
            @click="removeFileByTag('other')"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      uploadedLegalDocs: {},
    };
  },
  created() {
    if (Object.keys(this.legalDocs).length == 0) this.legalDocs = {};
  },
  methods: {
    uploadDocument(fileId = null) {
      this.docTag = fileId;
      this.selectedImage = typeof fileId !== "object" ? fileId : null;
      if (this.docTag == "option") {
        this.$refs.optionDocument.click();
      } else if (this.docTag == "image") {
        this.$refs.imageFile.click();
      } else {
        this.$refs.legalDocument.click();
      }
    },

    addLegalDocs(fileObject) {
      this.$store.commit("vendorProposal/addLegalDoc", {
        category: this.category,
        docTag: this.docTag,
        obj: fileObject,
      });
    },
    onFilePicked(event) {
      let file = event.target.files || event.dataTransfer.files;

      if (!file.length) {
        return;
      }
      if (file[0].size <= 5000000) {
        this.addLegalDocs({
          tag: this.docTag,
          filename: file[0].name,
        });

        S3Service.fileUpload(file[0], this.docTag, `proposals/legal-documents/${this.proposalRequest.id}`).then(
          (res) => {
            this.addLegalDocs({
              tag: this.docTag,
              filename: file[0].name,
              url: `${res}`,
            });
          },
        );
      } else {
        this.alretExceedPictureSize = true;
        this.$notify({
          message: "You've Uploaded an Image that Exceed the allowed size, try small one!",
          horizontalAlign: "center",
          verticalAlign: "top",
          icon: "warning",
        });
      }
    },
    getFileByTag(tag) {
      const file = this.files.filter((f) => f.tag == tag);
      if (file.length > 0) {
        return file[0].filename;
      } else {
        return null;
      }
    },
    removeFileByTag(tag) {
      this.files = this.files.filter((f) => f.tag != tag);
      this.$store.commit("vendorProposal/addLegalDoc", { category: this.category, docTag: tag, obj: null });
    },
  },
  computed: {
    vendor() {
      return this.$store.state.vendorProposal.vendor;
    },
    legalDocs: {
      get: function () {
        if (this.$store.state.vendorProposal.legalDocs[this.category])
          return this.$store.state.vendorProposal.legalDocs[this.category];
        return {};
      },
      set: function (files) {
        this.$store.commit("vendorProposal/setLegalDocs", { category: this.category, files });
      },
    },
  },
};
</script>
<style lang="scss" scoped>
.upload-files-wrapper {
  padding: 60px 0 10px 0;
  // border-top: 1px solid #707070;

  .title-cont {
    display: flex;
    align-items: flex-end;
    margin-bottom: 25px;
    padding: 0 40px;

    h3 {
      font-size: 30px;
      font-weight: 800;
      margin: 0;
      margin-right: 10px;
      img {
        width: 24px;
        margin-right: 10px;
      }
      margin-right: 10px;
    }
    h5 {
      margin: 0;
      font-size: 14px;
      position: relative;
      top: -6px;
    }
  }
  .files-cont {
    .item,
    .option {
      display: flex;
      justify-content: space-between;
      // padding: 30px 34px;
      border-bottom: 1px solid #e0e0e0;
      padding: 30px 0px;
      margin: 0px 40px;
      .left {
        span {
          font-weight: 800;
          &.filename {
            font-size: 20px;
            margin-right: 23px;
          }
          &.req {
            color: #818080;
            font-size: 14px;
          }
        }
      }
      .right {
        cursor: pointer;
        color: #f51355;
        font-size: 16px;
        font-weight: 800;
        img {
          width: 13px;
          margin-right: 9px;

          &.check {
            width: 32px;
            margin-right: 0;
            margin-left: 2rem;
          }
          &.remove {
            margin-right: 0;
            margin-left: 1rem;
          }
        }
        span {
          &.filename {
            color: #050505;
            text-decoration: underline;
            font: 800 16px "Manrope-Regular", sans-serif;
          }
        }
      }
    }
    .option {
      margin-bottom: 10px;
      border: none;
      .left {
        span {
          &.filename {
            font-size: 20px;
            font-weight: normal;
          }
        }
      }
    }
  }
}
</style>
