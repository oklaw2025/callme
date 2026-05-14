// logic.js - 核心邏輯管理器（含 AND 模式智能標籤過濾）
const { createApp, ref, computed, watch } = Vue;

createApp({
    setup() {
        // ==================== 主題切換 ====================
        const currentTheme = ref('theme-light');

        const themes = {
            'theme-default': '科技深藍',
            'theme-forest': '翡翠森林',
            'theme-luxury': '玫瑰金奢華',
            'theme-light': '極簡白晝',
            'theme-cyber': '幻彩紫羅蘭'
        };

        // 主題持久化
        watch(currentTheme, (newTheme) => {
            localStorage.setItem('oklaw-theme', newTheme);
            document.documentElement.setAttribute('data-theme', newTheme);
        }, { immediate: true });

        // ==================== 單一盤源模式 ====================
        const urlParams = new URLSearchParams(window.location.search);
        const singleId = urlParams.get('id') ? parseInt(urlParams.get('id')) : null;
        
        const singleItemMode = ref(!!singleId);
        const currentItem = ref(null);

        // ==================== 數據處理 ====================
        const items = ref([]);

        const processRawItems = () => {
            return rawItems.map(item => {
                const processed = { ...item };

                if (item.type === 'images' && item.baseFolder) {
                    const numPhotos = Math.max(1, item.numPhotos || 8);
                    processed.images = [];
                    processed.images.push(`https://oklaw2025.github.io/callme/${item.baseFolder}/photo1.jpg`);
                    for (let i = 2; i <= numPhotos; i++) {
                        processed.images.push(`https://oklaw2025.github.io/callme/${item.baseFolder}/photo${i}.jpeg`);
                    }
                } else if (item.type === 'images' && item.images && item.images.length > 0) {
                    processed.images = [...item.images];
                }

                return processed;
            });
        };

        items.value = processRawItems();

        // ==================== 單一模式載入 ====================
        if (singleId) {
            currentItem.value = items.value.find(item => item.id === singleId);
        }

        // ==================== 狀態 ====================
        const selectedTags = ref([]);
        const matchMode = ref('OR');
        const pageSize = 6;
        const currentPage = ref(1);

        const gallery = ref({ 
            isOpen: false, 
            images: [], 
            index: 0 
        });

        // ==================== 計算屬性 ====================
        const filteredItems = computed(() => {
            let result = [...items.value];
            
            if (selectedTags.value.length > 0) {
                result = result.filter(item => {
                    if (matchMode.value === 'AND') {
                        return selectedTags.value.every(t => item.tags.includes(t));
                    } else {
                        return selectedTags.value.some(t => item.tags.includes(t));
                    }
                });
            }
            return result.sort((a, b) => b.id - a.id);
        });

        // === AND 模式智能標籤過濾：只顯示加入後仍有結果的標籤 ===
        const availableTags = computed(() => {
            if (matchMode.value === 'OR' || selectedTags.value.length === 0) {
                const all = new Set();
                items.value.forEach(item => item.tags.forEach(t => all.add(t)));
                return Array.from(all);
            }

            // AND 模式：只保留加入後仍然有匹配結果的標籤
            const possible = new Set();
            items.value.forEach(item => {
                const currentlyMatched = selectedTags.value.every(t => item.tags.includes(t));
                if (currentlyMatched) {
                    item.tags.forEach(t => {
                        if (!selectedTags.value.includes(t)) {
                            possible.add(t);
                        }
                    });
                }
            });
            return Array.from(possible);
        });

        // 分組標籤（使用 availableTags）
        const groupedTags = computed(() => {
            const groups = {
                floor: [],
                price: [],
                area: [],
                others: []
            };

            availableTags.value.forEach(tag => {
                if (['層', '低層', '高層', '中層'].some(k => tag.includes(k))) {
                    groups.floor.push(tag);
                } else if (tag.includes('萬')) {
                    groups.price.push(tag);
                } else if (tag.includes('呎')) {
                    groups.area.push(tag);
                } else {
                    groups.others.push(tag);
                }
            });

            // 各組內排序
            Object.keys(groups).forEach(key => {
                groups[key].sort();
            });

            return groups;
        });

        const displayedItems = computed(() => {
            return filteredItems.value.slice(0, currentPage.value * pageSize);
        });

        const hasMore = computed(() => displayedItems.value.length < filteredItems.value.length);
        const remainingCount = computed(() => filteredItems.value.length - displayedItems.value.length);

        // ==================== 方法 ====================
        const toggleTag = (tag) => {
            const i = selectedTags.value.indexOf(tag);
            if (i > -1) {
                selectedTags.value.splice(i, 1);
            } else {
                selectedTags.value.push(tag);
            }
            currentPage.value = 1;
        };

        const loadMore = () => { 
            currentPage.value++; 
        };

        watch([selectedTags, matchMode], () => { 
            currentPage.value = 1; 
        }, { deep: true });

        // 燈箱功能
        const openGallery = (item) => {
            gallery.value.images = item.images || [];
            gallery.value.index = 0;
            gallery.value.isOpen = true;
            document.body.style.overflow = 'hidden';
        };

        const closeGallery = () => {
            gallery.value.isOpen = false;
            document.body.style.overflow = 'auto';
        };

        const nextImg = () => {
            gallery.value.index = (gallery.value.index + 1) % gallery.value.images.length;
        };

        const prevImg = () => {
            gallery.value.index = (gallery.value.index - 1 + gallery.value.images.length) % gallery.value.images.length;
        };

        const exitSingleMode = () => {
            window.location.href = 'index.html';
        };

        // WhatsApp 功能
        const shareToFriend = (item) => {
            const content = `https://oklaw2025.github.io/callme/index.html?id=${item.id}`;
            const text = encodeURIComponent(
                `搵樓！搵我 O.K.LAW！\n\n` +
                `🔥 推薦單位：${item.title}\n` +
                `${content}\n\n` +
                `有興趣可以聯絡：9570 5738\n` 
            );
            window.open(`https://wa.me/?text=${text}`, '_blank');
        };

        const inquireDetail = (item) => {
            const content = `https://oklaw2025.github.io/callme/index.html?id=${item.id}`;
            const text = encodeURIComponent(
                `你好 O.K.LAW，\n\n` +
                `我想查詢以下單位詳情：\n` +
                `${item.title}\n` +
                `${content}\n\n` +
                `請提供價錢、面積、睇樓時間等資料，謝謝！`
            );
            window.open(`https://wa.me/85295705738?text=${text}`, '_blank');
        };

        return { 
            currentTheme, 
            themes,
            selectedTags, 
            matchMode, 
            displayedItems, 
            filteredItems, 
            hasMore, 
            loadMore, 
            remainingCount,
            groupedTags,
            toggleTag,
            singleItemMode,
            currentItem,
            exitSingleMode,
            shareToFriend,
            inquireDetail,
            gallery, 
            openGallery, 
            closeGallery, 
            nextImg, 
            prevImg
        };
    }
}).mount('#app');
