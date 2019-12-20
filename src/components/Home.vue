<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/mall.png" alt="." />
        <span>XXX后台管理系统</span>
      </div>
      <el-button @click="logout">退出登录</el-button></el-header
    >
    <el-container>
      <el-aside :width="isCollapsed ? '64px' : '250px'">
        <div class="toggle-button " @click="toggleCollapse">
          <i
            :class="
              isCollapsed ? 'el-icon-d-arrow-right' : 'el-icon-d-arrow-left'
            "
          ></i>
        </div>
        <el-menu
          background-color="#343f44"
          text-color="#fff"
          active-text-color="#409eee"
          unique-opened
          :collapse="isCollapsed"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <el-submenu
            :index="item.id + ''"
            v-for="item in menulist"
            :key="item.id"
          >
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>

            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <i class="el-icon-menu"></i>
              {{ subItem.authName }}</el-menu-item
            >
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main>
          <router-view></router-view>
        </el-main>
        <el-footer>Footer</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  data() {
    return {
      menulist: [],
      iconsObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      isCollapsed: false,
      activePath: ''
    }
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      this.menulist = res.data
      // console.log(res)
    },
    toggleCollapse() {
      //点击折叠/展开菜单
      this.isCollapsed = !this.isCollapsed
    },
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style scoped lang="less">
.home-container {
  height: 100%;
}
.el-header {
  background-color: #343f44;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fffdef;
  > div {
    img {
      height: 50px;
    }
    display: flex;
    align-items: center;
    font-size: 20px;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #343f44;
  .iconfont {
    margin-right: 10px;
  }
  .el-menu {
    border-right: 0;
  }
  .toggle-button {
    background-color: #343f44;
    font-size: 10px;
    line-height: 23px;
    text-align: center;
    color: #fffdef;
    cursor: pointer;
  }
}
.el-main {
  background-color: #e9eef3;
}
.el-footer {
  background-color: #343f44;
}
</style>
