<template>
  <div class="empty_box">
    <p class="empty_text">暂无船舶信息</p>
    <el-button
      class="btn_color add_btn"
      @click="addShip">
      立即新增船舶
    </el-button>

    <p class="introduce">船舶能效分析系统功能介绍</p>
    <span class="line"></span>
    <p class="introduce1">
      通过利用船舶传感器收集的历史能效数据，帮助船公司了解船舶各类能效状况并获取节能增效建议
    </p>
    <div class="item_box">
      <div
        v-for="item in funcData"
        :key="item.title">
        <div>
          <span class="item_title">{{ item.title }}</span>
        </div>
        <span>
          {{ item.text }}
        </span>
      </div>
    </div>
    <AddDialog ref="RefAddDialog" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import diqiuPng from '@/assets/diqiu.png';
import AddDialog from './addDialog.vue';

const funcData = [
  {
    title: '优化建议',
    imgSrc: diqiuPng,
    text: '聚焦油耗、CII、可替代能源等热点，不仅可以对上述指标进行计算，而且基于人工智能技术，面向更经济油耗及所需CII评级，给出航速、吃水差等方面优化建议。',
  },
  {
    title: '状态提醒',
    imgSrc: diqiuPng,
    text: '通过对比分析评估期和参考期内相关数据项之间的关系变化来推测评估期内发动机、船体以及螺旋桨的状态，并计算对应指标，若存在指标异常，则给出提醒。',
  },
  {
    title: '能耗统计',
    imgSrc: diqiuPng,
    text: '帮助您了解全船及船舶各设备在不同油品种类上、不同航行状态下的燃油消耗情况，并进行统计及可视化的展示，为所需报表提供素材及导出功能。',
  },
  {
    title: '数据分布与回放',
    imgSrc: diqiuPng,
    text: '帮助您用地图、柱状图和散点图等方式来回顾船舶某个数据项的值分布及变化情况。可供选择的数据项既包括船舶运行相关，也包括能耗相关的数据项。',
  },
  {
    title: '能效多角度展示',
    imgSrc: diqiuPng,
    text: '通过分析两数据项之间的关系来帮助您了解船舶的各类能效状况，如主机功率与航速之间的关系，可以通过散点图的形式进行展现，并将其拟合成一条曲线展示。',
  },
];

const RefAddDialog = ref(null);
const addShip = () => {
  RefAddDialog.value.change();
};
</script>

<style lang="less" scoped src="./index.less"></style>
