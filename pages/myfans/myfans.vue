<template>
	<view class="my-fans">
	  <view class="fans-item" v-for="(item,index) in list" :key="index">
	  	<view class="fans-t" hover-class="none">
	  		<navigator :url="'../persondetail/persondetail?userId='+item.user_id+'&role='+item.role_type" class="info-area" hover-class="none">
	  			<image :src="item.avatar" mode="" class="pic"></image>
	  			<view class="user-info">
	  					<view class="user-name">{{item.realname}}</view>
	  					<view class="user-ide">
	  						{{item.role_type == 1 ? '学生': '老师'}}
	  					</view>
	  				</view>
	  		</navigator>
			<template v-if="item.role_type == 2">
			  	 <view class="already-fans" v-if="item.status == 1" @click="dealConcern(item)">已关注</view>
	          	<view class="already-fans red" v-else @click="dealConcern(item)">+关注</view>
			</template>
	  		
	  	</view>
	  	<view class="fans-b">
	  		<view class="faculty">
	  			院系： {{item.collegename}}
	  		</view>
	  		<!-- <view class="course">教授课程：毛概</view> -->
	  	</view>
	  </view>
	  <view :hidden="hidden">
	  	<uni-load-more status="loading"></uni-load-more>
	  </view>
	</view>
</template>

<script>
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
	export default {
		data() {
			return {
				list: [],
				hidden: true,
				hasmore: true,
				curpage: 1,
				pagesize: 10,
				token: uni.getStorageSync("token")
			};
		},
// 		onLoad() {
//           this.fansList()
// 		},
		onShow() {
			 if (this.list.length > 0) this.curpage = 1
			this.fansList()
		},
		methods: {
			fansList(onlyOne = false) {
				let data = {};
				data["token"] = this.token;
				data['curpage'] = this.curpage;
				data['pagesize'] = this.pagesize
				this.hidden = true;
				this.api.myfans(data,onlyOne).then(res => {
					 if (this.curpage == 1) this.list = []
					  this.list = [...this.list,...res.datas.data]
					 this.hasmore = res.datas.has_more
					 this.curpage++
				}).catch(err => {
					
				})
			},
			dealConcern(item) {
				console.log(item);
				let data = {},status
				data['token'] = this.token
				data['user_id'] = item['user_id']
				if (item.status == 1) status = 2
				else status = 1
				data['attention_status'] = status
				this.api.addAttention(data).then(res => {
					if (item.status == 1) item.status = 2
					else item.status = 1
				})
			},
			
		},
		onReachBottom() {
			if(this.hasmore) this.hidden = false
			else{
				this.hidden = true
				return;
			}
			this.fansList(true)
		},
		components: {
			uniLoadMore
		}
	}
</script>

<style>
	.my-fans {
		padding: 0 30upx;
		 background: #fff;
	}
    .my-fans .fans-item {
   	  padding: 20upx 0;
   	  border-bottom: 1px solid #EEEEEE;
   }
   .my-fans .fans-item .fans-t {
   	  display: flex;
	  justify-content: space-between;
	  align-items: center;
   }
   .my-fans .user-ide {
	   font-size: 24upx;
	   color: #999999;
   }
     .my-fans .fans-t .info-area {
   		flex: 1;
		display: flex;
   		align-items: center;
   		font-size: 30upx;
   		color: #333333;
   	}
   	 .my-fans .info-area .pic{
   		 display: block;
   		 width: 62upx;
   		 height: 62upx;
   		 margin-right: 21upx;
		  border-radius: 50%;
		 overflow: hidden;
   	 }
   	 .my-fans .faculty {
   		 font-size: 22upx;
   		 color: #999999;
   	 } 
   .my-fans .fans-item .fans-b {
   	  display: flex;
   	  justify-content: space-between;
	  align-items: center;
   }
    .my-fans .already-fans {
   	   display: flex;
   	   justify-content: center;
   	   align-items: center;
   	   width: 110upx;
   	   height: 50upx;
   	   margin-bottom: 16upx;
   	   border: 1px solid #CCCCCC;
   	   font-size: 24upx;
   	   color: #666666;
   	   border-radius: 10upx;
    }
    .my-fans .already-fans.red {
   	   border: 1px solid #F74C44;
   	   color: #F74C44;
    }
    .my-fans .course {
   	   font-size: 22upx;
   	   color: #999999;
    }
</style>
