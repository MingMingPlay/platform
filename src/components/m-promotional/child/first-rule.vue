<template>
	<div class="first-rule">
		<child-form ref="a" :charcode="97" :child-key="0" required></child-form>
		<child-form ref="b" :charcode="98" :child-key="1" v-show="showList[0]"></child-form>
		<child-form ref="c" :charcode="99" :child-key="2" v-show="showList[1]"></child-form>
		<child-form ref="d" :charcode="100" :child-key="3" v-show="showList[2]"></child-form>
		<child-form ref="e" :charcode="101" :child-key="4" v-show="showList[3]"></child-form>
    </div>
</template>

<script>
    import Emitter from '../mixin/emitter.js'
	import ChildForm from './common/first-rule-form.vue'
	
    export default {
    	components: { ChildForm },
    	
    	mixins: [Emitter],
    	
    	inject: ['root'],
    	
    	provide() {
    	    return {
    	        parent: this
    	    }
        },
    	
        data() {
            return {
                showList: [false, false, false, false],
                validList: [false],
            }
        },
        
        computed: {
            currentChild() {
                let childLength = 0;
                const arr = this.showList.filter((item) => {
                    return item;
                });
                
                return childLength = arr.length;
            }
        },
        
        watch: {
            validList: {
                handler: function (arr) {
                    const bool = arr.every(item => {
                        return item;
                    });
                    if(bool) {
                        this.dispatch('ruleForm', 'childValidateSuccess');
                    } else {
                        return;
                    }
                },
                deep: true,
            }
        }
    }
</script>

<style>
    .first-rule { font-size: 0 }
    .first-rule .el-form .el-form-item__label { text-align: right; }
    .first-rule .el-form+.el-form { margin-top: 22px; }
    .first-rule .el-form>span { font-size: 14px; margin-right: 10px; }
    .first-rule .el-form .font-size { font-size: 14px; margin-left: 20px; }
</style>