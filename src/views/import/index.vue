<template>
  <upload-excel :on-success="success"></upload-excel>
</template>

<script>
import { importEmployee } from "@/api/employees";
export default {
  methods: {
    async success({ header, results }) {
      const userRelations = {
        入职日期: "timeOfEntry",
        手机号: "mobile",
        姓名: "username",
        转正日期: "correctionTime",
        工号: "workNumber"
      };

      /* 
        运用map方法会返回一个新的数组，里面的item表示 每一项数据
        object.keys 会得到 所有对象的属性名，在进行循环
        对空数组中的属性名为英文 等于map遍历数据中文中所对应的值
      */

      var newArr = results.map(item => {
        var userInfo = {};
        Object.keys(item).forEach(key => {
          if (
            userRelations[key] === "timeOfEntry" ||
            userRelations[key] === "correctionTime"
          ) {
            userInfo[userRelations[key]] = new Date(
              this.formatDate(item[key], "/")
            ); // 只有这样才能存入数据库
          } else {
            userInfo[userRelations[key]] = item[key]; // 讲原来中文对应的值，赋值给原来英文对应的值
          }
        });
        return userInfo;
      });
      await importEmployee(newArr); // 接收一个数组
      this.$message.success("导入excel成功");
      this.$router.back(); // 返回到上一个页面
    },
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1);
      time.setYear(time.getFullYear() - 70);
      const year = time.getFullYear() + "";
      const month = time.getMonth() + 1 + "";
      const date = time.getDate() - 1 + "";
      if (format && format.length === 1) {
        return year + format + month + format + date;
      }
      return (
        year +
        (month < 10 ? "0" + month : month) +
        (date < 10 ? "0" + date : date)
      );
    }
  }
};
</script>

<style>
</style>