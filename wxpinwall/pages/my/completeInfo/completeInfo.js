// pages/my/completeInof/completeInof.js
const { $Toast } = require('../../../dist/base/index');
const app = getApp();
Page({

   /**
    * 页面的初始数据
    */
   data: {
      current: "new",
      username:"",
      mobile:"",
      smsCode:"",
      password:"",
      bindMobile:"",
      registerDisable: true,
      bindMobileDisable: true,
      mobileCodeText:"获取验证码",
      bindMobileCodeText:"获取验证码",
      codeDisable:false,
      bindCodeDisable: false
   },
   radioChange(event) {
      let type = event.currentTarget.dataset.type;
      if(type == "new"){
         this.setData({
            current: type,
            bindMobile: "",
            registerDisable: true,
            bindMobileDisable: true
         });
      }else{
         this.setData({
            current: type,
            username: "",
            mobile: "",
            password: "",
            registerDisable: true,
            bindMobileDisable: true
         });
      }
   },
   //username输入
   usernameChange(event){
      this.setData({
         username: event.detail.detail.value
      })
      if (this.data.username && this.data.mobile && this.data.smsCode && this.data.password) {
         this.setData({
            registerDisable: false
         })
      }else{
         this.setData({
            registerDisable: true
         })
      }
   },
   //mobile输入
   mobileChange(event){
      this.setData({
         mobile : event.detail.detail.value
      });
      if (this.data.username && this.data.mobile && this.data.smsCode && this.data.password) {
         this.setData({
            registerDisable: false
         })
      } else {
         this.setData({
            registerDisable: true
         })
      }
   },
   // 发送短信
   sendAcodeStg(event){
      let that = this;
      let mobileData = ""
      if (this.data.current == "new") {
         mobileData = this.data.mobile;
      } else if (this.data.current == "old") {
         mobileData = this.data.bindMobile;
      }
      wx.request({
         url: app.globalData.baseUrl + app.globalData.createSmsMessage + mobileData,
         success(res) {
            if(res.data.status == 200){
               $Toast({
                  content: res.data.data,
                  type: 'success',
                  duration: 3
               });
               clock(that);
            }else{
               $Toast({
                  content: res.data.data,
                  type: 'error',
                  duration: 3
               });
            }
         }
      })
   },
   // 短信验证
   smsCodeChange(event){
      let that = this;
      let mobileData = "";
      this.setData({
         smsCode: event.detail.detail.value
      })
      if (this.data.current == "new") {
         mobileData = this.data.mobile;
      } else if (this.data.current == "old"){
         mobileData = this.data.bindMobile;
      }
      if(this.data.smsCode.length == 6){
         wx.request({
            url: app.globalData.baseUrl + app.globalData.vertifySms,
            data:{
               mobile: mobileData, 
               smsCode: this.data.smsCode
            },
            success(res) {
               if (res.data.status == 200) {
                  $Toast({
                     content: res.data.data,
                     type: 'success',
                     duration: 3
                  });
               } else {
                  $Toast({
                     content: res.data.data,
                     type: 'error',
                     duration: 3
                  });
               }
            }
         })
      }
   },
   //password输入
   passwordChange(event) {
      this.setData({
         password: event.detail.detail.value
      });
      if (this.data.username && this.data.mobile && this.data.smsCode && this.data.password) {
         this.setData({
            registerDisable: false
         })
      } else {
         this.setData({
            registerDisable: true
         })
      }
   },
   //bindemial输入
   bindMobileChange(event){
      this.setData({
         bindMobile: event.detail.detail.value
      });
      if (this.data.bindMobile) {
         this.setData({
            bindMobileDisable: false
         })
      } else {
         this.setData({
            bindMobileDisable: true
         })
      }
   },
   //注册新用户
   register(){
      let that = this;
      let mobileExp = /^1[3|4|5|7|8][0-9]{9}$/;
      if (this.data.username && mobileExp.test(this.data.mobile) && this.data.smsCode && this.data.password.length > 5){
         wx.request({
            url: app.globalData.baseUrl + app.globalData.createWxUser,
            method:"POST",
            data:{
               mobile: this.data.mobile,
               smsCode: this.data.smsCode,
               fullname: this.data.username,
               password:this.data.password,
               openid: wx.getStorageSync("openid"),
               nickname: wx.getStorageSync("nickName"),
               sex: wx.getStorageSync("gender"),
               city: wx.getStorageSync("city"),
               province: wx.getStorageSync("province"),
               country: wx.getStorageSync("country"),
               headimageurl: wx.getStorageSync("avatarUrl"),

               encryptedData: wx.getStorageSync("encryptedData"),
               iv: wx.getStorageSync("iv"),
               sessionKey: wx.getStorageSync("sessionKey"),
            },
            success(res){
               wx.setStorageSync("myId", res.data.data.user.Id);
               wx.setStorageSync("myRole", res.data.data.roleName);
               if(res.data.status == 200){
                  $Toast({
                     content: res.data.data.message,
                     type: 'success',
                     duration: 3
                  });
                  wx.setStorageSync("isLogin", "true");
                  wx.switchTab({
                     url: '/pages/my/my',
                  })
               }
            }
         })
      } else if (!mobileExp.test(this.data.mobile)){
         $Toast({
            content: '请输入正确手机号格式!',
            type: 'error',
            duration: 3
         });
      } else if (this.data.password.length < 6) {
         $Toast({
            content: '密码长度至少6位!',
            type: 'error',
            duration: 3
         });
      }
   },
   //绑定现有用户
   bindMobile(){
      let that = this;
      let mobileExp = /^1[3|4|5|7|8][0-9]{9}$/;
      if (mobileExp.test(this.data.bindMobile)){
         wx.request({
            url: app.globalData.baseUrl + app.globalData.bindWeixinInfoByMobile,
            method: "POST",
            data: {
               mobile: this.data.bindMobile,
               smsCode: this.data.smsCode,
               openid: wx.getStorageSync("openid"),
               nickname: wx.getStorageSync("nickName"),
               sex: wx.getStorageSync("gender"),
               city: wx.getStorageSync("city"),
               province: wx.getStorageSync("province"),
               country: wx.getStorageSync("country"),
               headimageurl: wx.getStorageSync("avatarUrl"),

               encryptedData: wx.getStorageSync("encryptedData"),
               iv: wx.getStorageSync("iv"),
               sessionKey: wx.getStorageSync("sessionKey"),
            },
            success(res) {
               if (res.data.status == 200) {
                  wx.setStorageSync("myId", res.data.data.user.Id);
                  wx.setStorageSync("myRole", res.data.data.user.roles[0].name);
                  wx.setStorageSync("isLogin", "true");
                  $Toast({
                     content: res.data.data.message,
                     type: 'success',
                     duration: 3
                  });
                  wx.switchTab({
                     url: '/pages/my/my',
                  })
               }else{
                  $Toast({
                     content: res.data.data,
                     type: 'error',
                     duration: 3
                  });
               }
            }
         })
      } else{
         $Toast({
            content: '请输入正确邮箱格式!',
            type: 'error',
            duration: 3
         });
      }
   },
})

function clock(that) {
   var num = 60;
   var int = setInterval(function () {
      num > 0 ? num-- : clearInterval(int);
      if (that.data.current == "new") {
         that.setData({
            mobileCodeText: num + "秒后重试",
            codeDisable: true
         })
      } else if (that.data.current == "old") {
         that.setData({
            bindMobileCodeText: num + "秒后重试",
            bindCodeDisable: true
         })
      }
      if (num == 0) {
         if (that.data.current == "new") {
            that.setData({
               mobileCodeText: "获取验证码",
               codeDisable: false
            })
         } else if (that.data.current == "nold") {
            that.setData({
               bindMobileCodeText: "获取验证码",
               bindCodeDisable: false
            })
         }
      }
   }, 1000);   
}