<!--
 * @Author: YCL
 * @Date: 2025-08-31 15:56:09
 * @LastEditors: YCL
 * @LastEditTime: 2025-09-14 19:29:45
 * @Description: 
-->
<template>
  <div class="hello">
    <div class="container">
      <h1>📷 自定义水印相机</h1>
      
      <div class="controls-panel">
        <div class="control-group">
          <h3>水印文字</h3>
          <input type="text" v-model="watermarkText" placeholder="输入水印文字" style="width: 100%; padding: 8px; border-radius: 5px; border: 1px solid #ddd;">
        </div>
        
        <div class="control-group">
          <h3>水印位置</h3>
          <div class="position-selector">
            <div 
              v-for="position in positionOptions" 
              :key="position.value"
              class="position-btn"
              :class="{ selected: watermarkPosition === position.value }"
              @click="watermarkPosition = position.value"
            >
              {{ position.label }}
            </div>
          </div>
        </div>
        
        <div class="control-group">
          <h3>水印倾斜度</h3>
          <div class="slider-container">
            <label>角度:</label>
            <input type="range" min="-45" max="45" v-model="watermarkRotation">
            <span class="value-display">{{ watermarkRotation }}°</span>
          </div>
        </div>
        
        <div class="control-group">
          <h3>水印颜色</h3>
          <div class="color-picker">
            <div 
              v-for="color in colorOptions" 
              :key="color"
              class="color-option"
              :style="{ backgroundColor: color }"
              :class="{ selected: watermarkColor === color }"
              @click="watermarkColor = color"
            ></div>
          </div>
        </div>
        
        <div class="control-group">
          <h3>水印大小</h3>
          <div class="slider-container">
            <label>字体大小:</label>
            <input type="range" min="16" max="48" v-model="watermarkFontSize">
            <span class="value-display">{{ watermarkFontSize }}px</span>
          </div>
        </div>
        
        <div class="control-group">
          <h3>水印模式</h3>
          <div class="toggle-switch">
            <div 
              class="switch-btn"
              :class="{ selected: !isFullScreenWatermark }"
              @click="isFullScreenWatermark = false"
            >
              单个水印
            </div>
            <div 
              class="switch-btn"
              :class="{ selected: isFullScreenWatermark }"
              @click="isFullScreenWatermark = true"
            >
              全屏水印
            </div>
          </div>
        </div>
        
        <div class="control-group">
          <h3>水印预览</h3>
          <div class="watermark-preview">
            <div 
              class="preview-text"
              :style="previewStyle"
            >
              {{ watermarkText || '示例水印' }}
            </div>
          </div>
        </div>
      </div>
      
      <watermark-camera
        :watermark-text="watermarkText"
        :position="watermarkPosition"
        :rotation="rotation"
        :color="watermarkColor"
        :font-size="fontSize"
        :is-full-screen="isFullScreenWatermark"
        @capture="handleCapture"
      ></watermark-camera>
    </div>
    <van-image
      v-if="imageUrl"
      width="250px"
      height="500px"
      fit="cover"
      :src="imageUrl"
    />
  </div>
</template>

<script>
import { WatermarkCamera } from 'cl-camera';
import { Image as VanImage } from 'vant';

export default {
  name: 'HelloWorld',
  components: {
    WatermarkCamera,
    VanImage,
  },
  data() {
    return {
      imageUrl: "",
      watermarkText: '拍摄于 ' + new Date().toLocaleDateString(),
      watermarkPosition: 'bottom-center',
      watermarkRotation: 0,
      watermarkColor: 'rgba(255, 255, 255, 0.7)',
      watermarkFontSize: 24,
      isFullScreenWatermark: false,
      positionOptions: [
        { value: 'top-left', label: '左上' },
        { value: 'top-center', label: '上中' },
        { value: 'top-right', label: '右上' },
        { value: 'center', label: '中心' },
        { value: 'bottom-left', label: '左下' },
        { value: 'bottom-center', label: '下中' },
        { value: 'bottom-right', label: '右下' }
      ],
      colorOptions: [
        'rgba(255, 255, 255, 0.7)',
        'rgba(0, 0, 0, 0.7)',
        'rgba(255, 0, 0, 0.7)',
        'rgba(0, 255, 0, 0.7)',
        'rgba(0, 0, 255, 0.7)',
        'rgba(255, 255, 0, 0.7)',
        'rgba(255, 0, 255, 0.7)',
        'rgba(0, 255, 255, 0.7)'
      ]
    }
  },
  computed: {
    fontSize() {
      return Number(this.watermarkFontSize)
    },
    rotation() {
      return Number(this.watermarkRotation)
    },
    previewStyle() {
      // 计算预览水印样式
      let style = {
        color: this.watermarkColor,
        fontSize: this.watermarkFontSize + 'px',
        transform: `rotate(${this.watermarkRotation}deg)`,
        fontWeight: 'bold'
      };
      
      // 设置位置
      switch (this.watermarkPosition) {
        case 'top-left':
          Object.assign(style, { top: '10px', left: '10px', transformOrigin: '0 0' });
          break;
        case 'top-center':
          Object.assign(style, { top: '10px', left: '50%', transform: `translateX(-50%) rotate(${this.watermarkRotation}deg)` });
          break;
        case 'top-right':
          Object.assign(style, { top: '10px', right: '10px', transformOrigin: '100% 0' });
          break;
        case 'center':
          Object.assign(style, { top: '50%', left: '50%', transform: `translate(-50%, -50%) rotate(${this.watermarkRotation}deg)` });
          break;
        case 'bottom-left':
          Object.assign(style, { bottom: '10px', left: '10px', transformOrigin: '0 100%' });
          break;
        case 'bottom-center':
          Object.assign(style, { bottom: '10px', left: '50%', transform: `translateX(-50%) rotate(${this.watermarkRotation}deg)` });
          break;
        case 'bottom-right':
          Object.assign(style, { bottom: '10px', right: '10px', transformOrigin: '100% 100%' });
          break;
      }
      
      return style;
    }
  },
  methods: {
    handleCapture(data) {
      this.imageUrl = data.base64;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hello {
  width: 100%;
  height: 100%;
}

:deep(.van-image__img) {
  width: 100%;
  height: 100%;
}

.container {
  max-width: 100%;
  margin: 0 auto 30px;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}
h1 {
  text-align: center;
  margin: 15px 0 25px;
  font-size: 1.8rem;
  color: #2575fc;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}
.controls-panel {
  background-color: #f9f9f9;
  border-radius: 15px;
  padding: 15px;
  margin-bottom: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
.control-group {
  margin-bottom: 15px;
}
.control-group h3 {
  margin-bottom: 10px;
  color: #2575fc;
  font-size: 1.1rem;
}
.slider-container {
  display: flex;
  align-items: center;
  gap: 10px;
}
.slider-container label {
  min-width: 80px;
}
input[type="range"] {
  flex: 1;
}
.value-display {
  min-width: 40px;
  text-align: center;
  font-weight: bold;
}
.color-picker {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.color-option {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid transparent;
  transition: transform 0.2s;
}
.color-option.selected {
  border-color: #333;
  transform: scale(1.2);
}
.position-selector {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
.position-btn {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background: white;
  cursor: pointer;
  text-align: center;
}
.position-btn.selected {
  background-color: #2575fc;
  color: white;
  border-color: #2575fc;
}
.toggle-switch {
  display: flex;
  gap: 15px;
}
.switch-btn {
  padding: 8px 15px;
  border: 1px solid #ddd;
  border-radius: 20px;
  background: white;
  cursor: pointer;
}
.switch-btn.selected {
  background-color: #2575fc;
  color: white;
  border-color: #2575fc;
}
.watermark-preview {
  height: 100px;
  background-color: #eee;
  border-radius: 10px;
  margin-top: 15px;
  position: relative;
  overflow: hidden;
}
.preview-text {
  position: absolute;
  color: rgba(0, 0, 0, 0.7);
  font-weight: bold;
}
</style>
