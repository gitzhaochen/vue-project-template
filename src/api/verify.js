import config from '@/config';
const common_url=config.server_url+'/tread/web';

export default {
    common_url,
    list:common_url+'/list',//list 接口
    set:common_url+'/set',//审核 接口
}