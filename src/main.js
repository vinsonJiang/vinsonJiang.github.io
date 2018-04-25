import Vue from 'vue'
import App from './App'
import router from './router'
// import VueResource from 'vue-resource'


new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: {App}
})