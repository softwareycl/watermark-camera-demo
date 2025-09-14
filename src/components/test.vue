<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>移动端相机与水印拍照</title>
  <script src="https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.js"></script>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
      background-color: #f5f5f5;
      color: #333;
      -webkit-tap-highlight-color: transparent;
    }
    .container {
      max-width: 100%;
      padding: 10px;
      margin: 0 auto;
    }
    .camera-container {
      position: relative;
      width: 100%;
      height: 70vh;
      overflow: hidden;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      background-color: #000;
      margin-bottom: 20px;
    }
    #videoElement {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .watermark-canvas {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }
    .controls {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 15px;
    }
    .capture-btn {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background-color: #fff;
      border: 4px solid #eee;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    }
    .capture-btn:active {
      transform: scale(0.95);
    }
    .inner-circle {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background-color: #ff4081;
    }
    .action-buttons {
      display: flex;
      gap: 20px;
      margin-top: 10px;
    }
    .btn {
      padding: 10px 20px;
      border-radius: 20px;
      border: none;
      font-weight: 500;
      cursor: pointer;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
    .btn-save {
      background-color: #4CAF50;
      color: white;
    }
    .btn-retake {
      background-color: #f44336;
      color: white;
    }
    .permission-msg {
      text-align: center;
      padding: 20px;
      color: #666;
    }
    .preview-container {
      position: relative;
      width: 100%;
      height: 70vh;
      margin-bottom: 20px;
    }
    #previewImage {
      width: 100%;
      height: 100%;
      object-fit: contain;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }
    .watermark-text {
      position: absolute;
      bottom: 20px;
      left: 0;
      right: 0;
      text-align: center;
      color: rgba(255, 255, 255, 0.7);
      font-size: 16px;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
      padding: 5px 10px;
    }
    h1 {
      text-align: center;
      margin: 15px 0;
      font-size: 1.5rem;
      color: #333;
    }
  </style>
</head>
<body>
  <div id="app">
    <div class="container">
      <h1>相机拍照与水印合成</h1>
      
      <div v-if="!hasPermission" class="permission-msg">
        <p>需要相机权限才能使用此功能</p>
        <p>请允许浏览器访问您的相机</p>
      </div>
      
      <div v-else>
        <div v-if="!isCaptured" class="camera-container">
          <video id="videoElement" autoplay playsinline></video>
          <canvas id="watermarkCanvas" class="watermark-canvas"></canvas>
        </div>
        
        <div v-else class="preview-container">
          <img id="previewImage" :src="capturedImage" alt="拍摄的照片">
          <div class="watermark-text">{{ watermarkText }}</div>
        </div>
        
        <div class="controls">
          <div v-if="!isCaptured" class="capture-btn" @click="captureImage">
            <div class="inner-circle"></div>
          </div>
          
          <div v-else class="action-buttons">
            <button class="btn btn-save" @click="saveImage">保存图片</button>
            <button class="btn btn-retake" @click="retake">重新拍照</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script>
    new Vue({
      el: '#app',
      data: {
        hasPermission: false,
        isCaptured: false,
        capturedImage: '',
        watermarkText: '拍摄于 ' + new Date().toLocaleDateString(),
        videoStream: null
      },
      mounted() {
        this.initCamera();
      },
      methods: {
        async initCamera() {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
              video: { 
                facingMode: 'environment', // 使用后置摄像头
                width: { ideal: 1280 },
                height: { ideal: 720 }
              } 
            });
            
            this.videoStream = stream;
            const videoElement = document.getElementById('videoElement');
            videoElement.srcObject = stream;
            this.hasPermission = true;
            
            // 等待视频加载完成后绘制水印
            videoElement.onloadedmetadata = () => {
              this.drawWatermark();
            };
          } catch (error) {
            console.error('无法访问相机:', error);
            this.hasPermission = false;
          }
        },
        
        drawWatermark() {
          const video = document.getElementById('videoElement');
          const canvas = document.getElementById('watermarkCanvas');
          const ctx = canvas.getContext('2d');
          
          // 设置canvas尺寸与视频相同
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          
          const draw = () => {
            if (video.readyState === video.HAVE_ENOUGH_DATA) {
              // 清除画布
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              
              // 绘制水印文本
              ctx.font = '24px Arial';
              ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
              ctx.textAlign = 'center';
              ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
              ctx.shadowBlur = 4;
              
              // 在底部居中绘制水印
              ctx.fillText(this.watermarkText, canvas.width / 2, canvas.height - 40);
              
              // 添加额外水印信息
              ctx.font = '18px Arial';
              ctx.fillText('版权所有 © 2023', canvas.width / 2, canvas.height - 15);
            }
            
            if (!this.isCaptured) {
              requestAnimationFrame(draw);
            }
          };
          
          draw();
        },
        
        captureImage() {
          const video = document.getElementById('videoElement');
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // 设置canvas尺寸与视频相同
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          
          // 绘制当前视频帧
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          // 添加水印
          ctx.font = '24px Arial';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.textAlign = 'center';
          ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
          ctx.shadowBlur = 4;
          ctx.fillText(this.watermarkText, canvas.width / 2, canvas.height - 40);
          
          ctx.font = '18px Arial';
          ctx.fillText('版权所有 © 2023', canvas.width / 2, canvas.height - 15);
          
          // 转换为DataURL
          this.capturedImage = canvas.toDataURL('image/png');
          this.isCaptured = true;
          
          // 停止视频流
          if (this.videoStream) {
            this.videoStream.getTracks().forEach(track => track.stop());
          }
        },
        
        saveImage() {
          const link = document.createElement('a');
          link.href = this.capturedImage;
          link.download = 'photo-with-watermark.png';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        },
        
        retake() {
          this.isCaptured = false;
          this.capturedImage = '';
          this.initCamera();
        }
      },
      
      beforeDestroy() {
        // 组件销毁前停止视频流
        if (this.videoStream) {
          this.videoStream.getTracks().forEach(track => track.stop());
        }
      }
    });
  </script>
</body>
</html>