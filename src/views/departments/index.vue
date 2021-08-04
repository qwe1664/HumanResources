<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构内容-头部 -->
      <el-card class="tree-card">
        <!-- 放置结构内容 -->
        <TreeTools :treeNode="company" :isRoot="true"></TreeTools>
        <!-- 放置一个 el-tree -->
        <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
          <!-- 传入内容 插槽内容 就会循环多次 有多少节点 就循环多少次 -->
          <!-- 作用于插槽 slot-scope="obj" 接收传递给插槽的数据  data 就是每个节点的数据对象 -->
          <TreeTools @delDepts="getDepartments" slot-scope="{data}" :treeNode="data"></TreeTools>
        </el-tree>
      </el-card>
    </div>
  </div>
</template>

<script>
// 导入封装的子组件
import TreeTools from "./components/tree-tools";
// 导入获取组织架构企业部门列表的接口
import { getDepartments } from "@/api/departments";
// 导入把树形结构转化为数组的方法
import { tranListToTreeDate } from "@/utils";
export default {
  components: {
    TreeTools
  },
  data() {
    return {
      company: {},
      departs: [],
      defaultProps: {
        label: "name" // 表示 从这个属性显示内容
      }
    };
  },
  created() {
    // 调用自身的方法
    this.getDepartments();
  },
  methods: {
    async getDepartments() {
      const result = await getDepartments();
      this.company = { name: result.companyName, manager: "负责人" };
      this.departs = tranListToTreeDate(result.depts, ""); // 需要将其转化成树形结构
      console.log(result);
    }
  }
};
</script>

<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>
