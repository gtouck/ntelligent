<template>
  <div id="mapMain">
    <div id="allmap"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

let map = null;
let couunt1;
onMounted(() => {
  console.log(BMapGL);
  initMap();
});

const initMap = () => {
  // 百度地图API功能
  map = new BMapGL.Map('allmap'); // 创建Map实例
  map.centerAndZoom(new BMapGL.Point(116.404, 39.915), 3); // 初始化地图,设置中心点坐标和地图级别
  map.setMapType('BMAP_NORMAL_MAP');
  //添加地图类型控件
  map.addControl(
    new BMapGL.MapTypeControl({
      mapTypes: ['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP'],
    }),
  );
  map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
  myfunction();

  //点击标注发生
};

const attribute = e => {
  var p = e.target;
  console.log(p);
};

const myfunction = () => {
  var dataList = [
    { id: 1, B: 120.1, A: 20.1, MESFOC_kw: 150 },
    { id: 2, B: 20.2, A: 20.2, MESFOC_kw: 160 },
    { id: 3, B: 120.3, A: 20.3, MESFOC_kw: 170 },
    { id: 4, B: 120.4, A: 20.4, MESFOC_kw: 180 },
  ];
  //清除所有的点
  var mapLever = 6;
  if (dataList.length > 5000) {
    mapLever = 9;
  } else if (dataList.length > 3000) {
    mapLever = 9;
  } else if (dataList.length > 1000) {
    mapLever = 10;
  } else {
    couunt1 = 1;
  }
  var xb = parseInt(dataList.length / 2);
  // 初始化地图,设置中心点坐标和地图级别
  map.centerAndZoom(new BMapGL.Point(dataList[xb].B, dataList[xb].A), mapLever);

  for (var i = 0; i < dataList.length; i++) {
    // 绘制点
    var marker = new BMapGL.Marker(new BMapGL.Point(dataList[i].B, dataList[i].A));
    map.addOverlay(marker);
    marker.idstr =
      '当前点：[ 编号' +
      dataList[i].id +
      '.经度：' +
      dataList[i].B +
      ',纬度：' +
      dataList[i].A +
      ',速度：' +
      dataList[i].MESFOC_kw +
      ']';
    marker.addEventListener('click', attribute);
  }
  //开启鼠标滚轮缩放
  map.enableScrollWheelZoom(true);
};
</script>

<style scoped lang="less">
#mapMain {
  background-color: rgb(227, 227, 227);
  width: 100%;
  height: 100%;
  background-color: rgb(241, 241, 241);
  border-radius: 0px;
  padding: 10px 20px 0px 0px;
}

#allmap {
  width: 100%;
  height: 100%;
}
</style>
