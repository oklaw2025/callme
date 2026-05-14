// logic.js - 核心邏輯管理器（支援任意檔名 + 自動生成）
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
            const commonExts = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

            return rawItems.map(item => {
                const processed = { ...item };

                if (item.type === 'images' && item.baseFolder) {
                    processed.images = [];

                    // 優先使用使用者手動提供的 filenames（最高優先）
                    if (item.filenames && Array.isArray(item.filenames) && item.filenames.length > 0) {
                        processed.images = item.filenames.map(name => 
                            `https://oklaw2025.github.io/callme/${item.baseFolder}/${name}`
                        );
                    } 
                    // 否則使用自動生成方式
                    else {
                        const numPhotos = item.numPhotos || 12;

                        // 常見命名規則
                        for (let i = 1; i <= numPhotos; i++) {
                            // 1. photo1.jpg、photo2.jpg
                            commonExts.forEach(ext => {
                                processed.images.push(`https://oklaw2025.github.io/callme/${item.baseFolder}/photo${i}.${ext}`);
                                processed.images.push(`https://oklaw2025.github.io/callme/${item.baseFolder}/photo ${i}.${ext}`);
                            });
                            
                            // 2. 直接數字命名 1.jpg、2.jpg
                            commonExts.forEach(ext => {
                                processed.images.push(`https://oklaw2025.github.io/callme/${item.baseFolder}/${i}.${ext}`);
                            });
                        }
                        
                        // 去除重複
                        processed.images = [...new Set(processed.images)];
                    }
                } 
                // 保留原本手動填寫 images 的方式
                else if (item.type === 'images' && item.images && item.images.length > 0) {
                    processed.images = [...item.images];
                }

                return processed;
            });
        };

        items.value = processRawItems();

        // 單一模式載入
        if (singleId) {
            currentItem.value = items.value.find(item => item.id === singleId);
        }

        // ==================== 其他狀態 ====================
        const selectedTags = ref([]);
        const matchMode = ref('OR');
        const pageSize = 6;
        const currentPage = ref(1);

        const gallery = ref({ isOpen: false, images: [], index: 0 });

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

        const displayedItems = computed(() => filteredItems.value.slice(0, currentPage.value * pageSize));
        const hasMore = computed(() => displayedItems.value.length < filteredItems.value.length);
        const remainingCount = computed(() => filteredItems.value.length - displayedItems.value.length);

        // ==================== 方法 ====================
        const loadMore = () => { currentPage.value++; };

        const toggleTag = (tag) => {
            const i = selectedTags.value.indexOf(tag);
            if (i > -1) selectedTags.value.splice(i, 1);
            else selectedTags.value.push(tag);
        };

        watch([selectedTags, matchMode], () => { currentPage.value = 1; }, { deep: true });

        const allTags = computed(() => {
            const s = new Set();
            items.value.forEach(v => v.tags.forEach(t => s.add(t)));
            return Array.from(s).sort();
        });

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

        const exitSingleMode = () => window.location.href = 'index.html';

        // WhatsApp 功能
        const shareToFriend = (item) => {
            const content = `https://oklaw2025.github.io/callme/index.html?id=${item.id}`;
            const text = encodeURIComponent(`搵樓！搵我 O.K.LAW！\n\n🔥 推薦單位：${item.title}\n${content}\n\n有興趣可以聯絡：9570 5738`);
            window.open(`https://wa.me/?text=${text}`, '_blank');
        };

        const inquireDetail = (item) => {
            const content = `https://oklaw2025.github.io/callme/index.html?id=${item.id}`;
            const text = encodeURIComponent(`你好 O.K.LAW，\n\n我想查詢以下單位詳情：\n${item.title}\n${content}\n\n請提供價錢、面積、睇樓時間等資料，謝謝！`);
            window.open(`https://wa.me/85295705738?text=${text}`, '_blank');
        };

        return { 
            currentTheme, themes, selectedTags, allTags, toggleTag, matchMode,
            displayedItems, filteredItems, hasMore, loadMore, remainingCount,
            singleItemMode, currentItem, exitSingleMode,
            shareToFriend, inquireDetail,
            gallery, openGallery, closeGallery, nextImg, prevImg
        };
    }
}).mount('#app');
