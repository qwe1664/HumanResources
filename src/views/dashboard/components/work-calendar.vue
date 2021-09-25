<template>
  <!-- 工作日历 -->
  <div>
    <!-- 年和月 -->
    <el-row type="flex" justify="end">
      <el-select
        @change="dataChange"
        v-model="currentYear"
        size="small"
        style="width: 120px"
      >
        <!-- 年的循环 -->
        <el-option
          v-for="item in yearList"
          :key="item"
          :label="item"
          :value="item"
        ></el-option>
      </el-select>
      <el-select
        @change="dataChange"
        v-model="currentMonth"
        size="small"
        style="width: 120px; magrin-left: 10px"
      >
        <!-- 循环 -->
        <el-option
          v-for="item in 12"
          :key="item"
          :label="item"
          :value="item"
        ></el-option>
      </el-select>
    </el-row>

    <!-- 放置一个日历组件 -->
    <el-calendar v-model="currentDate">
      <template v-slot:dateCell="{ date, data }">
        <div class="date-content">
          <span class="text"> {{ data.day | getDay }}</span>
          <span v-if="isWeek(date)" class="rest">休</span>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script>
export default {
  props: {
    startDate: {
      type: Date,
      // 需要回调函数类型的返回值
      default: () => new Date(), // 如果没用传递 startDate 就取得当前时间
    },
  },
  filters: {
    getDay(value) {
      const day = value.split("-")[2];
      // 如果直接返回day 那么就是两位字符，一位数时前面自动补零
      // 下面这个表示，如果是以 0 开头，那么就从第一位开始将它截取掉
      return day.startsWith("0") ? day.substr(1) : day;
    },
  },
  data() {
    return {
      yearList: [], // 要遍历的年的数组
      currentYear: null, //当前年份
      currentMonth: null, // 当前月份
      currentDate: null, // 当前时间
    };
  },
  created() {
    // 获取当前的年份
    this.currentYear = this.startDate.getFullYear(); // 得到当前年份
    this.currentMonth = this.startDate.getMonth() + 1; // 得到当前月份
    this.yearList = Array.from(Array(11), (v, i) => this.currentYear + i - 5);

    // 钩子函数执行完成之后  主动调用一下方法
    this.dataChange();
  },
  methods: {
    // 生成新的日期
    dataChange() {
      this.currentDate = new Date(
        `${this.currentYear}- ${this.currentMonth}-1`
      ); // 以 1 号为开始
    },

    // 判断是否为周末
    isWeek(date) {
      return date.getDay() === 6 || date.getDay() === 0;
    },
  },
};
</script>

<style scoped >
/deep/ .el-calendar-day {
  height: auto;
}
/deep/ .el-calendar-table__row td,
/deep/ .el-calendar-table tr td:first-child,
/deep/ .el-calendar-table__row td.prev {
  border: none;
}
.date-content {
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}
.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  margin-left: 10px;
}
.date-content .text {
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
}
/deep/ .el-calendar-table td.is-selected .text {
  background: #409eff;
  color: #fff;
  border-radius: 50%;
}
/deep/ .el-calendar__header {
  display: none;
}
</style>