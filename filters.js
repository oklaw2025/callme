// filters.js - 篩選相關邏輯
window.createFilters = function(items, selectedTags, matchMode) {
    // 排除不應成為篩選條件的標籤
    const excludedPrefixes = ['樓盤編號:', '日期:'];

    const isExcludedTag = (tag) => {
        return excludedPrefixes.some(prefix => tag.startsWith(prefix));
    };

    const filteredItems = Vue.computed(() => {
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

    const availableTags = Vue.computed(() => {
        const allPossible = new Set();

        // 1. 始終保留已選的標籤（重要修改）
        selectedTags.value.forEach(tag => {
            if (!isExcludedTag(tag)) {
                allPossible.add(tag);
            }
        });

        // 2. 加入可繼續添加的標籤
        if (matchMode.value === 'OR' || selectedTags.value.length === 0) {
            // OR 模式或沒有選擇時，顯示所有可用標籤
            items.value.forEach(item => {
                item.tags.forEach(t => {
                    if (!isExcludedTag(t)) {
                        allPossible.add(t);
                    }
                });
            });
        } else {
            // AND 模式：顯示目前已匹配的項目中還沒選的標籤
            items.value.forEach(item => {
                const currentlyMatched = selectedTags.value.every(t => item.tags.includes(t));
                if (currentlyMatched) {
                    item.tags.forEach(t => {
                        if (!isExcludedTag(t)) {
                            allPossible.add(t);
                        }
                    });
                }
            });
        }

        return Array.from(allPossible);
    });

    const groupedTags = Vue.computed(() => {
        const groups = { floor: [], price: [], area: [], others: [] };

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

        Object.keys(groups).forEach(key => groups[key].sort());
        return groups;
    });

    return { filteredItems, groupedTags };
};
