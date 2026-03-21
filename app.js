'use strict'

const playerInput = document.getElementById('playerInput');
const searchBtn = document.getElementById('searchBtn');

searchBtn.addEventListener('click', async () => {
    const playerId = playerInput.value.trim();
    if (!playerId) {
        alert('Enter Steam ID');
        return;
    }

    try {
        // 1. Получаем общие данные профиля
        const resProfile = await fetch(`https://api.opendota.com/api/players/${playerId}`);
        const data = await resProfile.json();

        // 2. Получаем статистику побед и поражений (W/L)
        const resWL = await fetch(`https://api.opendota.com/api/players/${playerId}/wl`);
        const wlData = await resWL.json();

        // Заполняем данные профиля
        document.getElementById('playerName').textContent =
            data.profile?.personaname || 'Без имени';

        document.getElementById('avatar').src = data.profile?.avatarfull || '';

        document.getElementById('mmr').textContent =
            'MMR: ' + (data.mmr_estimate?.estimate || 'нет');

        // Заполняем статистику (Матчи, Победы, Винрейт)
        const wins = wlData.win || 0;
        const losses = wlData.lose || 0;
        const totalMatches = wins + losses;
        const winrate = totalMatches > 0 ? ((wins / totalMatches) * 100).toFixed(2) : 0;

        document.getElementById('matches').textContent = totalMatches;
        document.getElementById('wins').textContent = wins;
        document.getElementById('winrate').textContent = winrate + '%';

    } catch (error) {
        console.error(error);
        alert('Ошибка запроса. Проверьте правильность ID.');
    }
});