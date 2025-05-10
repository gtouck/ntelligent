<template>
  <div class="efficiency">
    <div class="search_head flex-row align-start">
      <div class="search_left flex-row align-center">
        <p>属性组合</p>
        <el-select v-model="selectMapping">
          <el-option
            v-for="(item, index) in attributeMappingArr"
            :key="index"
            :label="item.name"
            :value="item.value"></el-option>
        </el-select>
      </div>
      <div class="search-mid">
        <div
          v-for="(item, index) in shipArr"
          :key="index"
          class="ship_box flex-row align-center">
          <p>船舶{{ index + 1 }}</p>
          <el-select v-model="item.ship">
            <el-option
              v-for="v in data"
              :key="v.id"
              :label="v.name"
              :value="v.id"></el-option>
          </el-select>
          <p class="lebal_text1">时间期间</p>
          <el-date-picker
            v-model="item.startDate"
            value-format="YYYY-MM-DD"
            type="date"
            placeholder="请选择"
            :size="size" />
          <p class="lebal_text2">-</p>
          <el-date-picker
            v-model="item.endDate"
            value-format="YYYY-MM-DD"
            type="date"
            placeholder="请选择"
            :size="size" />
          <p class="lebal_text3">滑失比</p>
          <el-slider
            v-model="item.slipRatio"
            range
            show-stops
            :max="20"
            :min="-20" />

          <img
            class="close"
            src="@/assets/close.png"
            @click="delShip(index)"
            v-if="index != 0" />
        </div>
      </div>

      <!-- <img src="@/assets/addIcon.png" class="addIcon" @click="addShip" /> -->

      <el-button
        class="btn_color search_btn"
        @click="getData">
        搜索
      </el-button>
      <el-button class="add_btn">
        <img src="@/assets/export.png" />
        添加至报告
      </el-button>
    </div>
    <div class="data_box">
      <div class="data_head flex-row align-center justify-between">
        <div class="head_left flex-row align-center">
          <div class="flex-row align-center justify-center btn_color">
            <img src="@/assets/dateIcon.png" />
          </div>

          <span>{{ selectMapName ? selectMapName + '油耗' : '' }}关系图</span>
        </div>
      </div>
      <div class="echart_box">
        <div id="myBar"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import * as echarts from 'echarts';
import { ElMessage } from 'element-plus';
import ecStat from 'echarts-stat';
import * as apis from '@/fetch/apis.js';
import { useStore } from 'vuex';
import { useAttributesMap, useUserInfo } from '@/hooks/useCommon.js';

const store = useStore();
const { attributeMappingArr } = useAttributesMap();

const selectMapping = ref('');

const shipArr = ref([
  {
    ship: '',
    startDate: '2023-01-01',
    endDate: '2023-01-31',
    slipRatio: [-20, 20],
  },
]);

onMounted(() => {});

const getData = async () => {
  if (!selectMapping.value) {
    return ElMessage.error('请选择属性组合');
  }
  if (!shipArr.value[0].ship) {
    return ElMessage.error('请选择船舶');
  }

  if (
    new Date(shipArr.value[0].startDate).getTime() > new Date(shipArr.value[0].endDate).getTime()
  ) {
    ElMessage.error('开始时间不能大于结束时间');
    return;
  }

  const param = {
    attribute_name1: selectMapping.value.split('-')[0],
    attribute_name2: selectMapping.value.split('-')[1],
    vessel_id: shipArr.value[0].ship,
    start_date: shipArr.value[0].startDate,
    end_date: shipArr.value[0].endDate,
    min_slip_ratio: shipArr.value[0].slipRatio[0],
    max_slip_ratio: shipArr.value[0].slipRatio[1],
  };
  let res = await apis.attributeRelation(param);
  if (res.code != 200) return;
  initEchart(res.data);
};

const initEchart = data => {
  data = data.map(e => [e.value1, e.value2]);

  const chartDom = document.getElementById('myBar');
  const myChart = echarts.init(chartDom);
  let option;
  const nameArr = selectMapName.value.split('-');
  echarts.registerTransform(ecStat.transform.regression);
  option = {
    dataset: [
      {
        source: data,
      },
      // {
      //   source: data1,
      // },
      {
        transform: {
          type: 'ecStat:regression',
          fromDatasetIndex: 0,
          print: true,
          config: {
            // order: 2,
            method: 'polynomial',
            // 'end' by default
            formulaOn: 'start',
          },
        },
      },
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
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },

    xAxis: {
      name: nameArr[0],
      nameLocation: 'middle',
      nameGap: 30,
      nameTextStyle: {
        fontSize: 15,
      },
      min: value => {
        return Math.floor(value.min) - 1;
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
        },
      },
    },
    yAxis: {
      name: nameArr[1],
      nameLocation: 'middle',
      nameGap: 60,
      nameTextStyle: {
        fontSize: 15,
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
        },
      },
    },
    series: [
      {
        type: 'scatter',
        datasetIndex: 0,
        itemStyle: {
          color: '#1a88ee',
        },
        data: data,
      },
      // {
      //   type: 'scatter',
      //   datasetIndex: 1,
      //   itemStyle: {
      //     color: '#20c563',
      //   },
      //   data: data1,
      // },
      {
        type: 'line',
        smooth: false,
        datasetIndex: 1,
        symbolSize: 0.1,
        symbol: 'circle',
        lineStyle: {
          color: '#1a88ee',
        },
        // label: {
        //   show: true,
        //   position: ['50%', '10%'], // 放在图表中间偏上的位置
        //   formatter: function (params) {
        //     return params.value[2]; // 第三个值是回归方程
        //   },
        //   // backgroundColor: 'rgba(255,255,255,0.7)',
        //   padding: [4, 8],
        //   borderRadius: 4,
        //   distance: 10,
        //   align: 'center',
        //   fontSize: 14,
        //   color: '#333',
        // },
      },

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
    // 添加自定义图形元素用于显示公式
    graphic: [
      {
        type: 'text',
        z: 100,
        left: 'center',
        top: '5%',
        style: {
          text: '回归方程将在数据加载后显示',
          fontSize: 14,
          fontFamily: 'Arial',
          fontWeight: 'normal',
          fill: '#333',
          backgroundColor: 'rgba(255,255,255,0.7)',
          padding: [8, 12],
          borderRadius: 4,
        },
      },
    ],
  };

  option && myChart.setOption(option);
  // 数据加载完成后，更新公式显示
  myChart.on('rendered', function () {
    // 获取回归数据中的公式
    setTimeout(() => {
      const seriesData = myChart.getOption().series[1].data;
      if (seriesData && seriesData.length > 0) {
        // 找到包含公式的数据点
        const formulaPoint = seriesData.find(item => item[2] && typeof item[2] === 'string');
        if (formulaPoint && formulaPoint[2]) {
          console.log('公式', formulaPoint);
          // 更新graphic元素显示公式
          myChart.setOption({
            graphic: [
              {
                style: {
                  text: '回归方程: ' + formulaPoint[2],
                },
              },
            ],
          });
        }
      }
    }, 500); // 给一点延时确保数据已加载
  });
};

const delShip = index => {
  shipArr.value.splice(index, 1);
};

const addShip = () => {
  shipArr.value.push({ ship: '', startDate: '', endDate: '', slipRatio: [-20, 20] });
};

const selectMapName = computed(() => {
  const data = attributeMappingArr.filter(e => e.value == selectMapping.value)[0]?.name;
  return data || '';
});
console.log(selectMapName);

const data = computed(() => store.state.shipArr);
</script>

<style lang="less" scoped src="./index.less"></style>
