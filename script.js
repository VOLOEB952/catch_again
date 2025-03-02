let score = 0;
let isPaused = false;
let items = [];
let magnetActive = false;

document.addEventListener('keydown', function(event) {
    const player = document.getElementById('player');
    const game = document.getElementById('game');
    const step = 10;
    const playerRect = player.getBoundingClientRect();
    const gameRect = game.getBoundingClientRect();

    if (event.code === 'ArrowLeft' && playerRect.left > gameRect.left && !isPaused) {
        player.style.left = player.offsetLeft - step + 'px';
    } else if (event.code === 'ArrowRight' && playerRect.right < gameRect.right && !isPaused) {
        player.style.left = player.offsetLeft + step + 'px';
    } else if (event.code === 'Space') {
        togglePause();
    }
});

document.getElementById('leftButton').addEventListener('click', function() {
    const player = document.getElementById('player');
    const game = document.getElementById('game');
    const step = 10;
    const playerRect = player.getBoundingClientRect();
    const gameRect = game.getBoundingClientRect();

    if (playerRect.left > gameRect.left && !isPaused) {
        player.style.left = player.offsetLeft - step + 'px';
    }
});

document.getElementById('rightButton').addEventListener('click', function() {
    const player = document.getElementById('player');
    const game = document.getElementById('game');
    const step = 10;
    const playerRect = player.getBoundingClientRect();
    const gameRect = game.getBoundingClientRect();

    if (playerRect.right < gameRect.right && !isPaused) {
        player.style.left = player.offsetLeft + step + 'px';
    }
});

function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
        items.forEach(item => item.style.animationPlayState = 'paused');
    } else {
        items.forEach(item => item.style.animationPlayState = 'running');
    }
}

function createItem() {
    if (isPaused) return;

    const game = document.getElementById('game');
    const item = document.createElement('div');
    item.classList.add('item');
    item.style.left = Math.random() * (game.offsetWidth - 30) + 'px';
    game.appendChild(item);
    items.push(item);

    item.addEventListener('animationend', function() {
        game.removeChild(item);
        items = items.filter(i => i !== item);
    });

    const checkCollision = setInterval(function() {
        if (isPaused) return;

        const player = document.getElementById('player');
        const playerRect = player.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();

        if (
            itemRect.bottom >= playerRect.top &&
            itemRect.top <= playerRect.bottom &&
            itemRect.left <= playerRect.right &&
            itemRect.right >= playerRect.left
        ) {
            game.removeChild(item);
            clearInterval(checkCollision);
            items = items.filter(i => i !== item);
            score++;
            document.getElementById('score').innerText = 'Спіймано предметів: ' + score;

            if (score % 100 === 0) {
                createMagnet();
            }
        }
    }, 100);
}

function createMagnet() {
    const game = document.getElementById('game');
    const magnet = document.createElement('div');
    magnet.classList.add('magnet');
    magnet.style.left = Math.random() * (game.offsetWidth - 30) + 'px';
    game.appendChild(magnet);

    magnet.addEventListener('animationend', function() {
        game.removeChild(magnet);
    });

    const checkCollision = setInterval(function() {
        if (isPaused) return;

        const player = document.getElementById('player');
        const playerRect = player.getBoundingClientRect();
        const magnetRect = magnet.getBoundingClientRect();

        if (
            magnetRect.bottom >= playerRect.top &&
            magnetRect.top <= playerRect.bottom &&
            magnetRect.left <= playerRect.right &&
            magnetRect.right >= playerRect.left
        ) {
            game.removeChild(magnet);
            clearInterval(checkCollision);
            activateMagnet();
        }
    }, 100);
}

function activateMagnet() {
    if (magnetActive) return;

    magnetActive = true;
    const player = document.getElementById('player');

    function attractItems() {
        if (!magnetActive) return;

        items.forEach(item => {
            const itemRect = item.getBoundingClientRect();
            const playerRect = player.getBoundingClientRect();
            const distanceX = playerRect.left - itemRect.left;
            const distanceY = playerRect.top - itemRect.top;

            item.style.transition = 'transform 0.5s linear';
            item.style.transform = `translate(${distanceX}px, ${distanceY}px)`;
        });

        requestAnimationFrame(attractItems);
    }

    attractItems();

    setTimeout(() => {
        magnetActive = false;
        items.forEach(item => {
            item.style.transition = '';
            item.style.transform = '';
        });
    }, 10000);
}

setInterval(createItem, 2000);

// Додамо підтримку сенсорного управління
document.addEventListener('touchstart', function(event) {
    const player = document.getElementById('player');
    const game = document.getElementById('game');
    const touchX = event.touches[0].clientX;
    const gameRect = game.getBoundingClientRect();

    if (touchX < gameRect.left + gameRect.width / 2) {
        player.style.left = player.offsetLeft - 10 + 'px';
    } else {
        player.style.left = player.offsetLeft + 10 + 'px';
    }
});