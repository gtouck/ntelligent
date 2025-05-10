// postcss.config.js
module.exports = {
  plugins: {
    'postcss-pxtorem': {
      rootValue: 37.5, // 设计稿宽度除以10，通常是750的设计稿对应75。
      propList: ['*'], // 需要转换的属性，这里选择转换所有属性。
    },
  },
};
