import validator from '../unit/validator.js'

// 定义一个接收thisd的变量
let _this = null;
// 获取页面回调this
export const getThis = (th) => {
    _this = th;
}

/**
 * @description 验证类
 */
// 填写地址时，验证区域是否选择
const isAreaSelected = (rule, value, callback) => {
    if(_this.dialogForm.areaSid == '') {
        callback(new Error(rule.message));
    } else {
        callback();
    }
};

// 1、business.Vue
export const merchant = {
    crumbs: [{
        title: '商家管理'
    }, {
        title: '商家列表'
    }],
    // 商家管理-商家列表头
    tableHead: [{
        prop: 'nameFull',
        label: '商家名称',
        /*labelClassName: 'first-col-no-padding',
        className: 'first-col-no-padding',*/
    }, {
        prop: 'areaName',
        label: '商家地址',
    }, {
        prop: 'typeName',
        label: '商家类型',
    }, {
        prop: 'contactPhone',
        label: '联系电话',
    }, {
        prop: 'contactEmail',
        label: '联系邮箱',
    }],
    // 商家管理-商家详情
    basicInfo: [{
        label: '商家编码',
        prop: 'code',
    }, {
        label: '商家名称',
        prop: 'nameFull',
    }, {
        label: '登录账号',
        prop: 'username',
    }, {
        label: '商家介绍',
        prop: 'description',
    }, {
        label: '联系人',
        prop: 'legalName',
    }, {
        label: '联系手机',
        prop: 'contactPhone',
    }, {
        label: '联系邮箱',
        prop: 'contactEmail',
    }, {
        label: '区域地址',
        prop: 'areaName',
    }, {
        label: '详细地址',
        prop: 'address',
    }, {
        label: '渠道来源',
        prop: 'channelName',
    }, {
        label: '上架审核',
        prop: 'exemptionName',
    }, {
        label: '是否定制',
        prop: 'customizationName',
    }, {
        type: 'img',
        label: 'LOGO',
        prop: ['logoPath'],
    }],
    qualifiedInfo: [{
        label: '商家类型',
        prop: 'typeName',
    }, {
        label: '证件类型',
        prop: 'legalIdTypeName',
    }, {
        label: '证件号码',
        prop: 'legalIdCode',
    }, {
        label: '营业执照编码',
        prop: 'licenseCode'
    }, {
        type: 'img',
        label: '证件照片',
        prop: ['legalFrontPath', 'legalBackPath', 'licenseImagePath'],
    }, {
        label: '商家状态',
        prop: 'stateName',
    }, {
        label: '添加时间',
        prop: 'createdTime',
    }]
}

// 2、供应链
export const supplier = {
    // 供应链管理-状态
    supplierStatus: [{
        label: '合作中',
        prop: '0',
    }, {
        label: '审核中',
        prop: '1',
    }, {
        label: '已拒绝',
        prop: '2',
    }],
    // 供应链管理-代理商表头
    tableHead1: [{
        label: '我的供货商',
        prop: 'supplier',
    }, {
        label: '代理商简介',
        prop: 'supplierDescription',
    }, {
        label: '渠道来源',
        prop: 'channelName',
    }, {
        label: '联系电话',
        prop: 'supplierPhone',
    }, {
        label: '代理商编号',
        prop: 'supplierCode',
    }, {
        label: '状态',
        prop: 'stateName',
    }],
    // 供应链管理-供货商表头
    tableHead2: [{
        label: '我的代理商',
        prop: 'agentName',
    }, {
        label: '代理商简介',
        prop: 'agentDescription',
    }, {
        label: '渠道来源',
        prop: 'channelName',
    }, {
        label: '联系电话',
        prop: 'agentPhone',
    }, {
        label: '代理商编号',
        prop: 'agentCode',
    }, {
        label: '状态',
        prop: 'stateName',
    }],
    // 供应链管理-我是代理商详情
    supplierDetail1: [{
        label: '我的供货商',
        prop: 'supplier',
    }, {
        label: '供货商编号',
        prop: 'supplierCode',
    }, {
        label: '供货商介绍',
        prop: 'supplierDescription',
    }, {
        label: '联系电话',
        prop: 'supplierPhone',
    }, {
        label: '申请人姓名',
        prop: 'applyer',
    }, {
        label: '申请人编号',
        prop: 'applyerId',
    }, {
        label: '审核人员',
        prop: 'auditorName'
    }, {
        label: '审核意见',
        prop: 'auditOpinion',
    }, {
        label: '审核时间',
        prop: 'auditTime',
    }, {
        label: '渠道来源',
        prop: 'channelName',
    }, {
        label: '创建时间',
        prop: 'createdTime',
    }, {
        label: '修改时间',
        prop: 'updatedTime',
    }],
    // 供应链管理-我是供货商详情
    supplierDetail2: [{
        label: '我的代理商',
        prop: 'agentName',
    }, {
        label: '代理商编号',
        prop: 'agentCode',
    }, {
        label: '代理商介绍',
        prop: 'agentDescription',
    }, {
        label: '联系电话',
        prop: 'agentPhone',
    }, {
        label: '申请人姓名',
        prop: 'applyer',
    }, {
        label: '申请人编号',
        prop: 'applyerId',
    }, {
        label: '审核人员',
        prop: 'auditorName'
    }, {
        label: '审核意见',
        prop: 'auditOpinion',
    }, {
        label: '审核时间',
        prop: 'auditTime',
    }, {
        label: '渠道来源',
        prop: 'channelName',
    }, {
        label: '创建时间',
        prop: 'createdTime',
    }, {
        label: '修改时间',
        prop: 'updatedTime',
    }]
}

// 3、busi-info.vue
export const merchantInfo = {
    crumbs: [{
        title: '商家管理'
    }, {
        title: '商家列表',
        to: '/c_mall/merchant'
    }, {
        title: '新增商家'
    }],
    imgNameArr: [{
        imgSidName: 'legalFrontSid',
        imgPathName: 'legalFrontPath',
    }, {
        imgSidName: 'legalBackSid',
        imgPathName: 'legalBackPath',
    }, {
        imgSidName: 'licenseSid',
        imgPathName: 'licensePath',
    }, {
        imgSidName: 'logoSid',
        imgPathName: 'logoPath',
    }, {
        imgSidName: 'shopLogoSid',
        imgPathName: 'shopLogoPath',
    }],
    dialogForm: {
        nameFull: "",
        username: "",
        password: "",
        legalName: "",
        contactPhone: "",
        contactEmail: "",
        areaSid: "",
        address: "",
        description: "",
        channelSid: "",
        channelName: "",
        type: "Personal",
        legalIdType: "IdentityCard",
        legalIdCode: "",
        legalIdCode2: "",
        licenseCode: "",
        legalFrontSid: "",
        legalFrontPath: "",
        legalBackSid: "",
        legalBackPath: "",
        licenseImageSid: "",
        licenseImagePath: "",
        logoSid: "",
        logoPath: "",
        customization: false,
        exemption: null,
        mainCategorySid: null
    },
    rules: {
        logoSid: [{
            required: true,
            message: '请选择商家LOGO'
        }],
        legalName: [{
            required: true,
            message: '请输入联系人'
        }, {
            max: 10,
            message: '最多不超过10个字'
        }, {
            validator: validator.validName,
            message: '联系人只能输入中文和英文字符'
        }],
        contactPhone: [{
            required: true,
            message: '请输入手机号'
        }, {
            validator: validator.validCellphone,
            message: '请输入格式正确的手机号'
        }],
        contactEmail: [{
            type: 'email',
            message: '请输入格式正确的邮箱地址'
        }],
        areaSid: [{
            required: true,
            message: '请选择区域'
        }],
        address: [{
            max: 50,
            message: '详细地址最多不要超过50个字'
        }, {
            validator: isAreaSelected,
            message: '填写详细地址前，请先选择商家地址'
        }],
        description: [{
            max: 300,
            message: '商家简介300字符以内'
        }],
        customization: [{
            required: true,
            message: '请选择是否定制'
        }],
        channelSid: [{
            required: true,
            message: '请选择渠道'
        }],
        type: [{
            required: true,
            message: '请选择商家类型'
        }],
        legalIdType: [{
            required: true,
            message: '请选择证件类型'
        }],
        legalIdCode: [{
            required: true,
            message: '请输入身份证号码'
        }, {
            validator: validator.validIDcard,
            message: '请输入有效的身份证号码'
        }],
        legalIdCode2: [{
            required: true,
            message: '请输入护照编码'
        }],
        licenseCode: [{
            required: true,
            message: '请输入营业执照编码'
        }, {
            min: 18,
            max: 18,
            message: '请输入有效的营业执照(18位)'
        }],
        legalFrontSid: [{
            required: true,
            message: '请选择证件照片' 
        }],
        shopNameFull: [{
            required: true,
            message: '请输入店铺名称'
        }, {
            max: 30,
            message: '最多不超过30个字'
        }, {
            validator: validator.validName,
            message: '店铺名称只能输入中文和英文字符'
        }],
        shopNameAbbr: [{
            max: 15,
            message: '最多不超过15个字符'
        }, {
            validator: validator.validName,
            message: '店铺简称只能输入中文和英文字符'
        }],
        shopNameEn: [{
            max: 100,
            message: '最多不超过100个字符'
        }, {
            validator: validator.validNameEn,
            message: '请输入英文字符'
        }],
        shopLogoSid: [{
            required: true,
            message: '请上传店铺LOGO'
        }],
        mainCategorySid: [{
            required: true,
            message: '请选择主营品类',
        }],
        exemption: [{
            required: true,
            message: '请选择上架权限'
        }],
        shopAreaSid: [{
            required: true,
            message: '请选择店铺区域'
        }],
        shopServicePhone: [{
            validator: validator.validLandline,
            message: '请输入格式正确的电话，如：(028)9999999(9)'
        }],
        shopServiceQQ: [{
            validator: validator.validUserQQ,
            message: '请输入有效的qq号码'
        }],
        serviceMail: [{
            type: 'email',
            message: '请输入有效的邮箱格式',
            trigger: 'blur'
        }],
        leaseExecutive: [{
            validator: validator.validName,
            message: '请输入名称格式',
            trigger: 'blur'
        }],
        shopDescription: [{
            max: 300,
            message: '商家简介300字符以内'
        }],
        password: [{
            required: true,
            message: '请输入密码'
        }, {
            min: 6,
            max: 16,
            message: '密码长度6-16位',
            trigger: 'blur'
        }]
    }
}