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

        const heroesList = players.map(player => {
            const hero = heroes.find(h => h.id === player.hero_id);
            return hero ? hero.localized_name : `Неизвестный герой (id: ${player.hero_id})`;
        });

    matchDetails.innerHTML = `
            <h2>ID матча: ${matchData.match_id}</h2>
            <ul>
                ${heroesList.map(name => `<li>${name}</li>`).join('')}
            </ul>
    `;

} catch(error){
    matchDetails.innerText = "не удалось загрузить матч"//поиск багов
}
}
loadMatchDetails();//вызов функции