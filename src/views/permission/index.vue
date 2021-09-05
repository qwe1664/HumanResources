<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 靠右的按钮 -->
      <page-tools>
        <template v-slot:after>
          <el-button type="primary" size="small">权限管理</el-button>
        </template>
      </page-tools>

      <!-- 表格 -->
      <!-- 将row-key 指定id为唯一属性的标识 -->
      <el-table border="" :data="list" row-key="id">
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column
          align="center"
          label="标识"
          prop="code"
        ></el-table-column>
        <el-table-column
          align="center"
          label="描述"
          prop="description"
        ></el-table-column>
        <el-table-column align="center" label="操作">
          <template v-slot="{ row }">
            <el-button v-if="row.type === 1" type="text">添加</el-button>
            <el-button type="text">编辑</el-button>
            <el-button type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 新增编辑弹层 -->
    <el-dialog :visible="showDialog" title="新增编辑">
      <!-- 表单 -->
      <el-form label-width="120">
        <el-form-item label="名称">
          <el-input v-model="formDate.name" style="width: 90%"></el-input>
        </el-form-item>
        <el-form-item label="标识">
          <el-input v-model="formDate.code" style="width: 90%"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="formDate.description"
            style="width: 90%"
          ></el-input>
        </el-form-item>
        <el-form-item label="开启">
          <!-- 当值为1时 激活 当值为0时 不激活 -->
          <el-switch
            v-model="formDate.enVisible"
            active-value="1"
            inactive-value="0"
            style="width: 90%"
          ></el-switch>
        </el-form-item>
      </el-form>

      <!-- 底部的确定和取消 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" size="small">确定</el-button>
          <el-button size="small">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getPermissionList } from "@/api/permission";
import { tranListToTreeDate } from "@/utils";
export default {
  data() {
    return {
      list: [], // 存放全部权限数据
      showDialog: true, // 控制新增 编辑弹层的显示
      formDate: {
        name: "", // 名称
        code: "", // 标识
        description: "", // 描述
        type: "", // 类型 该类型 不需要显示
        pid: "", // 因为做的是树  需要知道添加到哪个节点下了
        enVisible: "0", // 开启
      },
    };
  },
  created() {
    this.getPermissionList();
  },
  methods: {
    async getPermissionList() {
      // 将数据转换成了带 children 的树形结构
      this.list = tranListToTreeDate(await getPermissionList(), "0");
    },
  },
};
</script>

<style>
</style>
