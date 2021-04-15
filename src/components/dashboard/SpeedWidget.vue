<template>
  <div class="speed-widget box" :class="{ 'is-primary': highlight }">
    <p class="speed-widget__title title">{{ title }}</p>
    <div class="speed-widget__panel">
      <span class="speed-widget__number">{{ speed }}</span
      ><br />
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
    highlight: {}
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
}
</style>
