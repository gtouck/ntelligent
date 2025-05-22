/**
 * 计算数据点相对于给定多项式方程的决定系数(R²)
 * 形如 "y = 90.441x^2 + -1274.86x + 6071.79" 的方程字符串
 * @param {Array<number>} coefficients - 系数数组，从常数项到高次项
 * @param {Array<Array<number>>} data - 二维数据点数组，每个元素为 [x, y]
 * @return {number} 决定系数 R²
 */
export function calculateR2(coefficients, data) {
  // 计算预测值
  const yPredicted = data.map(point => calculateY(coefficients, point[0]));
  const yActual = data.map(point => point[1]);

  console.log(yPredicted, yActual);

  // 计算平均值
  const yMean = yActual.reduce((sum, y) => sum + y, 0) / yActual.length;

  // 计算总平方和 (SST - total sum of squares)
  const sst = yActual.reduce((sum, y) => sum + Math.pow(y - yMean, 2), 0);

  // 计算残差平方和 (SSE - sum of squared errors)
  let sse = 0;
  for (let i = 0; i < yActual.length; i++) {
    sse += Math.pow(yActual[i] - yPredicted[i], 2);
  }

  // 计算决定系数 R² = 1 - (SSE / SST)
  const r2 = 1 - sse / sst;

  return r2;
}

/**
 * 根据多项式系数和x值计算y值
 * @param {Array<number>} coefficients - 系数数组，从常数项到高次项
 * @param {number} x - x值
 * @return {number} 计算的y值
 */
function calculateY(coefficients, x) {
  let y = 0;
  for (let i = 0; i < coefficients.length; i++) {
    y += coefficients[i] * Math.pow(x, i);
  }
  return y;
}
