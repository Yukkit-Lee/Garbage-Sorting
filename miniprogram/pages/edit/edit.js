// pages/edit/edit.js
var util=require('../../utils/util.js')
const app = getApp();
const db=wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
address:'',
time:'',
PicAdd:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        wx.showLoading({
          title: '上传中',
        })
    
        const filePath = res.tempFilePaths[0] 

        // 上传图片
        wx.cloud.uploadFile({
          cloudPath:Date.now()+".jpg",
          filePath:filePath,
          success: res => {
  
            wx.showToast({
              icon: 'success',
              title: '上传成功',
            })
            app.globalData.fileID = res.fileID
            console.log('[上传文件] 成功：',res)
              console.log(app.globalData.fileID)
            // app.globalData.cloudPath = cloudPath
            // app.globalData.imagePath = filePath
            this.GetData()
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败', 
            })
          },
          complete: () => {
            wx.hideLoading()
          }

        })
      

      },
      fail: e => {
        console.error(e)
      }
    })
  },

  /* 动态上传 */ 
  bindFormSubmit: function(e) {
    console.log(e.detail.value.textarea)
    // 调用函数时，传入new Date()参数，返回值是日期和时间
var time = util.formatTime(new Date());
console.log(time)
    db.collection("usermoments")
    .add({
      data:{
        content:e.detail.value.textarea,
        time:time
      },
    })
    .then(res=>{
      console.log(res)
wx.showToast({
  title: '上传成功!',
  icon:'success',
  duration:2000
})
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
})