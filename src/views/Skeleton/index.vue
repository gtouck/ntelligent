<template>
  <div class="main_box">

    <Head />
    <div class="main_head flex-row align-center">
      <img src="@/assets/mainShip.png" />
      <p class="company_name">{{ companyInfo.name }}</p>
      <el-select v-model="selectShip">
        <el-option v-for="item in shipArr" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </div>
    <div class="container flex-row">
      <div class="container_left">
        <div v-for="item in menuArr" :key="item.title" :class="{ active: currentPage == item.path }"
          class="align-center flex-row" @click="toPage(item)">
          <img :src="currentPage == item.path ? item.selectIcon : item.icon" />
          <span>{{ item.title }}</span>
        </div>
      </div>
      <div class="container_right">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';
import * as apis from '@/fetch/apis.js';

import Head from '@/components/Head.vue';
import Index from '@/assets/index.png';
// 优化
import Youhua from '@/assets/youhua.png';
import YouhuaActive from '@/assets/youhuaActive.png';
// 统计
import Tongji from '@/assets/tongji.png';
import TongjiActive from '@/assets/tongjiActive.png';
// 提醒
import Tixing from '@/assets/tixing.png';
import TixingActive from '@/assets/tixingActive.png';
// 能效
import Nengxiao from '@/assets/nengxiao.png';
import NengxiaoActive from '@/assets/nengxiaoActive.png';
// 回放
import Huifang from '@/assets/huifang.png';
import HuifangActive from '@/assets/huifangActive.png';

const router = useRouter();
const route = useRoute();
const store = useStore();

const menuArr = [
  {
    title: '首页',
    icon: Index,
    path: '/home',
  },
  {
    title: '优化建议',
    icon: Youhua,
    path: '/optimize',
    selectIcon: YouhuaActive,
  },
  {
    title: '状态提醒',
    icon: Tixing,
    path: '/statusRemind',
    selectIcon: TixingActive,
  },
  {
    title: '能耗统计',
    icon: Tongji,
    path: '/energy',
    selectIcon: TongjiActive,
  },
  {
    title: '数据分布与回放',
    icon: Huifang,
    path: '/analysis',
    selectIcon: HuifangActive,
  },
  {
    title: '能效多角度展示',
    icon: Nengxiao,
    path: '/efficiency',
    selectIcon: NengxiaoActive,
  },
];

const currentPage = computed(() => route.path);
const userInfo = computed(() => store.state.userInfo);
const shipArr = computed(() => store.state.shipArr);

const companyInfo = computed(() => store.state.companyInfo);
const selectShip = computed(() => store.state.selectShip);

const toPage = item => {
  if (!item.path) return;
  router.push(item.path);
};
</script>

<style lang="less" scoped src="./index.less"></style>
