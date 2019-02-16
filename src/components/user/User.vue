<template>
    <div>
        <div class="query-area">
            <el-row :gutter="20">
                <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
                <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
                <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
                <el-col :span="6">
                    <el-switch
                      v-model="isTableShow"
                      active-text="列表展示"
                      inactive-text="卡片展示"
                      inactive-color="#ff4949"
                    >
                    </el-switch>
                </el-col>
            </el-row>
        </div>
        <div class="show-area">
            <transition name="slide-fade" mode="out-in">
                <TableShow 
                    v-if="isTableShow"
                    v-bind:total="total"
                    v-bind:tableData="tableData"
                    @refresh="_refreshTableData"/>
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
                pageIndex: 0,
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
        _refreshTableData (sortKey, sortValue) {
            this.queryParams.sortKey = sortKey
            this.queryParams.sortValue = sortValue
            this._getUsers()
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
