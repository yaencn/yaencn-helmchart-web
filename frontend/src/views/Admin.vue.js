/// <reference types="../../node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useAuthStore } from '../store/auth';
const authStore = useAuthStore();
const chartGroups = ref([]);
const loading = ref(false);
const uploadDialogVisible = ref(false);
const activeNames = ref([]);
const uploadHeaders = computed(() => ({
    Authorization: `Bearer ${authStore.token}`
}));
const fetchCharts = async () => {
    loading.value = true;
    try {
        const response = await axios.get('/api/v1/charts/list');
        const entries = response.data.entries || {};
        const groups = {};
        for (const [name, versions] of Object.entries(entries)) {
            groups[name] = versions.map((v) => ({
                name,
                version: v.version || '',
                description: v.description || '',
                updated: v.created ? new Date(v.created).toLocaleString() : '',
                filename: v.urls && v.urls.length ? v.urls[0] : `${name}-${v.version}.tgz`
            }));
        }
        // Convert to array and keep order
        chartGroups.value = Object.keys(groups).sort().map(name => ({ name, versions: groups[name] }));
    }
    catch (error) {
        ElMessage.error('获取列表失败');
    }
    finally {
        loading.value = false;
    }
};
const handleDelete = (row) => {
    ElMessageBox.confirm(`确定要删除 ${row.name} (${row.version}) 吗？`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(async () => {
        try {
            await axios.delete(`/api/v1/charts/${row.filename}`, {
                headers: { Authorization: `Bearer ${authStore.token}` }
            });
            ElMessage.success('删除成功');
            fetchCharts();
        }
        catch (error) {
            ElMessage.error('删除失败');
        }
    });
};
const handleUploadSuccess = () => {
    ElMessage.success('上传成功');
    uploadDialogVisible.value = false;
    fetchCharts();
};
const handleUploadError = (err) => {
    const msg = JSON.parse(err.message || '{}').detail || '上传失败';
    ElMessage.error(msg);
};
onMounted(fetchCharts);
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "p-6 max-w-7xl mx-auto" },
});
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-7xl']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex justify-between items-center mb-8" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
    ...{ class: "text-2xl font-bold text-gray-900" },
});
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
let __VLS_0;
/** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
elButton;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ 'onClick': {} },
    type: "primary",
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = ({ click: {} },
    { onClick: (...[$event]) => {
            __VLS_ctx.uploadDialogVisible = true;
            // @ts-ignore
            [uploadDialogVisible,];
        } });
const { default: __VLS_7 } = __VLS_3.slots;
// @ts-ignore
[];
var __VLS_3;
var __VLS_4;
let __VLS_8;
/** @ts-ignore @type {typeof __VLS_components.elCollapse | typeof __VLS_components.ElCollapse | typeof __VLS_components.elCollapse | typeof __VLS_components.ElCollapse} */
elCollapse;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
    modelValue: (__VLS_ctx.activeNames),
}));
const __VLS_10 = __VLS_9({
    modelValue: (__VLS_ctx.activeNames),
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
const { default: __VLS_13 } = __VLS_11.slots;
for (const [group] of __VLS_vFor((__VLS_ctx.chartGroups))) {
    let __VLS_14;
    /** @ts-ignore @type {typeof __VLS_components.elCollapseItem | typeof __VLS_components.ElCollapseItem | typeof __VLS_components.elCollapseItem | typeof __VLS_components.ElCollapseItem} */
    elCollapseItem;
    // @ts-ignore
    const __VLS_15 = __VLS_asFunctionalComponent1(__VLS_14, new __VLS_14({
        key: (group.name),
        title: (group.name + ' (' + group.versions.length + ')'),
    }));
    const __VLS_16 = __VLS_15({
        key: (group.name),
        title: (group.name + ' (' + group.versions.length + ')'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_15));
    const { default: __VLS_19 } = __VLS_17.slots;
    let __VLS_20;
    /** @ts-ignore @type {typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components.elTable | typeof __VLS_components.ElTable} */
    elTable;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent1(__VLS_20, new __VLS_20({
        data: (group.versions),
        ...{ style: {} },
    }));
    const __VLS_22 = __VLS_21({
        data: (group.versions),
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    __VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
    const { default: __VLS_25 } = __VLS_23.slots;
    let __VLS_26;
    /** @ts-ignore @type {typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn} */
    elTableColumn;
    // @ts-ignore
    const __VLS_27 = __VLS_asFunctionalComponent1(__VLS_26, new __VLS_26({
        prop: "version",
        label: "版本",
        width: "120",
    }));
    const __VLS_28 = __VLS_27({
        prop: "version",
        label: "版本",
        width: "120",
    }, ...__VLS_functionalComponentArgsRest(__VLS_27));
    let __VLS_31;
    /** @ts-ignore @type {typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn} */
    elTableColumn;
    // @ts-ignore
    const __VLS_32 = __VLS_asFunctionalComponent1(__VLS_31, new __VLS_31({
        prop: "description",
        label: "描述",
    }));
    const __VLS_33 = __VLS_32({
        prop: "description",
        label: "描述",
    }, ...__VLS_functionalComponentArgsRest(__VLS_32));
    let __VLS_36;
    /** @ts-ignore @type {typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn} */
    elTableColumn;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent1(__VLS_36, new __VLS_36({
        prop: "updated",
        label: "更新时间",
        width: "180",
    }));
    const __VLS_38 = __VLS_37({
        prop: "updated",
        label: "更新时间",
        width: "180",
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    let __VLS_41;
    /** @ts-ignore @type {typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn} */
    elTableColumn;
    // @ts-ignore
    const __VLS_42 = __VLS_asFunctionalComponent1(__VLS_41, new __VLS_41({
        label: "操作",
        width: "150",
    }));
    const __VLS_43 = __VLS_42({
        label: "操作",
        width: "150",
    }, ...__VLS_functionalComponentArgsRest(__VLS_42));
    const { default: __VLS_46 } = __VLS_44.slots;
    {
        const { default: __VLS_47 } = __VLS_44.slots;
        const [scope] = __VLS_vSlot(__VLS_47);
        let __VLS_48;
        /** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
        elButton;
        // @ts-ignore
        const __VLS_49 = __VLS_asFunctionalComponent1(__VLS_48, new __VLS_48({
            ...{ 'onClick': {} },
            size: "small",
            type: "danger",
        }));
        const __VLS_50 = __VLS_49({
            ...{ 'onClick': {} },
            size: "small",
            type: "danger",
        }, ...__VLS_functionalComponentArgsRest(__VLS_49));
        let __VLS_53;
        const __VLS_54 = ({ click: {} },
            { onClick: (...[$event]) => {
                    __VLS_ctx.handleDelete(scope.row);
                    // @ts-ignore
                    [activeNames, chartGroups, vLoading, loading, handleDelete,];
                } });
        const { default: __VLS_55 } = __VLS_51.slots;
        // @ts-ignore
        [];
        var __VLS_51;
        var __VLS_52;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_44;
    // @ts-ignore
    [];
    var __VLS_23;
    // @ts-ignore
    [];
    var __VLS_17;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_11;
let __VLS_56;
/** @ts-ignore @type {typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog} */
elDialog;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent1(__VLS_56, new __VLS_56({
    modelValue: (__VLS_ctx.uploadDialogVisible),
    title: "上传 Chart (.tgz)",
    width: "400px",
}));
const __VLS_58 = __VLS_57({
    modelValue: (__VLS_ctx.uploadDialogVisible),
    title: "上传 Chart (.tgz)",
    width: "400px",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
const { default: __VLS_61 } = __VLS_59.slots;
let __VLS_62;
/** @ts-ignore @type {typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload} */
elUpload;
// @ts-ignore
const __VLS_63 = __VLS_asFunctionalComponent1(__VLS_62, new __VLS_62({
    ...{ class: "upload-demo" },
    drag: true,
    action: "/api/v1/charts/upload",
    headers: (__VLS_ctx.uploadHeaders),
    onSuccess: (__VLS_ctx.handleUploadSuccess),
    onError: (__VLS_ctx.handleUploadError),
    accept: ".tgz",
}));
const __VLS_64 = __VLS_63({
    ...{ class: "upload-demo" },
    drag: true,
    action: "/api/v1/charts/upload",
    headers: (__VLS_ctx.uploadHeaders),
    onSuccess: (__VLS_ctx.handleUploadSuccess),
    onError: (__VLS_ctx.handleUploadError),
    accept: ".tgz",
}, ...__VLS_functionalComponentArgsRest(__VLS_63));
/** @type {__VLS_StyleScopedClasses['upload-demo']} */ ;
const { default: __VLS_67 } = __VLS_65.slots;
let __VLS_68;
/** @ts-ignore @type {typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon} */
elIcon;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent1(__VLS_68, new __VLS_68({
    ...{ class: "el-icon--upload" },
}));
const __VLS_70 = __VLS_69({
    ...{ class: "el-icon--upload" },
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
/** @type {__VLS_StyleScopedClasses['el-icon--upload']} */ ;
const { default: __VLS_73 } = __VLS_71.slots;
let __VLS_74;
/** @ts-ignore @type {typeof __VLS_components.uploadFilled | typeof __VLS_components.UploadFilled} */
uploadFilled;
// @ts-ignore
const __VLS_75 = __VLS_asFunctionalComponent1(__VLS_74, new __VLS_74({}));
const __VLS_76 = __VLS_75({}, ...__VLS_functionalComponentArgsRest(__VLS_75));
// @ts-ignore
[uploadDialogVisible, uploadHeaders, handleUploadSuccess, handleUploadError,];
var __VLS_71;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "el-upload__text" },
});
/** @type {__VLS_StyleScopedClasses['el-upload__text']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.em, __VLS_intrinsics.em)({});
// @ts-ignore
[];
var __VLS_65;
// @ts-ignore
[];
var __VLS_59;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
//# sourceMappingURL=Admin.vue.js.map