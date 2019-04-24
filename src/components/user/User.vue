<template>
    <div>
        <div class="query-area">
            <el-row :gutter="20">
                <el-col :span="18">
                   <el-form :inline="true" :model="queryParams">
                        <el-form-item label="姓名:">
                            <el-input v-model="queryParams.username" placeholder="姓名"></el-input>
                        </el-form-item>
                        <el-form-item label="电话:">
                            <el-input v-model="queryParams.telephone" placeholder="电话"></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱:">
                            <el-input v-model="queryParams.mail" placeholder="邮箱"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="_getUsers">查询</el-button>
                        </el-form-item>
                   </el-form>
                </el-col>
                <el-col :span="3">
                    <el-switch
                      v-model="isTableShow"
                      active-text="列表展示"
                      inactive-text="卡片展示"
                      inactive-color="#ff4949"
                    >
                    </el-switch>
                    
                </el-col>
                <el-col :span="3" style="text-align: right;">
                    <el-button type="primary" round style="margin-left:30px;" @click="_addUser">新增用户</el-button>
                </el-col>
            </el-row>
        </div>
        <div class="show-area">
            <transition name="slide-fade" mode="out-in">
                <TableShow 
                    v-if="isTableShow"
                    :total="total"
                    :tableData="tableData"
                    :tableLoading="tableLoading"
                    @refresh="_refreshTableData"
                    ref="tableShow"/>
                <CardShow v-else/>
            </transition>
        </div>
    </div>
</template>

<script>
import TableShow from './TableShow'
import CardShow from './CardShow'
import {getUsers} from '@/api/user.js'

export default {
    data () {
        return {
            isTableShow: true,
            tableLoading: true,
            total: 0,
            tableData: [],
            queryParams: {
                username: '',
                telephone: '',
                mail: '',
                pageNum: 0,
                pageSize: 10,
                sortKey: '',
                sortValue: ''
            }
        }
    },
    methods: {
        _getUsers () {
            this.tableLoading = true
            getUsers(this.queryParams).then((res) => {
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
            this._getUsers()
        },
        _addUser () {
            this.$refs.tableShow._handleAdd()
        }
    },
    created () {
        this._getUsers()
    },
    components: {
        TableShow,
        CardShow
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
