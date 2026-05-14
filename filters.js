// filters.js - 篩選相關邏輯
window.createFilters = function(items, selectedTags, matchMode) {
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
        if (matchMode.value === 'OR' || selectedTags.value.length === 0) {
            const all = new Set();
            items.value.forEach(item => item.tags.forEach(t => all.add(t)));
            return Array.from(all);
        }

        const possible = new Set();
        items.value.forEach(item => {
            const currentlyMatched = selectedTags.value.every(t => item.tags.includes(t));
            if (currentlyMatched) {
                item.tags.forEach(t => {
                    if (!selectedTags.value.includes(t)) possible.add(t);
                });
            }
        });
        return Array.from(possible);
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
