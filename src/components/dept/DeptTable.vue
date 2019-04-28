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

        <div style="margin-top: 15px;">
            <el-pagination
                @size-change="_handleSizeChange"
                @current-change="_handleCurrentChange"
                :current-page="pageParam.pageNum"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="10"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>

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
                    change-on-select
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
import {addDept, delDept, getDeptTree} from '@/api/dept.js'
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
                    deptId: "0",
                    name: '我就是根节点'
                }
            ],
            pageParam: {
                pageNum: 1,
                pageSize: 10,
                sortKey: '',
                sortValue: ''
            }
        }
    },
    computed: {
        deptOptionsMap () {
            var deptOptionsMap = new Object()
            for (var i = 0; i < this.deptOptions.length; i++) {
                let dept = this.deptOptions[i];
                deptOptionsMap[dept.deptId] = dept
                this._initDeptOptionsMap(dept, deptOptionsMap)
            }
            return deptOptionsMap
        }
    },
    methods: {
        _initDeptOptionsMap (dept, deptOptionsMap) {
            if (dept.child == null) {
                return
            }
            for (var i = 0; i < dept.child.length; i++) {
                var deptChild = dept.child[i];
                deptOptionsMap[deptChild.deptId] = deptChild
                this._initDeptOptionsMap(deptChild, deptOptionsMap)
            }
        },
        _tableSort (column) {
            var orderV = 'desc'
            if (column.order == 'ascending') {
                orderV = 'asc'
            } else {
                orderV = 'desc'
            }
            this.pageParam.sortKey = column.prop
            this.pageParam.sortValue = orderV
            this._getDepts()
        },
        _dateFormatter (row, column, cellValue) {
            return format(new Date(cellValue), 'yyyy-MM-dd')
        },
        _getDepts () {
            this.$emit('refresh', this.pageParam)
        },
        _submit () {
            this.form.parentId = this.cascaderSelectArr[this.cascaderSelectArr.length - 1]
            addDept(this.form).then(res => {
                if (res.code == 0) {
                    this.$message.success(res.msg)
                    this._getDepts()
                    this._getDeptTree()
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
            this._deptOptions(row.deptId)
            this.form = JSON.parse(JSON.stringify(row))
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
                        this._getDepts()
                    } else {
                        this.$message.error(res.msg)
                    }
                }).catch((e) => {
                    this.$message.error('删除部门时出现了一个错误!')
                    console.log(e)
                })
            }).catch(() => {})
        },
        _getDeptTree () {
            getDeptTree().then(res => {
                this.deptOptions = [{deptId: "0", name: '我就是根节点'}]
                this.deptOptions = this.deptOptions.concat(res.data)
            })
        },
        _deptOptions(deptId) {
            let arr = new Array()
            while (deptId != 0) {
                var dept = this.deptOptionsMap[deptId]  
                deptId = dept.parentId
                arr.unshift(deptId)
            }
            if (arr.length > 1) {
                arr.shift()
            }
            this.cascaderSelectArr = arr
        },
        _handleSizeChange(size) {
            this.pageParam.pageSize = size
            this._getDepts()
        },
        _handleCurrentChange(index) {
            this.pageParam.pageNum = index
            this._getDepts()
        },
    },
    created () {
        this._getDeptTree()
    }
}
</script>

