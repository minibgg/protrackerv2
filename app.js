'use strict'
//получаем информацию о class
let playerinfo = document.querySelectorAll(".baseinfo")
const dotaApi = {
  async getAccountInfo(account_id){
    const res = await fetch(`https://api.opendota.com/api/players/${account_id}`);
    const data = await res.json();
    return data;
  },
  async getWinLose(account_id){
    const res = await fetch(`https://api.opendota.com/api/players/${account_id}/wl`)
    const data = await res.json();  
    const result = data.win + data.lose;
    let winrate;
    if (result == 0){
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
  }

}
//получаем информацию о id
const input = document.getElementById("steamid")
const player = document.getElementById("player");
const mmrjs = document.getElementById("mmr");
const tmmrjs = document.getElementById("tmmr");
const wrjs = document.getElementById("wr");
const gameHistory = document.querySelector(".framegame")
//ожидание клика и после код
document.querySelector('.searchbtn').addEventListener('click', function searchplayer(searchbutton){
  let account_id = input.value.trim()
    if (!input.value){
       alert("нерпавельный Id")
       return;
    }
    PlayerProfile(account_id);
    PlayerWinLose(account_id);
    PlayerRecentMatches(account_id);
    MatchInfo(match_id)
    
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
      const result = data.win + data.lose;
      if (result == 0) {
        wrjs.innerText = "игры не найдены";
      } else {
      wrjs.innerText = "WR: " + ((data.win / (data.win + data.lose)) * 100).toFixed(1) + "%";
      }
    };

          async function PlayerRecentMatches(account_id){
  const data = await dotaApi.getRecentMatches(account_id);

  data.slice(0, 5).forEach(async (match) => {
    const games = await dotaApi.getMatchInfo(match.match_id);

    const playerInMatch = games.players.find(player => player.account_id == account_id);//понять что написно

    console.log('match id:', games.match_id);
    console.log('hero id:', playerInMatch.hero_id);
    console.log('kills:', playerInMatch.kills);
    console.log('deaths:', playerInMatch.deaths);
    console.log('assists:', playerInMatch.assists);
    gameHistory.innerHTML += `<div>Match ID: ${match.match_id}</div>`;
  });
}});

//              const matchInfo = await dotaApi.getMatchInfo(match_id)
//            console.log(matchInfo);
//            console.log(matchInfo.players[0].hero_id);
//test steam id
//234816423
//873568882
//1315428024
//121893417