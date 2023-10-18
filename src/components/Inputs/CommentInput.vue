<template>
  <div id="editable" contenteditable="true">
    text <br> text <div class="address">@Yuki</div>
  </div>
</template>
<script>
export default {
  name: 'comment-input',
  props: {
    value: {
      type: String,
      default: ''
    },
  },
  mounted() {
      let el = document.getElementById("editable")
      let range = document.createRange()
      let sel = window.getSelection()

      range.setStart(el.childNodes[2], 5)
      range.collapse(true)

      sel.removeAllRanges()
      sel.addRange(range)
  },
  methods: {
    updateValue () {
    }
  }
}
</script>
<style type="SCSS" scoped>
.address{
    margin: 0 5px;
    background-color: yellow;
}
</style>
