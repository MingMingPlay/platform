<template>
    <el-dialog :title="dialog.title" v-model="dialogSwitch" @close="dialogClose">
        <el-form :model="dialogForm" ref="dialogForm" :rules="rules[dialog.ruleFields]">
            <el-form-item label="评价人" label-width="80px">
                <span>{{dialog.userName}}</span>
            </el-form-item>
            <el-form-item :label="dialog.label" label-width="80px" :prop="dialog.fields">
                <el-input type="textarea" v-model="dialogForm[dialog.fields]" :maxlength="50"></el-input>
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
            type: {
                required: true,
                type: String,
            }
        },
        data() {
            return {
                dialogSwitch: false,
                dialog: {
                    title: this.type === 'reply' ? '回复' : '申诉申请',
                    label: this.type === 'reply' ? '回复买家' : '申诉说明',
                    fields: this.type === 'reply' ? 'replayContent' : 'content',
                    ruleFields: this.type === 'reply' ? 'reply' : 'appeal',
                    userName: '',
                },
                dialogForm: {},
                appealForm: {
                    commentId: '',
                    content: "",
                    remark: ""
                },
                replyForm: {
                    commentId: '',
                    replayContent: ""
                },
                rules: {
                    appeal: {
                        content: [
                            {
                                required: true,
                                message: '请输入申诉说明',
                                trigger: 'blur'
                            }
                        ]
                    },
                    reply: {
                        replayContent: [
                            {
                                required: true,
                                message: '请输入回复内容',
                                trigger: 'blur'
                            }
                        ]
                    }
                }
            }
        },
        created(){
            this.dialogSwitch = this.showDialog;
            this.dialog.userName = this.rows.userName;
            if(this.type === 'appeal'){
                this.dialogForm = this.appealForm;
            }else if(this.type === 'reply') {
                this.dialogForm = this.replyForm;
            }
            this.dialogForm.commentId = this.rows.commentId;
        },
        methods: {
            dialogClose(){
                this.$emit('close')
            },
            submitPre(){
                this.$refs.dialogForm.validate(valid => {
                    if(valid){
                        if(this.type === 'reply' && this.rows.auditContent){
                            this.$confirm('本次回复将覆盖上一条回复！', {
                                type: 'warning'
                            }).then(() => {
                                this.submit();
                            });
                        }else {
                            this.submit();
                        }
                    }
                })
            },
            submit(){
                let apiKey = this.type === 'reply' ? 'memberCommentReplayPro' : 'memberAppealPro';
                this.$http.post([apiKey], this.dialogForm)
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
        }
    }
</script>
<style>

</style>
