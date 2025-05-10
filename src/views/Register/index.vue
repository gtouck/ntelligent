<template>
  <div class="register-page">
    <Head />
    <div class="container">
      <div class="back_box flex-row align-center">
        <img
          src="@/assets/back.png"
          @click="$router.back()" />
        <p>欢迎注册</p>
      </div>
      <div class="form_box flex-col align-center">
        <el-form
          ref="ruleFormRef"
          label-position="top"
          :rules="rules"
          :model="form">
          <el-form-item
            label="公司名称"
            prop="id">
            <el-select
              v-model="form.id"
              @change="selectCompany">
              <el-option
                v-for="item in companyList"
                :key="item.id"
                :label="item.name"
                :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="联系人"
            prop="contact_person">
            <el-input
              v-model="form.contact_person"
              disabled />
          </el-form-item>
          <el-form-item
            label="手机号"
            prop="contact_phone">
            <el-input
              v-model="form.contact_phone"
              disabled />
          </el-form-item>
          <el-form-item
            label="公司地址"
            prop="address">
            <el-input v-model="form.address" />
          </el-form-item>
          <el-form-item
            label="登录名"
            prop="username">
            <el-input v-model="form.username" />
          </el-form-item>
          <el-form-item
            label="密码"
            prop="password">
            <el-input
              v-model="form.password"
              type="password"
              show-password />
          </el-form-item>
          <el-form-item
            label="确认密码"
            prop="surePassword">
            <el-input
              v-model="form.surePassword"
              type="password"
              show-password />
          </el-form-item>
          <el-form-item label="">
            <el-checkbox v-model="form.check"></el-checkbox>
            <p
              class="text_name"
              @click="form.check = !form.check">
              我已阅读
              <span>软件免责声明</span>
              与
              <span>软件免责协议</span>
            </p>
          </el-form-item>
          <el-form-item>
            <p
              class="btn_color btn"
              @click="submitClick(ruleFormRef)">
              注册
            </p>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import * as apis from '@/fetch/apis.js';
import Head from '@/components/Head.vue';
import { ElMessage } from 'element-plus';
const router = useRouter();
const ruleFormRef = ref();

const companyList = ref([]);

const form = reactive({
  contact_person: '',
  id: '',
  username: '',
  contact_phone: '',
  address: '',
  password: '',
  surePassword: '',
  check: false,
});

const rules = reactive({
  id: [
    {
      required: true,
      message: '请选择',
    },
  ],
  username: [
    {
      required: true,
      message: '请输入',
    },
  ],
  contact_person: [
    {
      required: true,
      message: '请输入',
    },
  ],
  contact_phone: [
    {
      required: true,
      message: '请选择',
    },
  ],
  address: [
    {
      required: true,
      message: '请输入',
    },
  ],
  password: [
    {
      required: true,
      message: '请输入',
    },
  ],
  surePassword: [
    {
      required: true,
      message: '请输入',
    },
  ],
});

onMounted(() => {
  getCompany();
});

const getCompany = async () => {
  const param = {};
  let res = await apis.getCompany(param);
  if (res.code != 200) return;
  companyList.value = res.data;
};

const register = async () => {
  const param = {
    company_id: form.id,
    password: form.password,
    phone: form.contact_person,
    username: form.username,
  };
  let res = await apis.register(param);
  if (res.code != 200) return;
  ElMessage({
    message: '注册成功',
    type: 'success',
  });
  router.back();
};

const submitClick = async formEl => {
  // if (!form.username) return ElMessage('请输入登录名');
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (!form.check) return ElMessage('请勾选软件免责协议和软件免责声明');

      register();
    } else {
      console.log('error submit!', fields);
    }
  });
};

const selectCompany = val => {
  const info = companyList.value.filter(e => e.id == val)[0];
  form.id = val;
  form.contact_phone = info.contact_phone;
  form.contact_person = info.contact_person;
  form.address = info.address || '';
};
</script>

<style lang="less" scoped src="./index.less"></style>
