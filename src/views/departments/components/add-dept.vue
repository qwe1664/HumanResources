<template>
  <!-- 放置弹层组件 -->
  <el-dialog title="新增部门" :visible="showDialog" @close="btnCancel">
    <el-form ref="deptForm" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" placeholder="1-50个字符" style="width:80%;"></el-input>
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" placeholder="1-50个字符" style="width:80%;"></el-input>
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select
          @focus="getEmployessSimple"
          v-model="formData.manager"
          placeholder="请选择"
          style="width:80%;"
        >
          <el-option
            v-for="item in peoples"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          v-model="formData.introduce"
          type="textarea"
          :rows="3"
          placeholder="1-300个字符"
          style="width:80%;"
        ></el-input>
      </el-form-item>
    </el-form>
    <!-- 确定和消息 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button @click="btnOK" type="primary" size="small">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartments, addDepartments } from "@/api/departments";
// 导入获取用户简单数据 接口
import { getEmployessSimple } from "@/api/employees";
export default {
  props: {
    showDialog: {
      // 控制新增弹窗的显示
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: null
    }
  },
  data() {
    const checkNameRepeat = async (rule, value, callback) => {
      const { depts } = await getDepartments();
      const isRepeat = depts
        .filter(item => item.pid === this.treeNode.id)
        .some(item => item.name === value);
      isRepeat
        ? callback(new Error(`同级部门下已经存在这个${value}部门了`))
        : callback();
    };
    const checkCodeRepeat = async (rule, value, callback) => {
      const { depts } = await getDepartments();
      const isRepeat = depts.some(item => item.code === value && value);
      isRepeat
        ? callback(new Error(`组织架构下已经存在这个${value}编码了`))
        : callback();
    };
    return {
      formData: {
        name: "", //部门名称
        code: "", // 部门编码
        manager: "", // 部门管理者
        introduce: "" // 部门介绍
      },
      rules: {
        name: [
          { required: true, message: "部门名称不能为空", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "部门名称长度为1-50个字符",
            trigger: "blur"
          },
          { validator: checkNameRepeat, trigger: "blur" }
        ],
        code: [
          { required: true, message: "部门编码不能为空", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "部门编码长度为1-50个字符",
            trigger: "blur"
          },
          { validator: checkCodeRepeat, trigger: "blur" }
        ],
        manager: [
          { required: true, message: "部门负责人不能为空", trigger: "blur" }
        ],
        introduce: [
          { required: true, message: "部门介绍不能为空", trigger: "blur" },
          {
            min: 1,
            max: 300,
            message: "部门介绍长度为1-300个字符",
            trigger: "blur"
          }
        ]
      }, // 校验规则
      peoples: [] // 接收获取的员工简单列表的数据
    };
  },
  methods: {
    async getEmployessSimple() {
      this.peoples = await getEmployessSimple();
    },
    // 点击确定按钮,把表单中的值添加进后台数据，并且通知父组件重新获取数据更新视图
    btnOK() {
      this.$refs.deptForm.validate(async isOK => {
        if (isOK) {
          // 表单验证通过
          // 表示添加进来的数据中的pid 为我所点击元素的里面的id
          await addDepartments({ ...this.formData, pid: this.treeNode.id });
          // 通知父组件重新拉取数据
          this.$emit("addDepts");
          // 此时应该去修改showDialog的值,利用update跟上本页面需要修改的值，后面跟上一个修改为的值，父组件通过.sync进行接收
          // update:props名称
          this.$emit("update:showDialog", false);
          // 关闭dialog的时候会 触发 el-dialog的close 事件
          // 所以这里不需要再单独的重置数据了
        }
      });
    },
    // 点击取消按钮，关闭弹层，并且关闭表单验证
    btnCancel() {
      // 关闭弹层
      this.$emit("update:showDialog", false);
      // 清除之前的校验
      this.$refs.deptForm.resetFields();
    }
  }
};
</script>

<style>
</style>