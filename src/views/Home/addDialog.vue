<template>
  <el-drawer v-model="dialogFormVisible" :show-close="false" size="60%" custom-class="addShipping">
    <template #header="{ close, titleId, titleClass }">
      <div class="my-header">
        <p :id="titleId" :class="titleClass">
          新增船舶
        </p>

        <el-icon class="el-icon--left">
          <Close @click="close" />
        </el-icon>
      </div>
    </template>

    <el-form ref="ruleFormRef" :model="form" :rules="postVesselRule" label-position="top">
      <el-form-item label="船舶IMO">
        <el-input v-model="form.info.mmsi" autocomplete="off" />
      </el-form-item>
      <el-form-item label="船舶名">
        <el-input v-model="form.info.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="船舶类型">
        <el-select v-model="form.info.ship_type" placeholder="请选择">
          <el-option v-for="item in shipTypeArr" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="建造年份">
        <el-date-picker v-model="form.info.build_date" value-format="YYYY-MM-DD" class="date_picker" type="date"
          placeholder="请选择" />
      </el-form-item>
      <el-form-item label="总吨">
        <el-input type="number" v-model="form.info.gross_tone" autocomplete="off" />
      </el-form-item>
      <el-form-item label="载重吨">
        <el-input type="number" v-model="form.info.dead_weight" autocomplete="off" />
      </el-form-item>
      <el-form-item label="船用时区">
        <el-select v-model="form.info.time_zone" placeholder="请选择">
          <el-option v-for="item in timeZoneArr" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="螺距">
        <el-input type="number" v-model="form.info.pitch" autocomplete="off" />
      </el-form-item>
      <el-form-item label="新造船">
        <el-radio-group v-model="form.info.new_vessel">
          <el-radio :value="true" size="large">
            是
          </el-radio>
          <el-radio :value="false" size="large">
            否
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- <el-form-item label="">
        
        <div class="space"></div>
      </el-form-item> -->

      <el-form-item label="发动机大修日期">
        <el-date-picker v-model="form.info.engine_overhaul_date" class="date_picker" value-format="YYYY-MM-DD"
          type="date" placeholder="请选择" />
      </el-form-item>
      <el-form-item label="船体重喷漆日期">
        <el-date-picker v-model="form.info.newly_paint_date" class="date_picker" value-format="YYYY-MM-DD" type="date"
          placeholder="请选择" />
      </el-form-item>
      <el-form-item label="上次船体清洁日期">
        <el-date-picker v-model="form.info.hull_clean_date" class="date_picker" value-format="YYYY-MM-DD" type="date"
          placeholder="请选择" />
      </el-form-item>
      <el-form-item label="上次螺旋桨抛光日期">
        <!-- 接口没有这个字段 -->
        <el-date-picker v-model="form.info.propeller_polish_date" class="date_picker" value-format="YYYY-MM-DD"
          type="date" placeholder="请选择" />
      </el-form-item>
      <div class="item_box mt35">
        <p class="trialVoyage_head">试航报告对水航速与主机功率数值<img src="@/assets/addIcon.png"
            @click="() => addDevice('power_speed_curve')" /></p>
        <div v-for="(item, itemIndex) in form.info.power_speed_curve" class="curve_item">
          <div class="item_box mt0">
            <el-form-item label="船首吃水">
              <el-input v-model="item.draft_bow" autocomplete="off" />
            </el-form-item>
            <el-form-item label="船尾吃水">
              <el-input v-model="item.draft_astern" autocomplete="off" />
            </el-form-item>
            <el-form-item label="曲线名称">
              <el-input v-model="item.curve_name" autocomplete="off" />
            </el-form-item>
          </div>
          <div class="item_box mt0" v-for="(i, index) in item.curve_data" :key="index">
            <el-form-item label="对水航速">
              <el-input v-model="i.speed_water" autocomplete="off" />
            </el-form-item>
            <el-form-item label="主机功率">
              <el-input v-model="i.me_power" autocomplete="off" />
            </el-form-item>
            <div class="space">
              <img src="@/assets/iconDel.png" @click="delDevice(itemIndex, 'curve_data', index)" />
              <img v-if="index == item.curve_data.length - 1" src="@/assets/addIcon.png"
                @click="() => addDevice('curve_data', itemIndex)" />
            </div>

          </div>
        </div>

        <div class="bg_box"></div>
      </div>

      <div v-for="(item, index) in form.info.equipment_fuel" :key="index" class="item_box">
        <div class="flex-row align-center w-300 justify-between">
          <el-form-item label="设备种类">
            <el-select v-model="item.type" filterable allow-create placeholder="请选择" class="w-111">
              <el-option v-for="item in deviceTypeArr" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="设备名称">
            <el-input v-model="item.name" class="w-164" placeholder="请输入"></el-input>
          </el-form-item>
        </div>

        <el-form-item label="燃油类型">
          <el-select v-model="item.fuel_type_ids" multiple placeholder="请选择">
            <el-option v-for="item in fuelTypeArr" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <div class="space">
          <img src="@/assets/iconDel.png" @click="delDevice(index, 'equipment_fuel')" />
          <img v-if="index == form.info.equipment_fuel.length - 1" src="@/assets/addIcon.png"
            @click="addDevice('equipment_fuel')" />
        </div>
        <div class="bg_box"></div>
      </div>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button class="cancle_btn" @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button class="btn_color save_btn" @click="submitClick(ruleFormRef)">
          保存
        </el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup>
import { ref, computed, onMounted, reactive, watch } from 'vue';
import * as apis from '@/fetch/apis.js';
import { postVesselRule } from '@/utils/formRules.js';
import { useFuelType, useShipType, useTimeZone, useUserInfo } from '@/hooks/useCommon.js';
import { ElMessage } from 'element-plus';
const props = defineProps({
  editData: {
    type: Object,
    default: () => { },
  },
  getShipList: {
    type: Function,
    default: () => { },
  },
});

const { fuelTypeArr } = useFuelType();
const { shipTypeArr } = useShipType();
const { timeZoneArr } = useTimeZone();
const { userInfo } = useUserInfo();

//设备种类
const deviceTypeArr = [
  {
    name: '主机',
    id: 'me',
  },
  {
    name: '副机',
    id: 'dg',
  },
  {
    name: '锅炉',
    id: 'blr',
  },
];

const ruleFormRef = ref();
const dialogFormVisible = ref(false);
const form = reactive({
  info: {
    id: '',
    company_id: userInfo.company_id,
    mmsi: '', //船舶imo
    name: '', //船舶名
    build_date: '', //建造年份
    gross_tone: '', //总吨
    time_zone: '', //船用时区
    new_vessel: '', //新造船
    engine_overhaul_date: '', //发动机大修日期
    newly_paint_date: '', //船体重喷漆日期
    dock_repaire_date: '', //上次坞修日期
    propeller_polish_date: '', //上次螺旋桨抛光日期
    hull_clean_date: '', //上次船体清洁日期
    dead_weight: '', //载重吨
    ship_type: '', //船舶类型

    pitch: '',
    equipment_fuel: [
      {
        fuel_type_ids: [],
      },
    ],
    power_speed_curve: [
      {
        draft_astern: '',
        draft_bow: '',
        curve_name: '',
        curve_data: [{ speed_water: '', me_power: '' }],

      },
    ],
  },
});

const postVessel = async () => {
  const param = { ...form.info, vessel_id: form.info.id };

  let res = param.id ? await apis.putVesselInfo(param) : await apis.postVessel(param);
  if (res.code != 200) return;
  ElMessage({
    message: '操作成功',
    type: 'success',
  });
  props.getShipList && props.getShipList();
  change();
};

const getVesselInfo = async () => {

  const param = { vessel_id: props.editData.id };

  let res = await apis.getVesselInfo(param);
  if (res.code != 200) return;
  form.info = res.data
};

const submitClick = async formEl => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      postVessel();
    } else {
      console.log('error submit!', fields);
    }
  });
};

const addDevice = (type, index) => {


  if (type == 'power_speed_curve') {
    form.info.power_speed_curve.push({
      draft_astern: '',
      draft_bow: '',
      curve_name: '',
      curve_data: [{ speed_water: '', me_power: '' }],

    });
  }

  if (type == 'curve_data') {
    form.info.power_speed_curve[index].curve_data.push({
      speed_water: '', me_power: ''
    });
  }

  if (type == 'equipment_fuel') {
    form.info.equipment_fuel.push({
      fuel_type_ids: [],
    });
  }
};

const delDevice = (index, type, itemIndex) => {
  if (type == 'equipment_fuel') {
    form.info.equipment_fuel.splice(index, 1);
  }

  if (type == 'power_speed_curve') {
    form.info.power_speed_curve.splice(index, 1);
  }

  if (type == 'curve_data') {
    form.info.power_speed_curve[index].curve_data.splice(itemIndex, 1);

  }
};

const change = () => {
  dialogFormVisible.value = !dialogFormVisible.value;
};

watch(dialogFormVisible, newValue => {
  if (newValue && props?.editData?.id) {
    getVesselInfo()
    // form.info = {
    //   equipment_fuel: [
    //     {
    //       fuel_type_ids: [],
    //     },
    //   ],
    //   power_speed_curve: [
    //     {
    //       speed_water: '',
    //       me_power: '',
    //     },
    //   ],
    //   company_id: userInfo.company_id,
    //   ...props.editData,
    // };
  } else {
    form.info = {
      id: '',
      company_id: userInfo.company_id,
      mmsi: '', //船舶imo
      name: '', //船舶名
      build_date: '', //建造年份
      gross_tone: '', //总吨
      time_zone: '', //船用时区
      new_vessel: '', //新造船
      engine_overhaul_date: '', //发动机大修日期
      newly_paint_date: '', //船体重喷漆日期
      dock_repaire_date: '', //上次坞修日期
      propeller_polish_date: '', //上次螺旋桨抛光日期
      hull_clean_date: '', //上次船体清洁日期
      dead_weight: '', //载重吨
      ship_type: '', //船舶类型
      draft_astern: '', //船尾吃水
      draft_bow: '', //船首吃水
      pitch: '',
      equipment_fuel: [
        {
          fuel_type_ids: [],
        },
      ],
      power_speed_curve: [
        {
          draft_astern: '',
          draft_bow: '',
          curve_name: '',
          curve_data: [{ speed_water: '', me_power: '' }],

        },
      ],
    }
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
}

.my-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 26px 28px;
  border-bottom: 1px solid #f0f0f0;

  &>p {
    font-family: SourceHanSansCN, SourceHanSansCN;
    font-weight: bold;
    font-size: 20px;
    color: #333333;
    line-height: 30px;
    text-align: justify;
  }
}

.el-drawer {
  .el-form {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    padding: 24px 66px 53px 68px;

    .mt35 {
      margin-top: 34px;
    }

    .mt0 {
      margin-bottom: 0px !important;
    }

    .item_box {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      position: relative;
      margin-bottom: 34px;

      .curve_item {
        border-bottom: 1px dashed #bcbcbc;
        margin: 10px 0;
        z-index: 3;
        width: 100%;
      }

      .trialVoyage_head {
        z-index: 2;
        width: 100%;
        margin-bottom: 12px;
        font-family: SourceHanSansCN, SourceHanSansCN;
        font-weight: bold;
        font-size: 16px;
        color: #333333;
        line-height: 24px;
        display: flex;
        align-items: center;

        img {
          margin-left: 10px;
          height: 20px;
          width: 20px;
          cursor: pointer;
        }


      }

      .bg_box {
        position: absolute;
        width: 103%;
        height: 100%;
        padding: 13px 0 0 29px;
        background: #f7f9fc;
        left: -29px;
        top: -13px;
        z-index: 1;
        box-sizing: content-box;
      }
    }

    .el-input,
    .el-select,
    .el-radio-group,
    .space {
      width: 300px;
      height: 40px;
      z-index: 2;

      img {
        margin-top: 12px;
        height: 20px;
        width: 20px;
        margin-right: 20px;
      }
    }

    .w-111 {
      width: 111px !important;
      // margin-right: 31px;
    }

    .w-164 {
      width: 164px !important;
    }

    .el-form-item {
      margin-bottom: 25px;
      z-index: 2;
    }
  }

  .w-300 {
    width: 300px;
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
