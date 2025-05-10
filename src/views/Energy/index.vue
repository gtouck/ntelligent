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
            clearable="false"
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
const energyType = ref(''); //能耗类型
const shipArr = ref([
  {
    ship: '',
    startDate: '2023-01-01',
    endDate: '2023-01-31',
  },
]);

onMounted(() => {});

const getData = async () => {
  if (
    new Date(shipArr.value[0].startDate).getTime() > new Date(shipArr.value[0].endDate).getTime()
  ) {
    ElMessage.error('开始时间不能大于结束时间');
    return;
  }
  let param = {
    fuel_type: fuelType.value,
    vessel_id: shipArr.value[0].ship,
    start_date: shipArr.value[0].startDate,
    end_date: shipArr.value[0].endDate,
  };

  let res =
    energyType.value == '总油耗'
      ? await apis.consumptionTotal(param)
      : await apis.consumptionNmile(param);
  if (res.code != 200) return;
  initBar(res.data);
  //全船：total,主机：me,副机：dg,锅炉：blr
};

const initBar = data => {
  const { total, me, dg, blr } = data;
  const myChart = echarts.init(document.getElementById('myBar'));

  const option = {
    title: {},
    color: ['#1a88ee', '#20c563'],
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
        data: ['全船', '主机', '副机', '锅炉'],
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
        name: `${energyType.value}(吨)`,
        nameLocation: 'middle',
        nameRotate: '90',
        nameTextStyle: {
          fontSize: 12,
        },
        nameGap: 70,
      },
    ],
    series: [
      {
        type: 'bar',
        data: [returnToFixed(total), returnToFixed(me), returnToFixed(dg), returnToFixed(blr)],
        barWidth: '20%',
        label: {
          show: true,
          position: 'top',
          formatter: '{c}',
        },
      },
    ],
  };

  myChart.setOption(option);
};

const returnToFixed = num => {
  return Math.round(num * 100) / 100;
};

const delShip = index => {
  shipArr.value.splice(index, 1);
};

const addShip = () => {
  shipArr.value.push({ ship: '', startDate: '', endDate: '' });
};

const fuelName = computed(() => {
  const name = fuelTypeCategoryArr.filter(e => e.value == fuelType.value)[0]?.label;
  return name || '';
});

const data = computed(() => store.state.shipArr);
</script>

<style lang="less" scoped src="./index.less"></style>
