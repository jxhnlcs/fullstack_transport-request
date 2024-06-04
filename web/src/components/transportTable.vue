<template>
  <div class="table-container">
    <div class="header">
      <h1>Solicitações de Transporte de Maca</h1>
      <button @click="newRequest" class="new-request-btn"><i class="bx bx-plus-medical"></i><span>Nova Solicitação</span></button>
    </div>
    <div class="table-wrapper">
      <table class="transport-table">
        <thead>
          <tr>
            <th class="rounded-tl">ID</th>
            <th>Nome do Paciente</th>
            <th>Data</th>
            <th>Destino Inicial</th>
            <th class="rounded-tr">Destino Final</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="request in requests" :key="request.id">
            <td>{{ request.id }}</td>
            <td>{{ request.patientName }}</td>
            <td>{{ request.date }}</td>
            <td>{{ request.initialDestination }}</td>
            <td>{{ request.finalDestination }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "TransportTable",
  data() {
    return {
      requests: [
        {
          id: 1,
          patientName: "João da Silva",
          date: "2024-06-03",
          initialDestination: "Sala 101",
          finalDestination: "Sala 202"
        },
        {
          id: 2,
          patientName: "Maria Souza",
          date: "2024-06-03",
          initialDestination: "Sala 103",
          finalDestination: "Sala 204"
        },
        {
          id: 2,
          patientName: "Maria Souza",
          date: "2024-06-03",
          initialDestination: "Sala 103",
          finalDestination: "Sala 204"
        },
        {
          id: 2,
          patientName: "Maria Souza",
          date: "2024-06-03",
          initialDestination: "Sala 103",
          finalDestination: "Sala 204"
        },
        {
          id: 2,
          patientName: "Maria Souza",
          date: "2024-06-03",
          initialDestination: "Sala 103",
          finalDestination: "Sala 204"
        },
        {
          id: 2,
          patientName: "Maria Souza",
          date: "2024-06-03",
          initialDestination: "Sala 103",
          finalDestination: "Sala 204"
        },
        {
          id: 2,
          patientName: "Maria Souza",
          date: "2024-06-03",
          initialDestination: "Sala 103",
          finalDestination: "Sala 204"
        },
        {
          id: 2,
          patientName: "Maria Souza",
          date: "2024-06-03",
          initialDestination: "Sala 103",
          finalDestination: "Sala 204"
        },
        {
          id: 2,
          patientName: "Maria Souza",
          date: "2024-06-03",
          initialDestination: "Sala 103",
          finalDestination: "Sala 204"
        },
        {
          id: 2,
          patientName: "Maria Souza",
          date: "2024-06-03",
          initialDestination: "Sala 103",
          finalDestination: "Sala 204"
        },
        {
          id: 2,
          patientName: "Maria Souza",
          date: "2024-06-03",
          initialDestination: "Sala 103",
          finalDestination: "Sala 204"
        },
      ],
    };
  },
};
</script>

<style scoped>
.table-container {
  padding: 20px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h1 {
  font-size: 16px;
  color: #373D3F;
}

.new-request-btn {
  background-color: #2980B9;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.new-request-btn i{
  margin-right: 10px;
}

.new-request-btn:hover {
  background-color: #1a5a7f;
}

.table-wrapper {
  overflow: auto;
  flex-grow: 1;
}

.transport-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.transport-table th,
.transport-table td {
  border: none;
  padding: 8px;
  text-align: left;
}

.transport-table th {
  background-color: #f2f2f2;
}

.transport-table th.rounded-tl {
  border-top-left-radius: 10px;
}

.transport-table th.rounded-tr {
  border-top-right-radius: 10px;
}

.transport-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.transport-table tr:hover {
  background-color: #f1f1f1;
}
</style>
