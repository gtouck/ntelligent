<template>
  <div class="energy">
    <div class="search_head flex-row align-start">
      <div class="search_left flex-row align-center">
        <p>油品种类</p>
        <el-select v-model="fuelType">
          <el-option
            v-for="item in fuelTypeCategoryArr"
            :key="item.value"
            :label="item.label"
            :value="item.value"></el-option>
        </el-select>
      </div>
      <div class="search_left flex-row align-center ml26">
        <p>能耗种类</p>
        <el-select v-model="energyType">
          <el-option value="总油耗">总油耗</el-option>
          <el-option value="每海里油耗">每海里油耗</el-option>
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
            clearable="false"
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

          <span>{{ fuelName }}能耗统计</span>
        </div>
      </div>
      <div class="echart_box">
        <div id="myBar"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import * as echarts from 'echarts';
import { ElMessage } from 'element-plus';
import * as apis from '@/fetch/apis.js';
import { useFuelTypeCategory } from '@/hooks/useCommon.js';
const store = useStore();
const { fuelTypeCategoryArr } = useFuelTypeCategory();
const fuelType = ref('hfo'); // 油品种类
const energyType = ref('总油耗'); //能耗类型
let option; // 图表配置选项
const shipArr = ref([
  {
    ship: store.state.selectShip || 1,
    startDate: '2023-01-01',
    endDate: '2023-01-31',
  },
]);

onMounted(() => {
  getData();
});

const getData = async () => {
  // 初始化图表配置
  initOption();

  // 遍历所有选项
  for (let index = 0; index < shipArr.value.length; index++) {
    const item = shipArr.value[index];

    if (new Date(item.startDate).getTime() > new Date(item.endDate).getTime()) {
      ElMessage.error('开始时间不能大于结束时间');
      return;
    }

    if (!item.ship) {
      ElMessage.error('请选择船舶');
      return;
    }

    let param = {
      fuel_type: fuelType.value,
      vessel_id: item.ship,
      start_date: item.startDate,
      end_date: item.endDate,
    };

    let res =
      energyType.value == '总油耗'
        ? await apis.consumptionTotal(param)
        : await apis.consumptionNmile(param);

    if (res.code != 200) continue;

    const shipName = data.value.filter(v => v.id == item.ship)[0]?.name || '';
    const seriesName = `选项${index + 1}-${shipName}`;

    initBar(res.data, seriesName, index);
  }
};

const initOption = () => {
  option = {
    grid: {
      bottom: 40,
      left: 100,
    },
    title: {},
    color: ['#1a88ee', '#20c563', '#ff7c7c', '#9c27b0', '#ff9800', '#4caf50'],
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        let result = '';
        params.forEach(param => {
          const value = param.value;
          if (value > 0) {
            result += `${param.seriesName}: ${value}<br/>`;
          }
        });
        return result || '';
      },
    },
    legend: {
      data: [],
      right: 20,
      orient: 'vertical',
    },
    xAxis: [
      {
        data: ['全船', '主机', '副机', '锅炉'],
        position: 'bottom',
        axisTick: {
          show: false,
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
        name: '',
        nameLocation: 'middle',
        nameRotate: '90',
        nameTextStyle: {
          fontSize: 12,
        },
        nameGap: 70,
      },
    ],
    series: [],
  };
};

const initBar = (data, seriesName, index) => {
  const { total, me, dg, blr } = data;
  const myChart = echarts.init(document.getElementById('myBar'));
  const unitName = energyType.value === '总油耗' ? '吨' : 'kg/nmile';

  // 更新Y轴名称
  option.yAxis[0].name = `${energyType.value}(${unitName})`;

  // 添加图例
  option.legend.data.push(seriesName);

  // 创建系列数据
  const seriesData = [
    returnToFixed(total),
    returnToFixed(me),
    returnToFixed(dg),
    returnToFixed(blr),
  ].map(value => ({
    value: value >= 0 ? value : 0,
    itemStyle: {
      color: value >= 0 ? option.color[index % option.color.length] : 'rgba(0,0,0,0)',
    },
    label: {
      show: true,
      position: 'top',
      formatter: value >= 0 ? '{c}' : '数据异常\n消耗量为负值\n需检查',
      color: value >= 0 ? '#000' : option.color[index % option.color.length],
      fontSize: value >= 0 ? 12 : 14,
      distance: value >= 0 ? 5 : 5,
      align: 'center',
      verticalAlign: 'bottom',
    },
  }));

  const seriesObj = {
    name: seriesName,
    type: 'bar',
    data: seriesData,
    barWidth: '20%',
  };

  option.series.push(seriesObj);
  myChart.setOption(option);
};

const returnToFixed = num => {
  return Math.round(num * 100) / 100;
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
  });
};

const fuelName = computed(() => {
  const name = fuelTypeCategoryArr.filter(e => e.value == fuelType.value)[0]?.label;
  return name || '';
});

const data = computed(() => store.state.shipArr);
</script>

<style lang="less" scoped src="./index.less"></style>
