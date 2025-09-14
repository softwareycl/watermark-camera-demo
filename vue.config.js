/*
 * @Author: YCL
 * @Date: 2025-08-31 15:56:09
 * @LastEditors: YCL
 * @LastEditTime: 2025-09-14 19:31:26
 * @Description: 
 */
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === 'production' ? '/watermark-camera-demo' : '/'
})
