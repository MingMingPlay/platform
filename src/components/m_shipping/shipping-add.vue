<template>
    <div class="shipping-add">

        <jkc-breadcrumb :crumbs="staticData.crumbs"></jkc-breadcrumb>

        <div class="detail-title">运费模板</div>
        <div class="detail-wrap">
            <el-form :model="shippingForm" :rules="rules" ref="shippingForm" label-width="80px" style="margin-top: 18px;">
                <el-form-item label="模板名称" prop="name">
                    <el-input v-model="shippingForm.name"></el-input>
                </el-form-item>
                <el-form-item label="区域地址" prop="addressSid">
                    <el-select class="area-full" v-model="shippingForm.addressSid" placeholder="请选择...">
                        <el-option v-for="(item,index) in addressData" :key="index" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="发货时间" prop="deadline">
                    <el-select v-model="shippingForm.deadline" placeholder="请选择...">
                        <el-option v-for="(item,index) in staticData.deadline" :key="index" 
                            :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                    <p style="font-size: 12px;">如实设定宝贝的发货时间，不仅可避免发货咨询和纠纷，还能促进成交！</p>
                </el-form-item>
                <el-form-item label="是否包邮" prop="shippingFree">
                    <el-radio-group v-model="shippingForm.shippingFree" @change="handleShippingFree">
                        <el-radio :label="false">不包邮</el-radio>
                        <el-radio :label="true">包邮</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="计价方式" prop="unitType">
                    <el-radio v-model="shippingForm.unitType" label="Number">按计件</el-radio>
                </el-form-item>
                <el-form-item label="运送方式" prop="shippingType">

                    <el-checkbox-group v-model="checkedList" class="shipping-type">
                        <el-checkbox label="Express">快递</el-checkbox>
                        <div class="rule-wrapper" v-show="expressCheck && !isShippingFree">
                            <div class="default-rule">
                                <span>默认运费</span>
                                <el-input ref="Inp0" type="number" v-model="ExpressDefault.minCount"></el-input>
                                <span>件内</span>
                                <el-input ref="Inp1" type="number" v-model="ExpressDefault.minAmountValue"></el-input>
                                <span>元，每增加</span>
                                <el-input ref="Inp2" type="number" v-model="ExpressDefault.increaseCount"></el-input>
                                <span>件，增加运费</span>
                                <el-input ref="Inp3" type="number" v-model="ExpressDefault.increaseAmountValue"></el-input>
                                <span>元</span>
                            </div>
                            <div class="item-error" v-show="!item.error" v-for="item in ExpressError">{{ item.message }}</div>
                            <div class="customize-rule" v-if="expressLength > 0">
                                <el-table stripe :data="ExpressData">
                                    <el-table-column label="选择地区" prop="areaNames"></el-table-column>
                                    <el-table-column width="60">
                                        <template slot-scope="scope">
                                            <el-button type="text" @click="handleEditArea(0, 'Express', scope.$index)">编辑</el-button>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="首件" width="80">
                                        <template slot-scope="scope">
                                            <el-input v-model="scope.row.minCount"></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="运费" width="120">
                                        <template slot-scope="scope">
                                            <el-input v-model="scope.row.minAmountValue"></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="续件" width="80">
                                        <template slot-scope="scope">
                                            <el-input v-model="scope.row.increaseCount"></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="续费" width="120">
                                        <template slot-scope="scope">
                                            <el-input v-model="scope.row.increaseAmountValue"></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="操作" width="60">
                                        <template slot-scope="scope">
                                            <el-button type="text" @click="handleDelArea('Express', scope.$index)">删除</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>

                            <el-button type="text" @click="handleAddArea('Express')">为指定地区城市设置运费</el-button>

                        </div>

                    </el-checkbox-group>

                </el-form-item>
                <el-form-item label="可选项" v-show="!isShippingFree">

                    <el-checkbox v-model="checked2" @change="handleShippingType">指定条件包邮</el-checkbox>

                    <div class="rule-wrapper" v-if="checkedList.length > 0 && checked2">
                        <div class="customize-rule">
                            <el-table stripe :data="FreeData">
                                <el-table-column label="选择地区" prop="areaNames"></el-table-column>
                                <el-table-column width="60">
                                    <template slot-scope="scope">
                                        <el-button type="text" @click="handleEditArea(2, 'Free', scope.$index)">编辑</el-button>
                                    </template>
                                </el-table-column>
                                <el-table-column label="运送方式" prop="shippingTypeName" width="100">
                                    <template slot-scope="scope">
                                        <el-select v-model="scope.row.shippingType">
                                            <el-option v-for="(item,index) in checkedListName" :key="index" 
                                                :label="item.name" :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column label="包邮条件" width="120">
                                    <template slot-scope="scope">
                                        <el-select v-model="scope.row.conditionType" @change="handleConditionType" @click.native="handle2ConditionType(scope.row)">
                                            <el-option label="件数" value="Number"></el-option>
                                            <el-option label="金额" value="Money"></el-option>
                                            <el-option label="件数+金额" value="NumberAndMoney"></el-option>
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column label="件数" width="80">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.minCount" :disabled="scope.row.conditionType === 'Money' ? true : false">
                                        </el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="金额" width="120">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.minAmountValue" :disabled="scope.row.conditionType === 'Number' ? true : false">
                                        </el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" width="60">
                                    <template slot-scope="scope">
                                        <el-button type="text" @click="handleDel2Area(scope.$index)">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>

                        <el-button type="text" @click="handleAdd2Area">为指定地区城市免邮费</el-button>

                    </div>

                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSubmit('shippingForm')">保存并返回</el-button>
                </el-form-item>
            </el-form>
        </div>

        <area-setting ref="area" @save-success="handleSaveSuccess"></area-setting>

    </div>
</template>

<script>
    import JkcBreadcrumb from '../common/jkc-breadcrumb.vue'
    import AreaSetting from './area-setting.vue'
    import { cityData } from './city.data-3-1.min.js'
    import { vm, router } from '../../pages/merchant.js'
    import shipping from './shipping.js'
    import { pubObj, bus } from '../../assets/unit/public.js'
    import api from '../../assets/config/m-api.js'

    export default {
        components: { JkcBreadcrumb, AreaSetting },
        data() {
            // 表单检验
            const rules = {
                name: [{
                    required: true,
                    message: '请输入模板名称'
                }, {
                    max: 25,
                    message: '模板名称最少必须由1个字组成,最多不能超过25个字'
                }],
                addressSid: [{
                    required: true,
                    message: '请选择区域地址'
                }],
                deadline: [{
                    required: true,
                    message: '请选择发货时间'
                }],
                shippingFree: [{
                    required: true,
                    message: '请选择是否包邮'
                }],
                unitType: [{
                    required: true,
                    message: '请选择计价方式'
                }],
                shippingType: [{
                    required: true,
                    trigger: 'change',
                    message: '请选择至少一种运送方式'
                }]
            }
            // ExpressError
            return {
                staticData: {},
                shippingForm: {
                    addressSid: null,
                    deadline: null,
                    shippingFree: false,
                    unitType: 'Number',
                    shippingType: null,
                    merchantSid: this.$root.userInfo.merchantSid,
                    shopSid: this.$route.query.shopSid
                },
                /* 运送方式是否被选中 */
                checkedList: [],
                /* 指定条件包邮是否被选中 */
                checked2: false,
                // 快递
                // ExpressDefault
                // ExpressData
                // ExpressError
                ExpressDefault: {
                    minCount: null,
                    minAmountValue: null,
                    increaseCount: null,
                    increaseAmountValue: null,
                    shippingType: 'Express',
                    policyDefault: true,
                },
                ExpressData: [],
                ExpressIndex: null,
                ExpressChecked: [],
                ExpressError: {
                    minCount: {
                        index: 0,
                        error: true,
                        message: null,
                        valid: [{
                            name: 'Null',
                            message: '不能为空',
                        }, {
                            name: 'Dot',
                            message: '请输入一个数字，不能包括减号和小数点',
                        }]
                    },
                    minAmountValue: {
                        index: 1,
                        error: true,
                        message: null,
                        valid: [{
                            name: 'Null',
                            message: '不能为空',
                        }, {
                            name: 'Decimal',
                            message: '不能有负数，且最多保留两位小数',
                        }]
                    },
                    increaseCount: {
                        index: 2,
                        error: true,
                        message: null,
                        valid: [{
                            name: 'Null',
                            message: '不能为空',
                        }, {
                            name: 'Dot',
                            message: '请输入一个数字，不能包括减号和小数点',
                        }]
                    },
                    increaseAmountValue: {
                        index: 3,
                        error: true,
                        message: null,
                        valid: [{
                            name: 'Null',
                            message: '不能为空',
                        }, {
                            name: 'Decimal',
                            message: '不能有负数，且最多保留两位小数',
                        }]
                    }
                },
                // EMS
                // EMSDefault
                // EMSData
                EMSDefault: {
                    minCount: null,
                    minAmountValue: null,
                    increaseCount: null,
                    increaseAmountValue: null,
                    shippingType: 'EMS',
                    policyDefault: true,
                },
                EMSData: [],
                EMSIndex: null,
                EMSChecked: [],
                EMSError: {
                    minCount: {
                        index: 4,
                        error: true,
                        message: null,
                        valid: [{
                            name: 'Null',
                            message: '不能为空',
                        }, {
                            name: 'Dot',
                            message: '请输入一个数字，不能包括减号和小数点',
                        }]
                    },
                    minAmountValue: {
                        index: 5,
                        error: true,
                        message: null,
                        valid: [{
                            name: 'Null',
                            message: '不能为空',
                        }, {
                            name: 'Decimal',
                            message: '不能有负数，且最多保留两位小数',
                        }]
                    },
                    increaseCount: {
                        index: 6,
                        error: true,
                        message: null,
                        valid: [{
                            name: 'Null',
                            message: '不能为空',
                        }, {
                            name: 'Dot',
                            message: '请输入一个数字，不能包括减号和小数点',
                        }]
                    },
                    increaseAmountValue: {
                        index: 7,
                        error: true,
                        message: null,
                        valid: [{
                            name: 'Null',
                            message: '不能为空',
                        }, {
                            name: 'Decimal',
                            message: '不能有负数，且最多保留两位小数',
                        }]
                    }
                },
                // 指定条件包邮
                // FreeData
                FreeData: [],
                FreeIndex: null,
                FreeChecked: [],
                FreeRow: {},
                rules: rules,
                /* 当前规则编号 */
                /* 运送方式配置区域还是包邮配置区域 */
                setAreaType: null,
                /* 已选省和城市 */
                /* 确定包邮 */
                isShippingFree: false,
                /* 地址库 */
                addressData: [],
            }
        },
        computed: {
            expressLength() { return this.ExpressData.length },
            emsLength() { return this.EMSData.length },
            expressCheck() {
                const list = this.checkedList;
                if(list.length === 1 && list[0] === 'Express') return true;
                else if(list.length === 2) return true;
                else return false;
            },
            emsCheck() {
                const list = this.checkedList;
                if(list.length === 1 && list[0] === 'EMS') return true;
                else if(list.length === 2) return true;
                else return false;
            },
            checkedListName() {
                const list = this.checkedList;
                if(list.length === 1 && list[0] === 'Express') {
                    return [{ name: '快递', value: 'Express' }];
                } else if(list.length === 1 && list[0] === 'EMS') {
                    return [{ name: 'EMS', value: 'EMS' }];
                } else if(list.length === 2) {
                    return [{ name: '快递', value: 'Express' }, { name: 'EMS', value: 'EMS' }];
                } else {
                    return [];
                }
            }
        },
        created() {
            this.staticData.crumbs = [{
                title: '运费模板'
            }, {
                title: '模板规则',
                to: '/m_shipping/template'
            }, {
                title: '新增'
            }];
            // 发货时间
            this.staticData.deadline = shipping.deadline;
        },
        mounted() {　this.getAddress();　},
        watch: {
            // 监听运送方式是否改变
            checkedList(val) {
                const list = val;
                if(list.length === 2) this.shippingForm.shippingType = 'ExpressAndEMS';
                else this.shippingForm.shippingType = list[0];
            }
        },
        methods: {
            // 中间方法获取当前行
            handle2ConditionType(row) { this.FreeRow = row; },
            // 包邮条件改变
            handleConditionType(val) {
                console.log(val, this.FreeRow)
                if(val === 'Number') this.FreeRow.minAmountValue = null;
                else if(val === 'Money') this.FreeRow.minCount = null;
            },
            // 点击可选性，判断运送方式是否勾选
            handleShippingType() {
                const len = this.checkedList.length;
                if(len === 0) {
                    this.$message.warning('请选择至少一种运费方式');
                    this.checked2 = false;
                }
            },
            // 验证方法
            // 地址库
            getAddress() {
                pubObj.httpRequest(this, {
                    url: api.address,
                    success(result) {
                        // 添加设置默认地址
                        result.data.map((item) => {
                            if(item.defaultSend) {
                                this.shippingForm.addressSid = item.sid;
                                return false;
                            } else return true;
                        })
                        // 地址库列表
                        this.addressData = result.data.reduce((arr, item) => {
                            const areaFullName = item.areaName.split(',').join('') + item.address;
                            arr.push({ value: item.sid, label: areaFullName });
                            return arr;
                        }, [])

                    }
                })
            },
            // 选择是否包邮给出提示
            handleShippingFree(bool) {
                if(bool) {
                    pubObj.showMessage(this, {
                        title: '提示信息',
                        content: '选择“包邮”后，所有区域的运费将设置为0元且原运费设置无法恢复，请保存原有运费设置。',
                        confirm() {
                            this.isShippingFree = bool;
                            this.ExpressData = [];
                            this.EMSData = [];
                            this.FreeData = [];
                            this.ExpressChecked = [];
                            this.EMSChecked = [];
                            this.FreeChecked = [];
                        },
                        cancel() {
                            this.shippingForm.shippingFree = false;
                        }
                    });
                } else this.isShippingFree = bool;
            },
            // 添加地区
            handleAddArea(name) {
                this[name + 'Data'].push({ areaNames: '未添加地区' });
                console.log(name + 'Data');
            },
            handleAdd2Area() {
                this.FreeData.push({
                    minCount: null,
                    shippingType: null,
                    conditionType: null,
                    minAmountValue: null,
                    areaNames: '未添加地区',
                    shippingTypeName: '快递'
                });
            },
            // 删除地区
            handleDelArea(name, index) {
                this[name + 'Data'].splice(index, 1);
            },
            handleDel2Area(index) {
                this.FreeData.splice(index, 1);
            },
            // 编辑地区
            handleEditArea(type, name, index) {
                this.setAreaType = type;
                this[name + 'Index'] = index;
                // 第一个参数：已经选中的城市[array]
                // 第二个参数：当前规则选中的城市[string]
                bus.$emit('edit-clicked', [this[name + 'Checked'], this[name + 'Data'][index].areaIds]);
                this.$refs.area.dialogVisible = true;
            },
            arrayReduce(data, prop) {
                return data.reduce((arr, item) => {
                    arr.push(item[prop]);
                    return arr;
                }, [])
            },
            // 选择区域组件点击保存
            handleSaveSuccess(arrData) {
                const type = this.setAreaType;
                let name = null;
                if(type === 2) {
                    name = 'Free';
                } else {
                    if(type === 0) {
                        name = 'Express';
                        this[name + 'Data'][this[name + 'Index']].shippingType = 'Express';
                    } else {
                        name = 'EMS';
                        this[name + 'Data'][this[name + 'Index']].shippingType = 'EMS';
                    }
                    this[name + 'Data'][this[name + 'Index']].policyDefault = false;
                }
                this[name + 'Checked'] = arrData[1];
                const concatText = this.arrayReduce(arrData[0], 'text').join('、');
                const concatValue = this.arrayReduce(arrData[0], 'value').join(',');
                this[name + 'Data'][this[name + 'Index']].areaNames = concatText;
                this[name + 'Data'][this[name + 'Index']].areaIds = concatValue;
            },
            validate(name, callback) {
                const obj = this[name + 'Error'];
                Object.keys(obj).forEach((key) => {
                    let arr = [];
                    obj[key].valid.forEach((item) => {
                        const error = this['valid' + item.name](name, key);
                        arr.push(error);
                        if(!error) obj[key].message = item.message;
                    })
                    const el = this.$refs['Inp' + obj[key].index].$el;
                    if(arr.indexOf(false) === -1) {
                        obj[key].error = true;
                        el.firstElementChild.style.borderColor = '#e4eaee';
                    } else {
                        obj[key].error = false;
                        el.firstElementChild.style.borderColor = '#ff4949';
                    }
                })
                const bool = Object.keys(obj).every((key) => {
                    return obj[key].error;
                })
                callback(bool)
            },
            validNull(name, key) {
                const obj = this[name + 'Default'];
                if(obj[key] === '' || obj[key] === null) return false;
                else return true;
            },
            validDot(name, key) {
                const obj = this[name + 'Default'];
                if(!obj[key]) return true;
                const [a, b] = [obj[key].indexOf('.'), obj[key].indexOf('-')];
                if(a !== -1 || b !== -1) return false;
                else return true;
            },
            validDecimal(name, key) {
                const obj = this[name + 'Default'];
                if(!obj[key]) return true;
                const [a, b] = [obj[key].indexOf('.'), obj[key].indexOf('-')];
                const c = (a === -1 ? 0 : obj[key].slice(a + 1).length);
                if(b !== -1) return false;
                else if(a !== -1 && c < 1 || c > 2) return false;
                else return true;
            },
            // 提交表单
            handleSubmit(formName) {
                const bool = this.validArea();
                if(bool) {
                    this.$message.warning('请选择地区'); return;
                } else {
                    let bool2 = this.validBlank();
                    if(bool2) {
                        this.$message.warning('请输入表格空白项：首件、运费、续件、续费'); return;
                    }
                }
                if(this.checked2) {
                    let bool3 = this.validFreeSelect();
                    if(bool3) {
                        this.$message.warning('请选择指定条件包邮中的：运送方式或包邮条件'); return;
                    } else {
                        let bool4 = this.validFreeBlank();
                        if(bool4) {
                            this.$message.warning('请输入指定条件包邮中的空白项：件数、金额'); return;
                        }
                    }
                }
                this.$refs[formName].validate((valid) => {
                    if(valid) {
                        if(this.isShippingFree) this.postData();
                        else {
                            let arr = [];
                            // 自定义
                            if(this.expressCheck) {
                                this.validate('Express', (valid) => {
                                    if(valid) arr.push(true);
                                    else arr.push(false);
                                });
                            }
                            if(this.emsCheck) {
                                this.validate('EMS', (valid) => {
                                    if(valid) arr.push(true);
                                    else arr.push(false);
                                });
                            }
                            const bool = arr.every((item) => { return item; })
                            if(bool) this.postData();
                        }
                    } else {
                        return false;
                    }
                });
            },
            // 验证地区是否选择
            validArea() {
                const data = this.ExpressData.concat(this.EMSData, this.FreeData);
                return data.some((item) => {
                    return (item.areaIds === '' || !item.areaIds);
                })
            },
            // 验证空白
            validBlank() {
                const data = this.ExpressData.concat(this.EMSData);
                return data.some((item) => {
                    return (
                        item.minCount === '' || !item.minCount ||
                        item.minAmountValue === '' || !item.minAmountValue ||
                        item.increaseCount === '' || !item.increaseCount ||
                        item.increaseAmountValue === '' || !item.increaseAmountValue
                    )
                })
            },
            // 验证选择项
            validFreeSelect() {
                const data = this.FreeData;
                return data.some((item) => {
                    return (
                        item.shippingType === '' || !item.shippingType ||
                        item.conditionType === '' || !item.conditionType
                    )
                })
            },
            // 验证空白项
            validFreeBlank() {
                const data = this.FreeData;
                return data.some((item) => {
                    if(item.conditionType === 'Number') {
                        return (item.minCount === '' || !item.minCount)
                    } else if(item.conditionType === 'Money') {
                        return (item.minAmountValue === '' || !item.minAmountValue)
                    } else {
                        return (
                            item.minCount === '' || !item.minCount ||
                            item.minAmountValue === '' || !item.minAmountValue
                        )
                    }
                })
            },
            // post数据
            postData() {
                let tableData = [];
                if(!this.isShippingFree) {
                    if(this.expressCheck) {
                        tableData.splice(0, 0, this.ExpressDefault);
                    } else {
                        this.ExpressDefault = {
                            minCount: null,
                            minAmountValue: null,
                            increaseCount: null,
                            increaseAmountValue: null,
                            shippingType: 'Express',
                            policyDefault: true
                        };
                        this.ExpressData = [];
                    }
                    if(this.emsCheck) {
                        tableData.splice(0, 0, this.EMSDefault);
                    } else {
                        this.EMSDefault = {
                            minCount: null,
                            minAmountValue: null,
                            increaseCount: null,
                            increaseAmountValue: null,
                            shippingType: 'EMS',
                            policyDefault: true
                        };
                        this.EMSData = []
                    }
                }
                tableData = tableData.concat(this.ExpressData, this.EMSData);
                const FreeData = this.checked2 ? this.FreeData : [];
                pubObj.httpRequest(this, {
                    url: api.shipping,
                    method: 'POST',
                    body: {
                        templateVO: this.shippingForm,
                        policyVOList: tableData,
                        freePolicyVOList: FreeData
                    },
                    success(result) {
                        this.$message.success(result.message);
                        router.go(-1);
                    }
                })
            }
        }
    }
</script>

<style>
    .shipping-add .el-form-item { width: 800px; }
    .shipping-add .el-cascader__label { line-height: 28px; }
    .shipping-add .rule-wrapper { padding: 5px; border: 1px solid #ddd; }
    .shipping-add .default-rule { background-color: #E8F2FF; padding: 5px; }
    .shipping-add .default-rule .el-input { width: 100px; }
    .shipping-add .customize-rule .el-table .cell { padding: 0 8px; }
    .shipping-add .customize-rule .el-table .cell .el-select .el-input__icon { width: 20px; }
    .shipping-add .customize-rule .el-table .cell .el-select .el-input__inner { padding-right: 20px; }
    .shipping-add .shipping-type .el-checkbox { display: block; }
    .shipping-add .area-full { width: 80%; }
    .shipping-add .item-error { color: #ff4949; font-size: 12px; line-height: 1; padding: 6px 0; }
</style>
