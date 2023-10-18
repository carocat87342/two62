<template>
  <div>
    <md-datepicker :name="name"  @input="triggerFunc($event,name,count)">
      <label>{{label}}</label>
    </md-datepicker>
  </div>
</template>

<script>
export default {
  name: 'Datepicker',
  model: {
  },
  props: {
    list: Array,
    required: Boolean,
    type: String,
    label: String,
    title: String,
    placeholder: String,
    icon: String,
    disabled: Boolean,
    labelStyle: String,
    for: String,
    name: String,
    onChange: Function,
    valueName: Array,
    isErrors: Boolean,
    count: Boolean
  },
  methods: {
    triggerFunc: function (value, name, count) {
      this.onChange(value, name, count)
    }
  }
}
</script>
