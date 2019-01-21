import validator from '../../../assets/unit/validator.js'


// 列表表头数据
export const headerData = {
    Selling: {
        code: {
            label: '商品编码',
            labelClassName: 'first-col-no-padding',
            className: 'first-col-no-padding'
        },
        title: {
            label: '商品名称',
            width: 250
        },
        inventory: {
            label: '库存',
            width: 90
        },
        sellingPrice: {
            label: '售价',
            width: 120,
            align: 'center'
        },
        shopName: {
            label: '所属店铺'
        },
        brandName: {
            label: '品牌'
        },
        state: {
            label: '状态'
        },
        onlineTime: {
            label: '上架时间',
            width: 150,
            align: 'center'
        },
    },
    Storage: {
        code: {
            label: '商品编码',
            labelClassName: 'first-col-no-padding',
            className: 'first-col-no-padding'
        },
        title: {
            label: '商品名称',
            width: 250
        },
        inventory: {
            label: '库存',
            width: 90
        },
        sellingPrice: {
            label: '售价',
            width: 120,
            align: 'center'
        },
        shopName: {
            label: '所属店铺'
        },
        brandName: {
            label: '品牌'
        },
        state: {
            label: '状态'
        },
        updatedTime: {
            label: '修改时间',
            width: 150,
            align: 'center'
        },
    },
    CloudCheck: {
        code: {
            label: '商品编码',
            labelClassName: 'first-col-no-padding',
            className: 'first-col-no-padding'
        },
        title: {
            label: '商品名称',
            width: 250
        },
        stateName: {
            label: '商品审核状态',
            align: 'center'
        },
        updatedTime: {
            label: '申请时间',
            align: 'center'
        },
    },
    Refuse: {
        code: {
            label: '商品编码',
            labelClassName: 'first-col-no-padding',
            className: 'first-col-no-padding'
        },
        title: {
            label: '商品名称',
            width: 250
        },
        opinion: {
            label: '未通过理由',
        },
        auditName: {
            label: '审核人',
            align: 'center'
        },
        auditTime: {
            label: '审核时间',
            align: 'center'
        },
    },
}

// 验证商品标题是否重复
// function validGoodsTitle(rule, value, callback) {
//     let param = {
//         title: value,
//         merchantSid: this.$root.userInfo.merchantSid,
//         sid: this.$route.query.spuSid
//     };
//     this.$http.get(api.spu + 'validate', {params: param})
//         .then(result => {
//             if(result.body.code === 200 && result.body.data){
//                 callback(new Error('不能添加商品标题重复的商品'))
//             } else {
//                 callback();
//             }
//         }).catch(error => {
//         callback();
//         console.log(error)
//     })
// }


// 验证规则
export const rules = {
    brandSid: [{
        required: true,
        message: '请选择品牌',
        trigger: 'change'
    }],
    title: [{
        required: true,
        message: '请输入标题',
        trigger: 'blur, change'
    },{
        validator: validator.validStringLength,
        length: 32,
        message: '标题长度不能大于32个字符',
        trigger: 'blur'
    }],
    subTitle: [{
        required: true,
        message: '请输入副标题',
        trigger: 'blur'
    },{
        message: '副标题长度不能大于32个字符',
        max: 32,
        trigger: 'blur'
    }],
    spuImagesvo: [{
        type: 'array',
        required: true,
        min: 1,
        max: 5,
        message: '请上传商品图片',
        trigger: 'blur,change'
    }],
    description: [{
        required: true,
        message: '请编辑商品详情',
        trigger: 'blur,change'
    }],
    spuvoCategories: [{
        type: 'array',
        required: true,
        min: 1,
        message: '请选择商品分组',
        trigger: 'change'
    }],
    templateSid: [{
        required: true,
        message: '请选择运费模板',
        trigger: 'change'
    }]
}


export const batchSkuData = [		// 批量设置的数据/当前需要填的数据
    {
        name: '供货价',    // 按钮文本
        type: 'costPrice',  // 被设置的字段
        switch: false,  // 切换批量设置的输入框是否显示
        amount: null,   // 输入框的值
        required: true, // 是否必填，true为必填
        allowZero: false,   // 是否允许为0，true为允许
        isInt: false,   // 是否为整数，反之为两位小数的浮点数，true为整数
    },
    {
        name: '划线价',
        type: 'regularPrice',
        switch: false,
        amount: null,
        required: false,
        allowZero: false,
        isInt: false,
    },
    {
        name: '售价',
        type: 'sellingPrice',
        switch: false,
        amount: null,
        required: true,
        allowZero: false,
        isInt: false,
    },
    {
        name: '员工价',
        type: 'employeePrice',
        switch: false,
        amount: null,
        required: true,
        allowZero: false,
        isInt: false,
    },
    {
        name: '库存',
        type: 'inventory',
        switch: false,
        amount: null,
        required: true,
        allowZero: false,
        isInt: true,
    },
    {
        name: '起售数量',
        type: 'minimum',
        switch: false,
        amount: null,
        required: false,
        allowZero: false,
        isInt: true,
    },
]
