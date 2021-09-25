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
      :class="{ disabled: fileComputed }"
      :on-remove="handleRemove"
      :on-change="changeFile"
      :before-upload="beforeUpload"
      :http-request="upload"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-progress
      v-if="showPercent"
      :percentage="percent"
      style="width: 180px"
    ></el-progress>
    <el-dialog :visible.sync="showDialog" style="width: 100%" title="图片预览">
      <img :src="imgUrl" alt />
    </el-dialog>
  </div>
</template>

<script>
import COS from "cos-js-sdk-v5"; // 引入腾讯云cos包
// 实例化cos对象
const cos = new COS({
  SecretId: "AKIDc3FBvQfeNr53lESQ9cssc7NN6YjfKjrj", // 身份识别 ID
  SecretKey: "dz4sQhhRwBBvQhiTyEF0VllV0GG0UihP", // 身份密钥
});
export default {
  data() {
    return {
      fileList: [],
      showDialog: false, // 控制查看图片弹层
      imgUrl: "", // 用于存放赋值的图片地址
      currentFileUid: null, // 记录当前正在上传的uid
      percent: 0, // 记录当前的上传进度的百分比
      showPercent: false, // 控制进度条的显示
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
      this.fileList = this.fileList.filter((item) => item.uid !== file.uid); // 将当前的删除文件排除在外
      // this.fileList = fileList;
    },
    // 上传图片事件  不能使用push 这个钩子会执行多次
    changeFile(file, fileList) {
      /* 
        file是当前的文件  fileList 是当前的最新数组 
      */
      this.fileList = fileList.map((item) => item);
      /* 
        这里为何暂时不成功呢？ 因为现在还没有上传 第二次进来的时候数据 一定是空的
        如果完成上传动作 第一次进入 和第二次进去的fileList的长度应该都是1 应该都有数据
        上传成功 => 数据才能进来 => 腾讯云cos
      */
    },
    beforeUpload(file) {
      // 先检查文件类型
      const types = ["image/jpeg", "image/gif", "image/bmp", "image/png"];
      if (!types.some((item) => item === file.type)) {
        // 如果不存在
        this.$message.success("上传图片只能是 JPG、GIF、BMP、PNG 格式！");
        return false; // 上传终止
      }
      // 检查文件大小 5M 1M = 1024KB 1KB = 1024B
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        this.$message.success("上传的图片大小不能大于5M");
        return false;
      }

      this.currentFileUid = file.uid;
      return true; // 最后一定要 return true
    },
    upload(params) {
      if (params.file) {
        cos.putObject(
          {
            Bucket: "yangyun-1259759595", // 存储桶
            Region: "ap-nanjing", // 地域
            key: params.file.name, // 文件名
            Body: params.file, // 要上传的文件对象
            StroageClass: "STANDARD", // 上传的模式类型 直接默认 标准模式即可

            onProgress: (params) => {
              this.percent = params.percent * 100;
            },
          },
          (err, data) => {
            // data 返回数据之后 应该如何处理
            console.log(err || data);

            if (!err && data.statusCode === 200) {
              /* 
                此时说明文件上传成功 要获取成功的返回地址
                fileList 才能显示到上传组件上 此时我们要讲 fileList中的数据
                的url地址变成 现在上传成功的地址
                目前虽然是一张图片 但是请注意 我们的fileList 是一个数组
                需要知道当前上传成功的是哪一张图片
              */

              this.fileList = this.fileList.map((item) => {
                // 去找谁的uid 等于刚刚记录下来的id
                if (item.uid === this.currentFileUid) {
                  // 将成功的地址赋值给原来的url 属性
                  return { url: "http://" + data.Location, upload: true };
                  // upload 为true 表示这张图片已经上传完毕，这个属性为我们后期应用的时候做标记
                }
                return item;
              });

              // 关闭进度条
              // 重置百分比
              setTimeout(() => {
                this.showPercent = false;
                this.percent = 0;
              }, 300);

              // 将上传成功的地址 回写到了 fileList中
            }
          }
        );
      }
    },
  },
  computed: {
    // 如果返回的值为true，表示就不应该显示 + 号上传了
    fileComputed() {
      return this.fileList.length === 1;
    },
  },
};
</script>

<style>
.disabled .el-upload--picture-card {
  display: none;
}
</style>