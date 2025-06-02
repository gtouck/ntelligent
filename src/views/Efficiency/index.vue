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
          <p>选项{{ index + 1 }}</p>
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
            @click="delShip(index)" />
        </div>
      </div>

      <img
        src="@/assets/addIcon.png"
        class="addIcon"
        @click="addShip" />

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
import { ref, onMounted, computed, watch } from 'vue';
import * as echarts from 'echarts';
import { ElMessage } from 'element-plus';
import ecStat from 'echarts-stat';
import * as apis from '@/fetch/apis.js';
import { useStore } from 'vuex';
import { useAttributesMap, useUserInfo } from '@/hooks/useCommon.js';
import { calculateR2 } from '@/utils/cacl';

const store = useStore();
const { attributeMappingArr } = useAttributesMap();

const selectMapping = ref(attributeMappingArr[0].value);
let option; // 图表配置
const colors = ['#1a88ee', '#20c563', '#ff7c7c', '#9c27b0', '#ff9800', '#4caf50'];

const shipArr = ref([
  {
    ship: store.state.selectShip || 1,
    startDate: '2023-01-01',
    endDate: '2023-01-31',
    slipRatio: [-20, 20],
  },
]);

onMounted(() => {
  getData();
});

const getData = async () => {
  if (!selectMapping.value) {
    return ElMessage.error('请选择属性组合');
  }

  // 清空并重新初始化图表配置
  const chartDom = document.getElementById('myBar');
  const myChart = echarts.init(chartDom);
  myChart.clear(); // 清空之前的配置

  // 初始化图表配置
  initOption();

  // 遍历所有选项
  for (let index = 0; index < shipArr.value.length; index++) {
    const ship = shipArr.value[index];

    if (!ship.ship) {
      ElMessage.error(`请选择选项${index + 1}的船舶`);
      return;
    }

    if (new Date(ship.startDate).getTime() > new Date(ship.endDate).getTime()) {
      ElMessage.error(`选项${index + 1}的开始时间不能大于结束时间`);
      return;
    }

    const param = {
      attribute_name1: selectMapping.value.split('-')[0],
      attribute_name2: selectMapping.value.split('-')[1],
      vessel_id: ship.ship,
      start_date: ship.startDate,
      end_date: ship.endDate,
      min_slip_ratio: ship.slipRatio[0],
      max_slip_ratio: ship.slipRatio[1],
    };

    let res = await apis.attributeRelation(param);
    if (res.code != 200) continue;

    const shipName = data.value.filter(v => v.id == ship.ship)[0]?.name || '';
    const seriesName = `选项${index + 1}-${shipName}`;

    addDataSeries(res.data, seriesName, index);
  }

  // 应用最终配置
  myChart.setOption(option);
};

const initOption = () => {
  const nameArr = selectMapName.value.split('-');
  option = {
    title: {},
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },
    legend: {
      data: [],
      right: 20,
      orient: 'vertical',
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
    series: [],
    graphic: [],
  };
};

const addDataSeries = (data, seriesName, index) => {
  const processedData = data.map(e => [e.value1, e.value2]);
  const color = colors[index % colors.length];

  // 计算回归线
  const myRegression = ecStat.regression('polynomial', processedData, 2);
  const r2 = calculateR2(myRegression.parameter, processedData);

  // 添加图例
  option.legend.data.push(seriesName);

  // 添加散点图系列
  option.series.push({
    name: seriesName,
    type: 'scatter',
    itemStyle: {
      color: color,
    },
    data: processedData,
  });

  // 添加回归线系列
  option.series.push({
    name: `${seriesName}-回归线`,
    type: 'line',
    smooth: false,
    symbolSize: 0.1,
    symbol: 'circle',
    lineStyle: {
      color: color,
      type: 'dashed',
    },
    data: myRegression.points,
    showInLegend: false,
  });

  // 添加回归方程显示 - 优化布局以避免重叠
  const totalOptions = shipArr.value.length;
  let left, top;

  // 根据选项数量动态调整位置
  if (totalOptions <= 3) {
    // 3个或更少时垂直排列在左侧
    left = 'left';
    top = 5 + index * 10 + '%';
  } else {
    // 超过3个时分两列排列
    const column = Math.floor(index / 3);
    const row = index % 3;
    left = column === 0 ? 'left' : 'center';
    top = 5 + row * 10 + '%';
  }

  option.graphic.push({
    type: 'text',
    z: 100,
    left: left,
    top: top,
    style: {
      text: `${seriesName}: ${myRegression.expression}, R²: ${r2.toFixed(4)}`,
      fontSize: totalOptions > 4 ? 12 : 14, // 选项多时减小字体
      fontFamily: 'Arial',
      fontWeight: 'normal',
      fill: color,
      backgroundColor: 'rgba(255,255,255,0.8)',
      padding: [3, 6],
      borderRadius: 3,
      shadowColor: 'rgba(0,0,0,0.1)',
      shadowBlur: 2,
    },
  });
};

const delShip = index => {
  if (shipArr.value.length <= 1) {
    ElMessage.warning('至少需要保留一个选项');
    return;
  }
  shipArr.value.splice(index, 1);
};

const addShip = () => {
  shipArr.value.push({
    ship: '',
    startDate: '2023-01-01',
    endDate: '2023-01-31',
    slipRatio: [-20, 20],
  });
};

const selectMapName = computed(() => {
  const data = attributeMappingArr.filter(e => e.value == selectMapping.value)[0]?.name;
  return data || '';
});

const data = computed(() => store.state.shipArr);
</script>

<style lang="less" scoped src="./index.less"></style>
