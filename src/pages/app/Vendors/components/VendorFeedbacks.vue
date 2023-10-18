<template>
  <div class="full-width">
    <div class="feedbacks-wrapper">
      <md-card v-for="(item, index) in feedbacks" :value="item" :key="index">
        <md-card-header>
          <md-avatar>
            <img :src="item.image" />
          </md-avatar>

          <div class="md-title">
            {{ item.username }}
            <label
              class="star-rating__star"
              v-for="(rating, ratingIndex) in ratings"
              :key="ratingIndex"
              :class="{ 'is-selected': true }"
              >★</label
            >
          </div>
          <div class="md-subhead">{{ item.date }}</div>
        </md-card-header>
        <md-card-content>
          <p>
            {{ item.message }}
          </p>
        </md-card-content>
        <md-divider v-if="index != feedbacks.length - 1"></md-divider>
      </md-card>
    </div>
    <a class="more">Show more</a>
  </div>
</template>
<script>
import VueElementLoading from "vue-element-loading";

export default {
  name: "vendor-feedbacks",
  components: {
    VueElementLoading,
  },
  props: {
    feedbacks: Array,
    ratings: Array,
  },
  data: () => ({
    isLoading: true,
  }),
  mounted() {
    this.isLoading = false;
  },
};
</script>
<style lang="scss" scoped>
.full-width {
  width: 100%;
}
.feedbacks-wrapper {
  display: flex;
  flex-direction: column;

  .md-card {
    flex-basis: 100%;
    margin: 0;
    box-shadow: none;

    .md-divider {
      background: #f9f9f9;
      height: 2px;
    }
  }
}
</style>
