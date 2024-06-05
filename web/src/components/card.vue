<template>
  <div class="card">
    <div class="card-header">
      <i :class="`bx ${iconClass} icon`" :style="{ backgroundColor: iconBgColor }"></i>
      <span class="percentage">{{ percentage }}</span>
    </div>
    <div class="card-content">
      <h2 class="value">{{ value }}</h2>
      <p class="description">{{ description }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "CardComponent",
  props: {
    value: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    percentage: {
      type: String,
      required: true,
    },
    iconClass: {
      type: String,
      required: true,
    },
    iconBgColor: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.icon {
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.percentage {
  background: #e0f7f1;
  color: #34a853;
  border-radius: 12px;
  padding: 5px 10px;
  font-size: 14px;
}

.card-content {
  text-align: left;
  margin-top: 20px;
}

.value {
  font-size: 32px;
  margin: 0;
}

.description {
  color: #888;
  font-size: 16px;
  margin: 0;
}
</style>