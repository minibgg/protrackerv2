'use strict'

    const matchDetails = document.getElementById('matchDetails');

function getMatchIdFromUrl() {//разобратся подробнее
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

async function loadMatchDetails() {
    const matchId = getMatchIdFromUrl();//до

        if (!matchId) {
        matchDetails.innerText = "ID матча не найден в URL";//не нашло игру
        return;
    }

    const dotaApi = {
    async getMatchInfo(matchId){
    const res = await fetch(`https://api.opendota.com/api/matches/${matchId}`)
    const data = await res.json();
    return data;
  },
    async getHeroes(){
  const res = await fetch(`https://api.opendota.com/api/heroes`);
  const heroesName = await res.json();
  return heroesName;
}
}
    
try{
    const matchData = await dotaApi.getMatchInfo(matchId)
    const heroes = await dotaApi.getHeroes()

            const players = matchData.players;

        const playersList = players.map(player => {
    const hero = heroes.find(h => h.id === player.hero_id);
    const heroName = hero ? hero.localized_name : `Неизвестный герой (id: ${player.hero_id})`;
    const teamName = player.isRadiant ? 'Radiant' : 'Dire';

    return `<li>${heroName} - ${teamName}</li>`;
}).join('');


    matchDetails.innerHTML = `
            <h2>ID матча: ${matchData.match_id}</h2>
            <ul>
                ${playersList}
            </ul>
    `;

} catch(error){
    matchDetails.innerText = "не удалось загрузить матч"//поиск багов
}
}
loadMatchDetails();//вызов функции
//test steam id
//234816423
//873568882
//1315428024
//121893417
