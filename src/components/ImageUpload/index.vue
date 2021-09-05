<template>
  <div>
    <!-- el-upload 是用于上传的组件 给里面添加list-type 就是 显示正方形虚线 里面加号 -->
    <!-- limit 表示允许上传图片的个数  action 表示腾讯云的地址，现在用#站位 -->
    <el-upload
      list-type="picture-card"
      :limit="1"
      action="#"
      :on-preview="preview"
      :file-list="fileList"
      :class="{disabled:fileComputed}"
      :on-remove="handleRemove"
      :on-change="changeFile"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="showDialog" style="width:100%;" title="图片预览">
      <img :src="imgUrl" alt />
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fileList: [
        {
          url:
            "https://img1.baidu.com/it/u=1166503026,41947489&fm=26&fmt=auto&gp=0.jpg"
        }
      ],
      showDialog: false, // 控制查看图片弹层
      imgUrl: "" // 用于存放赋值的图片地址
    };
  },
  methods: {
    // 这个file 值可以获取到 data中的图片地址 和一个 dit 和一个success
    // 点击预览图片事件
    preview(file) {
      this.imgUrl = file.url;
      this.showDialog = true;
    },
    // 移除图片事件， file可以拿到我要删除的数据(要删除的文件)， fileList(删过之后的文件) 表示一个空数组
    handleRemove(file, fileList) {
      this.fileList = this.fileList.filter(item => item.uid !== file.uid); // 将当前的删除文件排除在外
      // this.fileList = fileList;
    },
    // 上传图片事件  不能使用push 这个钩子会执行多次
    changeFile(file, fileList) {
      /* 
        file是当前的文件  fileList 是当前的最新数组 
      */
      this.fileList = fileList.map(item => item);
      /* 
        这里为何暂时不成功呢？ 因为现在还没有上传 第二次进来的时候数据 一定是空的
        如果完成上传动作 第一次进入 和第二次进去的fileList的长度应该都是1 应该都有数据
        上传成功 => 数据才能进来 => 腾讯云cos
      */
    }
  },
  computed: {
    // 如果返回的值为true，表示就不应该显示 + 号上传了
    fileComputed() {
      return this.fileList.length === 1;
    }
  }
};
</script>

<style>
.disabled .el-upload--picture-card {
  display: none;
}
</style>