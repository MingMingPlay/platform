import validator from '../../../assets/unit/validator.js'


// 列表表头数据
export const headerData = {
    Selling: {
        title: {
            label: '商品名称',
            width: 250,
            labelClassName: 'first-col-no-padding',
            className: 'first-col-no-padding'
        },
        price: {
            label: '商品征订价格',
            width: 120,
            align: 'right'
        },
        onlineTime: {
            label: '上架时间',
            width: 150,
            align: 'center'
        },
        subOfflineTime: {
            label: '下架时间',
            width: 150,
            align: 'center'
        },
        startTime: {
            label: '征订时间',
            width: 150,
            align: 'center'
        },
        endTime: {
            label: '征订结束时间',
            width: 150,
            align: 'center'
        },
        salesNumber: {
            label: '已售数量',
            align: 'center'
        },
        subInventory: {
            label: '库存',
            align: 'center'
        },
        refund: {
            label: '退款金额',
            align: 'right'
        },
        stateName: {
            label: '状态'
        },
    },
    Storage: {
        title: {
            label: '商品名称',
            width: 250,
            labelClassName: 'first-col-no-padding',
            className: 'first-col-no-padding'
        },
        price: {
            label: '商品征订价格',
            width: 120,
            align: 'right'
        },
        onlineTime: {
            label: '上架时间',
            width: 150,
            align: 'center'
        },
        subOfflineTime: {
            label: '下架时间',
            width: 150,
            align: 'center'
        },
        startTime: {
            label: '征订时间',
            width: 150,
            align: 'center'
        },
        endTime: {
            label: '征订结束时间',
            width: 150,
            align: 'center'
        },
        stateName: {
            label: '状态'
        },
    },
}


// 验证规则
export const rules = {
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
        trigger: 'blur, change'
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
    price: [{
        required: true,
        message: '请输入征订价格',
        trigger: 'change'
    }]
}


export const batchSkuData = []
