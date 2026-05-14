// logic.js - 主應用入口
const { createApp, ref, computed, watch } = Vue;

createApp({
    setup() {
        // ==================== 主題 ====================
        const currentTheme = ref('theme-light');
        const themes = {
            'theme-default': '科技深藍',
            'theme-forest': '翡翠森林',
            'theme-luxury': '玫瑰金奢華',
            'theme-light': '極簡白晝',
            'theme-cyber': '幻彩紫羅蘭'
        };

        watch(currentTheme, (newTheme) => {
            localStorage.setItem('oklaw-theme', newTheme);
            document.documentElement.setAttribute('data-theme', newTheme);
        }, { immediate: true });

        // ==================== 數據 ====================
        const items = ref(rawItems.map(item => {
            const processed = { ...item };
            if (item.type === 'images' && item.baseFolder) {
                const numPhotos = Math.max(1, item.numPhotos || 8);
                processed.images = [`https://oklaw2025.github.io/callme/${item.baseFolder}/photo1.jpg`];
                for (let i = 2; i <= numPhotos; i++) {
                    processed.images.push(`https://oklaw2025.github.io/callme/${item.baseFolder}/photo${i}.jpeg`);
                }
            }
            return processed;
        }));

        // ==================== 單一模式 ====================
        const urlParams = new URLSearchParams(window.location.search);
        const singleId = urlParams.get('id') ? parseInt(urlParams.get('id')) : null;
        const singleItemMode = ref(!!singleId);
        const currentItem = ref(singleId ? items.value.find(item => item.id === singleId) : null);

        // ==================== 狀態 ====================
        const selectedTags = ref([]);
        const matchMode = ref('OR');
        const pageSize = 6;
        const currentPage = ref(1);
        const gallery = ref({ isOpen: false, images: [], index: 0 });

        // ==================== 引入分拆邏輯 ====================
        const { filteredItems, groupedTags } = window.createFilters(items, selectedTags, matchMode);
        const utils = window.createUtils();

        const displayedItems = computed(() => filteredItems.value.slice(0, currentPage.value * pageSize));
        const hasMore = computed(() => displayedItems.value.length < filteredItems.value.length);
        const remainingCount = computed(() => filteredItems.value.length - displayedItems.value.length);

        // ==================== 方法 ====================
        const toggleTag = (tag) => {
            const i = selectedTags.value.indexOf(tag);
            if (i > -1) selectedTags.value.splice(i, 1);
            else selectedTags.value.push(tag);
            currentPage.value = 1;
        };

        const loadMore = () => currentPage.value++;

        watch([selectedTags, matchMode], () => currentPage.value = 1, { deep: true });

        const exitSingleMode = () => window.location.href = 'index.html';

        const openGalleryDebug = (item) => {
                console.log('=== openGallery 被呼叫 ===');
                console.log('Item:', item);
                console.log('Images:', item.images);
                utils.openGallery(gallery, item);
            };

        return { 
            currentTheme, themes,
            selectedTags, matchMode,
            displayedItems, filteredItems, hasMore, loadMore, remainingCount,
            groupedTags, toggleTag,
            singleItemMode, currentItem, exitSingleMode,
            gallery,
            openGallery: (item) => utils.openGallery(gallery, item),
            openGalleryDebug,   // ← 測試用
            closeGallery: () => utils.closeGallery(gallery),
            nextImg: () => utils.nextImg(gallery),
            prevImg: () => utils.prevImg(gallery),
            shareToFriend: utils.shareToFriend,
            inquireDetail: utils.inquireDetail
        };
    }
}).mount('#app');
