<template>
  <div class="d-flex mt-50 feedback-question" :class="{ isHidden: !data.showQuestion }">
    <div class="feedback-message">
      <div class="font-size-20 font-bold mb-20">
        <img v-if="data.icon" :src="`${$iconURL}Budget+Elements/${data.icon}`" />
        {{ data.question }}
      </div>
      <div>
        <maryoku-textarea size="narrow" v-model="data.comment" :disabled="disabled"></maryoku-textarea>
      </div>
    </div>
    <div class="ml-50 mr-50">
      <div class="font-size-14 mb-20 font-bold">Rank Your Total Experience</div>
      <star-rating
        :border-width="0"
        :star-size="30"
        :show-rating="false"
        @rating-selected="setRating"
        v-model="data.rank"
        v-if="!disabled"
      ></star-rating>
      <star-rating :border-width="0" :star-size="30" :show-rating="false" read-only v-else></star-rating>
      <div class="font-size-12 mt-10 text-transform-capitalize">{{ rankLabel }}</div>
    </div>
    <md-switch v-if="showSwitch" class="below-label large-switch md-switch-rose" v-model="data.showQuestion" :value="true">
      <span v-if="data.showQuestion">Hide this question</span>
      <span v-if="!data.showQuestion">Show this question</span>
    </md-switch>
  </div>
</template>
<script>
import MaryokuTextarea from "@/components/Inputs/MaryokuTextarea";
import StarRating from "vue-star-rating";

export default {
  components: {
    MaryokuTextarea,
    StarRating,
  },
  props: {
    icon: {
      type: String,
      default: "",
    },
    feedbackData: {
      type: Object,
      default: {},
    },
    showSwitch: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      data: {},
    };
  },
  methods: {
    setRating(rating) {
      this.rating = rating;
    },
  },
  created() {
    this.data = this.feedbackData;
  },
  computed: {
    rankLabel() {
      if (this.data.rank) {
        switch (this.data.rank) {
          case 1:
            return "poor";
          case 2:
            return "bad";
          case 3:
            return "good";
          case 4:
            return "very good";
          case 5:
            return "amazing!";
        }
      }
      return "";
    },
  },
  watch: {
    data: {
      handler: function (newValue, oldValue) {
        this.$emit("change", newValue);
      },
      deep: true,
    },
  },
};
</script>
<style lang="scss" scoped>
.feedback-question {
  &.isHidden {
    opacity: 0.5;
  }
  .feedback-message {
    width: 40%;
    img {
      width: 30px;
    }
  }
}
</style>
