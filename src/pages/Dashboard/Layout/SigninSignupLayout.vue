<template>
  <div class="register-section">
    <div class="top-header">
      <div class="header-content md-layout">
        <div class="logo md-layout-item md-size-50 md-small-size-100">
          <a href="https://www.maryoku.com">
            <img
              src="https://static-maryoku.s3.amazonaws.com/storage/img/homepage/maryoku-logo-white@2x.png"
              width="118"
            />
          </a>
        </div>
      </div>
    </div>

    <FadeTransition :duration="200" mode="out-in">
      <!-- your content here -->
      <router-view></router-view>
    </FadeTransition>
  </div>
</template>
<script>
import { FadeTransition } from "vue2-transitions";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";

export default {
  data() {
    return {};
  },
  components: {
    FadeTransition,
  },
  created() {},
  methods: {},
  beforeRouteUpdate(to, from, next) {
    next();
  },
};
</script>
<style lang="scss">
$baseColor: #5c2153;

@import url("https://fonts.googleapis.com/css?family=Open+Sans:400,600,700|Rubik:400,500,700&display=swap");

.md-overlay {
  z-index: 99999;
}

.forget-password {
  text-align: center;
  margin: 0.7em auto;
  color: $baseColor !important;
  font-size: 14px;
  font-weight: 500;
  display: block;
}
.register-section {
  .top-header {
    background: #5c2153;
    border-radius: 0 0 50% 50%;
    padding: 0 0 1em;
    height: 100px;
    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      padding-top: 2em;
    }

    .logo {
      color: #fff;
      font-size: 22px;
    }
    .header-actions {
      text-align: right;
      ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;

        li {
          display: inline-block;

          &.user-info span {
            color: #fff;
            display: inline-block;
            padding: 0 1em;
          }
        }

        .md-button {
          border: 1px solid #fff;
          color: #fff;
          background: none !important;
          border-radius: 100px;
        }
      }
    }
  }

  .md-field {
    font-family: "Open Sans", sans-serif;
  }

  .md-field.purple-field {
    border-radius: 10px;
    padding: 0.5em 6px 0.4em;
    border: 1px solid #aaaaaa;
    min-height: 52px;

    label {
      top: 13px;
      color: #606060 !important;
      font-size: 15px;
      left: 43px;
    }

    .md-icon.md-theme-default.md-icon-font {
      color: #606060 !important;
      &:after {
        background: none !important;
      }
    }

    &.md-autocomplete {
      > .md-icon {
        position: absolute;
      }

      .md-menu {
        padding-left: 2.2em;
      }
    }
    .md-error:not(.md-input) {
      right: 13px;
      left: auto;
      top: 19px;
    }

    .md-input-action {
      background: none !important;
      box-shadow: none;
      top: 8px;
    }

    &:hover {
      border-color: $baseColor !important;
      cursor: pointer;

      .md-icon.md-theme-default.md-icon-font,
      label {
        color: $baseColor !important;
      }
    }

    &:not(.md-disabled):after {
      background: none !important;
    }
    &.md-theme-default:before {
      background: none !important;
    }
    .md-input {
      opacity: 0;
    }

    &.md-focused,
    &.md-has-value {
      background: #fff;
      padding: 0.4em 6px 0;
      border: 1px solid $baseColor;

      label {
        color: $baseColor !important;
        top: 13px;
      }
      .md-input {
        opacity: 1;
        padding: 0;
        margin-top: 6px;
        -webkit-text-fill-color: $baseColor !important;
      }
      .md-select-value {
        padding-left: 0.7em;
      }

      .md-icon.md-theme-default.md-icon-font {
        color: $baseColor !important;
      }
    }

    &.with-icon.md-focused label,
    &.with-icon.md-has-value label {
      top: 4px;
      font-size: 12px;
      color: gray !important;
      left: 2.6rem;
    }

    &:not(.with-icon) {
      label {
        left: 2em;
      }
      .md-input {
        padding-left: 1em;
      }

      &.md-focused,
      &.md-has-value {
        label {
          color: #818181 !important;
          top: 5px;
          font-size: 11px;
        }
      }
    }
  }

  .section-header {
    background: #5c2153;
    padding: 0.5em 0 1em;
    border-radius: 0 0 50% 50%;
    text-align: center;
    margin-bottom: 3em;
    font-family: "Rubik", sans-serif;

    .section-title {
      color: #fff;
      font-size: 30px;
      font-family: "Rubik", sans-serif;
      margin-top: 0;
    }
  }

  .steps-wizard-items {
    display: flex;
    flex: 1;
    flex-direction: row;
    background: #903482;
    border-radius: 20px;
    list-style: none;
    width: 200px;
    margin: 0 auto 20px;
    padding: 0;

    li {
      height: 3px;
      background: #fff;
      width: 14.2%;

      &:last-child:not(:first-child) {
        border-radius: 0 20px 20px 0;
      }

      &:first-child {
        border-radius: 20px 0 0 20px;
      }
    }
  }

  .form-section {
    position: relative;
    .form-actions {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      margin: 0 auto;
      text-align: center;
      display: flex;
      flex: 1;
      justify-content: center;
    }
  }

  .md-button.custom-btn {
    width: 256px;
    height: 56px;
    border-radius: 12px;
    min-width: 256px;

    .md-ripple {
      font-size: 15px;
      text-transform: initial;
      font-weight: bold;
    }

    &.md-rose {
      background-color: #ff0066 !important;
      box-shadow: 0px 12px 24px #ff006633;

      &:hover {
        margin-top: 5px;
        background-color: #de0e43 !important;
      }
    }

    &.md-default {
      margin-right: 1em;
    }

    &.disabled,
    &.opacity-btn {
      opacity: 0.3;
    }
  }

  .maryoku-field {
    margin: 0.5em 0 0;
    border: 1px solid #aaa;
    border-radius: 10px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-family: "Open Sans", sans-serif;
    cursor: pointer;
    position: relative;

    .md-error:not(.md-input) {
      position: absolute;
      font-size: 12px;
      right: 33px;
      left: auto;
      top: 18px;
      color: red;
      width: auto;
      display: block;
    }

    .md-icon {
      position: absolute;
      left: 8px;
      z-index: 2;
    }

    > label {
      position: absolute;
      left: 30px;
      margin: 0;
      font-size: 15px;
      pointer-events: none;
      z-index: 2;
    }

    .v-select {
      width: 100%;
    }

    .vs--open + label,
    .has-value + label {
      top: 4px;
      font-size: 12px;
      color: gray !important;
      left: 1.4rem;
    }

    .vs--open {
      .vs__selected {
        color: #efefef;
      }
      .vs__open-indicator {
        display: none;
      }
    }

    .vs__selected {
      position: absolute;
      top: 21px;
      left: 23px;
      z-index: 2;
      color: $baseColor;
    }

    .vs__selected-options {
      position: relative;

      input {
        background: none;
        font-size: 15px;
        padding: 1.5em 6px 0.9em 23px;
        border-radius: 10px;
        width: 100%;
        height: 100%;
        border: none !important;

        &:focus {
          outline: none;
          box-shadow: none;
          background: #fff;
        }
      }
    }

    &.with-icon {
      > label {
        left: 43px;
      }

      .vs--open + label,
      .has-value + label {
        left: 2.6rem;
      }
      .vs__selected-options {
        input {
          padding: 1.5em 6px 0.9em 42px;
        }
      }

      .vs__selected {
        left: 41px;
      }
    }

    .vs__actions {
      position: absolute;
      top: 15px;
      right: 13px;
      z-index: 2;

      .vs__clear {
        background: none !important;
        border: none !important;
        opacity: 0.3;
        margin-right: -9px;
      }
    }

    .vs__dropdown-menu {
      position: absolute;
      background: #fff !important;
      list-style: none;
      padding: 0;
      margin: 0;
      width: 100%;
      z-index: 9999999999999999999999999999 !important;
      border: 1px solid #aaa;
      border-radius: 10px;
      color: #606060;
      font-size: 16px;
      li {
        padding: 0.8em 1em;
        &:not(:last-child) {
          border-bottom: 1px solid #aaa;
        }
      }
    }

    &.has-value {
      background: #fff;
      border-color: $baseColor !important;

      .vs__open-indicator {
        display: none;
      }

      .md-icon {
        color: $baseColor;
      }
    }
    &:hover {
      border-color: $baseColor;
      > label,
      .md-icon {
        color: $baseColor;
      }
    }
  }

  .form-group {
    position: relative;

    .md-checkbox {
      position: absolute;
      left: 104%;
      top: 0;
      width: 200px;
    }
  }

  .divider-or {
    position: relative;
    color: #aaa;
    font-size: 16px;
    font-weight: 500;

    &:before {
      content: " ";
      position: absolute;
      left: 0;
      top: 50%;
      width: 42%;
      height: 1px;
      background: #aaa;
    }
    &:after {
      content: " ";
      position: absolute;
      right: 0;
      top: 50%;
      width: 42%;
      height: 1px;
      background: #aaa;
    }
  }

  .google-singup {
    .md-ripple {
      background: #bababa;
      font-weight: bold;
    }

    .md-button-content {
      width: 100%;
      justify-content: center;
    }

    .md-icon {
      position: absolute;
      left: 0;
      top: 0;

      img {
        width: 44px !important;
        max-width: inherit;
      }
    }
  }
}

@media screen and (max-width: 500px) {
  .register-page {
    .register-form {
      width: 90%;
    }
  }
  .register-section {
    .md-button.custom-btn {
      width: 100%;
    }

    .form-group {
      .md-checkbox {
        position: relative;
        top: auto;
        left: auto;
        width: 100%;
      }
    }

    .section-header {
      border-radius: 0;
      margin-bottom: 1em;

      .section-title {
        font-size: 20px;
        margin-top: 0;
        padding: 0 1em;
      }
    }

    .form-section .form-actions {
      position: fixed;
      flex-direction: column;
      left: 10px;
      right: 10px;
      width: auto;
      z-index: 9999999;
    }

    .back-section {
      margin: 0;
      height: 30px;
      width: 30px;
      left: 1em;
      right: 0;
      border-radius: 50%;
      background-color: #aaaaaa8c;
      top: 40px;

      .md-icon {
        color: #fff;
      }

      &:after {
        display: none;
      }
    }

    .start-working-item .md-checkbox {
      padding: 0 0.5em;
    }

    .form-section {
      width: 100% !important;
      padding: 0 !important;
      padding-bottom: 160px !important;
    }

    .form-actions {
      float: left;
      width: 100%;
      margin-top: 2em !important;

      &.two-btns {
        .md-button.custom-btn {
          min-width: auto;
          width: 100%;
        }
      }
    }
    .start-working-item .md-checkbox label {
      padding-left: 54px !important;
    }
    .vibe-item {
      width: 100% !important;
      margin-right: 0;
      margin-bottom: 0em;

      display: flex !important;
      flex-direction: row;

      .md-radio.with-border {
        width: 74% !important;
        margin-bottom: 0;
      }
      > span {
        display: block;
        text-align: center;
        .md-icon {
          float: none;
          margin: 0;
        }
      }
      .md-radio.with-border label {
        font-size: 14px !important;
        width: 80% !important;
      }
    }

    .movie-item {
      width: 48% !important;
    }

    .section-header {
      margin-top: -1px;
    }

    .range-item .option {
      font-size: 12px !important;
    }

    .start-working-item {
      width: 100% !important;

      .md-checkbox {
        margin-right: 0;
      }
    }

    .event-created {
      .page-banner {
        h3 {
          font-size: 26px !important;
        }
      }
      .page-content {
        font-size: 16px !important;
        padding: 0 2em;
      }
    }
    .md-dialog.singin-form {
      bottom: auto;
      top: 10%;
      width: 90%;
    }

    .no-padding-mobile {
      padding: 0px;
    }

    .top-header {
      .logo {
        img {
          width: 80px;
        }
      }
      .header-actions {
        padding: 0;

        ul {
          .md-button {
            border: none;
            box-shadow: none;

            .md-ripple {
              padding: 6px 0 !important;
            }
          }
          li.user-info {
            span {
              font-size: 12px;
              padding: 0;
            }
          }
        }
      }

      .header-content {
        padding-top: 0.5em;
      }
    }

    .container {
      padding: 0 8px;
    }
  }
}
</style>
