Page({
  data: {
   
  },
  onReady: function () {
    this.customNavInt = this.selectComponent('#custom-nav')
  },
  onScrollView: function (e) {
    const customNavInt = this.customNavInt
    if (customNavInt) {
      customNavInt.onScrollView(e)
    }
  }
})