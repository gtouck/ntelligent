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
            class="bottom"
            v-if="activeName == 0">
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

import {} from '@/hooks/useCommon.js';
import tools from '@/utils/tools';
import store from '@/store';

const Refcanvas = ref();
const activeName = ref(0);

onMounted(() => {
  const vessel_id = store.state.selectShip || 1;
  reminderValues(vessel_id);
  reminderFigure(vessel_id);
});
const reminderValues = async vessel_id => {
  const param = {
    vessel_id,
  };
  let res = await apis.reminderValues(param);
  if (res.code != 200) return;
  const { power_increased_all, power_increased_since_repaint } = res.data;
  nextTick(() => {
    tools.initPie3(power_increased_all * 100);
    tools.initPie4(power_increased_since_repaint * 100);
    tools.initBar1(res.data);
  });
};

const reminderFigure = async vessel_id => {
  const param = {
    vessel_id,
  };
  let res = await apis.reminderFigure(param);
  if (res.code != 200) return;
  nextTick(() => {
    if (res.data.SpeedDeviation) {
      tools.initEcStat1(res.data.SpeedDeviation);
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
      reminderValues(newValue);
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
