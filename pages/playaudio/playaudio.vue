<template>
	<view class="play-audio">
	     <template v-if="!whiteScreen">
	     	 <template v-if="area.user_info">
	     	 	<!-- 头部播放区 -->
	     	 	<view class="head-box">
	     	 		<view class="name-img">
	     	 			<view class="user-box" v-if="area.user_info">
	     	 				<image :src="area.user_info.avatar" mode=""></image>
	     	 				<view class="text-info">
	     	 					<text>{{area.user_info.name}}</text>
	     	 					<text>{{area.user_info.attention_num}}人关注</text>
	     	 				</view>
	     	 			</view>
	     	 			<template v-if="area.user_info.attention_status == 1">
	     	 				<view class="concern-btn"  @click="dealConcern(area.user_id,area.user_info.attention_status)">
	     	 					已关注
	     	 				</view>
	     	 			</template>
	     	 			<template v-else>
	     	 				<view class="concern-btn" @click="dealConcern(area.user_id,area.user_info.attention_status)">
	     	 					+关注
	     	 				</view>
	     	 			</template>
	     	 	
	     	 		</view>
	     	 		<view class="audio-title">
	     	 			{{area.title}}
	     	 		</view>
	     	 		<view class="audio" v-if="audio.length > 0">
	     	 			<imt-audio ref="imt" :src="audio[now].src" :duration="audio[now].duration" @prev="now = now === 0 ? audio.length - 1 : now - 1"
	     	 			 @next="now = now === audio.length - 1 ? 0 : now + 1" @getaudio="getAudioContext" @end='finish'></imt-audio>
	     	 		</view>
	     	 	</view>
	     	 	<!-- 题目回区域 -->
	     	 	<view class="ti-cont" v-if="radioItems.length > 0">
	     	 		<view class="title">问题：</view>
	     	 		<view class="ti-cont-line">{{radioItems[0].descript}}</view>
	     	 		<view class="answer-box">
	     	 			<view class="answer" @click="reply(radioItems,1)">
	     	 			    <image :src=" right == 1 ? '../../static/dui.png' : error == 1 ? '../../static/cuo.png' :'../../static/xuanxiang.png'" mode="" class="pic" ></image> 
	     	 				<view class="text">A.{{radioItems[0].option1}}</view>
	     	 			</view>
	     	 			<view class="answer" @click="reply(radioItems,2)">
	     	 			    <image :src=" right == 2 ? '../../static/dui.png' : error == 2 ? '../../static/cuo.png' :'../../static/xuanxiang.png'" mode="" class="pic" ></image> 
	     	 				<view class="text">B.{{radioItems[0].option2}}</view>
	     	 			</view>
	     	 			<view class="answer" v-if="radioItems[0].option3" @click="reply(radioItems,3)">
	     	 			    <image :src=" right == 3 ? '../../static/dui.png' : error == 3 ? '../../static/cuo.png' :'../../static/xuanxiang.png'" mode="" class="pic"></image> 
	     	 				<view class="text">C.{{radioItems[0].option3}}</view>
	     	 			</view>
	     	 			<view class="answer" v-if="radioItems[0].option4" @click="reply(radioItems,4)">
	     	 			    <image :src=" right == 4 ? '../../static/dui.png' : error == 4 ? '../../static/cuo.png' :'../../static/xuanxiang.png'" mode="" class="pic" ></image>
	     	 				<view class="text">D.{{radioItems[0].option4}}</view>
	     	 			</view>
	     	 		</view>
					<view class="right-result" v-if="rightResult">
						正确答案：{{rightResult}}
					</view>
	     	 	</view>
	     	 	<!-- <view class="fixed-answer"></view> -->
	     	 	<!-- 评论区 -->
	     	 	<view class="comment-box">
	     	 		<text class="comment-line">评论区</text>
	     	 		<template v-if="area.comment_list.length > 0">
	     	 			<view class="line" v-for="(item,index) in area.comment_list" :key="index" >
	     	 				<view class="line-in-box">
	     	 					<view class="coment-box-in">
	     	 						<view class="user-box comment-box-user">
	     	 							<image :src="item.avatar" mode=""></image>
	     	 							<view class="text-info">
	     	 								<text>{{item.name}}</text>
	     	 								<text>{{item.createtime}}</text>
	     	 							</view>
	     	 						</view>
	     	 						<view class="nei-ron">{{item.content}}</view>
	     	 						<view class="zan-comment">
	     	 							<view>
	     	 								<image src="../../static/pinglun.png" mode="" @click="comment(item.comment_id)"></image>{{item.reply_num}}
	     	 							</view>
										<view class="jubao" @click="jubao(item.comment_id)"><image src="../../static/jubao.png" mode=""></image>举报</view>
	     	 							<view class="end" @click="like(item.comment_id,index,item)">
	     	 								<image :src="item.like_status == 2 ? '../../static/zan.png' : '../../static/dianzanle.png'" mode=""></image>{{item.like_num}}
	     	 							</view>
	     	 						</view>
	     	 					</view>
	     	 	
	     	 				</view>
	     	 			</view>
	     	 		</template>
	     	 	</view>
	     	 	<!-- 底部 -->
	     	 	<view class="button-cont">
	     	 		<view class="control-box">
	     	 		<!-- 	<view class="box-ico box-ico1">
	     	 				<image src="../../static/tiwen.png" mode=""></image>
	     	 				提问
	     	 			</view> -->
	     	 			<navigator :url="'../commentdetail/commentdetail?radioId='+area.id" class="box-ico box-ico1" hover-class="none">
	     	 				<image src="../../static/pinglun.png" mode="" />
	     	 				{{area.comment_num ? area.comment_num : 0}}
	     	 			</navigator>
	     	 			<view class="box-ico box-ico2" @click="likeYgb(area.id)">
	     	 				<image :src="area.like_status == 2 ? '../../static/zan.png' : '../../static/dianzanle.png'" mode="" />
	     	 				{{area.like_num ? area.like_num : 0}}
	     	 			</view>
	     	 		</view>
	     	 	</view>
	     	 </template>
			 <template v-else>
			 	<view class="empty-data">
			 		<image src="../../static/noData.png" mode="" class="pic"></image>
			 		<view class="text">暂无数据~</view>
			 	</view>
			 </template>
	     </template>
	</view>
</template>

<script>
	import imtAudio from 'components/imt-audio/imt-audio';
	export default {
		data() {
			return {
				audioContext: null,
				isFinish: false,
				audio: [],
				area: {},
				token: uni.getStorageSync('token'),
				now: 0,
				radioItems: [],
				right: 0,   // 正确
				rightResult: '', // 错误时候正确结果
				error: 0,  // 错误
				whiteScreen: true // 先白屏展示
			};
		},
		onLoad: function() {
			this.getAudioResource()
		},
		onShow() {
			// this.getAudioResource()
			 if (this.audioContext) {
                this.$refs.imt.init()
				this.$refs.imt.paused = true
			 }
		},
		methods: {
			jubao(id){
				uni.navigateTo({
					url: '../reporting/reporting?commentId='+id
				});
			},
			comment(commentId) {
				uni.navigateTo({
					url: "../commentrely/commentrely?commentId="+commentId+'&radioId='+this.area.id
				})
			},
			// 获取音频实例
			getAudioContext(audio) {
				this.audioContext = audio;
			},
			// 获取音频已播完整首
			finish(end) {
				this.isFinish = true;
			},
			// 获取音频资源
			getAudioResource() {
				let data = {};
				data['token'] = this.token
				data['radio_id'] = this.audioId;
				this.api.playArea(data).then(res => {
					this.whiteScreen = false
					
					this.area = res.datas
					if (!res.datas.subject_list) return
					let audioJson = {
						src: res.datas.radio,
						duration: res.datas.duration
					}
				
					this.audio.push(audioJson)
				    this.radioItems = res.datas.subject_list
					// 1 答错  2答对
					if (res.datas.subject_list[0].is_answer) {
						if (res.datas.subject_list[0].answer_info.is_right == 1)  {
							 // 提交的选项
							 this.error = res.datas.subject_list[0].answer_info.sub_option - 0
							 this.rightOption(res.datas.subject_list[0].right_option - 0)
						}else {
							this.right = res.datas.subject_list[0].right_option - 0
						}
					}
				
				})
			},
			// 答题
			reply(item,index) {
				if (this.radioItems.length > 0) {
					if (this.radioItems[0].is_answer) {
						uni.showToast({
							title: '您已答过此题',
							icon: 'none'
						})
						return
					}
				}
				if (!this.isFinish) {
					uni.showToast({
						title:'录音听完才可以答题',
						icon: 'none'
					})
					return;
				}
				let data = {}
				data['token'] = this.token
				data['subject_id'] = item[0].id
				data['sub_option'] = index
				this.api.answerSubject(data).then(res => {
					if (res.datas.is_right == 1)  {
					   this.error = index
					   // this.right = res.datas.right_option - 0
					    this.rightOption(res.datas.right_option - 0)
					}else {
						this.right = index
					}
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
				})
			},
			// 正确选项
			rightOption(type) {
				switch (type){
					case 1:
					    this.rightResult = 'A'
						break;
					case 2:
					     this.rightResult = 'B'
						break;
					case 3:
					    this.rightResult = 'C'
						break;
					default:
					    this.rightResult = 'D'
						break;
				}
			},
			// 点赞评论
			like(id,index,item) {
				if (item.like_status == 1) {
					uni.showToast({
					   title: '已赞',
					   icon: 'none'
					})
					return 
				}
				let data = {}
				data['token'] = this.token
				data['comment_id'] = id
				this.api.likeComment(data).then(res => {
                      item.like_num = item.like_num +1
					  item.like_status = 1
					  // this.area.comment_list[index] = item
					  // console.log(this.area.comment_list[index] = item);
					  // this.$set(this.area.comment_list,index,item)
				})
			},
			// 点赞云广播
			likeYgb(id) {
				if (this.area.like_status == 1) {
					uni.showToast({
					   title: '已赞',
					   icon: 'none'
					})
					return 
				}
				let data = {}
				data['token'] = this.token
				data['radio_id'] = id
				
				this.api.likeygb(data).then(res => {
			          this.area.like_num = this.area.like_num + 1
					  this.area.like_status = 1
				})
			},
		   dealConcern(id,sta) {
				let data = {},status
				data['token'] = this.token
				data['user_id'] = id
				if (sta == 1) status = 2
				else status = 1
				data['attention_status'] = status
				this.api.addAttention(data).then(res => {
					if (this.area.user_info.attention_status == 1) this.area.user_info.attention_status = 2
					else this.area.user_info.attention_status = 1
				})
			}
		},
		onHide() {
			console.log('hidden');
			if (this.audioContext) this.audioContext.destroy();
		},
		onUnload() {
			if (this.audioContext) this.audioContext.destroy();
			// uni.setStorageSync('flag', true)
			uni.setStorage({
				key:'flag',
				data: 'flag'
			})
		},
		components: {
			imtAudio
		}
	};
</script>

<style>
	view {
		line-height: 1.6;
	}

	page {
		height: 100%;
		width: 100%;
		/* background: #ffffff; */
	}

	.head-box {
		background: #f74c44;
	}

	.user-info {
		background: #ffffff;
		padding: 22upx 27upx 22upx 29upx;
		margin-bottom: 18upx;
	}

	.name-img {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #f74c44;
		padding: 12upx 53upx;
		display: flex;
		justify-content: space-between;
		color: #ffffff;
	}

	.user-box image {
		border: 1px solid rgba(242, 242, 242, 1);
		border-radius: 50%;
		height: 100upx;
		width: 100upx;
	}

	.user-box {
		display: flex;
	}

	.user-box .text-info {
		margin-left: 13upx;
		display: flex;
		height: 100upx;
		flex-direction: column;
		padding-top: 15upx;
	}

	.text-info text:nth-child(1) {
		font-size: 28upx;
	}

	.text-info text:nth-child(2) {
		margin-top: 5upx;
		font-size: 20upx;
	}

	.name-img .follow {
		margin-top: 25upx;
	}

	.name-img .follow text {
		padding: 12upx 23upx;
		border: 2upx solid #ffffff;
		border-radius: 10upx;
	}

	.name-img .no-follow {
		margin-top: 25upx;
	}

	.name-img .no-follow text {
		padding: 12upx 23upx;
		border: 1upx solid #ffffff;
		border-radius: 10upx;
	}

	.play-audio .concern-btn {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 110upx;
		height: 50upx;
		border: 1px solid #FFFFFF;
		border-radius: 10upx;
		font-size: 24upx;
	}

	.play-audio .audio-title {
		padding-left: 53upx;
		color: #fff;
		background: #F74C44;
		font-size: 28upx;
	}

	.play-audio .audio {
		background: #f74c44;
	}

	.ti-cont {
		color: #333333;
		height: 100%;
		background: #ffffff;
		font-size: 30upx;
		padding: 33upx;
	}

	.ti-cont .title {
		margin: 0 0 25upx 0;
	}

	.box-grop {
		position: relative;
	}

	.ridio-by {
		position: absolute;
		/* left: 30upx; */
		top: 0upx;
	}

	.cont-box {
		margin-left: 60upx;
	}

	.bt-grop {
		display: flex;
		font-size: 32upx;
	}

/* 	.answer-box {
		padding-bottom: 140upx;
	} */
    .ti-cont .answer {
		display: flex;
		align-items: center;
		margin-top: 20upx;
	}
	.ti-cont .right-result {
		margin-top: 20upx;
		color: #F74C44;
		font-size: 30upx;
	}
	.ti-cont .answer .pic {
		display: block;
		min-width: 38upx;
		width: 38upx;
		height: 38upx;
	}
	.ti-cont .answer .text {
		margin-left: 9upx;
		font-size: 30upx;
		color: #333333;
	}
	.bt-grop .again-edit {
		width: 230upx;
		height: 88upx;
		border: 2upx solid rgba(153, 153, 153, 1);
		border-radius: 44upx;
		color: #666666;
		background: #ffffff;
	}

	.bt-grop .up-sure {
		width: 230upx;
		height: 88upx;
		line-height: 88upx;
		border-radius: 44upx;
		background: #f74c44;
		color: #ffffff;
	}

	.comment-box-user {}

	.comment-box {
		background: #FFFFFF;
		margin-top: 20upx;
		padding-bottom: 100upx;
	}

	.comment-box .comment-line {
		color: #333333;
		display: block;
		padding: 18upx 31upx;
		border-bottom: 1px solid #EEEEEE;
	}

	.comment-box .coment-box-in {
		padding: 24upx 32upx 0 32upx;
		border-bottom: 1upx solid #EEEEEE;
	}

	.comment-box .nei-ron {
		border-bottom: 1upx solid #EEEEEE;
		padding-bottom: 10upx;
	}

	.comment-box .zan-comment {
		display: flex;
		justify-content: space-between;
		height: 90upx;
		align-items: center;
		color: #666666;
		font-size: 23upx;
		padding: 0 100upx;

	}

	.comment-box .zan-comment view {
		font-size: 23upx;
		display: flex;
		align-items: center;
	}
    .comment-box .zan-comment view.end {
		display: flex;
		justify-content: flex-end;
	}
	.comment-box .zan-comment image {
		margin-right: 14upx;
		height: 31upx;
		width: 30upx;

	}

	.control-box {
		position: fixed;
		bottom: 0px;
		left: 0px;
		height: 98upx;
		border-top: 1upx solid #EEEEEE;
		padding: 18upx 0 0 0;
		display: flex;
		width: 100%;
		justify-content: space-between;
		align-items: center;
		background: #FFFFFF;
		align-items: center;
	}

	.control-box .box-ico {
		color: #666666;
		font-size: 24upx;
		text-align: center;
		display: flex;
		justify-content: center;

	}

	.control-box .box-ico1 {
		padding-left: 40upx;
	}

	.control-box .box-ico2 {
		padding-right: 40upx;
	}

	.control-box .box-ico image {
		margin-right: 5upx;
		height: 38upx;
		width: 38upx;
		vertical-align: middle;
	}

	.fixed-answer {
		position: fixed;
		top: 246upx;
		left: 0;
		bottom: 0;
		width: 100vw;
		background: rgba(0, 0, 0, .1);
	}
</style>
