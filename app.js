// Data Models & Store
const State = {
    walks: JSON.parse(localStorage.getItem('pawsteps_walks')) || [
        {
            id: 1,
            username: '초코엄마',
            mood: 'happy',
            distance: 3.2,
            tags: ['킁킁', '풍경'],
            image: 'assets/dog_walk_happy_1783390275275.png',
            note: '오늘따라 낙엽 냄새를 아주 오래 맡았어요. 가을이 오나 봐요.',
            cheers: 12,
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
        },
        {
            id: 2,
            username: '리트리버즈',
            mood: 'energetic',
            distance: 5.5,
            tags: ['우다다', '친구만남'],
            image: 'assets/dog_walk_energetic_1783390294434.png',
            note: '한강 공원 달리기! 다른 강아지 친구들도 많이 만났습니다.',
            cheers: 24,
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString()
        }
    ],
    selectedTags: []
};

const saveToLocalStorage = () => {
    localStorage.setItem('pawsteps_walks', JSON.stringify(State.walks));
};

// UI Elements
const feed = document.getElementById('feed');
const modal = document.getElementById('modal');
const walkForm = document.getElementById('walk-form');
const addBtn = document.getElementById('add-walk-btn');
const closeBtn = document.getElementById('close-modal');
const tagChips = document.querySelectorAll('.tag-chip');

// Helpers
const getMoodEmoji = (mood) => {
    const emojis = { happy: '😊', energetic: '🐕', calm: '🌿', curious: '🧐' };
    return emojis[mood] || '🐾';
};

const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
};

const getRandomImageByMood = (mood) => {
    const images = {
        happy: 'assets/dog_walk_happy_1783390275275.png',
        calm: 'assets/dog_walk_calm_1783390284529.png',
        energetic: 'assets/dog_walk_energetic_1783390294434.png',
        curious: 'assets/dog_walk_happy_1783390275275.png'
    };
    return images[mood] || images.happy;
};

// Render Logic
const renderFeed = () => {
    feed.innerHTML = '';
    
    [...State.walks].reverse().forEach(walk => {
        const card = document.createElement('div');
        card.className = 'walk-card';
        card.innerHTML = `
            <div class="card-header">
                <div class="user-info">
                    <div class="avatar"></div>
                    <div>
                        <div class="username">${walk.username}</div>
                        <div class="timestamp">${formatTime(walk.timestamp)}</div>
                    </div>
                </div>
                <div class="mood-badge">${getMoodEmoji(walk.mood)}</div>
            </div>
            
            ${walk.image ? `
                <div class="card-image">
                    <img src="${walk.image}" alt="산책 순간">
                </div>
            ` : ''}

            <div class="card-tags">
                ${(walk.tags || []).map(tag => `<span class="tag-badge">#${tag}</span>`).join('')}
            </div>

            <div class="card-content">
                <p>${walk.note}</p>
            </div>

            <div class="card-stats">
                <div class="stat-item"><span>📍</span> ${walk.distance}km</div>
            </div>

            <div class="card-actions">
                <button class="cheer-btn" data-id="${walk.id}">
                    ❤️ 응원하기 <span>${walk.cheers || 0}</span>
                </button>
            </div>
        `;
        feed.appendChild(card);
    });

    // Add event listeners to cheer buttons
    document.querySelectorAll('.cheer-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.currentTarget.dataset.id);
            const walk = State.walks.find(w => w.id === id);
            if (walk) {
                walk.cheers = (walk.cheers || 0) + 1;
                e.currentTarget.classList.add('active');
                e.currentTarget.querySelector('span').textContent = walk.cheers;
                saveToLocalStorage();
            }
        });
    });
};

// Event Listeners
tagChips.forEach(chip => {
    chip.addEventListener('click', () => {
        chip.classList.toggle('active');
        const tag = chip.dataset.tag;
        if (State.selectedTags.includes(tag)) {
            State.selectedTags = State.selectedTags.filter(t => t !== tag);
        } else {
            State.selectedTags.push(tag);
        }
    });
});

addBtn.addEventListener('click', () => {
    modal.classList.remove('hidden');
    setTimeout(() => modal.classList.add('visible'), 10);
});

closeBtn.addEventListener('click', () => {
    modal.classList.remove('visible');
    setTimeout(() => modal.classList.add('hidden'), 300);
    // Reset tags
    tagChips.forEach(c => c.classList.remove('active'));
    State.selectedTags = [];
});

walkForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const mood = document.getElementById('mood').value;
    const newWalk = {
        id: Date.now(),
        username: '나',
        mood: mood,
        distance: document.getElementById('distance').value,
        tags: [...State.selectedTags],
        image: getRandomImageByMood(mood),
        note: document.getElementById('note').value,
        cheers: 0,
        timestamp: new Date().toISOString()
    };
    
    State.walks.push(newWalk);
    saveToLocalStorage();
    renderFeed();
    
    // Close modal
    closeBtn.click();
    walkForm.reset();
});

// Init
renderFeed();
