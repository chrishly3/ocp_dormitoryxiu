<template>
  <d2-container>
    <!-- table表格 -->
    <el-table :key='tableKey'
              :data="list"
              v-loading="listLoading"
              element-loading-text="拼命加载中..."
              highlight-current-row
              stripe
              style="width: 100%">

      <el-table-column align="center" label="序号" width="60">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="图片名称">
        <template slot-scope="scope">
          <span>
            {{scope.row.name}}
          </span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="文件大小">
        <template slot-scope="scope">
          <span>
            {{scope.row.size}}
          </span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="媒体类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.contentType" type="success">{{scope.row.contentType}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="OSS运营商">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.source" type="success">{{scope.row.source}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)" icon="el-icon-delete"></el-button>
        </template>
      </el-table-column>

    </el-table>
    <!-- footer 分页条 -->
    <template slot="footer">
      <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="listQuery.page"
              :page-sizes="[10,20,30,50]"
              :page-size="listQuery.limit"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              style="margin: -10px;">
      </el-pagination>
    </template>
  </d2-container>
</template>

<script>
import { files } from '@/api/file'
export default {
  name: 'file_list',
  data () {
    return {
      list: null,
      total: null,
      listLoading: true,
      treeData: [],
      listQuery: {
        page: 1,
        limit: 10
      },
      statusOptions: ['0', '1'],
      dialogFormVisible: false,
      userAdd: false,
      userUpd: false,
      userDel: false,
      dialogStatus: '',
      textMap: {
        update: '编辑权限',
        create: '新增权限'
      },
      tableKey: 0
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.listLoading = true
      files(this.listQuery).then(({ data }) => {
        if (data.code === 0) {
          this.list = data.data
          this.total = data.count
        }
      }).finally(() => {
        this.listLoading = false
      })
    },
    handleFilter () {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange (val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.listQuery.page = val
      this.getList()
    },
    handleCreate (formName) {
      this.form = {}
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleUpdate (row) {
      this.form = row
      this.form.menuId = row.menuId.toString()
      this.dialogFormVisible = true
      this.dialogStatus = 'update'
    },
    cancel (formName) {
      this.dialogFormVisible = false
      this.$refs[formName].resetFields()
    }
  }
}
</script>
