<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <!-- 显示左侧的图标加文字 -->
        <template v-slot:before>
          <span slot="before">共{{page.total}}条记录</span>
        </template>

        <!-- 显示右侧按钮 -->
        <template v-slot:after>
          <el-button size="small" type="success" @click="$router.push('/import')">导入excel</el-button>
          <el-button size="small" type="danger">导出excel</el-button>
          <el-button size="small" type="primary" @click="showDialog=true">新增员工</el-button>
        </template>
      </page-tools>
      <!-- 表格组件 -->
      <el-card v-loading="loading">
        <el-table border :data="list">
          <el-table-column label="序号" sortable type="index" />
          <el-table-column label="姓名" sortable prop="username" />
          <el-table-column label="工号" sortable prop="workNumber" />
          <el-table-column
            label="聘用形式"
            sortable
            prop="formOfEmployment"
            :formatter="formatEmployment"
          />
          <el-table-column label="部门" sortable prop="departmentName" />
          <el-table-column label="入职时间" sortable prop="timeOfEntry">
            <!-- 将时间格式化 -->
            <template v-slot="{row}">{{row.timeOfEntry | formatDate}}</template>
          </el-table-column>
          <el-table-column label="账户状态" align="center" sortable prop="enableState">
            <template slot-scope="{ row }">
              <!-- 根据当前状态来确定 是否打开开关 -->
              <el-switch :value="row.enableState === 1" />
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable fixed="right" width="280">
            <!-- 通过作用于插槽 结构里面的数据，将点击的id传递给删除按钮 -->
            <template v-slot="{row}">
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button type="text" size="small" @click="delEmployee(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 放置分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height:60px">
          <el-pagination
            layout="prev,pager,next"
            :page-size="page.size"
            :current-page="page.page"
            :total="page.total"
            @current-change="changePage"
          ></el-pagination>
        </el-row>
      </el-card>
    </div>
    <!-- sync修饰符 是子组件 想要改变父组件中传递过去的值的一个语法糖，子组件中只需要update:修改名称，布尔值 -->
    <add-employee :show-dialog.sync="showDialog"></add-employee>
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from "@/api/employees";
import EmployeeEnum from "@/api/constant/employees";
import AddEmployee from "./components/add-employee";
export default {
  data() {
    return {
      list: [], // 存放请求接口返回的数据
      page: {
        page: 1, // 页数
        size: 10, // 每一页显示的数量
        total: 0 // 总数
      },
      loading: false, //   显示遮罩层
      showDialog: false // 控制用户新增弹层
    };
  },
  components: {
    AddEmployee
  },
  created() {
    this.getEmployeeList();
  },
  methods: {
    async getEmployeeList() {
      this.loading = true;
      // 结构出 调用接口获取的数据
      const { total, rows } = await getEmployeeList(this.page);
      console.log(rows);
      this.page.total = total;
      this.list = rows;
      this.loading = false;
    },
    // 控制分页
    changePage(newPage) {
      this.page.page = newPage; // 将点击的最新页码赋值给page对象中的页码
      this.getEmployeeList(); //在重新获取 数据 显示页面
    },
    // 格式化聘用形式
    // 行 列 单元格里面的数据 索引
    formatEmployment(row, column, cellValue, index) {
      // 要去找 1所对应的值
      const obj = EmployeeEnum.hireType.find(item => item.id === cellValue);
      return obj ? obj.value : "未知";
    },
    async delEmployee(id) {
      try {
        // 接收过来用户点击的id，提示用户是否删除
        await this.$confirm("您确定删除该员工吗");
        // 调用删除接口，传入 用户点击的id
        await delEmployee(id);
        // 调用重新获取数据接口 方法，重新渲染页面
        this.getEmployeeList();
        this.$message.success("删除员工成功");
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>

<style>
</style>
