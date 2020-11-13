import Vue from "vue";
import App from "./demo/App";
import vGanttChart from "./index";
// import vGanttChart from "v-gantt-chart"
import {
  Popover,
  DatePicker,
  Button,
  Input,
  Row,
  Col,
  Form,
  FormItem,
  Slider,
  Select,
  Option,
  Checkbox
} from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

Vue.config.productionTip = false;
Vue.use(vGanttChart);
Vue.use(Popover);
Vue.use(DatePicker);
Vue.use(Button);
Vue.use(Input);
Vue.use(Row);
Vue.use(Col);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Slider);
Vue.use(Select);
Vue.use(Option);
Vue.use(Checkbox);

function getHMS(seconds) {
  let h = Math.floor(seconds / 3600);
  let m = Math.floor((seconds % 3600) / 60);
  let s = seconds - 3600 * h - 60 * m;
  let hh = h < 10 ? '0' + h : h;
  let mm = m < 10 ? '0' + m : m;
  let ss = s < 10 ? '0' + s : s;
  return hh + ':' + mm + ':' + ss;
}

Vue.prototype.$getHMS = getHMS;


new Vue({
  render: h => h(App)
}).$mount("#app");
