import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import VueRouter from 'vue-router'
import routes from '../router/c-router.js'
import VueResource from 'vue-resource'
import Vuex from 'vuex'
import modules from '../store/c-store.js'
import App from '../App.vue'
import '../assets/style/common.css'
import staticData from '../assets/config/staticData.js'
import api from '../assets/config/c-api.js'
import VueFilter from '../assets/unit/vue-filter.js'
import VueAwesomeSwiper from 'vue-awesome-swiper'

if(PRODCUTION === 'prod'){
    // 生产环境把 log 取消掉
    console.log = () => {};
}

Vue.use(VueResource)
Vue.use(ElementUI)
Vue.use(VueFilter)
Vue.use(VueAwesomeSwiper)

Vue.use(VueRouter)
export const router = new VueRouter({
	routes
})

Vue.use(Vuex);
Vue.prototype.$api = api;
const store = new Vuex.Store({
	modules: modules
})

if(!sessionStorage.token) {
	router.push('/login')
}

Vue.http.interceptors.push((request, next) => {
    if(typeof request.url === 'string'){
        if(request.headers.map['api-ver']);
        else request.headers.set('api-ver', '1.0.0');
    }else {
        let apiKey = request.url[0];
        let url = api[apiKey].url;
        let ver = '';
        let indexs = {
            get: 0,
            post: 1,
            put: 2,
            delete: 3,
        };
        for(let i=1;i<request.url.length;i++){
            url += request.url[i];
        }
        request.url = url;
        request.headers.set('api-ver', api[apiKey].api_ver[indexs[request.method.toLowerCase()]]);
    }

    request.headers.set('token', sessionStorage.token);
    request.headers.set('channel', '55PUjcD2MTi=Anl3ra');
    request.headers.set('charset', 'utf-8');

	// 返回结果
	next((response) => {
        // if(response.status === 0){
        //     ElementUI.Message({type:'warning',message: '连接超时'})
        // }
        if(response.body){
            for(var i = 0; i < staticData.loginState.length; i++) {
                if(response.body.code === staticData.loginState[i]) {
                    router.push('/login')
                }
            }
        }
		return response
	});
});

// 用于页面跳转判断登录
router.beforeEach((to, from, next) => {
	if(to.name === null) { // 页面不存在定向到首页
		next({
			path: '/'
		});
		return false;
	}
	//NProgress.start();
	if(to.path === '/login') {
		sessionStorage.removeItem('token');
	}
	if(!sessionStorage.token && to.path !== '/login') {
		next({
			path: '/login'
		})
	} else {
		next()
	}
})

const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
const merchantInfo = JSON.parse(sessionStorage.getItem('merchantInfo'));
export const vm = new Vue({
	el: '#pc',
	router,
	store,
	data() {
		return {
			platform: 'cloud', // cloud:云平台, merchant:商家端, author:作家端
			userInfo,
			merchantInfo,
		}
	},
	render: h => h(App)
})

// 中央事件总线 bus
export const bus = new Vue();
