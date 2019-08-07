<template>
  <div>
    <div class="demo-upload-list" v-model="uploadList">
      <template v-if="uploadList.status === 'finished'">
        <img :src="uploadList.url">
        <div class="demo-upload-list-cover">
          <Icon type="ios-eye-outline" @click.native="handleView"></Icon>
          <!--<Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>-->
        </div>
      </template>
      <template v-else>
        <Progress v-if="uploadList.showProgress" :percent="uploadList.percentage" hide-info></Progress>
      </template>
    </div>
    <div class="upload">
      <Upload
        ref="upload"
        type="select"
        name="myFile"
        :format="['jpg','jpeg','png']"
        :max-size="2048"
        :show-upload-list="false"
        :on-success="handleSuccess"
        :on-format-error="handleFormatError"
        :on-exceeded-size="handleMaxSize"
        :before-upload="handleBeforeUpload"
        action="//localhost:8080/upload"
        style="display: inline-block;width:58px;">
        <div style="width: 58px;height:58px;line-height: 58px;">
          <Icon type="ios-camera" size="20"></Icon>
        </div>
      </Upload>
    </div>
    <Modal title="图片详情" v-model="visible">
      <img :src="uploadList.url" v-if="visible" style="width: 100%">
    </Modal>
  </div>
</template>

<script>
  import './index.less'
  import {Message} from 'iview'

  export default {
    name: "upload",
    props: {
      defaultList: {
        type: Object,
        default: ''
      },
      avatarUrl: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        visible: false,
      }
    },
    computed: {
      uploadList() {
        console.log(this.defaultList);
        return this.defaultList;
      }
    },
    watch: {},
    methods: {
      handleView() {
        this.visible = true;
      },
      handleRemove(file) {
        // const fileList = this.$refs.upload.fileList;
        // this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
      },
      handleSuccess(res, file) {
        let avatUrl = res.data[0];
        let defaultList = {
          status: file.status,
          url: avatUrl,
          showProgress: file.showProgress,
          percentage: file.percentage,
        };
        this.$emit('insideDefaultList', defaultList);

        Message.success("上传成功,当前头像链接已更新")
      },
      handleFormatError(file) {
        this.$Notice.warning({
          title: '文件格式不正确',
          desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
        })
      },
      handleMaxSize(file) {
        this.$Notice.warning({
          title: '超出文件大小限制',
          desc: '文件 ' + file.name + ' 太大，不能超过 2M。'
        })
      },
      handleBeforeUpload() {
        //再次上传你清空之前内容
        this.$refs.upload.clearFiles()
      },
      // handleBasicData(avatrUrl) {
      //   this.defaultList.url = avatrUrl;
      // }
    },
    mounted() {
      // this.handleBasicData(this.avatarUrl);
    }
  }
</script>

<style scoped>
  .upload {
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px dashed #000;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
    margin-right: 4px;
    cursor: pointer;
  }
</style>
