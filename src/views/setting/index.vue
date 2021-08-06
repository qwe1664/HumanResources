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
            <el-table border>
              <el-table-column label="序号" width="120px"></el-table-column>
              <el-table-column label="名称" width="240px"></el-table-column>
              <el-table-column label="描述"></el-table-column>
              <el-table-column label="操作">
                <el-button size="small" type="success">分配权限</el-button>
                <el-button size="small" type="primary">编辑</el-button>
                <el-button size="small" type="danger">删除</el-button>
              </el-table-column>
            </el-table>
            <!-- 放置分页组件 -->
            <el-row type="flex" justify="center" align="middle" style="height:60px">
              <el-pagination layout="prev,pager,next"></el-pagination>
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
                <el-input disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input type="textarea" :rows="3" disabled style="width:400px" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style>
</style>
