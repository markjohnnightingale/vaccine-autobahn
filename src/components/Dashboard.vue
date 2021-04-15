<template>
  <div class="dashboard">
    <div class="columns">
      <div class="column is-4">
        <speed-widget
          :title="$t('dashboard.current-speed')"
          :speed="currentSpeedsFormatted.doses"
          :unit="$t('dashboard.doses-per-week')"
          :highlight="true"
        ></speed-widget>
      </div>
      <div class="column is-4">
        <speed-widget
          :title="$t('dashboard.current-speed-first')"
          :speed="currentSpeedsFormatted.first"
          :unit="$t('dashboard.people-per-week')"
        ></speed-widget>
      </div>
      <div class="column is-4">
        <speed-widget
          :title="$t('dashboard.current-speed-full')"
          :speed="currentSpeedsFormatted.full"
          :unit="$t('dashboard.people-per-week')"
        ></speed-widget>
      </div>
    </div>
    <div class="columns">
      <div class="column is-4"></div>
      <div class="column is-4">
        <percentage-widget
          :title="$t('dashboard.had-first-dose')"
          :percentage="currentQuotasFormatted.first"
          :increase="currentQuotaSpeedsFormatted.first"
          :text="$t('dashboard.in-the-last-7-days')"
        ></percentage-widget>
      </div>
      <div class="column is-4">
        <percentage-widget
          :title="$t('dashboard.had-second-dose')"
          :percentage="currentQuotasFormatted.full"
          :increase="currentQuotaSpeedsFormatted.full"
          :text="$t('dashboard.in-the-last-7-days')"
        ></percentage-widget>
      </div>
    </div>
    <div class="columns is-centered">
      <div class="column is-7">
        <destination-widget
          :predicted-dates-linear="predictedDatesLinear"
        ></destination-widget>
      </div>
    </div>
  </div>
</template>

<script>
import SpeedWidget from "./dashboard/SpeedWidget";
import PercentageWidget from "./dashboard/PercentageWidget";
import DestinationWidget from "./dashboard/DestinationWidget";
export default {
  components: {
    SpeedWidget,
    PercentageWidget,
    DestinationWidget
  },
  props: {
    currentSpeeds: {},
    currentQuotas: {},
    currentQuotaSpeeds: {},
    predictedDatesLinear: {}
  },
  computed: {
    currentSpeedsFormatted() {
      if (!this.currentSpeeds) {
        return {};
      }
      let formatter = new Intl.NumberFormat(this.$config.locale);
      return {
        first: formatter.format(this.currentSpeeds.first),
        full: formatter.format(this.currentSpeeds.full),
        doses: formatter.format(this.currentSpeeds.doses)
      };
    },
    currentQuotasFormatted() {
      if (!this.currentQuotas) {
        return {};
      }
      let formatter = new Intl.NumberFormat(this.$config.locale, {
        maximumSignificantDigits: 2
      });
      return {
        first: this.$t("dashboard.percentage", {
          number: formatter.format(this.currentQuotas.first * 100)
        }),
        full: this.$t("dashboard.percentage", {
          number: formatter.format(this.currentQuotas.full * 100)
        })
      };
    },
    currentQuotaSpeedsFormatted() {
      if (!this.currentQuotaSpeeds) {
        return {};
      }
      let formatter = new Intl.NumberFormat(this.$config.locale, {
        maximumSignificantDigits: 2
      });
      return {
        first: this.$t("dashboard.percentage", {
          number: formatter.format(this.currentQuotaSpeeds.first * 100)
        }),
        full: this.$t("dashboard.percentage", {
          number: formatter.format(this.currentQuotaSpeeds.full * 100)
        })
      };
    }
  }
};
</script>

<style lang="scss">
@import "~bulma/bulma.sass";

.main-chart {
  @extend %block;
  text-align: center;
}
</style>
