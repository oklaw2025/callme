// logic.js - 核心邏輯管理器（已支援單一分享模式）
const { createApp, ref, computed, watch, onMounted } = Vue;

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

        // ==================== 單一盤源模式（?id=xx）===================
        const urlParams = new URLSearchParams(window.location.search);
        const singleId = urlParams.get('id') ? parseInt(urlParams.get('id')) : null;
        
        const singleItemMode = ref(!!singleId);
        const currentItem = ref(null);

        // ==================== 數據與篩選 ====================
        const items = ref(rawItems);
        const selectedTags = ref([]);
        const matchMode = ref('OR');
        const pageSize = 6;
        const currentPage = ref(1);

        // 圖片燈箱
        const gallery = ref({ 
            isOpen: false, 
            images: [], 
            index: 0 
        });

        // ==================== 如果是單一模式，載入對應資料 ====================
        if (singleId) {
            currentItem.value = rawItems.find(item => item.id === singleId);
        }

        // ==================== 計算屬性 ====================
        const filteredItems = computed(() => {
            if (singleItemMode.value) return [];
            
            let result = [...items.value];
            if (selectedTags.value.length > 0) {
                result = result.filter(v => {
                    return matchMode.value === 'AND' 
                        ? selectedTags.value.every(t => v.tags.includes(t))
                        : selectedTags.value.some(t => v.tags.includes(t));
                });
            }
            return result.sort((a, b) => b.id - a.id);
        });

        const displayedItems = computed(() => {
            return filteredItems.value.slice(0, currentPage.value * pageSize);
        });

        const hasMore = computed(() => displayedItems.value.length < filteredItems.value.length);
        const remainingCount = computed(() => filteredItems.value.length - displayedItems.value.length);

        // ==================== 方法 ====================
        const loadMore = () => { currentPage.value++; };

        const toggleTag = (tag) => {
            const i = selectedTags.value.indexOf(tag);
            if (i > -1) selectedTags.value.splice(i, 1);
            else selectedTags.value.push(tag);
        };

        watch([selectedTags, matchMode], () => { 
            currentPage.value = 1; 
        }, { deep: true });

        const allTags = computed(() => {
            const s = new Set();
            items.value.forEach(v => v.tags.forEach(t => s.add(t)));
            return Array.from(s).sort();
        });

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

        // 返回列表
        const exitSingleMode = () => {
            window.location.href = 'index3.html';
        };

        // ==================== WhatsApp 功能 ====================
        // 1. 分享給朋友
        const shareToFriend = (item) => {
            const content =  `https://https://oklaw2025.github.io/callme/index2.html?id=${item.id}`;
            
            const text = encodeURIComponent(
                `搵樓！搵我 O.K.LAW！\n\n` +
                `🔥 推薦單位：${item.title}\n` +
                `${content}\n\n` +
                `有興趣可以聯絡：9570 5738\n` 

            );
            
            window.open(`https://wa.me/?text=${text}`, '_blank');
        };

        // 2. 直接查詢詳情
        const inquireDetail = (item) => {
            const content =  `https://https://oklaw2025.github.io/callme/index2.html?id=${item.id}`;
            
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
            // 主題
            currentTheme, 
            themes,
            
            // 列表模式
            selectedTags, 
            allTags, 
            toggleTag, 
            matchMode, 
            displayedItems, 
            filteredItems, 
            hasMore, 
            loadMore, 
            remainingCount,
            
            // 單一模式
            singleItemMode,
            currentItem,
            exitSingleMode,
            
            // 分享功能
            shareToFriend,
            inquireDetail,
            
            // 燈箱
            gallery, 
            openGallery, 
            closeGallery, 
            nextImg, 
            prevImg
        };
    }
}).mount('#app');
