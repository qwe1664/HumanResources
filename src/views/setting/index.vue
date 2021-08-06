<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 放置内容 -->
      <el-card>
        <el-tabs>
          <!-- 左侧内容 -->
          <el-tab-pane label="角色管理">
            <!-- 按钮 -->
            <el-row style="height:60px">
              <el-button size="small" icon="el-icon-plus" type="primary">新增角色</el-button>
            </el-row>
            <!-- 表格 -->
            <!-- 给表格绑定数据 -->
            <el-table border :data="list">
              <el-table-column align="center" type="index" label="序号" width="120px"></el-table-column>
              <el-table-column prop="name" label="名称" width="240px"></el-table-column>
              <el-table-column prop="description" label="描述"></el-table-column>
              <el-table-column label="操作">
                <el-button size="small" type="success">分配权限</el-button>
                <el-button size="small" type="primary">编辑</el-button>
                <el-button size="small" type="danger">删除</el-button>
              </el-table-column>
            </el-table>
            <!-- 放置分页组件 -->
            <!-- 放置分页组件 -->
            <el-row type="flex" justify="center" align="middle" style="height:60px">
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
            <el-form label-width="120px" style="margin-top:50px">
              <el-form-item label="公司名称">
                <el-input v-model="formDate.name" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formDate.companyAddress" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="电话">
                <el-input v-model="formDate.companyPhone" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formDate.mailbox" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  v-model="formDate.remarks"
                  type="textarea"
                  :rows="3"
                  disabled
                  style="width:400px"
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getRoleList, getCompanyInfo } from "@/api/setting";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      list: [], // 用于存放请求数据返回的数组
      page: {
        // 放置页码及相关数据
        page: 1,
        pagesize: 10,
        total: 0 // 记录总数
      },
      formDate: {
        // 公司信息
      }
    };
  },
  computed: {
    ...mapGetters(["companyId"])
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
    }
  }
};
</script>

<style>
</style>
