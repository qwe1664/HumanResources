<template>
  <!-- 弹层 -->
  <el-dialog :visible="showDialog" title="新增员工">
    <!-- 表单 -->
    <el-form label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="姓名" prop="username">
        <el-input style="width:50%" placeholder="请输入姓名" v-model="formData.username" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input style="width:50%" placeholder="请输入手机号" v-model="formData.mobile" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker style="width:50%" placeholder="请选择入职时间" v-model="formData.timeOfEntry" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select style="width:50%" placeholder="请选择" v-model="formData.formOfEmployment" >
          <el-option v-for="item in EmployeeEnum.hireType" :key="item.id" :label="item.value" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input style="width:50%" placeholder="请输入工号" v-model="formData.workNumber" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input
          style="width:50%"
          placeholder="请选择部门"
          v-model="formData.departmentName"
          @focus="getDepartments"
        />
        <!-- 放置一个tree 组件 -->
        <el-tree
          :data="treeData"
          :props="{label:'name'}"
          :default-expand-all="true"
          v-if="showTree"
          v-loading="loading"
          @node-click="selectNode"
        ></el-tree>
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker style="width:50%" placeholder="请选择转正时间" v-model="formData.correctionTime" />
      </el-form-item>
    </el-form>

    <!-- footer插槽 -->
    <!-- 也可以直接在 row 身上写  slot="footer" -->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="qx">取消</el-button>
          <el-button size="small" type="primary">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import { getDepartments } from "@/api/departments";
import { addEmployee } from "@/api/employees";
import { tranListToTreeDate } from "@/utils";
import EmployeeEnum from '@/api/constant/employees'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      EmployeeEnum, // 存放在api文件夹下引入对 聘用形式的存放
      // 绑定表单数据
      formData: {
        username: "",
        mobile: "",
        formOfEmployment: "",
        workNumber: "",
        departmentName: "",
        timeOfEntry: "",
        correctionTime: ""
      },
      rules: {
        username: [
          { required: true, message: "姓名不能为空", trigger: "blur" },
          { min: 2, max: 5, message: "用户姓名为2-5位", trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "手机号格式不正确",
            trigger: "blur"
          }
        ],
        formOfEmployment: [
          { required: true, message: "聘用形式不能为空", trigger: "blur" }
        ],
        workNumber: [
          { required: true, message: "工号不能为空", trigger: "blur" }
        ],
        departmentName: [
          { required: true, message: "部门不能为空", trigger: "change" }
        ],
        timeOfEntry: [
          { required: true, message: "入职时间不能为空", trigger: "blur" }
        ],
        correctionTime: [
          { required: true, message: "转正时间不能为空", trigger: "blur" }
        ]
      },
      treeData: [], // 用于存放转换好的树形结构
      showTree: false, // 默认不显示树形组件
      loading: false // 控制 打开部门时 加开卡顿,控制树的显示和隐藏进度条
    };
  },
  created() {},
  methods: {
    // 获取后台数据，并将扁平数组转换为树形结构
    async getDepartments() {
      this.showTree = true;
      this.loading = true;
      const { depts } = await getDepartments();
      this.treeData = tranListToTreeDate(depts, "");
      // console.log(this.treeData);
      this.loading = false;
    },
    // 点击弹层中 部门时触发
    // 当不清楚一个事件中有多少参数，是干嘛的 可以通过 arguments 打印出全部的参数
    selectNode(node) {
      this.formData.departmentName = node.name;
      this.showTree = false;
    },

    // 点击取消 关闭弹窗
    qx() {
      this.$emit("update:showDialog", false);
    }
  }
};
</script>

<style>
</style>