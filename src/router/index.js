import Vue from 'vue'
import Home from '../components/Home.vue'
import About from '../components/About.vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export default new Router({
    routes : [
        {
            path:'/home',component:Home
        },
        {
            path:'/about',component:About
        }
    ]
})