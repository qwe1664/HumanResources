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
        <el-col>{{treeNode.message}}</el-col>
        <el-col>
          <!-- 防止下拉菜单 element -->
          <el-dropdown>
            <!-- 内容 -->
            <span>
              操作
              <i class="el-icon-arrow-down" />
            </span>
            <!-- 下拉菜单 具名插槽 -->
            <el-dropdown-menu slot="dropdown">
              <!-- 下拉选项 -->
              <el-dropdown-item>添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
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
  }
};
</script>

<style>
</style>