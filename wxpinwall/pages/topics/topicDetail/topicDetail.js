// pages/topics/topicDetail.js
const app = getApp();
Page({

   /**
    * 页面的初始数据
    */
   data: {
      //请求参数
      limit:10,
      offset: 0,
      topicId: "",
      // 数据数组
      dataList:[],
      loading: false,
      avatarUrl:"",
      fullname:"",
      atrifactCount:"",
      topicName:""
   },
   // 点击顶部小图片进入作品详情
   tapTheArtifact(event){
      let artifactId = event.detail.target.dataset.artifactId;
      wx.navigateTo({
         url: '/pages/topics/artifactDetail/artifactDetail?artifactId=' + artifactId,
      })
   },
   // 点击作品进入作品详情
   artifactTap(event){
      let artifactId = event.target.dataset.artifactId;
      wx.navigateTo({
         url: '/pages/topics/artifactDetail/artifactDetail?artifactId=' + artifactId,
      })
   },
   // 点击用户头像姓名进入作品集
   // tapUserAvator(event){
   //    let userId = event.detail.target.dataset.userId;
   //    wx.navigateTo({
   //       url: '/pages/topics/showreelDetail/showreelDetail' + "?userId=" + userId + "&jobTag=0",
   //    })
   // },
   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function (options) {
      let that = this;
      this.setData({
         topicId:options.topicId
      })
      wx.request({
         url: app.globalData.baseUrl + app.globalData.getTopicAndArtifactById,
         data: {
            limit: this.data.limit,
            offset: this.data.offset,
            topicId: this.data.topicId,
         },
         method: "GET",
         success(res) {
            if (res.data.status == 200) {
               that.setData({
                  dataList: res.data.data.rows.artifacts,
                  avatarUrl: res.data.data.rows.user.avatarUrl,
                  fullname: res.data.data.rows.user.fullname,
                  atrifactCount: res.data.data.count,
                  createAt: res.data.data.rows.createAt,
                  topicName: res.data.data.rows.name,
               })
               wx.setNavigationBarTitle({
                  title: res.data.data.rows.name,
               })
            }
         }
      })
   },

   /**
    * 页面相关事件处理函数--监听用户下拉动作
    */
   onPullDownRefresh: function () {
      let that = this;
      this.setData({
         offset: 0
      })
      wx.request({
         url: app.globalData.baseUrl + app.globalData.getTopicAndArtifactById,
         data: {
            limit: this.data.limit,
            offset: this.data.offset,
            topicId: this.data.topicId,
         },
         method: "GET",
         success(res) {
            if (res.data.status == 200) {
               wx.stopPullDownRefresh();
               that.setData({
                  dataList: res.data.data.rows.artifacts,
                  avatarUrl: res.data.data.rows.user.avatarUrl,
                  fullname: res.data.data.rows.user.fullname,
                  atrifactCount: res.data.data.count,
                  createAt: res.data.data.rows.createAt,
                  topicName: res.data.data.rows.name,
               })
            }
         }
      })
   },

   /**
    * 页面上拉触底事件的处理函数
    */
   onReachBottom: function () {
      let that = this;
      this.setData({
         offset: this.data.offset + 10,
         loading: true
      })
      wx.request({
         url: app.globalData.baseUrl + app.globalData.getTopicAndArtifactById,
         data: {
            limit: this.data.limit,
            offset: this.data.offset,
            topicId: this.data.topicId,
         },
         method: "GET",
         success(res) {
            if (res.data.status == 200) {
               that.setData({
                  dataList: that.data.dataList.concat(res.data.data.rows.artifacts),
                  loading: false
               })
            }
         }
      })
   },

   /**
    * 用户点击右上角分享
    */
   onShareAppMessage: function () {

   }
})