<template>
  <div class="review-cont profile-section" id="Reviews">
    <div class="title font-size-30 font-bold">
      <img class="icon-label" :src="`${$iconURL}Vendor Signup/Asset 560.svg`" /> REVEIWS
    </div>
    <div class="review-list" v-if="reviews.length > 0">
      <div class="review-list-item font-bold">Customers review on this vendor</div>
      <div
        class="review-list-item d-flex justify-content-between align-center"
        v-for="(review, index) in reviews"
        :key="index"
      >
        <div class="mr-30">{{ review.comment }}</div>
        <div class="d-flex font-size-20 align-center">
          <span class="mr-20">{{ review.rank }}</span>
          <star-rating :border-width="0" :star-size="30" :show-rating="false" v-model="review.rank"></star-rating>
        </div>
      </div>
      <div class="text-center mt-50" style="width: 50%; margin: 50px auto">
        <div class="color-gray">You've viewed 3 of 12</div>
        <md-progress-bar class="md-accent" md-mode="determinate" :md-value="20"></md-progress-bar>
        <md-button class="md-black maryoku-btn md-simple md-outlined" style="padding: 10px 30px">Load More</md-button>
      </div>
    </div>
    <div class="font-size-20 font-bold mt-40" v-else>No Reviews For This Vendor</div>
  </div>
</template>
<script>
import StarRating from "vue-star-rating";

export default {
  components: {
    StarRating,
  },
  data() {
    return {
      reviews: [],
      dummyReviews: [
        {
          comment: "Amazing location",
          rank: 4,
        },
        {
          comment: "Great value very clean great communication",
          rank: 4,
        },
        {
          comment:
            "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et",
          rank: 1,
        },
      ],
    };
  },
};
</script>
<style lang="scss" scoped>
.review-cont {
  .title {
    img {
      width: 30px;
      margin-right: 1rem;
    }
  }
  padding: 60px 0 0 0;
  .review-list {
    .review-list-item {
      padding: 30px 0px;
      border-bottom: solid 1px #b7b7b7;
    }
  }
}
</style>