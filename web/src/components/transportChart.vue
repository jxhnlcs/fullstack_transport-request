<template>
  <div class="chart-container">
    <apexchart type="line" :options="chartOptions" :series="series"></apexchart>
  </div>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts';
import axios from '@/utils/axios';

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
          data: [],
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
          categories: [],
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
  created() {
    this.fetchTransportData();
  },
  methods: {
    async fetchTransportData() {
      try {
        const response = await axios.get('/transport-requests');
        const transports = response.data;

        const dates = [];
        const counts = [];

        transports.forEach(transport => {
          const date = this.formatDate(transport.data);
          const index = dates.indexOf(date);
          if (index === -1) {
            dates.push(date);
            counts.push(1);
          } else {
            counts[index]++;
          }
        });

        this.chartOptions.xaxis.categories = dates;
        this.series[0].data = counts;

      } catch (error) {
        console.error('Erro ao buscar solicitações de transporte:', error);
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
  },
};
</script>

<style scoped>

.chart-container {
  height: 100%;
  width: 100%;
  overflow: auto;
}

</style>
