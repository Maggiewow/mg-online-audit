<template>
  <div
    id="playerBox"
    class="player-box"
    v-loading="playerLoading"
    :element-loading-text="playerLoadingText"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <image-draw
      ref="imageDraw"
      class="img-vision"
      :style="{ display: !videoPlayerIsShow ? 'block' : 'none' }"
      :width="width"
      :height="height"
      @getDrawImage="getDrawImage"
      @getEditMode="getEditMode"
    ></image-draw>
    <div id="videoPlayer">
      <p class="white-title">{{ videoName }}</p>
      <video id="myVideo" ref="originalVideo" class="video-js my_video" controls>
        <source :src="videoUrl" type="video/mp4" />
        <source
          src="https://stream7-transcode.iqilu.com/1/sucaiku/202105/06/96d08ad6a4874193b3c57a3ca009b26b.mp4"
          type="video/mp4"
        />
      </video>
    </div>

    <el-row id="playerToolbar" v-if="isLoadVideo">
      <el-col :span="24" class="bar-item">
        <span class="text">{{ playerCurrentFrame }}帧 / {{ playerFormatCurrentPostion }}</span>
        <div class="slider">
          <el-slider
            v-model="playerPercentage"
            :show-tooltip="false"
            @change="handleSliderChange"
          ></el-slider>
        </div>
        <span class="text">{{ playerDurationFrame }}帧 / {{ playerFormatDuration }}</span>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import VideoCapture from 'video-capture';
import { setInterval } from 'timers';
import iconIncrease from './icons/icon-increase.png';
import iconLower from './icons/icon-lower.png';
import iconFullscreen from './icons/icon-fullscreen.png';
import iconEdit from './player-icon/icon-edit.png';
import ImageDraw from '../ImageDraw';
import { calcPercent } from '../../util';
import $ from 'jquery';
import videojs from 'video.js';

export default {
  components: {
    ImageDraw,
  },
  name: 'VideoPlayer',

  props: {
    url: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      width: 0,
      height: 0,
      videoUrl: '',
      videoName: '',
      videoPlayer: null,
      isLoadVideo: false,
      playerLoading: false,
      videoPlayerNoVideoIsShow: true,
      playerLoadingText: '视频加载中',
      iconIncrease: iconIncrease,
      iconLower: iconLower,
      iconFullscreen: iconFullscreen,
      iconEdit: iconEdit,
      videoPlayerIsShow: true,
      kscreenshot: null,
      fullscreen: false,
      playerControls: {
        stateIcon: 'el-icon-video-pause',
      },
      playerVolume: 0.8,
      playerDuration: 0,
      playerFormatDuration: '00:00',
      playerCurrentPostion: 0,
      playerFormatCurrentPostion: '00:00',
      playerCurrentFrame: 0,
      playerDurationFrame: 0,
      playerPercentage: 0,
      currentProject: null,
      currentProjectIndex: 0,
      projectLists: new Array(),
      addTools: 'NO',
      videoOption: {
        // autoplay: true,
        // muted: true, // autoplay时不能注释掉 进入页面video的备用url默认自动播放了
        // loop: true,
        controls: true,
        preload: 'auto',
        language: 'zh-CN',
        // 总控制条
        controlBar: {
          // 这里可以自己控制各小组件的顺序和显示方式
          children: [
            { name: 'playToggle' }, // 播放按钮
            {
              name: 'volumePanel', // 音量控制
              inline: false, // 不使用水平方式
            },
            { name: 'FullscreenToggle' }, // 全屏
          ],
        },
        // plugins: {
        //   framebyframe: {
        //     fps: 25,
        //     steps: [
        //       { text: "退5帧", step: -5 },
        //       { text: "退1帧", step: -1 },
        //       { text: "进1帧", step: 1 },
        //       { text: "进5帧", step: 5 }
        //     ]
        //   }
        // }
      },
      isFullscreen: false, // 是否为全屏状态
    };
  },
  watch: {
    videoPlayerIsShow(bool) {
      this.$store.commit('setDrawState', !bool);
    },
  },
  created() {
    document.addEventListener('fullscreenchange', (event) => {
      if (document.fullscreenElement) {
        this.isFullscreen = true;
        $('#video_edit_icon').hide();
      } else {
        this.isFullscreen = false;
        $('#video_edit_icon').show();
      }
    });
  },
  mounted() {
    this.initVideo();
    this.setRealSize();
    // this.videoPlayerNoVideoIsShow=false;
    this.handelKeyDown();
  },
  methods: {
    stopHandel() {
      window.removeEventListener('keydown', this.keyDownCallback, false);
    },
    handelKeyDown() {
      window.addEventListener('keydown', this.keyDownCallback, false);
    },
    keyDownCallback(event) {
      let frameTime = 1 / 25;
      var _self = this;
      let e = event || window.event || arguments.callee.caller.arguments[0];
      if (_self.videoPlayerIsShow) {
        _self.playerControls.stateIcon = 'el-icon-video-play';
        if (e && e.keyCode === 37) {
          // left arrow
          _self.videoPlayer.pause();
          _self.videoPlayer.currentTime(Math.max(0, _self.videoPlayer.currentTime() - frameTime));
        } else if (e && e.keyCode === 39) {
          // right arrow
          _self.videoPlayer.pause();
          _self.videoPlayer.currentTime(
            Math.min(_self.videoPlayer.duration(), _self.videoPlayer.currentTime() + frameTime)
          );
        } else if (e && e.keyCode === 32) {
          e.preventDefault();
          if (_self.videoPlayer.paused()) {
            _self.videoPlayer.play();
            _self.playerControls.stateIcon = 'el-icon-video-pause';
            _self.playerStepInterval();
          } else {
            _self.videoPlayer.pause();
            _self.playerControls.stateIcon = 'el-icon-video-play';
          }
        }
      }
    },
    initRate() {
      let player = videojs('myVideo');
      player && player.playbackRate && player.playbackRate(1.0);

      $('#video_rate_opt')
        .find('option:selected')
        .text('1.0X');
      $('#default_opt').attr('selected', true);
    },
    /**
     * 加载视频资源
     */
    initVideoUrl(project, pWidth, pHeight) {
      this.initRate();
      this.currentProject = project;
      this.isLoadVideo = true;
      let url = project.url;

      (this.videoPlayerNoVideoIsShow = false),
        (this.videoUrl = url),
        (this.videoName = project.name);

      this.videoPlayer.width(pWidth + 'px');
      this.videoPlayer.height(pHeight + 'px');
      this.videoPlayer.src(this.videoUrl);
      this.videoPlayer.load(this.videoUrl);

      var _self = this;
      // 谷歌浏览器有时不允许自动播放音视频 给用户造成噪音干扰
      this.videoPlayer
        .play()
        .then((res) => {
          _self.playerControls.stateIcon = 'el-icon-video-pause';
        })
        .catch((err) => {
          _self.playerControls.stateIcon = 'el-icon-video-play';
        });
      setTimeout(() => {
        _self.playerStepInterval();
      }, 1000);
    },
    /**
     * video.js
     */
    initVideo() {
      var _self = this;
      this.videoPlayer = videojs(myVideo, this.videoOption, function() {
        _self.addRateTool();

        this.on('ended', function() {
          console.log('播放完毕，重新播放');
        });
      });
    },
    // 防止重复添加-添加一个标识
    addRateTool() {
      if (this.addTools === 'NO') {
        $('.vjs-control-bar').append(
          '<button class="vjs-control " id="video_rate_opt"><select class="sel-rate">\n' +
            '<option value ="vol" class="opt-rate">0.5X</option>\n' +
            '<option value ="volv" class="opt-rate">0.75X</option>\n' +
            '<option value ="volvo" id="default_opt" class="opt-rate" selected>1.0X</option>\n' +
            '<option value ="saab" class="opt-rate">1.25X</option>\n' +
            '<option value="opel" class="opt-rate">1.5X</option>\n' +
            '<option value="audi" class="opt-rate">2.0X</option>\n' +
            '</select></button>'
        );
        $('.vjs-control-bar').append(
          '<button class="vjs-control" id="video_edit_icon"><div id="edit-icon" class="edit-btn-item" title="批注"><img class="edit-img" src=' +
            require('./player-icon/icon-edit.png') +
            ' />批注</div></button>'
        );
        this.addTools = 'YES';
        $('.sel-rate').change(() => {
          let tx = $('.sel-rate option:selected').text();
          var player = videojs('myVideo');
          player.ready(function() {
            // 速率
            setTimeout(() => {
              this.playbackRate(parseFloat(tx));
            }, 20);
          });
        });
        $('#edit-icon').click(() => {
          if (this.isFullscreen) {
            return;
          }

          this.handleMark();
        });
      } else {
        console.log('已经添加了');
      }
    },
    setRealSize() {
      let video = this.$refs.originalVideo;
      let _self = this;
      video &&
        video.addEventListener('canplay', function() {
          let rate = (this.videoWidth / this.videoHeight).toFixed(3);

          // this.height = this.width / parseFloat(rate);
          if (parseFloat(rate) > 1) {
            // 横版视频
            _self.width = 800;
            _self.height = Number((_self.width / parseFloat(rate)).toFixed(2));
          } else {
            // 竖版视频
            _self.height = 450;
            _self.width = Number((_self.height * parseFloat(rate)).toFixed(2));
          }
          // 544 960 800 453.6 number
          console.log(
            'setRealSize===视频实际尺寸',
            parseFloat(rate),
            this.videoWidth,
            this.videoHeight,
            _self.width,
            _self.height,
            typeof _self.height
          );
        });
    },
    pauseVideo() {
      this.videoPlayer.pause();
    },
    playerPlay() {
      if (this.videoPlayerIsShow) {
        if (this.videoPlayer.paused()) {
          this.videoPlayer.play();
          this.playerControls.stateIcon = 'el-icon-video-pause';
          this.playerStepInterval();
        } else {
          this.videoPlayer.pause();
          this.playerControls.stateIcon = 'el-icon-video-play';
        }
      } else {
        this.$message.error('处于视频标注模式');
      }
    },
    playerStepInterval() {
      this.playerDuration = this.videoPlayer.duration();
      this.playerFormatDuration = this.formatSeconds(this.playerDuration);
      this.playerDurationFrame = this.calcFrame(this.playerDuration);
      this.$emit('allCounts', this.playerFormatDuration, this.playerDurationFrame);
      var _self = this;
      setInterval(function() {
        _self.playerCurrentPostion = _self.videoPlayer.currentTime();
        _self.playerFormatCurrentPostion = _self.formatSeconds(_self.playerCurrentPostion);
        _self.playerCurrentFrame = _self.calcFrame(_self.playerCurrentPostion);
        _self.playerPercentage = (_self.playerCurrentPostion / _self.playerDuration) * 100;
      }, 1000 / 25);
    },
    changeVolume: function(type) {
      if (this.videoPlayerIsShow) {
        this.videoPlayer.muted(false);
        console.log(this.playerVolume);
        if (type == 'add') {
          if (this.playerVolume < 1) {
            this.playerVolume += 0.1;
          }
        } else if (type == 'sub') {
          if (this.playerVolume > 0) {
            this.playerVolume -= 0.1;
          }
        }
        this.playerVolume = Math.round(this.playerVolume * 10) / 10;
        this.videoPlayer.volume(this.playerVolume);
      } else {
        this.$message.error('处于视频标注模式');
      }
    },

    getEditMode(mode) {
      this.videoPlayerIsShow = mode;
      this.$emit('getCurrentVideoMode', mode);
    },
    handleSliderChange(data) {
      if (this.videoPlayerIsShow) {
        let time = (this.playerDuration * data) / 100;
        console.log(time);
        this.videoPlayer.currentTime(time);
      } else {
        this.$message.error('处于视频标注模式');
      }
    },
    /**
     * 发起截图 处于批注模式 全部内容加上蒙层
     */
    async handleMark() {
      this.$emit('getCurrentVideoMode', !this.videoPlayerIsShow);
      if (this.videoPlayerIsShow) {
        let _self = this;
        if (this.videoPlayer.currentTime() > 0) {
          _self.playerLoading = true;
          _self.playerLoadingText = '正在获取视频流...';
          this.videoPlayer.pause();
          this.playerControls.stateIcon = 'el-icon-video-play';
          console.log('截图11', this.videoUrl, this.playerCurrentPostion);
          if (this.playerCurrentPostion <= 0) {
            this.$Message.warning('时间选择应该大于0');
            return;
          }

          let dom1 = new VideoCapture(this.videoUrl);
          let { dataURL, width, height } = await dom1.capture(this.playerCurrentPostion);
          // let { dataURL, width, height } = await new VideoCapture(
          //   this.videoUrl
          // ).capture(_self.playerCurrentPostion);
          // console.log("截图得到", width, height, dataURL);

          // 插件自动生成png 后端要求jpg jpeg
          dataURL = dataURL.replace('png', 'jpeg');
          this.$refs.imageDraw.loadImage(dataURL);
          this.videoPlayerIsShow = false;
          _self.playerLoading = false;
        } else {
          this.$message.error('时间是大于0的数字');
        }
      } else {
        this.$message.error('已处于视频标注模式');
      }
    },
    /**
     * 截图回调
     */
    getDrawImage(drawImage, content) {
      var obj = {
        currentFrame: this.calcFrame(this.videoPlayer.currentTime()),
        imgUrl: drawImage,
        content,
        currentPosition: this.videoPlayer.currentTime(),
        currentProject: this.currentProject, // 选中
      };
      this.$emit('getCutImg', {
        ...obj,
        // 秒数的百分比 而不是帧数
        percent: calcPercent(obj.currentPosition, this.playerDuration),
      });
      this.videoPlayerIsShow = true;
      this.$emit('getCurrentVideoMode', true);
    },
    calcFrame(time) {
      let frameTime = 1000 / 25; // 一帧多少毫秒
      let frames = (time * 1000) / frameTime;
      frames = Math.ceil(frames);
      return frames;
    },
    formatSeconds(value) {
      if (window.isNaN(value)) {
        // this.$message.error('无效视频')
        return '00:00';
      }
      var value = parseInt(value);
      var second = value % 60;
      var minute = (value - second) / 60;
      var hour = (minute - (minute % 60)) / 60;
      if (hour != 0) {
        minute = minute % 60;
        return (
          (hour < 10 ? '0' + hour : hour) +
          ':' +
          (minute < 10 ? '0' + minute : +minute) +
          ':' +
          (second < 10 ? '0' + second : second)
        );
      } else {
        if (minute === 0) {
          return '00:' + (second < 10 ? '0' + second : second);
        } else if (minute > 0) {
          return (minute < 10 ? '0' + minute : +minute) + ':' + second;
        }
      }
      /* var theTime = parseInt(value)// 秒
        var middle = 0// 分
        var hour = 0// 小时

        if (theTime > 60) {
          middle = parseInt(theTime / 60)
          theTime = parseInt(theTime % 60)
          if (middle > 60) {
            hour = parseInt(middle / 60)
            middle = parseInt(middle % 60)
          }
        }
        var result = '00:00'
        theTime = parseInt(theTime)
        if (theTime < 10) {
          result = '0' + theTime
        } else {
          result = theTime
        }
        if (middle > 0) {
          middle = parseInt(middle)
          if (middle < 10) {
            result = '0' + middle + ':' + result
          } else {
            result = '' + middle + ':' + result

          }
        }
        if (hour > 0) {
          result = '' + parseInt(hour) + ':' + result
        }
        if ((result + '').split(':').length == 1) {
          result = '00:' + result
        }
        return result */
    },
  },
};
</script>

<style lang="scss">
.player-box {
  width: 100%;
  height: 100%;
  position: relative;
  #videoPlayer {
    width: 800px;
    height: 450px;
    text-align: center;
    font-size: 18px;
    line-height: 200px;
    position: relative;

    .white-title {
      display: none;
      position: absolute;
      top: 17px;
      left: 23px;
      color: #fff;
      text-shadow: 0.05em 0.05em 0.1em #000;
      font-size: 20px;
      z-index: 805;
      line-height: 40px;
    }
    &:hover .white-title {
      display: block;
    }
    .my_video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .img-vision {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    // z-index: 109;
    z-index: 1000;
    text-align: center;
    background: #000;
  }
  .video-js {
    z-index: 800;
  }
}

#playerToolbar {
  font-size: 12px;
  width: 100%;
  background-color: #000;
  z-index: 1000;
  .bar-item {
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    .text {
      color: #fff;
      text-align: right;
    }
    &.right {
      justify-content: center;
    }
    .slider {
      margin: 0 10px;
      // width: 68%;
      width: 73%;
      color: #fff;
    }
  }

  .btn-item {
    border: none;
    border-radius: none;
    background: transparent;
    padding: 0;
    color: #fff;
    margin-left: 8px;
    img {
      height: 24px;
    }
    .edit-img {
      height: 28px;
    }
    .screen-img {
      height: 22px;
    }
  }

  .btn-play {
    font-size: 24px;
  }
}
.sel-rate {
  padding: 0 9px;
  width: 50px;
  height: 20px;
  cursor: pointer;
  -webkit-appearance: none;
  background-color: #3f4246;
  border-radius: 12px;
  color: #fff;
  border: none;
  font-size: 12px;

  &:focus-visible {
    outline: none;
  }
  .opt-rate {
    cursor: pointer;
    display: block;
    padding: 5px 0;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
  }
}
.vjs-slider-horizontal .vjs-volume-level:before {
  top: -0.5em;
}
.vjs-slider-vertical .vjs-volume-level:before {
  left: -0.5em;
}
.edit-btn-item {
  margin-left: 18px;
  padding: 0px 7px;
  width: 60px;
  cursor: pointer;
  background-color: #3f4246;
  border: none;
  border-radius: 12px;
  color: #fff;
  display: flex;
  align-items: center;
  .edit-img {
    height: 20px;
  }
}
</style>
