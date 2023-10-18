<template>
      <div class="popover-wrapper">
        <div :class="containerClass" v-click-outside="closeModal">

          <div class="modal-header">
            <slot name="header"></slot>
          </div>

          <div class="modal-body text-center">
            <slot name="body"></slot>
          </div>

          <div class="modal-footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>

</template>

<script>
export default {
  props: {
    containerClass: {
      type: String,
      default: 'modal-container'
    }
  },
  methods: {
    closeModal: function () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container-wizard,
.modal-leave-active .modal-container-wizard
.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
 .popover-wrapper{
   width: 620px;
   height: auto;
   position: absolute;
   right: 0px;
   top: 0px;
 }
</style>
