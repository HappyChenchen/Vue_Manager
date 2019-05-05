<template>
  <el-row class="wrap" style="background-color: #bfc1c929">
    <el-col :span="10" :style="{height:myHeight+'px'}" class="wrap-left">
      <!--区域选择-->
      <div class="wrap-fileList" :style="{height:myHeight+'px'}">
        <el-input placeholder="搜索文件" v-model="filterFileText" style="margin-top: 10px" class="fileFilterInput">
        </el-input>
        <el-col class="fileListTreeDiv" :style="{height:myHeight-50+'px',width:'100%'}">
          <el-tree class="fileListTree"
                   :data="fileNameList"
                   :props="defaultProps"
                   @node-click="fileNameClick"
                   :filter-node-method="filterFile"
                   ref="fileTree">
          </el-tree>
        </el-col>

      </div>
    </el-col>

    <el-col :span="14" :style="{height:myHeight+'px'}" class="wrap-right">
      <div id="fileDetail" :style="{height:myHeight+'px'}">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item v-for="nodeName in selectNodeTreeList" :key="nodeName" style="font-size: 1rem; float: none !important;">{{nodeName}}</el-breadcrumb-item>
        </el-breadcrumb>
        <!--<el-button id="downLoadBt" type="primary" @click="downLoadFile" :disabled="isDownloadDisable" :loading="isDownloadLoading">下载</el-button>-->
        <div id="fileDetailShow" :style="{height:myHeight-60+'px'}">
          <!--<iframe id="iframePreview" v-show="isPdfShow" width='100%' :style="{height:myHeight-60+'px'}" class="iframeFile"></iframe>-->
          <pdf v-if="isPdfShow" :pdfurl="pdfurl" id="pdfview" :style="{height:myHeight-60+'px'}" ></pdf>
          <div v-show="isImgShow" id="imgBox" style="position:relative;width:100%;height:100%;">
            <viewer id="ImgViewer">
              <img id="imgPreView" :src="imgStream"  style="position:absolute;width:auto;height:auto;max-width:100%;max-height:90%; margin: auto;left: 0;right: 0;" @click="changeImgStream">
            </viewer>
            <!--<img  :src="imgStreamOrigin"  style="position:absolute;width:auto;height:auto;max-width:100%;max-height:100%">-->
          </div>
          <div v-if="isVideoShow" id="vidioBox" style="position:relative;width:100%;height:100%;">
            <video-player  class="video-player vjs-custom-skin"
                           ref="videoPlayer"
                           :playsinline="true"
                           :options="playerOptions"
            ></video-player>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
  import axios from 'axios'
  import {videoPlayer} from 'vue-video-player'
  import 'video.js/dist/video-js.css'
  const staticPathPrefix = process.env.BASE_API + 'static'
  import pdf from './components/pdf'
  let Base64 = require('js-base64').Base64
  // window.location.host+'/static'
  export default {
    name: 'Book',
    data () {
      return {
        filterFileText: '',
        selectNodeTreeList: [],
        myHeight: (window.innerHeight - 50),
        myWidth:(window.innerWidth),
        fileNameList: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        loading: false,
        isPdfShow: false,
        imgStream: '',
        imgStreamPreView: '',
        imgStreamOrigin: '',
        isImgShow: true,
        isDownloadDisable: true,
        isDownloadLoading: false,
        isVideoShow: false,
        playerOptions: {
          playbackRates: [0.7, 1.0, 1.5, 2.0], // 播放速度
          autoplay: false, // 如果true,浏览器准备好时开始回放。
          muted: false, // 默认情况下将会消除任何音频。
          loop: false, // 导致视频一结束就重新开始。
          preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
          language: 'zh-CN',
          languages: {
            'zh-CN': {
              'Play': '播放',
              'Pause': '暂停',
              'Current Time': '当前时间',
              'Duration': '总时长',
              'Remaining Time': '剩余时长',
              'Mute': '声音',
              'Fullscreen': '全屏',
              'Playback Rate': '倍率',
              'Play Video': '播放',
              'Replay': '重放'
            }
          },
          aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
          fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
          sources: [{
            type: 'video/mp4',
            src: ''// url地址
          }],
          // poster: 'https://surmon-china.github.io/vue-quill-editor/static/images/surmon-5.jpg', // 你的封面地址
          // width: document.documentElement.clientWidth,
          notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
          controlBar: {
            timeDivider: true,
            durationDisplay: true,
            remainingTimeDisplay: false,
            fullscreenToggle: true // 全屏按钮
          }
        },
        pdfurl: 'http://tjdesktop.ngrok.gisoft.tech:8090/pdf/test.pdf'
//        pdfurl: '../../static/file/资源1/二级资源1/资料.pdf',
    }
    },
    components: {
      videoPlayer,pdf
    },
    mounted () {
      let that = this
      // 后台返回资源目录树
      that.fileNameList = [{
        id: 1,
        label: '工作报告',
        children: [{
          id: 2,
          label: '双城2018-08-17-工作情况.pdf'
        }, {
          id: 3,
          label: '双城间绿色生态监管-规划一张图建设方案.docx'
        },{
          id: 4,
          label: '天津市双城管控平台设计方案-更新.docx'
        },{
          id: 5,
          label: '津南双城管控630.pptx'
        },{
          id: 6,
          label: '现状调查和平台建设情况汇报20180627.docx'
        },{
          id: 7,
          label: '现状资料整理ppt 0626 简稿.pptx'
        },{
          id: 8,
          label: '绿色生态屏障地区实施细则20180516.docx'
        },{
          id: 9,
          label: '滨海新区与中心城区中间地带绿色生态屏障规划编制工作方案.docx'
        },{
          id: 10,
          label: '关于加强滨海新区与中心城区中间地带规划管控、建设绿色生态屏障工作公示意见反馈情况.doc'
        },{
          id: 11,
          label: '天津市人民政府办公厅关于成立天津市加强滨海新区与中心城区中间地带规划管控建设绿色生态屏障工作领导小组的通知.docx'
        }]
      }, {
        id: 12,
        label: '会议记录',
        children: [{
          id: 13,
          label: '【20180519】双城管控 - 现状调查.xmind'
        }, {
          id: 14,
          label: '【20180519】平台建设技术体系讨论20180519.xmind'
        },{
          id: 15,
          label: '【20180609】我的地图工作平台.xmind'
        },{
          id: 16,
          label: '【20180627】现状调查和平台建设情况汇报（金市长）20180627V2.0（cr-zzj）.docx'
        },{
          id: 17,
          label: '【20180828】地理国情平台升级改造工作方案（by-zzj）-jh.docx'
        },{
          id: 18,
          label: '【2018-08-09】工作情况 - 常务会.pptx'
        },{
          id: 19,
          label: '【20190313】向指挥部汇报材料'
        },{
          id: 20,
          label: '【常务会】关于我市双城间生态屏障区规划工作情况汇报.pdf'
        }]
      },
      ]
    },
    methods: {
      changeImgStream () {
        this.imgStream = this.imgStreamOrigin
      },
      fileNameClick (val) {
        let that = this
        if (this.$refs.fileTree.currentNode.node.data.children == null) {
          this.selectNodeTreeList = []
          let currentParentNode = this.$refs.fileTree.currentNode.node
          let nodename = currentParentNode.data.label
          this.selectNodeTreeList.unshift(nodename)
          currentParentNode = currentParentNode.parent
          while (currentParentNode.parent != null) {
            nodename = currentParentNode.data.label
            this.selectNodeTreeList.unshift(nodename)
            currentParentNode = currentParentNode.parent
          }
          const PICTURE_EXPRESSION = /\.(png|jpe?g|gif|svg|PNG|JP?G)(\?.*)?$/
          // const File_EXPRESSION=/\.(pdf|xlsx|csv)(\?.*)?$/
          const File_EXPRESSION = /\.(pdf)(\?.*)?$/
          const Video_EXPRESSION = /\.(mp4|rmvb|flv|mpeg|avi)(\?.*)?$/
          let filename = this.selectNodeTreeList[this.selectNodeTreeList.length - 1]
          let filePath = this.selectNodeTreeList.join('/')
          if ((PICTURE_EXPRESSION).test(filename)) {
            this.isImgShow = true
            this.isPdfShow = false
            this.isVideoShow = false
            // this.imgStreamPreView = staticPathPrefix + '/file/'  + filePath + '/' + filename + '/y' 后台资源地址
            // this.imgStreamOrigin = staticPathPrefix + '/file/' + filePath + '/' + filename + '/n' 后台资源地址
            // 前台暂时
            this.imgStreamPreView = staticPathPrefix + '/file/' + filePath
            this.imgStreamOrigin = staticPathPrefix + '/file/' + filePath
            this.imgStream = this.imgStreamPreView
          } else if ((File_EXPRESSION).test(filename)) {
            this.isImgShow = false
            this.isPdfShow = true
            this.isVideoShow = false
//          document.getElementById('iframePreview').src = staticPathPrefix + '/file/' + filePath
//            this.$router.push({ name: 'PDF', query: { url: Base64.encode(this.url) } })
          } else if ((Video_EXPRESSION).test(filename)) {
            this.isImgShow = false
            this.isPdfShow = false
            this.isVideoShow = true
            that.playerOptions.sources[0].src = staticPathPrefix + '/file/' + filePath
            this.isDownloadDisable = false
          } else {
            this.isDownloadDisable = true
          }
          this.isDownloadDisable = false
        }
      },

      filterFile (value, data) {
        if (!value) return true
        return data.label.toUpperCase().indexOf(value.toUpperCase()) !== -1
      },

      downLoadFile () {
        /* this.isDownloadLoading = true
        let filename = this.selectNodeTreeList[this.selectNodeTreeList.length - 1]
        let filePath = this.selectNodeTreeList.join('*')
        axios({
          method: 'get',
          url: staticPathPrefix+ 'file/downloadGeo/' + filePath + '/' + filename,
          responseType: 'blob'
        }).then(response => {
          this.download(response)
        }).catch((error) => {
          console.log(error)
        }) */

      },

      download (data) {
        if (!data) { return }
        let url = window.URL.createObjectURL(data.data)
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', this.selectNodeTreeList[this.selectNodeTreeList.length - 1])

        this.isDownloadLoading = false

        document.body.appendChild(link)
        link.click()
      },
    },
    watch: {
      filterFileText: function () {
        this.$refs.fileTree.filter(this.filterFileText)
      }
    }
  }
</script>

<style scoped>
  .wrap {
    margin: 0px;
    overflow: hidden;
    bottom: 0px;
    right: 0px;
    width: 100%;
    padding: 50px 0px 0px 0px;
    background-color: #bfc1c929
  }
  .wrap-left{
    padding: 0px 5px 10px 5px;
    background-color: #bfc1c929;
  }
  .wrap-right{
    padding: 10px 5px 10px 5px;
    background-color: #bfc1c929;
  }

  .fileListTree{
    border-radius: 3px;
  }

  .fileListTreeDiv{
    overflow: auto;
    margin-top: 5px;
    background-color: #fff;
  }

  .fileListTreeDiv{
    overflow: auto;
    margin-top: 5px;
    background-color: #fff;
  }

  .fileListTreeDiv::-webkit-scrollbar {/*滚动条整体样式*/
     width: 6px;     /*高宽分别对应横竖滚动条的尺寸*/
     height: 6px;
   }
  .fileListTreeDiv::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 5px #787878;
    background: #787878;
  }
  .fileListTreeDiv::-webkit-scrollbar-track {/*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(217,217,217,0.8);
    border-radius: 0;
    background: rgba(217,217,217,0.8);
  }

  .el-tree {
    width: 100%;
    display:inline-block !important;
  }

  .fileListTree>>>.el-tree-node__content>.el-tree-node__expand-icon::before{
    color: transparent;
    background: #FFF url('../../../static/img/folderBefore.png');
    background-size:cover;
  }

  .fileListTree>>>.el-tree-node__content>.el-tree-node__expand-icon.expanded::before{
    color: transparent;
    background: #FFF url('../../../static/img/folderAfter.png');
    background-size:cover;
  }

  .fileListTree>>>.el-tree-node__content>.el-tree-node__expand-icon.is-leaf::before{
    color: transparent;
    background: #FFF url('../../../static/img/document.png');
    background-size:cover;
    background-size: 15px 15px;
  }

  #fileDetail{
    position: relative;
    padding: 10px;
    border-radius: 3px;
  }

  #fileDetailShow{
    position: absolute;
    left: 1%;
    top: 45px;
    width: 98%;
    border:#bfc1c929 1px dashed;
  }

  #downLoadBt{
    position: absolute;
    right:1%;
    top:4px;
    height:28px;
    padding: 0px;
    width: 80px;
    border-radius: 0px;
  }

  .iframeFile>>>img{
    width: 200px;
  }

  .el-tree-node__expand-icon.is-leaf{
    display: none;
  }

  #pdfview{
    height: 100% !important;
  }


  @media screen and (max-width: 480px) {
    .wrap {
      height: 100%;
      padding-top: 50px;
    }

    .wrap-left {
      width: 100%;
      height: 35% !important;
      overflow-y: scroll;
      border-bottom: 1px solid #8a8a8a;
    }

    .wrap-right {
      width: 100%;
      height: 60% !important;
    }

    .wrap-fileList {
    height: 100% !important;
    }

    .fileListTreeDiv {
    height: 100% !important;
    }

    .wrap-left::-webkit-scrollbar {
    width: 3px;
    background-color: #bbb;
    }

    #fileDetailShow {
    height: 100% !important;
    }

    #fileDetail{
    height: 100% !important;
    }

  }




</style>
