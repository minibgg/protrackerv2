'use strict';
const matchDetails = document.getElementById('matchDetails');

function getMatchIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

async function loadMatchDetails() {
  const matchId = getMatchIdFromUrl();

  if (!matchId) {
    matchDetails.innerText = 'Match ID не найден в ссылке';
    return;
  }

  const dotaApi = {
async getGameMode(gameModeId) {
  const res = await fetch(`https://api.opendota.com/api/constants/game_mode`);
  const data = await res.json();
  return data[gameModeId];
},

async getMatchInfo(matchId) {
  const res = await fetch(`https://api.opendota.com/api/matches/${matchId}`);
  const data = await res.json();
  return data;
},

  async getHeroes() {
    const res = await fetch(`https://api.opendota.com/api/heroes`);
    const data = await res.json();
    return data;
  }

}

  try {
const data = await dotaApi.getMatchInfo(matchId);
const heroes = await dotaApi.getHeroes();

function getReadableGameMode(matchData) {
  if (matchData.game_mode === 23) return 'Турбо';
  if (matchData.lobby_type === 7) return 'Рейтинговая игра';
  if (matchData.game_mode === 22) return 'Обычная игра';
  if (matchData.game_mode === 18) return 'Ability Draft';
  return 'Неизвестный режим';
}

const readableMode = getReadableGameMode(data);

const minutes = Math.floor(data.duration / 60);
const seconds = data.duration % 60;
const formattedDuration = `${minutes} мин ${String(seconds).padStart(2, '0')} сек`;

const playersHtml = data.players.map((player) => {
  const hero = heroes.find((h) => h.id === player.hero_id);
  const heroName = hero ? hero.localized_name : 'Unknown hero';

  return `
    <div class="player-card">
      <div>Player ID: ${player.account_id ?? 'Hidden'}</div>
      <div>Hero: ${heroName}</div>
      <div>KDA: ${player.kills}/${player.deaths}/${player.assists}</div>
      <div>Крипы: ${player.last_hits}</div>
      <div>Денаи: ${player.denies}</div>
      <div>GPM: ${player.gold_per_min}</div>
      <div>XPM: ${player.xp_per_min}</div>
      <div>Урон по героям: ${player.hero_damage}</div>
      <div>Урон по таверам: ${player.tower_damage}</div>
      <div>Лечение: ${player.hero_healing}</div>
    </div>
  `;
}).join('');

matchDetails.innerHTML = `
  <div>Match ID: ${data.match_id}</div>
  <div>Длительность: ${formattedDuration}</div>
  <div>Победа Radiant: ${data.radiant_win ? 'Да' : 'Нет'}</div>
  <div>Режим: ${readableMode}</div>
  <div class="players-list">
    ${playersHtml}
  </div>
`;
  } catch (error) {
    matchDetails.innerText = 'Не удалось загрузить матч';
    console.error(error);
  }
}

loadMatchDetails();
