<template>
  <div class="vlabeledit">
    <div
      tabindex="1"
      class="vlabeledit-label"
      :class="{'vlabeledit-empty' : this.vlabel === empty}"
      @click="onLabelClick"
      v-if="!edit"
    >
      <span>{{showCurrency}}</span>
      <span v-if="numeric">{{vlabel | numeral('0,0')}}</span>
      <span v-else>{{vlabel}}</span>
      <md-icon v-if="icon" class="pull-right text-gray small md-sm vlabeledit-label-icon">edit</md-icon>
    </div>
    <input
      type="text"
      v-if="edit && !mask"
      v-model="label"
      v-on:blur="updateTextBlur"
      ref="labeledit"
      :placeholder="vplaceholder"
      class="vlabeledit-input"
      @keyup.enter="updateTextEnter"
    />
    <input-mask
      type="text"
      v-if="edit && mask"
      :mask="mask"
      maskChar="_"
      v-model="label"
      v-on:blur="updateTextBlur"
      ref="labeledit"
      :placeholder="vplaceholder"
      class="vlabeledit-input"
      @keyup.enter="updateTextEnter"
    />
    <br v-if="edit && !mask" />
    <span v-if="edit && !mask" class="span-per-guest">{{showSubDescription}}</span>
  </div>
</template>
<script>
import InputMask from 'vue-input-mask'
export default {
  name: 'LabelEdit',
  components: {
    InputMask
  },
  data: function () {
    return {
      edit: false, // define whether it is in edit mode or not
      label: '' // v-bind data model for input text
    }
  },
  props: {
    text: [String, Number],
    placeholder: String,
    required: Boolean,
    fieldName: [String, Object],
    mask: String,
    scope: [String, Object],
    empty: { type: String, default: 'Click to set' },
    numeric: Boolean,
    subDescription: String,
    currency: String,
    icon: {
      type: Boolean,
      default: true
    }
  }, // parent should provide :text or :placeholder
  methods: {
    initText: function () {
      if (this.text === '' || this.text === undefined) {
        this.label = this.vlabel
      } else {
        this.label = this.text
      }
    },
    // when the div label got clicked and trigger the text box
    onLabelClick: function () {
      this.edit = true
      this.label = this.text
      setTimeout(() => {
        this.$refs.labeledit.select()
      }, 100)
    },
    // trigger when textbox got lost focus
    updateTextBlur: function () {
      // update the edit mode to false .. display div label text
      if (!this.edit) return

      this.edit = false
      if (this.label === this.text) {
        this.$emit('no-change', this.text, this.fieldName, this.scope)
        return
      }
      // emit text updated callback
      if (this.required && this.label === '') {
        this.label = this.text
        this.$emit('no-change', this.text, this.fieldName, this.scope)
      } else {
        this.$emit('text-updated-blur', this.label, this.fieldName, this.scope)
      }
    },
    updateTextEnter: function () {
      if (!this.edit) return

      this.edit = false
      if (this.label === this.text) {
        this.$emit('no-change', this.text, this.fieldName, this.scope)
        return
      }
      if (this.required && this.label === '') {
        this.label = this.text
        this.$emit('no-change', this.text, this.fieldName, this.scope)
      } else {
        this.$emit(
          'text-updated-enter',
          this.label,
          this.fieldName,
          this.scope
        )
      }
    }
  },
  computed: {
    vplaceholder: function () {
      // check if the placeholder is undefined or empty
      if (this.placeholder === undefined || this.placeholder === '') {
        // if it is empty or undefined, pre-populate with built-in place holder text
        return this.empty
      } else {
        return this.placeholder
      }
    },
    vlabel: function () {
      // after text has been updated
      // return text value or place holder value depends on value of the text
      if (this.text === undefined || this.text === '') {
        return this.vplaceholder
      } else {
        return this.label
      }
    },
    showCurrency: function () {
      if (this.currency !== undefined && this.currency != '') {
        return this.currency
      }
    },
    showSubDescription: function () {
      if (this.subDescription !== undefined && this.subDescription != '') {
        return 'Per ' + this.subDescription
      }
    }
  },
  mounted: function () {
    // initiate the label view
    this.initText()
  },
  updated: function () {
    var ed = this.$refs.labeledit
    if (ed != null) {
      ed.focus()
    }
  },
  watch: {
    text: function (newVal, oldValue) {
      console.log(`'text' changed from ${oldValue} to ${newVal}`)
      if (newVal === '' || newVal === undefined) {
        this.label = this.vplaceholder
      }
      this.initText()
    }
  }
}
</script>
<style lang="scss" scoped>
.vlabeledit-empty {
  color: #ccc !important;
}

.vlabeledit {
  width: 100%;
  .vlabeledit-input {
    border: 1px solid lightgray;
    border-radius: 5px;
    padding: 6px;
    width: 100%;
    height: 100%;
    font-size: 16px;
    line-height: 24px;
    display: inline-block;
  }

  .span-per-guest {
    font-size: 12px;
    color: #999999;
  }

  .vlabeledit-label {
    cursor: pointer;
    padding: 6px;
    border: 1px solid transparent;
    border-radius: 5px;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    font-size: 16px;
    line-height: 24px;
    display: inline-block;
    width: 100%;
    height: 100%;

    &:hover {
      border: 1px solid lightgray;
      border-radius: 5px;

      .vlabeledit-label-icon {
        visibility: visible;
      }
    }

    .vlabeledit-label-icon {
      font-size: 16px !important;
      visibility: hidden;
    }
  }
}
</style>
