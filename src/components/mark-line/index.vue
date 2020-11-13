<template>
  <div
    v-show="visible"
    class="gantt-markline"
    :style="{ 'background-color': color, left: getPosition() + 'px' }"
  >
    <div class="gantt-markline-label" :style="{ 'background-color': color }">
<!--      {{ dayjs(markLineTime).format("HH:mm:ss") }}-->
      {{handleMarkLineTime(markLineTime)}}
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
export default {
  name: "MarkLine",
  props: {
    markLineTime: {
      validator(date) {
        return dayjs(date).isValid();
      }
    },
    color: {
      type: String,
      default: "#0ca30a"
    },
    getPositonOffset: {
      type: Function,
      required: true
    }
  },
  computed: {
    getNowStartTime() {
      return dayjs().second(0);
    },
  },
  data() {
    return {
      visible: false,
      dayjs: dayjs
    };
  },
  methods: {
    handleMarkLineTime(){
      // return dayjs(this.markLineTime).format("HH:mm:ss");
      let  middleTime = new dayjs(this.markLineTime,"YYYY-MM-DD HH:mm").diff(this.getNowStartTime,"second");
      if(middleTime!=0){
        middleTime+=1;
      }
      return this.$getHMS(middleTime);
    },
    getPosition() {
      if (this.markLineTime == null) {
        this.visible = false;
        return 0;
      } else {
        this.visible = true;
        return this.getPositonOffset(this.markLineTime);
      }
    }
  }
};
</script>
