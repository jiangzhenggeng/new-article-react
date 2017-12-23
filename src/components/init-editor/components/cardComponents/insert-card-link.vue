<style lang="less">
  .insert__card-link {
    max-height: 380px;
    overflow-y: scroll;
    padding-right: 15px;
    &::-webkit-scrollbar {
      width: 3px;
      height: 3px;
    }
    .catch-button {
      display: block;
      width: 100%;
    }
    .avatar-uploader {
      .el-upload {
        width: 80px;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px dashed #b4bccc;
        border-radius: 5px;
        overflow: hidden;
        &:active {
          opacity: 0.7;
        }
      }
      .el-icon-upload {
        font-size: 34px;
        color: #b4bccc;
      }
      img {
        display: block;
        width: 100%;
      }
    }
  }
</style>


<template>
  <div class="insert__card-link" v-loading="remote_catch_loading">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px">
      <el-form-item label="卡片类型" prop="type">
        <el-radio-group v-model="ruleForm.type">
          <el-radio :label="0">单品</el-radio>
          <el-radio :label="1">秒杀</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="购买链接" prop="url">
        <el-col :span="18">
          <el-input v-model="ruleForm.url"></el-input>
        </el-col>
        <el-col :span="6">
          <div class="mgl10">
            <el-button class="catch-button" @click="remoteCatchUrl">抓取</el-button>
          </div>
        </el-col>
      </el-form-item>

      <el-form-item label="名称" prop="title">
        <el-input v-model="ruleForm.title"></el-input>
      </el-form-item>

      <el-form-item label="来源" prop="mall">
        <el-input v-model="ruleForm.mall"></el-input>
      </el-form-item>

      <el-form-item label="价格" prop="price">
        <el-input v-model="ruleForm.price"></el-input>
      </el-form-item>

      <el-form-item label="货币类型" prop="currencyname">
        <el-select v-model="ruleForm.currencyname" placeholder="请选择货币类型">
          <el-option label="￥人民币" value="RMB"></el-option>
          <el-option label="$美元" value="MY"></el-option>
        </el-select>
      </el-form-item>
      <template v-if="ruleForm.ismiaosha==1">
        <el-form-item label="秒杀时间" prop="currencyname">
          <el-date-picker
            v-model="starttime"
            type="datetime"
            placeholder="开始日期">
          </el-date-picker>
          <el-date-picker
            class="mgl10"
            v-model="endtime"
            type="datetime"
            placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
      </template>
      <el-form-item label="产品图片" prop="type">
        <el-upload
          :data="{
						uid: 11,
						code: 'c20ad4d76fe97759aa27a0c99bff6710',
						action: 'uploadimage'
					}"
          name="upfile"
          class="avatar-uploader"
          :action="uploadUrl"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="ruleForm.cover" :src="`http://s1.jiguo.com/${ruleForm.cover}/230x230`"/>
          <i v-else class="el-icon-upload"></i>
        </el-upload>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
	import base64 from '../../../../tools/base64'
	import $ from 'jquery'
	import busEvent from './busEvent'

	function getTimg(t) {
		return t.getFullYear() + '-' + (t.getMonth() + 1) + '-' + t.getDate() + ' ' + t.getHours() + ':' + t.getMinutes() + ':' + t.getSeconds()
	}

	export default {
		data() {
			return {
				starttime: '',
				endtime: '',
				remote_catch_loading: false,
				uploadUrl: UEDITOR_CONFIG.serverUrl + '&action=uploadimage',
				ruleForm: {
					type: 0,
					url: '',
					cps: '',
					title: '',
					mall: '',
					price: '',
					currencyname: 'RMB',
					cover: '',
					ismiaosha: 0,
					starttime: '',
					endtime: '',
					unique_id: ''
				},
				rules: {
					type: [
						{
							required: true,
							validator(rule, value, callback) {
								value = String(value)
								if (value != '0' && value != '1') {
									callback(new Error('请选择链接类型'));
								} else {
									callback();
								}
							},
							trigger: 'change'
						}
					],
					url: [
						{
							required: true,
							validator(rule, value, callback) {
								if (!/^https?:\/\/.+/.test(value)) {
									callback(new Error('请填写链接地址'));
								} else {
									callback();
								}
							},
							trigger: 'blur'
						}
					],
					title: [
						{
							required: true,
							message: '请填写标题',
							trigger: 'blur'
						}
					],
					mall: [
						{
							required: true,
							message: '请填写来源',
							trigger: 'blur'
						}
					],
					price: [
						{
							required: true,
							validator(rule, value, callback) {
								if (!/^[\d\.]+/.test(value)) {
									callback(new Error('请填写价格'));
								} else {
									callback();
								}
							},
							trigger: 'blur'
						}
					],
					currencyname: [
						{
							required: true,
							message: '请选择货币类型',
							trigger: 'blur'
						}
					],
					cover: [
						{
							required: true,
							message: '请上传图片'
						}
					]
				}
			};
		},
		watch: {
			starttime(time) {
				if (time) {
					this.ruleForm.starttime = getTimg(new Date(time))
				} else {
					this.ruleForm.starttime = ''
				}
			},
			endtime(time) {
				if (time) {
					this.ruleForm.endtime = getTimg(new Date(time))
				} else {
					this.ruleForm.endtime = ''
				}
			},
			['ruleForm.type'](type) {
				if (type == 1) {
					this.ruleForm.ismiaosha = 1
				} else {
					this.ruleForm.ismiaosha = 0
				}
			},
			['ruleForm.url'](url) {
				$.get('/admin/index/setcps', {
					url
				}, (replayData) => {
					if (replayData == url || !replayData) {
						this.$notify.warning({
							title: '提示',
							message: '没有CPS链接'
						});
					} else if (url) {
						this.ruleForm.cps = url
					}
				}).fail(() => {
					this.$notify.error({
						title: '错误',
						message: 'CPS检测出错'
					});
				})
			}
		},
		created() {
			if (this.addEventListenerMessage) return
			window.addEventListener("message", this.message, false);
			this.addEventListenerMessage = true
		},
		beforeDestroy() {
			window.removeEventListener("message", this.message, false)
		},
		methods: {
			init() {
				this.ruleForm = {
					type: 0,
					url: '',
					cps: '',
					title: '',
					mall: '',
					price: '',
					currencyname: 'RMB',
					cover: '',
					ismiaosha: 0,
					starttime: '',
					endtime: '',
					unique_id: ''
				}
				this.starttime = ''
				this.endtime = ''
				this.remote_catch_loading = false
			},
			message(e) {
				var data = e.data
				if (typeof data != 'string') return;

				data = data.replace(/^\s+|\s+$/g, '')
				if (data.substr(0, 1) != '{' || data.substr(-1, 1) != '}') {
					return
				}
				var sendData = JSON.parse(data);

				this.ruleForm.type = !isNaN(parseInt(sendData.type)) ? parseInt(sendData.type) : 0
				this.ruleForm.url = sendData.url || ''
				this.ruleForm.cps = sendData.cps || ''
				this.ruleForm.title = sendData.title || ''
				this.ruleForm.mall = sendData.mall || ''
				this.ruleForm.price = sendData.price || ''
				this.ruleForm.currencyname = sendData.currencyname || 'RMB'
				this.ruleForm.cover = sendData.cover || ''
				this.ruleForm.starttime = sendData.starttime || ''
				this.ruleForm.endtime = sendData.endtime || ''
				if (this.ruleForm.type == 1) {
					if (this.ruleForm.starttime) {
						this.starttime = new Date(this.ruleForm.starttime)
					}
					if (this.ruleForm.endtime) {
						this.endtime = new Date(this.ruleForm.endtime)
					}
				}
				this.ruleForm.unique_id = sendData.unique_id || ''

				busEvent.$emit('change:tabbar', 'fourth')
			},
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						var prevUnique_id = this.ruleForm.unique_id
						var card_width = 132
						if (this.ruleForm.ismiaosha) {
							card_width = 360
						}

						var unique = 'unique_id_' + 'id-' + Math.random().toString().replace('.', '')
						this.ruleForm.unique_id = unique
						var linkForm = {
							link: this.ruleForm,
						}
						var link_data = String(base64.encode($.param(linkForm))).replace('=', '');

						var html = '' +
							'<iframe ' +
							'style="display:block;width:440px;height:' + card_width + 'px;max-width:100%;overflow:hidden;border:0;margin:auto;padding:0;" ' +
							'data-link="' + link_data + '" ' +
							'data-unique="' + unique + '" ' +
							'src="http://m.jiguo.com/mb/iframe/index?iframe_data=' + link_data + '&unique_id=' + unique + '" ' +
							'></iframe>';

						this.$emit('insert:html', html, function (editor) {
							var iob = prevUnique_id ? $(editor.document).find('[data-unique=' + prevUnique_id + ']') : $();
							if (iob.length > 0) {
								if (!iob.closest('p').length) {
									html = '<p style="text-align: center">' + html + '</p>'
								}
								iob.after(html);
								iob.remove();
								return false
							}
							return true
						})
						this.$emit('close')

					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			handleAvatarSuccess(res, file) {
				var src_arr = res.url.match(/https?:\/\/s1\.jiguo\.com\/([\w\-]+)\/?/i);
				this.ruleForm.cover = src_arr ? src_arr[1] : ''
			},
			beforeAvatarUpload(file) {
				const isLt8M = file.size / 1024 / 1024 < 8;
				if (!isLt8M) {
					this.$notify.error({
						title: '错误',
						message: '超出限制 8Mb！'
					})
				}
				return isLt8M
			},
			remoteCatchUrl() {
				if (!/^https?:\/\/.+/.test(this.ruleForm.url)) {
					this.$notify.warning({
						title: '提示',
						message: '请正确填写URL地址'
					});
					return
				}
				this.remote_catch_loading = true
				$.get('/admin/casperjs/index', {
					url: this.ruleForm.url
				}, (replayData) => {
					if (replayData.status != 0) {
						this.$notify.error({
							title: '错误',
							message: replayData.message || '抓取错误'
						});
					} else {
						this.ruleForm.url = replayData.data.url
						this.ruleForm.title = replayData.data.title
						this.ruleForm.mall = replayData.data.mall
						this.ruleForm.price = replayData.data.price

						this.$notify.success({
							title: '提示',
							message: '抓取成功'
						});

						replayData.data.cover &&
						$.get('/admin/ajax/UploadImg', {
							pic: replayData.data.cover
						}, (result) => {
							this.ruleForm.cover = result.data
						}, 'json')
					}
				}, 'json').fail(() => {
					this.$notify.error({
						title: '错误',
						message: '抓取出错'
					});
				}).always(() => {
					this.remote_catch_loading = false
				})
			}
		}
	}
</script>