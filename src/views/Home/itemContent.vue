<template>
  <div class="item_content flex-row align-center justify-between">
    <div class="content_left flex-row align-center data1">
      <div>
        <div class="flex-row align-center">
          {{ renderT(item?.engine_state) }}
          <img />
        </div>
        <span>{{ renderT('engine') }}</span>
      </div>
      <span class="line" />
      <div>
        <div class="flex-row align-center warn">
          {{ renderT(item?.hull_propeller_state) }}
          <img />
        </div>
        <span>{{ renderT('hull') }}</span>
      </div>

      <!-- <span class="line" />
      <div>
        <div class="flex-row align-center error">
          {{ renderT('anomaly') }}
          <el-icon><Warning /></el-icon>
        </div>
        <span>{{ renderT('propeller') }}</span>
      </div> -->
    </div>
    <div class="content_box flex-col justify-center data4">
      <p>
        {{ Number(item?.speed_water || 0).toFixed(2) }}
        <span>{{ renderT('nmile') }}</span>
      </p>
      <span>{{ renderT('speed') }}</span>
    </div>

    <div class="content_box flex-col justify-center data2">
      <p>

        {{ Number(item?.me_fuel_consumption_nmile || 0).toFixed(2) }}
        <span>{{ renderT('kg') }}</span>
      </p>
      <span>{{ renderT('consump') }}</span>
    </div>
    <div class="content_box flex-col justify-center data3">
      <p>
        {{ Number(item?.latest_cii || 0).toFixed(2) }}
        <span>{{ renderT('tonne') }}</span>
      </p>
      <span>{{ renderT('attained') }}</span>
    </div>

    <div class="content_box flex-col justify-center data5">
      <p> {{ item?.cii_rating }}</p>
      <span>{{ renderT('rating') }}</span>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { watch } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    default: () => { },
  },

});


const { t } = useI18n();
const renderT = str => {
  console.log(str)
  return t('home.' + str);
};
</script>

<style lang="less" scoped src="./index.less"></style>
