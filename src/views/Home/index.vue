<template>
  <div class="home-page">
    <Head />
    <div class="container">
      <div class="title_box">
        <p class="home_title">{{ companyInfo.name }}</p>
        <div class="info_box">
          <div>
            <img src="@/assets/diqiu.png" />
            <span>{{ companyInfo.contact_person }}</span>
          </div>
          <div>
            <img src="@/assets/diqiu.png" />
            <span>{{ companyInfo.contact_phone }}</span>
          </div>
          <div>
            <img src="@/assets/diqiu.png" />
            <span>邮箱：{{ companyInfo.contact_email }}</span>
          </div>
        </div>
      </div>
      <EmptyShip v-if="shipType == 0" />
      <LittleShip
        v-if="shipType == 1"
        :getShipList="getShipList" />
      <HaveShip
        v-if="shipType == 2"
        :getShipList="getShipList" />
    </div>
  </div>
</template>
<script setup>
import { ref, getCurrentInstance, computed, onMounted, nextTick } from 'vue';
import { useStore } from 'vuex';

import { func, tools } from '@/utils';
import * as apis from '@/fetch/apis.js';
import Head from '@/components/Head.vue';
import EmptyShip from './emptyShip';
import HaveShip from './haveShip';
import LittleShip from './littleShip';

const store = useStore();

const shipType = ref(3);

onMounted(async () => {
  getShipList();
  getCompany();
});
const getCompany = async () => {
  const param = {
    company_id: store.state.userInfo.company_id,
  };
  let res = await apis.getCompanyInfo(param);
  if (res.code != 200) return;
  store.commit('setCompany', res.data);
};

const getShipList = async () => {
  const param = {
    company_id: 1,
  };

  let res = await apis.getVessel(param);
  if (res.code != 200) return;

  store.commit('setShipArr', res.data);
  shipType.value = res.data.length == 0 ? 0 : res.data.length > 0 && res.data.length <= 3 ? 1 : 2;
};

const companyInfo = computed(() => store.state.companyInfo);
const shipData = computed(() => store.state.shipArr);
</script>

<style lang="less" scoped src="./index.less"></style>
