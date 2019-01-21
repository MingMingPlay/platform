<template>
    <el-dialog title="申诉申请" v-model="dialogSwitch" @close="dialogClose">
        <el-form :model="dialogForm" ref="dialogForm" :rules="rules">
            <el-form-item label="评价人" label-width="80px">
                <span>{{rows.userName}}</span>
            </el-form-item>
            <el-form-item label="申诉说明" label-width="80px" prop="content">
                <el-input type="textarea" v-model="dialogForm.content"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" style="text-align: center">
            <el-button type="success" @click="submitPre(2)">确定</el-button>
        </div>
    </el-dialog>
</template>
<script>
    export default {
        props: {
            showDialog: {
                required: true,
                type: Boolean,
                default: false
            },
            rows: {
                required: true,
                type: Object,
            },
        },
        data() {
            return {
                dialogSwitch: false,
                dialogForm: {
                    commentId: '',
                    content: "",
                },
                rules: {
                    content: [
                        {
                            required: true,
                            message: '请输入申诉说明',
                            trigger: 'blur'
                        }
                    ]
                }
            }
        },
        created(){
            this.dialogSwitch = this.showDialog;
            this.dialogForm.commentId = this.rows.id;
        },
        methods: {
            dialogClose(){
                this.$emit('close')
            },
            submitPre(){
                this.$refs.dialogForm.validate(valid => {
                    if(valid){
                        this.$http.post(['memberAppealShop'], this.dialogForm)
                            .then((result) => {
                                if(result.body.code === 200){
                                    this.$message({type: 'success', message: result.body.data})
                                    this.$emit('close', 'success');
                                }else{
                                    this.$message({type: 'warning', message: result.body.message})
                                }
                            }).catch((err) => {
                            console.log(err)
                        })
                    }
                })
            },
        }
    }
</script>
<style>

</style>
