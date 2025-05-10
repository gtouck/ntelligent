<template>
  <div class="empty_box have_ship">
    <div class="search_box flex-row align-center justify-between">
      <div class="left_box flex-row align-center">
        <p>
          共
          <span>{{ data.length }}</span>
          条船舶信息
        </p>
        <div class="flex-row align-center justify-center" @click="ascend = !ascend">
          <span>时间</span>
          <img src="@/assets/sort.png" :class="{ sort: ascend }" />
        </div>
      </div>
      <div class="right_box flex-row">
        <el-input v-model="search" :input-style="{
          fontFamily: 'PingFangSC, PingFang SC',
          fontWeight: '400',
        }" placeholder="输入关键字查询">
          <template #suffix>
            <img class="search" src="@/assets/search.png" />
          </template>
        </el-input>
        <el-button @click="addOpen">
          <template #icon>
            <img class="add" src="@/assets/add.png" />
          </template>
          新增船舶
        </el-button>
        <el-button @click="uploadOpen">
          <template #icon>
            <img class="upload" src="@/assets/upload.png" />
          </template>
          上传数据
        </el-button>
      </div>
    </div>
    <div class="ship_item">
      <div v-for="(item, index) in data" :key="index" style="margin-bottom: 10px;">
        <div class="item_head flex-row align-center justify-between">
          <div class="head_left flex-row align-center">
            <img src="@/assets/shipIcon.png" />
            <span>{{ item.name }}</span>
          </div>
          <div class="head_right">
            <el-button @click="historyOpen">
              <template #icon>
                <img class="upload" src="@/assets/upload.png" />
              </template>
              查看上传历史
            </el-button>
            <el-button @click="seeResult(item)">
              <template #icon>
                <img class="upload" src="@/assets/upload.png" />
              </template>
              查看分析结果
            </el-button>
            <el-button @click="addOpen">
              <template #icon>
                <img class="upload" src="@/assets/upload.png" />
              </template>
              编辑
            </el-button>
            <el-button>
              <template #icon>
                <img class="upload" src="@/assets/upload.png" />
              </template>
              删除
            </el-button>
          </div>
        </div>
        <ItemContent :item="item" />
      </div>

      <div class="pagination_bx flex-row align-center justify-end">
        <el-icon>
          <DArrowLeft />
        </el-icon>
        <el-pagination :current-page="currentPage" :page-size="3" :background="true" layout="pager" :total="total"
          @current-change="currentChange" />
        <el-icon>
          <DArrowRight />
        </el-icon>
        <div class="total_box flex-row align-center">
          共{{ totalSize }}页 到第
          <el-input v-model="inputPage" />
          页
          <el-button @click="jumpPage">确定</el-button>
        </div>
      </div>
    </div>
    <UploadDialog ref="RefUploadDialog" />
    <AddDialog ref="RefAddDialog" />
    <HistoryDialog ref="RefHistoryDialog" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

import UploadDialog from './uploadDialog';
import AddDialog from './addDialog.vue';
import HistoryDialog from './historyDialog';
import ItemContent from './itemContent';
import { useAddDialog, useUploadDialog, useHistoryDialog } from '@/hooks/useCommon.js';

const store = useStore();
const router = useRouter();
//弹出框
const RefAddDialog = ref(null);
const RefUploadDialog = ref(null);
const RefHistoryDialog = ref(null);
const { addOpen } = useAddDialog(RefAddDialog);
const { uploadOpen } = useUploadDialog(RefUploadDialog);
const { historyOpen } = useHistoryDialog(RefHistoryDialog);

// 变量
const ascend = ref(false);
const search = ref('');
const currentPage = ref(1);
const inputPage = ref('');
const total = ref(100);

const totalSize = computed(() => {
  if (!total.value) return 0;
  return Math.ceil(total.value / 3);
});

const seeResult = (item) => {

  store.commit('setSelectShip', item.id);
  router.push('/optimize');
};

const jumpPage = () => {
  currentPage.value = Number(inputPage.value);
};

const currentChange = current => {
  currentPage.value = current;
};

const data = computed(() => store.state.shipArr);
</script>

<style lang="less" scoped src="./index.less"></style>
