<template>
    <div class="product-table">
        <el-table
            v-loading.body="loading"
            :data="tableData"
            style="width: 100%"
            stripe>
            <el-table-column v-for="(column, index) in tableHeader" :key="column.dataIndex" :label="column.text" :align="column.align" :width="column.width">
                <template slot-scope="scope">
                    <span
                        v-if="scope.row[column.dataIndex] && (column.dataIndex=='enterAmountValue' || column.dataIndex=='frozenAmountValue' || column.dataIndex=='exitAmountValue' || column.dataIndex=='amountValue' || column.dataIndex=='balanceValue' || column.dataIndex=='amt' || column.dataIndex=='spending' || column.dataIndex=='actualAmountValue')"
                        :class="{
                            red: column.dataIndex=='enterAmountValue' || column.dataIndex=='amt',
                            black: column.dataIndex=='frozenAmountValue' || column.dataIndex=='amountValue',
                            green: column.dataIndex=='exitAmountValue' || column.dataIndex=='spending'
                        }">
                        {{column.dataIndex=='enterAmountValue'?'+':(column.dataIndex=='exitAmountValue'?'-':'')}}{{scope.row[column.dataIndex] | kb}}
                    </span>

                    <!--收入-->
                    <!--<span-->
                        <!--v-if="column.dataIndex=='enterAmountValue' && scope.row['enterAmountValue']"-->
                        <!--:class="{ red: column.dataIndex=='enterAmountValue'}">-->
                        <!--+{{scope.row['enterAmountValue'] | kb}}-->
                    <!--</span>-->
                    <!--冻结-->
                    <!--<span-->
                        <!--v-else-if="column.dataIndex=='frozenAmountValue' && scope.row['frozenAmountValue']"-->
                        <!--:class="{ black: column.dataIndex=='frozenAmountValue'}">-->
                        <!--{{scope.row['frozenAmountValue'] | kb}}-->
                    <!--</span>-->
                    <!--支出-->
                    <!--<span-->
                        <!--v-else-if="column.dataIndex=='exitAmountValue' && scope.row['exitAmountValue']"-->
                        <!--:class="{ green: column.dataIndex=='exitAmountValue'}">-->
                        <!-- -{{scope.row['exitAmountValue'] | kb}}-->
                    <!--</span>-->
                    <!--充值金额-->
                    <!--<span-->
                        <!--v-else-if="column.dataIndex=='amountValue' && scope.row['amountValue']"-->
                        <!--:class="{ black: column.dataIndex=='amountValue'}">-->
                        <!--{{scope.row['amountValue'] | kb}}-->
                    <!--</span>-->
                    <span v-else-if="!scope.row[column.dataIndex]">--</span>
                    <span v-else>{{scope.row[column.dataIndex]}}</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
    export default{
        props:['tableHeader','tableData','loading'],
        data(){
            return{
                isActive:true
            }
        },
        created(){
            console.log(this.tableData)
        },
        filters: {
            filterFun(value) {
                return console.log(value)
            },
            kb(money) {
                try {
                    if(money) {
                        var re = /\d{1,3}(?=(\d{3})+$)/g;
                        var money = money.replace(/^(\d+)((\.\d+)?)$/, function (s, s1, s2) {
                            return s1.replace(re, "$&,") + s2;
                        });
                        return money;
                    }
                } catch(e) {
                    console.log(e)
                }
            }
        }
    }
</script>
<style scoped>
    .product-table .red{
        color: red;
    }
    .product-table .green{
        color: green;
    }
    .product-table .black{
        color: #333;
    }
</style>
