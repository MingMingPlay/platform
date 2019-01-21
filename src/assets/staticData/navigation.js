import validator from '../unit/validator.js'

// 2、navigation-form.vue
export const navigationForm = {
    dialogForm: {
        channelSid: null,
        attribute: null,
        type: 'Mall',
        guidingType: null,
        url: null,
        logoSid: null,
        logoPath: null,
        title: null,
        subTitle: null,
        backImgSid: null,
        backImgPath: null,
        color: null,
        displayable: true,
        editable: true,
        rank: 0,
        authorShopVOS: []
        /*visibleAreaSid: null,*/
        /*parentSid: null,*/
        /*position: null,
        template: null,*/
    },
    rules: {
        channelSid: [{
            required: true,
            message: '请选择渠道',
            trigger: 'blur'
        }],
        attribute: [{
            required: true,
            message: '请选择导航类别',
            trigger: 'blur'
        }],
        /*type: [{
            required: true,
            message: '请选择导航类型',
            trigger: 'blur'
        }],*/
        guidingType: [{
            required: true,
            message: '请选择指向类型',
            trigger: 'blur'
        }],
        url: [{
            required: true,
            message: '请输入链接地址',
            trigger: 'blur'
        }],
        logoSid: [{
            required: true,
            message: '请上传导航图片',
            trigger: 'blur'
        }],
        title: [{
            required: true,
            message: '请输入导航名称',
            trigger: 'blur'
        }, {
            min: 2,
            max: 10,
            message: '导航名称2-10个字符',
            trigger: 'blur'
        }],
        subTitle: [{
            validator: validator.validateValueLength,
            trigger: 'blur'
        }],
        backImgSid: [{
            required: true,
            message: '请上传背景图',
            trigger: 'blur'
        }],
        color: [{
            required: true,
            message: '请选择字体颜色',
            trigger: 'blur'
        }],
        displayable: [{
            type: 'boolean',
            required: true,
            message: '请选择是否显示',
            trigger: 'blur'
        }],
        editable: [{
            type: 'boolean',
            required: true,
            message: '请选择是否可编辑',
            trigger: 'blur'
        }],
        /*rank: [{
            type: 'number',
            message: '数字类型',
            trigger: 'blur'
        }, {
            required: true,
            message: '请选择排序值',
            trigger: 'blur'
        }]*/
        /*position: [{
            required: true,
            message: '请选择',
            trigger: 'blur'
        }],
        template: [{
            required: true,
            message: '请选择',
            trigger: 'blur'
        }]*/
    }
}
