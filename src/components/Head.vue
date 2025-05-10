<template>
  <!-- <Language />

    <div class="title">
      {{ t('login.title') }}
    </div> -->
  <div class="home_head">
    <div class="left_box align-item flex-row">
      <img
        class="head_logo"
        src="@/assets/headLogo.png" />
      <h3>船舶能效智能分析平台</h3>
    </div>

    <div class="right_box">
      <div class="badge">
        <img
          class="message"
          src="@/assets/message.png" />
        <span>121</span>
      </div>

      <img
        class="user"
        src="@/assets/user.png" />

      <el-dropdown
        ref="dropdown1"
        trigger="contextmenu">
        <div class="name_box">
          <span
            class="head_name"
            @click="show">
            你好！{{ userInfo.username }}
          </span>

          <el-icon
            class="caret"
            color="#8397AE"
            @click="show">
            <CaretBottom />
          </el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="loginOut">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <el-dropdown
        ref="dropdown2"
        trigger="contextmenu">
        <div
          class="language"
          @click="showLanguage">
          <img src="@/assets/language.png" />

          <span class="text">{{ lan }}</span>
          <el-icon
            class="caret"
            color="#8397AE">
            <CaretBottom />
          </el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="item in languages"
              :key="item.value"
              :value="item.value"
              @click="checkLan(item)">
              <p>{{ item.name }}</p>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-dropdown
        ref="dropdown3"
        trigger="contextmenu">
        <div
          class="time flex-row align-center"
          @click="showTime">
          <img src="@/assets/time.png" />

          <span class="text">{{ timeType }}</span>
          <el-icon
            class="caret"
            color="#8397AE">
            <CaretBottom />
          </el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="selectTimeType('utc')">UTC时间</el-dropdown-item>
            <el-dropdown-item @click="selectTimeType('local')">本地时间</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>
<script setup>
import { ref, getCurrentInstance, computed, onMounted } from 'vue';

import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import tools from '@/utils/tools';

const { locale } = useI18n();
const router = useRouter();
const languages = [
  { name: 'En', value: 'en' },
  { name: '中文', value: 'zh-cn' },
];
const store = useStore();
const lan = ref('中文');
const timeType = ref('北京时间');

const userInfo = computed(() => store.state.userInfo);

onMounted(() => {
  if (localStorage.getItem('language')) {
    lan.value = languages.filter(e => e.value == localStorage.getItem('language'))[0].name;
  }
  if (localStorage.getItem('timeType')) {
    timeType.value = localStorage.getItem('timeType') == 'local' ? '北京时间' : 'UTC时间';
  }
});

const selectTimeType = type => {
  timeType.value = type == 'local' ? '北京时间' : 'UTC时间';
  localStorage.setItem('timeType', type);
  console.log(tools.getTime(new Date(), 'YYYY/MM/DD hh:mm:ss'));
};

const checkLan = item => {
  console.log(item);
  localStorage.setItem('language', item.value);
  locale.value = item.value;
  lan.value = item.name;
  // store.commit('setLanguage', val);
};

const loginOut = () => {
  router.push('/login');
};

const dropdown1 = ref();
const dropdown2 = ref();
const dropdown3 = ref();

const show = () => {
  dropdown1.value.handleOpen();
};
const showLanguage = () => {
  dropdown2.value.handleOpen();
};

const showTime = () => {
  dropdown3.value.handleOpen();
};
</script>

<style lang="less" scoped>
.home_head {
  z-index: 99;
  position: sticky;
  top: 0;
  height: 60px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(90deg, #0a203a 0%, #0c3463 100%);
  box-shadow: 0px 1px 10px 0px rgba(0, 21, 41, 0.38);
  padding: 0 16px 0 0px;

  .left_box {
    height: 100%;
  }

  .head_logo {
    height: 100%;
    object-fit: contain;
    margin-right: 15px;
  }
  h3 {
    font-family: MicrosoftYaHeiBold;
    font-size: 16px;
    color: #ffffff;
    font-style: normal;
    cursor: pointer;
  }

  .right_box {
    display: flex;
    align-items: center;
    height: 60px;
    cursor: pointer;

    .badge {
      position: relative;
      margin-right: 38px;
      height: 100%;
      display: flex;
      align-items: center;
      & > span {
        position: absolute;
        left: 10px;
        top: 18px;
        display: block;
        padding: 1px 2px;
        background: #de3333;
        border-radius: 0.5lh;
        font-family: MicrosoftYaHei;
        font-size: 9px;
        color: #ffffff;

        text-align: center;
      }
    }

    .message,
    .user,
    .language {
      height: 17px;
      object-fit: contain;
    }
    .user {
      margin-right: 11px;
    }
  }
  .name_box {
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .language {
    display: flex;
    margin-left: 25px;
    align-items: center;
    img {
      height: 15px;
      width: 15px;
      margin-right: 7px;
    }
    .text {
      font-family: MicrosoftYaHeiBold;
      font-size: 14px;
      color: #ffffff;
      line-height: 19px;
      margin-right: 10px;
    }
  }

  .time {
    margin-left: 24px;

    img {
      height: 17px;
      object-fit: contain;
      margin-right: 10px;
    }
    .text {
      font-family: SourceHanSansCN, SourceHanSansCN;
      font-weight: 400;
      font-size: 14px;
      color: #ffffff;
      line-height: 21px;
      margin-right: 10px;
    }
  }

  .head_name {
    font-family: MicrosoftYaHei;
    font-size: 13px;
    color: #ffffff;
    text-align: left;
    font-style: normal;
    margin-right: 7px;
  }
}
.item {
  margin-right: 33px;
}

:deep(.el-badge__content.is-fixed) {
  background: #de3333;
  font-family: MicrosoftYaHei;
  font-size: 9px;
  color: #ffffff;
  font-style: normal;
  border: 0;
  top: 10px;
}

.avatar {
  margin-right: 11px;
}
</style>
