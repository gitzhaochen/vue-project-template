import Vue from 'vue'
import {Message} from 'element-ui'

Vue.component(Message.name, Message)


//生成随机数
export const getUUID = function (len) {
    len = len || 6;
    len = parseInt(len, 10);
    len = isNaN(len) ? 6 : len;
    var seed = "0123456789abcdefghijklmnopqrstubwxyzABCEDFGHIJKLMNOPQRSTUVWXYZ";
    var seedLen = seed.length - 1;
    var uuid = "";
    while (len--) {
        uuid += seed[Math.round(Math.random() * seedLen)];
    }
    return uuid;
};
//深拷贝
export const deepcopy = function (source) {
    if (!source) {
        return source;
    }
    let sourceCopy = source instanceof Array ? [] : {};
    for (let item in source) {
        sourceCopy[item] = typeof source[item] === 'object' ? deepcopy(source[item]) : source[item];
    }
    return sourceCopy;
};

//ajax错误处理
export const catchError = function (error) {
    if (error.response) {
        switch (error.response.status) {
            case 400:
                if(error.response.data.message==='Session expired!'){
                    session('userdata','');
                    session('permission','');
                    Vue.prototype.$message({
                        message: error.response.data.message || '请求参数异常',
                        type: 'error',
                        onClose: function () {
                            location.reload();
                        }
                    });
                }else{
                    Vue.prototype.$message({
                        message: error.response.data.message || '请求参数异常',
                        type: 'error'
                    });
                }
                break;
            case 401:
                // session('userdata','');
                // session('permission','');
                // Vue.prototype.$message({
                //     message: error.response.data.message || '密码错误或账号不存在！',
                //     type: 'warning',
                //     onClose: function () {
                //         location.reload();
                //     }
                // });
                break;
            case 403:
                Vue.prototype.$message({
                    message: error.response.data.message || '无访问权限，请联系企业管理员',
                    type: 'warning'
                });
                break;
            default:
                Vue.prototype.$message({
                    message: error.response.data.message || '服务端异常，请联系技术支持',
                    type: 'error'
                });
        }
    }
    return Promise.reject(error);
}
