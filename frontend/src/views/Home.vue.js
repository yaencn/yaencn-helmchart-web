/// <reference types="../../node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import SearchBar from '@/components/SearchBar.vue';
import ChartCard from '@/components/ChartCard.vue';
import ChartDetails from '@/components/ChartDetails.vue';
const charts = ref([]);
const query = ref('');
const fetchCharts = async () => {
    try {
        const response = await axios.get('/api/v1/charts/list');
        // transform entries object into array of representative items
        const entries = response.data.entries || {};
        const arr = [];
        for (const [name, versions] of Object.entries(entries)) {
            const v = versions[0] || {};
            arr.push({
                name,
                version: v.version || '',
                description: v.description || '',
                updated: v.created ? new Date(v.created).toLocaleDateString() : '',
                values: v.values || '',
                raw: versions,
            });
        }
        charts.value = arr;
    }
    catch (error) {
        console.error('Failed to fetch charts', error);
    }
};
const filtered = computed(() => {
    if (!query.value)
        return charts.value;
    const q = query.value.toLowerCase();
    return charts.value.filter((c) => c.name.toLowerCase().includes(q) || (c.description || '').toLowerCase().includes(q));
});
const onSearch = (q) => { query.value = q; };
const detailsVisible = ref(false);
const detailItem = ref({});
const openDetails = (item) => {
    detailItem.value = item;
    detailsVisible.value = true;
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
    ...{ class: "max-w-7xl mx-auto px-4 py-12" },
});
/** @type {__VLS_StyleScopedClasses['max-w-7xl']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-12']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "text-center mb-8" },
});
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
    ...{ class: "text-4xl font-extrabold text-gray-900 sm:text-5xl" },
});
/** @type {__VLS_StyleScopedClasses['text-4xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-extrabold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:text-5xl']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "mt-4 text-xl text-gray-500" },
});
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "mt-8 flex justify-center gap-4" },
});
/** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "bg-gray-800 text-white p-4 rounded-lg font-mono text-sm shadow-lg" },
});
/** @type {__VLS_StyleScopedClasses['bg-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-mono']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "text-blue-400" },
});
/** @type {__VLS_StyleScopedClasses['text-blue-400']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "mt-8 flex justify-center" },
});
/** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "w-full max-w-3xl" },
});
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-3xl']} */ ;
const __VLS_0 = SearchBar;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ 'onSearch': {} },
}));
const __VLS_2 = __VLS_1({
    ...{ 'onSearch': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = ({ search: {} },
    { onSearch: (__VLS_ctx.onSearch) });
var __VLS_3;
var __VLS_4;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" },
});
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:grid-cols-3']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-6']} */ ;
for (const [item] of __VLS_vFor((__VLS_ctx.filtered))) {
    const __VLS_7 = ChartCard;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
        ...{ 'onDetails': {} },
        key: (item.name),
        name: (item.name),
        version: (item.version),
        description: (item.description),
        updated: (item.updated),
    }));
    const __VLS_9 = __VLS_8({
        ...{ 'onDetails': {} },
        key: (item.name),
        name: (item.name),
        version: (item.version),
        description: (item.description),
        updated: (item.updated),
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    let __VLS_12;
    const __VLS_13 = ({ details: {} },
        { onDetails: (...[$event]) => {
                __VLS_ctx.openDetails(item);
                // @ts-ignore
                [onSearch, filtered, openDetails,];
            } });
    var __VLS_10;
    var __VLS_11;
    // @ts-ignore
    [];
}
const __VLS_14 = ChartDetails;
// @ts-ignore
const __VLS_15 = __VLS_asFunctionalComponent1(__VLS_14, new __VLS_14({
    ...{ 'onClose': {} },
    visible: (__VLS_ctx.detailsVisible),
    name: (__VLS_ctx.detailItem.name || ''),
    version: (__VLS_ctx.detailItem.version || ''),
    description: (__VLS_ctx.detailItem.description || ''),
    values: (__VLS_ctx.detailItem.values || ''),
}));
const __VLS_16 = __VLS_15({
    ...{ 'onClose': {} },
    visible: (__VLS_ctx.detailsVisible),
    name: (__VLS_ctx.detailItem.name || ''),
    version: (__VLS_ctx.detailItem.version || ''),
    description: (__VLS_ctx.detailItem.description || ''),
    values: (__VLS_ctx.detailItem.values || ''),
}, ...__VLS_functionalComponentArgsRest(__VLS_15));
let __VLS_19;
const __VLS_20 = ({ close: {} },
    { onClose: (...[$event]) => {
            __VLS_ctx.detailsVisible = false;
            // @ts-ignore
            [detailsVisible, detailsVisible, detailItem, detailItem, detailItem, detailItem,];
        } });
var __VLS_17;
var __VLS_18;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
//# sourceMappingURL=Home.vue.js.map