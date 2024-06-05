<template>
  <div class="chart-container">
    <apexchart type="line" :options="chartOptions" :series="series"></apexchart>
  </div>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts';
import axios from '@/utils/axios';
import { jwtDecode } from 'jwt-decode';

export default {
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
      maqueiro_id: null,
      isAdmin: false,
    };
  },

  created() {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      this.maqueiro_id = decodedToken.userid;
      this.isAdmin = decodedToken.perms === 'Admin';
      this.fetchTransportData();
    } else {
      console.log('Nenhum token encontrado no localStorage');
    }
  },

  methods: {
    async fetchTransportData() {
      try {
        const endpoint = this.isAdmin ? '/transport-requests' : `/transport-requests/maqueiro/${this.maqueiro_id}`;
        const response = await axios.get(endpoint);
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

  watch: {
    key() {
      this.fetchTransportData();
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