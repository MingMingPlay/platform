<script>
    import api from '../../assets/config/m-api.js'
    import { pubObj } from '../../assets/unit/public.js'

    export default {
        data() {
            return {
                loading: true,
                tableData: [],
            }
        },
        mounted() { this.getTableList(this.mxTableList.mountQuery) },
        methods: {
            getTableList(params = {}, callback = () => {}) {
                this.loading = true;
                pubObj.httpRequest(this, {
                    url: this.mxTableList.url,
                    params: params,
                    success(result) {
                        try {
                            let tempData = this.interceptors(result.data);
                            // 初始化Table就执行的函数
                            const doFun = this.mxTableList.initTableFun;
                            if(doFun) tempData = doFun(tempData);
                            this.tableData = tempData;
                            if(result.pagination) this.mxTableList.pagiTotal = result.pagination.totalRow;
                            else this.mxTableList.pagiTotal = 0;
                            callback(this.tableData);
                        } catch(e){
                        	console.log(e)
                        }
                    }
                })
            },
            interceptors(data) {
                data.forEach((obj, index) => {
                    // 外界可以重写
                    obj = this.canBeOverrideFun(obj, index);
                    // 默认都要执行的操作
                    Object.keys(obj).forEach((key) => {
                        if(obj[key] == null) obj[key] = '--';
                        else return;
                    });
                });
                return data;
            },
            canBeOverrideFun(obj, index) { return obj; },
        }
    }
</script>
