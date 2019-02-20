<template>
    <div>
        <el-card>
            <el-table
                :data="tableData"
                v-loading="tableLoading"
                stripe
                @sort-change="_tableSort">
                <el-table-column
                    type="index">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="部门名称"
                    sortable="custom">
                </el-table-column>
                <el-table-column
                    prop="parentName"
                    label="上级部门名称">
                </el-table-column>
                <el-table-column
                    prop="operator"
                    label="操作人">
                </el-table-column>
                <el-table-column
                    prop="operateTime"
                    :formatter="_dateFormatter"
                    label="操作日期">
                </el-table-column>
                <el-table-column
                    prop="remark"
                    label="备注">
                </el-table-column>
                <el-table-column
                    prop="seq"
                    label="顺序号">
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
import {format} from '@/util/DateUtil.js'
export default {
    props: {
        total: Number,
        tableData: Array,
        tableLoading: Boolean
    },
    methods: {
        _tableSort (column) {
            var orderV = 'desc'
            if (column.order == 'ascending') {
                orderV = 'asc'
            } else {
                orderV = 'desc'
            }
            this.$emit('refresh', column.prop, orderV)
        },
        _dateFormatter (row, column, cellValue, index) {
            return format(new Date(cellValue), 'yyyy-MM-dd')
        }
    }
}
</script>

