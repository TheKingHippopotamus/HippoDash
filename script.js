document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    if (path.endsWith('index.html') || path === '/') {
        loadCategories();
    } else if (path.endsWith('category.html')) {
        loadCategoryVideos();
    }
});

function loadCategories() {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            const categoryGrid = document.getElementById('category-grid');
            data.categories.forEach((category, index) => {
                const categoryDiv = document.createElement('div');
                categoryDiv.className = 'category';
                categoryDiv.addEventListener('click', () => {
                    window.location.href = `category.html?category=${index}`;
                });
                const categoryTitle = document.createElement('h2');
                categoryTitle.textContent = category.name;
                categoryDiv.appendChild(categoryTitle);
                categoryGrid.appendChild(categoryDiv);
            });
        });
}

function loadCategoryVideos() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryIndex = urlParams.get('category');
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            const category = data.categories[categoryIndex];
            const categoryTitle = document.getElementById('category-title');
            categoryTitle.textContent = category.name;
            const videoGrid = document.getElementById('video-grid');
            category.videos.slice(0, 8).forEach(video => {
                const categoryDiv = document.createElement('div');
                categoryDiv.className = 'video-category';
                const iframe = document.createElement('iframe');
                iframe.src = `https://www.youtube.com/embed/${video}`;
                iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
                iframe.allowFullscreen = true;
                categoryDiv.appendChild(iframe);
                videoGrid.appendChild(categoryDiv);
            });
        });
}