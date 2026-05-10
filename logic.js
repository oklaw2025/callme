// logic.js - 優化後的主題切換
setup() {
    // ==================== 主題切換優化 ====================
    const currentTheme = ref(localStorage.getItem('oklaw-theme') || 'theme-default');

    const themes = {
        'theme-default': '科技深藍',
        'theme-forest': '翡翠森林',
        'theme-luxury': '玫瑰金奢華',
        'theme-light': '極簡白晝',
        'theme-cyber': '幻彩紫羅蘭'
    };

    // 監聽並保存到 localStorage + 強制套用
    watch(currentTheme, (newTheme) => {
        localStorage.setItem('oklaw-theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        document.body.style.backgroundColor = ''; // 清除 Tailwind 殘留
    }, { immediate: true });

    // ==================== 其餘程式碼保持不變 ====================
    const items = ref(rawItems);
    const selectedTags = ref([]);
    const matchMode = ref('OR');
    const pageSize = 6;
    const currentPage = ref(1);

    const gallery = ref({ 
        isOpen: false, 
        images: [], 
        index: 0 
    });

    const filteredItems = computed(() => {
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

    const displayedItems = computed(() => 
        filteredItems.value.slice(0, currentPage.value * pageSize)
    );

    const hasMore = computed(() => displayedItems.value.length < filteredItems.value.length);
    const remainingCount = computed(() => filteredItems.value.length - displayedItems.value.length);

    const loadMore = () => currentPage.value++;

    watch([selectedTags, matchMode], () => currentPage.value = 1, { deep: true });

    const allTags = computed(() => {
        const s = new Set();
        items.value.forEach(v => v.tags.forEach(t => s.add(t)));
        return Array.from(s).sort();
    });

    const toggleTag = (tag) => {
        const i = selectedTags.value.indexOf(tag);
        if (i > -1) selectedTags.value.splice(i, 1);
        else selectedTags.value.push(tag);
    };

    // 圖片燈箱與分享功能保持不變...
    const openGallery = (item) => { /* ... */ };
    const closeGallery = () => { /* ... */ };
    const nextImg = () => { /* ... */ };
    const prevImg = () => { /* ... */ };
    const shareWhatsApp = (item) => { /* ... */ };
    const shareWeChat = (item) => { /* ... */ };

    return { 
        currentTheme, 
        themes, 
        selectedTags, 
        allTags, 
        toggleTag, 
        matchMode, 
        displayedItems, 
        filteredItems, 
        hasMore, 
        loadMore, 
        remainingCount,
        shareWhatsApp, 
        shareWeChat,
        gallery, 
        openGallery, 
        closeGallery, 
        nextImg, 
        prevImg
    };
}
