<template>
    <div id="structure">

        <el-table v-loading.body="loading" :data="data">
            <el-table-column v-for="(column, index) in columns" :key="column.dataIndex" :label="column.text" :width="column.width" colspan="8" :align="column.align">
                <template slot-scope="scope">
                    <span v-if="spaceIconShow(index)" v-for="(space, levelIndex) in scope.row.level" class="ms-tree-space"></span>
                    <button class="button is-outlined is-primary is-small" v-if="toggleIconShow(index,scope.row)" @click="toggle(scope.$index, scope.row)">
                        <i v-if="!scope.row.isShow" class="el-icon el-icon-caret-right" aria-hidden="true"></i>
                        <i v-if="scope.row.isShow" class="el-icon el-icon-caret-bottom" aria-hidden="true"></i>
                    </button>
                    <span v-else-if="index===0" class="ms-tree-space"></span> {{scope.row[column.dataIndex]}}
                </template>
            </el-table-column>
            <el-table-column label="操作" v-if="treeType === 'normal'"align="center">
                <template slot-scope="scope">
                    <el-button size="small" type="text" @click="handleCompile(dataSource,scope.$index)" v-if="scope.row.reserved==false">
                        修改
                    </el-button>
                    <el-button size="small" type="text" @click="handleDelete(dataSource,scope.$index)" v-if="scope.row.reserved==false">
                        删除
                    </el-button>
                    <el-button size="small" type="text" @click="handleAddList(dataSource,scope.$index)" v-if="scope.row.level<5">
                        新增
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--dialog-->
        <el-dialog :title="dialog.title" v-model="dialogClose" @close="closeCallBack()" size="tiny">
            <el-form :model="listCompileInfo" :rules="rules"  ref="listCompileInfo">
                <el-form-item label="机构名称" label-width="84px" prop="name">
                    <el-input v-model="listCompileInfo.name"></el-input>
                </el-form-item>
                <el-form-item label="机构代码" label-width="84px" prop="customCode">
                    <el-input v-model="listCompileInfo.customCode" :disabled="dialog.title=='修改机构'"></el-input>
                </el-form-item>
                <el-form-item label="机构等级" label-width="84px">
                    <el-input v-model="listCompileInfo.level" disabled></el-input>
                </el-form-item>
                <el-form-item label="区域选择" label-width="84px" class="areaSelect" v-if="dialog.title=='新增机构'"  prop="areaSid">
                    <area-select v-on:get-area="getArea"  v-bind:defaultSid="defaultSid"></area-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogClose=false">取 消</el-button>
                <el-button type="primary" @click="submitSure('listCompileInfo')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import areaSelect from '../common/area-select.vue'
    export default {
        name: 'tree-grid',
        props: {
            // 该属性是确认父组件传过来的数据是否已经是树形结构了，如果是，则不需要进行树形格式化
            treeStructure: {
                type: Boolean,
                default: function() {
                    return false
                }
            },
            //表单头部
            columns: {
                type: Array,
                default: function() {
                    return []
                }
            },
            // 这是数据源
            dataSource: {
                type: Array,
                default: function() {
                    return []
                }
            },
            //弹出层头部信息
            dialog: {

            },
            //修改编辑列表
            listCompileInfo: {

            },
            // 这个是是否展示操作列
            treeType: {
                type: String,
                default: function() {
                    return 'normal'
                }
            }
        },
        data() {
            return {
                //dialog显示状态
                dialogClose: false,
                loading: false,
                rules: {
                    name: [{
                            required: true,
                            message: '请输入机构名称',
                            trigger: 'blur, change'
                        },
                        {
                            min: 2,
                            max: 30,
                            message: '长度在 1 到 30 个字符',
                            trigger: 'blur, change'
                        }
                    ],
                    customCode:[{
                            required: true,
                            message: '请输入机构代码',
                            trigger: 'blur, change'
                    }],
                    areaSid:[{
                            required: true,
                            message: '请选择区域',
                            trigger: 'blur, change'
                    }]

                },
                data: this.dataSource,
                defaultSid:''
            }
        },
        watch: {
            dialogVisible(newVal, oldVal) {
                this.dialogClose = newVal;
            },
            dataSource(newVal, oldVal){
                this.data = newVal;
                this.loading = false;
            }
        },
        components: {
            areaSelect,
        },
        methods: {
            //关闭回调，重置表单
            closeCallBack() {
                this.defaultSid = ''
                this.dialogClose = false;
                this.$refs['listCompileInfo'].resetFields();
                for(var key in this.listCompileInfo) {
                    this.listCompileInfo[key] = '';
                }
            },
            //区域id
            getArea(data) {
                this.defaultSid = data.areaSid;
                this.$emit('getArea', data)
            },
            // 展开下级
            toggle: function(index, row) {
                row.isShow = !row.isShow;
                if(row.isShow) {
                    for(var i = 0; i < row.children.length; i++) {
                        this.dataSource.splice(index + 1, 0, row.children[i]);
                        index++;
                    }
                } else {
                    for(var i = index; i < this.dataSource.length; i++) {
                        if(this.dataSource[i + 1] && this.dataSource[i + 1].level > this.dataSource[index].level) {
                            if(this.dataSource[i + 1].isShow){
                                this.dataSource[i + 1].isShow = false;
                            }
                            this.dataSource.splice(i + 1, 1);
                            i--;
                        } else {
                            break;
                        }
                    }
                }
            },
            // 显示层级关系的空格和图标
            spaceIconShow(index) {
                let me = this
                if(me.treeStructure && index === 0) {
                    return true
                }
                return false
            },
            // 点击展开和关闭的时候，图标的切换
            toggleIconShow(index, record) {
                let me = this
                if(me.treeStructure && index === 0 && record.children && record.children.length > 0) {
                    return true
                }
                return false
            },
            //删除
            handleDelete(data, index) {
                this.$emit('handleDelete', data, index)
            },
            //修改
            handleCompile(data, index) {
                this.dialogClose = true;
                this.$emit('handleCompile', data, index);
            },
            //新增
            handleAddList(data, index) {
                this.dialogClose = true;
                this.$emit('handleAddList', data, index);
            },
            //确定
            submitSure(formName){
                this.$refs[formName].validate((valid) => {
                  if (valid) {
                      this.$emit('submitSure',formName);
                      this.dialogClose = false;
                  } else {
                    console.log('error submit!!');
                    return false;
                  }
                });
            }
        }
    }
</script>
<style>
    .el-icon{
        color: #48576a;
        transform: scale(0.8);
    }
    button {
        border: 0;
        background: transparent;
        outline: none;
    }

    #structure .ms-tree-space {
        position: relative;
        top: 1px;
        display: inline-block;
        font-family: 'Glyphicons Halflings';
        font-style: normal;
        font-weight: 400;
        line-height: 1;
        width: 18px;
        text-align: left;
        height: 14px;
    }

    #structure .el-table tr {
        text-align: left;
    }

    #structure table {
        min-width: 900px;
        overflow: hidden;
    }

    #structure .ms-tree-space::before {
        content: ""
    }

    #structure table td {
        line-height: 26px;
    }

    .areaSelect .el-input {
        width: 148px;
    }
</style>
