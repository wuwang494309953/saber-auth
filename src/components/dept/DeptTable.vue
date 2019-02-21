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

        <el-dialog title="部门管理" :visible.sync="dialogFormVisible">
            <el-form :model="form" style="padding-right:30%;">
                <el-form-item label="部门名称" :label-width="formLabelWidth">
                <el-input v-model="form.name" placeholder="请输入部门名称"></el-input>
                </el-form-item>
                <el-form-item label="所属部门" :label-width="formLabelWidth">
                <!-- <el-cascader
                    v-model="cascaderSelectArr"
                    :options="selectDept"
                    :props="defaultProps"
                    node-key="id"
                    :change-on-select="true"
                > -->
                </el-cascader>
                </el-form-item>
                <el-form-item label="展示顺序" :label-width="formLabelWidth">
                <el-input v-model="form.seq" placeholder="请输入展示顺序"></el-input>
                </el-form-item>
                <el-form-item label="备注" :label-width="formLabelWidth">
                <el-input v-model="form.remark" type="textarea" :row="2" placeholder="请输入备注"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="_submit">确 定</el-button>
            </div>
            </el-dialog>
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
    data () {
        return {
            formLabelWidth: '120px',
            dialogFormVisible: false,
            form: {
                id: '',
                name: '',
                parentId: '',
                seq: '',
                remark: ''
            }
        }
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
        },
        _submit () {

        }
    }
}
</script>

