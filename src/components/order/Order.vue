<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getOrdersList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getOrdersList"
            ></el-button>
          </el-input>
        </el-col>
        <el-table :data="orderList" border stripe height="73vh">
          <el-table-column type="index"></el-table-column>
          <el-table-column
            label="订单编号"
            prop="order_number"
          ></el-table-column>
          <el-table-column
            label="订单价格"
            prop="order_price"
            width="80px"
          ></el-table-column>
          <el-table-column label="是否付款" prop="pay_status" width="80px">
            <template v-slot="scope">
              <el-tag
                type="success"
                size="mini"
                v-if="scope.row.pay_status === '1'"
                >已付款</el-tag
              >
              <el-tag type="error" v-else size="mini">未付款</el-tag>
            </template> </el-table-column
          ><el-table-column
            label="是否发货"
            prop="is_send"
            width="50px"
          ></el-table-column
          ><el-table-column label="下单时间" prop="create_time">
            <template v-slot="scope">
              {{ scope.row.create_time | dateFormat }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="130px">
            <template v-slot="scope">
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-edit"
              ></el-button>
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-card>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[10, 15, 20, 30]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      background
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      orderList: []
    }
  },
  created() {
    this.getOrdersList()
  },
  methods: {
    async getOrdersList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单列表失败')
      }
      console.log(res)
      this.total = res.data.total
      this.orderList = res.data.goods
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrdersList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrdersList()
    }
  }
}
</script>

<style lang="less" scoped></style>
