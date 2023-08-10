<!--
 * @Author: your name
 * @Date: 2020-07-23 09:48:43
 * @LastEditTime: 2023-08-10 14:24:23
 * @LastEditors: 赵婷婷
 * @Description: In User Settings Edit
 * @FilePath: \sucai-modal\src\views\Home.vue
-->
<template>
	<div class="comps">
		<!-- 108 111 201 596 -->
		<Button type="primary" :loading="loading1" @click="handleOpenVideo('18780369')"
			>打开弹窗</Button
		>
		<audit-modal
			ref="auditDom"
			:fileId="fileId"
			:userInfo="userInfo"
			:privList="privList"
			:fromSeries="fromSeries"
			:seriesArticleContent="seriesArticleContent"
			:showLogs="showLogs"
			:requestUrlObj="requestUrlObj"
			:allowCopy="allowCopy"
		>
			<!-- <template #toolbar>
        <Button type="info" size="small" class="per-btn" @click="handleChangeFile">上一条</Button>
        <Button type="info" size="small" class="per-btn" @click="handleChangeFile">下一条</Button>
        <Button type="success" size="small" class="per-btn" @click="handleNewVersion"
          >更新版本</Button
        >
        <Button type="success" size="small" class="per-btn">通过</Button>
        <Button type="error" size="small" class="per-btn">修改驳回</Button>
      </template> -->
		</audit-modal>
	</div>
</template>

<script>
// @ is an alias to /src
import AuditModal from '@/components/AuditModal'
import { Button } from 'view-design'
export default {
	name: 'Home',
	components: {
		AuditModal,
		Button,
	},
	data() {
		return {
			loading1: false,
			fileId: '',
			userInfo: {
				id: '1000053',
				avatar: 'https://img12.iqilu.com//1/2019/09/03/d263847adf8b4835acb1dee6c057f32f.jpg',
				nickname: '赵婷婷',
			},
			privList: ['bindSeries', 'bindArticle', 'updateVersion'], // ['bindSeries', 'bindArticle', 'updateVersion']
			fromSeries: false,
			noCommentAccess: false,
			seriesArticleContent: '',
			showLogs: false,
			requestUrlObj: {
				sucaiUrl: 'https://shandianyun-sck.iqilu.com',
				articleUrl: 'https://shandianyun-article.iqilu.com',
				seriesUrl: 'https://shandianyun-series.iqilu.com',
			},
			// requestUrlObj: {
			// 	sucaiUrl: 'https://sucai.shandian8.com',
			// 	articleUrl: 'https://article.shandian8.com',
			// 	seriesUrl: 'https://series.shandian8.com',
			// },
			allowCopy: true,
		}
	},
	mounted() {
		this.seriesArticleContent =
			'<p>齐鲁网·闪电新闻5月18日讯 5月18日下午，济南市历下区第十八届人民代表大会第四次会议圆满完成各项议程，在历下大厦四楼礼堂胜利闭幕。</p>\n<p class="editorImgDom"><img src="http://img9.iqilu.com/images/2020/05/18/full/4a77558acf5be476f21be308314a2c4491f2d427.jpg" url="https://img12.iqilu.com/10339/sucaiku/202005/18/20200518085509f5UPGJBRPJ.jpeg"></p>\n<p class="editorImgDom"><img src="http://img9.iqilu.com/images/2020/05/18/full/6127fb5bce698d0660f51a16a86ddae762e13648.jpg" url="https://img12.iqilu.com/10339/sucaiku/202005/18/20200518085512oWdIxaQ8kM.jpeg"></p>\n<p class="editorImgDom"><img src="http://img9.iqilu.com/images/2020/05/18/full/2550ae23d669f8722cd390fe18a395009d0f4158.jpg" url="https://img12.iqilu.com/10339/sucaiku/202005/18/202005180855133pPWMErgRI.jpeg"></p>\n<p class="editorImgDom"><img src="http://img9.iqilu.com/images/2020/05/18/full/9382d78afe2979af3ea8028f864ab785a91b3c24.jpg" url="https://img12.iqilu.com/10339/sucaiku/202005/18/20200518085513fZ20dq7U43.jpeg"></p>\n<p class="editorImgDom"><img src="http://img9.iqilu.com/images/2020/05/18/full/6a3eb908dd88ba34afe4ae88309722d96af4e07e.jpg" url="https://img12.iqilu.com/10339/sucaiku/202005/18/20200518085513RglWAUGbqi.jpeg"></p>\n<p class="editorImgDom"><img src="http://img9.iqilu.com/images/2020/05/18/full/00ae73e1ae289bf5580144a2b44567dd1b22c711.jpg" url="https://img12.iqilu.com/10339/sucaiku/202005/18/202005180855151NwlnVaCaO.jpeg"></p>\n<p>大会主席团常务主席江山、韩宏伟、邓向东、栾杰、郭向平、郭宝龙、荆甫荣在主席台前排就座。历下区领导李国强、曹辛、尹红梅、刘海峰、纪亮、续明、杜宝现、李乐军、王海清、李克、牟宗伟、刘爱国和大会主席团成员在主席台就座。</p>\n<p class="editorImgDom">会议在江山的主持下，首先表决通过了总监票人、监票人名单。出席会议的人大代表随后以无记名投票的方式，选举李国强为历下区人民政府区长。选举刘爱国为历下区人民检察院检察长（按照法律规定，须报经市人民检察院检察长提请市人大常委会批准）。选举王凯、李云鹏、苗海光、赵世海为区十八届人大常委会委员。新当选的历下区人民政府区长、历下区检察院检察长以及区人大常委会委员与代表见面。<br></p>\n<p class="editorImgDom"><img src="http://img9.iqilu.com/images/2020/05/18/full/17f147f8ece268bb8321edbe35d66b20ecf0b094.jpg" url="https://img12.iqilu.com/10339/sucaiku/202005/18/20200518085736xC99bDhGcN.jpeg"></p>\n<p>会议以举手表决的方式，表决通过了济南市历下区第十八届人民代表大会第四次会议关于政府工作报告的决议、关于2020年历下区民生实事的决议、关于历下区2019年国民经济和社会发展计划执行情况与2020 年计划的决议、关于历下区2019年预算执行情况和2020 年预算的决议、关于历下区人民代表大会常务委员会工作报告的决议、关于历下区人民法院工作报告的决议、关于历下区人民检察院工作报告的决议。<br></p>\n<p>江山在大会上讲话指出，今年是全面建成小康社会和“十三五”规划收官之年，也是历下全省首善之区建设抢抓机遇、冲刺攻坚的关键之年。近期，山东省委常委、济南市委书记孙立成同志两次就历下发展作出重要讲话，要求历下抢抓重大机遇，增强紧迫感，扛起首善责任，强化首善担当，在新一轮高质量发展中发挥龙头带动作用，当好全市发展的排头兵。这是市委对历下提出的新目标、新定位、新要求，全区上下要深入学习贯彻市委主要领导同志讲话精神，按照区委十二届八次全会和人代会作出的工作安排，以更加坚定的信心、更加务实的作风，高标准做好经济社会发展各项工作，奋力当好全市高质量发展的排头兵。<br></p>\n<p>江山强调，当好全市排头兵，必须高举旗帜、信念坚定。要始终高举习近平新时代中国特色社会主义思想伟大旗帜，深学细悟、融会贯通，牢牢把握蕴含其中的鲜明立场、思想观点和科学方法，切实用以武装头脑、指导实践、推动工作，全面增强“四个意识”，坚定“四个自信”，做到“两个维护”。要创造性落实好中央作出的各项决策部署和省市委工作要求，扎实做好“六稳”工作，坚决落实“六保”任务，确保圆满完成全年各项发展目标。<br></p>\n<p>江山要求，当好全市排头兵，必须拉高标杆、争创一流。要进一步解放思想、提升境界，坚决破除小成即满、小富即安的思想，主动对标广州天河、深圳福田等国内一流城区，把首善的定位、首善的标准、首善的要求贯穿于经济社会发展的全过程、全领域，确保历下各项工作全省领先、全国一流。<br></p>\n<p>江山指出，当好全市排头兵，必须突出重点、奋力攻坚。要大力实施“双核引领、东西共进、两翼齐飞”发展战略，举全区之力加快国际金融城产业金融集聚区和明府城两大核心区建设，努力在新一轮高质量发展中抢得先机、拔得头筹。要大跨度提升城市治理水平，努力打造全省最干净城区。要持续擦亮“民生历下”品牌，用心用情解决好就业、教育、医疗、养老等突出问题，不断完善网格化治理体系，增强群众获得感满意度，提升城区发展竞争力。<br></p>\n<p class="editorImgDom">江山强调，当好全市排头兵，必须担当作为、狠抓落实。要大力弘扬一线工作法，各级干部要带头当好“施工队长”“突击队长”，做到问题在一线发现、矛盾在一线化解、困难在一线解决、任务在一线落实。要大力弘扬敢想、敢干、敢担当的拼搏精神，面对急难险重任务，敢于迎难而上、敢于挺身而出。要大力弘扬快干实干的作风，部署了的工作，不拖、不等、不靠，让雷厉风行、快干实干成为历下干部的鲜明特征。在座的各位领导干部和人大代表要率先垂范、以上率下，以“头雁”领航带动“群雁”齐飞，在全区高质量发展中发挥中流砥柱作用。<br></p>\n<p>江山指出，让我们在市委、市政府的坚强领导下，进一步解放思想、拉高标杆，奋力谱写全省首善之区建设的精彩篇章，奋力当好全市高质量发展排头兵，为建设“大强美富通”现代化国际大都市作出新的更大贡献！<br></p>\n<p>会议最后，江山宣布：历下区第十八届人民代表大会第四次会议闭幕！<br></p>\n<p>大会在雄壮的国歌声中落下帷幕。<br></p>\n<p class="editorImgDom"><img src="http://img9.iqilu.com/images/2020/05/18/full/a961289bf4331f15e42b0290df9bb05df3427c34.jpg" url="https://img12.iqilu.com/10339/sucaiku/202005/18/20200518090000U9qt0xEC8f.jpeg"></p>\n<p>会后，新当选的历下区人民政府区长以及区人大常委会委员在历下大厦三楼中心会议室进行了宪法宣誓。<br></p>\n<p><strong>闪电新闻记者 段嘉琪  济南报道</strong></p>\n'
	},
	methods: {
		// 音视频打开弹窗需要等待接口返回
		handleOpenVideo(id) {
			this.fileId = id
			this.loading1 = true
			this.$nextTick(() => {
				this.$refs.auditDom.showModal(() => {
					this.loading1 = false
				})
			})
		},
		// 111 108
		handleChangeFile() {
			this.fileId = '108'
			this.$refs.auditDom.fileChange()
		},
		handleNewVersion() {
			this.$refs.auditDom.handleUpdateVersion((version) => {
				console.log('更新版本完了 返回版本号', version)
			})
		},
	},
}
</script>

<style scoped>
@import url('../assets/css/common.css');

.comps {
	padding: 50px 200px;
	display: flex;
}
</style>
