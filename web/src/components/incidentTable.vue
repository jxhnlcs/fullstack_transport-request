<template>
  <div class="table-container">
    <h1>Incidentes Recentes</h1>
    <div class="table-wrapper">
      <table class="incident-table">
        <thead>
          <tr>
            <th class="rounded-tl">ID</th>
            <th>Descrição</th>
            <th>Data</th>
            <th class="rounded-tr">Gravidade</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="incident in incidents" :key="incident.id">
            <td>{{ incident.id }}</td>
            <td>{{ incident.description }}</td>
            <td>{{ incident.date }}</td>
            <td>{{ incident.severity }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "IncidentTable",
  data() {
    return {
      incidents: [
        {
          id: 1,
          description: "Queda do paciente na sala de espera",
          date: "2024-06-01",
          severity: "Alta",
        },
        {
          id: 2,
          description: "Equipamento de maca danificado",
          date: "2024-06-02",
          severity: "Média",
        },
        {
          id: 3,
          description: "Atraso no transporte",
          date: "2024-06-03",
          severity: "Baixa",
        },
        // Adicione mais incidentes conforme necessário
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
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.table-container h1{
  font-size: 16px;
  color: #373D3F;
}

.table-wrapper {
  overflow: auto;
  flex-grow: 1;
  max-height: 100px;
}

.incident-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.incident-table th,
.incident-table td {
  border: none;
  padding: 8px;
  text-align: left;
}

.incident-table th {
  background-color: #f2f2f2;
}

.incident-table th.rounded-tl {
  border-top-left-radius: 10px;
}

.incident-table th.rounded-tr {
  border-top-right-radius: 10px;
}

.incident-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.incident-table tr:hover {
  background-color: #f1f1f1;
}
</style>
