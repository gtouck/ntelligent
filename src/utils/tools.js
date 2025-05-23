import moment from 'moment';
import html2canvas from 'html2canvas';
import * as echarts from 'echarts';
import ecStat from 'echarts-stat';

var tools = {
  log(type = 'info', desc, val) {
    if (window.__NODE_ENV__ !== 'development') return;
    var p = type == 'error' ? console.error : type == 'warn' ? console.warn : console.log;
    p(...arguments);
  },

  getTime(date = new Date(), format = 'YYYY/MM/DD') {
    const type = localStorage.getItem('timeType') || 'local';
    if (type == 'local') {
      return moment(date).format(format);
    } else {
      return moment(date).utc().format(format);
    }
  },

  getSessionStorage(key) {
    if (!key) return;
    if (!sessionStorage.getItem(key)) return;
    const value = sessionStorage.getItem(key);
    const isObj = value ? value.indexOf('{') >= 0 || value.indexOf('[') >= 0 : false;
    return !isObj ? value : JSON.parse(value);
  },

  setSessionStorage(key, value) {
    if (!key || !value) return;
    sessionStorage.setItem(key, typeof value == 'string' ? value : JSON.stringify(value));
  },

  removeSessionStorage(key) {
    if (!key) return;
    sessionStorage.removeItem(key);
  },

  async toCanvas() {
    const el = document.getElementsByClassName('canvas_box')[0];
    const canvas = await html2canvas(el);
    const img = canvas.toDataURL('image/png');
    return img;
  },

  initPie3(data) {
    const chartDom1 = document.getElementById('chart3');
    chartDom1.removeAttribute('_echarts_instance_');
    const myChart1 = echarts.init(chartDom1);
    const abd_data = Math.abs(data) * 100;

    let option;

    option = {
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['70%', '100%'],
          avoidLabelOverlap: false,
          emptyCircleStyle: {
            color: '#eee',
          },
          label: {
            // formatter: ['{a|{c}%}', '{b|增加油耗}'].join('\n'),
            color: '#DC4C3F',
            formatter: params => {
              return [
                100 - params.value > 0 ? (100 - params.value).toFixed(2) + '%' : '-',
                '{b|速度损失}',
              ].join('\n');
            },
            fontSize: 16,
            lineHeight: 18,
            rich: {
              a: {
                color: '#DC4C3F',
                fontWeight: '900',
                fontSize: '.10rem',
                padding: [0, 0, 3, 0],
              },
              b: {
                color: '#666',
                fontSize: '.06rem',
              },
            },

            show: true,
            position: 'center',
          },
          emphasis: {
            disabled: true,
          },
          itemStyle: {},
          data: [
            { value: abd_data, itemStyle: { color: '#DC4C3F' } },
            { value: 100 - abd_data, itemStyle: { color: '#eee' } },
          ],
        },
      ],
    };

    option && myChart1.setOption(option);
  },
  initPie4(data) {
    const chartDom1 = document.getElementById('chart4');
    chartDom1.removeAttribute('_echarts_instance_');
    const myChart1 = echarts.init(chartDom1);
    let option;

    option = {
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['70%', '100%'],
          avoidLabelOverlap: false,
          emptyCircleStyle: {
            color: '#eee',
          },
          label: {
            color: '#DC4C3F',
            formatter: params => {
              return [
                100 - params.value > 0 ? (100 - params.value).toFixed(2) + '%' : '-',
                '{b|速度损失}',
              ].join('\n');
            },
            fontSize: 16,
            lineHeight: 18,
            rich: {
              a: {
                color: '#DC4C3F',
                fontWeight: '900',
                fontSize: '.10rem',
                padding: [0, 0, 3, 0],
              },
              b: {
                color: '#666',
                fontSize: '.06rem',
              },
            },

            show: true,
            position: 'center',
          },
          emphasis: {
            disabled: true,
          },
          itemStyle: {},
          data: [
            { value: data, itemStyle: { color: '#DC4C3F' } },
            { value: 100 - data, itemStyle: { color: '#eee' } },
          ],
        },
      ],
    };

    option && myChart1.setOption(option);
  },

  initBar1(data) {
    const { days_after_propeller_polishing, days_after_clean, days_after_repaint } = data;
    const day1 = (days_after_propeller_polishing / 30).toFixed(1);
    const day2 = (days_after_clean / 30).toFixed(1);
    const day3 = (days_after_repaint / 30).toFixed(1);
    const chartDom2 = document.getElementById('chart2');
    chartDom2.removeAttribute('_echarts_instance_');
    const myChart2 = echarts.init(chartDom2);
    let option;
    // 准备数据源，根据数值情况决定显示方式
    const source = [
      ['index', 'data', 'name', 'showLabel'],
      [0, day3, '距船体重喷漆已', day3 > 0],
      [0, day2, '距上次船体清洁已', day2 > 0],
      [0, day1, '上次螺旋桨抛光距今 ', day1 > 0],
    ];
    option = {
      dataset: {
        source,
      },

      xAxis: { name: '' },
      yAxis: {
        type: 'category',
        axisLabel: {
          fontSize: '14',
        },
      },
      grid: {
        top: 'middle',
        left: 150,
        height: 100,
        width: '55%',
      },

      series: [
        {
          type: 'bar',
          barWidth: '50%',
          label: {
            show: true,
            formatter: function (params) {
              // 获取当前数据点的完整数据（包括自定义的showLabel标志）
              const dataRow = source[params.dataIndex + 1];
              const value = dataRow[1];
              const showLabel = dataRow[3];

              if (!showLabel || value <= 0) {
                // 如果不显示标签或值小于等于0，显示提示文字
                if (params.name === '距船体重喷漆已') {
                  return '未进行船体重喷漆';
                } else if (params.name === '距上次船体清洁已') {
                  return '未进行船体清洁';
                } else if (params.name === '上次螺旋桨抛光距今 ') {
                  return '未进行螺旋桨抛光';
                }
                return '无数据';
              }

              // 正常显示月份数据
              return value + '月';
            },
            color: '#1286F1',
            position: 'right',
            fontSize: '.06rem',
          },
          itemStyle: {
            color: function (params) {
              const dataRow = source[params.dataIndex + 1];
              const value = dataRow[1];
              const showLabel = dataRow[3];

              // 当数值小于等于0或不应显示时，使用透明色
              if (!showLabel || value <= 0) {
                return 'rgba(0,0,0,0)';
              }
              return '#1286F1';
            },
          },

          encode: {
            // Map the "amount" column to X axis.
            x: 'data',
            // Map the "product" column to Y axis
            y: 'name',
          },
        },
      ],
    };
    option && myChart2.setOption(option);
  },

  //状态提醒散点图
  initEcStat1(data, deviation, after_deviation) {
    let data1 = data.map(e => [moment(e.pc_time).format('YYYY-MM-DD'), e.speed_deviation]);
    let data2 = data.map(e => [e.speed_water, e.shaft_power_reference]);
    console.log(data1);
    const chartDom = document.getElementById('chart5');
    chartDom.removeAttribute('_echarts_instance_');
    const myChart = echarts.init(chartDom);
    let option;

    echarts.registerTransform(ecStat.transform.regression);
    option = {
      dataset: [
        {
          source: data1,
        },
      ],
      title: {},

      xAxis: [
        {
          type: 'category',
          name: '时间',
          boundaryGap: false,
          nameLocation: 'middle',
          nameGap: 30,
          nameTextStyle: {
            fontSize: 16,
          },
          axisTick: {
            show: false, // Hide the x-axis tick lines
          },
          axisLine: {
            show: false,
          },
        },
        //第二个x轴,固定在下侧
        {
          type: 'category', // 保持类型一致
          position: 'bottom', // 明确在下方
          axisTick: {
            show: false,
          },
          axisLine: {
            show: true, // 显示底部轴线增强美观
            symbol: ['none', 'arrow'], // 起点无箭头，终点有箭头
            symbolSize: [8, 10], // 箭头尺寸 [宽, 高]
          },
          axisLabel: {
            show: false, // 不显示标签
          },
          splitLine: {
            show: false,
          },
          data: [], // 避免影响主坐标轴，留空
        },
      ],
      yAxis: {
        show: true,
        name: '速度损失率',
        nameLocation: 'middle',
        nameRotate: 90,
        nameTextStyle: {
          fontSize: 16,
        },
        axisLine: {
          show: true,
        },
        axisLabel: {
          formatter: function (value) {
            return (value * 100).toFixed(1) + '%';
          },
        },
        nameGap: 60,
        splitLine: {
          lineStyle: {
            type: 'dashed',
          },
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
        formatter: function (params) {
          const date = params[0].value[0];
          const value = params[0].value[1];
          return date + '<br/>' + '速度损失率: ' + (value * 100).toFixed(2) + '%';
        },
      },
      legend: {
        data: ['速度损失率', '平均速度损失率', '试航报告基准线'],
        bottom: 0,
        padding: [5, 10],
        itemWidth: 15,
        itemHeight: 10,
      },
      series: [
        {
          name: '速度损失率',
          type: 'scatter',
          datasetIndex: 0,
          symbolSize: 8, // Added scatter point size (you can adjust this value)
          itemStyle: {
            color: '#1a88ee',
          },
          data: data1,
        },
        {
          name: '平均速度损失率',
          type: 'line',
          markLine: {
            silent: true,
            symbol: ['none', 'none'],
            lineStyle: {
              color: '#2F88ff',
              type: 'dashed',
              width: 2,
            },
            label: {
              formatter: (deviation * 100).toFixed(2) + '%',
              position: 'middle',
              fontSize: 14,
            },
            data: [{ yAxis: deviation }],
          },
          data: [],
        },
        {
          name: '试航报告基准线',
          type: 'line',
          markLine: {
            silent: true,
            symbol: ['none', 'none'],
            lineStyle: {
              color: '#0fff0f',
              type: 'dashed',
              width: 2,
            },
            label: {
              formatter: '',
              position: 'middle',
              fontSize: 14,
            },
            data: [{ yAxis: 0 }],
          },
          data: [],
        },
        // {
        //   name: 'after Deviation',
        //   type: 'line',
        //   markLine: {
        //     silent: true,
        //     lineStyle: {
        //       color: '#88ff00',
        //       type: 'dashed',
        //       width: 2,
        //     },
        //     label: {
        //       formatter: '距上次船体清洁平均速度损失',
        //       position: 'middle',
        //       fontSize: 14,
        //     },
        //     data: [
        //       { yAxis: after_deviation }, // 10% threshold line
        //     ],
        //   },
        //   data: [],
        // },
      ],
    };

    option && myChart.setOption(option);
  },

  //状态提醒折现图
  initLine1() {
    const chartDom = document.getElementById('chart5');

    const myChart = echarts.init(chartDom);
    let option;

    option = {
      title: {
        text: 'Stacked Line',
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine'],
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      toolbox: {
        feature: {
          saveAsImage: {},
        },
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: 'Email',
          type: 'line',
          stack: 'Total',
          data: [120, 132, 101, 134, 90, 230, 210],
        },
        {
          name: 'Union Ads',
          type: 'line',
          stack: 'Total',
          data: [220, 182, 191, 234, 290, 330, 310],
        },
        {
          name: 'Video Ads',
          type: 'line',
          stack: 'Total',
          data: [150, 232, 201, 154, 190, 330, 410],
        },
        {
          name: 'Direct',
          type: 'line',
          stack: 'Total',
          data: [320, 332, 301, 334, 390, 330, 320],
        },
        {
          name: 'Search Engine',
          type: 'line',
          stack: 'Total',
          data: [820, 932, 901, 934, 1290, 1330, 1320],
        },
      ],
    };
    option && myChart.setOption(option);
  },

  //优化建议折线图
  initLine(data) {
    var chartDom = document.getElementById('chart1');
    var myChart = echarts.init(chartDom);
    var option;
    let speedData = data.map(e => e.speed_water);
    let consumptionData = data.map(e => e.consumption);
    let ciiData = data.map(e => e.cii);
    option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line',
          axis: 'x',
          lineStyle: {
            color: '#1286F1',
          },
        },
      },

      xAxis: [
        {
          // show: false,
          type: 'category',
          data: speedData,
          name: '对水航速(km/nmile)',
          nameLocation: 'middle',
          nameGap: 30,
          nameTextStyle: {
            fontSize: 16,
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: '每海里油耗(kg)',
          nameLocation: 'middle',
          nameGap: 30,
          nameTextStyle: {
            fontSize: 16,
          },
          scale: true,
          min: function (value) {
            return Math.floor(value.min * 0.9); // Start from 90% of the minimum value
          },
        },
        {
          alignTicks: true,
          type: 'value',
          name: 'CII',
          nameLocation: 'middle',
          nameGap: 30,
          nameTextStyle: {
            fontSize: 16,
          },
          scale: true,
          axisLabel: {
            formatter: function (value) {
              return value.toFixed(2); // Limit to 2 decimal places
            },
          },
          min: function (value) {
            return Math.floor(value.min * 0.9); // Start from 90% of the minimum value
          },
          max: function (value) {
            return Math.floor(value.max * 1.5);
          },
        },
      ],

      series: [
        {
          name: '',
          type: 'line',
          data: consumptionData,
          // showSymbol: false,
          label: {
            show: true,
            position: 'top',
          },
        },

        {
          name: '',
          type: 'line',
          yAxisIndex: 1,
          data: ciiData,
          // showSymbol: false,
          label: {
            show: true,
            position: 'top',
          },
        },
      ],
    };

    option && myChart.setOption(option);
  },

  //CII 走势图
  initCii(data) {
    var chartDom = document.getElementById('chartBox');
    var myChart = echarts.init(chartDom);

    // 提取日期与 CII 数据
    let xData = data.map(e => e.date);
    let ciiData = data.map(e => parseFloat(e.cii));
    let cii_tempData = data.map(e => parseFloat(e.cii_temp));

    // 提取阈值（所有数据一致，取第一个即可）
    let { inferior, upper, lower, superior } = data[0];
    inferior = parseFloat(inferior);
    upper = parseFloat(upper);
    lower = parseFloat(lower);
    superior = parseFloat(superior);

    // 自动计算Y轴范围（向上和向下各扩展10%，并保留两位小数）
    let allValues = ciiData.concat(cii_tempData);
    let minY = Math.min(...allValues);
    let maxY = Math.max(...allValues);
    let yMargin = (maxY - minY) * 0.1;
    minY = parseFloat((minY - yMargin).toFixed(2));
    maxY = parseFloat((maxY + yMargin).toFixed(2));

    const option = {
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: [
          {
            name: 'Attained CII',
            icon: 'path://M802.59 532.76H221.4c-11.47 0-20.76-9.3-20.76-20.76s9.29-20.76 20.76-20.76h581.19c11.47 0 20.76 9.3 20.76 20.76s-9.29 20.76-20.76 20.76z',
            itemStyle: {
              color: '#3ebb6e',
            },
          },
          {
            name: '即时CII',
            icon: 'path://M934.4 490.666667h-51.2a25.6 25.6 0 1 0 0 51.2h51.2a25.6 25.6 0 1 0 0-51.2zM115.2 490.666667h-34.133333a25.6 25.6 0 1 0 0 51.2h34.133333a25.6 25.6 0 1 0 0-51.2zM388.266667 490.666667h-51.2a25.6 25.6 0 1 0 0 51.2h51.2a25.6 25.6 0 1 0 0-51.2zM251.733333 490.666667h-51.2a25.6 25.6 0 1 0 0 51.2h51.2a25.6 25.6 0 1 0 0-51.2zM524.8 490.666667h-51.2a25.6 25.6 0 1 0 0 51.2h51.2a25.6 25.6 0 1 0 0-51.2zM797.866667 490.666667h-51.2a25.6 25.6 0 1 0 0 51.2h51.2a25.6 25.6 0 1 0 0-51.2zM661.333333 490.666667h-51.2a25.6 25.6 0 1 0 0 51.2h51.2a25.6 25.6 0 1 0 0-51.2z',
            itemStyle: {
              color: '#3ebb6e',
            },
          },
        ],
        textStyle: {
          fontSize: 15,
        },
      },
      grid: {
        left: '10%',
        right: '15%',
        bottom: '20%',
      },
      xAxis: {
        type: 'category',
        data: xData,
        name: '日期',
        nameLocation: 'middle',
        nameGap: 30,
        nameTextStyle: {
          fontSize: 16,
        },
      },
      yAxis: {
        type: 'value',
        name: 'CII',
        min: minY,
        max: maxY,
        nameLocation: 'middle',
        nameRotate: 90,
        nameGap: 30,
        nameTextStyle: {
          fontSize: 16,
        },
      },
      visualMap: {
        type: 'piecewise',
        top: 50,
        right: 10,
        show: true,
        pieces: [
          {
            gt: inferior,
            color: '#f36200',
            label: `E: > ${inferior.toFixed(2)}`,
          },
          {
            gt: upper,
            lte: inferior,
            color: '#f7b800',
            label: `D: (${upper.toFixed(2)} - ${inferior.toFixed(2)}]`,
          },
          {
            gt: lower,
            lte: upper,
            color: '#fcec00',
            label: `C: (${lower.toFixed(2)} - ${upper.toFixed(2)}]`,
          },
          {
            gt: superior,
            lte: lower,
            color: '#a7df01',
            label: `B: (${superior.toFixed(2)} - ${lower.toFixed(2)}]`,
          },
          {
            lte: superior,
            color: '#3ebb6e',
            label: `A: ≤ ${superior.toFixed(2)}`,
          },
        ],
        outOfRange: {
          color: '#999',
        },
        calculable: false,
      },
      series: [
        {
          name: 'Attained CII',
          type: 'line',
          smooth: true,
          data: ciiData.map(v => v.toFixed(2)),
          lineStyle: {
            width: 2,
          },
        },
        {
          name: '即时CII',
          type: 'line',
          smooth: true,
          data: cii_tempData.map(v => v.toFixed(2)),
          lineStyle: {
            type: 'dotted',
            width: 2,
          },
        },
      ],
    };

    option && myChart.setOption(option);
  },
};

export default tools;
