<template>
    <div>

    </div>
</template>
<script>
    import { mixin_breadcrumb } from '../../common/jkc-mixin.vue'
    import { balacneList } from '../../../assets/staticData/finance.js'
    export default {
        mixins: [mixin_breadcrumb],
        data() {
            return{
                form: this.$route.query,
//              form:{
//                  amount:this.$route.query.amount,
//                  bank:this.$route.query.bank,
//                  merchantSid:"ooWP1h",
//                  payType:"b2cPersonalDebit",
//                  payMethod:"Gateway"
//              }
            }
        },
        created(){
            this.$http.post(['financialDeposit'],this.form)
            .then((result) => {
                if(result.body.code == 200){
                    window.location.replace(result.body.data)
                }else{
                    this.$message({type: 'warning', message: result.body.message+'即将返回上一页'});
                    //异常2s后返回上一个页面
                    setTimeout(()=> {
                        this.$router.go(-1)
                    },2000)
                }
            }).catch((err) => {
                console.log(err);
                this.$message({type: 'warning', message: result.body.message+'即将返回上一页'});
                //异常2s后返回上一个页面
                setTimeout(()=> {
                    this.$router.go(-1)
                },2000)
            })
        },
        methods:{
        }

    }
</script>

