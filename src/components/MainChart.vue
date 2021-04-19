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
import numeral from "numeral";
export default {
  components: {
    ChartComponent
  },
  data() {
    let vm = this;
    return {
      options: {
        tooltips: {
          titleAlign: "center",
          callbacks: {
            label: function(tooltip, data) {
              // TODO format label correctly
              let label = data.datasets[tooltip.datasetIndex].label;
              return numeral(tooltip.value).format("0.00a") + " " + label;
            }
          }
        },
        scales: {
          yAxes: [
            {
              id: "population",
              type: "linear",
              stacked: true,
              position: "right",
              gridLines: {
                zeroLineWidth: 2,
                lineWidth: 0
              },
              scaleLabel: {
                display: true,
                labelString: vm.$t("chart.population")
              },
              ticks: {
                callback: function(value) {
                  return numeral(value).format("0a");
                }
              }
            },
            {
              id: "speed",
              type: "linear",
              stacked: true,
              position: "left",
              gridLines: {
                zeroLineWidth: 2,
                lineWidth: 0
              },
              scaleLabel: {
                display: true,
                labelString: vm.$t("chart.speed")
              },
              ticks: {
                callback: function(value) {
                  return numeral(value).format("0.0a");
                }
              }
            }
          ],
          xAxes: [
            {
              stacked: true,
              gridLines: {
                zeroLineWidth: 0,
                lineWidth: 1
              },
              scaleLabel: {
                display: true,
                labelString: vm.$t("chart.week-since-start")
              },
              ticks: {
                display: true
              }
            }
          ]
        }
      }
    };
  },
  props: {
    weeklyData: {},
    predictedData: {}
  },
  methods: {
    padLeftDataset(array, amountToPad, template = {}) {
      let newArray = [].concat(array);
      for (let index = 0; index < amountToPad; index++) {
        const element = template;
        newArray.unshift(element);
      }
      return newArray;
    }
  },
  computed: {
    chartData() {
      return {
        datasets: [
          {
            type: "line",
            yAxisID: "speed",
            label: "Doses per week",
            data: this.weeklyData.map(
              row => row.diffs[this.$config.dataSchema.mapping.doses]
            ),
            fill: false,
            borderColor: "#305db8",
            zIndex: 99
          },
          {
            type: "bar",
            yAxisID: "population",
            label: "Fully Immunized",
            data: this.weeklyData.map(
              row => row[this.$config.dataSchema.mapping.full]
            ),
            parsing: false,
            backgroundColor: "#028DFE",
            barPercentage: 0.95,
            categoryPercentage: 1.0
          },
          {
            type: "bar",
            yAxisID: "population",
            label: "First Immunizations",
            data: this.weeklyData.map(
              row => row[this.$config.dataSchema.mapping.first]
            ),
            parsing: false,
            backgroundColor: "#A2C7FB",
            barPercentage: 0.95,
            categoryPercentage: 1.0
          },
          {
            type: "bar",
            yAxisID: "population",
            label: "Predicted Immunizations",
            data: this.predictedChartDataset,
            backgroundColor: "#fcf0c4"
          }
        ],
        labels: this.weeklyData
          .concat(this.predictedData)
          .map(row => row.date.format("DD MMM"))
      };
    },
    predictedChartDataset() {
      const template = {};
      template[this.$config.dataSchema.mapping.doses] = 0;
      return this.padLeftDataset(
        this.predictedData,
        this.weeklyData.length,
        template
      ).map(row => row[this.$config.dataSchema.mapping.doses]);
    }
  }
};
</script>

<style lang="scss">
.main-chart {
  text-align: center;
}
</style>
