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
                        type="primary"
                        @click="_handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button
                        size="mini"
                        type="danger"
                        @click="_handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

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
        </el-card>

        <el-dialog title="用户管理" :visible.sync="dialogFormVisible">
            <el-form :model="form" style="padding-right:30%;">
                <el-form-item label="用户名称" :label-width="formLabelWidth">
                    <el-input v-model="form.username" placeholder="请输入用户名称"></el-input>
                </el-form-item>
                <el-form-item label="手机号" :label-width="formLabelWidth">
                    <el-input v-model="form.telephone" placeholder="请输入手机号"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" :label-width="formLabelWidth">
                    <el-input v-model="form.mail" placeholder="请输入邮箱"></el-input>
                </el-form-item>
                <el-form-item label="所属部门" :label-width="formLabelWidth">
                    <el-select v-model="form.deptId" filterable remote placeholder="请选择" :remote-method="_getDeptData" :loading="deptLoading">
                        <el-option
                            v-for="item in deptOption"
                            :key="item.deptId"
                            :value="item.deptId"
                            :label="item.name">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态" :label-width="formLabelWidth">
                <el-select v-model="form.status" placeholder="请选择">
                    <el-option v-for="item in statusOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                </el-form-item>
                <el-form-item label="备注" :label-width="formLabelWidth">
                    <el-input type="textarea" :row="2" v-model="form.remark" placeholder="请输入备注"></el-input>
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
import {getFootDept} from '@/api/dept.js'
import {saveUser, delUser} from '@/api/user.js'
export default {
    props: {
        total: Number,
        tableData: Array,
        tableLoading: Boolean
    },
    data () {
        return {
            dialogFormVisible: false,
            formLabelWidth: '120px',
            form: {
                userId: '',
                username: '',
                telephone: '',
                mail: '',
                deptId: '',
                status: '',
                remark: ''
            },
            deptLoading: false,
            deptOption: [],
            statusOption: [{
                value: 0,
                label: '停用'
            }, {
                value: 1,
                label: '启用'
            }],
            pageParam: {
                pageNum: 1,
                pageSize: 10,
                sortKey: '',
                sortValue: ''
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
            this.pageParam.sortKey = column.prop
            this.pageParam.sortValue = orderV
            // this.$emit('refresh', column.prop, orderV)
            this._getUsers()
        },
        _getUsers () {
            this.$emit('refresh', this.pageParam)
        },
        _handleEdit (index, row) {
            this.form = JSON.parse(JSON.stringify(row))
            this.dialogFormVisible = true
        },
        _submit () {
            saveUser(this.form).then(res => {
                if (res.code == 0) {
                    this.$message.success(res.msg)
                    this._getUsers()
                } else {
                    this.$message.error('保存出现了一个问题。')
                }
            }).catch((e) => {
                this.$message.error('保存发生了一个异常。')
                console.log(e)
            })
            this.dialogFormVisible = false
        },
        _handleAdd () {
            this.dialogFormVisible = true
            this.form = {}
        },
        _handleDelete (index, row) {
            this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delUser(row.userId).then(res => {
                    if (res.code == 0) {
                        this.$message.success(res.msg)
                        this._getUsers()
                    } else {
                        this.$message.error(res.msg)
                    }
                }).catch((e) => {
                    this.$message.error('删除用户时出现了一个错误!')
                    console.log(e)
                })
            }).catch(() => {})
        },
        _handleSizeChange(size) {
            this.pageParam.pageSize = size
            this._getUsers()
        },
        _handleCurrentChange(index) {
            this.pageParam.pageNum = index
            this._getUsers()
        },
        _getDeptData (query) {
            this.deptLoading = true
            getFootDept(query).then((res) => {
               if (res.code == 0) {
                   this.deptOption = res.data
                }
                this.deptLoading = false
            }).catch(() => {
               this.deptLoading = false
            })
        }
    },
    filters: {
        statusType (value) {
            if (value >= 0 && value < 3) {
                let types = ['停用', '启用']
                return types[value]
            } else {
                return '状态错误'
            }
        },
        statusTag (value) {
            if (value >= 0 && value < 3) {
                let types = ['warning', '']
                return types[value]
            }
        }
    },
    created () {
        this._getDeptData()
    }
}
</script>

