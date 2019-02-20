<template>
  <div class="main">
    <el-container style="height: 100%;">
      <el-header>
        <h1>
          <a href="#">Saber-Auth</a>
        </h1>
      </el-header>
      <el-container>
        <el-aside style="width: auto;overflow: visible;">
          <el-button type="text" style="width: 100%;" @click="changeNav">
            <i class="el-icon-arrow-left nav-icon" ref="navIcon" :style="{transform: roz}"></i>
          </el-button>
          <el-menu
            default-active="/user"
            :router = "true"
            :unique-opened="true"
            :collapse="isCollapse"
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            style="border-right: none;"
            @select="_handleNavMenu">
            <template v-for="item in slideData" :index="item.path">
              <el-submenu :key="item.name" v-if="item.children" :index="item.path">
              <template slot="title">
                <i :class="item.icon"></i>
                <span>{{item.name}}</span>
              </template>
              <el-menu-item-group>
                <el-menu-item v-for="item1 in item.children" :key="item1.name" :index="item1.path">
                  {{item1.name}}
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-menu-item v-else :key="item.name" :index="item.path">
              <i class="el-icon-menu"></i>
              <span slot="title">{{item.name}}</span>
            </el-menu-item>
            </template>
          </el-menu>
        </el-aside>
        <el-main>
          <div class="breadcrumb-area">
              <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path" :to="item">{{item.name}}</el-breadcrumb-item>
                  <!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
                  <!-- <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item> -->
              </el-breadcrumb>
          </div>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isCollapse: false,
      roz: 'rotateZ(0deg)',
      slideData: [
        {
          name: '首页',
          path: '/index',
          icon: 'el-icon-location',
          children: [
            {
              name: '子菜单1',
              path: '/index'
            },
            {
              name: '子菜单2',
              path: '/role'
            }
          ]
        },
        {
          name: '权限管理',
          path: '/main',
          icon: 'el-icon-menu',
          children: [
            {
              name: '部门管理',
              path: '/dept'
            },
            {
              name: '用户管理',
              path: '/user'
            },
            {
              name: '角色管理',
              path: '/role'
            },
            {
              name: '权限管理',
              path: '/acl'
            },
            {
              name: '系统管理',
              path: '/manager'
            }
          ]
        }
      ],
      pathNameMap: {
        '/index': '子菜单1',
        '/main': '权限管理',
        '/dept': '部门管理',
        '/user': '用户管理',
        '/role': '角色管理',
        '/acl': '权限管理'
      },
      breadcrumbArr: ['/main', '/user']
    }
  },
  computed: {
    breadcrumbs () {
      var result = new Array();
      // var breadcrumbArr = this.breadcrumbStr.split(',')
      this.breadcrumbArr.forEach(path => {
        let item = {
          name: this.pathNameMap[path],
          path: path
        }
        result.push(item)
      })
      return result
    }
  },
  methods: {
    changeNav () {
      this.isCollapse = !this.isCollapse
      this.roz = this.isCollapse ? 'rotateZ(-90deg)' : 'rotateZ(0deg)'
    },
    _handleNavMenu (index, indexPath) {
      this.breadcrumbArr = indexPath
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "~@/common/stylus/variable"
  .el-menu-vertical-demo:not(.el-menu--collapse)
    width: 200px
    min-height: 400px
  .main
    position: absolute
    width: 100%
    top: 0
    left: 0
    bottom: 0
    .el-header
      background-color: $color-background
      h1
        float: left
        width: 150px
        padding-left: 50px
        a
          display: block
          .head-img
            width: 30px
    .el-aside
      background-color: $color-background
    .nav-icon
      transition: transform 1s
    a
      text-decoration: none
      color: white
  .breadcrumb-area
    margin-bottom: 15px
</style>
