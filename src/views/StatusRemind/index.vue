<template>
  <div class="statusRemind_box">
    <div class="box_head">
      <el-tabs
        v-model="activeName"
        class="demo-tabs">
        <el-tab-pane
          label="船体及螺旋桨状态"
          :name="0"></el-tab-pane>
        <el-tab-pane
          label="发动机状态"
          :name="1"></el-tab-pane>
      </el-tabs>
      <el-button
        class="add_btn"
        @click="capture">
        <img src="@/assets/export.png" />
        添加至报告
      </el-button>
    </div>
    <div
      ref="Refcanvas"
      class="canvas_box">
      <div class="box_content">
        <div class="content_left">
          <div class="title">
            <img src="@/assets/statusIcon.png" />
            <span>船体及螺旋桨脏污状态估计</span>
          </div>
          <div
            v-if="activeName == 0"
            class="bottom">
            <div class="leftChart">
              <span>与出厂状态相比</span>
              <div id="chart3"></div>
            </div>
            <div class="rightChart">
              <span>与上次维保后状态相比</span>
              <div id="chart4"></div>
            </div>
          </div>

          <div
            v-if="activeName == 1"
            class="bottom">
            <span class="span1">与发动机大修完状态相比</span>
            <div id="chart1"></div>
          </div>
        </div>
        <div class="content_right">
          <div class="title">
            <img src="@/assets/rightIcon.png" />
            <span>清洁保养记录</span>
          </div>
          <div class="bottom">
            <!-- <span class="span2">距上次发动机大修已</span> -->
            <div id="chart2"></div>
          </div>
        </div>
      </div>
      <div class="data_box">
        <div class="data_head flex-row align-center justify-between">
          <div class="head_left flex-row align-center">
            <div class="flex-row align-center justify-center btn_color">
              <img src="@/assets/dateIcon.png" />
            </div>
            <span>不同对水航速下参考期与评估期所需主机功率对比</span>
          </div>
        </div>
        <div id="chart5"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';

import * as apis from '@/fetch/apis.js';

import tools from '@/utils/tools';
import store from '@/store';

const Refcanvas = ref();
const activeName = ref(0);

// onMounted(() => {
//   const vessel_id = store.state.selectShip || 1;
//   // reminderValues(vessel_id);
//   reminderFigure(vessel_id);
// });

const reminderFigure = async vessel_id => {
  const param = {
    vessel_id,
  };
  let res = await apis.reminderFigure(param);
  if (res.code != 200) return;
  nextTick(() => {
    if (res.data.SpeedDeviation) {
      const data = res.data.SpeedDeviation.filter(item => {
        return item.speed_deviation <= 0;
      });
      tools.initEcStat1(data, res.data.Deviation, res.data.DeviationAfterHullClean);
    }
    if (res.data) {
      const {
        Deviation,
        DeviationAfterHullClean,
        hull_clean_date,
        newly_paint_date,
        propeller_polish_date,
      } = res.data;
      console.log(
        'Deviation',
        Deviation,
        'DeviationAfterHullClean',
        DeviationAfterHullClean,
        'hull_clean_date',
        hull_clean_date,
        'newly_paint_date',
        newly_paint_date,
        'propeller_polish_date',
        propeller_polish_date,
        Math.abs(Deviation * 100).toFixed(2),
      );

      tools.initPie3(Deviation);
      tools.initPie4(Math.abs(DeviationAfterHullClean * 100).toFixed(2));
      tools.initBar1({
        days_after_propeller_polishing: propeller_polish_date,
        days_after_clean: hull_clean_date,
        days_after_repaint: newly_paint_date,
      });
    }
  });
};
/*
监听当前选中船舶,当选中船舶发生改变时
调用reminderValues和reminderFigure方法
*/
watch(
  () => store.state.selectShip,
  newValue => {
    if (newValue) {
      // reminderValues(newValue);
      reminderFigure(newValue);
    }
  },
  { immediate: true },
);

//截图
const capture = async () => {
  const img = await tools.toCanvas();
};

watch(activeName, newValue => {
  if (newValue == 0) {
  } else {
  }
});
</script>

<style lang="less" scoped src="./index.less" />
