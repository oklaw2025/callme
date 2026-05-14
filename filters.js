// filters.js - 篩選相關邏輯
window.createFilters = function(items, selectedTags, matchMode, priceRange, areaRange) {
    const excludedPrefixes = ['樓盤編號:', '日期:'];

    const isExcludedTag = (tag) => excludedPrefixes.some(prefix => tag.startsWith(prefix));

    const filteredItems = Vue.computed(() => {
        let result = [...items.value];

        // Tag 篩選（樓層 + 其他）
        if (selectedTags.value.length > 0) {
            result = result.filter(item => {
                if (matchMode.value === 'AND') {
                    return selectedTags.value.every(t => item.tags.includes(t));
                } else {
                    return selectedTags.value.some(t => item.tags.includes(t));
                }
            });
        }

        // 價格範圍
        if (priceRange.value.min !== null || priceRange.value.max !== null) {
            result = result.filter(item => {
                const p = item.price;
                if (priceRange.value.min !== null && p < priceRange.value.min) return false;
                if (priceRange.value.max !== null && p > priceRange.value.max) return false;
                return true;
            });
        }

        // 面積範圍
        if (areaRange.value.min !== null || areaRange.value.max !== null) {
            result = result.filter(item => {
                const a = item.area;
                if (areaRange.value.min !== null && a < areaRange.value.min) return false;
                if (areaRange.value.max !== null && a > areaRange.value.max) return false;
                return true;
            });
        }

        return result.sort((a, b) => b.id - a.id);
    });

    const availableTags = Vue.computed(() => {
        const allPossible = new Set();

        selectedTags.value.forEach(tag => {
            if (!isExcludedTag(tag)) allPossible.add(tag);
        });

        if (matchMode.value === 'OR' || selectedTags.value.length === 0) {
            items.value.forEach(item => {
                item.tags.forEach(t => {
                    if (!isExcludedTag(t)) allPossible.add(t);
                });
            });
        } else {
            items.value.forEach(item => {
                const currentlyMatched = selectedTags.value.every(t => item.tags.includes(t));
                if (currentlyMatched) {
                    item.tags.forEach(t => {
                        if (!isExcludedTag(t)) allPossible.add(t);
                    });
                }
            });
        }

        return Array.from(allPossible);
    });

    const groupedTags = Vue.computed(() => {
        const groups = { floor: [], others: [] };

        availableTags.value.forEach(tag => {
            if (['層', '低層', '高層', '中層'].some(k => tag.includes(k))) {
                groups.floor.push(tag);
            } else {
                groups.others.push(tag);
            }
        });

        Object.keys(groups).forEach(key => groups[key].sort());
        return groups;
    });

    return { filteredItems, groupedTags };
};
