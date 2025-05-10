<template>
  <el-config-provider :locale="messages[locale]">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" />
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" />
  </el-config-provider>
</template>

<script setup>
import { ElConfigProvider } from 'element-plus';
import { useI18n } from 'vue-i18n';
const { locale, messages } = useI18n();
</script>

<style lang="less">
* {
  box-sizing: border-box;
}
body {
  font-size: 14px !important;
  margin: 0;
  padding: 0;

  * {
  }
}
ul,
li,
p {
  margin: 0;
  padding: 0;
}
#app {
  overflow: hidden;
  height: 100vh;
}

.btn_color {
  cursor: pointer;
  background: linear-gradient(123deg, #0e4e9a 0%, #1c94ff 100%);
}

body * {
  box-sizing: border-box;
  flex-shrink: 0;
}

input {
  background-color: transparent;
  border: 0;
}

.flex-col {
  display: flex;
  flex-direction: column;
}
.flex-row {
  display: flex;
  flex-direction: row;
}
.justify-start {
  display: flex;
  justify-content: flex-start;
}
.justify-center {
  display: flex;
  justify-content: center;
}

.justify-end {
  display: flex;
  justify-content: flex-end;
}
.justify-evenly {
  display: flex;
  justify-content: space-evenly;
}
.justify-around {
  display: flex;
  justify-content: space-around;
}
.justify-between {
  display: flex;
  justify-content: space-between;
}
.align-start {
  display: flex;
  align-items: flex-start;
}
.align-center {
  display: flex;
  align-items: center;
}
.align-end {
  display: flex;
  align-items: flex-end;
}
// 修改ele 默认样式

#app {
  .el-drawer__header,
  .el-drawer__body {
    padding: 0;
  }
}
</style>
