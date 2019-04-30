<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>权限模块</span>
                <el-button style="float: right; padding: 3px 0" type="text" @click="_add">新增模块</el-button>
            </div>
            <el-tree :data="data" :props="defaultProps" @node-click="_handleNodeClick" :render-content="_renderContent"></el-tree>
        </el-card>

        <el-dialog title="权限模块管理" :visible.sync="dialogFormVisible">
            <el-form :model="form" style="padding-right:30%;">
                <el-form-item label="权限模块名称" :label-width="formLabelWidth">
                    <el-input v-model="form.name" placeholder="请输入权限模块名称"></el-input>
                </el-form-item>
                <el-form-item label="上级模块" :label-width="formLabelWidth">
                    <el-cascader
                        v-model="cascaderSelectArr"
                        :options="selectModule"
                        :props="defaultProps"
                        node-key="permissionModuleId"
                        expand-trigger="hover"
                        :change-on-select="true"
                    >
                    </el-cascader>
                </el-form-item>
                <el-form-item label="展示顺序" :label-width="formLabelWidth">
                    <el-input v-model="form.seq" placeholder="请输入展示顺序"></el-input>
                </el-form-item>
                <el-form-item label="是否有效" :label-width="formLabelWidth">
                    <el-select v-model="form.status" placeholder="请选择">
                        <el-option v-for="item in statusOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
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
import {savePermissionModule, delPermissionModule, getPermissionModuleTree} from '@/api/permissionModule.js'
export default {
    data () {
        return {
            data: [],
            form: {
                permissionModuleId: '',
                name: '',
                parentId: '',
                seq: '',
                remark: '',
                status: ''
            },
            cascaderSelectArr: ['0'],
            formLabelWidth: '120px',
            dialogFormVisible: false,
            defaultProps: {
                children: 'child',
                label: 'name',
                value: 'permissionModuleId'
            },
            statusOption: [{
                value: 0,
                label: '有效'
                }, {
                value: 1,
                label: '无效'
                }, {
                value: 2,
                label: '删除'
            }]
        }
    },
    computed: {
        selectModule () {
            var newArr = [{
                name: '我就是初始模块.',
                permissionModuleId: '0'
            }].concat(this.data)
            return newArr
        }
    },
    methods: {
        _handleNodeClick () {
            // console.log(data)
        },
        _add () {
            this.dialogFormVisible = true
            this.form = {}
        },
        _handleEdit (node, data) {
            this.dialogFormVisible = true
            this.form.permissionModuleId = data.permissionModuleId
            this.form.name = data.name
            this.form.parentId = data.parentId
            this.form.seq = data.seq
            this.form.remark = data.remark
            this.form.status = data.status
            this.cascaderSelectArr = []
            while (node.data.parentId !== '0') {
                node = node.parent
                this.cascaderSelectArr.unshift(node.data.permissionModuleId)
            }
            if (this.cascaderSelectArr.length === 0) {
                this.cascaderSelectArr.push('0')
            }
        },
        _handleRemove (node, data) {
            this.$confirm('此操作将永久删除该模块, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delPermissionModule(data.permissionModuleId).then(res => {
                    if (res.code == 0) {
                        this.$message.success(res.msg)
                        this._getDepts()
                    } else {
                        this.$message.error(res.msg)
                    }
                }).catch((e) => {
                    this.$message.error('删除时出现了一个错误!')
                    console.log(e)
                })
            }).catch(() => {})
        },
        _submit () {
            this.form.parentId = this.cascaderSelectArr[this.cascaderSelectArr.length - 1]
            savePermissionModule(this.form).then(res => {
                if (res.code == 0) {
                    this.$message.success(res.msg)
                    this._getPermissionModuleTree()
                } else {
                    this.$message.error('保存出现了一个问题。')
                }
            }).catch(e => {
                this.$message.error('保存发生了一个异常。')
                console.log(e)
            })
            this.dialogFormVisible = false
        },
        _getPermissionModuleTree () {
            getPermissionModuleTree().then(res => {
                this.data = res.data
            })
        },
        _renderContent (h, { node, data }) {
            var removeBtn = (<span></span>)
            if (node.childNodes.length === 0) {
                removeBtn = (
                    <el-button icon="el-icon-delete" style="font-size: 12px;" type="text" on-click={ () => this._handleRemove(node, data) }></el-button>
                )
            }
            return (
                <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
                    <span>
                    <span>{node.label}</span>
                    </span>
                    <span>
                    <el-button icon="el-icon-edit" style="font-size: 12px;" type="text" on-click={ () => this._handleEdit(node, data) }></el-button>
                    {removeBtn}
                    </span>
                </span>
            )
        }
    },
    created () {
        this._getPermissionModuleTree()
    }
}
</script>

<style lang="stylus">
  
</style>
