'use strict';
const matchDetails = document.getElementById('matchDetails');

function getMatchIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

const dotaApi = {
  async getMatchInfo(matchId) {
    const res = await fetch(`https://api.opendota.com/api/matches/${matchId}`);
    const data = await res.json();
    return data;
  },

  async getHeroes() {
    const res = await fetch('https://api.opendota.com/api/heroes');
    const data = await res.json();
    return data;
  }
};

function getReadableGameMode(matchData) {
  if (matchData.game_mode === 23) return 'Turbo';
  if (matchData.lobby_type === 7) return 'Ranked game';
  if (matchData.game_mode === 22) return 'Normal game';
  if (matchData.game_mode === 18) return 'Ability Draft';
  return 'Unknown mode';
}

function renderPlayerCard(player, heroes) {
  const hero = heroes.find((item) => item.id === player.hero_id);
  const heroName = hero ? hero.localized_name : 'Unknown hero';

  return `
    <article class="player-card">
      <div>Player ID: ${player.account_id ?? 'Hidden'}</div>
      <div>Hero: ${heroName}</div>
      <div>KDA: ${player.kills}/${player.deaths}/${player.assists}</div>
      <div>Last hits: ${player.last_hits}</div>
      <div>GPM: ${player.gold_per_min}</div>
      <div>XPM: ${player.xp_per_min}</div>
      <div>Hero damage: ${player.hero_damage}</div>
      <div>Tower damage: ${player.tower_damage}</div>
    </article>
  `;
}

async function loadMatchDetails() {
  const matchId = getMatchIdFromUrl();

  if (!matchId) {
    matchDetails.innerText = 'Match ID not found in URL';
    return;
  }

  try {
    const data = await dotaApi.getMatchInfo(matchId);
    const heroes = await dotaApi.getHeroes();

    const minutes = Math.floor(data.duration / 60);
    const seconds = data.duration % 60;
    const formattedDuration = `${minutes} min ${String(seconds).padStart(2, '0')} sec`;
    const readableMode = getReadableGameMode(data);

    const radiantPlayers = data.players
      .filter((player) => player.isRadiant)
      .map((player) => renderPlayerCard(player, heroes))
      .join('');

    const direPlayers = data.players
      .filter((player) => !player.isRadiant)
      .map((player) => renderPlayerCard(player, heroes))
      .join('');

    matchDetails.innerHTML = `
      <div>Match ID: ${data.match_id}</div>
      <div>Duration: ${formattedDuration}</div>
      <div>Radiant win: ${data.radiant_win ? 'Yes' : 'No'}</div>
      <div>Mode: ${readableMode}</div>
      <div class="teams-grid">
        <section class="team-column">
          <h2 class="team-title">Team 1</h2>
          <div class="players-list">
            ${radiantPlayers}
          </div>
        </section>
        <section class="team-column">
          <h2 class="team-title">Team 2</h2>
          <div class="players-list">
            ${direPlayers}
          </div>
        </section>
      </div>
    `;
  } catch (error) {
    matchDetails.innerText = 'Could not load match';

`;
  } catch (error) {
    matchDetails.innerText = 'Не удалось загрузить матч';
`;
  } catch (error) {
    matchDetails.innerText = 'Не удалось загрузить матч';
    console.error(error);
  }
}

loadMatchDetails();
