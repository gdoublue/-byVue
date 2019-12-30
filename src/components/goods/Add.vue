<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="添加商品信息" type="info" center show-icon> </el-alert>
      <!--步骤调-->
      <el-steps :active="activeStep - 0" align-center finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <!--tabs-->
        <el-tabs
          :tab-position="'left'"
          v-model="activeStep"
          :before-leave="beforeTabsLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="catelist"
                :props="cateProps"
                @change="handleChange"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTablesData"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="cb"
                  v-for="(cb, i) in item.attr_vals"
                  :key="i"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTablesData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="uploadPicSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4"
            ><el-form-item label="商品介绍" prop="goods_name">
              <el-input v-model="addForm.goods_introduce"></el-input>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!--图片预览对话框-->
    <el-dialog title="详情图片" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" alt="loading" class="preViewImg" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeStep: '0',
      addForm: {
        goods_name: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        goods_cat: [],
        pics: []
      },
      addFormRules: {
        goods_name: [{ required: true, message: '必填项', trigger: 'blur' }],
        goods_price: [{ required: true, message: '必填项', trigger: 'blur' }],
        goods_number: [{ required: true, message: '必填项', trigger: 'blur' }],
        goods_cat: [{ required: true, message: '请选择分类', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '必填项', trigger: 'blur' }]
      },
      /*商品分类列表*/
      catelist: [],
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        expandTrigger: 'hover'
      },
      manyTablesData: [],
      onlyTablesData: [],
      /*图片上传请求头*/
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      /*预览图片路径*/
      previewPath: '',
      previewVisible: false
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories')

      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类列表失败')
      }

      this.catelist = res.data
    },
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    /*切换tab前的函数*/
    beforeTabsLeave(newTab, oldTab) {
      if (oldTab === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请选择商品分类')
        return false
      }
    },
    /*预览图片*/
    handlePreview(file) {
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    /*图片upload完成后*/
    uploadPicSuccess(res) {
      if (res.meta.status !== 200) {
        return this.$message.error('图片上传失败，请稍后再试')
      }

      const picInfo = { pic: res.data.tmp_path }
      this.addForm.pics.push(picInfo)
      console.log(this.addForm.pics)
    },
    handleRemove(file) {
      //用文件的临时路径，查找索引值
      const filePath = file.response.data.tmp_path
      const i = this.addForm.pics.findIndex(x => x.pic === filePath)
      this.addForm.pics.splice(i, 1)
      console.log(this.addForm.pics)
    },
    /*点击tabs时激活，以此可以动态获取参数*/
    async tabClicked() {
      if (this.activeStep === '1') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'many' }
          }
        )
        if (res.meta.status !== 200) {
          this.$message.error('获取商品分类的动态属性失败')
        }

        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        })
        this.manyTablesData = res.data
      }
      if (this.activeStep === '2') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'only' }
          }
        )
        if (res.meta.status !== 200) {
          this.$message.error('获取商品分类的静态属性失败')
        }
        this.onlyTablesData = res.data
      }
    }
  },
  computed: {
    /*计算第三级分类id*/
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return false
    }
  }
}
</script>

<style lang="less" scoped>
.preViewImg {
  width: 100%;
}
</style>
