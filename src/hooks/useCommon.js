import { ref, reactive, computed } from 'vue';
import { useStore, mapState } from 'vuex';
import * as apis from '@/fetch/apis.js';
import tools from '@/utils/tools';

export function useAddDialog(el) {
  const addOpen = () => {
    el.value.change();
  };

  return {
    addOpen,
  };
}

export function useHistoryDialog(el) {
  const historyOpen = () => {
    el.value.change();
  };

  return {
    historyOpen,
  };
}

export function useUploadDialog(el) {
  const uploadOpen = () => {
    el.value.change();
  };

  return {
    uploadOpen,
  };
}

//燃料类型
export function useFuelType() {
  let fuelTypeArr = [];
  if (tools.getSessionStorage('fuelType')) {
    const language = localStorage.getItem('language') || 'zh-cn';
    fuelTypeArr = tools.getSessionStorage('fuelType').map(e => {
      return {
        ...e,
        name: language == 'zh-cn' ? e.name_cn : e.name_en,
      };
    });
  }
  return {
    fuelTypeArr,
  };
}

//船舶类型
export function useShipType() {
  let shipTypeArr = [];
  if (tools.getSessionStorage('shipType')) {
    const language = localStorage.getItem('language') || 'zh-cn';
    shipTypeArr = tools.getSessionStorage('shipType').map(e => {
      return {
        ...e,
        name: language == 'zh-cn' ? e.name_cn : e.name_en,
      };
    });
  }
  return {
    shipTypeArr,
  };
}

//时区
export function useTimeZone() {
  let timeZoneArr = [];
  if (tools.getSessionStorage('timeZone')) {
    const language = localStorage.getItem('language') || 'zh-cn';
    timeZoneArr = tools.getSessionStorage('timeZone').map(e => {
      return {
        ...e,
        name: language == 'zh-cn' ? e.name_cn : e.name_en,
      };
    });
  }
  return {
    timeZoneArr,
  };
}

//属性
export function useAttributes() {
  let attributesArr = [];
  if (tools.getSessionStorage('attributes')) {
    const language = localStorage.getItem('language') || 'zh-cn';
    attributesArr = tools.getSessionStorage('attributes').map(e => {
      return {
        ...e,
        name: e.description,
        value: e.attribute,
      };
    });
  }
  return {
    attributesArr,
  };
}

//属性组合
export function useAttributesMap() {
  let attributeMappingArr = [];
  if (tools.getSessionStorage('attributeMapping')) {
    const language = localStorage.getItem('language') || 'zh-cn';
    attributeMappingArr = tools.getSessionStorage('attributeMapping').map(e => {
      return {
        ...e,
        name: e.attribute_left.description + '-' + e.attribute_right.description,
        value: e.attribute_left.attribute + '-' + e.attribute_right.attribute,
        // name: language == 'zh-cn' ? e.name_cn : e.name_en,
      };
    });
  }
  return {
    attributeMappingArr,
  };
}

//油品种类
export function useFuelTypeCategory() {
  let fuelTypeCategoryArr = [];
  if (tools.getSessionStorage('fuelTypeCategory')) {
    const language = localStorage.getItem('language') || 'zh-cn';
    fuelTypeCategoryArr = tools.getSessionStorage('fuelTypeCategory').map(e => {
      return {
        ...e,

        // name: language == 'zh-cn' ? e.name_cn : e.name_en,
      };
    });
  }
  return {
    fuelTypeCategoryArr,
  };
}

export function useUserInfo() {
  const store = useStore();
  const { userInfo } = store.state;
  return {
    userInfo,
  };
}

export function useStoreState(mapper) {
  // 获取key,并判断是否存在
  const store = useStore();

  const mappers = mapState(mapper);
  let mapData = {};

  Object.keys(mappers).forEach(item => {
    mapData[item] = computed(mappers[item].bind({ $store: store }));
  });

  // 返回值
  return mapData;
}
