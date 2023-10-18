<template>
  <div>
    <multiselect
            v-model="holiday"
            :options="options"
            :close-on-select="true"
            :clear-on-select="true"
            group-values="holidays"
            group-label="name"
            placeholder="Please select holiday"
            class="multiple-selection small-selector mt-20"
            @select="change($event)"
    ></multiselect>
  </div>
</template>
<script>

export default {
  name: "holiday-input",
  model: {},
  props: {
    value: String,
    options: {
      type: Array,
      default: this.religions,
    },
  },
  data() {
    return {
      religions: [
        {
          name: "Chrisitanity",
          options: ["Good Friday", "Easter", "Christmas", "Thanksgiving"],
        },
        {
          name: "Hindu",
          options: ["Ganesh Chaturthi", "Pitru Paksha", "Mysore Dasara", "Navratri", "Vijayadashami", "Durga Puja"],
        },
        {
          name: "Islamic",
          options: [
            "All Islamic holiday",
            "Eid AI-Acha",
            "Eid AI-Fitr",
            "Lailat al Miraj",
            "Milad un Nabi(Shia)",
            "Ramadan(start)",
            "Laylat at Qadr",
            "Eid-ai-Fitr(End of Ramadan)",
            "Waqf ai Arafa - Hajj",
            "Hijra - Islamic New Year",
            "Day of Ashura / Muharram",
            "Milad un Nabi",
            "All Islamic holidays (Shia)",
          ],
        },
        {
          name: "Judaism",
          options: [
            "Rosh Hashana",
            "Yom Kipur",
            "Sukkot",
            "Shmini Atzeret",
            "Simchat Torah",
            "Chanukah",
            "Purim",
            "Pesach",
            "Shavout",
            `Tish'a B'Av`,
          ],
        },
      ],
      holiday: this.value
    };
  },
  methods: {
    change(e) {
      console.log("holiday.change", e)
      this.$emit("change", e);
    },
  },
  mounted() {
  }
};
</script>
<style lang="scss">

</style>
