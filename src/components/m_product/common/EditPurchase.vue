<template>
    <div class="edit-purchase">
        <p class="cell">
            <el-checkbox v-model="ifPurchase" @change="change('checkbox')">加入集采</el-checkbox>
        </p>
        <p class="cell">
            起售数量：
            <el-input
                v-model="purchaseNumber"
                :disabled="!this.ifPurchase"
                @change="change"
                @keyup.native="purchaseNumber = pubObj.formatInt($event)">
            </el-input>
        </p>
    </div>
</template>
<script>
    /**
     * @name    是否加入集采商城
     * @attribute   {Boolean} ifGroupPurchase   是否加入集采
     * @attribute   {Number} groupPurchase   集采数量
     * @event   change   数据发生变化时回调，参数1：ifGroupPurchase，参数2：groupPurchase
     * */
    import { pubObj } from '../../../assets/unit/public.js'
    export default {
        props: {
            ifGroupPurchase: '',
            groupPurchase: ''
        },
        data() {
            return {
                pubObj,
                ifPurchase: '',
                purchaseNumber: '',
            }
        },
        watch: {
            ifGroupPurchase(){
                this.ifPurchase = this.ifGroupPurchase;
            },
            groupPurchase(){
                this.purchaseNumber = this.groupPurchase;
            }
        },
        methods: {
            change(type){
                if(type === 'checkbox' && !this.ifPurchase){
                    this.purchaseNumber = '';
                }
                this.$emit('change', this.ifPurchase, this.purchaseNumber)
            }
        }
    }
</script>
<style>
.edit-purchase .cell {
    display: inline-block;
    margin-right: 30px;
}
.edit-purchase .cell .el-input {
    display: inline-block;
    width: 100px;
}
</style>
