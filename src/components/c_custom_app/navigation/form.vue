<template>
	<el-dialog :title="parentObj.title" v-model="dialogVisible" :close-on-click-modal="false" @close="dialogClose('dialogForm')">
		<el-form :model="dialogForm" :rules="rules" ref="dialogForm" label-width="98px">
			<el-form-item label="所属渠道" prop="channelSid">
				<el-select v-model="dialogForm.channelSid" placeholder="请选择渠道">
					<el-option v-for="(item,index) in channels" :key="index" :label="item.name" :value="item.sid"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="导航类别" prop="attribute">
                <el-select v-model="dialogForm.attribute" placeholder="请选择">
                    <el-option label="导航菜单" value="Menu"></el-option>
                    <el-option label="专题" value="Topic"></el-option>
                    <!--chuchuang-->
                    <el-option label="橱窗" value="ShopWindow"></el-option>
                </el-select>
            </el-form-item>

			<!--<el-form-item label="导航类型" prop="type">
				<el-radio-group v-model="dialogForm.type">
					<el-radio label="Mall">商城</el-radio>
					<el-radio label="Content">内容</el-radio>
				</el-radio-group>
			</el-form-item>-->
			<el-form-item label="指向类型" prop="guidingType">
                <el-radio-group v-model="dialogForm.guidingType">
                    <el-radio label="Merchandise">商品</el-radio>
                    <!--chuchuang-->
                    <el-radio label="Link" :disabled="dialogForm.attribute==='ShopWindow'">链接</el-radio>
                    <el-radio label="DiscountsGoldMall" :disabled="dialogForm.attribute==='ShopWindow'">积分商城</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="指向链接" prop="url" v-if="dialogForm.guidingType === 'Link'">
                <el-input v-model="dialogForm.url" placeholder="请输入指向链接"></el-input>
            </el-form-item>
            <el-form-item label="导航图片" prop="logoSid" v-if="dialogForm.attribute!=='ShopWindow'">
                <image-upload
                    name="logo"
                    v-if="dialogVisible"
                    v-model="dialogForm.logoSid"
                    action-type="Other"
                    :action-path="dialogForm.logoPath">
                </image-upload>
            </el-form-item>
			<el-form-item label="导航名称" prop="title">
				<el-input v-model="dialogForm.title"></el-input>
			</el-form-item>
			<div v-if="dialogForm.attribute === 'Topic'">
			    <el-form-item label="导航副标题" prop="subTitle">
                    <el-input v-model="dialogForm.subTitle"></el-input>
                </el-form-item>
                <el-form-item label="背景图" prop="backImgSid">
                    <image-upload
                        name="backImg"
                        v-if="dialogVisible"
                        v-model="dialogForm.backImgSid"
                        action-type="Other"
                        :action-path="dialogForm.backImgPath">
                    </image-upload>
                </el-form-item>
			</div>
            <!--chuchuang-->
            <div v-if="dialogForm.attribute === 'ShopWindow'">
			    <el-form-item label="橱窗副标题" prop="subTitle">
                    <el-input v-model="dialogForm.subTitle"></el-input>
                </el-form-item>
			</div>
			<el-form-item label="字体颜色" prop="color" v-show="dialogForm.attribute === 'Menu'">
                <el-color-picker v-model="dialogForm.color"></el-color-picker>
            </el-form-item>
			<el-form-item label="导航排序" prop="rank">
				<el-slider
				    v-model="dialogForm.rank"
				    :max="99"
				    :show-tooltip="false"
				    show-input>
				</el-slider>
				<div style="font-size: 12px;">数字越大排序越靠前</div>
			</el-form-item>
			<el-form-item label="是否显示" prop="displayable">
				<el-radio-group v-model="dialogForm.displayable">
					<el-radio :label="true">是</el-radio>
					<el-radio :label="false">否</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="可否编辑" prop="editable">
				<el-radio-group v-model="dialogForm.editable">
					<el-radio :label="true">是</el-radio>
					<el-radio :label="false">否</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="关联作家" v-if="isShowShop">
                <el-select
                    v-model="selectedAuthors"
                    multiple
                    filterable
                    allow-create
                    placeholder="请选择关联作家"
                    style="width: 66%;">
                    <el-option
                        v-for="item in authorShopList"
                        :key="item.sid"
                        :label="item.name"
                        :value="item.sid"
                        style="height: 46px;">
                        <div style="display: table;">
                            <img v-if="item.image" :src="item.image" style="height: 30px;width: 30px;border-radius: 100%;display: table-cell;vertical-align: middle;" />
                            <img v-else src="../../../assets/img/defaultlogo.jpg" style="height: 30px;width: 30px;border-radius: 100%;display: table-cell;vertical-align: middle;" />
                            <span style="display: table-cell;vertical-align: middle;padding: 0 5px;"></span>
                            <span style="display: table-cell;vertical-align: middle;">{{ item.name }}</span>
                        </div>
                    </el-option>
                </el-select>
            </el-form-item>
			<!--<el-form-item label="可见区域">
                <area-select :default-sid="dialogForm.visibleAreaSid" @get-area="handleGetArea"></area-select>
            </el-form-item>-->
            <!--<el-form-item label="导航等级" prop="parentSid">
                <el-select v-model="dialogForm.parentSid" placeholder="请选择">
                    <el-option v-for="item in navigationData" :label="item.title" :value="item.sid"></el-option>
                </el-select>
            </el-form-item>-->
            <!--<el-form-item label="展示模板" prop="template">
                <el-radio-group v-model="dialogForm.template">
                    <el-radio label="Homepage">首页</el-radio>
                    <el-radio label="Inner">内部</el-radio>
                    <el-radio label="Festival">节日</el-radio>
                    <el-radio label="Standard">标准</el-radio>
                </el-radio-group>
            </el-form-item>-->
            <!--<el-form-item label="导航位置" prop="position">
                <el-radio-group v-model="dialogForm.position">
                    <el-radio label="Top">顶部</el-radio>
                    <el-radio label="Middle">中部</el-radio>
                    <el-radio label="Bottom">底部</el-radio>
                </el-radio-group>
            </el-form-item>-->
		</el-form>
		<div slot="footer">
		    <div style="text-align: center;">
		        <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button
                    type="primary"
                    @click="dialogSubmit('dialogForm')"
                    v-text="parentObj.saveText"
                    :loading="btnLoading">
                </el-button>
		    </div>
		</div>
	</el-dialog>
</template>

<script>
    // 组件
    import AreaSelect from '../../common/area-select.vue'
    import ImageUpload from '../../common/image-upload.vue'
    // mixin
    import DialogForm from '../../mixin/dialog-form.vue'
    // js
	import { navigationForm } from '../../../assets/staticData/navigation.js'
	import { pubObj, bus } from '../../../assets/unit/public.js'

//	import api from '../../../assets/config/c-api.js'

	export default {
	    components: { AreaSelect, ImageUpload },

		mixins: [DialogForm],

		props: {
		    navigationData: Array
		},

		data() {
			return {
				dialogForm: navigationForm.dialogForm,
				rules: {},
				channels: {},
				mxDialogForm: {
                    name: 'navigation-dialog',
                    url: this.$api.navigation + 'mall/',
                },
                btnLoading: false,
                // 关联作家
                selectedAuthors: [],
                authorShopList: []
			}
		},

		computed: {
		    isShowShop() {
		        let bool;
		        const attribute = this.dialogForm.attribute;
		        const guidingType = this.dialogForm.guidingType;
		        if(attribute === 'Menu' && guidingType === 'Merchandise') {
		            bool = true;
		        } else {
		            bool = false;
		        }
		        return bool;
		    }
		},

		watch: {
            'dialogForm.attribute': function(val) {
                if(val === 'Topic') {
                    this.$set(this.rules, 'color', []);
                    this.$set(this.rules, 'subTitle', navigationForm.rules.subTitle);
                    this.$set(this.rules, 'backImgSid', navigationForm.rules.backImgSid);
                    this.$set(this.rules, 'logoSid', navigationForm.rules.logoSid);
                    this.dialogForm.color = null;
                } else if(val === 'ShopWindow') {
                    this.$set(this.rules, 'color', []);
                    this.$set(this.rules, 'subTitle', navigationForm.rules.subTitle);
                    this.$set(this.rules, 'backImgSid', []);
                    this.$set(this.rules, 'logoSid', []);
                    this.dialogForm.color = null;
                    this.dialogForm.backImgSid = null;
                    this.dialogForm.backImgPath = null;
                    this.dialogForm.logoSid = null;
                    this.dialogForm.logoPath = null;
                    this.dialogForm.guidingType = 'Merchandise';
                } else {
                    this.$set(this.rules, 'subTitle', []);
                    this.$set(this.rules, 'backImgSid', []);
                    this.$set(this.rules, 'logoSid', navigationForm.rules.logoSid);
                    this.$set(this.rules, 'color', navigationForm.rules.color);
                    this.dialogForm.subTitle = null;
                    this.dialogForm.backImgSid = null;
                    this.dialogForm.backImgPath = null;
                }
            },
            selectedAuthors(arr) {
                if(!arr) {
                    delete this.dialogForm.authorShopVOS;
                } else {
                    this.dialogForm.authorShopVOS = arr.map((sid) => {
                        return {
                            authorShopSid: sid
                        }
                    });
                }
            },
            isShowShop(val) {
                if(!val) {
                    this.selectedAuthors = [];
                }
            }
        },

		methods: {
		    interceptors(data, callback) {
                try {
                    this.selectedAuthors = data.authorShopVOS.map((item) => {
                        return item.authorShopSid;
                    });
                    callback(data);
                } catch(e) {
                    console.log(e)
                }
            },
		    // 获取渠道
		    handleGetChannel() {
		        pubObj.httpRequest(this, {
                    url: this.$api.channel,
                    success(result) {
                        this.channels = result.data;
                    }
                })
            },
            // 获取作家店铺列表
            handleGetAuthorShop() {
                pubObj.httpRequest(this, {
                    url: ['authorList'],
                    success(result) {
                        this.authorShopList = result.data;
                    }
                })
            },
			handleSubmitForm() {
			    if(this.dialogForm.attribute === 'Menu' && this.dialogForm.guidingType === 'Merchandise') {
			        if(this.selectedAuthors.length > 0 && this.selectedAuthors.length < 4) {
                        this.$message.info('添加作家数量不能少于4个');
                        return false;
                    }
			    }
			    this.btnLoading = true;
                const obj = this.handleOptions(this.parentObj.type);
                pubObj.httpRequest(this, {
                    url: obj.url,
                    method: obj.method,
                    body: this.dialogForm,
                    complete(result) {
                        this.$message.warning(result.message);
                        this.btnLoading = false;
                    },
                    success(result) {
                        this.$message.success(result.message);
                        this.btnLoading = false;
                        this.dialogVisible = false;
                        this.$emit('refresh');
                    }
                })
            },
			/*handleGetArea(obj) {
			    this.dialogForm.visibleAreaSid = obj.areaSid;
			}*/
		},

		created() {
			/*this.dialogForm = navigationForm.dialogForm;*/
			this.rules = JSON.parse(JSON.stringify(navigationForm.rules));
		},

		beforeMount() {
			this.handleGetChannel();
            this.handleGetAuthorShop();
		}

	}
</script>

<style>
    .el-select-dropdown.is-multiple .el-select-dropdown__item.selected::after { top: 15px; }
	.navigation .el-radio__label {
		display: inline-block;
		width: 33px;
		text-align: center;
	}
	.navigation .area-select .el-select { width: 32%; float: left; }
	.navigation .area-select .el-select+.el-select { margin-left: 2%; }
</style>
