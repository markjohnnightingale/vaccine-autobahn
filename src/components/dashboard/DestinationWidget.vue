<template>
  <div class="tile is-parent is-4">
    <div
      class="tile is-child box destination-widget"
      :class="{ 'is-primary': isPrimary }"
    >
      <div class="content">
        <p class="destination-widget__title">{{ title }}</p>
        <p class="destination-widget__content">{{ content }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {},
    content: {},
    isPrimary: {
      default: false
    }
  }
};
</script>

<style lang="scss">
.destination-widget {
  p,
  div,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  li {
    color: $white;
  }
  text-align: center;
  background-color: $autobahn-blue !important;
  color: $white;
  margin-bottom: 2rem;
  border-radius: 9px;
  padding: 2rem !important;
  margin-bottom: 4rem;
  font-size: 1.2rem;
  .destination-widget__content {
    font-weight: 900;
    font-size: 1.7rem;
    font-family: $autobahn-font;
  }
  .destination-widget__title {
    font-size: 1rem;
    font-weight: bold;
  }
  &.is-primary {
    background-color: $color-primary-1 !important;
  }
}
</style>
