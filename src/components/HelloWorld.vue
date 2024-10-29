<template>
  <div>
    <h1>{{ jsonData.name }}</h1>
    <p>Version: {{ jsonData.version }}</p>
    <p>Description: {{ jsonData.description }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      jsonData: {} // 初始化為空對象
    };
  },
  mounted() {
    // 使用 fetch 來加載 public 資料夾下的 test.json
    fetch('/test.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        this.jsonData = data;
      })
      .catch(error => {
        console.error('Error loading JSON:', error);
      });
  }
};
</script>

<style>
/* 可以根據需求進行樣式調整 */
</style>

