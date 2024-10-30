<template>
  <div>
    <h1>{{ jsonData.name }}</h1>
    <p>Version: {{ jsonData.version }}</p>
    <p>Description: {{ jsonData.description }}</p>
  </div>
</template>

<script>
export default {
  name: 'YourComponent',
  data() {
    return {
      jsonData: {} // 用於儲存從 JSON 中載入的數據
    };
  },
  mounted() {
    // 使用正確的路徑載入 JSON 文件
    fetch('/vue6.vue/test.json', { mode: 'no-cors' })
      .then(response => response.json())
      .then(data => {
        this.jsonData = data; // 將載入的數據儲存到 jsonData 中
      })
      .catch(error => {
        console.error('Error loading JSON:', error); // 如果加載失敗，顯示錯誤
      });
  }
};
</script>

<style>
/* 可以根據需求進行樣式調整 */
</style>
