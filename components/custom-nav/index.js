Component({
  properties: {
    'scrollSource': String,
    'title': String,
    'useScrollView': {
      type: Boolean,
      value: false,
    }
  },
  data: {
    navHeight: 0,
    menuBtnPadding: 0,
    navBackgroundColor: 'rgba(255, 255, 255, 0)',
    titleColor: '#fff',
  },
  lifetimes: {
    created: function () {
      const sysInfo = wx.getSystemInfoSync()
      const menuBtnRect = wx.getMenuButtonBoundingClientRect()
      this.navHeight = sysInfo.statusBarHeight + 44
      this.statusBarHeight = sysInfo.statusBarHeight
      this.menuBtnRect = menuBtnRect
      this.menuBtnPadding = sysInfo.windowWidth - menuBtnRect.right
    },
    attached: function () {
      // 如果是默认 监听 page 滚动事件
      if (!this.data.useScrollView) {
        const pages = getCurrentPages()
        const page = pages[pages.length - 1]
        this._curPage = page
        const _this = this
        if (page !== null && page !== undefined) {
          const pageScroll = page.onPageScroll
          this._pageScroll = pageScroll
          page.onPageScroll = function (e) {
            if (typeof pageScroll === 'function') {
              pageScroll.call(page, e)
            }
            _this.onScroll(e)
          }
        }
      }
    },
    detached: () => {
      if (this.data.useScrollView) {
        if (this._pageScroll) {
          this._curPage.onPageScroll = this._pageScroll
        } else if (this._curPage) {
          this._curPage.onPageScroll = undefined
        }
      }
    },
    ready: function () {
      this.setData({
        navHeight: this.navHeight,
        statusBarHeight: this.statusBarHeight,
        menuBtnRect: this.menuBtnRect,
        menuBtnPadding: this.menuBtnPadding,
      })

      // scoll view animate
      if (this.data.scrollSource && this.data.useScrollView) {
        this.animate(
          '.custom-nav', 
          [{
            backgroundColor: 'rgba(255, 255, 255, 0)',
          },
          {
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
          },
          {
            backgroundColor: 'rgba(255, 255, 255, 1)',
          }], 
          2000, 
          {
            scrollSource: this.data.scrollSource,
            timeRange: 2000,
            startScrollOffset: 0,
            endScrollOffset: this.navHeight,
          }
        )
      }
    }
  },
  methods: {
    onScroll: function(e) {
      const scrollTop = e.scrollTop
      const navHeight = this.navHeight
      const oldNavOpacity = this.oldNavOpacity
      const navOpacity = (scrollTop / navHeight).toFixed(2)
      const oldTitleColor = this.data.titleColor
    
      // 滚动过快
      // 保留2位小数 相同不执行
      if (scrollTop <= navHeight && oldNavOpacity !== navOpacity) {
        this.oldNavOpacity = navOpacity
        const newData = {
          navBackgroundColor: `rgba(255, 255, 255, ${navOpacity})`
        }

        if (oldTitleColor !== '#fff') {
          newData.titleColor = '#fff'
        }
        this.setData(newData)
        
      } else if (scrollTop > navHeight) {
        this.oldNavOpacity = 1
        this.setData({
          navBackgroundColor: `rgba(255, 255, 255, 1)`,
          titleColor: '#333'
        })
      }
    },
    // 当在scroll view 中使用
    onScrollView: function (e) {
      const scrollTop = e.detail.scrollTop
      const curTitleColor = this.data.titleColor
      const navHeight = this.navHeight

      if (scrollTop < navHeight) {
        if (curTitleColor !== '#fff') {
          this.setData({titleColor: '#fff'})
        }
      } else if (curTitleColor === '#fff') {
        this.setData({titleColor: '#333'})
      }
    }
  }
})