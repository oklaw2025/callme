// logic.js - 核心邏輯管理器
const { createApp, ref, computed, watch } = Vue;

createApp({
    setup() {
        // ==================== 主題切換 (已優化) ====================
        const currentTheme = ref('theme-light');

        const themes = {
            
            'theme-light': '極簡白晝',
            'theme-cyber': '幻彩紫羅蘭',
            'theme-default': '科技深藍',
            'theme-forest': '翡翠森林',
            'theme-luxury': '玫瑰金奢華'
        };

        // 主題切換監聽 + 持久化
        watch(currentTheme, (newTheme) => {
            localStorage.setItem('oklaw-theme', newTheme);
            document.documentElement.setAttribute('data-theme', newTheme);
        }, { immediate: true });

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

        // 篩選後結果
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

        const displayedItems = computed(() => {
            return filteredItems.value.slice(0, currentPage.value * pageSize);
        });

        const hasMore = computed(() => displayedItems.value.length < filteredItems.value.length);
        const remainingCount = computed(() => filteredItems.value.length - displayedItems.value.length);

        const loadMore = () => { currentPage.value++; };

        watch([selectedTags, matchMode], () => { 
            currentPage.value = 1; 
        }, { deep: true });

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

        // 燈箱功能
        const openGallery = (item) => {
            gallery.value.images = item.images;
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

        // 分享功能
        const shareWhatsApp = (item) => {
            const content = item.type === 'video' ? `影片：${item.videoUrl}` : `相片盤源`;
            const text = encodeURIComponent(`搵樓！搵我O.K.LAW！\n單位：${item.title}\n${content}\n電話：95705738`);
            window.open(`https://wa.me/?text=${text}`, '_blank');
        };

        const shareWeChat = (item) => {
            const dummy = document.createElement('textarea');
            document.body.appendChild(dummy);
            dummy.value = `搵樓！搵O.K.LAW 幫到手!\n單位：${item.title}\n電話：95705738`;
            dummy.select();
            document.execCommand('copy');
            document.body.removeChild(dummy);
            alert('✅ 已複製推薦文字，請貼上至微信！');
        };
                // 分享給朋友（原本的分享功能）
        const shareToFriend = (item) => {
            const content = item.type === 'video' 
                ? `影片：${item.videoUrl}` 
                : `相片盤源（共 ${item.images ? item.images.length : 0} 張）`;
            
            const text = encodeURIComponent(
                `搵樓！搵我 O.K.LAW！\n\n` +
                `🔥 推薦單位：${item.title}\n` +
                `${content}\n\n` +
                `有興趣可以聯絡：5409 3210`
            );
            
            window.open(`https://wa.me/?text=${text}`, '_blank');
        };
        
        // 直接查詢詳情（聯絡你本人）
        const inquireDetail = (item) => {
            const content = item.type === 'video' 
                ? `影片：${item.videoUrl}` 
                : `相片盤源（共 ${item.images ? item.images.length : 0} 張）`;
            
            const text = encodeURIComponent(
                `你好 O.K.LAW，\n\n` +
                `我想查詢呢個單位詳情：\n` +
                `${item.title}\n` +
                `${content}\n\n` +
                `請提供價錢、面積、睇樓時間等資料，謝謝！`
            );
            
            window.open(`https://wa.me/85254093210?text=${text}`, '_blank');
        };

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
            shareToFriend,     // 新增
            inquireDetail,     // 新增
            //shareWhatsApp, 
            //shareWeChat,
            gallery, 
            openGallery, 
            closeGallery, 
            nextImg, 
            prevImg
        };
    }
}).mount('#app');
