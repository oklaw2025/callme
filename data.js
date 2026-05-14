// data.js
const rawItems = [
                { 
                    id: 14, 
                    type: 'images', 
                    title: '迎豐', 
                    tags: ['宋王臺站', '1房高層', '271呎', '520萬', '樓盤編號:002451', '日期:14/5/2026'], 
                    baseFolder: 'id14',     // ← 關鍵：資料夾名稱
                    numPhotos: 7,           // ← 圖片數量（實際有多少張就填多少，建議比實際多1-2張也沒關係）
                    videoUrl: ''
                },
               {   
                    id: 13, 
                    type: 'images', 
                    title: '城軒', 
                    tags: ['美善同道', '2房梗廚高層', '510呎', '1100萬', '樓盤編號:002551', '日期:14/5/2026'], 
                    baseFolder: 'id13',     // ← 關鍵：資料夾名稱
                    numPhotos: 7,           // ← 圖片數量（實際有多少張就填多少，建議比實際多1-2張也沒關係）
                    videoUrl: ''
                },
                {   
                    id: 1, 
                    type: 'video', 
                    title: '10沙田複式戶', 
                    tags: ['豪宅', '特色戶'], 
                    videoUrl: 'https://youtu.be/cFKQCfP5sZA', 
                    embedCode: '<iframe src="https://www.youtube.com/embed/cFKQCfP5sZA"></iframe>' 
                }, 
                { 
                    id: 2, 
                    type: 'images', 
                    title: '【全新】九龍塘三房實拍', 
                    tags: ['九龍塘', '三房', '全新裝修'], 
                    images: 
                    [
                        'https://oklaw2025.github.io/callme/id2/1.jpg',
                        'https://oklaw2025.github.io/callme/id2/2.jpg',
                        
  
                    ],
                    videoUrl: '' // 圖片模式可留空
                },
                  { 
                    id: 3, 
                    type: 'images', 
                    title: '【全新】九龍塘三房實拍', 
                    tags: ['九龍塘', '三房', '全新裝修'], 
                    images: 
                    [
                        'https://oklaw2025.github.io/callme/photo1.jpg',
                        'https://oklaw2025.github.io/callme/photo1.jpg',
                        'https://oklaw2025.github.io/callme/photo1.jpg',
  
                    ],
                    videoUrl: '' // 圖片模式可留空
                },
                  { 
                    id: 4, 
                    type: 'images', 
                    title: '【全新】九龍塘三房實拍', 
                    tags: ['九龍塘', '三房', '全新裝修'], 
                    images: 
                    [
                        'https://oklaw2025.github.io/callme/photo1.jpg',
                        'https://oklaw2025.github.io/callme/photo1.jpg',
                        'https://oklaw2025.github.io/callme/photo1.jpg',
  
                    ],
                    videoUrl: '' // 圖片模式可留空
                },
                  { 
                    id: 5, 
                    type: 'images', 
                    title: '【全新】九龍塘三房實拍', 
                    tags: ['九龍塘', '三房', '全新裝修'], 
                    images: 
                    [
                        'https://oklaw2025.github.io/callme/photo1.jpg',
                        'https://oklaw2025.github.io/callme/photo1.jpg',
                        'https://oklaw2025.github.io/callme/photo1.jpg',
  
                    ],
                    videoUrl: '' // 圖片模式可留空
                },
                  { 
                    id: 6, 
                    type: 'images', 
                    title: '【全新】九龍塘三房實拍', 
                    tags: ['九龍塘', '三房', '全新裝修'], 
                    images: 
                    [
                        'https://oklaw2025.github.io/callme/photo1.jpg',
                        'https://oklaw2025.github.io/callme/photo1.jpg',
                        'https://oklaw2025.github.io/callme/photo1.jpg',
  
                    ],
                    videoUrl: '' // 圖片模式可留空
                },
                  { 
                    id: 7, 
                    type: 'images', 
                    title: '【全新】九龍塘三房實拍', 
                    tags: ['九龍塘', '三房', '全新裝修'], 
                    images: 
                    [
                        'https://oklaw2025.github.io/callme/photo1.jpg',
                        'https://oklaw2025.github.io/callme/photo1.jpg',
                        'https://oklaw2025.github.io/callme/photo1.jpg',
  
                    ],
                    videoUrl: '' // 圖片模式可留空
                },
                  { 
                    id: 8, 
                    type: 'images', 
                    title: '【全新】九龍塘三房實拍', 
                    tags: ['九龍塘', '三房', '全新裝修'], 
                    images: 
                    [
                        'https://oklaw2025.github.io/callme/photo1.jpg',
                        'https://oklaw2025.github.io/callme/photo1.jpg',
                        'https://oklaw2025.github.io/callme/photo1.jpg',
  
                    ],
                    videoUrl: '' // 圖片模式可留空
                },
                  { 
                    id: 9, 
                    type: 'images', 
                    title: '【全新】九龍塘三房實拍', 
                    tags: ['九龍塘', '三房', '全新裝修'], 
                    images: 
                    [
                        'https://oklaw2025.github.io/callme/photo1.jpg',
                        'https://oklaw2025.github.io/callme/photo1.jpg',
                        'https://oklaw2025.github.io/callme/photo1.jpg',
  
                    ],
                    videoUrl: '' // 圖片模式可留空
                },
                  { 
                    id: 10, 
                    type: 'images', 
                    title: '【全新】九龍塘三房實拍', 
                    tags: ['九龍塘', '三房', '全新裝修'], 
                    images: 
                    [
                        'https://oklaw2025.github.io/callme/photo1.jpg',
                        'https://oklaw2025.github.io/callme/photo1.jpg',
                        'https://oklaw2025.github.io/callme/photo1.jpg',
  
                    ],
                    videoUrl: '' // 圖片模式可留空
                },
                  { 
                    id: 11, 
                    type: 'images', 
                    title: '【全新】九龍塘三房實拍', 
                    tags: ['九龍塘', '三房', '全新裝修'], 
                    images: 
                    [
                        'https://oklaw2025.github.io/callme/photo1.jpg',
                        'https://oklaw2025.github.io/callme/photo1.jpg',
                        'https://oklaw2025.github.io/callme/photo1.jpg',
  
                    ],
                    videoUrl: '' // 圖片模式可留空
                },
                  { 
                    id: 12, 
                    type: 'images', 
                    title: '【全新】九龍塘三房實拍', 
                    tags: ['九龍塘', '三房', '全新裝修'], 
                    images: 
                    [
                        'https://oklaw2025.github.io/callme/photo1.jpg',
                        'https://oklaw2025.github.io/callme/photo1.jpg',
                        'https://oklaw2025.github.io/callme/photo1.jpg',
  
                    ],
                    videoUrl: '' // 圖片模式可留空
                },
];
