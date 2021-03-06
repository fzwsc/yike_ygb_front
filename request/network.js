import {API_URL} from './base'
function requestGet(url,data,onlyOne = false) {
		if(!onlyOne) uni.showLoading({
		title:'加载中',
		mask: true
	})
  return new Promise((resolve, reject) => {
	
    uni.request({
      url: API_URL + url,
      data: data,
      method: "GET", // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function(res){
				 	if(!onlyOne) uni.hideLoading()
         if (res.data.code == 200) {
			 
          resolve(res.data);
        }else if(res.data.code == -1){
        	uni.showToast({
        			title: res.data.msg,
        			icon: 'none'
        	});
			uni.removeStorageSync("token")
				
			uni.reLaunch({
				url:'/pages/login/login'
			})
			
			
        }else {
        	reject(res)
        }
        
      },
      fail: function(err) {
					if(!onlyOne) uni.hideLoading()
         reject(err);
      }
    })
  })
}
function requestPost(url,data,onlyOne = false) {
		if(!onlyOne) uni.showLoading({
		title:'加载中',
		mask: true
	})
  return new Promise((resolve, reject) => {
    uni.request({
      url: API_URL + url,
      data: data,
      method: "POST", // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function(res){
				 	if(!onlyOne) uni.hideLoading()
        //注意：可以对参数解密等处理
        if (res.data.code == 200) {
          resolve(res.data);
        }else if(res.data.code == -1){
					uni.showToast({
							title: res.data.msg,
							icon: 'none'
					});
        }else {
					reject(res)
				}
      },
      fail: function(err) {
					if(!onlyOne) uni.hideLoading()
         reject(err);
      }
    })
  });
}
function requestPic(url,filePath,name,data) {
   return new Promise( (resolve, reject) => {
    uni.uploadFile({
      url: API_URL + url,
      filePath: filePath,
      name: name,
      formData: data,
      success: res => {
         res = JSON.parse(res.data);
         if (res.code == 200) {
            resolve(res)
         }else{
            reject(res)
         }
      },
      fail: err => {
         reject(err)
      }
    })
   })
}

module.exports = {
  get: requestGet,
  post: requestPost,
  pic: requestPic
}