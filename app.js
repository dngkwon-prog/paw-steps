// Data Models & Store
const State = {
    walks: JSON.parse(localStorage.getItem('pawsteps_walks')) || [
        {
            id: 1,
            username: 'CHOCO_MOM',
            mood: 'happy',
            distance: 3.2,
            tags: ['SCENT', 'VIEW'],
            image: 'assets/dog_walk_happy_1783390275275.png',
            note: 'The scent of autumn leaves was particularly strong today. Feels like winter is coming.',
            cheers: 12,
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
        },
        {
            id: 2,
            username: 'RETRIEVER_CREW',
            mood: 'energetic',
            distance: 5.5,
            tags: ['RUN', 'FRIEND'],
            image: 'assets/dog_walk_energetic_1783390294434.png',
            note: 'Running at Han River! Met so many furry friends today.',
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
const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).toUpperCase();
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
                <span class="username">${walk.username}</span>
                <span class="timestamp">${formatTime(walk.timestamp)}</span>
            </div>
            
            ${walk.image ? `
                <div class="card-image">
                    <img src="${walk.image}" alt="Moment">
                </div>
            ` : ''}

            <div class="card-tags">
                ${(walk.tags || []).map(tag => `<span class="tag-badge">${tag}</span>`).join('')}
            </div>

            <div class="card-content">
                <p>${walk.note}</p>
            </div>

            <div class="card-stats">
                ${walk.distance}KM — ${walk.mood.toUpperCase()}
            </div>

            <div class="card-actions">
                <button class="cheer-btn" data-id="${walk.id}">
                    CHEER [${walk.cheers || 0}]
                </button>
            </div>
        `;
        feed.appendChild(card);
    });

    // Cheer logic
    document.querySelectorAll('.cheer-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.currentTarget.dataset.id);
            const walk = State.walks.find(w => w.id === id);
            if (walk) {
                walk.cheers = (walk.cheers || 0) + 1;
                e.currentTarget.textContent = `CHEER [${walk.cheers}]`;
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
});

closeBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
    tagChips.forEach(c => c.classList.remove('active'));
    State.selectedTags = [];
});

walkForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const mood = document.getElementById('mood').value;
    const newWalk = {
        id: Date.now(),
        username: 'USER_MOMENT',
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
    
    closeBtn.click();
    walkForm.reset();
});

// Init
renderFeed();
