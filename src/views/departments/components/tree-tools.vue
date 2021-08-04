<template>
  <el-row type="flex" justify="space-between" align="middle" style="height: 40px; width:100%">
    <!-- 左侧 -->
    <el-col>
      <!-- 左侧内容 -->
      <span>{{treeNode.name}}</span>
    </el-col>
    <!-- 右侧 -->
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <!-- 两个内容 分为左边和右边 -->
        <el-col>{{treeNode.manager}}</el-col>
        <el-col>
          <!-- 防止下拉菜单 element -->
          <el-dropdown @command="operateDepts">
            <!-- 内容 -->
            <span>
              操作
              <i class="el-icon-arrow-down" />
            </span>
            <!-- 下拉菜单 具名插槽 -->
            <el-dropdown-menu slot="dropdown">
              <!-- 下拉选项 -->
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item command="edit" v-if="!isRoot">编辑部门</el-dropdown-item>
              <el-dropdown-item command="del" v-if="!isRoot">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
// 导入删除部门数据的接口
import { delDepartments } from "@/api/departments";
export default {
  props: {
    treeNode: {
      type: Object,
      required: true
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 点击 编辑 删除 新增时触发
    operateDepts(type) {
      if (type === "add") {
        // 添加子部门
        this.$emit('addDepts',this.treeNode)
      } else if (type === "edit") {
        // 编辑部门
      } else {
        // 删除部门
        this.$confirm("确定要删除该部门吗")
          .then(() => {
            return delDepartments(this.treeNode.id); // 调用删除接口 传入对应的id 返回一个proims 通过.then来操作成功后的步骤
          })
          .then(() => {
            this.$emit("delDepts"); // 触发自定义事件 传递给父组件，去重新读取数据
            this.$message.success("删除数据成功"); // 删除成功后提示消息
          });
      }
    }
  }
};
</script>

<style>
</style>