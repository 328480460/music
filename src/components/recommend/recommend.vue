<template>
  <div class="recommend" ref="recommend">
    <Scroll class="recommend-content" :data='discList' ref='scroll'>
      <div>
        <div class="slider-wrapper" v-if='recommends.length'>
          <slider>
            <div v-for='item in recommends' slot='slider'>
              <a :href="item.linkUrl">
                <img class="needsclick" :src="item.picUrl" @load='loadImage'>
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li v-for='item in discList' class="item" @click='selectItem(item)'>
              <div class="icon">
                <img v-lazy="item.imgurl" width="60" height="60" />
              </div>
              <div class="text">
                <h2 class="name" v-html='item.creator.name'></h2>
                <p class="desc" v-html='item.dissname'></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </Scroll>
    <div class="loading-container" v-show='!discList.length'>
      <Loading></Loading>
    </div>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import Loading from 'base/loading/loading'
  import Scroll from 'base/scroll/scroll'
  import Slider from 'base/slider/slider'
  import {getRecommend, getDiscList} from 'api/recommend'
  import {ERR_OK} from 'api/config'
  import {playlistMixin} from 'common/js/mixin'
  import {mapMutations} from 'vuex'

  export default {
    name: 'recommend',
    mixins: [playlistMixin],
    data() {
      return {
        recommends: [],
        discList: []
      }
    },
    created() {
      this._getRecommend();
      this._getDiscList();
    },
    methods: {
      handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '60px' : '';
        this.$refs.recommend.style.bottom = bottom;
        this.$refs.scroll.refresh();
      },
      selectItem(item) {
        this.setDisc(item);
        this.$router.push({
          path: `/recommend/${item.dissid}`
        })
      },
      _getRecommend() {
        getRecommend().then((res) => {
          if(res.code === ERR_OK) {
            // console.log(res.data.slider);
            this.recommends = res.data.slider;
          }
        })
      },
      _getDiscList() {
        getDiscList().then((res) => {
          if(res.code === ERR_OK) {
            // console.log(res.data.list);
            this.discList = res.data.list;
          }
        })
      },
      // 防止因异步图片，无法正确初始化bscroll
      loadImage() { 
        if(!this.checkLoaded) {
          this.$refs.scroll.refresh();
          this.checkLoaded = true;
        }
      },
      ...mapMutations({
        setDisc: 'SET_DISC'
      })
    },
    components: {
      Slider,
      Scroll,
      Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>