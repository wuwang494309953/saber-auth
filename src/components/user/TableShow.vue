<template>
    <div>
        <el-card>
            <el-table
                :data="tableData"
                v-loading="tableLoading"
                stripe
                @sort-change="_tableSort"
                style="width: 100%">
                <el-table-column
                    type="index"
                >
                </el-table-column>
                <el-table-column
                    prop="username"
                    label="姓名"
                    sortable="custom"
                >
                </el-table-column>
                <el-table-column
                    label="所属部门"
                    prop="deptId"
                    width="180">
                    <template slot-scope="scope">
                        <span>{{scope.row.deptName}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="telephone"
                    label="电话"
                    sortable="custom"
                    width="180">
                    </el-table-column>
                    <el-table-column
                    prop="mail"
                    sortable="custom"
                    label="邮箱">
                    </el-table-column>
                    <el-table-column
                    prop="status"
                    sortable="custom"
                    label="状态">
                    <template slot-scope="scope">
                        <el-tag size="medium" :type="scope.row.status | statusTag">{{ scope.row.status | statusType }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="remark"
                    sortable="custom"
                    label="备注">
                    </el-table-column>
                    <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button
                        size="mini"
                        @click="_handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button
                        size="mini"
                        type="danger"
                        @click="_handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
export default {
    props: {
        total: Number,
        tableData: Array,
        tableLoading: true
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
            // this._getUsers()
        },
    },
    filters: {
        statusType (value) {
            if (value >= 0 && value < 3) {
                let types = ['启用', '停用', '禁用']
                return types[value]
            } else {
                return '状态错误'
            }
        },
        statusTag (value) {
            if (value >= 0 && value < 3) {
                let types = ['', 'warning', 'danger']
                return types[value]
            }
        }
    }
}
</script>

