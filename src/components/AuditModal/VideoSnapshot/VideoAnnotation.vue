<!--
 * @文件描述: 视频批注插件
 * @公司: 广电信通
 * @作者: 赵婷婷
 * @Date: 2021-05-25 10:14:58
 * @LastEditors: 赵婷婷
 * @LastEditTime: 2023-06-28 18:01:41
-->

<template>
	<div id="video-check">
		<div class="video-player">
			<!-- 播放器 -->
			<video-player
				ref="videoPlayer"
				:hideComment="hideComment"
				@getCutImg="getMarkImage"
				@getCurrentVideoMode="getCurrentVideoMode"
				@allCounts="allCounts"
			/>
		</div>
	</div>
</template>

<script>
import VideoPlayer from './VideoPlayer'
export default {
	name: 'VideoSnapshot',
	props: {
		hideComment: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			currentVideoIsEdit: false,
			pWidth: 0,
			pHeight: 0,
			submitList: [],
			currentId: null,
			playInfo: {},
		}
	},
	components: { VideoPlayer },
	mounted() {
		// let bH = document.body.offsetHeight
		// let videoPlayer = document.getElementsByClassName('video-player')
		// this.pHeight = videoPlayer[0].offsetHeight
		// this.pWidth = videoPlayer[0].offsetWidth
		// this.setSource(); // 父组件主动触发
	},
	methods: {
		handleMark() {
			this.$refs.videoPlayer.handleMark()
		},
		pauseVideo() {
			this.$refs.videoPlayer.pauseVideo()
		},
		setSource(obj) {
			this.playInfo = obj
			if (!this.playInfo.id) {
				this.$message.error('暂无视频信息')
				return
			}

			this.currentId = this.playInfo.id
			if (this.currentVideoIsEdit) {
				this.$message.error('处于视频标注模式')
			} else {
				let bH = document.body.offsetHeight
				let videoPlayer = document.getElementsByClassName('video-player')
				console.log('videoPlayer---', videoPlayer)
				this.pHeight = videoPlayer[0].offsetHeight
				this.pWidth = videoPlayer[0].offsetWidth
				console.log('videoPlayer[0]---', videoPlayer[0])

				this.$refs.videoPlayer.initVideoUrl(this.playInfo, this.pWidth, this.pHeight)
			}
		},
		// 弃用
		// 点击播放列表回传  projectLists播放列表   index 当前点击的item 下标
		initSource(projectList, index, projectLists) {
			this.currentId = projectList[0].id
			this.submitList = [...projectLists]
			if (this.currentVideoIsEdit) {
				this.$message.error('处于视频标注模式')
			} else {
				this.$refs.videoPlayer.initVideoUrl(this.playInfo, this.pWidth, this.pHeight)
				this.$refs.videoPlayer.initNextVideo(index, projectList)
			}
		},
		getMarkImage(obj) {
			this.$emit('get-image-list', obj)
			let bH = document.body.offsetHeight
		},
		// 传递 获取视频是否属于编辑中
		getCurrentVideoMode(mode) {
			this.currentVideoIsEdit = !mode
		},
		allCounts(duration, frame) {
			this.$emit('allCounts', duration, frame)
		},
	},
}
</script>

<style lang="scss" scoped>
@mixin scrollStyle {
	&::-webkit-scrollbar {
		/*滚动条整体样式*/
		width: 6px; /*高宽分别对应横竖滚动条的尺寸*/
		height: 6px;
		cursor: pointer;
	}
	&::-webkit-scrollbar-thumb {
		/*滚动条里面小方块*/
		border-radius: 5px;
		box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
		background: rgba(0, 0, 0, 0.2);
		cursor: pointer;
	}
	&::-webkit-scrollbar-track {
		/*滚动条里面轨道*/
		box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
		border-radius: 0;
		background: rgba(0, 0, 0, 0.1);
	}
}
#video-check {
	width: 800px;
	// z-index: 1000;

	.video-player {
		background: #fff;
	}

	// .page {
	//   width: 100%;
	//   height: 100%;
	//   overflow-y: hidden;
	//   .page-left {
	//     height: 100%;
	//     width: 62%;
	//     margin-right: 0.5%;
	//     .video-player {
	//       width: 100%;
	//       height: 65%;
	//       background: #fff;
	//     }
	//     .video-list {
	//       width: 100%;
	//       margin-top: 1%;
	//       background: #fff;
	//     }
	//   }
	// }
}
</style>
