<template>
  <div
    class="speed-widget box tile is-child"
    :class="{ 'is-primary': highlight }"
  >
    <p class="speed-widget__title title">{{ title }}</p>
    <div class="speed-widget__panel">
      <div class="speed-widget__row">
        <span class="speed-widget__number">{{ speed }}</span
        ><span
          class="speed-widget__trend"
          v-if="trend"
          :class="{ 'is-positive': positive }"
        >
          <span class="speed-widget__trend-number">{{ trend }}</span> <br />
          <span class="speed-widget__trend-label">{{
            $t("speed-widget.on-last-week")
          }}</span></span
        >
      </div>
      <span class="speed-widget__per">{{ unit }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    speed: {},
    unit: {},
    title: {},
    highlight: {},
    trend: {}
  },
  computed: {
    positive() {
      if (this.trend.indexOf("+") === 0) {
        return true;
      } else {
        return false;
      }
    }
  }
};
</script>

<style lang="scss">
.speed-widget {
  .speed-widget__title {
    font-size: 1.3rem;
  }
  .speed-widget__number {
    font-weight: bold;
    font-size: 2rem;
    &::before {
      content: "+";
      margin-right: 5px;
    }
  }
  .speed-widget__trend {
    color: $text-red;
    font-size: 0.8rem;
    line-height: 1;
    margin-left: 0.5rem;
    &.is-positive {
      color: $text-green;
    }
  }
  .speed-widget__trend-number {
    font-weight: bold;
  }
  .speed-widget__row {
    display: flex;
    align-items: center;
  }
}
</style>
