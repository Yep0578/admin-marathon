import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const routes= [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: ()=> import('../components/Login.vue')
  },
  {
    path:'/home',
    name:'home',
    component: ()=> import('../components/Home.vue'),
    children:[
      {
        path:'/users',
        name:'users',
        component:()=> import('../components/Users.vue')
      },
      {
        path:'/game',
        name:'game',
        component:()=> import('../components/Game.vue')
      },
      {
        path:'/comment',
        name:'comment',
        component:()=> import('../components/Comment.vue')
      },
      {
        path:'/activity',
        name:'activity',
        component:()=> import('../components/Activity.vue')
      },
    ]
  }
]

const router = new Router({routes})

//路由导航守卫
router.beforeEach((to,from,next)=>{
  if(to.path == '/login')
    next()
  else {
    const username = window.sessionStorage.getItem('username')
    if(!username)
      next('/login')
    else
      next()
  }
}) 

export default router
