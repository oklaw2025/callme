// logic.js - 核心邏輯管理器
const { createApp, ref, computed, watch } = Vue;

createApp({
    setup() {
        // 1. 風格切換狀態
        const currentTheme = ref('theme-default');
        const themes = {
            'theme-default': '科技深藍',
            'theme-forest': '翡翠森林',
            'theme-luxury': '玫瑰金奢華',
            'theme-light': '極簡白晝',
            'theme-cyber': '幻彩紫羅蘭'
        };

        // 2. 數據與篩選狀態 (rawItems 來自 data.js)
        const items = ref(rawItems);
        const selectedTags = ref([]);
        const matchMode = ref('OR');
        const pageSize = 6;
        const currentPage = ref(1);

        // 3. 圖片查看器 (Gallery/Lightbox) 狀態
        const gallery = ref({ 
            isOpen: false, 
            images: [], 
            index: 0 
        });

        // 4. 計算屬性：篩選後的結果
        const filteredItems = computed(() => {
            let result = [...items.value];
            if (selectedTags.value.length > 0) {
                result = result.filter(v => {
                    return matchMode.value === 'AND' 
                        ? selectedTags.value.every(t => v.tags.includes(t))
                        : selectedTags.value.some(t => v.tags.includes(t));
                });
            }
            // ID 越大越先顯示
            return result.sort((a, b) => b.id - a.id);
        });

        // 5. 計算屬性：分頁顯示
        const displayedItems = computed(() => {
            return filteredItems.value.slice(0, currentPage.value * pageSize);
        });

        const hasMore = computed(() => {
            return displayedItems.value.length < filteredItems.value.length;
        });

        const remainingCount = computed(() => {
            return filteredItems.value.length - displayedItems.value.length;
        });

        const loadMore = () => { 
            currentPage.value++; 
        };

        // 監聽篩選條件，改變時重置頁碼
        watch([selectedTags, matchMode], () => { 
            currentPage.value = 1; 
        }, { deep: true });

        // 6. 計算屬性：提取所有不重複標籤
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

        // 7. 圖片查看器方法
        const openGallery = (item) => {
            gallery.value.images = item.images;
            gallery.value.index = 0;
            gallery.value.isOpen = true;
            document.body.style.overflow = 'hidden'; // 鎖定滾動
        };

        const closeGallery = () => {
            gallery.value.isOpen = false;
            document.body.style.overflow = 'auto'; // 恢復滾動
        };

        const nextImg = () => {
            gallery.value.index = (gallery.value.index + 1) % gallery.value.images.length;
        };

        const prevImg = () => {
            gallery.value.index = (gallery.value.index - 1 + gallery.value.images.length) % gallery.value.images.length;
        };

        // 8. 分享功能
        const shareWhatsApp = (item) => {
            const content = item.type === 'video' ? `影片：${item.videoUrl}` : `(精選相片盤源)`;
            const text = encodeURIComponent(`搵樓！搵我O.K.LAW！\n單位：${item.title}\n${content}\n電話：54093210`);
            window.open(`https://wa.me/?text=${text}`, '_blank');
        };

        const shareWeChat = (item) => {
            const dummy = document.createElement('textarea');
            document.body.appendChild(dummy);
            dummy.value = `搵樓！O.K.LAW 幫到手!\n單位：${item.title}\n電話：54093210`;
            dummy.select();
            document.execCommand('copy');
            document.body.removeChild(dummy);
            alert('已複製推薦語，請貼上至微信！');
        };

        return { 
            currentTheme, themes, selectedTags, allTags, toggleTag, matchMode, 
            displayedItems, filteredItems, hasMore, loadMore, remainingCount,
            shareWhatsApp, shareWeChat,
            gallery, openGallery, closeGallery, nextImg, prevImg
        };
    }
}).mount('#app');
