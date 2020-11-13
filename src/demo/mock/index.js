import dayjs from "dayjs";
import Mock from "mockjs";
import de from "element-ui/src/locale/lang/de";
const colorList = [
  "(252, 105, 100)",
  "(247, 167, 71)",
  "(116, 202, 90)",
  "(83, 186, 241)",
  "(208, 142, 2231)"
];
const nameList = "救火组,保障组,供水组,救火组,保障组,供水组,救火组,保障组,供水组,救火组,保障组,供水组,救火组,保障组,供水组,救火组,保障组,供水组,救火组,保障组,供水组".split(
  ","
);

const typeList = "🚅,🚈,🚄".split(",");

const Random = Mock.Random;
let colNum = 10;
let times = [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)];
var template = {
  id: () =>
    "" +
    Random.natural(100, 999) ,
  name: () => Random.pick(nameList),
  type: () => Random.pick(typeList),
  colorPair: () => {
    let a = "rgb" + Random.pick(colorList);
    return {
      dark: a.replace(")", ",0.8)"),
      light: a.replace(")", ",0.1)")
    };
  },
  speed: () => Random.natural(0, 200),
  gtArray: () => {
    let temp = [];
    let i = 0;
    let j = Random.natural(colNum - 1, colNum);
    let tempStart = dayjs(times[0]).subtract(12, "minute");
    let tempEnd = dayjs(times[0]).subtract(12, "minute");

    while (i < j) {
      tempStart = tempEnd.add(Random.natural(1, 5), "minute");
      tempEnd = tempStart.add(Random.natural(1, 5), "minute");
      temp.push({
        id:
          Random.character("upper") +
          Random.character("upper") +
          Random.natural(1000, 9999),
        passenger: Random.natural(10, 200),
        start: tempStart.toString(),
        end: tempEnd.toString(),
        stageColor:"#cccccc",
      });

      i++;
    }
    return temp;
  }
};

function mockDatas(nums, col, t) {
  colNum = col;
  times = t;
  let datas = [];
  for (let i = 0, j = Random.natural(nums, nums); i < j; i++) {
    datas.push(Mock.mock(template));
  }
  return datas;
}

export { mockDatas };
