<template>
  <div id="app">
    <header class="top-bar">
      <el-form :inline="true" size="small">
        <el-form-item label="Vue-Gantt-Chart">
          <el-date-picker
            v-model="times"
            size="small"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width:300px"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="行数">
          <el-input
            v-model.number="rowNum"
            size="small"
            style="width:60px"
            placeholder=""
          ></el-input>
        </el-form-item>
        <el-form-item label="块数">
          <el-input
            v-model.number="colNum"
            size="small"
            style="width:60px"
            placeholder=""
          ></el-input>
        </el-form-item>
        <el-form-item label="cellHeight">
          <el-slider
            v-model="cellHeight"
            :min="20"
            :max="100"
            style="width:60px"
            size="small"
          ></el-slider>
        </el-form-item>
        <el-form-item label="cellWidth">
          <el-slider
            v-model="cellWidth"
            :min="20"
            :max="100"
            style="width:60px"
            size="small"
          ></el-slider>
        </el-form-item>
        <el-form-item label="scale">
          <el-select
            v-model="scale"
            placeholder=""
            style="width:80px"
            size="small"
          >
            <el-option
              v-for="item in scaleList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </header>
    <div class="container">
      <v-gantt-chart
        :startTime="times[0]"
        :endTime="times[1]"
        :cellWidth="cellWidth"
        :cellHeight="cellHeight"
        :timeLines="timeLines"
        :titleHeight="titleHeight"
        :scale="scale"
        :titleWidth="titleWidth"
        showCurrentTime
        :dataKey="dataKey"
        :arrayKeys="arrayKeys"
        :scrollToPostion="positionA"
        @scrollLeft="scrollLeftA"
        :datas="datasA"
      >
        <template v-slot:block="{ data, item }">
          <Test
            :data="data"
            :updateTimeLines="updateTimeLines"
            :cellHeight="cellHeight"
            :currentTime="currentTime"
            :item="item"
          ></Test>
        </template>
        <template v-slot:left="{ data }">
          <TestLeft :data="data"></TestLeft>
        </template>
        <template v-slot:title>训练控制 </template>
      </v-gantt-chart>
    </div>
  </div>
</template>

<script>
import Test from "./components/test.vue"
import TestLeft from "./components/test-left.vue"
import { mockDatas } from "./mock/index.js"
import dayjs from "dayjs"

const scaleList = `1,2,3,4,5,6,10,12,15,20,30,60,120,180,240,360,720,1440,2880,4320`
  .split(",")
  .map(n => {
    let value = parseInt(n)
    let label
    if(value<60){
        label=value+'minute'
    }else if(value>=60 && value< 1440){
        label=value/60+'hour'
    }else{
      label = value/1440 +'day'
    }
    return {
      value,
      label
    }
  })
export default {
  name: "App",
  components: { Test, TestLeft },
  computed: {
    getTimeDiff () {
      return new dayjs().second(0).diff(this.dataStartTime,"second");
    }
  },
  data() {
    return {
      dataStartTime:"Sat, 14 Nov 2020 01:45:31 GMT",
      timeLines: [
        {
          time: dayjs()
            .add(0, "hour")
            .toString()
        },
        {
          time: dayjs()
            .add(1  , "hour")
            .toString(),
          color: "#747e80"
        }
      ],
      currentTime: dayjs(),
      cellWidth: 100,
      cellHeight: 30,
      titleHeight: 40,
      titleWidth: 100,
      scale: 1,
      times: [
        dayjs()
          .subtract(0, "hour")
          .toString(),
        dayjs()
          .add(0, "day")
          .add(1, "hour")
          .toString()
      ],
      rowNum: 3,
      colNum: 10,
      datasA: [],
      arrEmpty:[],//处理所有的空的任务状态信息
      dataKey: "id",
      scaleList: scaleList,
      scrollToTime: dayjs()
        .add(1, "day")
        .toString(),
      scrollToPostion: { x: 10000, y: 10000 },
      arrayKeys: ["gtArray", "error"],
      scrollToY: 0,
      positionB: {},
      positionA: {},
      demoJson:null//这个是读取的模拟数据

    };
  },
  watch: {
    rowNum: "updateData",
    colNum: "updateData",
    times: "updateData",
    scrollToY(val) {
      this.positionA = { x: val };
    }
  },
  mounted() {
    this.updateData();
  },
  methods: {
    /**
     * 数据中的输入时间的当前偏移后的相对时间
     */
    getOffSetDate(dayJsVal){
      return new dayjs(dayJsVal).add(this.getTimeDiff,'second').toString()
    },
    updateData() {
      this.demoJson = require("../../demo/json/demo.json")
      this.handlerDemoJson();
      let result  = mockDatas(this.rowNum, this.colNum, this.times);
      this.handleArrEmpty(this.demoJson);
      this.datasA = this.demoJson;
      // this.arrEmpty = JSON.parse(JSON.stringify(result))
      // console.log(this.arrEmpty);
      // result = result.concat(this.arrEmpty);
      // this.datasA = result;
    },
    /**
     * 处理将demoJson中的数据全部同步为当前的时间的相对时间
     */
    handlerDemoJson(){
      let _self = this;
      this.demoJson.forEach(item=>{
        item.gtArray.forEach(gtItem=>{
          gtItem.start = _self.getOffSetDate(gtItem.start);
          gtItem.end = _self.getOffSetDate(gtItem.end);
        })
      })
    },
    /**
     * 将待处理的数据数组中的数据全部置为空,
     * 1.甘特图中的对象可以动态修改，组件动态渲染，即考虑可以修改值改变
     * 2.由于vue对象监控的必须是初始化的时候就有的对象，因此创建一个空对象 this.arrEmpty
     * 存储甘特图中修改变化的对象
     * 3.将获取到的数据中队的节点数据深拷贝，修改数据，可以动态修改值
     */
    handleArrEmpty(result){
      for (let arrEmptyLength = result.length,i = 0;i<arrEmptyLength ; i++){
        let gtArray = result[i].gtArray;
        for (let gtArrayLength = gtArray.length,j = 0;j<gtArrayLength ; j++){
          let gtArrayCopy = JSON.parse(JSON.stringify(gtArray[j]));
          gtArray.push(gtArrayCopy);
          this.arrEmpty.push(gtArrayCopy);
        }
      }
      this.sortArrEmptyByTime();
    },
    sortArrEmptyByTime(){
      function compare(p){ //这是比较函数
        return function(m,n){
          var a = m[p];
          var b = n[p];
          return new Date(a) - new Date(b); //升序
        }
      }
      this.arrEmpty.sort(compare("start"));
    },
    updateTimeLines(timeA, timeB) {
      this.timeLines = [
        {
          time: timeA
        },
        {
          time: timeB,
          color: "#747e80"
        }
      ];
    },
    scrollLeftA(val) {
      this.positionB = { x: val };
    },
    scrollLeftB(val) {
      this.positionA = { x: val };
    }
  }
}
</script>

<style scoped>
body {
  font-size: 12px;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

#app {
  display: flex;
  flex-direction: column;
  padding: 0 10px;
  height: calc(100vh - 2px);
}

label {
  margin-left: 10px;
}
input {
  width: 40px;
  height: 20px;
  vertical-align: middle;
}
input[type="range"] {
  width: 100px;
}
.top-bar {
  height: 40px;
}

.container {
  height: calc(100% - 58px);
  display: flex;
  flex-direction: column;
  flex: 1;
}

.main-footer {
  /* height: 30px; */
}

>>> .el-slider {
  width: 100px;
}
</style>
