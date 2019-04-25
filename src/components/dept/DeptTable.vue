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
                <el-table-column
                    prop="remark"
                    sortable="custom"
                    label="备注">
                    </el-table-column>
                    <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button
                        size="mini"
                        type="primary"
                        @click="_handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button
                        size="mini"
                        type="danger"
                        @click="_handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <el-dialog title="部门管理" :visible.sync="dialogFormVisible">
            <el-form :model="form" style="padding-right:30%;">
                <el-form-item label="部门名称" :label-width="formLabelWidth">
                <el-input v-model="form.name" placeholder="请输入部门名称"></el-input>
                </el-form-item>
                <el-form-item label="所属部门" :label-width="formLabelWidth">
                <el-cascader
                    v-model="cascaderSelectArr"
                    :options="deptOptions"
                    :props="defaultProps"
                    expand-trigger="hover"
                    :show-all-levels="false"
                    node-key="deptId"
                    @active-item-change="_handleDeptChange"
                > 
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
import {getDeptOptions, addDept, delDept} from '@/api/dept.js'
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
                deptId: '',
                name: '',
                parentId: '',
                seq: '',
                remark: ''
            },
            cascaderSelectArr: [],
            defaultProps: {
                value: 'deptId',
                label: 'name',
                children: 'child'
            },
            deptOptions: [
                {
                    deptId: 0,
                    name: '我就是根节点'
                }
            ],
            deptOptionsMap: {}
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
        _dateFormatter (row, column, cellValue) {
            return format(new Date(cellValue), 'yyyy-MM-dd')
        },
        _getDepts () {
            this.$emit('refresh')
        },
        _submit () {
            console.log(this.cascaderSelectArr)
            this.form.parentId = this.cascaderSelectArr[this.cascaderSelectArr.length - 1]
            addDept(this.form).then(res => {
                if (res.code == 0) {
                    this.$message.success(res.msg)
                    this._getDepts()
                } else {
                    this.$message.error('保存出现了一个问题。')
                }
            }).catch(e => {
                this.$message.error('保存发生了一个异常。')
                console.log(e)
            })
            this.dialogFormVisible = false
        },
        _handleAdd () {
            this.form = {}
            this.cascaderSelectArr = new Array()
            this.dialogFormVisible = true
        },
        _handleEdit (index, row) {
            this.form = row
            this.dialogFormVisible = true
        },
        _handleDelete (index, row) {
            this.$confirm('此操作将永久删除该部门, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delDept(row.deptId).then(res => {
                    if (res.code == 0) {
                        this.$message.success(res.msg)
                        this._getUsers()
                    } else {
                        this.$message.error(res.msg)
                    }
                }).catch((e) => {
                    this.$message.error('删除部门时出现了一个错误!')
                    console.log(e)
                })
            }).catch(() => {})
        },
        _getDeptOptions (parentId) {
            getDeptOptions(parentId).then(res => {
                if (res.code == 0) {
                    res.data.forEach(obj => {
                        if (obj.hasChild == 1) {
                            obj.child = new Array()
                        }
                    })
                    this.deptOptions = this.deptOptions.concat(res.data)
                    this._refreshMap(this.deptOptions)
                }
            })
        },
        _handleDeptChange (val) {
            var deptOption = this.deptOptionsMap[val[val.length - 1]]
            getDeptOptions(deptOption.deptId).then(res => {
                if (res.code == 0) {
                    res.data.forEach(obj => {
                        if (obj.hasChild == 1) {
                            obj.child = new Array()
                        }
                    })
                    deptOption.child = res.data
                    this._refreshMap(this.deptOptions)
                }
            })
        },
        _refreshMap (deptOptions) {
            deptOptions.forEach(deptOption => {
                this.deptOptionsMap[deptOption.deptId] = deptOption
                if (deptOption.hasChild == 1 && deptOption.child.length > 0) {
                    this._refreshMap(deptOption.child)
                }
            })
        }
    },
    created () {
        this._getDeptOptions()
    }
}
</script>

