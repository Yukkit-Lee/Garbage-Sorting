//index.js
const app = getApp();
const db = wx.cloud.database();
var datanum;
var UserPoints;
var ExistFlag;
var MyOpenid;
var CheckFlag=0;
Page({
  data: {
    avatarUrl: './user-unlogin.png',
    nickName:'',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    flag:0,
    points:'',
    animation: '',
    page:'',
    MyOpenid:'',
    
  },

  onLoad: function() {
    
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
                flag:1
              })
  
              
              
            }
          })
          
        }
      }
    })
    //获取用户openid
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
MyOpenid=res.result.openid
      }
    })
    //判断是否需要初始化数据
db.collection("userdata").where({
_openid:MyOpenid
})
.get()
.then(res=>{
  console.log("ExistFlag变为1不需要初始化")
  ExistFlag=1;
})


    //初始化用户point值
    if(ExistFlag!==1)
    {
    db.collection("userdata")
    .add({
      data:{
        points:0
      }
    })
    .then(res=>{
      datanum=res._id
      console.log("初始化成功！","_id:",datanum)
    })
  }
     //从数据库获取用户积分getpoint
//      db.collection('userdata').where({
//        _openid:"ozlZM5JY_2VvQRFhWeK0rW5nyQfY"
//      })
//      .then(res=>{
//        console.log(res)
//        this.setData({
//          points:res.data.points
//        })
//  console.log(res)
//      })
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
       this.setData({
flag:1
       })

      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },


  refresh(){
 
//从数据库获取用户积分getpoint
db.collection('userdata').doc(datanum).get()
.then(res=>{
this.setData({
  points:res.data.points
})
console.log(res.data.points)
})
  },


  topage1(){

      wx.showToast({
        title: '请确保您是在已登录的状态下打开此页面(如您已登录可忽略)',
        duration: 500,
        icon:'none'
      })
      setTimeout(function () {
        wx.navigateTo({
          url: '/pages/3fun in login/Userinfo/Userinfo',
        })
      }, 500)

  },
  topage2(){


        wx.navigateTo({
          url: '/pages/3fun in login/pointmarket/pointmarket',
        })

  
    },
    topage3(){

          wx.navigateTo({
            url: '/pages/3fun in login/moments/moments',
          })


    
      }
})
