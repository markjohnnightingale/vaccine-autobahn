<template>
  <div class="main-chart block">
    <chart-component
      :chartData="chartData"
      :options="options"
      :width="1000"
      :height="400"
    ></chart-component>
  </div>
</template>

<script>
import ChartComponent from "./main-chart/ChartComponent";
export default {
  components: {
    ChartComponent
  },
  data() {
    return {
      options: {
        scales: {
          yAxes: [
            {
              stacked: true
            }
          ],
          xAxes: [
            {
              stacked: true
            }
          ]
        }
      }
    };
  },
  props: {
    weeklyData: {}
  },
  computed: {
    chartData() {
      return {
        datasets: [
          {
            type: "bar",
            label: "Fully Immunized",
            data: this.weeklyData.map(
              row => row[this.$config.dataSchema.mapping.full]
            ),
            parsing: false,
            backgroundColor: "#028DFE"
          },
          {
            type: "bar",
            label: "First Immunizations",
            data: this.weeklyData.map(
              row => row[this.$config.dataSchema.mapping.first]
            ),
            parsing: false,
            backgroundColor: "#dce5e3"
          }
        ],
        labels: this.weeklyData.map(row =>
          this.$t("dashboard.week-number", { week: row.date.week() })
        )
      };
    }
  }
};
</script>

<style lang="scss">
.main-chart {
  text-align: center;
}
</style>
