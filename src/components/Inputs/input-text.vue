<template>
    <div class="choice"
         :class="">
        <input type="text"
               :name="name"
               class="input-default"
               :disabled="disabled"
               :placeholder="placeholder" >
        <slot name="title">
            <h6>{{title}}</h6>
        </slot>
    </div>
</template>
<script>
export default {
  name: 'input-text',
  model: {
  },
  props: {
    name: String,
    title: String,
    placeholder: String,
    icon: String,
    disabled: Boolean
  },
  methods: {

  }
}
</script>
<style>
    .input-default{
       border: 1px solid $light-gray-1;
        padding: 15px;
        width: 100%;
    }
</style>
