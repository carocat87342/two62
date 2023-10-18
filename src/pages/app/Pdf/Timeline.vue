<template>
  <timeline-edit-panel :isEditMode="false" :editingMode="editingMode"></timeline-edit-panel>
</template>
<script>
import TimelineTemplateItem from "@/pages/app/Events/components/TimelineEditPanel";
export default {
  created() {
    const eventId = this.$route.params.eventId;
    this.$store.dispatch("event/getTimelineDates", this.event.id);
  },
};
</script>