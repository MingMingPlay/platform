<template>
    <div class="area-setting">

        <el-dialog title="选择区域" v-model="dialogVisible" :close-on-click-modal="false">

            <div class="china-wrapper">
                <div class="province-wrapper" v-for="province in areaData">
                    <label class="province-label">
                        <el-checkbox :indeterminate="province.isIndeterminate" v-model="province.isCkecked" :disabled="province.isDisabled" :data-value="province.value" @change="handleCheckAll"></el-checkbox>
                        <span>{{ province.text }}</span>
                        <span style="font-size: 12px; color: #dd2727; font-style: italic;" v-show="province.count > 0">
                            <span>(</span>
                            <span>{{ province.count }}</span>
                            <span>)</span>
                        </span>
                    </label>
                    <div class="city-wrapper">
                        <i class="el-icon-caret-bottom trigger" @click="handleTrigger($event)"></i>
                        <div class="city-panel hide">
                            <label class="city-label" v-for="city in province.children">
                                <el-checkbox v-model="city.isCkecked" :disabled="city.isDisabled" :data-prov="province.value" :data-value="city.value" :data-text="city.text" @change="handlechanged"></el-checkbox>
                                <span>{{ city.text }}</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div slot="footer" class="footer">
                <el-button type="primary" @click="handleSaveData">保 存</el-button>
                <el-button @click="dialogVisible = false">取 消</el-button>
            </div>

        </el-dialog>

    </div>
</template>

<script>
    import { cityData } from './city.data-3-1.min.js'
    import { bus } from '../../assets/unit/public.js'
    export default {
        data() {
            return {
                areaData: [],
                dialogVisible: false,
                /* 当前运费规则已选的数据 */
                checkedData: [],
                /* 运费规则 */
                /*shippingRules: [],*/
                /* 已经选中的城市 */
                cities: [],
            }
        },
        created() {
            this.areaData = cityData;
            this.areaData.forEach((pro) => {
                this.$set(pro, 'isCkecked', false)
                this.$set(pro, 'isDisabled', false)
                this.$set(pro, 'isIndeterminate', false)
                this.$set(pro, 'count', 0)
                pro.children.forEach((city) => {
                    this.$set(city, 'isCkecked', false)
                    this.$set(city, 'isDisabled', false)
                })
            });
        },
        mounted() {
            // 必须加点延迟，不然 Vue 会提醒 bus 实例为 undefined
            setTimeout(() => {
                bus.$on('edit-clicked', (arrData) => {
                    this.initAreaChecked(...arrData);
                })
            }, 10)
        },
        methods: {
            // 点击下拉按钮
            handleTrigger(e) {
                const self = e.target;
                const sibling = e.target.nextElementSibling;
                const label = e.target.parentElement.previousElementSibling;
                let arr1 = self.className.split(' ');
                let arr2 = sibling.className.split(' ');
                let arr3 = label.className.split(' ');
                if(arr1.indexOf('show') === -1) {
                    arr1.push('show');
                    self.className = arr1.join(' ');
                    arr3.push('show');
                    label.className = arr3.join(' ');
                    arr2.pop();
                    sibling.className = arr2.join(' ');
                } else {
                    arr1.pop();
                    self.className = arr1.join(' ');
                    arr3.pop();
                    label.className = arr3.join(' ');
                    arr2.push('hide');
                    sibling.className = arr2.join(' ');
                };
            },
            // 通过省级value返回当前省级
            getSomeProvince(val) {
                let data = this.areaData;
                for(let i = 0, len = data.length; i < len; i++) {
                    if(val === data[i].value) return data[i];
                    else continue;
                }
            },
            // 去掉当前省级前缀的value
            removeCheckedVal(prefix) {
                this.checkedData = this.checkedData.filter((item) => {
                    return item.value.slice(0, 2) !== prefix;
                });
            },
            removeCitiesVal(prefix) {
                this.cities = this.cities.filter((item) => {
                    return item.slice(0, 2) !== prefix;
                })
            },
            // 筛选出未禁用的城市
            notDisabledCity(prov) {
                return prov.children.filter((city) => {
                    return city.isDisabled === false;
                })
            },
            // 筛选出被选中的城市
            checkedCity(prov) {
                return prov.children.filter((city) => {
                    return city.isCkecked;
                })
            },
            // 筛选城市
            filterCity(newProv) {
                let arr = this.cities;
                newProv.forEach((city) => {
                    if(arr.indexOf(city.value) !== -1) {
                        arr.splice(arr.indexOf(city.value), 1)
                    }
                })
            },
            // 勾选省
            handleCheckAll(e) {
                const provValue = e.target.parentElement.parentElement.dataset.value;
                /* 所属省级前缀 */
                const provPrefix = provValue.slice(0, 2);
                const prov = this.getSomeProvince(provValue);
                let isExit = this.exitDisabled(prov);
                // 没有禁用的城市
                let newProv = this.notDisabledCity(prov);
                console.log(newProv);
                if(prov.isCkecked) {
                    prov.isIndeterminate = false;
                    prov.isCkecked = true;
                    prov.count = prov.children.length;
                    this.removeCheckedVal(provPrefix);
                    prov.children.forEach((city) => {
                        city.isCkecked = true;
                    });
                    if(isExit) {
                        newProv.forEach((city) => {
                            this.checkedData.push({ value: city.value, text: city.text });
                            this.cities.push(city.value);
                        });
                        this.cities = [...new Set(this.cities)];
                    } else {
                        this.removeCitiesVal(provPrefix);
                        // 添加省级行政区value
                        this.checkedData.push({ value: provValue, text: prov.text });
                        this.cities.push(provValue);
                        console.log('aaaa', this.checkedData);
                    }
                } else {
                    prov.count = 0;
                    if(isExit) {
                        // 显示横杠
                        prov.isIndeterminate = true;
                        // 把除了禁用的全部设为非勾选状态
                        newProv.forEach((city) => {
                            city.isCkecked = false;
                        });
                        // 清除checkedData
                        this.removeCheckedVal(provPrefix);
                        // 清除cities
                        this.filterCity(newProv);
                    } else {
                        prov.isIndeterminate = false;
                        prov.children.forEach((city) => {
                            city.isCkecked = false;
                        });
                        // 去掉省级行政区value
                        this.checkedData = this.checkedData.filter((item) => {
                            return item.value !== provValue;
                        });
                        this.cities = this.cities.filter((item) => {
                            return item !== provValue;
                        });
                    }
                }
            },
            // 是否存在不可操作的城市
            exitDisabled(prov) {
                return prov.children.some((city) => {
                    return city.isDisabled === true;
                })
            },
            // 勾选市
            handlechanged(e) {
                /* 所属省级value */
                const provValue = e.target.parentElement.parentElement.dataset.prov;
                /* 当前value */
                const cityValue = e.target.parentElement.parentElement.dataset.value;
                const cityText = e.target.parentElement.parentElement.dataset.text;
                /* 所属省级前缀 */
                const provPrefix = provValue.slice(0, 2);
                const prov = this.getSomeProvince(provValue);
                let isExit = this.exitDisabled(prov);
                if(isExit) {
                    // 没有禁用的城市
                    let newProv = this.notDisabledCity(prov);
                    let cityes = [];
                    newProv.forEach((city) => {
                        cityes.push(city.isCkecked);
                    });
                    if(cityes.indexOf(false) === -1) {
                        prov.isIndeterminate = false;
                        prov.isCkecked = true;
                    } else {
                        prov.isIndeterminate = true;
                        prov.isCkecked = false;
                    }
                    this.removeCheckedVal(provPrefix);
                    this.filterCity(newProv);
                    newProv.forEach((city) => {
                        if(city.isCkecked) {
                            this.checkedData.push({ value: city.value, text: city.text });
                            this.cities.push(city.value);
                            this.cities = [...new Set(this.cities)];
                        }
                    });
                    prov.count = this.checkedCity(prov).length;
                    console.log(this.checkedData);
                } else {
                    let cityes = [];
                    prov.children.forEach((city) => {
                        cityes.push(city.isCkecked);
                    });
                    if(cityes.indexOf(false) === -1) {
                        /* 全选 */
                        prov.count = prov.children.length;
                        prov.isIndeterminate = false;
                        prov.isCkecked = true;
                        this.removeCheckedVal(provPrefix);
                        this.removeCitiesVal(provPrefix);
                        this.checkedData.push({ value: provValue, text: prov.text });
                        this.cities.push(provValue);
                    } else if (cityes.indexOf(true) === -1) {
                        /* 反选 */
                        prov.count = 0;
                        prov.isIndeterminate = false;
                        prov.isCkecked = false;
                        this.removeCheckedVal(provPrefix);
                        this.removeCitiesVal(provPrefix);
                    } else {
                        /* 选中一些 */
                        let count = 0;
                        prov.isIndeterminate = true;
                        prov.isCkecked = false;
                        this.removeCheckedVal(provPrefix);
                        this.removeCitiesVal(provPrefix);
                        prov.children.forEach((city) => {
                            if(city.isCkecked) {
                                this.checkedData.push({ value: city.value, text: city.text });
                                this.cities.push(city.value);
                                this.cities = [...new Set(this.cities)];
                                count++;
                            }
                        });
                        prov.count = count;
                        console.log(this.checkedData);
                    }
                }
            },
            // 保存数据
            handleSaveData() {
                this.$emit('save-success', [this.checkedData, this.cities]);
                this.dialogVisible = false;
            },
            // 重置样式
            resetCheckBox() {
                this.areaData.forEach((pro) => {
                    pro.isCkecked = false;
                    pro.isDisabled = false;
                    pro.isIndeterminate = false;
                    pro.count = 0;
                    pro.children.forEach((city) => {
                        city.isCkecked = false;
                        city.isDisabled = false;
                    })
                });
            },
            // 编辑规则
            initAreaChecked(data, self) {
                this.resetCheckBox();
                /* 初始化勾选中的数据 */
                this.checkedData = [];
                self = self || '';
                let initArr = null;
                this.cities = initArr = data || [];
                /* 返回省级前缀标志集合 */
                const prefixArr = initArr.map((item) => {
                    return item.slice(0, 2);
                }).reduce((arr, item) => {
                    if(arr.indexOf(item) === -1) arr.push(item);
                    return arr;
                }, [])
                const activeProv = [];
                const areaData = this.areaData;
                for(let i = 0, len = areaData.length; i < len; i++) {
                    if(activeProv.length < prefixArr.length) {
                        if(prefixArr.indexOf(areaData[i].value.slice(0, 2)) !== -1) activeProv.push(areaData[i]);
                        else continue;
                    } else break;
                }
                console.log(prefixArr, initArr, activeProv);
                activeProv.forEach((pro) => {
                    let prefix = pro.value.slice(0, 2);
                    let count = 0;
                    initArr.forEach((item) => {
                        if(item.slice(0, 2) === prefix) count++;
                    })
                    if(self.indexOf(pro.value) !== -1) {
                        pro.isCkecked = true;
                        pro.isDisabled = false;
                        pro.children.forEach((city) => {
                            city.isCkecked = true;
                        });
                        this.checkedData.push({ value: pro.value, text: pro.text });
                    } else if(count === pro.children.length){
                        pro.isCkecked = true;
                        pro.isDisabled = true;
                        pro.children.forEach((city) => {
                            city.isCkecked = true;
                            if(self.indexOf(city.value) === -1) city.isDisabled = true;
                            else {
                                city.isDisabled = false;
                                this.checkedData.push({ value: city.value, text: city.text });
                            }
                        });
//                      if(self.indexOf(pro.value) !== -1) {
//                          pro.isDisabled = false;
//                          pro.children.forEach((city) => {
//                              city.isCkecked = true;
//                          });
//                          this.checkedData.push({ value: pro.value, text: pro.text });
//                      } else {
//                          pro.isDisabled = true;
//                          pro.children.forEach((city) => {
//                              city.isCkecked = true;
//                              if(self.indexOf(city.value) === -1) city.isDisabled = true;
//                              else {
//                                  city.isDisabled = false;
//                                  this.checkedData.push({ value: city.value, text: city.text });
//                              }
//                          });
//                      }
                    } else {
                        pro.isCkecked = false;
                        pro.isIndeterminate = true;
                        pro.children.forEach((city) => {
                            if(initArr.indexOf(city.value) !== -1) {
                                city.isCkecked = true;
                                if(self.indexOf(city.value) === -1) city.isDisabled = true;
                                else {
                                    city.isDisabled = false;
                                    this.checkedData.push({ value: city.value, text: city.text });
                                }
                            } else {
                                console.log('aaaaa')
                            }
                        })
                    }
                })
            }
        }
    }
</script>

<style>
    .area-setting .china-wrapper{ overflow: auto; min-height: 330px; }
    .area-setting .china-wrapper .el-checkbox__inner{ width: 16px; height: 16px; }
    .area-setting .province-wrapper{
        display: inline-block;
        width: 25%;
        height: 40px;
        line-height: 40px;
        white-space: nowrap;
        position: relative;
    }
    .area-setting .province-wrapper label{ font-size: 13px; }
    .area-setting .province-wrapper .province-label{ padding: 5px; border: 1px solid #fff; }
    .area-setting .province-wrapper .province-label.show{ background-color: #FFFEC6; border: 1px solid #f7e4a5; }
    .area-setting .city-wrapper{ display: inline-block; }
    .area-setting .trigger { font-size: 12px; color: #dd2727; cursor: pointer; }
    .area-setting .trigger.show {
        padding-top: 2px; -webkit-transform: rotate(180deg); -moz-transform: rotate(180deg); transform: rotate(180deg);
    }
    .area-setting .hide { display: none !important; }
    .area-setting .city-panel {
        position: absolute;
        top: 33px;
        left: 0;
        display: block;
        padding: 5px;
        background-color: #FFFEC6;
        border: 1px solid #f7e4a5;
        border-top: none;
        z-index: 3;
        width: 180px;
        word-break: break-all;
        white-space: normal;
        max-height: 200px;
        overflow-x: hidden;
        overflow-y: scroll;
        margin-bottom: 50px;
    }
    .area-setting .city-panel .city-label {
        display: inline-block; white-space: nowrap; margin-right: 10px;
    }
</style>
