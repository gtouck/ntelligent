<template>
  <el-drawer
    v-model="dialogFormVisible"
    size="44%"
    :show-close="false"
    custom-class="historyDialog">
    <template #header="{ close, titleId, titleClass }">
      <div class="my-header">
        <p>上传历史记录( {{ shipInfo.name }} - IMO: {{ shipInfo.mmsi }} )</p>

        <el-icon class="el-icon--left"><Close @click="close" /></el-icon>
      </div>
    </template>
    <div class="container">
      <p class="echarts_title">当前数据完整度</p>
      <div id="echart_box"></div>
      <el-table
        :data="tableData"
        stripe
        size="large"
        max-height="300px"
        style="width: 100%">
        <el-table-column
          label="序号"
          align="center"
          prop="id" />
        <el-table-column
          prop="dateSpan"
          align="center"
          label="上传数据时间跨度" />
        <el-table-column
          prop="file_path"
          align="center"
          show-overflow-tooltip
          label="文件路径" />
        <el-table-column
          prop="created_at"
          label="上传时间"
          align="center"
          sortable
          sort-orders="[ascending, descending, ascending]" />
      </el-table>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button
          class="cancle_btn"
          @click="dialogFormVisible = false">
          返回
        </el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup>
import { ref, computed, onMounted, reactive, watch, nextTick } from 'vue';
import { useStore } from 'vuex';
import * as echarts from 'echarts';

import * as apis from '@/fetch/apis.js';

const store = useStore();
const props = defineProps({
  shipId: {
    type: Number,
    default: () => {},
  },
});

const dialogFormVisible = ref(false);
const shipInfo = ref({});

const tableData = ref([]);

const getUploadHistory = async () => {
  const param = { id: props.shipId };
  let res = await apis.getUploadHistory(param);
  if (res.code != 200) return;
  tableData.value = res.data;
};

const initEchart = () => {
  var chartDom = document.getElementById('echart_box');
  var myChart = echarts.init(chartDom);
  var option;

  var data = [];
  var dataCount = 3;
  var startTime = +new Date();
  var categories = ['2020', '2021', '2022'];
  var types = [{ name: 'JS Heap', color: '#7b9ce1' }];
  // Generate mock data
  categories.forEach(function (category, index) {
    var baseTime = startTime;
    for (var i = 0; i < dataCount; i++) {
      var typeItem = types[Math.round(Math.random() * (types.length - 1))];
      var duration = Math.round(Math.random() * 10000);
      data.push({
        name: typeItem.name,
        value: [index, baseTime, (baseTime += duration), duration],
        itemStyle: {
          normal: {
            color: typeItem.color,
          },
        },
      });
      baseTime += Math.round(Math.random() * 2000);
    }
  });

  function renderItem(params, api) {
    var categoryIndex = api.value(0);
    var start = api.coord([api.value(1), categoryIndex]);
    var end = api.coord([api.value(2), categoryIndex]);
    var height = api.size([0, 1])[1] * 0.6;
    var rectShape = echarts.graphic.clipRectByRect(
      {
        x: start[0],
        y: start[1] - height / 2,
        width: end[0] - start[0],
        height: height,
      },
      {
        x: params.coordSys.x,
        y: params.coordSys.y,
        width: params.coordSys.width,
        height: params.coordSys.height,
      },
    );
    console.log(rectShape);

    return (
      rectShape && {
        type: 'rect',
        transition: ['shape'],
        shape: rectShape,
        style: api.style(),
      }
    );
  }
  option = {
    tooltip: {
      formatter: function (params) {
        return params.marker + params.name + ': ' + params.value[3] + ' ms';
      },
    },
    title: {},

    grid: {
      height: 100,
    },
    xAxis: {
      type: 'time',
      min: startTime,
      scale: true,
      axisLabel: {},
    },
    yAxis: {
      data: categories,
    },
    series: [
      {
        type: 'custom',
        renderItem: renderItem,
        itemStyle: {
          opacity: 0.8,
        },
        encode: {
          x: [1, 2],
          y: 0,
        },
        data: data,
      },
    ],
  };

  option && myChart.setOption(option);
};

const change = () => {
  dialogFormVisible.value = !dialogFormVisible.value;
};

watch(dialogFormVisible, newValue => {
  if (newValue) {
    getUploadHistory();
    shipInfo.value = store.state.shipArr.filter(e => e.id == props.shipId)[0];
    nextTick(() => {
      initEchart();
    });
  }
});

defineExpose({
  change,
});
</script>

<style lang="less" scoped>
.cancle_btn {
  width: 160px;
  height: 47px;
  border-radius: 5px;
  border: 1px solid #cbcbcb;
  span {
    font-family: SourceHanSansCN, SourceHanSansCN;
    font-weight: 400;
    font-size: 16px;
    color: #666666;
  }
}

.save_btn {
  width: 160px;
  height: 47px;
  border-radius: 5px;
  font-family: SourceHanSansCN, SourceHanSansCN;
  font-weight: 400;
  font-size: 16px;
  color: #ffffff;
  line-height: 24px;
}
.dialog-footer {
  text-align: center;
  padding-bottom: 53px;
  margin-top: 10px;
}

.my-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 26px 28px;
  border-bottom: 1px solid #f0f0f0;
  & > p {
    font-family: SourceHanSansCN, SourceHanSansCN;
    font-weight: bold;
    font-size: 20px;
    color: #333333;
    line-height: 30px;
    text-align: justify;
  }
}

.el-dialog {
  .el-form {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    padding: 24px 66px 53px 68px;
    .el-input,
    .el-select {
      width: 300px;
      height: 40px;
    }
    .el-form-item {
      margin-bottom: 25px;
    }
  }
}

:deep(.el-select) {
  .el-select__wrapper {
    height: 100%;
  }
}

:deep(.el-date-editor) {
  width: 300px;
  height: 40px;
  .el-input__wrapper {
    justify-content: flex-start !important;
    height: 100%;
  }
}

.container {
  padding: 0 32px;
  .echarts_title {
    font-family: SourceHanSansCN, SourceHanSansCN;
    font-weight: bold;
    font-size: 16px;
    color: #333333;
    line-height: 24px;
  }
  #echart_box {
    height: 300px;
    width: 100%;
  }
}
.el-table {
  // margin-top: 32px;
}

:deep(thead .el-table__cell) {
  height: 40px;
  background: #e7edf2;
  font-family: SourceHanSansCN, SourceHanSansCN;
  font-weight: 400;
  font-size: 15px;
  color: #4c5a6a;
}
</style>
