<template>
  <div class="empty_box have_ship">
    <div class="search_box flex-row align-center justify-between">
      <div class="left_box flex-row align-center">
        <p>
          共
          <span>{{ data.length }}</span>
          条船舶信息
        </p>

        <!-- <div
          class="flex-row align-center justify-center"
          @click="ascend = !ascend">
          <span>时间</span>
          <img
            src="@/assets/sort.png"
            :class="{ sort: ascend }" />
        </div> -->
      </div>
      <div class="right_box flex-row">
        <el-input
          v-model="search"
          :input-style="{
            fontFamily: 'PingFangSC, PingFang SC',
            fontWeight: '400',
          }"
          placeholder="输入关键字查询"
          @keyup.enter="handleSearch">
          <template #suffix>
            <img
              class="search"
              src="@/assets/search.png"
              @click="handleSearch" />
          </template>
        </el-input>
        <el-button @click="addOpen">
          <template #icon>
            <img
              class="add"
              src="@/assets/add.png" />
          </template>
          新增船舶
        </el-button>
        <el-button @click="uploadOpen">
          <template #icon>
            <img
              class="upload"
              src="@/assets/upload.png" />
          </template>
          上传数据
        </el-button>
      </div>
    </div>
    <div class="ship_item">
      <div
        v-for="(item, index) in filteredData"
        :key="index"
        style="margin-bottom: 10px">
        <div class="item_head flex-row align-center justify-between">
          <div class="head_left flex-row align-center">
            <img src="@/assets/shipIcon.png" />
            <span style="cursor: pointer">
              {{ item.name }}
            </span>
          </div>
          <div class="head_right">
            <el-button @click="toggleCiiChart(item.id)">
              <template #icon>
                <img
                  class="upload"
                  src="@/assets/cii.png" />
              </template>
              查看CII走势图
            </el-button>
            <el-button @click="viewHistory(item)">
              <template #icon>
                <img
                  class="upload"
                  src="@/assets/upload.png" />
              </template>
              查看上传历史
            </el-button>
            <el-button @click="seeResult(item)">
              <template #icon>
                <img
                  class="upload"
                  src="@/assets/upload.png" />
              </template>
              查看分析结果
            </el-button>
            <el-button @click="editOpen(item)">
              <template #icon>
                <img
                  class="upload"
                  src="@/assets/edit.png" />
              </template>
              编辑
            </el-button>
            <el-button @click="openDelete(item)">
              <template #icon>
                <img
                  class="upload"
                  src="@/assets/delete.png" />
              </template>
              删除
            </el-button>
          </div>
        </div>
        <ItemContent :item="item" />

        <!-- CII走势图区域 -->
        <div
          v-if="expandedShips.includes(item.id)"
          class="littleShip">
          <div class="item_btm flex-row align-center justify-between">
            <div class="btm_left flex-row align-center">
              <img src="@/assets/cii.png" />
              <span>CII走势图</span>
            </div>
          </div>
          <div
            :id="`chartBox_${item.id}`"
            style="height: 400px"></div>
        </div>
      </div>

      <div class="pagination_bx flex-row align-center justify-end">
        <el-icon
          class="page-arrow"
          :class="{ disabled: currentPage === 1 }"
          @click="handlePrevPage">
          <DArrowLeft />
        </el-icon>
        <el-pagination
          :current-page="currentPage"
          :page-size="3"
          :background="true"
          layout="pager"
          :total="total"
          @current-change="currentChange" />
        <el-icon
          class="page-arrow"
          :class="{ disabled: currentPage === totalSize }"
          @click="handleNextPage">
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
    <AddDialog
      ref="RefAddDialog"
      :edit-data="editData"
      :get-ship-list="getShipList" />
    <HistoryDialog
      ref="RefHistoryDialog"
      :ship-id="currentShipId" />
    <MessageBox
      ref="RefMessageBox"
      title="确认删除吗？"
      message="删除后将无法再看到船舶信息及所有船舶能效数据的分析结果"
      @sureClick="delSure" />
  </div>
</template>

<script setup>
import { ref, computed, defineProps, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

import UploadDialog from './uploadDialog';
import AddDialog from './addDialog.vue';
import HistoryDialog from './historyDialog';
import ItemContent from './itemContent';
import littleShip from './littleShip.vue';
import { useAddDialog, useUploadDialog, useHistoryDialog } from '@/hooks/useCommon.js';
import * as apis from '@/fetch/apis.js';
import { ElMessage } from 'element-plus';
import MessageBox from '@/components/MessageBox';
import tools from '@/utils/tools';

const store = useStore();
const router = useRouter();

const ascend = ref(false);
const search = ref('');
const currentPage = ref(1);
const inputPage = ref('');
const total = ref(100);
const expandedShips = ref([]); // 用于跟踪展开CII图表的船舶ID

// 弹出框相关
const RefAddDialog = ref(null);
const RefUploadDialog = ref(null);
const RefHistoryDialog = ref(null);
const RefMessageBox = ref(null);
const editData = ref(null);
const currentShipId = ref('');

const { addOpen } = useAddDialog(RefAddDialog);
const { uploadOpen } = useUploadDialog(RefUploadDialog);
const { historyOpen } = useHistoryDialog(RefHistoryDialog);

const props = defineProps({
  getShipList: {
    type: Function,
    default: () => {},
  },
});

const totalSize = computed(() => {
  if (!total.value) return 0;
  return Math.ceil(total.value / 3);
});

// 过滤后的数据
const filteredResult = computed(() => {
  if (!search.value) return store.state.shipArr;
  return store.state.shipArr.filter(item =>
    item.name.toLowerCase().includes(search.value.toLowerCase()),
  );
});

// 分页后的数据
const filteredData = computed(() => {
  const startIndex = (currentPage.value - 1) * 3;
  const endIndex = startIndex + 3;
  return filteredResult.value.slice(startIndex, endIndex);
});

// 更新总数
watch(
  filteredResult,
  newVal => {
    total.value = newVal.length;
  },
  { immediate: true },
);

const seeResult = item => {
  store.commit('setSelectShip', item.id);
  router.push('/optimize');
};

// 跳转到指定页
const jumpPage = () => {
  const pageNum = Number(inputPage.value);
  if (isNaN(pageNum) || pageNum < 1 || pageNum > totalSize.value) {
    ElMessage.warning('请输入有效的页码');
    return;
  }
  currentPage.value = pageNum;
};

// 页码改变
const currentChange = current => {
  currentPage.value = current;
};

// 上一页
const handlePrevPage = () => {
  if (currentPage.value > 1) {
    currentChange(currentPage.value - 1);
  }
};

// 下一页
const handleNextPage = () => {
  if (currentPage.value < totalSize.value) {
    currentChange(currentPage.value + 1);
  }
};

const handleSearch = () => {
  currentPage.value = 1; // 搜索时重置页码
};

// 编辑船舶信息
const editOpen = item => {
  editData.value = { ...item }; // 复制当前选中的船舶数据
  addOpen();
};

// 打开删除确认框
const openDelete = item => {
  currentShipId.value = item.id;
  RefMessageBox.value.open();
};

// 确认删除
const delSure = async () => {
  const param = {
    vessel_id: currentShipId.value,
  };
  const res = await apis.delVesselInfo(param);
  if (res.code != 200) return;
  ElMessage.success('删除成功');
  if (typeof props.getShipList === 'function') {
    props.getShipList(); // 刷新列表
  }
};

// 查看上传历史
const viewHistory = item => {
  currentShipId.value = item.id;
  historyOpen();
};

// 切换CII图表显示
const toggleCiiChart = async shipId => {
  const index = expandedShips.value.indexOf(shipId);
  if (index > -1) {
    // 如果已经展开，则收起
    expandedShips.value.splice(index, 1);
  } else {
    // 如果未展开，则展开并加载数据
    expandedShips.value.push(shipId);
    await nextTick(); // 等待DOM更新
    await loadCiiData(shipId);
  }
};

// 获取并渲染CII数据
const loadCiiData = async shipId => {
  try {
    const param = {
      vessel_id: shipId,
    };
    const res = await apis.shipCii(param);
    if (res.code === 200) {
      // 临时修改chartBox的ID以适配当前船舶
      const originalChartBox = document.getElementById('chartBox');
      const currentChartBox = document.getElementById(`chartBox_${shipId}`);

      if (currentChartBox) {
        // 临时设置ID为chartBox以供tools.initCii使用
        currentChartBox.id = 'chartBox';
        tools.initCii(res.data);
        // 恢复原ID
        currentChartBox.id = `chartBox_${shipId}`;
      }

      // 恢复原始chartBox的ID（如果存在）
      if (originalChartBox) {
        originalChartBox.id = 'chartBox';
      }
    }
  } catch (error) {
    console.error('加载CII数据失败:', error);
    ElMessage.error('加载CII数据失败');
  }
};

const data = computed(() => store.state.shipArr);
</script>

<style lang="less" scoped src="./index.less"></style>
