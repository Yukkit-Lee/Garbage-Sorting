// pages/Userinfo/Userinfo.js
const db=wx.cloud.database();
var app = getApp();
var MyOpenid;
var flag=0;

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
    DataObj:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!wx.cloud) {
      wx.showToast({
        title: '初始化失败',
        icon: 'none',
        duration: 2000
      })
      return
    }

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
                nickName:res.userInfo.nickName,
              })
              
              
            }
          })
          
        }
      }
    })
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
        MyOpenid=res.result.openid
        console.log(MyOpenid)
        this.Check()
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  //检测有无此人信息
Check(){
  console.log("我的openid是",MyOpenid)
  db.collection("userinfo").where({
    _openid:MyOpenid
  })
  .get({
    success:res=>{
      flag=1
      console.log(flag)
  }
}
  )
},

//提交表单内容
  BtnSub(res){
    this.onGetOpenid()
var {name,number,address}=res.detail.value;
  wx.showModal({
    title: '确认提交?',
    content: '个人信息一旦确认将无法更改',
    success (res) {
      if (res.confirm) {
        console.log("flag=",flag)
        if(flag===0){
        db.collection("userinfo").add({
          data:{
            name:name,
            number:number,
            address:address,
          }
          })
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: 1,
            success: (res) => {
              console.log("返回上一层成功!")
            }
          })
        }, 1500);
      }
      else{
        wx.showToast({
          title: '你的信息已经存在',
          icon: 'none'
        })
      }
      } 
      else if (res.cancel) {
        console.log('用户点击取消')
      }
    }
  })
  }
})