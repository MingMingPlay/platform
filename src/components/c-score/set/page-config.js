/**
 * 当前模块页面配置
 */

import validator from '../../../assets/unit/validator.js'
export const crumbs = [{
    title: '积分管理',
}, {
    title: '积分设置 ',
}];

export const rules = {
    scoreToRmb: [
        { required: true, message: '请填写人民币与积分比值'},
    ],
    commentGetScore:[
        { required: true, message: '请填写评价获得积分'},
    ],
    commentSunScore:[
        { required: true, message: '请填写晒单获得积分'},
    ],
    forwardGetScore:[
        { required: true, message: '请填写转发文章获取积分'},
    ],
    forwardGetLimit:[
        { required: true, message: '请填写每日转发文章获取积分上限'},
    ],
    articleGetScore:[
        { required: true, message: '请填写文章评论得积分'},
    ],
    articleGetNum:[
        { required: true, message: '请填写阅读文章'},
    ],
    signGetGrowth:[
        { required: true, message: '请填写文章点赞'},
        // { type: 'number', message: '必须为数字值'}
    ],
    orderRatioScore:[
        { required: true, message: '请填写积分抵扣订单金额'},
        { validator: validator.rate_number(0.01,10),message: '最大抵扣10%',trigger: 'blur, change'},
    ],
};
