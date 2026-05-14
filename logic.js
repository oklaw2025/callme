// logic.js - 修復版（解決 undefined length 錯誤）
const { createApp, ref, computed, watch } = Vue;

createApp({
    setup() {
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

        const urlParams = new URLSearchParams(window.location.search);
        const singleId = urlParams.get('id') ? parseInt(urlParams.get('id')) : null;
        
        const singleItemMode = ref(!!singleId);
        const currentItem = ref(null);

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
                } else if (item.type === 'images' && item.images) {
                    processed.images = [...item.images];
                }
                return processed;
            });
        };

        items.value = processRawItems();

        if (singleId) {
            currentItem.value = items.value.find(item => item.id === singleId);
        }

        // ==================== 篩選狀態 ====================
        const selectedTags = ref([]);
        const matchMode = ref('OR');

        const areaMin = ref(0);
        const areaMax = ref(2000);
        const priceMin = ref(0);
        const priceMax = ref(5000);

        const pageSize = 6;
        const currentPage = ref(1);

        const gallery = ref({ isOpen: false, images: [], index: 0 });

        const isExcludedTag = (tag) => tag.includes('樓盤編號:') || tag.includes('日期:');

        const allTags = computed(() => {
            const s = new Set();
            items.value.forEach(v => {
                if (v.tags) {
                    v.tags.forEach(t => {
                        if (!isExcludedTag(t)) s.add(t);
                    });
                }
            });
            return Array.from(s).sort();
        });

        const groupedTags = computed(() => {
            const groups = { floor: [], others: [] };
            allTags.value.forEach(tag => {
                if (tag.endsWith('層')) {
                    groups.floor.push(tag);
                } else if (!tag.endsWith('萬') && !tag.endsWith('呎')) {
                    groups.others.push(tag);
                }
            });
            return groups;
        });

        // ==================== 篩選邏輯 ====================
        const filteredItems = computed(() => {
            if (singleItemMode.value) return [];

            let result = [...items.value];

            if (selectedTags.value.length > 0) {
                result = result.filter(v => {
                    if (!v.tags) return false;
                    return matchMode.value === 'AND' 
                        ? selectedTags.value.every(t => v.tags.includes(t))
                        : selectedTags.value.some(t => v.tags.includes(t));
                });
            }

            // 面積篩選
            result = result.filter(item => {
                if (!item.tags) return true;
                const areaTag = item.tags.find(t => t.endsWith('呎'));
                if (!areaTag) return true;
                const area = parseInt(areaTag) || 0;
                return area >= areaMin.value && area <= areaMax.value;
            });

            // 價格篩選
            result = result.filter(item => {
                if (!item.tags) return true;
                const priceTag = item.tags.find(t => t.endsWith('萬'));
                if (!priceTag) return true;
                const price = parseInt(priceTag) || 0;
                return price >= priceMin.value && price <= priceMax.value;
            });

            return result.sort((a, b) => b.id - a.id);
        });

        const displayedItems = computed(() => filteredItems.value.slice(0, currentPage.value * pageSize));
        const hasMore = computed(() => displayedItems.value.length < filteredItems.value.length);
        const remainingCount = computed(() => filteredItems.value.length - displayedItems.value.length);

        const loadMore = () => { currentPage.value++; };

        const toggleTag = (tag) => {
            const i = selectedTags.value.indexOf(tag);
            if (i > -1) selectedTags.value.splice(i, 1);
            else selectedTags.value.push(tag);
        };

        const resetFilters = () => {
            selectedTags.value = [];
            areaMin.value = 0;
            areaMax.value = 2000;
            priceMin.value = 0;
            priceMax.value = 5000;
            currentPage.value = 1;
        };

        watch([selectedTags, matchMode, areaMin, areaMax, priceMin, priceMax], () => {
            currentPage.value = 1;
        }, { deep: true });

        // 燈箱（加強防護）
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
            const len = gallery.value.images ? gallery.value.images.length : 0;
            if (len > 0) gallery.value.index = (gallery.value.index + 1) % len;
        };

        const prevImg = () => {
            const len = gallery.value.images ? gallery.value.images.length : 0;
            if (len > 0) gallery.value.index = (gallery.value.index - 1 + len) % len;
        };

        const exitSingleMode = () => { window.location.href = 'index.html'; };

        const shareToFriend = (item) => {
            const content = `https://oklaw2025.github.io/callme/index.html?id=${item.id}`;
            const text = encodeURIComponent(`搵樓！搵我 O.K.LAW！\n\n🔥 推薦單位：${item.title}\n${content}\n\n聯絡：9570 5738`);
            window.open(`https://wa.me/?text=${text}`, '_blank');
        };

        const inquireDetail = (item) => {
            const content = `https://oklaw2025.github.io/callme/index.html?id=${item.id}`;
            const text = encodeURIComponent(`你好 O.K.LAW，\n\n我想查詢以下單位詳情：\n${item.title}\n${content}\n\n請提供詳情，謝謝！`);
            window.open(`https://wa.me/85295705738?text=${text}`, '_blank');
        };

        return { 
            currentTheme, themes,
            selectedTags, groupedTags, toggleTag, matchMode,
            areaMin, areaMax, priceMin, priceMax, resetFilters,
            displayedItems, filteredItems, hasMore, loadMore, remainingCount,
            singleItemMode, currentItem, exitSingleMode,
            shareToFriend, inquireDetail,
            gallery, openGallery, closeGallery, nextImg, prevImg
        };
    }
}).mount('#app');
