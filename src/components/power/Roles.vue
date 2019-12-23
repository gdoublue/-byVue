<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true"
            >添加角色
          </el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesList" border stripe max-height="680px">
        <el-table-column type="expand"> </el-table-column>
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作" width="290px">
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
              @click="showEditDialog(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="deleteRole(scope.row.id)"
              >删除</el-button
            >
            <el-button type="warning" icon="el-icon-setting" size="small"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!--编辑角色对话框-->
      <el-dialog
        title="修改角色"
        :visible.sync="editDialogVisible"
        width="30%"
        @close="editDialogClosed"
      >
        <el-form
          :model="editForm"
          :rules="editFormRules"
          ref="editUserForm"
          label-width="100px"
        >
          <el-form-item label="角色ID">
            <el-input v-model="editForm.roleId" disabled></el-input>
          </el-form-item>

          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="editForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editRole">确 定</el-button>
        </span>
      </el-dialog>
      <!--添加角色对话框-->
      <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisible"
        width="30%"
        @close="addFormClosed"
      >
        <el-form
          :model="addRoleForm"
          :rules="addFormRules"
          ref="addRoleFormRef"
          label-width="100px"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addRoleForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addRoleForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRole">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Roles',
  data() {
    return {
      rolesList: [],
      editDialogVisible: false,
      addDialogVisible: false,
      editForm: {},
      addRoleForm: {
        roleDesc: '',
        roleName: ''
      },
      editFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      },
      addFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: []
      }
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.rolesList = res.data
    },
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询角色失败,无法编辑')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    editDialogClosed() {
      this.$refs.editUserForm.resetFields()
    },
    editRole() {
      this.$refs.editUserForm.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          'roles/' + this.editForm.roleId,
          {
            roleName: this.editForm.roleName,
            roleDesc: this.editForm.roleDesc
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('修改角色信息失败')
        }
        this.editDialogVisible = false
        this.$message.success('修改角色信息成功')
        this.getRolesList()
      })
    },
    addFormClosed() {
      this.$refs.addRoleFormRef.resetFields()
      console.log(this.addRoleForm)
    },
    addRole() {
      this.$refs.addRoleFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('roles', this.addRoleForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加角色失败')
        }
        this.$message.success('添加角色成功')
        this.addDialogVisible = false
        this.getRolesList()
      })
    },
    deleteRole(id) {
      this.$confirm('此操作将永久移除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete('roles/' + id)
          if (res.meta.status !== 200) {
            return this.$message.error('删除用户失败')
          }
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getRolesList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>

<style scoped lang="less">
.el-card {
  .el-table {
    margin-top: 15px;
  }
}
</style>
