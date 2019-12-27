<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addClassBtn">添加分类</el-button>
        </el-col>
      </el-row>

      <!--表格-->
      <tree-table
        :data="catelist"
        :columns="columns"
        :expand-type="false"
        :selection-type="false"
        :show-index="true"
        index-text="#"
        :border="true"
        class="treeTable"
        empty-text="loading..."
      >
        <template slot="isOk" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: #55a532"
          >
          </i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!--等级模板-->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" type="danger" v-if="scope.row.cat_level === 0"
            >一级</el-tag
          >
          <el-tag
            size="mini"
            type="warning"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag size="mini" v-else>三级</el-tag>
        </template>
        <!--操作模板-->
        <template slot="option">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="small"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="small"
          ></el-button>
        </template>
      </tree-table>
      <!--分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 3, 4, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <el-dialog
        title="添加分类"
        :visible.sync="addClassDialogVisible"
        width="50%"
        @close="addClassDialogClosed"
      >
        <el-form
          :model="addClassForm"
          :rules="addClassFormRules"
          ref="addClassFormRef"
          label-width="100px"
        >
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addClassForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <el-cascader
              :options="ParentCateList"
              v-model="selectedKeys"
              :props="cascaderProps"
              @change="cascaderChange"
              clearable
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addClassDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      catelist: [],
      //默认查询条件
      queryInfo: {
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '有效性',
          type: 'template',
          template: 'isOk'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'option'
        }
      ],
      addClassDialogVisible: false,
      addClassForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      addClassFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      ParentCateList: [],
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true,
        expandTrigger: 'click'
      },
      /*选择的父级分类ID数组*/
      selectedKeys: []
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类列表失败')
      }
      this.catelist = res.data.result

      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    addClassBtn() {
      this.getParentCateList()
      this.addClassDialogVisible = true
    },
    //*********///
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类失败')
      }
      this.ParentCateList = res.data
    },
    cascaderChange() {
      if (this.selectedKeys.length > 0) {
        this.addClassForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ]
        this.addClassForm.cat_level = this.selectedKeys.length
      } else {
        this.addClassForm.cat_pid = 0
        this.addClassForm.cat_level = 0
      }
    },
    addCate() {
      this.$refs.addClassFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'categories',
          this.addClassForm
        )
        if (res.meta.status !== 201) {
          this.$message.error('添加分类失败了')
        }
        this.$message.success('添加分类成功')
        this.getCateList()
        this.addClassDialogVisible = false
      })
    },
    addClassDialogClosed() {
      this.$refs.addClassFormRef.resetFields()
      this.selectedKeys = []
      this.addClassForm.cat_pid = 0
      this.addClassForm.cat_level = 0
      this.ParentCateList = []
    }
  }
}
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
