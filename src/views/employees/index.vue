<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTools :show-before="true">
        <!-- 左侧显示总记录数 -->
        <span slot="before">共{{ page.total }}条记录</span>
        <!-- 右侧显示按钮 excel导入 excel导出 新增员工 -->
        <template #after>
          <el-button
            size="small"
            type="success"
            @click="$router.push('/import')"
            >导入excel</el-button
          >
          <el-button size="small" type="danger" @click="exportData"
            >导出excel</el-button
          >
          <el-button
            size="small"
            type="primary"
            class="el-icon-plus"
            @click="showDialog = true"
            >新增员工</el-button
          >
        </template>
      </PageTools>
      <!-- 表格组件 -->
      <el-table border v-loading="loading" :data="list">
        <el-table-column type="index" label="序号" sortable />
        <el-table-column prop="username" label="姓名" sortable />
        <el-table-column prop="workNumber" label="工号" sortable />
        <el-table-column
          prop="formOfEmployment"
          label="聘用形式"
          sortable
          :formatter="formatEmployment"
        />
        <el-table-column prop="departmentName" label="部门" sortable />
        <el-table-column prop="timeOfEntry" label="入职时间" sortable>
          <!-- 讲时间格式化 -->
          <template v-slot="{ row }">{{
            row.timeOfEntry | formatDate
          }}</template>
        </el-table-column>
        <el-table-column prop="enableState" label="账户状态" sortable>
          <!-- <template v-slot="{row}">
            <el-switch :value="row.enableState === 0"></el-switch>
          </template>-->
          <el-switch :value="true"></el-switch>
        </el-table-column>
        <el-table-column label="操作" sortable fixed="right" width="280">
          <template v-slot="{ row }">
            <el-button
              type="text"
              size="small"
              @click="$router.push(`employees/detail/${row.id}`)"
              >查看</el-button
            >
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small">角色</el-button>
            <el-button type="text" size="small" @click="delEmployee(row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column> </el-table
      >F
      <!-- 分页组件 -->
      <el-row type="flex" justify="center" align="middle" style="height: 60px">
        <el-pagination
          :current-page="page.page"
          :page-size="page.size"
          :total="page.total"
          layout="prev,pager,next"
          @current-change="changePage"
        ></el-pagination>
      </el-row>
    </div>

    <!-- 放置弹层 -->
    <AddEmployee :showDialog.sync="showDialog"></AddEmployee>
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from "@/api/employees";
import EmployeeEnum from "@/api/constant/employees";
import AddEmployee from "./components/add-employee";
import { formatDate } from "@/filters";
export default {
  data() {
    return {
      list: [], // 接收数组
      page: {
        page: 1, // 当前页数
        size: 10, // 一页显示的数据
        total: 0, // 总条数
      },
      loading: false, // 显示遮罩层
      showDialog: false, // 控制新增弹层的显示
    };
  },
  created() {
    this.getEmployeeList();
  },
  methods: {
    // 获取后台中员工综合列表
    async getEmployeeList() {
      this.loading = true;
      // 结构里面的数据 和总数量 赋值给data中的值
      const { total, rows } = await getEmployeeList(this.page);
      this.list = rows;
      this.page.total = total;
      this.loading = false;
    },
    // 给分页切换一个点击事件，将最新的页码赋值给data中的page页码数
    changePage(newPage) {
      this.page.page = newPage;
      // 从新调用方法更新页面
      this.getEmployeeList();
    },
    // 格式化 聘用形式
    formatEmployment(row, column, cellValue, index) {
      // 去寻找导入的文件中的 hireType对象 find 筛选里面 的id值 和我当前列中的值相等的
      const obj = EmployeeEnum.hireType.find((item) => item.id === cellValue);
      return obj ? obj.value : "未知";
    },
    // 点击删除，删除员工
    async delEmployee(id) {
      try {
        await this.$confirm("您确认删除该员工吗");
        await delEmployee(id);
        this.getEmployeeList();
        this.$message.success("员工删除成功");
      } catch (error) {
        console.log("error");
      }
    },
    exportData() {
      const headers = {
        姓名: "username",
        手机号: "mobile",
        入职日期: "timeOfEntry",
        聘用形式: "formOfEmployment",
        转正日期: "correctionTime",
        工号: "workNumber",
        部门: "departmentName",
      };
      // 导出excel
      import("@/vendor/Export2Excel").then(async (excel) => {
        // excel 是引入文件的导出对象
        const { rows } = await getEmployeeList({
          page: 1,
          size: this.page.total,
        });
        const data = this.formtJson(headers, rows);
        const multiHeader = [["姓名", "主要信息", "", "", "", "", "部门"]];
        const merges = ["A1:A2", "B1:F1", "G1:G2"];
        excel.export_json_to_excel({
          header: Object.keys(headers), // 导出数据的表头
          data, // 导出的具体数据
          filename: "员工工资表", // 导出的表名
          // bookTyppe:'xlsx'  导出的文件格式
          multiHeader,
          merges,
        });
      });
    },
    formtJson(headers, rows) {
      return rows.map((item) => {
        return Object.keys(headers).map((key) => {
          if (
            headers[key] === "timeOfEntry" ||
            headers[key] === "correctionTime"
          ) {
            return formatDate(item[headers[key]]);
          } else if (headers[key] === "formOfEmployment") {
            const obj = EmployeeEnum.hireType.find(
              (obj) => obj.id === item[headers[key]]
            );
            return obj ? obj.value : "未知";
          }
          return item[headers[key]];
        });
      });
    },
  },
  components: {
    AddEmployee,
  },
};
</script>

<style>
</style>
