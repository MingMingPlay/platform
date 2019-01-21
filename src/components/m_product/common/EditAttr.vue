<template>
    <div class="attr-wrap">
        <div v-for="(item, index) in selectTemp">
            <div class="attr-title">
                <span class="attr-name" @click="openEditParentPanel(item)" v-if="!item.parentAttrSwitch">{{item.name}}</span>
                <div v-if="item.parentAttrSwitch">
                    <el-select
                        v-model="goodsAttr.skuSelect"
                        filterable
                        allow-create
                        placeholder="可添加自定义规格">
                        <el-option
                            v-for="item in defaultAttr"
                            :key="item.sid"
                            :label="item.name"
                            :value="item.sid">
                        </el-option>
                    </el-select>
                    <el-button type="primary" @click="selectSku(goodsAttr.skuSelect, defaultAttr, item)" :loading="submitAttrSwitch">确定</el-button>
                    <el-button @click="selectSku('cancel', '', item)">取消</el-button>
                </div>
                <i class="el-icon-circle-cross" @click="delAttr(item.sid)"></i>
            </div>
            <div class="attr-value-wrap clear">
                <div class="attr-value" v-for="(item1, index1) in item.children">
                    <i class="el-icon-circle-cross" @click="delAttr(item1.sid)"></i>
                    <p class="title" @click="openEditPanel(item1, index)">{{item1.name}}</p>
                    <div class="attr-value-select" v-if="item1.childrenAttrSwitch">
                        <el-select
                            v-model="goodsAttr['attrSelect' + index]"
                            filterable
                            allow-create
                            placeholder="可添加自定义规格">
                            <el-option
                                v-for="item2 in item.childrenTemp"
                                :key="item2.sid"
                                :label="item2.name"
                                :value="item2.sid">
                            </el-option>
                        </el-select>
                        <el-button type="primary" @click="selectAttrConfirm(goodsAttr['attrSelect' + index], index, item.childrenTemp, item1)" :loading="submitAttrSwitch">确定</el-button>
                        <el-button @click="selectAttrConfirm('cancel', index, '', item1)">取消</el-button>
                    </div>
                    <div class="attr-img" v-if="goodsAttr.attrImg && index === 0">
                        <el-upload class="image"
                                   :action="uploadSkuApi"
                                   :headers="uploadHeader"
                                   :show-file-list="false"
                                   :data="{'customMessage': item1.sid}"
                                   :on-success="attrUploadSuccess"
                                   :on-error="attrUploadError"
                                   :before-upload="attrUploadBefore">
                            <img v-if="item1.imagePath" :src="item1.imagePath" class="avatar">
                            <i v-else class="el-icon-plus"></i>
                        </el-upload>
                    </div>
                </div>
                <div class="attr-value">
                    <el-button type="text" @click="openAddPanel(item, index)">+ 添加</el-button>
                    <div class="attr-value-select" v-if="item.attrSwitch">
                        <el-select
                            v-model="goodsAttr['attrSelect' + index]"
                            filterable
                            allow-create
                            placeholder="可添加自定义规格">
                            <el-option
                                v-for="item1 in item.childrenTemp"
                                :key="item1.sid"
                                :label="item1.name"
                                :value="item1.sid">
                            </el-option>
                        </el-select>
                        <el-button type="primary" @click="selectAttrConfirm(goodsAttr['attrSelect' + index], index, item.childrenTemp)" :loading="submitAttrSwitch">确定</el-button>
                        <el-button @click="selectAttrConfirm('cancel', index)">取消</el-button>
                    </div>
                </div>
                <div class="attr-img-desc" v-if="goodsAttr.attrImg && index === 0 && item.children.length > 0">规格图片建议尺寸：1000x1000像素，非必传！</div>
            </div>
        </div>
        <div class="attr-title" v-if="selectTemp.length < 5">
            <el-button icon="plus" type="primary" v-if="!selectSwitch" @click="openAddParentPanel()">添加规格</el-button>
            <div v-if="selectSwitch">
                <el-select
                    v-model="goodsAttr.skuSelect"
                    filterable
                    allow-create
                    placeholder="可添加自定义规格">
                    <el-option
                        v-for="item in defaultAttr"
                        :key="item.sid"
                        :label="item.name"
                        :value="item.sid">
                    </el-option>
                </el-select>
                <el-button type="primary" @click="selectSku(goodsAttr.skuSelect, defaultAttr)" :loading="submitAttrSwitch">确定</el-button>
                <el-button @click="selectSku('cancel')">取消</el-button>
            </div>
        </div>
    </div>
</template>
<script>
    /**
     * @name    商品规格选择组件
     * @attribute   {String} spuSid 商品的sid
     * @event    attr-change 当规格发生变化时会触发事件总线上的 attr-change，回传两个参数，第一个为最新规格数据，第二个表示什么操作导致的改变，如：add（新增），edit（修改），del（删除）
     * */
    import { pubObj } from '../../../assets/unit/public.js'
    import bus from './bus.js'
    export default {
        props: {
            spuSid: ''
        },
        data() {
            return {
                uploadSkuApi: this.$api.attachment + 'ProductSpec',
                uploadHeader: pubObj.getHttpHeader(),
                uploadSwitch: false,
                defaultAttr: [],    // 后台获取的默认配置
                selectTemp: [], // 选择后临时储存和修改时后台返回的
                selectTableTitle: [],   // 储存规格有规格值的，用于表格头
//                attrBlockLoading: false,    // 规格模块数据加载中时，不能进行操作，如修改商品时到第二页
                selectSwitch: false,	// 选择规格的开关
                selectAttrSwitch: false,	// 选择规格的开关
                submitAttrSwitch: false,	// 提交规格按钮的loading
                goodsAttr: {			// 属性的一些临时字段，这里的012345是每一行规格的规格值的变量，事先定义是显示需要
                    attrImg: true,
                    skuSelect: '',
                    attrSelect0: '',
                    attrSelect1: '',
                    attrSelect2: '',
                    attrSelect3: '',
                    attrSelect4: '',
                    attrSelect5: '',
                },
            }
        },
        created(){
            this.getDefaultAttr();
        },
        methods: {
            getDefaultAttr (){		// 获取系统默认规格
                // 数据没有返回前页面禁用
//                this.attrBlockLoading = true;
                this.$http.get(this.$api.attribute, {
                    headers: {
                        'api-ver': '2.0.0'
                    }
                }).then((result) => {
                    if(result.body.code === 200){
                        this.defaultAttr = result.body.data;
                        this.getGoodsAttr();
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            getGoodsAttr (param){		// 获取商品的规格，这个参数只在修改和删除会传进来，值为edit，目的是记录当前添加规格图片是否勾上，解决的问题是当用户主动取消勾选，而数据发生删改，会重新获取新数据，避免被下面的逻辑重新勾上(暂时注释了勾选)
                let sid = this.spuSid || this.$route.query.spuSid;
                this.$http.get(this.$api.sku + 'skuattr/' + sid, {
                    headers: {
                        'api-ver': '2.0.0'
                    }
                }).then((result) => {
                        if(result.body.code === 200){
                            var data = result.body.data;
                            // 如果后台数据没有返回子集children字段，补上避免页面报错
                            for(let i=0;i<data.length;i++){
                                if(!data[i].children){
                                    data[i].children = [];
                                }
                            }
                            if(data.length > 0 && data[0].children && param != 'edit'){	// 第一个有图片把添加规格图片勾上
                                for(let i=0;i<data[0].children.length;i++){
                                    if(data[0].children[i].imageSid){
                                        this.goodsAttr.attrImg = true;
                                    }
                                }
                            }
                            for(let i=0;i<data.length;i++){
                                for(let j=0;j<this.defaultAttr.length;j++){
                                    if(data[i].name === this.defaultAttr[j].name){
                                        data[i].childrenTemp = this.defaultAttr[j].children;
                                    }
                                }
                                data[i].attrSwitch = false;		// 添加规格值小弹窗开关
                                data[i].parentAttrSwitch = false;		// 修改父规格小窗开关
                                if(data[i].children){
                                    data[i].children.forEach(value => {
                                        value.childrenAttrSwitch = false;   // 修改规格值小弹窗开关
                                    })
                                }
                            }
                            this.selectTemp = data;
                            bus.$emit('attr-change', this.selectTemp, 'get');
//                            this.selectTableTitle = this.delNotChildren(this.selectTemp);
//                            this.formatSkuData();
//                            this.getSkuData();
                        }
                    }).catch((err) => {
                    console.log(err)
                })
            },
            selectSku (sid, data, currentItem){
                // 选择系统的规格/自定义规格
                // sid: 当选择系统默认规格时，sid 为一个对象；当自定义输入规格时，sid 为输入的字符串
                // data: 为系统默认规格
                // currentItem: 修改的时候会传入当前修改的对象
                if(sid === 'cancel'){
                    this.selectSwitch = false;
                    this.goodsAttr.skuSelect = '';
                    if(currentItem){
                        currentItem.parentAttrSwitch = false;
                    }
                    return;
                }
                let value = '';
                if (data){
                    data.forEach((item) => {
                        if(item.sid === sid){
                            value = item;
                        }
                    });
                }
                if(!value){
                    value = sid;
                }
                // 判断重复
                var s = false;
                for(let i=0;i<this.selectTemp.length;i++){
                    let name = this.selectTemp[i].name;
                    if((typeof value === 'string' && name === value) || (typeof value === 'object' && name === value.name)){
                        if(currentItem && currentItem.sid === this.selectTemp[i].sid){
                            currentItem.parentAttrSwitch = false;
                        }else {
                            this.$message({type:'warning',message:'不能添加相同的规格'});
                        }
                        s = true;
                    }
                }
                if(s || !value) return false;
                var obj = {};
                if(typeof value === 'string'){
                    obj.name = value;
                    obj.parentAttrSwitch = false;
                }else{
                    obj = JSON.parse(JSON.stringify(value));
                    obj.childrenTemp = value.children;
                    obj.parentAttrSwitch = false;
                }
                obj.attrSwitch = false;
                obj.children = [];
                obj.spuSid = this.spuSid || this.$route.query.spuSid;
                if(this.selectTemp.length > 0){
                    obj.rank = this.selectTemp[this.selectTemp.length - 1].rank + 1;
                }else{
                    obj.rank = 1;
                }
                if(currentItem){
                    currentItem.name = obj.name;
                    this.editAttrConfirm([currentItem]);
                }else {
                    this.addAttr(obj);
                }
            },
            openAddParentPanel (){
                this.attrErrorTips = '';
                this.selectSwitch = true;
                for(let i=0;i<this.selectTemp.length;i++){
                    this.selectTemp[i].parentAttrSwitch = false;
                }
                this.goodsAttr.skuSelect = '';
            },
            openEditParentPanel (item){
                return false;// 禁用修改
                this.attrErrorTips = '';
                this.selectSwitch = false;
                for(let i=0;i<this.selectTemp.length;i++){
                    this.selectTemp[i].parentAttrSwitch = false;
                }
                item.parentAttrSwitch = true;
                this.goodsAttr.skuSelect = item.name;
            },
            openAddPanel (item, index){		// 打开新增规格值的小弹窗
                this.attrErrorTips = '';
                for(let i=0;i<this.selectTemp.length;i++){
                    this.selectTemp[i].attrSwitch = false;
                    if(this.selectTemp[i].children){
                        this.selectTemp[i].children.forEach(value => {
                            value.childrenAttrSwitch = false;
                        })
                    }
                }
                this.goodsAttr['attrSelect' + index] = '';
                item.attrSwitch = true;
            },
            openEditPanel (item, index){		// 打开编辑规格值的小弹窗
                return false;// 禁用修改
                this.attrErrorTips = '';
                for(let i=0;i<this.selectTemp.length;i++){
                    this.selectTemp[i].attrSwitch = false;
                    if(this.selectTemp[i].children){
                        this.selectTemp[i].children.forEach(value => {
                            value.childrenAttrSwitch = false;
                        })
                    }
                }
                item.childrenAttrSwitch = true;
                this.goodsAttr['attrSelect' + index] = item.name;
            },
            selectAttrConfirm (sid, index, item, childrenItem){	// 选择系统规格值后确定或取消
                if(sid === 'cancel'){
                    this.selectTemp[index].attrSwitch = false;
                    this.goodsAttr['attrSelect' + index] = '';
                    if(childrenItem){
                        childrenItem.childrenAttrSwitch = false;
                    }
                    return;
                }
                let data = '';
                if(item){
                    item.forEach((value) => {
                        if(value.sid === sid){
                            data = value;
                        }
                    });
                }
                if(!data){
                    data = sid;
                }
                // 判断重复
                let temp = this.selectTemp[index].children;
                var s = false;
                for(let i=0;i<temp.length;i++){
                    if((typeof data === 'string' && temp[i].name === data) || (typeof data === 'object' && temp[i].name === data.name)){
                        if(childrenItem && childrenItem.sid === temp[i].sid){
                            childrenItem.childrenAttrSwitch = false;
                        }else {
                            this.$message({type:'warning',message:'不能添加相同的规格值'});
                        }
                        s = true;
                    }
                }
                if(s || !data) return false;
                var obj = {};
                let spuSid = this.spuSid || this.$route.query.spuSid;
                if(typeof data === 'string'){
                    obj = {
                        spuSid: spuSid,
                        name: data,
                        rank: 0,
                        parentCode: this.selectTemp[index].code,
                        childrenAttrSwitch: false,
                    }
                }else{
                    obj = data;
                    obj.spuSid = spuSid;
                    obj.parentCode = this.selectTemp[index].code;
                    obj.childrenAttrSwitch = false;
                }
                if(this.selectTemp[index].children.length > 0){
                    obj.rank = this.selectTemp[index].children[this.selectTemp[index].children.length - 1].rank + 1;
                }else{
                    obj.rank = 1;
                }
                if(childrenItem){
                    childrenItem.name = obj.name;
                    this.editAttrConfirm([childrenItem]);
                }else {
                    this.addAttr(obj, index)
                }
            },
            addAttr (data, index){		// 新增规格
                if(data.sid){
                    delete data.sid;
                }
                this.submitAttrSwitch = true;
                this.$http.post(this.$api.sku + 'skuattr', data, {
                    headers: {
                        'api-ver': '2.0.0'
                    }
                }).then((result) => {
                    this.submitAttrSwitch = false;
                    if(result.body.code === 200){
                        for(let key in result.body.data){
                            data[key] = result.body.data[key];
                        }
                        if(index != undefined){
                            this.selectTemp[index].children.push(data);
                        }else{
                            this.selectTemp.push(data);
                            this.selectSwitch = false;
                        }
                        bus.$emit('attr-change', this.selectTemp, 'add');
                        this.$emit('show-sku', )
                        //                            this.selectTableTitle = this.delNotChildren(this.selectTemp);
                        //                            this.formatSkuData();
                    }else{
                        this.$message({type:'warning',message:result.body.message});
                    }
                    if(index != undefined){
                        this.goodsAttr['attrSelect' + index] = '';
                        this.selectTemp[index].attrSwitch = false;
                    }else{
                        this.goodsAttr.skuSelect = '';
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            delAttr (sid){		// 删除规格
                this.attrErrorTips = '';
                this.skuErrorTips = '';
                this.$confirm('删除后不可恢复，并且会同时删除与之相对应的价格和库存信息，确定删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.delete(this.$api.sku + 'skuattr/' + sid, {
                        headers: {
                            'api-ver': '2.0.0'
                        }
                    }).then((result) => {
                        if(result.body.code === 200){
                            this.$message({type:'success',message:result.body.message});
                            this.getGoodsAttr('edit');
                        }else{
                            this.$message({type:'warning',message:result.body.message});
                        }
                    }).catch((err) => {
                        console.log(err)
                    })
                });
            },
            attrUploadBefore (file){	// 规格值图片上传之前
            },
            attrUploadSuccess (response, file, fileList){	// 规格值上传成功
                if(response.code === 200){
                    for(let i=0;i<response.data.length;i++){
                        for(let j=0;j<this.selectTemp[0].children.length;j++){
                            if(this.selectTemp[0].children[j].sid === response.data[i].customMessage){
                                this.selectTemp[0].children[j].imageSid = response.data[i].sid;
                                this.editAttrConfirm([this.selectTemp[0].children[j]]);
                            }
                        }
                    }
                }
            },
            attrUploadError (err, file, fileList){		// 规格值上传失败
            },
            editAttrConfirm (item){		// 修改规格和规格图片
                this.submitAttrSwitch = true;
                this.$http.put(this.$api.sku + 'skuattr/updatebatch', item, {
                    headers: {
                        'api-ver': '2.0.0'
                    }
                }).then((result) => {
                    this.submitAttrSwitch = false;
                    if(item[0].childrenAttrSwitch != undefined){
                        item[0].childrenAttrSwitch = false;
                    }else if(item[0].parentAttrSwitch != undefined){
                        item[0].parentAttrSwitch = false;
                    }
                    if(result.body.code === 200){
                        this.getGoodsAttr('edit');
                    }else{
                        this.$message({type:'warning',message:result.body.message});
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            checkData(){
                // 验证提交数据的合法性
                let resultData = {
                    pass: true,// 是否通过
                    msg: '通过',// 提示语
                };
                if(this.selectTemp.length === 0){
                    resultData.pass = false;
                    resultData.msg = '请添加商品规格';
                    return resultData;
                }
                let pass= true;
                for(let i=0;i<this.selectTemp.length;i++){
                    if(this.selectTemp[i].children.length === 0){
                        resultData.pass = false;
                        resultData.msg = '商品规格值不能为空';
                        return resultData;
                    }
                }
                return resultData;
            },
        }
    }
</script>
<style>

</style>
