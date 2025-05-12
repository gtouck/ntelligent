<template>
  <div class="optimize_box">
    <div class="box_head">
      <el-tabs
        v-model="activeName"
        class="demo-tabs"
        @tab-click="handleClick">
        <el-tab-pane
          label="航速优化"
          :name="0"></el-tab-pane>
        <el-tab-pane
          label="吃水差优化"
          :name="1"></el-tab-pane>
        <el-tab-pane
          label="燃料替代计算"
          :name="2"></el-tab-pane>
        <el-tab-pane
          label="CIl计算器"
          :name="3"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="pane_box">
      <div class="search_box flex-row align-center">
        <p class="lebal_text">时间期间</p>
        <el-date-picker
          v-model="startDate"
          value-format="YYYY-MM-DD"
          clearable="false"
          type="date"
          placeholder="请选择"
          :size="size" />
        <span class="lebal_text">-</span>
        <el-date-picker
          v-model="endDate"
          clearable="false"
          value-format="YYYY-MM-DD"
          type="date"
          placeholder="请选择"
          :size="size" />

        <p
          class="btn_color"
          @click="search">
          搜索
        </p>
        <el-button class="add_btn">
          <img src="@/assets/export.png" />
          添加至报告
        </el-button>
      </div>
      <div class="result_box flex-row align-center">
        <!-- <div>
          <span class="lebal">总油耗 (tonne)</span>
          <span class="value">{{ gross_ton }}</span>
        </div>
        <span class="line" /> -->
        <div>
          <span class="lebal">平均每海里油耗 (tonne)</span>
          <span class="value">{{ gross_ton }}</span>
        </div>
        <span class="line" />
        <div>
          <span class="lebal">当前平均船速</span>
          <span class="value">{{ speed_water }}</span>
        </div>
        <span class="line" />
        <div>
          <span class="lebal FontAdd">CII</span>
          <span class="value">{{ cii }}</span>
        </div>
        <span class="line" />
        <div>
          <span class="lebal">CII评级</span>
          <div>
            <span class="colorVlue">{{ cii_rating }}</span>
          </div>
        </div>
      </div>
      <div class="data_box">
        <div class="data_head flex-row align-center justify-between">
          <div class="head_left flex-row align-center">
            <div class="flex-row align-center justify-center btn_color">
              <img src="@/assets/dateIcon.png" />
            </div>

            <span>根据不同的对水航速预测的对应油耗和CII</span>
          </div>
          <div class="head_right flex-row align-center">
            <div
              v-for="item in iconArr"
              :key="item.id"
              :class="{ active: item.id == selectType }"
              @click="selectType = item.id">
              <img :src="item.id == selectType ? item.activeIcon : item.icon" />
            </div>
            <!--  -->
          </div>
        </div>
        <div
          v-if="selectType == 'table'"
          class="date">
          <el-table
            v-if="selectType == 'table'"
            :data="tableData"
            stripe
            size="large"
            max-height="400px">
            <el-table-column
              label="序号"
              align="center"
              type="index" />
            <el-table-column
              prop="speed_water"
              align="center"
              label="年均对水航速" />
            <el-table-column
              prop="delta"
              align="center"
              label="对水航速差值" />
            <el-table-column
              prop="consumption"
              align="center"
              label="年均主机每海里消耗" />
            <el-table-column
              prop="gross_ton"
              align="center"
              label="节省燃料" />

            <el-table-column
              prop="cii"
              label="CII"
              align="center" />
            <el-table-column
              prop="grade"
              align="center"
              label="CII评级">
              <template #default="scope">
                <span
                  :class="{
                    green: scope.row.grade == 'A',
                    black: scope.row.grade == 'B',
                    red: scope.row.grade == 'C',
                  }">
                  {{ scope.row.grade }}
                </span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div
          v-if="selectType == 'echart'"
          class="echart_box">
          <div id="chart1"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useStore } from 'vuex';
import * as echarts from 'echarts';
import * as apis from '@/fetch/apis.js';
import tools from '@/utils/tools';
import { ElMessage } from 'element-plus';
import TableIcon from '@/assets/tableIcon.png';
import TableIconActive from '@/assets/tableIconActive.png';
import EchartchartIcon from '@/assets/echartIcon.png';
import EchartchartIconActive from '@/assets/echartIconActive.png';

const store = useStore();

const gross_ton = ref(0);
const cii = ref(0);
const cii_rating = ref('');
const speed_water = ref(0);

const startDate = ref('2023-01-01');
const endDate = ref('2023-01-31');
const activeName = ref(0);
const selectType = ref('echart');
const tableData = ref([]);
const iconArr = [
  {
    id: 'echart',
    icon: EchartchartIcon,
    activeIcon: EchartchartIconActive,
  },
  {
    id: 'table',
    icon: TableIcon,
    activeIcon: TableIconActive,
  },
];

onMounted(() => {});

const search = () => {
  //optimizationFigure();
  const shipId = store.state.selectShip;
  optimizationValues();
};

watch(
  selectType,
  newValue => {
    if (newValue == 'table') {
    } else {
      tools.initLine(tableData.value);
    }
  },
  { flush: 'post' },
);

const optimizationFigure = async shipId => {
  if (new Date(startDate.value).getTime() > new Date(endDate.value).getTime()) {
    ElMessage.error('开始时间不能大于结束时间');
    return;
  }
  const param = {
    vessel_id: shipId,
    start_date: startDate.value,
    end_date: endDate.value,
  };
  let res = await apis.optimizationFigure(param);
  if (res.code != 200) return;
  tableData.value = res.data;
  tools.initLine(res.data);
};

const optimizationValues = async vessel_id => {
  if (new Date(startDate.value).getTime() > new Date(endDate.value).getTime()) {
    ElMessage.error('开始时间不能大于结束时间');
    return;
  }
  const param = { start_date: startDate.value, end_date: endDate.value, vessel_id };
  let res = await apis.optimizationValues(param);
  if (res.code != 200) return;

  const newData = res.data.map(e => {
    return {
      speed_water: e['年均对水航速'].toFixed(2),
      grade: e['CII评级'],
      cii: e['CII'].toFixed(2),
      gross_ton: e['节省燃料'].toFixed(2),
      consumption: e['年均主机每海里油耗'].toFixed(2),
      delta: e['对水航速差值'].toFixed(2),
    };
  });

  console.log('newData', newData);

  tableData.value = newData;
  tools.initLine(newData);
  const obj = newData[5];

  speed_water.value = obj.speed_water;
  cii_rating.value = obj.grade;
  cii.value = obj.cii;
  gross_ton.value = obj.gross_ton;
};
watch(
  () => store.state.selectShip,
  newValue => {
    if (newValue) {
      optimizationValues(newValue);
      // optimizationFigure(newValue);
    }
  },
  { immediate: true },
);
</script>

<style lang="less" scoped src="./index.less"></style>
