<template>
  <transition name="slide">
    <div class="singer-detail" >
      <music-list :songs='songs' :title='title' :bg-image='bgImage'></music-list>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from 'components/music-list/music-list'
  import {getSingerDetail} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'
  import {mapGetters} from 'vuex'

  export default {
    name: 'singer-detail',
    data() {
      return {
        songs: []
      }
    },
    computed: {
      title() {
        return this.singer.name;
      },
      bgImage() {
        return this.singer.avatar
      },
      ...mapGetters([
        'singer'
      ])
    },
    methods: {
      _getDetail() {
        if(!this.singer.id) {
          this.$router.push('/singer');
          return
        }
        getSingerDetail(this.singer.id).then((res) => {
          if(res.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.data.list);
          }
        });
      },
      _normalizeSongs(list) {
        let ret = [];
        list.forEach((item) => {
          // 对象的结构赋值 相当于  let musicData = item.musicData
          let {musicData} = item
          if(musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData));
          }
        })
        return ret;
      }
    },
    created() {
      this._getDetail();
    },
    components: {
      MusicList
    }
  }  
  
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
  .singer-detail 
    position: fixed
    z-index: 1000
    top: 0
    left: 0
    right: 0
    bottom: 0
    background: #333
    
</style>