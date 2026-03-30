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

  try {
    const res = await fetch(`https://api.opendota.com/api/matches/${matchId}`);
    const data = await res.json();

    matchDetails.innerHTML = `
      <div>Match ID: ${data.match_id}</div>
      <div>Duration: ${data.duration} sec</div>
      <div>Radiant Win: ${data.radiant_win ? 'Yes' : 'No'}</div>
      <div>Game Mode: ${data.game_mode}</div>
      <div>Players in match: ${data.players.length}</div>
    `;
  } catch (error) {
    matchDetails.innerText = 'Не удалось загрузить матч';
    console.error(error);
  }
}

loadMatchDetails();
