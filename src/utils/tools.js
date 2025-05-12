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
              return [100 - params.value + '%', '{b|额外功率}'].join('\n');
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
              return [100 - params.value + '%', '{b|额外功率}'].join('\n');
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

    option = {
      dataset: {
        source: [
          ['index', 'data', 'name'],
          [0, day3, '距船体重喷漆已'],
          [0, day2, '距上次船体清洁已'],
          [0, day1, '上次螺旋桨抛光距今 '],
        ],
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
            formatter: '{@[1]}月',
            color: '#1286F1',
            position: 'right',
            fontSize: '.06rem',
          },
          itemStyle: {
            color: '#1286F1',
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
  initEcStat1(data) {
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
        // {
        //   source: data2,
        // },
        // {
        //   transform: {
        //     type: 'ecStat:regression',
        //     fromDatasetIndex: 0,

        //     config: {
        //       method: 'exponential',
        //       // 'end' by default
        //       // formulaOn: 'start'
        //     },
        //   },
        // },
        // {
        //   transform: {
        //     type: 'ecStat:regression',
        //     fromDatasetIndex: 1,
        //     print: true,
        //     config: {
        //       method: 'exponential',
        //       // 'end' by default
        //       // formulaOn: 'start'
        //     },
        //   },
        // },
      ],
      title: {},

      xAxis: {
        type: 'category',
        name: '时间',
        boundaryGap: false,
        nameLocation: 'middle',
        nameGap: 30,
        nameTextStyle: {
          fontSize: 16,
        },
        // min: value => {
        //   return Math.floor(value.min) - 1;
        // },
        // splitLine: {
        //   lineStyle: {
        //     type: 'dashed',
        //   },
        // },
      },
      yAxis: {
        show: true,
        name: '速度损失率',
        nameLocation: 'middle',
        nameRotate: 90,
        nameTextStyle: {
          fontSize: 16,
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
      },
      series: [
        {
          type: 'scatter',
          datasetIndex: 0,
          itemStyle: {
            color: '#1a88ee',
          },
          data: data1,
        },
        // {
        //   type: 'scatter',
        //   datasetIndex: 1,
        //   itemStyle: {
        //     color: '#20c563',
        //   },
        //   data: data2,
        // },
        // {
        //   type: 'line',
        //   smooth: false,
        //   datasetIndex: 2,
        //   symbolSize: 0.1,
        //   symbol: 'circle',
        //   lineStyle: {
        //     color: '#1a88ee',
        //   },
        // },
        // {
        //   type: 'line',
        //   smooth: true,
        //   datasetIndex: 3,
        //   symbolSize: 0.1,
        //   symbol: 'circle',
        //   lineStyle: {
        //     color: '#20c563',
        //   },
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
          name: '每海里油耗(kg/nmile)',
          nameLocation: 'middle',
          nameGap: 30,
          nameTextStyle: {
            fontSize: 16,
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
        },
      ],

      series: [
        {
          name: '',
          type: 'line',
          data: consumptionData,
          showSymbol: false,
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
          showSymbol: false,
          label: {
            show: true,
            position: 'top',
          },
        },
      ],
    };

    option && myChart.setOption(option);
  },

  initCii(data) {
    var chartDom = document.getElementById('chartBox');
    var myChart = echarts.init(chartDom);
    let xData = data.map(e => e.date);
    let ciiData = data.map(e => parseFloat(e.cii).toFixed(2)); // 保留两位小数
    let cii_tempData = data.map(e => parseFloat(e.cii_temp).toFixed(2)); // 保留两位小数
    var option;

    option = {
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['Attained CII', '即时CII'],
        textStyle: {
          fontSize: 16,
        },
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
        name: 'CII',
        type: 'value',
        nameLocation: 'middle',
        nameRotate: 90,
        nameGap: 30,
        nameTextStyle: {
          fontSize: 16,
        },
      },
      series: [
        {
          name: 'Attained CII',
          data: ciiData,
          type: 'line',
          smooth: true,
          // showSymbol: false,
        },
        {
          name: '即时CII',
          data: cii_tempData,
          type: 'line',
          smooth: true,
          // showSymbol: false,
        },
      ],
    };

    option && myChart.setOption(option);
  },
};

export default tools;
