import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login.vue'
import Home from '@/components/Home.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    // name: 'login',
    component: Login
  },
  {
    path: '/login',
    // name: 'login',
    component: Login
  },
  {
    path: '/home',
    component: Home
  },
]

const router = new VueRouter({
  routes
})

//挂载路由导航守卫
/*to 将要访问的路径
from 哪个路径来的
next 是个放行函数*/
router.beforeEach((to,from,next)=>{
  if(to.path=== '/login')  return next()
  const tokenStr= window.sessionStorage.getItem('token')
  if(!tokenStr)return next('/login')
  next()
})

export default router
