<template>
  <div class="hello">
    <div class="header">
      <div class="homeButton" @click="goHome">
        <a>
          <img src="@/assets/images/home-a@2x.png" alt="" />
          <span>返回首页</span>
        </a>
      </div>
    </div>
    <div class="content">
      <ul>
        <li>
          <div>
            <a href="https://www.mugeda.com/" target="_blank">
              <img src="@/assets/images/mugeda@2x.png" alt />
              <p>木疙瘩</p>
            </a>
          </div>
        </li>
        <li>
          <div>
            <a href="http://www.eqxiu.com/" target="_blank">
              <img src="@/assets/images/yiqixiu@2x.png" alt />
              <p>易企秀</p>
            </a>
          </div>
        </li>
        <li>
          <div>
            <a href="https://www.rabbitpre.com/" target="_blank">
              <img src="@/assets/images/tuzhan@2x.png" alt />
              <p>兔展</p>
            </a>
          </div>
        </li>
      </ul>
      <ul>
        <li>
          <div>
            <a href="http://www.ih5.cn" target="_blank">
              <img src="@/assets/images/ih5@2x.png" alt />
              <p>iH5</p>
            </a>
          </div>
        </li>
        <li>
          <div>
            <a href="https://cd.fkw.com/template.html" target="_blank">
              <img src="@/assets/images/fanke@2x.png" alt />
              <p>凡科微传单</p>
            </a>
          </div>
        </li>
        <li>
          <div>
            <a href="https://720yun.com/" target="_blank">
              <img src="@/assets/images/720yun@2x.png" alt />
              <p>720云</p>
            </a>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    goHome() {
      // this.$router.back(-1)
      window.location.href = '/';
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hello {
  text-align: center;
  position: absolute;
  background-image: url('https://img12.iqilu.com/1/sucaiku/202102/19/e50e3d4021334d01ac3b3b3f3c405c65.png');
  /* background-image: url('../assets/images/bg.png'); */
  width: 100%;
  height: 100%;
}
.header {
  padding: 30px 70px;
  text-align: right;
}
.header .homeButton a {
  color: #2c3e50;
  cursor: pointer;
}
.header .homeButton img {
  display: inline-block;
  margin-bottom: -5px;
}
.header .homeButton span {
  font-size: 16px;
  display: inline-block;
  margin-left: 0.5rem;
}
.content {
  margin-top: 100px;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
  margin-bottom: 35px;
}
li {
  display: inline-block;
  margin: 0 35px;
  cursor: pointer;
  width: 6%;
}
li img {
  width: 100%;
}
a {
  color: #2c3e50;
  text-decoration: none;
}
</style>
