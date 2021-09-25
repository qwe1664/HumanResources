<template>
  <el-dialog :visible="showDialog" title="新增员工" @close="btnCancel">
    <!-- 表单 -->
    <el-form ref="addEmployee" label-width="120px" :rules="rules" :model="formData">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" style="width:70%" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" style="width:70%" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" style="width:70%" placeholder="请选择入职时间"></el-date-picker>
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" style="width:70%" placeholder="请选择聘用形式">
          <el-option
            v-for="item in EmployeeEnum.hireType"
            :value="item.id"
            :label="item.value"
            :key="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" style="width:70%" placeholder="请输入工号"></el-input>
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <!-- <el-input
          @focus="getDepartments"
          v-model="formData.departmentName"
          style="width:70%"
          placeholder="请输入部门"
        ></el-input>-->
        <el-cascader
          v-model="formData.departmentName"
          :options="treeData"
          :props="{ expandTrigger: 'hover' ,label:'name',value:'name'}"
          @change="handleChange"
          @focus="getDepartments"
          style="width:70%"
          placeholder="请选择部门"
        ></el-cascader>
        <!-- @node-click="selectNode" -->
        <!-- 放置数型组件 -->
        <!-- <el-tree
          default-expand-all
          v-loading="loading"
          :data="treeData"
          :props="defaultProps"
          v-if="showTree"
          @node-click="selectNode"
        ></el-tree>-->
      </el-form-item>
      <el-form-item label="转正日期" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" style="width:70%" placeholder="请选择转正日期"></el-date-picker>
      </el-form-item>
    </el-form>
    <el-row type="flex" justify="center" slot="footer">
      <el-col :span="6">
        <el-button size="small" @click="btnCancel">取消</el-button>
        <el-button size="small" type="primary" @click="btnOK">确定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartments } from "@/api/departments";
import { addEmployee } from "@/api/employees";
import { tranListToTreeDate } from "@/utils";
import EmployeeEnum from "@/api/constant/employees";
export default {
  name: "AddEmploy",
  /* 
    父组件也可以通过 v-model 传递过来值 默认的值为value，如果需要修改默认的值为input
    如果想要修改名称  通过 model：{prop：修改值，event：修改事件名称}
    如果子组件想要直接修改  this.$emit('修改事件名称',true)
  */
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 定义表单数据
      formData: {
        username: "",
        mobile: "",
        formOfEmployment: "",
        workNumber: "",
        departmentName: "",
        timeOfEntry: "",
        correctionTime: ""
      },
      treeData: [], // 用于存放 树形数据的数组
      defaultProps: {
        // 修改树形结构中 默认找的是label值，返回的数据是找name
        label: "name",
        value: "name"
      },
      showTree: false, // 默认不显示树形结构
      loading: false, // 控制加载转圈等待的显示
      EmployeeEnum, // 在data中定义数据 用来循环员工的 聘用形式
      rules: {
        // 表单的校验规则
        username: [
          { required: true, message: "姓名不能为空", trigger: "blur" },
          { min: 2, max: 5, message: "用户行为为2-5位", trigger: "blur" }
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
          { required: true, message: "转正不能为空", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    // 获取 组织架构中的 数据，并将数据转化为 树形数据 赋值给data中的tree 数组存放
    async getDepartments() {
      this.showTree = true;
      this.loading = true;
      const { depts } = await getDepartments();
      console.log(depts);

      this.treeData = tranListToTreeDate(depts, "");
      this.loading = false;
    },
    // 获取到用户点击了树形数据中的值 ，并且赋值给表单中所对应的部门项目,然后关闭树形结构
    // selectNode(node) {
    //   this.formData.departmentName = node.name;
    //   this.showTree = false;
    // },
    // 级联菜单的事件点击讲里面的值，赋值给表单中对应的值
    handleChange(value) {
      console.log(value);
      // 将这个选中数组的最后一个值，当做我们所选中的
      this.formData.departmentName = value[value.length - 1];
    },
    // 点击确定后，讲表单中的值提交给接口
    // 然后通知父组件重新渲染数据
    async btnOK() {
      try {
        await this.$refs.addEmployee.validate();
        await addEmployee(this.formData);
        // $parent 可以拿到父组件的实例 但是有条件，用的不多
        this.$parent.getEmployeeList();
        this.$emit("update:showDialog", false);
        this.$message.success("新增员工成功");
        // 这里的关闭弹层，会触发弹层的close事件， close事件会重置表单
      } catch (error) {
        console.log(error);
      }
    },
    // 点击取消，重置表单，移除验证规则，并且关闭弹层
    btnCancel() {
      this.formData = {
        username: "",
        mobile: "",
        formOfEmployment: "",
        workNumber: "",
        departmentName: "",
        timeOfEntry: "",
        correctionTime: ""
      };
      this.$refs.addEmployee.resetFields(); // 重置校验结果
      this.$emit("update:showDialog", false);
    }
  }
};
</script>

<style>
</style>