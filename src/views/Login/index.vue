<template>
  <div class="page flex-col">
    <div class="box_1 flex-col">
      <div class="block_1 flex-col">
        <div class="block_2 flex-row">
          <div class="image-wrapper_1 flex-col">
            <img
              class="image_1"
              src="@/assets/logo.png" />
          </div>
          <span class="text_1">船舶能效智能分析平台</span>
        </div>
        <div class="block_3 flex-row">
          <div
            class="section_1 flex-col"
            :class="{ select_type: loginType == 1 }">
            <div class="text-wrapper_1 flex-row justify-between">
              <span
                class="text_2"
                @click="loginType = 1">
                账号登录
              </span>
              <!-- <span
                class="text_3"
                @click="loginType = 2">
                短信登录
              </span> -->
            </div>
            <div class="group_1 flex-col">
              <div class="box_2 flex-col"></div>
            </div>
            <template v-if="loginType == 1">
              <div class="group_2 flex-row align-center">
                <div class="image-text_1 flex-row justify-between">
                  <img
                    class="label_1"
                    src="@/assets/username.png" />
                  <el-input
                    v-model="username"
                    class="text-group_1"
                    :maxlength="11"
                    placeholder="请输入账号" />
                </div>
              </div>
              <div class="group_2 group_4 flex-row align-center">
                <div class="image-text_1 flex-row justify-between">
                  <img
                    class="label_1"
                    src="@/assets/password.png" />
                  <el-input
                    v-model="password"
                    type="password"
                    class="text-group_1"
                    :maxlength="11"
                    placeholder="请输入密码" />
                </div>
              </div>
            </template>
            <template v-else>
              <div class="group_2 flex-row align-center">
                <div class="image-text_1 flex-row justify-between">
                  <img
                    class="label_1"
                    src="@/assets/phone.png" />
                  <el-input
                    v-model="phone"
                    class="text-group_1"
                    :maxlength="11"
                    placeholder="请输入手机号" />
                </div>
              </div>
              <div class="group_3 flex-row align-center">
                <img
                  class="label_2"
                  src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPngdbd4f151fed886130d47efbec5e9bef99fa30cafa7fcf1664eb140cd3f65903d" />
                <el-input
                  v-model="code"
                  class="text-group_1"
                  :maxlength="6"
                  placeholder="请输入验证码" />
                <span
                  v-if="show"
                  class="text_5"
                  @click="getCodeWait">
                  发送验证码
                </span>
                <span
                  v-else
                  class="count_text">
                  {{ count }}
                </span>
              </div>
            </template>

            <div
              class="text-wrapper_2 flex-col btn_color"
              @click="login">
              <span class="text_6">登&nbsp;&nbsp;&nbsp;&nbsp;录</span>
            </div>
            <p
              class="register"
              @click="pushPage">
              立即注册
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, getCurrentInstance, computed, onMounted, onUnmounted } from 'vue';
import * as apis from '@/fetch/apis.js';
import { useStore } from 'vuex';

import tools from '@/utils/tools';
import { ElMessage } from 'element-plus';
const store = useStore();

import { useRouter } from 'vue-router';
const router = useRouter();

const loginType = ref(1);

const phone = ref('');
const code = ref('');
const username = ref('user');
const password = ref('123456');

const count = ref(60);
const show = ref(true);
let timer = null;

onMounted(() => {
  getFueType();
  getShipType();
  getTimeZone();
  getAttributeMapping();
  getAttributes();
  getFuelTypeCategory();
});

onUnmounted(() => {
  show.value = true;
  clearInterval(timer);
  timer = null;
});

const login = async () => {
  // if (!phone.value) {
  //   return ElMessage({
  //     message: '请输入手机号',
  //     type: 'warning',
  //   });
  // }

  // if (!code.value) {
  //   return ElMessage({
  //     message: '请输入验证码',
  //     type: 'warning',
  //   });
  // }

  const param = {
    username: username.value,
    password: password.value,
  };

  let res = await apis.login(param);
  if (res.code != 200) return;
  store.commit('setUserInfo', res.data);
  router.push('/home');
};

const getFueType = async () => {
  let res = await apis.getFueType({});
  if (res.code != 200) return;
  tools.setSessionStorage('fuelType', res.data);
};

const getShipType = async () => {
  let res = await apis.getShipType({});
  if (res.code != 200) return;
  tools.setSessionStorage('shipType', res.data);
};

const getTimeZone = async () => {
  let res = await apis.getTimeZone({});
  if (res.code != 200) return;
  tools.setSessionStorage('timeZone', res.data);
};

const getAttributes = async () => {
  let res = await apis.getAttributes({});
  if (res.code != 200) return;
  tools.setSessionStorage('attributes', res.data);
};

const getAttributeMapping = async () => {
  let res = await apis.getAttributeMapping({});
  if (res.code != 200) return;
  tools.setSessionStorage('attributeMapping', res.data);
};

const getFuelTypeCategory = async () => {
  let res = await apis.getFuelTypeCategory({});
  if (res.code != 200) return;
  tools.setSessionStorage('fuelTypeCategory', res.data);
};

// 倒计时60s
const getCodeWait = () => {
  let TIME_COUNT = 60;
  if (!timer) {
    count.value = TIME_COUNT;
    show.value = false;
    timer = setInterval(() => {
      if (count.value > 0 && count.value <= TIME_COUNT) {
        count.value--;
      } else {
        show.value = true;
        clearInterval(timer);
        timer = null;
      }
    }, 1000);
  }
};

const pushPage = () => {
  router.push('/register');
};
</script>
<style lang="less" src="./index.less" scoped />
