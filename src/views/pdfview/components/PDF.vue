<template>
  <div>
    <!--<el-row style="background-color:#8a8a8a;color: #fff;padding: 5px;font-size: 1rem;overflow: hidden;">-->
      <!--<el-col :span="12"style="text-align: right;display: inline-block;height: 30px;line-height: 30px;text-align: left;padding-left: 10px">-->
        <!--<span>共{{pages}}页</span>-->
        <!--<span style="margin-left: 20px">当前第{{currentPage}}页</span>-->
      <!--</el-col>-->
      <!--<el-col :span="12" style="text-align: right;display: inline-block;text-align: right;">-->
        <!--<el-button style="height: 30px;padding: 5px" @click="pagePre">上一页</el-button>-->
        <!--<el-button style="height: 30px;padding: 5px"  @click="pageNext">下一页</el-button>-->
      <!--</el-col>-->
    <!--</el-row>-->
    <div style="position:absolute;overflow-y: scroll;width: 100%;height: 100%" ref="viewBox" id="pdfviewpart">
      <canvas v-for="page in pages" :id="'the-canvas'+page" :key="page"></canvas>
    </div>
  </div>
</template>

<script>
  import PDFJS from 'pdfjs-dist'
  let Base64 = require('js-base64').Base64


  export default {
    data () {
      return {
        title: '',
        pdfDoc: null,
        loadding: false,
        pages: 0,
        pdfsurl:'',
        currentPage:1,
        canvasHeight:0
      }
    },
    methods: {
      renderPage (num) {
        let _this = this
        this.pdfDoc.getPage(num).then(function (page) {
          let canvas = document.getElementById('the-canvas' + num)
          let ctx = canvas.getContext('2d')
          let dpr = window.devicePixelRatio || 1
          let bsr = ctx.webkitBackingStorePixelRatio ||
            ctx.mozBackingStorePixelRatio ||
            ctx.msBackingStorePixelRatio ||
            ctx.oBackingStorePixelRatio ||
            ctx.backingStorePixelRatio || 1
          let ratio = dpr / bsr
          var viewport = page.getViewport((document.getElementById('pdfview').clientWidth-10) / page.getViewport(1).width)
          canvas.width = viewport.width * ratio
          canvas.height = viewport.height * ratio
          canvas.style.width = viewport.width+ 'px'
          canvas.style.height = viewport.height + 'px'
          _this.canvasHeight=canvas.height
          ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
          var renderContext = {
            canvasContext: ctx,
            viewport: viewport
          }
          page.render(renderContext)
          if (_this.pages > num) {
            _this.renderPage(num + 1)
          }
        })
      },
      loadFile (url) {
        let _this = this
        PDFJS.getDocument(url).then(function (pdf) {
          _this.pdfDoc = pdf
          _this.pages = _this.pdfDoc.numPages
          _this.$nextTick(() => {
            _this.renderPage(1)
          })
        })
      },
      pagePre(){
        if(!(this.currentPage-2<0)){
          this.$refs.viewBox.scrollTop=(this.currentPage-2)*this.canvasHeight
        }
      },
      pageNext(){
        if(!(this.currentPage+1>this.pages)){
          this.$refs.viewBox.scrollTop=(this.currentPage)*this.canvasHeight
        }
      }
    },
    mounted () {
      this.pdfsurl=this.pdfurl
      this.loadFile(this.pdfsurl)
      this.box = this.$refs.viewBox
      // 监听这个dom的scroll事件
      this.box.addEventListener('scroll', () => {
        this.currentPage =  Math.ceil(this.$refs.viewBox.scrollTop/this.canvasHeight+0.2)
        console.log(" scroll " + this.$refs.viewBox.scrollTop)
        //以下是我自己的需求，向下滚动的时候显示“我是有底线的（类似支付宝）”
        this.isScroll=this.$refs.viewBox.scrollTop>0
      }, false)
    },
    props:{
      pdfurl: String,
    }
  }
</script>

<style scoped>
  canvas {
    display: block;
    border-bottom: 1px solid black;
  }

  /*滚动条样式*/
  #pdfviewpart::-webkit-scrollbar {/*滚动条整体样式*/
    width: 6px;     /*高宽分别对应横竖滚动条的尺寸*/
    height: 6px;
  }
  #pdfviewpart::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 5px #787878;
    background: #787878;
  }
  #pdfviewpart::-webkit-scrollbar-track {/*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(217,217,217,0.8);
    border-radius: 0;
    background: rgba(217,217,217,0.8);
  }
</style>
