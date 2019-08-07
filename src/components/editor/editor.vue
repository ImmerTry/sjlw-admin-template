<template>
  <div class="editor-wrapper">
    <div :id="editorId"></div>
  </div>
</template>

<script>
  import Editor from 'wangeditor'
  import 'wangeditor/release/wangEditor.min.css'
  import {oneOf} from '@/libs/tools'
  import {Message} from 'iview'

  export default {
    name: 'Editor',
    props: {
      value: {
        type: String,
        default: ''
      },
      /**
       * 绑定的值的类型, enum: ['html', 'text']
       */
      valueType: {
        type: String,
        default: 'html',
        validator: (val) => {
          return oneOf(val, ['html', 'text'])
        }
      },
      /**
       * @description 设置change事件触发时间间隔
       */
      changeInterval: {
        type: Number,
        default: 200
      },
      /**
       * @description 是否开启本地存储
       */
      cache: {
        type: Boolean,
        default: false
      },
      editorReset: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      editorId() {
        return `editor${this._uid}`
      }
    },
    watch: {
      editorReset(newVal, oldVal) {//监控单个变量
        console.log(newVal, oldVal);
        if (newVal) this.setHtml('')
      }
    },
    methods: {
      setHtml(val) {
        this.editor.txt.html(val);
      }
    },
    mounted() {
      this.editor = new Editor(`#${this.editorId}`);
      this.editor.customConfig.onchange = (html) => { // 获取内容
        let text = this.editor.txt.text();
        if (this.cache) localStorage.editorCache = html;
        this.$emit('input', this.valueType === 'html' ? html : text);
        this.$emit('on-change', html, text);
      };
      //修改 onchange 触发的延迟时间
      this.editor.customConfig.onchangeTimeout = this.changeInterval;
      // 设置Debug模式
      this.editor.customConfig.debug = location.href.indexOf('wangeditor_debug_mode=1') > 0;
      // 置服务器端地址
      this.editor.customConfig.uploadFileName = 'myFile'; //设置文件上传的参数名称
      // this.editor.customConfig.uploadImgServer = '/upload';
      this.editor.customConfig.uploadImgServer = '//localhost:8080/upload';//设置上传文件的服务器路径
      // 将图片大小限制为 3M
      this.editor.customConfig.uploadImgMaxSize = 3 * 1024 * 1024;
      // 限制一次最多上传 5 张图片
      this.editor.customConfig.uploadImgMaxLength = 5;
      //配置编辑区域的 z-index
      this.editor.customConfig.zIndex = 100;
      this.editor.customConfig.customAlert = function (info) {
        // info 是需要提示的内容
        Message.info(info);
      };

      this.editor.customConfig.uploadImgHooks = {
        before: function (xhr, editor, files) {

        },
        success: function (xhr, editor, result) {
          console.log("上传成功");
        },
        fail: function (xhr, editor, result) {
          console.log("上传失败,原因是" + result);
        },
        error: function (xhr, editor) {
          console.log("上传出错");
        },
        timeout: function (xhr, editor) {
          console.log("上传超时");
        }
      };
      // create这个方法一定要在所有配置项之后调用
      this.editor.create();
      // 如果本地有存储加载本地存储内容
      let html = this.value || localStorage.editorCache;
      if (html) this.editor.txt.html(html) // 设置内容
    }
  }
</script>

<style>
</style>
