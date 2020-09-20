// pages/3fun in login/moments/moments.js
const db=wx.cloud.database();
var app=getApp()
var MyOpenid;
var urlArr=[];
var util=require('../../../utils/util.js');
const _ =db.command
var LikeFlag=0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
address:'',
avatarUrl: '',
nickName:'',
userInfo: {},
logged: false,
takeSession: false,
requestResult: '',
dataobj:'',
testList:[],
time:'',
LikesNum:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    db.collection('test').get({
      success:res=> {
        console.log(res.data)
        this.setData({
          //将从云端获取的数据放到testList中
          testList:res.data,
        })
        
      },
      fail: console.error
    })

    
    if (!wx.cloud) {
      wx.showToast({
        title: '初始化失败',
        icon: 'none',
        duration: 2000
      })
      return
    }

  },

  onGetUserInfo: function(e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo,
        nickName:e.detail.userInfo.nickName
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        MyOpenid =res.result.openid
       this.setData({
flag:1
       })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    db.collection("usermoments")
    .get({
     success:res=>{
        console.log(res)
        this.setData({
          dataobj:res.data
        })
      }
        })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    db.collection("test")
    .get({
     success:res=>{
        console.log(res)
        this.setData({
          testList:res.data
        })
      }
        })
  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  newcontent(){


wx.chooseImage({
  count: 1,
  success:res=>{
    var filePath=res.tempFilePaths[0]
    this.cloudFile(filePath)
  }
})
  },

cloudFile(path){

  wx.showLoading({
    title: '上传中...',
  })



wx.cloud.uploadFile({
cloudPath:Date.now()+".jpg",
filePath:path
}).then(res=>{

        // 获取用户信息
        wx.getSetting({
          success: res => {
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
              wx.getUserInfo({
                success: res => {
                  this.setData({
                    avatarUrl: res.userInfo.avatarUrl,
                    userInfo: res.userInfo,
                    nickName:res.userInfo.nickName
                  })
                  console.log(res.userInfo.nickName)
                }
               
              })
              
            }
          }
        })
  var time = util.formatTime(new Date());
  console.log(time)
  db.collection("test").add({
    data:{
      fileID:res.fileID,
      time:time,
      point:0
    }//1 = yes  2 = no
  })
  console.log(res)
  this.setData({
    picUrl:res.fileID
  })





  wx.hideLoading()
})
setTimeout(function () {
  wx.showToast({
    title: '上传成功！',
    icon:'success'
  })
}, 1500)

}

,


GetLike(res){
  var {id,idx}=res.currentTarget.dataset

console.log(res.currentTarget.dataset)
if(LikeFlag===0)
{
db.collection("test").doc(res.currentTarget.dataset.id).update({
  data:{
    point:_.inc(1)
  }
})

LikeFlag=1
}
}

})


