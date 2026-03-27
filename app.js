'use strict'
//получаем информацию о class
const dotaApi = {
  async getAccountInfo(account_id){
    const res = await fetch(`https://api.opendota.com/api/players/${account_id}`);
    const data = await res.json();
    return data;
  },
  async getWinLose(account_id){
    const res = await fetch(`https://api.opendota.com/api/players/${account_id}/wl`)
    const data = await res.json();  
    const total = data.win + data.lose;
    let winrate;
    if (total == 0){
      winrate = "0%"
    } else {
      winrate = ((data.win / (data.win + data.lose)) * 100).toFixed(1) + "%";
    }
    return{
      ...data,
      winrate
    }
  },
  async getRecentMatches(account_id){
    const res = await fetch(`https://api.opendota.com/api/players/${account_id}/recentMatches`)
    const data = await res.json();
    return data;
  },
  async getMatchInfo(match_id){
    const res = await fetch(`https://api.opendota.com/api/matches/${match_id}`)
    const data = await res.json();
    return data;
  },
  async getHeroName(hero_id){//ai changed
    const res = await fetch(`https://api.opendota.com/api/heroes`);
    const data = await res.json();
    const hero = data.find((hero) => hero.id == hero_id);
    return hero ? hero.localized_name : "Unknown hero";
  }//ai
  }
//получаем информацию о id
const input = document.getElementById("steamid")
const player = document.getElementById("player");
const mmrjs = document.getElementById("mmr");
const tmmrjs = document.getElementById("tmmr");
const wrjs = document.getElementById("wr");
const gameHistory = document.querySelector(".framegame")
//ожидание клика и после код
document.querySelector('.searchbtn').addEventListener('click', async function searchplayer() {

  let account_id = input.value.trim()
    if (!input.value){
       alert("нерпавельный Id")
       return;
    }
      try {
    await Promise.all([
      PlayerProfile(account_id),
      PlayerWinLose(account_id),
      PlayerRecentMatches(account_id)
    ]);
  } catch (error) {
    alert("Не удалось загрузить данные");
    console.error(error);
  }

    
    async function PlayerProfile(account_id){
      const data = await dotaApi.getAccountInfo(account_id)

        player.innerText = data.profile.personaname;

        if (data.computed_mmr !== null) {
          mmrjs.innerText = "Примерный mmr:" + data.computed_mmr.toFixed(0);
        } else {
          mmrjs.innerText = "Нет игр в рейтинге"
        }

        if (data.computed_mmr_turbo !== null) {
          tmmrjs.innerText = "Примерный turbo mmr: " + data.computed_mmr_turbo.toFixed(0);    
        } else {
          tmmrjs.innerText = "Нет игр в турбо"  
        }

        const img = document.createElement('img');
          img.src = data.profile.avatarfull; // Установка пути из JSON
        document.getElementById('steamavatar').innerText = '';
        document.getElementById('steamavatar').appendChild(img);
    };

    async function PlayerWinLose(account_id){
      const data = await dotaApi.getWinLose(account_id)
      const total = data.win + data.lose;
      if (total == 0) {
        wrjs.innerText = "игры не найдены";
      } else {
      wrjs.innerText = "WR: " + ((data.win / (data.win + data.lose)) * 100).toFixed(1) + "%";
      }
    };

      async function PlayerRecentMatches(account_id){
  const data = await dotaApi.getRecentMatches(account_id);

  data.slice(0, 5).forEach(async (match) => {
    const games = await dotaApi.getMatchInfo(match.match_id);
    const playerInMatch = games.players.find((player) => {
  return player.account_id == account_id;
});
const playerWon =
  (playerInMatch.isRadiant && games.radiant_win) ||
  (!playerInMatch.isRadiant && !games.radiant_win);

const gameResult = playerWon ? "Win" : "Lose";

    const heroName = await dotaApi.getHeroName(playerInMatch.hero_id);
      gameHistory.innerHTML += `
        <div>
          <div>Match ID: ${games.match_id}</div>
          <div>Hero: ${heroName}</div>
          <div>KDA: ${playerInMatch.kills}/${playerInMatch.deaths}/${playerInMatch.assists}</div>
          <div>Game result:${gameResult}</div>
        </div>
        <br>
      `;
    });
  }
});
//test steam id
//234816423
//873568882
//1315428024
//121893417
