<template>
  <!-- 放置弹层组件 -->
  <el-dialog title="新增部门" :visible="showDialog">
    <el-form label-width="120px">
      <el-form-item label="部门名称">
        <el-input placeholder="1-50个字符" style="width:80%;"></el-input>
      </el-form-item>
      <el-form-item label="部门编码">
        <el-input placeholder="1-50个字符" style="width:80%;"></el-input>
      </el-form-item>
      <el-form-item label="部门负责人">
        <el-select placeholder="请选择" style="width:80%;"></el-select>
      </el-form-item>
      <el-form-item label="部门介绍">
        <el-input type="textarea" :rows="3" placeholder="1-300个字符" style="width:80%;"></el-input>
      </el-form-item>
    </el-form>
    <!-- 确定和消息 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button type="primary" size="small">确定</el-button>
        <el-button size="small">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
export default {
  props: {
    showDialog: {
      // 控制新增弹窗的显示
      type: Boolean,
      default: false
    }
  }
};
</script>

<style>
</style>