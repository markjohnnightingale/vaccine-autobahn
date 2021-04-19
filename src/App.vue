<template>
  <div id="app">
    <section class="hero is-small is-primary">
      <div class="hero-body">
        <h1 class="title">
          {{ $t("site.title") }}
        </h1>
        <p class="subtitle">
          {{ $t("site.subtitle") }}
        </p>
      </div>
    </section>
    <div class="container">
      <div class="block">
        <last-updated
          :last-updated="lastUpdated"
          v-if="lastUpdated"
        ></last-updated>
      </div>
      <main-chart
        :weeklyData="weeklyData"
        :predictedData="predictedFutureWeeklyData"
        v-if="weeklyData && predictedFutureWeeklyData"
      ></main-chart>
      <dashboard
        :current-speeds="currentSpeeds"
        :current-quotas="currentQuotas"
        :current-quota-speeds="currentQuotaSpeeds"
        :current-trends="currentTrends"
        :predicted-dates-linear="predictedDestinations"
        v-if="currentSpeeds && predictedDestinations"
      ></dashboard>
    </div>
  </div>
</template>

<script>
import MainChart from "./components/MainChart";
import Dashboard from "./components/Dashboard";
import LastUpdated from "./components/LastUpdated";
import Papa from "papaparse";
import moment from "moment";

export default {
  name: "app",
  components: {
    MainChart,
    Dashboard,
    LastUpdated
  },
  data: function() {
    return {
      rawData: null,
      processedData: null
    };
  },
  methods: {
    setProcessedData(data) {
      this.processedData = data
        .map(row => {
          // Format all numbers as numbers
          Object.keys(row).forEach(key => {
            if (key !== "date") {
              row[key] = +row[key];
            }
          });

          // Return object, with mutated 'rich' columns
          return {
            ...row,
            date: moment(row.date)
          };
        })
        // Remove invalid dates and empty rows
        .filter(row => {
          return row.date.isValid();
        });
    },
    processRawData(data) {
      this.setProcessedData(data);
    },
    fetchData() {
      Papa.parse(
        "https://impfdashboard.de/static/data/germany_vaccinations_timeseries_v2.tsv",
        {
          download: true,
          header: true,
          complete: results => {
            this.rawData = results.data;
            this.processRawData(this.rawData);
            this.getWeeklyData();
          }
        }
      );
    },
    getWeeklyData() {
      // create new array of data to preserve old array
      let reverseData = []
        .concat(this.processedData)
        .sort((a, b) => a.date.isBefore(b.date));
      let mostRecentDate = reverseData[0].date.clone();
      let firstDate = reverseData[reverseData.length - 1].date.clone();

      const weeklyData = [];
      for (
        let currentDate = mostRecentDate;
        currentDate.isSameOrAfter(firstDate);
        currentDate.subtract(7, "days")
      ) {
        // Get current week's data (to aggregate)
        const oneWeekAgo = currentDate.clone().subtract(7, "days");
        const currentWeeklyRows = reverseData.filter(
          el =>
            el.date.isSameOrBefore(currentDate) && el.date.isAfter(oneWeekAgo)
        );

        // Get last-weeks data (to calculate diffs for the current week)
        const twoWeeksAgo = oneWeekAgo.clone().subtract(7, "days");
        const lastWeeklyRows = reverseData.filter(
          el =>
            el.date.isSameOrBefore(oneWeekAgo) && el.date.isAfter(twoWeeksAgo)
        );

        // Aggregate and add the data
        weeklyData.push(
          this.aggregateOneWeeksData(currentWeeklyRows, lastWeeklyRows)
        );
      }
      return weeklyData.reverse();
    },
    aggregateOneWeeksData(currentWeekRows, lastWeekRows) {
      let latestCumulativeCurrentWeek = this.getLastRow(currentWeekRows);
      let latestCumulativeLastWeek = this.getLastRow(lastWeekRows);
      const aggregate = {};
      // Get cummulative data
      this.$config.dataSchema.cumulative.forEach(key => {
        aggregate[key] = latestCumulativeCurrentWeek[key];
        // Calculate diffs
        // If diffs don't exist, add them to the object
        if (!aggregate.diffs) {
          aggregate.diffs = {};
        }

        // If last week's data isn't null then add the diff, else assume it was 0
        if (latestCumulativeLastWeek && latestCumulativeLastWeek[key]) {
          aggregate.diffs[key] =
            latestCumulativeCurrentWeek[key] - latestCumulativeLastWeek[key];
        } else {
          aggregate.diffs[key] = latestCumulativeCurrentWeek[key];
        }
      });

      aggregate.date = latestCumulativeCurrentWeek.date;
      return aggregate;
    },
    getLastRow(rows) {
      rows.sort((a, b) => a.date.isAfter(b.date));
      return rows[rows.length - 1];
    }
  },
  computed: {
    weeklyData() {
      if (!this.processedData) {
        return null;
      }
      return this.getWeeklyData(this.processedData);
    },
    currentSpeeds() {
      if (!this.weeklyData) {
        return null;
      }
      return {
        first:
          this.weeklyData[this.weeklyData.length - 1][
            this.$config.dataSchema.mapping.first
          ] -
          this.weeklyData[this.weeklyData.length - 2][
            this.$config.dataSchema.mapping.first
          ],
        full:
          this.weeklyData[this.weeklyData.length - 1][
            this.$config.dataSchema.mapping.full
          ] -
          this.weeklyData[this.weeklyData.length - 2][
            this.$config.dataSchema.mapping.full
          ],
        doses:
          this.weeklyData[this.weeklyData.length - 1][
            this.$config.dataSchema.mapping.doses
          ] -
          this.weeklyData[this.weeklyData.length - 2][
            this.$config.dataSchema.mapping.doses
          ]
      };
    },
    currentQuotaSpeeds() {
      if (!this.weeklyData) {
        return null;
      }
      return {
        first:
          this.weeklyData[this.weeklyData.length - 1][
            this.$config.dataSchema.mapping.first_quota
          ] -
          this.weeklyData[this.weeklyData.length - 2][
            this.$config.dataSchema.mapping.first_quota
          ],
        full:
          this.weeklyData[this.weeklyData.length - 1][
            this.$config.dataSchema.mapping.full_quota
          ] -
          this.weeklyData[this.weeklyData.length - 2][
            this.$config.dataSchema.mapping.full_quota
          ]
      };
    },
    currentQuotas() {
      if (!this.weeklyData) {
        return null;
      }
      return {
        first: this.weeklyData[this.weeklyData.length - 1][
          this.$config.dataSchema.mapping.first_quota
        ],
        full: this.weeklyData[this.weeklyData.length - 1][
          this.$config.dataSchema.mapping.full_quota
        ]
      };
    },
    currentTrends() {
      if (!this.weeklyData) {
        return null;
      }
      return {
        first:
          this.weeklyData[this.weeklyData.length - 1].diffs[
            this.$config.dataSchema.mapping.first
          ] /
            this.weeklyData[this.weeklyData.length - 2].diffs[
              this.$config.dataSchema.mapping.first
            ] -
          1,
        full:
          this.weeklyData[this.weeklyData.length - 1].diffs[
            this.$config.dataSchema.mapping.full
          ] /
            this.weeklyData[this.weeklyData.length - 2].diffs[
              this.$config.dataSchema.mapping.full
            ] -
          1,
        doses:
          this.weeklyData[this.weeklyData.length - 1].diffs[
            this.$config.dataSchema.mapping.doses
          ] /
            this.weeklyData[this.weeklyData.length - 2].diffs[
              this.$config.dataSchema.mapping.doses
            ] -
          1
      };
    },
    predictedDestinations() {
      if (!this.currentQuotaSpeeds || !this.currentQuotas) {
        return null;
      }
      return {
        first: {
          everyone: moment().add(
            (this.$config.vaccinatablePopulation *
              this.$config.vaccineReadiness -
              this.weeklyData[this.weeklyData.length - 1][
                this.$config.dataSchema.mapping.first
              ]) /
              this.currentSpeeds.first,
            "weeks"
          ),
          half: moment().add(
            ((this.$config.vaccinatablePopulation / 2) *
              this.$config.vaccineReadiness -
              this.weeklyData[this.weeklyData.length - 1][
                this.$config.dataSchema.mapping.first
              ]) /
              this.currentSpeeds.first,
            "weeks"
          )
        },
        full: {
          everyone: moment().add(
            (this.$config.vaccinatablePopulation *
              2 *
              this.$config.vaccineReadiness -
              this.weeklyData[this.weeklyData.length - 1][
                this.$config.dataSchema.mapping.doses
              ]) /
              this.currentSpeeds.doses,
            "weeks"
          )
        }
      };
    },
    predictedFutureWeeklyData() {
      // create new array of data to preserve old array
      let reverseData = []
        .concat(this.processedData)
        .sort((a, b) => a.date.isBefore(b.date));
      let mostRecentDate = reverseData[0].date.clone();

      const predictedWeeklyData = [];

      // Calculate required doses for full vaccination of adult vaccine-ready population
      const requiredDoses = this.requiredDoses;

      // Start at current doses administered
      let predictedTotalDoses =
        reverseData[0][this.$config.dataSchema.mapping.doses];

      while (predictedTotalDoses < requiredDoses) {
        console.log(predictedTotalDoses, requiredDoses);
        predictedTotalDoses += this.currentSpeeds.doses;
        let weeksData = {};
        weeksData[this.$config.dataSchema.mapping.doses] = predictedTotalDoses;
        weeksData.date = mostRecentDate.add(7, "days").clone();
        predictedWeeklyData.push(weeksData);
      }
      return predictedWeeklyData;
    },
    lastUpdated() {
      if (!this.processedData) {
        return null;
      }
      return this.processedData[this.processedData.length - 1].date;
    },
    requiredDoses() {
      const requiredDoses =
        this.$config.vaccinatablePopulation *
        this.$config.vaccineReadiness *
        this.$config.dosesRequired;
      return requiredDoses;
    }
  },
  mounted() {
    this.fetchData();
    moment.locale(this.$config.locale);
  }
};
</script>

<style lang="scss">
@import "../src/scss/variables.scss";
</style>
