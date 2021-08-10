<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户信息">
            <el-form
              label-width="120px"
              style="margin-left:120px;margin-top:30px"
              :model="userInfo"
              :rules="rules"
              ref="userForm"
            >
              <el-form-item label="用户名" prop="username">
                <el-input style="width:300px" v-model="userInfo.username"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password2">
                <el-input style="width:300px" type="password" v-model="userInfo.password2"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveUser">保存</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <!-- <UserInfo></UserInfo> -->
            <!-- 动态组件  他可以切换组件，修改绑定的is属性 显示不同的组件 -->
            <component :is="UserComponent"></component>
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <component :is="JobComponent"></component>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { saveUserDetailById } from "@/api/employees";
import { getUserDetailById } from "@/api/user"; // 读取用户信息
import UserInfo from "./components/user-info"; // 个人组件
import JobInfo from "./components/job-info";
export default {
  data() {
    return {
      UserComponent: "UserInfo",
      JobComponent: "JobInfo",
      userId: this.$route.params.id, // 直接讲路由中的参数 赋值给了 data中的属性
      userInfo: {
        //   专门存放基本信息
        username: "",
        password2: ""
      },
      rules: {
        username: [
          { required: true, message: "姓名不能为空", trigger: "blur" }
        ],
        password2: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { min: 6, max: 9, message: "密码长度6-9位", trigger: "blur" }
        ]
      }
    };
  },
  components: {
    UserInfo,
    JobInfo
  },
  created() {
    this.getUserDetailById();
  },
  methods: {
    async getUserDetailById() {
      this.userInfo = await getUserDetailById(this.userId);
    },

    async saveUser() {
      // 调用方法时 应该校验
      try {
        await this.$refs.userForm.validate();
        await saveUserDetailById({
          ...this.userInfo,
          password: this.userInfo.password2
        });
        this.$message.success("修改密码成功");
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>

<style>
</style>
