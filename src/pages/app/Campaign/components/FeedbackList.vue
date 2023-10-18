<template>
  <div class="feedback-list">
    <feedback-answer
      v-for="(question, index) in feedbackQuestions"
      :key="index"
      :data="feedbackAnswers[question.label]"
      class="mb-20"
    ></feedback-answer>
  </div>
</template>
<script>
import FeedbackAnswer from "./FeedbackAnswer";
export default {
  data() {
    return {
      feedbackQuestions: [],
      feedbackAnswers: {},
    };
  },
  components: {
    FeedbackAnswer,
  },
  created() {
    this.feedbackQuestions = [
      {
        question: "What did you like or dislike about this event?",
        label: "General",
        showQuestion: true,
        rank: 0,
        icon: "",
      },
    ];
    this.feedbackAnswers["General"] = {
      feedback: [],
      averageRate: 0,
      _id: "General",
    };
    this.event.components
      .sort((a, b) => {
        return a.order - b.order;
      })
      .forEach((service) => {
        if (service.eventCategory.type == "service") {
          this.feedbackQuestions.push({
            question: `How Was The ${service.eventCategory.fullTitle}?`,
            showQuestion: true,
            label: service.eventCategory.fullTitle,
            rank: 0,
            icon: service.eventCategory.icon,
          });
          this.feedbackAnswers[service.eventCategory.fullTitle] = {
            feedback: [],
            averageRate: 0,
            _id: service.eventCategory.fullTitle,
          };
        }
      });

    this.$http.get(`${process.env.SERVER_URL}/1/feedback/answers/${this.event.id}`).then((res) => {
      const answers = res.data;
      answers.forEach((item) => {
        // this.feedbackAnswers[item.label] = { ...item, icon: item.icon };
        const icon = this.feedbackQuestions.find((q) => q.label === item._id).icon;
        this.$set(this.feedbackAnswers, item._id, { ...item, icon: icon });
      });
    });
  },
  computed: {
    event() {
      return this.$store.state.event.eventData;
    },
    campaignData() {
      return this.$store.state.campaign.FEEDBACK;
    },
    campaignTitle() {
      return this.$store.state.campaign.FEEDBACK ? this.$store.state.campaign.FEEDBACK.title : "Event Name";
    },
  },
};
</script>
<style lang="scss" scoped>
</style>