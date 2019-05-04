<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>权限点</span>
                <el-button style="float: right; padding: 3px 0" type="text" @click="_handleAdd">新增权限点</el-button>
            </div>

            <el-table
                :data="tableData"
                v-loading="tableLoading"
                stripe
                @sort-change="_tableSort"
                style="width: 100%">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="url">
                                <span>{{ props.row.url }}</span>
                            </el-form-item>
                            <el-form-item label="顺序">
                                <span>{{ props.row.seq }}</span>
                            </el-form-item>
                            <el-form-item label="备注">
                                <span>{{ props.row.remark }}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column
                    type="index"
                >
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="权限点名称"
                    sortable="custom"
                    width="120"
                >
                </el-table-column>
                <el-table-column
                    label="权限模块"
                    prop="permissionModuleId"
                    width="120"
                >
                    <template slot-scope="scope">
                        {{scope.row.permissionModuleName}}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="type"
                    label="类型"
                    sortable="custom"
                >
                    <template slot-scope="scope">
                        {{scope.row.type | typeTrans}}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="url"
                    sortable="custom"
                    label="URL"
                    width="250">
                </el-table-column>
                <el-table-column
                    prop="status"
                    sortable="custom"
                    label="状态">
                    <template slot-scope="scope">
                        <el-tag size="medium" :type="scope.row.status | statusTag">{{ scope.row.status | statusType }}</el-tag>
                    </template>
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

        <el-dialog title="权限点管理" :visible.sync="dialogFormVisible">
            <el-form :model="form" style="padding-right:30%;">
                <el-form-item label="权限点名称" :label-width="formLabelWidth">
                    <el-input v-model="form.name" placeholder="请输入权限点名称"></el-input>
                </el-form-item>
                <el-form-item label="所属模块" :label-width="formLabelWidth">
                    <el-cascader
                        v-model="cascaderSelectArr"
                        :options="selectAclModule"
                        :props="defaultProps"
                        expand-trigger="hover"
                        node-key="permissionModuleId"
                    >
                    </el-cascader>
                </el-form-item>
                <el-form-item label="类型" :label-width="formLabelWidth">
                    <el-select v-model="form.type" placeholder="请选择">
                        <el-option v-for="item in typeOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="URL" :label-width="formLabelWidth">
                    <el-input v-model="form.url" placeholder="请输入URL"></el-input>
                </el-form-item>
                <el-form-item label="状态" :label-width="formLabelWidth">
                    <el-select v-model="form.status" placeholder="请选择">
                        <el-option v-for="item in statusOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="顺序" :label-width="formLabelWidth">
                    <el-input v-model="form.seq" placeholder="请输入顺序"></el-input>
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
import {getPermissionModuleTree} from '@/api/permissionModule.js'
import {savePermission, getPermissions, delPermission} from '@/api/permission.js'
export default {
    data () {
        return {
            form: {
                name: '',
                permissionModuleId: '',
                url: '',
                type: '',
                status: '',
                seq: '',
                remark: ''
            },
            defaultProps: {
                children: 'child',
                label: 'name',
                value: 'permissionModuleId'
            },
            typeOption: [{
                value: 1,
                label: '菜单'
            }, {
                value: 2,
                label: '按钮'
            }, {
                value: 3,
                label: '其他'
            }],
            statusOption: [{
                value: 0,
                label: '启用'
            }, {
                value: 1,
                label: '停用'
            }],
            formLabelWidth: '120px',
            cascaderSelectArr: [0],
            dialogFormVisible: false,
            selectAclModule: [],
            total: 0,
            tableData: [],
            pageParam: {
                pageNum: 1,
                pageSize: 10,
                sortKey: '',
                sortValue: ''
            }
        }
    },
    computed: {
        permissionOptionsMap () {
            var permissionOptionsMap = new Object()
            for (var i = 0; i < this.selectAclModule.length; i++) {
                let acl = this.selectAclModule[i];
                permissionOptionsMap[acl.permissionModuleId] = acl
                this._initAclOptionsMap(acl, permissionOptionsMap)
            }
            return permissionOptionsMap
        }
    },
    methods: {
        _initAclOptionsMap (acl, permissionOptionsMap) {
            if (acl.child == null) {
                return
            }
            for (var i = 0; i < acl.child.length; i++) {
                var aclChild = acl.child[i];
                permissionOptionsMap[aclChild.permissionModuleId] = aclChild
                this._initAclOptionsMap(aclChild, permissionOptionsMap)
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
            this._getPermissions()
        },
        _handleAdd () {
            this.dialogFormVisible = true
            this.form = {}
            this.cascaderSelectArr = [0]
        },
        _handleEdit (index, row) {
            this._aclOptions(row.permissionModuleId)
            this.form.permissionId = row.permissionId
            this.form.name = row.name
            this.form.url = row.url
            this.form.type = row.type
            this.form.status = row.status
            this.form.seq = row.seq
            this.form.remark = row.remark
            this.dialogFormVisible = true
        },
        _handleDelete (index, row) {
            this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delPermission(row.permissionId).then(res => {
                    if (res.code == 0) {
                        this.$message.success(res.msg)
                        this._getPermissions()
                    } else {
                        this.$message.error(res.msg)
                    }
                }).catch((e) => {
                    this.$message.error('删除部门时出现了一个错误!')
                    console.log(e)
                })
            }).catch(() => {})
        },
        _submit () {
            this.form.permissionModuleId = this.cascaderSelectArr[this.cascaderSelectArr.length - 1]
            savePermission(this.form).then(res => {
                if (res.code == 0) {
                    this._getPermissions()
                    this.$message.success(res.msg)
                } else {
                    this.$message.error('保存出现了一个问题。')
                }
            }).catch(e => {
                this.$message.error('保存发生了一个异常。')
                console.log(e)
            })
            this.dialogFormVisible = false
        },
        _getPermissions () {
            this.tableLoading = true
            getPermissions(this.pageParam).then(res => {
                this.total = res.data.total
                this.tableData = res.data.data
                this.tableLoading = false
            }).catch(() => {
                this.tableLoading = false
            })
        },
        _getPermissionModuleTree () {
            getPermissionModuleTree().then(res => {
                this.selectAclModule = res.data
            })
        },
        _handleSizeChange(size) {
            this.pageParam.pageSize = size
            this._getPermissions()
        },
        _handleCurrentChange(index) {
            this.pageParam.pageNum = index
            this._getPermissions()
        },
        _aclOptions(aclModuleId) {
            let arr = new Array()
            arr.unshift(aclModuleId)
            while (aclModuleId != 0) {
                var acl = this.permissionOptionsMap[aclModuleId]  
                aclModuleId = acl.parentId
                arr.unshift(aclModuleId)
            }
            if (arr.length > 1) {
                arr.shift()
            }
            this.cascaderSelectArr = arr
            console.log(this.cascaderSelectArr)
        },
    },
    filters: {
        statusType (value) {
            if (value >= 0 && value < 2) {
                let types = ['启用', '停用']
                return types[value]
            } else {
                return '状态错误'
            }
        },
        statusTag (value) {
            if (value >= 0 && value < 2) {
            let types = ['', 'warning', 'danger']
            return types[value]
            }
        },
        typeTrans (value) {
            if (value > 0 && value < 4) {
                let types = ['菜单', '按钮', '其他']
                return types[value - 1]
            }
        }
    },
    created () {
        this._getPermissions()
        this._getPermissionModuleTree()
    }
}
</script>

<style lang="stylus">
  .demo-table-expand
    font-size: 0
    label
      width: 90px
      color: #99a9bf
    .el-form-item
      margin-right: 0
      margin-bottom: 0
      width: 50%
</style>
