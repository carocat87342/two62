<template>
  <div class="concept-detail white-card">
    <concept-box :concept="conceptData"></concept-box>
  </div>
</template>
<script>
import EventConcept from "@/models/EventConcept";
import ConceptBox from "../../../components/ConceptBox.vue";
export default {
  components: { ConceptBox },
  data() {
    return {
      conceptData: {},
    };
  },
  created() {
    const conceptId = this.$route.params.conceptId;
    EventConcept.find(conceptId).then((res) => {
      this.conceptData = res;
    });
  },
};
</script>
<style lang="scss" scoped>
.concept-detail {
  margin: 50px;
  color: #050505;
  border-radius: 20px;
  padding: 60px;
}
</style>