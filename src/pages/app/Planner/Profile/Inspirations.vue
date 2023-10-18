<template>
  <div class="profile-inspirations white-card">
    <div class="profile-inspirations-header d-flex justify-content-between">
      <div class="font-size-30 font-bold">
        <img :src="`${$iconURL}Planner Profile/heart.svg`" class="mr-10" />SAVED INSPIRATIONS
      </div>
      <md-button class="md-simple edit-btn md-red" @click="goToWall"
        >Wall Of Inspiration<md-icon> keyboard_arrow_right</md-icon></md-button
      >
    </div>
    <tabs :tab-name="['My Concepts', 'Saved From Wall']" color-button="info">
      <template slot="tab-pane-1">
        <div>
          <div class="concept-list-wrapper">
            <concept-item v-for="concept in myConcepts" :key="concept.id" :concept="concept"></concept-item>
          </div>
          <div class="white-card compete-box">
            <img :src="`${$iconURL}Planner Profile/group-7399.svg`" style="width: 70px" />
            <div class="text-left flex-1 text-content">
              <div class="font-size-24 font-bold color-red" style="margin-bottom: 10px">Compete With You Event</div>
              <div>You deserve to showcase all your hard work and get a little more recognition for your efforts!</div>
            </div>
            <md-button class="maryoku-btn compete-btn">Compete<md-icon>keyboard_arrow_right</md-icon></md-button>
          </div>
        </div>
      </template>
      <template slot="tab-pane-2">
        <div class="concept-list-wrapper">
          <concept-item></concept-item>
          <concept-item></concept-item>
          <concept-item></concept-item>
          <concept-item></concept-item>
        </div>
      </template>
    </tabs>
  </div>
</template>
<script>
import { LabelEdit, Tabs } from "@/components";
import ConceptItem from "./components/ConceptItem";
export default {
  components: {
    Tabs,
    ConceptItem,
  },
  data() {
    return {
      myConcepts: [],
    };
  },
  created() {
    this.$http.get(`${process.env.SERVER_URL}/1/myConcepts`).then((res) => {
      this.myConcepts = res.data;
    });
  },
  methods: {
    goToWall() {
      window.open("https://www.maryoku.com/wall-of-inspiration", "_blank");
    },
  },
};
</script>
<style lang="scss" scoped>
.profile-inspirations {
  &-header {
    padding: 60px 60px 30px;
  }
  /deep/ .nav-tabs {
    padding: 0 60px;
    .md-list-item-button {
      padding: 20px 0;
    }
  }
  /deep/ .md-card-tabs .tab-content {
    padding: 60px;
  }
  .concept-list-wrapper {
    display: flex;
    flex-flow: wrap;
    justify-content: space-between;
  }
  .compete-box {
    padding: 30px 50px;
    display: flex;
    justify-content: space-between;
    .text-content {
      margin: 0 40px;
    }
    .compete-btn {
      border-radius: 30px;
      background-color: #641956 !important;
    }
  }
}
</style>