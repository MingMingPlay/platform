<template>
    <div class="attr-wrap">
        <div class="table-wrap">
            <table border="1" class="sku-table">
                <tr>
                    <th v-for="item in selectTableTitle" v-if="item.children.length > 0">{{item.name}}</th>
                    <th v-for="item in batchSkuData">
                        <span :class="{'require': item.required}">{{item.name}}</span>
                    </th>
                </tr>
                <tr v-for="(value, key, n) in attrSkuData" :class="errorClass(value)">
                    <td v-for="(item, index) in selectTableTitle"
                        :rowspan="rowspan(index)"
                        v-if="isShow(n, index)"
                    >{{currentText(n, index)}}</td>
                    <td v-for="item in batchSkuData">
                        <el-input
                            v-if="item.type === 'inventory' || item.type === 'minimum'"
                            :maxlength="7"
                            v-model="value[item.type]"
                            @change="editPrice(item.type)"
                            :class="{'custom-error': item.required}"
                            @keyup.native="value[item.type] = pubObj.formatInt($event)">
                        </el-input>
                        <el-input
                            v-else
                            :maxlength="10"
                            v-model="value[item.type]"
                            @change="editPrice(item.type)"
                            :class="{'custom-error': item.required}"
                            @keyup.native="value[item.type] = pubObj.formatFloat($event)">
                        </el-input>
                    </td>
                </tr>
            </table>
        </div>
        <!--<div class="batch-set">-->
            <!--<span>批量设置：</span>-->
            <!--<div class="batch-set-wrap" v-for="item in batchSkuData">-->
                <!--<el-button type="text" @click="openBatchSet(item)">{{item.name}}</el-button>-->
                <!--<div class="attr-value-select" v-if="item.switch">-->
                    <!--&lt;!&ndash;整型和浮点数用不同的输入框&ndash;&gt;-->
                    <!--<el-input v-model="item.amount"-->
                              <!--v-if="item.isInt"-->
                              <!--:maxlength="7"-->
                              <!--@keyup.native="item.amount = pubObj.formatInt($event)"></el-input>-->
                    <!--<el-input v-model="item.amount"-->
                              <!--v-else-->
                              <!--:maxlength="10"-->
                              <!--@keyup.native="item.amount = pubObj.formatFloat($event)"></el-input>-->
                    <!--<el-button type="primary" @click="batchSetPrice(item)">确定</el-button>-->
                    <!--<el-button @click="item.switch = false">取消</el-button>-->
                <!--</div>-->
            <!--</div>-->
        <!--</div>-->
        <!--<div class="batch-set">-->
            <!--<span class="total">总库存：</span>-->
            <!--<div class="batch-set-wrap">-->
                <!--<el-input class="total-input" v-model="attrSkuTotal" disabled></el-input>-->
            <!--</div>-->
        <!--</div>-->
    </div>
</template>
<script>
    /**
     * @name    商品多规格价格以及库存
     * @attribute   {String} spuSid 商品的sid
     * @attribute   {Array} batchSkuData 需要对规格进行设置的字段
     * @event    show-sku 当前规格数据是否适合显示设置价格和库存的表格，返回值为布尔值
     * */
    import { pubObj } from '../../../assets/unit/public.js'
    import bus from '../common/bus.js'
    export default {
        props: {
            spuSid: '',
            batchSkuData: ''
        },
        data() {
            return {
                pubObj,
                selectTemp: [],		// 选择后临时储存和修改时后台返回的
                selectTableTitle: [],		// 储存规格有规格值的，用于表格头
                attrSkuData: {},		// 库存那一部分的数据
                attrSkuDataTemp: {},	// 库存那一部分的数据，后台返回
                attrSkuDataLen: null,	// 库存数据的总长度
                attrSkuTotal: 0,		// 总库存
            }
        },
        created(){
            bus.$on('attr-change', this.attrChange)
        },
        methods: {
            attrChange(newData, type){
                // 当规格组件内部规格发生变化触发
                this.selectTemp = newData;
                this.selectTableTitle = this.delNotChildren(newData);
                this.$emit('show-sku', this.selectTableTitle.length > 0);
                this.formatSkuData();
                if(type === 'get'){
                    this.getSkuData();
                }
            },
            getSkuData (){
                // 获取库存信息
                let sid = this.spuSid || this.$route.query.spuSid;
                this.$http.get(this.$api.sku + sid, {
                    headers: {
                        'api-ver': '2.0.0'
                    }
                }).then((result) => {
                    if(result.body.code === 200){
                        // 数据响应完毕，页面解除禁用
                        this.attrBlockLoading = false;
                        for(let i=0;i<result.body.data.length;i++){
                            this.attrSkuDataTemp[result.body.data[i].attrCode] = result.body.data[i];
                        }
                        if(result.body.data.length === 0){
                            this.attrSkuDataTemp = {};
                        }
                        this.formatSkuData();
                        // 存默认方便保存时比对，仅用字符串格式就可以了，避免内存占用
                        this.attrSkuDataDefault = JSON.stringify(this.attrSkuData);
                    }else{
                        this.$message({type:'warning',message:result.body.message});
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            formatSkuData (){
                // 把规格的数据组合成库存需要的数据
                var spuSid = this.spuSid || this.$route.query.spuSid;
                var attrSkuDataTemp = this.attrSkuDataTemp;
                function format(obj1, obj2) {		// 组合数据的方法
                    if(JSON.stringify(obj1) === '{}'){
                        for(let j=0;j<obj2.length;j++){
                            if(attrSkuDataTemp[obj2[j].code]){
                                obj1[obj2[j].code] = attrSkuDataTemp[obj2[j].code];
                            }else{
                                obj1[obj2[j].code] = {
                                    spuSid: spuSid,
                                    attrCode: obj2[j].code,
                                    sellingPrice: null,
                                    regularPrice: null,
                                    costPrice: null,
                                    employeePrice: null,
                                    inventory: null,
                                    barcode: '',
                                    minimum: '',
                                };
                            }
                        }
                    }else{
                        for(let key in obj1){
                            for(let a=0;a<obj2.length;a++){
                                if(attrSkuDataTemp[key +'|'+ obj2[a].code]){
                                    obj1[key +'|'+ obj2[a].code] = attrSkuDataTemp[key +'|'+ obj2[a].code];
                                }else{
                                    obj1[key +'|'+ obj2[a].code] = {
                                        spuSid: spuSid,
                                        attrCode: key +'|'+ obj2[a].code,
                                        sellingPrice: null,
                                        regularPrice: null,
                                        costPrice: null,
                                        employeePrice: null,
                                        inventory: null,
                                        barcode: '',
                                        minimum: '',
                                    };
                                }
                            }
                            delete obj1[key]
                        }
                    }
                    return obj1;
                }
                this.attrSkuData = {};
                this.attrSkuDataLen = 1;
                this.attrSkuTotal = 0;
                for(let i=0;i<this.selectTemp.length;i++){	// 循环调用组合数据方法
                    if(JSON.stringify(this.selectTemp[i].children) != '[]'){
                        this.attrSkuData = format(this.attrSkuData, this.selectTemp[i].children);
                        this.attrSkuDataLen = this.attrSkuDataLen * this.selectTemp[i].children.length
                    }
                }
                for(let key in this.attrSkuData){
                    this.attrSkuTotal += this.attrSkuData[key].inventory;
                }
            },
            delNotChildren (params){
                // 删除this.selectTemp的空数据，即没有子规格的数据，表格展示有用，有子规格才会渲染到表格
                var data = [];
                for(let i=0;i<params.length;i++){
                    if(JSON.stringify(params[i].children) != '[]'){
                        data.push(params[i]);
                    }
                }
                return data;
            },
            rowspan (index){
                // 生成库存表格向下合并的行
                if(index === this.selectTableTitle.length - 1){
                    return null;
                }else{
                    var t = 1;
                    for(var i=0;i<=index;i++){
                        t = t * this.selectTableTitle[i].children.length;
                    }
                    return this.attrSkuDataLen/t;
                }
            },
            isShow (n, index){
                // 被合并的行不能显示
                if(index === this.selectTableTitle.length - 1){
                    return true;
                }else{
                    var t = 1;
                    for(var i=0;i<=index;i++){
                        t = t * this.selectTableTitle[i].children.length;
                    }
                    return n%(this.attrSkuDataLen/t) === 0;
                }
            },
            currentText (n, index){
                // 显示的行当前应该展示的数据
                var tem1 = 1,
                    tem2 = 1,
                    row1 = null,	// 一轮数据所跨行
                    row2 = null;	// 自己跨的行
                for(let i=0;i<index;i++){
                    tem1 = tem1 * this.selectTableTitle[i].children.length;
                }
                for(let i=0;i<=index;i++){
                    tem2 = tem2 * this.selectTableTitle[i].children.length;
                }
                row1 = this.attrSkuDataLen/tem1;
                row2 = this.attrSkuDataLen/tem2;
                var a = parseInt(n%row1/row2);
                var re = this.selectTableTitle[index].children[a] ? this.selectTableTitle[index].children[a].name : '';
                return re;
            },
            errorClass (value){
                // tr上验证数据错误的class
                // 用于红色提示框
                for(let i=0;i<this.batchSkuData.length;i++){
                    let type = this.batchSkuData[i].type;
                    if(!pubObj.isEmpty(value[type])){
                        return 'is-empty';
                    }
                }
            },
            editPrice (type){
                // 编辑库存相关信息
                this.skuErrorTips = '';
                if(type === 'inventory'){
                    this.attrSkuTotal = 0;
                    for(let key in this.attrSkuData){
                        this.attrSkuTotal += Number(this.attrSkuData[key].inventory);
                    }
                }
            },
            openBatchSet (item){
                // 打开批量设置弹窗
                this.skuErrorTips = '';
                for(let i=0;i<this.batchSkuData.length;i++){
                    this.batchSkuData[i].switch = false;
                }
                item.switch = true;
            },
            batchSetPrice (item){
                // 批量设置数据
                if(item.amount){
                    if(item.type === 'inventory'){
                        this.attrSkuTotal = 0;
                    }
                    for(let key in this.attrSkuData){
                        this.attrSkuData[key][item.type] = item.amount;
                        if(item.type === 'inventory'){
                            this.attrSkuTotal += Number(item.amount);
                        }
                    }
                    item.switch = false;
                }
            },
            checkData(){
                // 验证提交数据的合法性
                let resultData = {
                    pass: true,// 是否通过
                    msg: '通过',// 提示语
                };
                let skuData = this.attrSkuData;
                let batch =  this.batchSkuData;
                for(let key in skuData){
                    for(let i=0;i<batch.length;i++){
                        // 判断当前必填项是否有值
                        let value = skuData[key][batch[i].type];
                        if(batch[i].required && !pubObj.isEmpty(value)){
                            resultData.pass = false;
                            resultData.msg = '请将必填项填写完整';
                            return resultData;
                        }
                        // 判断不能为 0 的字段是否合规
                        if(!batch[i].allowZero && pubObj.isEmpty(value) && value <= 0){
                            resultData.pass = false;
                            resultData.msg = batch[i].name + '必须大于零';
                            return resultData;
                        }
                    }
                }
                return resultData;
            },
            checkDataChange(){
                // 提交时检验数据是否发生了修改，没有修改返回 true，反之为 false
                if(this.attrSkuDataDefault === JSON.stringify(this.attrSkuData)){
                    return true;
                }
                return false;
            },
            submitData(type, callback){
                let data= [];
                let dataChange = this.checkDataChange();
                let url = '';
                let apiVer = '1.0.0';

//                if(!dataChange){
//                    for(let key in this.attrSkuData){
//                        data.push(this.attrSkuData[key]);
//                    }
//                }
                for(let key in this.attrSkuData){
                    data.push(this.attrSkuData[key]);
                }

                if(type === 'online'){
                    // 上架带保存数据
                    let sid = this.spuSid || this.$route.query.spuSid;
                    url = ['subscribeOnlinesave', sid];
                }else {
                    url = ['subscribeSkuSave'];
                }

                this.$http.post(url, data, {
                    headers: {
                        'api-ver': apiVer
                    }
                }).then((result) => {
                    callback(result);
                }).catch((err) => {
                    console.log(err)
                })
            }
        }
    }
</script>
<style>

</style>
