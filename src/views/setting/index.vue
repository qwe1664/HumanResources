<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 放置内容 -->
      <el-card>
        <el-tabs>
          <!-- 左侧内容 -->
          <el-tab-pane label="角色管理">
            <!-- 按钮 -->
            <el-row style="height: 60px">
              <el-button
                @click="showDialog = true"
                size="small"
                icon="el-icon-plus"
                type="primary"
                >新增角色</el-button
              >
            </el-row>
            <!-- 表格 -->
            <!-- 给表格绑定数据 -->
            <el-table border :data="list">
              <el-table-column
                align="center"
                type="index"
                label="序号"
                width="120px"
              ></el-table-column>
              <el-table-column
                prop="name"
                label="名称"
                width="240px"
              ></el-table-column>
              <el-table-column
                prop="description"
                label="描述"
              ></el-table-column>
              <el-table-column label="操作">
                <!-- 作用域插槽  结构出里面的数据 -->
                <template slot-scope="{ row }">
                  <el-button
                    size="small"
                    type="success"
                    @click="assignPerm(row.id)"
                    >分配权限</el-button
                  >
                  <el-button
                    size="small"
                    type="primary"
                    @click="editRole(row.id)"
                    >编辑</el-button
                  >
                  <el-button
                    size="small"
                    type="danger"
                    @click="deleteRole(row.id)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <!-- 放置分页组件 -->
            <!-- 放置分页组件 -->
            <el-row
              type="flex"
              justify="center"
              align="middle"
              style="height: 60px"
            >
              <el-pagination
                :current-page="page.page"
                :page-size="page.pagesize"
                :total="page.total"
                layout="prev, pager, next"
                @current-change="changePage"
              />
            </el-row>
          </el-tab-pane>
          <!-- 右侧内容 -->
          <el-tab-pane label="公司信息">
            <!-- 显示头部公司消息，不允许删除 -->
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <!-- 在表单中显示公司的基本信息，不允许修改 -->
            <el-form label-width="120px" style="margin-top: 50px">
              <el-form-item label="公司名称">
                <el-input
                  v-model="formDate.name"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input
                  v-model="formDate.companyAddress"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="电话">
                <el-input
                  v-model="formDate.companyPhone"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input
                  v-model="formDate.mailbox"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  v-model="formDate.remarks"
                  type="textarea"
                  :rows="3"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>

    <!-- 放置一个弹层组件 -->
    <!-- close事件 在点击确定的时候会触发 -->
    <el-dialog title="编辑部门" :visible="showDialog" @close="btnCancel">
      <el-form
        ref="roleForm"
        label-width="120px"
        :model="roleForm"
        :rules="rules"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description"></el-input>
        </el-form-item>
      </el-form>
      <!-- 放置footer插槽 -->
      <el-row type="flex" justify="center">
        <el-col :span="8">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button type="primary" size="small" @click="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>

    <!-- 放置一个分配权限弹层 -->
    <el-dialog
      title="分配权限"
      :visible="showPermDialog"
      @close="btnPermCancel"
    >
      <!-- 分配权限  权限是一棵树 -->
      <!-- 将数据绑定到组件上 -->
      <!-- check-strictly 如果为true 那表示父子勾选时， 不互相关联 如果为false就互相关联 -->
      <!-- node-key 中的id 作为树形的唯一标识 -->
      <el-tree
        ref="permTree"
        :data="permDate"
        :props="defaultProps"
        :default-expand-all="true"
        :show-checkbox="true"
        :check-strictly="true"
        node-key="id"
        :default-checked-keys="selectCheck"
      ></el-tree>
      <!-- 确定和取消 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" size="small" @click="btnPermOK"
            >确定</el-button
          >
          <el-button size="small" @click="btnPermCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRoleList,
  getCompanyInfo,
  deleteRole,
  getRoleDetail,
  updateRole,
  addRole,
  assignPerm,
} from "@/api/setting";
import { mapGetters } from "vuex";
import { log } from "util";

import { getPermissionList } from "@/api/permission";
import { tranListToTreeDate } from "@/utils";
export default {
  data() {
    return {
      list: [], // 用于存放请求数据返回的数组
      page: {
        // 放置页码及相关数据
        page: 1,
        pagesize: 10,
        total: 0, // 记录总数
      },
      formDate: {
        // 公司信息
      },
      showDialog: false, // 控制弹层显示
      showPermDialog: false,
      roleForm: {
        name: "", //  角色名称
        description: "", // 角色描述
      },
      rules: {
        name: [
          { required: true, message: "角色名称不能为空", trigger: "blur" },
        ],
      },
      permDate: [], // 接收权限数据
      defaultProps: {
        label: "name",
      }, // 定义显示字段的名称 和子属性字段名称
      roleId: null, // 用来记录当前分配权限的id
      selectCheck: [], // 用来记录当前的权限点的标识
    };
  },
  computed: {
    ...mapGetters(["companyId"]),
  },
  created() {
    this.getRoleList(); // 获取角色列表
    this.getCompanyInfo();
  },
  methods: {
    async getRoleList() {
      const { total, rows } = await getRoleList();
      this.page.total = total;
      this.list = rows;
    },
    async getCompanyInfo() {
      this.formDate = await getCompanyInfo(this.companyId); // 赋值给fromDate
    },
    changePage(newPage) {
      this.page.page = newPage;
      this.getRoleList();
    },
    // 删除信息
    async deleteRole(id) {
      try {
        await this.$confirm("确认删除该角色吗");
        // 只有用户点击确认 才进入下面的程序，点击取消 进入 catch
        await deleteRole(id); // 调用 删除接口
        this.getRoleList(); // 重新加载数据
        this.$message.success("删除角色成功");
      } catch (error) {
        console.log(error);
      }
    },
    // 编辑信息
    async editRole(id) {
      this.roleForm = await getRoleDetail(id); // 实现数据回写
      this.showDialog = true; // 显示弹层
    },
    // 弹层中的确定事件
    async btnOK() {
      try {
        await this.$refs.roleForm.validate();
        if (this.roleForm.id) {
          //  当数据里面有id 表示执行的是编辑操作
          await updateRole(this.roleForm);
        } else {
          //  角色新增
          await addRole(this.roleForm);
        }
        this.getRoleList(); // 重新拉取数据，渲染页面
        this.$message.success("操作成功");
        this.showDialog = false; // 点击关闭弹层 会触发 el-dialog的事件close事件
      } catch (error) {
        console.log(error);
      }
    },
    // 弹层中的 取消事件
    btnCancel() {
      this.showDialog = false;
      // 点击弹层中的取消按钮 将表单滞空
      this.roleForm = {
        name: "",
        description: "",
      };
      // 点击取消 关闭 校验
      this.$refs.roleForm.resetFields();
    },

    // 分配权限按钮
    async assignPerm(id) {
      // 弹出 弹层
      this.permDate = tranListToTreeDate(await getPermissionList(), "0"); // 转化list到树形数据

      // 应该 获取 这个 id 的权限点
      this.roleId = id;
      // 有id 就可以 将 id 应该先记录下来
      const { permIds } = await getRoleDetail(id); // permIds是当前角色所拥有的权限点数据
      this.selectCheck = permIds; // 将当前角色所拥有的权限id赋值
      this.showPermDialog = true;
    },

    // 分配权限弹层中的确定按钮
    async btnPermOK() {
      // 调用el-tree的方法，监听到树形数据的选中状态
      // this.$refs.permTree.getCheckedKeys()
      await assignPerm({
        permIds: this.$refs.permTree.getCheckedKeys(),
        id: this.roleId,
      });

      this.$message.success("分配权限成功");
      // 关闭弹层
      this.showPermDialog = false;
    },

    // 分配权限弹层中的取消按钮
    btnPermCancel() {
      // 重置数据
      this.selectCheck = [];
      // 关闭弹层
      this.showPermDialog = false;
    },
  },
};
</script>

<style>
</style>
