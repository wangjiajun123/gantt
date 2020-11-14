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
      dayjs: dayjs,
      offSet:28
    };
  },
  methods: {
    handleMarkLineTime(){
      let  middleTime = new dayjs(this.markLineTime,"YYYY-MM-DD HH:mm").diff(this.getNowStartTime,"second");
      return this.$getHMS(middleTime);
    },
    getPosition() {
      if (this.markLineTime == null) {
        this.visible = false;
        return this.offSet;
      } else {
        this.visible = true;
        return this.getPositonOffset(this.markLineTime) + this.offSet;
      }
    }
  }
};
</script>
