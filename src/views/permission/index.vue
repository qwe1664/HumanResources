<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 靠右的按钮 -->
      <page-tools>
        <template v-slot:after>
          <el-button type="primary" size="small" @click="addPermission(1, '0')"
            >权限管理</el-button
          >
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
            <el-button
              @click="addPermission(2, row.id)"
              v-if="row.type === 1"
              type="text"
              >添加</el-button
            >
            <el-button type="text" @click="editPermission(row.id)"
              >编辑</el-button
            >
            <el-button type="text" @click="delPermission(row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 新增编辑弹层 -->
    <el-dialog
      :visible="showDialog"
      :title="showText"
      width="600px"
      @close="btnCancel"
    >
      <!-- 表单 -->
      <el-form
        ref="permForm"
        :model="formDate"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="formDate.name" style="width: 90%"></el-input>
        </el-form-item>
        <el-form-item label="标识" prop="code">
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
          <el-button type="primary" size="small" @click="btnOK">确定</el-button>
          <el-button size="small" @click="btnCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  getPermissionList,
  addPermission,
  updatePermission,
  getPermissionDetail,
  delPermission,
} from "@/api/permission";
import { tranListToTreeDate } from "@/utils";
export default {
  data() {
    return {
      list: [], // 存放全部权限数据
      showDialog: false, // 控制新增 编辑弹层的显示
      formDate: {
        name: "", // 名称
        code: "", // 标识
        description: "", // 描述
        type: "", // 类型 该类型 不需要显示
        pid: "", // 因为做的是树  需要知道添加到哪个节点下了
        enVisible: "0", // 开启
      },
      rules: {
        name: [
          { required: true, message: "权限名称不能为空", trigger: "blur" },
        ],
        code: [
          { required: true, message: "权限标识不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getPermissionList();
  },
  computed: {
    showText() {
      return this.formDate.id ? "编辑" : "新增";
    },
  },
  methods: {
    async getPermissionList() {
      // 将数据转换成了带 children 的树形结构
      this.list = tranListToTreeDate(await getPermissionList(), "0");
    },

    // 删除功能
    async delPermission(id) {
      this.$confirm("确认删除该权限吗")
        .then(() => {
          return delPermission(id);
        })
        .then(() => {
          this.$message.success("删除成功");
          // 重新拉取数据
          this.getPermissionList();
        });
    },

    // 新增、编辑弹层
    addPermission(type, pid) {
      // 访问权的type =1 ，按钮操作权 type =2
      // pid 表示当前数据的父节点的标识
      // 记录当前添加的类型和父标识
      this.formDate.type = type;
      this.formDate.pid = pid;
      this.showDialog = true;
    },

    // 弹层确定按钮
    btnOK() {
      this.$refs.permForm
        .validate()
        .then(() => {
          // 校验成功

          if (this.formDate.id) {
            // 如果formDate 里面有id 标识 编辑
            return updatePermission(this.formDate);
          }
          return addPermission(this.formDate); // 新增接口
        })
        .then(() => {
          // 提示用户成功
          this.$message.success("操作成功");
          this.getPermissionList();
          this.showDialog = false;
        });
    },

    // 弹层取消按钮
    btnCancel() {
      // 重置数据
      this.formDate = {
        name: "", // 名称
        code: "", // 标识
        description: "", // 描述
        type: "", // 类型 该类型 不需要显示
        pid: "", // 因为做的是树  需要知道添加到哪个节点下了
        enVisible: "0", // 开启
      };
      // 移除校验
      this.$refs.permForm.resetFields(); // 移除校验
      // 关闭弹层
      this.showDialog = false;
    },

    // 点击编辑操作
    async editPermission(id) {
      this.formDate = await getPermissionDetail(id);
      this.showDialog = true;
    },
  },
};
</script>

<style>
</style>
