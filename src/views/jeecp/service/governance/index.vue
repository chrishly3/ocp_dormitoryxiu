<template>
  <d2-container>
    <!-- table表格 -->
    <el-table :key='tableKey'
              :data="treeData"
              v-loading="listLoading"
              element-loading-text="拼命加载中..."
              highlight-current-row
              stripe
              style="width: 100%">

      <el-table-column align="center" label="服务实例" width="350">
        <template slot-scope="scope">
          <span>{{scope.row.app}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="IP地址" width="350">
        <template slot-scope="scope">
          <span>{{scope.row.ipAddr}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态" width="300">
        <template slot-scope="scope">
          <span>{{scope.row.status}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="端口" width="250">
        <template slot-scope="scope">
          <span>{{scope.row.port.$}}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- footer 分页条 -->
  </d2-container>
</template>

<script>
import { getHostServer } from '@/api/governance'
export default {
  name: 'governance_list',
  data () {
    return {
      total: null,
      listLoading: true,
      treeData: [],
      tableKey: 0
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.listLoading = true
      getHostServer(this.listQuery).then(({ data }) => {
        var item = []
        data.applications.application.filter(m => m.instance.filter(function (m) {
          item.push(m)
        }))
        this.treeData = item
      }).finally(() => {
        this.listLoading = false
      })
    }
  }
}
</script>
