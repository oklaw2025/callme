// utils.js - 共用工具函數
window.createUtils = function() {
    const openGallery = (gallery, item) => {
        gallery.value.images = item.images || [];
        gallery.value.index = 0;
        gallery.value.isOpen = true;
        document.body.style.overflow = 'hidden';
    };

    const closeGallery = (gallery) => {
        gallery.value.isOpen = false;
        document.body.style.overflow = 'auto';
    };

    const nextImg = (gallery) => {
        gallery.value.index = (gallery.value.index + 1) % gallery.value.images.length;
    };

    const prevImg = (gallery) => {
        gallery.value.index = (gallery.value.index - 1 + gallery.value.images.length) % gallery.value.images.length;
    };

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

    return { openGallery, closeGallery, nextImg, prevImg, shareToFriend, inquireDetail };
};
