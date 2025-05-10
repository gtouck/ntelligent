/* eslint-disable prettier/prettier */
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import legacy from '@vitejs/plugin-legacy';
import path from 'path';
import config from './src/build/config';
import postCssPxToRem from 'postcss-pxtorem';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // 根据当前工作目录中的 `mode` 加载 .env 文件
  // 设置第三个参数为 '' 来加载所有环境变量，而不管是否有 `VITE_` 前缀。
  console.log(process.env.NODE_ENV, mode);
  const proxyPath = config[mode]?.baseApi || '';
  return {
    // vite 配置
    define: {
      __NODE_ENV__: JSON.stringify(process.env.NODE_ENV),
      __APP_ENV__: JSON.stringify(mode),
    },
    server: {
      port: 8001,
      open: true,
      proxy: {
        '/api': {
          target: 'http://139.224.198.235:8000',
          changeOrigin: true,

          rewrite: path => path.replace(/^\/api/, ''),
        },
      },
    },
    base: './',
    resolve: {
      extensions: ['.vue', '.jsx', '.js'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@cmpts': path.resolve(__dirname, 'src/components'),
      },
    },
    css: {
      // css预处理器
      postcss: {
        plugins: [
          postCssPxToRem({
            rootValue: 192,
            propList: ['*'],
          }),
        ],
      },

      preprocessorOptions: {
        less: {
          /*
            引入var.less全局预定义变量，
            如果引入多个文件，
            可以使用
            '@import "@/assets/css/sc1.less";@import "@/assets/css/sc2.less";'
            这种格式
          */
          additionalData: '@use "@/assets/css/var.less" as *;',
        },
      },
    },
    plugins: [
      vue(),
      legacy({
        targets: ['defaults', 'not IE 11'],
      }),
    ],
    build: {
      outDir: 'dist',
      rollupOptions: {
        output: {
          //入口文件输出配置
          entryFileNames: `js/[name]-[hash].js`,
          //代码分割后的文件输出配置
          chunkFileNames: `js/[name]-[hash].js`,

          //静态资源输出配置
          assetFileNames(assetInfo) {
            //css文件单独输出到css文件夹
            if (assetInfo.name.endsWith('.css')) {
              return `css/[name]-[hash].css`;
            }
            //图片文件单独输出到img文件夹
            else if (
              ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'].some(ext =>
                assetInfo.name.endsWith(ext),
              )
            ) {
              return `img/[name]-[hash].[ext]`;
            }
            //其他资源输出到assets文件夹
            else {
              return `[name]-[hash].[ext]`;
            }
          },
        },
      },
    },
  };
});
