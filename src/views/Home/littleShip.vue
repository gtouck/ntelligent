<template>
  <div
    id="littleShip"
    class="empty_box have_ship">
    <div class="search_box flex-row align-center justify-between">
      <div class="left_box flex-row align-center">
        <p>
          共
          <span>{{ data.length }}</span>
          条船舶信息
        </p>
      </div>
      <div class="right_box flex-row">
        <el-button @click="editOpen(false)">
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
      <div class="item_head flex-row align-center justify-start">
        <div class="flex-row align-center">
          <div
            class="ship_items"
            v-for="(item, index) in data"
            :key="index">
            <div
              class="head_left flex-row align-center"
              :class="{ active_head: item.id == selectShip }"
              @click="selectShip = item.id">
              <img
                v-if="item.id == selectShip"
                src="@/assets/whiteShip.png" />
              <img
                v-else
                src="@/assets/grayShip.png" />
              <span>{{ item.name }}</span>
            </div>
          </div>
        </div>

        <div class="head_right flex-row">
          <el-button @click="historyOpen">
            <template #icon>
              <img src="@/assets/upload.png" />
            </template>
            查看上传历史
          </el-button>
          <el-button @click="seeResult">
            <template #icon>
              <img src="@/assets/upload.png" />
            </template>
            查看分析结果
          </el-button>
          <el-button @click="editOpen(true)">
            <template #icon>
              <img src="@/assets/edit.png" />
            </template>
            编辑
          </el-button>
          <el-button @click.stop="open">
            <template #icon>
              <img src="@/assets/delete.png" />
            </template>
            删除
          </el-button>
        </div>
      </div>
      <ItemContent :item="selectShipInfo" />
      <div class="item_btm flex-row align-center justify-between">
        <div class="btm_left flex-row align-center">
          <img src="@/assets/cii.png" />
          <span>CII走势图</span>
        </div>
      </div>
      <div id="chartBox"></div>
    </div>
    <UploadDialog ref="RefUploadDialog" />
    <AddDialog
      ref="RefAddDialog"
      :edit-data="editData"
      :getShipList="getShipList" />
    <HistoryDialog
      ref="RefHistoryDialog"
      :ship-id="selectShip" />
    <MessageBox
      ref="RefMessageBox"
      title="确认删除吗？"
      message="删除后将无法再看到船舶信息及所有船舶能效数据的分析结果"
      @sureClick="delSure" />
  </div>
</template>

<script setup>
import { ref, computed, reactive, defineProps, onMounted, nextTick, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import * as apis from '@/fetch/apis.js';
import tools from '@/utils/tools';
import { ElMessage } from 'element-plus';

import MessageBox from '@/components/MessageBox';
import AddDialog from './addDialog.vue';
import UploadDialog from './uploadDialog';
import HistoryDialog from './historyDialog';
import ItemContent from './itemContent';

import { useAddDialog, useUploadDialog, useHistoryDialog } from '@/hooks/useCommon.js';
const router = useRouter();
const store = useStore();

const search = ref('');
const currentPage = ref(1);
const inputPage = ref('');
const total = ref(100);
const selectShip = ref('');
const selectShipInfo = ref(null);
const editData = ref(null);

const RefAddDialog = ref(null);
const RefHistoryDialog = ref(null);
const RefUploadDialog = ref(null);
const RefMessageBox = ref(null);
const { addOpen } = useAddDialog(RefAddDialog);
const { uploadOpen } = useUploadDialog(RefUploadDialog);
const { historyOpen } = useHistoryDialog(RefHistoryDialog);

const props = defineProps({
  getShipList: {
    type: Function,
    default: () => {},
  },
});

onMounted(() => {
  selectShip.value = data.value[0].id;
  selectShipInfo.value = data.value[0];
});

const shipCii = async () => {
  let param = {
    vessel_id: selectShip.value,
  };
  let res = await apis.shipCii(param);
  if (res.code != 200) return;
  tools.initCii(res.data);
};

const editOpen = type => {
  if (type) {
    editData.value = data.value.filter(e => e.id == selectShip.value)[0];
  } else {
    editData.value = {
      id: '',
      mmsi: '', //船舶imo
      name: '', //船舶名
      build_date: '', //建造年份
      gross_tone: '', //总吨
      time_zone: '', //船用时区
      new_vessel: '', //新造船
      engine_overhaul_date: '', //发动机大修日期
      newly_paint_date: '', //船体重喷漆日期
      dock_repaire_date: '', //上次坞修日期
      dead_weight: '', //载重吨
      ship_type: '', //船舶类型
      equipment_fuel: [
        {
          equipment: '',
          fuel_type_ids: [],
        },
      ],
    };
  }

  nextTick(() => {
    addOpen();
  });
};

const open = () => {
  RefMessageBox.value.open();
};

const totalSize = computed(() => {
  if (!total.value) return 0;
  return Math.ceil(total.value / 3);
});

const delSure = async () => {
  const param = {
    vessel_id: selectShip.value,
  };
  const res = await apis.delVesselInfo(param);
  if (res.code != 200) return;
  ElMessage.success('删除成功');
};

const seeResult = () => {
  store.commit('setSelectShip', selectShip.value);
  router.push('/optimize');
};

const jumpPage = () => {
  currentPage.value = Number(inputPage.value);
};

const currentChange = current => {
  currentPage.value = current;
};

watch(selectShip, newValue => {
  shipCii();
  selectShipInfo.value = data.value.filter(e => e.id == selectShip.value)[0];
});

const data = computed(() => store.state.shipArr);
</script>

<style lang="less" scoped src="./index.less"></style>
