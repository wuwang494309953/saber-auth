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
                    prop="name"
                    label="姓名"
                    sortable="custom"
                >
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
                    sortable="custom"
                    label="备注">
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
        </el-card>
        <el-dialog title="角色管理" :visible.sync="dialogFormVisible">
            <el-form :model="form" style="padding-right:30%;">
                <el-form-item label="角色名称" :label-width="formLabelWidth">
                    <el-input v-model="form.name" placeholder="请输入角色名称"></el-input>
                </el-form-item>
                <el-form-item label="类型" :label-width="formLabelWidth">
                    <el-select v-model="form.type" placeholder="请选择">
                        <el-option v-for="item in roleOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
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
import {saveRole} from '@/api/role.js'
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
            roleOption: [{
                value: 1,
                label: '管理员'
            }, {
                value: 2,
                label: '其他'
            }],
            statusOption: [{
                value: 1,
                label: '启用'
            }, {
                value: 0,
                label: '停用'
            }],
            form: {
                roleId: '',
                name: '',
                remark: '',
                status: '',
                type: ''
            }
        }
    },
    methods: {
        _getRoles () {
            this.$emit('refresh', this.pageParam)
        },
         _handleAdd () {
            this.dialogFormVisible = true
            this.form = {}
        },
        _submit () {
            saveRole(this.form).then(res => {
                if (res.code == 0) {
                    this.$message.success(res.msg)
                    this._getRoles()
                } else {
                    this.$message.error('保存出现了一个问题。')
                }
            }).catch((e) => {
                this.$message.error('保存发生了一个异常。')
                console.log(e)
            })
            this.dialogFormVisible = false
        }
    }
}
</script>
