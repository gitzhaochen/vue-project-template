import Vue from 'vue'
import axios from 'axios'
import * as util from '@/common/function/util';

axios.defaults.baseURL = '/';
axios.defaults.withCredentials = true;
//添加响应拦截器
axios.interceptors.response.use(function(response){
    //对响应数据做些事
    return response
},util.catchError);

Object.defineProperty(Vue.prototype, '$axios', { value: axios });
export default axios