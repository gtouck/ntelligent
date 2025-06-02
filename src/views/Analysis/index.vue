<template>
  <div class="analysis">
    <div class="search_head flex-row align-start">
      <div class="search_left flex-row align-center">
        <p>属性</p>
        <el-select v-model="selectAttr">
          <el-option
            v-for="item in attributesArr"
            :key="item.value"
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
            type="date" />
          <p class="lebal_text2">-</p>
          <el-date-picker
            v-model="item.endDate"
            value-format="YYYY-MM-DD"
            type="date" />
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
          <span>{{ selectAttrName }}分布对比图</span>
        </div>
        <div class="head_right flex-row align-center">
          <span
            v-for="item in typeArr"
            :key="item.id"
            :class="{ active: selectId == item.id }"
            @click="selectId = item.id">
            {{ item.name }}
          </span>
        </div>
      </div>
      <div class="echart_box">
        <div
          v-if="selectId == 2"
          id="myBar"></div>
        <MapComponent v-if="selectId == 1" />
        <div
          v-if="selectId == 3"
          id="scatterBox"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';
import * as echarts from 'echarts';
import * as apis from '@/fetch/apis.js';
import { useAttributes, useUserInfo } from '@/hooks/useCommon.js';
import MapComponent from '@/components/MapComponent.vue';
import { formatter } from 'element-plus';
const store = useStore();
const { attributesArr } = useAttributes();

const selectAttr = ref(attributesArr[0].value);
const selectId = ref(2);
const typeArr = [
  {
    name: '地图模式',
    id: 1,
  },
  {
    name: '直方图模式',
    id: 2,
  },
  {
    name: '折线图模式',
    id: 3,
  },
];

const shipArr = ref([
  {
    ship: store.state.selectShip || 1,
    startDate: '2023-01-01',
    endDate: '2023-01-31',
    slipRatio: [-20, 20],
  },
]);

let option;
let scatterOption;
let scatterChart;

onMounted(() => {
  getData();
});

watch(
  selectId,
  newValue => {
    // 重置图表状态
    if (scatterChart) {
      scatterChart.dispose();
      scatterChart = null;
    }
    getData();
  },
  { flush: 'post' },
);

watch(
  selectAttr,
  () => {
    // 重置图表状态
    if (scatterChart) {
      scatterChart.dispose();
      scatterChart = null;
    }
    getData();
  },
  { flush: 'post' },
);

const getData = () => {
  initOption(); //初始化option
  initScatterOption(); //初始化散点图option
  shipArr.value.forEach(async (e, index) => {
    if (new Date(e.startDate).getTime() > new Date(e.endDate).getTime()) {
      ElMessage.error('开始时间不能大于结束时间');
      return;
    }
    if (!e.ship) {
      ElMessage.error('请选择船舶');
      return;
    }
    const param = {
      attribute_name: selectAttr.value,
      vessel_id: e.ship || 1,
      start_date: e.startDate,
      end_date: e.endDate,
      min_slip_ratio: e.slipRatio[0],
      max_slip_ratio: e.slipRatio[1],
    };
    let res;
    switch (selectId.value) {
      case 1:
        //地图模式
        break;
      case 2:
        //直方图
        res = await apis.attributeFrequencies(param);
        initBar(
          res.data,
          '选项' + (index + 1) + '-' + data.value.filter(v => v.id == e.ship)[0].name,
        );
        break;
      case 3:
        //散点图
        res = await apis.attributeValues(param);

        initScatter(
          res.data,
          '选项' + (index + 1) + '-' + data.value.filter(v => v.id == e.ship)[0].name,
        );
        break;

      default:
        break;
    }
  });
};

const initOption = () => {
  option = {
    title: {},
    color: ['#1a88ee', '#20c563', '#ff7c7c', '#9c27b0', '#ff9800', '#4caf50'],
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: [],
      right: 20,
      orient: 'vertical',
    },
    xAxis: [
      {
        name: '',
        data: [],
        nameLocation: 'middle',
        nameGap: 30,
        nameTextStyle: {
          fontSize: 16,
        },
      },
    ],
    yAxis: [
      {
        position: 'left',
        alignTicks: true,
        axisLine: {
          show: true,
        },
        axisLabel: {
          formatter: '{value}',
        },
        name: '频次',
        nameLocation: 'middle',
        nameRotate: '90',
        nameTextStyle: {
          fontSize: 16,
        },
        nameGap: 70,
      },
    ],
    series: [],
  };
};

const initScatterOption = () => {
  scatterOption = {
    title: {},
    color: ['#1a88ee', '#20c563', '#ff7c7c', '#9c27b0', '#ff9800', '#4caf50'],
    tooltip: {
      trigger: 'item',
      axisPointer: {
        type: 'cross',
      },
      formatter: function (params) {
        const date = new Date(params.value[0]);
        const formattedDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        return (
          params.seriesName +
          '<br/>' +
          formattedDate +
          '<br/>' +
          selectAttrName.value +
          ': ' +
          params.value[1]
        );
      },
    },
    legend: {
      data: [],
      right: 20,
      orient: 'vertical',
    },
    xAxis: {
      type: 'time',
      name: '日期',
      nameLocation: 'middle',
      nameGap: 30,
      nameTextStyle: {
        fontSize: 15,
      },
      axisLabel: {
        formatter: '{MM}-{dd}',
        fontSize: 10,
      },
      tooltip: {
        show: false,
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
        },
      },
    },
    yAxis: {
      name: selectAttrName.value + '(km/nmile)',
      nameLocation: 'middle',
      nameGap: 30,
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
  };
};

const initScatter = (data, name) => {
  data = data.map(e => [e.date, e.value]);
  const chartDom = document.getElementById('scatterBox');

  if (!scatterChart) {
    scatterChart = echarts.init(chartDom);
  }

  scatterOption.legend.data.push(name);
  scatterOption.yAxis.name = selectAttrName.value + '(km/nmile)';

  const seriesObj = {
    name: name,
    type: 'line',
    symbolSize: 5,
    data: data,
  };

  scatterOption.series.push(seriesObj);
  scatterChart.setOption(scatterOption);
};

const initBar = (data, name) => {
  //组装数据

  let valueArr = [];
  let frequencyArr = [];
  data.map(e => {
    valueArr.push(e.attribute_value);
    frequencyArr.push(e.frequency);
  });

  [...valueArr, ...option.xAxis[0].data].sort((a, b) => a - b);
  const myChart = echarts.init(document.getElementById('myBar'));
  option.legend.data.push(name);
  option.xAxis[0].data = valueArr;
  option.xAxis[0].name = selectAttrName.value;
  const seriesObj = {
    name: name,
    type: 'bar',
    data: frequencyArr,

    label: {
      show: true,
      position: 'top',
      formatter: '{c}',
    },
  };
  option.series.push(seriesObj);
  myChart.setOption(option);
};

const delShip = index => {
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

const selectAttrName = computed(() => {
  const name = attributesArr.filter(e => e.value == selectAttr.value)[0]?.name;
  return name || '';
});

const data = computed(() => store.state.shipArr);
</script>

<style lang="less" scoped src="./index.less"></style>
