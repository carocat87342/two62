<template>
    <div class="choice"
         :class="{active: checked}"
         data-toggle="wizard-checkbox"
         @click="updateValue">
        <input type="radio"
               :name="name"
               :value="label"
               v-model="radioButtonValue"
        >
        <div class="icon">
            <slot name="icon">
                <i :class="icon"></i>
            </slot>
        </div>
        <slot name="title">
            <h6>{{title}}</h6>
        </slot>
    </div>
</template>
<script>
export default {
  name: 'icon-radio',

  props: {
    checked: {
      type: Boolean,
      default: false
    },
    label: String,
    name: String,
    title: String,
    icon: String,
    disabled: Boolean
  },

  computed: {
    radioButtonValue: {
      get: function () {
        return this.value
      },
      set: function () {
        // Communicate the change to parent component so that selectedValue can be updated
        this.$emit('change', this.label)
      }
    }
  },
  methods: {

    updateValue () {
      this.$emit('input', {checked: true, label: this.label})
    }
  }
}
</script>
<style>
</style>
