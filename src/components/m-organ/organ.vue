<template>
    <div class="hello">
        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>
        <tree-grid :columns="columns" :tree-structure="true" :data-source="dataSource" v-bind:dialog="dialog"  v-bind:listCompileInfo="listCompileInfo" v-on:handleDelete="handleDelete" v-on:handleCompile="handleCompile" v-on:handleAddList="handleAddList" v-on:getArea="getArea" v-on:submitSure="submitSure"></tree-grid>
    </div>
</template>
<script>
    import jkcBreadcrumb from '../common/jkc-breadcrumb.vue'
    import TreeGrid from './treeGrid.vue'
    export default {
        data() {
            return {
                crumbs: [
                    {
                        title:'系统设置',
                    },
                    {
                        title:'组织机构',
                    }
                ],
                //表单头部
                columns: [{
                        text: '机构名称',
                        dataIndex: 'name',
                        width: 300
                    },{
                        text: '机构代码',
                        dataIndex: 'customCode',
                        align: 'center'
                    },{
                        text: '机构等级',
                        dataIndex: 'level',
                        align: 'center'
                    },{
                        text: '上级机构等级',
                        dataIndex: 'parentCode',
                        align: 'center'
                    }
                ],
                //表单数据
                dataSource: [],
                //弹出层头部信息
                dialog: {
                    title: '',
                    btnTitle: '',
                    method: ''
                },
                //修改--列表的当前数据
                listCompileInfo: {
                    name: '',
                    customCode: '',
                    level: null,
                    areaSid: null
                },
                //修改--提交列表
                listCompileJson: {},
                oSid: '',
                //增加--提交列表
                listAddJson: {
                    name: '',
                    level: '',
                    parentCode: '',
                    customCode: '',
                    areaSid: '',
                    reserved: false
                },
                areaSelectJson:{}
            }
        },
        components: {
            TreeGrid,
            jkcBreadcrumb
        },
        created() {
            //获取数据
            this.getDate();
        },
        methods: {
            //获取数据
            getDate() {
                this.$http.get(['organBiz', this.$root.userInfo.merchantSid, '/' + this.$root.userInfo.organCode])
                    .then(result => {
                        this.dataSource = result.data.data
//                      for(var i = 0; i < result.data.data.length; i++) {
//                          if(result.data.data[i].level == "1"){
//                              this.dataSource = result.data.data
//                          }else{
//                              this.dataSource = result.data.data[i].children;
//                          }
//                      }
                    }).catch(error => {

                })
            },
            //删除
            handleDelete(data, index) {
                let oSid = data[index].sid;
                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    this.$http.delete(['organBiz', this.$root.userInfo.merchantSid, '/' + oSid])
                        .then(result => {
                            this.getDate();
                        }).catch(error => {

                        })
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    })

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            },
            //修改
            handleCompile(data, index) {
                this.dialog.title = '修改机构';
                for(var key in this.listCompileInfo) {
                    this.listCompileInfo[key] = data[index][key];
                }
                //传入后台的json
                delete data[index].children;
                this.oSid = data[index].sid;
                this.listCompileJson = data[index];
            },
            //新增
            handleAddList(data, index) {
                this.dialog.title = '新增机构';
                for(var key in this.listCompileInfo) {
                    this.listCompileInfo[key] = '';
                }
                this.listCompileInfo.level = Number(data[index].level) + 1;
                this.listAddJson.level = Number(data[index].level) + 1;
                this.listAddJson.parentCode = data[index].customCode;
            },
            //确定
            submitSure(){
                switch(this.dialog.title) {
                    case '修改机构':
                        if(this.listCompileInfo.name == this.listCompileJson.name && this.listCompileInfo.customCode == this.listCompileJson.customCode){
                            console.log('没做任何修改')
                        }else {
                            this.listCompileJson.name = this.listCompileInfo.name;
                            this.listCompileJson.customCode = this.listCompileInfo.customCode;
                            this.ajaxAmend();
                        }
                        break;
                    case '新增机构':
                          this.listAddJson.name = this.listCompileInfo.name;
                          this.listAddJson.customCode = this.listCompileInfo.customCode;
                          this.ajaxAdd();
                        break;
                }
            },
            //修改发起请求
            ajaxAmend() {
                this.$http.put(['organBiz', this.$root.userInfo.merchantSid,  '/' + this.oSid],this.listCompileJson)
                .then(result => {
                    if(result.body.code == 200){
                        this.getDate();
                        this.$message({
                            type: 'success',
                            message: '修改成功'
                        });
                    }else{
                        this.$message({
                            type: 'warning',
                            message: result.body.message
                        });
                    }
                }).catch(error => {

                })
            },
            //增加发起请求
            ajaxAdd() {
                this.$http.post(['organBiz', this.$root.userInfo.merchantSid],this.listAddJson)
                .then(result => {
                    if(result.body.code == 200){
                        this.getDate();
                        this.$message({
                            type: 'success',
                            message: '新增成功'
                        });
                    }else{
                        this.$message({
                            type: 'warning',
                            message: result.body.message
                        });
                    }
                }).catch(error => {

                })
            },
            //区域id
            getArea(data) {
                this.listAddJson.areaSid = data.areaSid;
                this.listCompileInfo.areaSid = data.areaSid;
            }

        }
    }
</script>
<style scoped>

</style>
