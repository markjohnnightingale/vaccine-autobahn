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
      <main-chart :weeklyData="weeklyData" v-if="weeklyData"></main-chart>
      <dashboard
        :current-speeds="currentSpeeds"
        :current-quotas="currentQuotas"
        :current-quota-speeds="currentQuotaSpeeds"
        :predicted-dates-linear="predictedDatesLinear"
        v-if="currentSpeeds && predictedDatesLinear"
      ></dashboard>
    </div>
  </div>
</template>

<script>
import MainChart from "./components/MainChart";
import Dashboard from "./components/Dashboard";
import Papa from "papaparse";
import moment from "moment";
export default {
  name: "app",
  components: {
    MainChart,
    Dashboard
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
      // let weeklyData = [];
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
        const oneWeekAgo = currentDate.clone().subtract(7, "days");
        const rows = reverseData.filter(
          el =>
            el.date.isSameOrBefore(currentDate) && el.date.isAfter(oneWeekAgo)
        );
        weeklyData.push(this.aggregateOneWeeksData(rows));
      }
      return weeklyData.reverse();
    },
    aggregateOneWeeksData(rows) {
      rows.sort((a, b) => a.date.isAfter(b.date));
      let latestCumulative = rows[rows.length - 1];
      const aggregate = {};
      this.$config.dataSchema.cumulative.forEach(key => {
        aggregate[key] = latestCumulative[key];
      });
      aggregate.date = latestCumulative.date;
      return aggregate;
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
    predictedDatesLinear() {
      if (!this.currentQuotaSpeeds || !this.currentQuotas) {
        return null;
      }
      return {
        first: {
          everyone: moment().add(
            (1 - this.currentQuotas.first) / this.currentQuotaSpeeds.first,
            "weeks"
          ),
          half: moment().add(
            (0.5 - this.currentQuotas.first) / this.currentQuotaSpeeds.first,
            "weeks"
          )
        },
        full: {
          everyone: moment().add(
            (1 - this.currentQuotas.full) / this.currentQuotaSpeeds.full,
            "weeks"
          ),
          half: moment().add(
            (0.5 - this.currentQuotas.full) / this.currentQuotaSpeeds.full,
            "weeks"
          )
        }
      };
    }
  },
  mounted() {
    this.fetchData();
  }
};
</script>

<style lang="scss">
@import "../src/scss/variables.scss";
</style>
