<template>
  <div class="last-updated">
    <span class="last-updated__label">
      {{ $t("last-updated.latest-data-from") }}
    </span>
    <span class="last-updated__text">
      {{ lastUpdated.format("dddd, Do MMMM YYYY") }}
    </span>
  </div>
</template>

<script>
export default {
  props: {
    lastUpdated: {}
  }
};
</script>

<style lang="scss">
.last-updated {
  margin-top: 20px;
  font-size: 0.9rem;
  .last-updated__label {
  }
  .last-updated__text {
    font-weight: bold;
  }
}
</style>
