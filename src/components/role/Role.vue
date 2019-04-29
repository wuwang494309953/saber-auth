<template>
    <div>
        <div class="query-area">
            <el-row :gutter="20">
                <el-col :span="18">
                   <el-form :inline="true" :model="queryParams">
                        <el-form-item label="角色名称:">
                            <el-input v-model="queryParams.name" placeholder="角色名称"></el-input>
                        </el-form-item>
                        <el-form-item label="备注:">
                            <el-input v-model="queryParams.remark" placeholder="备注"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="_getRoles">查询</el-button>
                        </el-form-item>
                   </el-form>
                </el-col>
                <el-col :span="6" style="text-align: right;">
                    <el-button type="primary" round style="margin-left:30px;" @click="_addRole">新增角色</el-button>
                </el-col>
            </el-row>
        </div>
        <div class="show-area">
            <transition name="slide-fade" mode="out-in">
            <RoleTable
                :total="total"
                :tableData="tableData"
                :tableLoading="tableLoading"
                @refresh="_refreshTableData"
                ref="tableShow">
            </RoleTable>
            </transition>
        </div>
    </div>
</template>

<script>
import RoleTable from './RoleTable'
import {getRoles} from '@/api/role.js'
export default {
    data () {
        return {
            isTableShow: true,
            tableLoading: true,
            total: 0,
            tableData: [],
            queryParams: {
                name: '',
                type: '',
                pageNum: 0,
                pageSize: 10,
                sortKey: '',
                sortValue: ''
            }
        }
    },
    methods: {
        _addRole () {
            this.$refs.tableShow._handleAdd()
        },
        _getRoles () {
            this.tableLoading = true
            getRoles(this.queryParams).then((res) => {
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
            this._getRoles()
        }
    },
    created () {
        this._getRoles()
    },
    components: {
        RoleTable
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
