document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    if (path.endsWith('index.html') || path === '/') {
        loadCategories();
    } else if (path.endsWith('category.html')) {
        loadCategoryVideos();
    }
});

function loadCategories() {
    // Get the base URL for GitHub Pages
    const baseUrl = window.location.pathname.includes('HippoDash') ? '/HippoDash' : '';
    fetch(`${baseUrl}/data.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const categoryGrid = document.getElementById('category-grid');
            data.categories.forEach((category, index) => {
                const categoryDiv = document.createElement('div');
                categoryDiv.className = 'category';
                categoryDiv.addEventListener('click', () => {
                    window.location.href = `${baseUrl}/category.html?category=${index}`;
                });
                const categoryTitle = document.createElement('h2');
                categoryTitle.textContent = category.name;
                categoryDiv.appendChild(categoryTitle);
                categoryGrid.appendChild(categoryDiv);
            });
        })
        .catch(error => {
            console.error('Error loading categories:', error);
            document.getElementById('category-grid').innerHTML = 
                '<div class="error">שגיאה בטעינת הקטגוריות. אנא נסה שוב מאוחר יותר.</div>';
        });
}

function loadCategoryVideos() {
    const baseUrl = window.location.pathname.includes('HippoDash') ? '/HippoDash' : '';
    const urlParams = new URLSearchParams(window.location.search);
    const categoryIndex = urlParams.get('category');
    
    fetch(`${baseUrl}/data.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const category = data.categories[categoryIndex];
            if (!category) {
                throw new Error('Category not found');
            }
            const categoryTitle = document.getElementById('category-title');
            categoryTitle.textContent = category.name;
            const videoGrid = document.getElementById('video-grid');
            
            // Create video containers with click handlers
            category.videos.slice(0, 8).forEach((video, index) => {
                const videoContainer = document.createElement('div');
                videoContainer.className = 'video-category';
                videoContainer.dataset.videoId = video;
                
                const iframe = document.createElement('iframe');
                iframe.src = `https://www.youtube.com/embed/${video}?autoplay=${index < 2 ? '1' : '0'}&mute=1`;
                iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
                iframe.allowFullscreen = true;
                
                videoContainer.appendChild(iframe);
                videoGrid.appendChild(videoContainer);
                
                // Add click handler only for videos after the first two
                if (index >= 2) {
                    videoContainer.addEventListener('click', () => swapVideo(videoContainer));
                }
            });
        })
        .catch(error => {
            console.error('Error loading videos:', error);
            document.getElementById('video-grid').innerHTML = 
                '<div class="error">שגיאה בטעינת הסרטונים. אנא נסה שוב מאוחר יותר.</div>';
        });
}

function swapVideo(clickedContainer) {
    const videoGrid = document.getElementById('video-grid');
    const firstVideo = videoGrid.children[0];
    const secondVideo = videoGrid.children[1];
    const clickedVideo = clickedContainer;
    const clickedVideoId = clickedContainer.dataset.videoId;
    
    // Store the original positions and IDs
    const firstVideoId = firstVideo.dataset.videoId;
    const secondVideoId = secondVideo.dataset.videoId;
    
    // Update iframes with new video IDs
    firstVideo.querySelector('iframe').src = `https://www.youtube.com/embed/${clickedVideoId}?autoplay=1&mute=1`;
    secondVideo.querySelector('iframe').src = `https://www.youtube.com/embed/${firstVideoId}?autoplay=1&mute=1`;
    clickedContainer.querySelector('iframe').src = `https://www.youtube.com/embed/${secondVideoId}?autoplay=0&mute=1`;
    
    // Update data attributes
    firstVideo.dataset.videoId = clickedVideoId;
    secondVideo.dataset.videoId = firstVideoId;
    clickedContainer.dataset.videoId = secondVideoId;
    
    // Scroll to top smoothly
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}