<template>
  <collapse-panel class="white-card" :defaultStatus="false">
    <template slot="header">
      <div class="d-flex align-center p-50 font-size-30 font-bold">
        <template v-if="data">
          <div>
            <div class="mb-10">
              <img v-if="data.icon" class="page-icon mr-10" :src="`${$iconURL}Budget+Elements/${data.icon}`" />{{
                data._id
              }}
            </div>
            <div class="font-size-16 font-regular">(“How was the {{ data._id }}?”)</div>
          </div>
          <div class="ml-40">
            <div class="mb-10"><md-icon style="color: #ffc001">star</md-icon>{{ data.averageRate }}</div>
            <div class="font-size-16 font-regular color-gray">{{ data.feedback.length }}(reviews)</div>
          </div>
        </template>
      </div>
    </template>
    <template slot="content">
      <div class="feedback-result-content">
        <div class="md-layout feedback-list-wrapper" v-if="data">
          <div
            v-for="(feedback, index) in data.feedback"
            :key="index"
            class="feedback-item md-layout-item md-size-80 d-flex"
          >
            <div class="name md-layout-item md-size-20">{{ feedback.name }}</div>
            <div class="comment md-layout-item md-size-80">{{ feedback.comment }}</div>
          </div>
        </div>
        <div class="mt-30">
          <md-button class="md-simple md-red edit-btn mt-30">
            <md-icon>keyboard_arrow_down</md-icon>
            show more
          </md-button>
        </div>
      </div>
    </template>
  </collapse-panel>
</template>
<script>
import CollapsePanel from "../CollapsePanel";
export default {
  components: {
    CollapsePanel,
  },
  props: {
    data: {
      type: Object,
      default: () => {},
    },
  },
  created() {},
  data() {
    return {
      feedbacks: [
        {
          name: "xxx",
          comment: "asdfasdfasdf",
        },
        {
          name: "xxx",
          comment: "asdfasdfasdf",
        },
        {
          name: "xxx",
          comment: "asdfasdfasdf",
        },
      ],
    };
  },
  computed: {
    event() {
      return this.$store.state.event.eventData;
    },
  },
};
</script>
<style lang="scss" scoped>
.feedback-result-content {
  padding: 0 50px 50px;
  .feedback-list-wrapper {
    .feedback-item {
      padding: 20px 0;
      border-bottom: solid 1px #ebebeb;
      &:first-child {
        border-top: solid 1px #ebebeb;
      }
      .name {
        padding-left: 0;
      }
    }
  }
}
</style>