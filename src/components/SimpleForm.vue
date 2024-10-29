<template>
  <div class="form-container">
    <!-- 頂部進度條 -->
    <div class="progress-container">
      <div class="progress-bar" :style="{ width: progressPercentage + '%' }"></div>
    </div>

    <h1 class="form-title">{{ formTitle }}</h1>
    <form @submit.prevent="handleSubmit">
      <div class="form-row">
        <div v-for="(element, index) in formElements" :key="index" class="form-group">
          <label :for="element.name" class="form-label">{{ element.title }}:</label>

          <!-- Text input -->
          <input
            v-if="element.type === 'text' && !element.readOnly"
            v-model="formData[element.name]"
            :id="element.name"
            type="text"
            class="form-input"
            required
          />

          <!-- Date input -->
          <input
            v-else-if="element.type === 'date'"
            v-model="formData[element.name]"
            :id="element.name"
            type="date"
            class="form-input"
            required
          />

          <!-- Dropdown (select) -->
          <select
            v-else-if="element.type === 'dropdown'"
            v-model="formData[element.name]"
            :id="element.name"
            class="form-input"
            required
          >
            <option v-for="(choice, idx) in element.choices" :key="idx" :value="choice.value || choice">
              {{ choice.text || choice }}
            </option>
          </select>

          <!-- Radio for Yes/No questions -->
          <div v-else-if="element.type === 'radio'" class="radio-group">
            <label v-for="(choice, idx) in element.choices" :key="idx" class="radio-option">
              <input
                type="radio"
                :name="element.name"
                :value="choice.value"
                v-model="formData[element.name]"
              />
              {{ choice.text }}
            </label>
          </div>

          <!-- File upload -->
          <input
            v-else-if="element.type === 'file'"
            @change="handleFileUpload($event, element.name)"
            :id="element.name"
            type="file"
            class="form-input"
          />

          <!-- Read-Only Expression -->
          <span v-else-if="element.readOnly && element.setValueExpression" class="form-text">
            {{ calculateExpression(element) }}
          </span>

          <!-- Other Expressions (Read-Only) -->
          <span v-else-if="element.type === 'expression'" class="form-text">
            {{ calculateExpression(element) }}
          </span>
        </div>
      </div>
      <button type="submit" class="submit-button">提交</button>
    </form>

    <!-- 提交後顯示資料區域 -->
    <div v-if="submitted" class="submitted-data">
      <h2>提交的資料</h2>
      <div class="form-row">
        <div v-for="(element, index) in formElements" :key="index" class="form-group">
          <label class="form-label">{{ element.title }}:</label>
          
          <!-- 顯示提交後不可編輯的輸入值 -->
          <span v-if="element.type !== 'file'" class="form-text">{{ formData[element.name] }}</span>
          
          <!-- 顯示圖片預覽 -->
          <img v-if="element.type === 'file' && imagePreview[element.name]" :src="imagePreview[element.name]" alt="Image Preview" class="image-preview" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formTitle: '',
      formElements: [],
      formData: {},
      submitted: false,
      imagePreview: {}  // 用於儲存圖片檔案的預覽URL
    };
  },
  computed: {
    progressPercentage() {
      const totalFields = this.formElements.length;
      const filledFields = Object.keys(this.formData).filter(
        key => this.formData[key]
      ).length;
      return Math.round((filledFields / totalFields) * 100);
    }
  },
  mounted() {
    fetch('/test.json')
      .then(response => response.json())
      .then(data => {
        this.formTitle = data.title;
        this.formElements = data.pages[0].elements;
        this.formElements.forEach(element => {
          this.formData[element.name] = element.setValueExpression
            ? this.calculateExpression(element)
            : '';
        });
      })
      .catch(error => console.error('Error loading JSON:', error));
  },
  methods: {
    handleSubmit() {
      this.submitted = true;
      this.$nextTick(() => {
        const submittedDataElement = this.$el.querySelector(".submitted-data");
        if (submittedDataElement) {
          submittedDataElement.scrollIntoView({ behavior: "smooth" });
        }
      });
    },
    handleFileUpload(event, name) {
      const file = event.target.files[0];
      this.formData[name] = file;

      // 僅顯示圖片類型的檔案
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreview[name] = e.target.result;  // 儲存圖片的 Base64 字串
        };
        reader.readAsDataURL(file);
      }
    },
    calculateExpression(element) {
      try {
        const expression = element.setValueExpression;
        return eval(
          expression.replace(/{(\w+)}/g, (_, key) => this.formData[key] || 0)
        );
      } catch (e) {
        console.error('Error calculating expression:', e);
        return '';
      }
    }
  },
  watch: {
    formData: {
      handler() {
        this.formElements.forEach(element => {
          if (element.setValueExpression) {
            this.formData[element.name] = this.calculateExpression(element);
          }
        });
      },
      deep: true
    }
  }
};
</script>

<style scoped>
/* 調整 form-container 寬度 */
.form-container {
  max-width: 1800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-size: 1.5em;
}

.progress-container {
  width: 100%;
  height: 10px;
  background-color: #e0e0e0;
  border-radius: 5px;
  position: fixed; /* 固定在頂部 */
  top: 0;
  left: 0;
  z-index: 1000; /* 確保進度條在最上層 */}

.form-container {
  max-width: 1800px;
  margin: 40px auto 0; /* 調整 margin 以避免進度條遮住內容 */
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-size: 1.5em;
}

.progress-bar {
  height: 100%;
  background-color: #4caf50;
  border-radius: 5px;
  transition: width 0.3s ease;
}

.form-title {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
  font-size: 2em;
  font-weight: bold;
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
}

.form-group {
  flex: 1 1 calc(50% - 20px);
  display: flex;
  flex-direction: column;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.form-label {
  margin-bottom: 5px;
  font-weight: 600;
  color: #555;
}

.form-input,
.form-checkbox {
  padding: 10px;
  font-size: 1em;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s;
}

.radio-group {
  display: flex;
  gap: 10px;
}

.radio-option {
  display: flex;
  align-items: center;
}

.form-text {
  padding: 10px 0;
  font-size: 1.1em;
  color: #333;
}

.form-input:focus,
.form-checkbox:focus {
  border-color: #4CAF50;
  outline: none;
}

.submit-button {
  width: 100%;
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  font-size: 1.2em;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #45a049;
}

.submitted-data {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #e6ffe6;
  font-size: 1.1em;
}

.image-preview {
  max-width: 100px;
  max-height: 100px;
  margin-top: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.form-group {
  flex: 1 1 calc(50% - 20px);
  display: flex;
  flex-direction: column;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 5);
}
</style>
