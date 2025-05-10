<template>
  <el-drawer
    v-model="dialogFormVisible"
    size="42%"
    :show-close="false"
    custom-class="addShipping">
    <template #header="{ close, titleId, titleClass }">
      <div class="my-header">
        <p>
          上传数据
          <span>(该数据上传后由后端管理上传数据库后显示，并非实时数据！)</span>
        </p>

        <el-icon class="el-icon--left"><Close @click="close" /></el-icon>
      </div>
    </template>
    <div
      v-for="(item, index) in fileList"
      :key="index"
      class="ship_box">
      <div class="item_head flex-row align-center justify-between">
        <span>船舶{{ index + 1 }}</span>
        <img
          v-if="fileList.length > 1"
          src="@/assets/homeDel.png"
          @click="delShip(index)" />
      </div>
      <div class="item_btm flex-row align-center">
        <el-select
          v-model="item.ship"
          placeholder="请选择">
          <el-option
            v-for="v in data"
            :key="v.id"
            :label="v.name"
            :value="v.id" />
        </el-select>
        <span class="line" />
        <el-upload
          :before-upload="file => beforeUpload(file, index)"
          class="upload"
          action=""
          multiple
          :how-file-list="false"
          :limit="1">
          <el-button>
            <img src="@/assets/homeupload.png" />
            上传文件
          </el-button>
        </el-upload>
        <el-button
          v-if="item.file"
          class="upload_file">
          {{ item.file.name }}
          <el-icon><Close /></el-icon>
        </el-button>
        <img
          v-if="index == 0"
          class="addIcon"
          src="@/assets/addIcon.png"
          @click="addShip" />
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button
          class="cancle_btn"
          @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button
          class="btn_color save_btn"
          @click="saveUpload">
          保存
        </el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup>
import { ref, computed, watch, reactive } from 'vue';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';
import * as apis from '@/fetch/apis.js';

const store = useStore();

const dialogFormVisible = ref(false);
const fileList = ref([
  {
    ship: '',
    file: null,
  },
]);

const data = computed(() => store.state.shipArr);

watch(dialogFormVisible, () => {
  fileList.value = [
    {
      ship: '',
      file: null,
    },
  ];
});

const saveUpload = async () => {
  fileList.value.map(async e => {
    const param = {
      vessel_id: e.ship,
      file: e.file,
    };

    let res = await apis.uploadData(param);
    if (res.code == 200) {
      ElMessage.success('上传成功');
      dialogFormVisible.value = false;
    }
  });
};

const addShip = () => {
  fileList.value = [
    ...fileList.value,
    {
      ship: '',
      file: null,
    },
  ];
};

const delShip = index => {
  fileList.value.splice(index, 1);
};

const beforeUpload = (file, index) => {
  fileList.value[index].file = file;
  return false;
};

const change = () => {
  dialogFormVisible.value = !dialogFormVisible.value;
};

defineExpose({
  change,
});
</script>

<style lang="less" scoped>
.ship_box {
  background: #f7f9fc;
  padding: 14px 14px 32px 38px;
  margin: 0 32px 20px;
  .item_head {
    margin-bottom: 10px;
    width: 100%;

    img {
      height: 22px;
      object-fit: contain;
      cursor: pointer;
    }
    span {
      font-family: SourceHanSansCN, SourceHanSansCN;
      font-weight: 400;
      font-size: 16px;
      color: #333333;
      line-height: 24px;
      text-align: justify;
      font-style: normal;
    }
  }

  :deep(.el-upload-list) {
    display: none;
  }

  .addIcon {
    height: 20px;
    width: 20px;
    margin-left: 26px;
    cursor: pointer;
  }

  .item_btm {
    .el-select {
      width: 180px;
      height: 40px;
      background: #ffffff;
      border-radius: 5px;
      border: 1px solid #e2e2e2;
    }
    .line {
      width: 1px;
      height: 37px;
      border: 1px solid #dee4ef;
      margin: 0 47px 0 41px;
    }
    .upload {
      margin-right: 12px;
      .el-button {
        width: 135px;
        height: 40px;
        background: #ffffff;
        border-radius: 3px;
        border: 1px solid #e6ebf3;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 13px;
        color: #1286f1;

        font-style: normal;
        img {
          height: 12px;
          object-fit: contain;
          margin-right: 5px;
        }
      }
    }

    .upload_file {
      height: 40px;
      border-radius: 3px;
      border: 1px solid #c9d3e4;
      padding: 0 9px 0 19px;
      text-align: center;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 13px;
      color: #333333;

      .el-icon {
        height: 16px;
        width: 16px;
        color: #acbdd5;
        margin-left: 11px;
      }
    }
  }
}

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
  margin-top: 128px;
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
    > span {
      color: #666666;
      font-size: 16px;
    }
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
</style>
