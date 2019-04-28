<template>
  <div>
      <div class="query-area">
        <el-row :gutter="20">
            <el-col :span="18">
              <el-form :inline="true" :model="queryParams">
                <el-form-item label="部门名称:">
                    <el-input v-model="queryParams.name" placeholder="部门名称"></el-input>
                </el-form-item>
                <el-form-item label="备注:">
                    <el-input v-model="queryParams.remark" placeholder="备注"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="_getDepts">查询</el-button>
                </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="6" style="text-align: right;">
                <el-button type="primary" round style="margin-left:30px;" @click="_handleAdd">新增部门</el-button>
            </el-col>
        </el-row>
      </div>
      <div class="show-area">
        <transition name="slide-fade" mode="out-in">
          <DeptTable
            :total="total"
            :tableData="tableData"
            :tableLoading="tableLoading"
            @refresh="_refreshTableData"
            ref="tableShow">
          </DeptTable>
        </transition>
      </div>
  </div>
</template>

<script>
import DeptTable from './DeptTable'
import {getDepts} from '@/api/dept.js'
export default {
  data () {
    return {
      total: 0,
      tableData: [],
      tableLoading: true,
      queryParams: {
        name: '',
        remark: '',
        pageNum: 0,
        pageSize: 10,
        sortKey: '',
        sortValue: ''
      }
    }
  },
  methods: {
    _getDepts () {
      this.tableLoading = true
      getDepts(this.queryParams).then(res => {
        if (res.code == 0) {
          this.total = res.data.total
          this.tableData = res.data.data
        }
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })
    },
    _refreshTableData (pageParam) {
      this.queryParams.sortKey = pageParam.sortKey
      this.queryParams.sortValue = pageParam.sortValue
      this.queryParams.pageNum = pageParam.pageNum
      this.queryParams.pageSize = pageParam.pageSize
      this._getDepts()
    },
    _handleAdd () {
      this.$refs.tableShow._handleAdd()
    }
  },
  created () {
    this._getDepts()
  },
  components: {
    DeptTable
  }
}
</script>


<style scoped lang="stylus">
  .bg-purple
    background: #d3dce6
  .grid-content
    border-radius: 4px
    min-height: 36px

  .show-area
    margin-top: 15px
  .slide-fade-enter-active 
    transition: all .5s ease
  .slide-fade-leave-active 
    transition: all .5s ease
  .slide-fade-enter, .slide-fade-leave-to 
    transform: translateX(10px)
    opacity: 0
</style>
