<template>
  <div class="dashboard">
    <div class="tile is-ancestor">
      <div class="tile is-parent is-4">
        <speed-widget
          :title="$t('dashboard.current-speed')"
          :speed="currentSpeedsFormatted.doses"
          :unit="$t('dashboard.doses-per-week')"
          :trend="currentTrendsFormatted.doses"
          :highlight="true"
        ></speed-widget>
      </div>
      <div class="tile is-8 is-vertical">
        <div class="tile">
          <div class="tile is-6 is-parent">
            <speed-widget
              :title="$t('dashboard.current-speed-first')"
              :speed="currentSpeedsFormatted.first"
              :trend="currentTrendsFormatted.first"
              :unit="$t('dashboard.people-per-week')"
            ></speed-widget>
          </div>
          <div class="tile is-6 is-parent">
            <speed-widget
              :title="$t('dashboard.current-speed-full')"
              :speed="currentSpeedsFormatted.full"
              :trend="currentTrendsFormatted.full"
              :unit="$t('dashboard.people-per-week')"
            ></speed-widget>
          </div>
        </div>
        <div class="tile">
          <div class="tile is-6 is-parent">
            <percentage-widget
              :title="$t('dashboard.had-first-dose')"
              :percentage="currentQuotasFormatted.first"
              :increase="currentQuotaSpeedsFormatted.first"
              :text="$t('dashboard.in-the-last-7-days')"
            ></percentage-widget>
          </div>
          <div class="tile is-6 is-parent">
            <percentage-widget
              :title="$t('dashboard.had-second-dose')"
              :percentage="currentQuotasFormatted.full"
              :increase="currentQuotaSpeedsFormatted.full"
              :text="$t('dashboard.in-the-last-7-days')"
            ></percentage-widget>
          </div>
        </div>
      </div>
    </div>

    <div class="columns is-centered">
      <div class="column is-7">
        <destination-widget
          class="block"
          :predicted-dates-linear="predictedDatesLinear"
        ></destination-widget>
        <div class="data-used content is-small block">
          <p class="title is-size-6">
            {{ $t("dashboard.assumptions-title") }}
          </p>
          <p class="data-used__data">
            {{ $t("dashboard.assumptions-population") }}
            {{ numeral($config.vaccinatablePopulation).format("0a") }}
          </p>
          <p class="data-used__data">
            {{ $t("dashboard.assumptions-vaccine-readiness") }}
            {{ numeral($config.vaccineReadiness).format("0 %") }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SpeedWidget from "./dashboard/SpeedWidget";
import PercentageWidget from "./dashboard/PercentageWidget";
import DestinationWidget from "./dashboard/DestinationWidget";
import numeral from "numeral";
export default {
  components: {
    SpeedWidget,
    PercentageWidget,
    DestinationWidget
  },
  props: {
    currentSpeeds: {},
    currentTrends: {},
    currentQuotas: {},
    currentQuotaSpeeds: {},
    predictedDatesLinear: {}
  },
  methods: {
    numeral(data) {
      return numeral(data);
    }
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
    currentTrendsFormatted() {
      if (!this.currentTrends) {
        return {};
      }
      return {
        first: numeral(this.currentTrends.first).format("+ 0.0 %"),
        full: numeral(this.currentTrends.full).format("+ 0.0 %"),
        doses: numeral(this.currentTrends.doses).format("+ 0.0 %")
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
