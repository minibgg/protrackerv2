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
},
    async getItems(){
        const res = await fetch(`https://api.opendota.com/api/constants/items`);
        const items = res.json();
        return items;
    }
}

try{
    const matchData = await dotaApi.getMatchInfo(matchId);
    const heroes = await dotaApi.getHeroes();
    const items = await dotaApi.getItems();

            const players = matchData.players;

        const renderPlayerCard = player => {
    const hero = heroes.find(h => h.id === player.hero_id);
    const heroName = hero ? hero.localized_name : `Неизвестный герой (id: ${player.hero_id})`;
    const teamName = player.isRadiant ? 'Radiant' : 'Dire';
    const KDA = player.kills + `/` + player.deaths + `/` + player.assists
    const profileName = player.personaname || `Игрок ${player.accound_id ?? 'unknown'}`
    const GPM = "GPM:" + player.gold_per_min;
    const XPM = "XPM:" + player.xp_per_min;

    const heroShortName = hero ? hero.name.replace('npc_dota_hero_', '') : 'unknown';
    const heroIconUrl = `https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/heroes/${heroShortName}.png`;

    const itemSlots = [
    player.item_0,
    player.item_1,
    player.item_2,
    player.item_3,
    player.item_4,
    player.item_5
];

const itemIcons = itemSlots
    .filter(itemId => itemId !== 0) //ии написано, нужно понять
    .map(itemId => {
    const item = Object.values(items).find(i => i.id === itemId);//до

    if (!item) {
    return '';
    }
//от
    return `
    <img
        class="item-icon"
        src="https://cdn.akamai.steamstatic.com${item.img}"
        alt="${item.dname}"
        title="${item.dname}"
    >
    `;//до
})
.join('');

//от
return `
  <li class="player-card">
    <div class="player-header">
      <img
        class="hero-icon"
        src="${heroIconUrl}"
        alt="${heroName}"
        title="${heroName}"
      >
      <div class="player-info">
        <div>${profileName} (${heroName})</div>
        <div>${teamName} ${KDA}</div>
      </div>
    </div>

    <div class="items-row">
      ${itemIcons}
    </div>
  </li>
`;
};

    const radiantPlayers = players
        .filter(player => player.isRadiant)
        .map(renderPlayerCard)
        .join('');

    const direPlayers = players
        .filter(player => !player.isRadiant)
        .map(renderPlayerCard)
        .join('');

    matchDetails.innerHTML = `
            <h2 class="IDmatch">ID матча: ${matchData.match_id}</h2>
            <div class="teams-grid">
                <div class="team-column radiant-column">
                    <h3>Radiant</h3>
                    <ul class="playerList">
                        ${radiantPlayers}
                    </ul>
                </div>
                <div class="team-column dire-column">
                    <h3>Dire</h3>
                    <ul class="playerList">
                        ${direPlayers}
                    </ul>
                </div>
            </div>
    `;
//до
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
