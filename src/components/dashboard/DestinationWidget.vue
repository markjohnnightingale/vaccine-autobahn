<template>
  <div class="destination-widget box">
    <div class="destination-widget__row">
      <div class="destination-widget__destination">
        {{ $t("destination.population-fully-vaccinated") }}
      </div>
      <div class="destination-widget__distance">
        {{ predictedDatesLinear.full.everyone.fromNow() }} ({{
          predictedDatesLinear.full.everyone.format("MMM YYYY")
        }})
      </div>
    </div>
    <div class="destination-widget__row">
      <div class="destination-widget__destination">
        {{ $t("destination.population-fully-half-vaccinated") }}
      </div>
      <div class="destination-widget__distance">
        {{ predictedDatesLinear.full.half.fromNow() }} ({{
          predictedDatesLinear.full.half.format("MMM YYYY")
        }})
      </div>
    </div>
    <div class="destination-widget__row">
      <div class="destination-widget__destination">
        {{ $t("destination.population-first-fully-vaccinated") }}
      </div>
      <div class="destination-widget__distance">
        {{ predictedDatesLinear.first.everyone.fromNow() }} ({{
          predictedDatesLinear.first.everyone.format("MMM YYYY")
        }})
      </div>
    </div>
    <div class="destination-widget__row">
      <div class="destination-widget__destination">
        {{ $t("destination.population-first-half-vaccinated") }}
      </div>
      <div class="destination-widget__distance">
        {{ predictedDatesLinear.first.half.fromNow() }} ({{
          predictedDatesLinear.first.half.format("MMM YYYY")
        }})
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    predictedDatesLinear: {}
  }
};
</script>

<style lang="scss">
.destination-widget {
  background-color: $autobahn-blue !important;
  border: 8px solid $white;
  border-radius: 9px;
  padding: 1rem;
  margin-bottom: 4rem;
  .destination-widget__row {
    font-weight: 900;
    font-family: $autobahn-font;
    color: $white;
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
