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
          <TreeTools slot-scope="{data}" :treeNode="data"></TreeTools>
        </el-tree>
      </el-card>
    </div>
  </div>
</template>

<script>
import TreeTools from "./components/tree-tools";
export default {
  components: {
    TreeTools
  },
  data() {
    return {
      company: { name: "火星人股份有限公司", message: "负责人" },
      departs: [
        {
          name: "总裁办",
          message: "你",
          children: [{ name: "董事会", message: "好" }]
        },
        { name: "行政部", message: "啊" },
        { name: "人事部", message: "哈" }
      ],
      defaultProps: {
        label: "name" // 表示 从这个属性显示内容
      }
    };
  }
};
</script>

<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>
