<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构内容-头部 -->
      <el-card class="tree-card">
        <!-- 放置结构内容 -->
        <TreeTools @addDepts="addDepts" :treeNode="company" :isRoot="true"></TreeTools>
        <!-- 放置一个 el-tree -->
        <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
          <!-- 传入内容 插槽内容 就会循环多次 有多少节点 就循环多少次 -->
          <!-- 作用于插槽 slot-scope="obj" 接收传递给插槽的数据  data 就是每个节点的数据对象 -->
          <TreeTools
            @addDepts="addDepts"
            @delDepts="getDepartments"
            slot-scope="{data}"
            :treeNode="data"
          ></TreeTools>
        </el-tree>
      </el-card>
    </div>
    <!-- 防止新增弹层组件 -->
    <AddDept @addDepts="getDepartments" :showDialog.sync="showDialog" :treeNode="node"></AddDept>
  </div>
</template>

<script>
// 导入封装的子组件
import TreeTools from "./components/tree-tools";
// 导入新增列表的组件
import AddDept from "./components/add-dept";
// 导入获取组织架构企业部门列表的接口
import { getDepartments } from "@/api/departments";
// 导入把树形结构转化为数组的方法
import { tranListToTreeDate } from "@/utils";
export default {
  components: {
    TreeTools,
    AddDept
  },
  data() {
    return {
      company: {},
      departs: [],
      defaultProps: {
        label: "name" // 表示 从这个属性显示内容
      },
      showDialog: false, // 默认不显示弹层
      node: null // 记录当前点击的node 节点
    };
  },
  created() {
    // 调用自身的方法
    this.getDepartments();
  },
  methods: {
    async getDepartments() {
      const result = await getDepartments();
      this.company = { name: result.companyName, manager: "负责人", id: "" };
      this.departs = tranListToTreeDate(result.depts, ""); // 需要将其转化成树形结构
      console.log(result);
    },
    addDepts(node) {
      this.showDialog = true; // 显示弹层
      // 因为node是当前的点击的部门， 此时这个部门应该记录下来,
      this.node = node;
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
