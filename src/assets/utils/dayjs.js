import Vue from 'vue'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn' // load on demand

import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')
Object.defineProperty(Vue.prototype, '$dayjs', { value: dayjs })
