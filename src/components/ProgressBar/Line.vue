<template>
  <div class="line-progressbar">
    <div class="progress-bar">
      <div class="line-progress d-flex justify-content-center align-center">
        <div class="line-progress__item header-status red" style="width: 22%; height: 8px">
          <div class="progress"></div>
        </div>
        <div class="line-progress__item header-status gray" style="width: 78%; height: 8px">
          <div class="progress"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {};
</script>
<style lang="scss" scoped>
.line-progressbar {
  .line-progress__item {
    &:first-child {
      z-index: 10;
      .progress {
        border-radius: 100px;
      }
    }
    &:nth-child(2) {
      z-index: 5;
      .progress {
        border-radius: 0 100px 100px 0;
        &::before {
          background-color: inherit;
          content: "";
          width: 50px;
          height: 100%;
          display: block;
          transform: translateX(-30px);
          z-index: 5;
        }
      }
    }
    &:last-child {
      z-index: 1;
      .progress {
        border-radius: 0 100px 100px 0;
        &::before {
          background-color: inherit;
          content: "";
          width: 50px;
          height: 100%;
          display: block;
          transform: translateX(-30px);
        }
      }
    }
    .value {
      font-weight: bold;
      color: #050505;
      font-size: 14px;
    }

    .progress {
      height: 30px;
      margin: 0.6em 0;
    }
    .percentage {
      font-weight: bold;
      font-size: 14px;
    }

    &.green {
      .progress {
        background-color: #2cde6b;
      }
      .percentage {
        color: #2cde6b;
      }
    }
    &.red {
      .progress {
        background-color: #f51355;
      }
      .percentage {
        color: #f51355;
      }
    }
    &.gray {
      .progress {
        background-color: #d5d5d5;
      }
      .percentage {
        color: #d5d5d5;
      }
    }
  }
}
</style>