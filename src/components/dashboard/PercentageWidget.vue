<template>
  <div
    class="percentage-widget box tile is-child"
    :class="{ 'is-primary': highlight }"
  >
    <p class="percentage-widget__title title">{{ title }}</p>
    <div class="percentage-widget__panel">
      <span class="percentage-widget__number">{{ percentage }}</span
      ><br />
      <span class="percentage-widget__increase">{{ increase }}</span>
      <span class="percentage-widget__increase-text">{{ text }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    percentage: {},
    increase: {},
    text: {},
    title: {},
    highlight: {}
  }
};
</script>

<style lang="scss">
.percentage-widget {
  .percentage-widget__title {
    font-size: 1.3rem;
  }
  .percentage-widget__number {
    font-weight: bold;
    font-size: 2rem;
  }
  .percentage-widget__increase {
    font-weight: bold;
    font-size: 1.1rem;
    &::before {
      content: "+";
    }
  }
  .percentage-widget__increase-text {
    font-size: 0.8rem;
    font-weight: bold;
    margin-left: 5px;
  }
}
</style>
