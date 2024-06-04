<template>
  <div class="chart-container">
    <apexchart type="line" :options="chartOptions" :series="series"></apexchart>
  </div>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts';

export default {
  name: "TransportChart",
  components: {
    apexchart: VueApexCharts,
  },
  data() {
    return {
      series: [
        {
          name: "Total de Transportes",
          data: [31, 40, 28, 51, 42, 109, 100],
        },
      ],
      chartOptions: {
        chart: {
          type: "line",
          background: '#fff',
          height: '100%',
          toolbar: {
            show: true
          }
        },
        title: {
          text: "Total de Transportes",
          align: "left",
        },
        xaxis: {
          categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
        },
        responsive: [{
          breakpoint: 1000,
          options: {
            chart: {
              height: '100%'
            }
          }
        }]
      },
    };
  },
};
</script>

<style scoped>
.chart-container {
  height: 100%;
  width: 100%;

  overflow: hidden;
}
</style>
