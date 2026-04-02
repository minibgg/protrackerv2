"use strict";

const input = document.querySelector(".inputhero");
const heroesList = document.querySelector("#heroesList");
const herostats = document.querySelector(".heroStats");
const startItems = document.querySelector(".startItems");
const earlyItems = document.querySelector(".earlyItems");
const midItems = document.querySelector(".midItems")
const lateItems = document.querySelector(".lateItems")
const goodMatchups = document.querySelector(".goodMatchups")
const badMatchups = document.querySelector(".badMatchups")

const dotaApi = {
  async getHeroes() {
    const res = await fetch(`https://api.opendota.com/api/heroes`);
    const data = await res.json();
    return data;
  },
  async getHeroMatchUp(hero_id) {
    const res = await fetch(`https://api.opendota.com/api/heroes/${hero_id}/matchups`,);
    const data = await res.json();
    return data;
  },
  async getHeroMatches(hero_id) {
    const res = await fetch(`https://api.opendota.com/api/heroes/${hero_id}/matches`);
    const data = await res.json();
    return data;
  },
  async getGamesWin(hero_id) {
    const res = await fetch(`https://api.opendota.com/api/heroes/${hero_id}/durations`);
    const data = await res.json();
    return data;
  },
  async getItemPopularity(hero_id) {
    const res = await fetch(`https://api.opendota.com/api/heroes/${hero_id}/itemPopularity`);
    const data = await res.json();
    return data;
  },
  async getHeroStats() {
    const res = await fetch(`https://api.opendota.com/api/heroStats`);
    const data = await res.json();
    return data;
  },
  async getItems() {
    const res = await fetch(`https://api.opendota.com/api/constants/items`);
    const data = await res.json();
    return data;
  }
};

(async () => {
try{
  const heroStats = await dotaApi.getHeroStats();
  heroesList.innerHTML = heroStats.map(hero => `<option value="${hero.localized_name}"></option>`).join("");
  document.querySelector('.searchbtn').addEventListener('click', async function searchplayer() {
  const searchInput = input.value.toLowerCase();

  // Фильтруем героев
  const foundHeroes = heroStats.filter(hero => {
    const cleanName = hero.localized_name.toLowerCase().replace("-", " ");
    return cleanName.includes(searchInput);
  });

  if (foundHeroes.length > 0) {
    const hero = foundHeroes[0];
    const heroImagePath = hero.img.trim().split('?')[0];
    const heroImageUrl = `https://cdn.akamai.steamstatic.com${heroImagePath}`;

    herostats.innerHTML = `
      <div class="hero-frame">
        <img class="avatarframe" src="${heroImageUrl}" alt="${hero.localized_name}">
        <div>
          <h3 class="heroinfo">${hero.localized_name}</h3>
          <div class="heroinfo">Roles: ${hero.roles}</div>
          <div class="heroinfo">Attribute: ${hero.primary_attr.toUpperCase()}</div>
        </div>
      </div>
    `;

    const popularItems = await dotaApi.getItemPopularity(hero.id);
const items = await dotaApi.getItems();

const startGameItems = popularItems.start_game_items || {};
const startItemsHtml = Object.keys(startGameItems).map(itemKey => {
  const item = Object.values(items).find(item => item.id === Number(itemKey));
  if (!item) return "";
  if (item.cost <= 0) return "";
  const itemImageUrl = `https://cdn.akamai.steamstatic.com${item.img}`;
  return `<img class="itemframe" src="${itemImageUrl}" alt="${item.dname}">`;
}).join("");

startItems.innerHTML = `<div id="itemsframe">${startItemsHtml}</div>`;

const earlyGameItems = popularItems.early_game_items || {};
const earlyItemsHtml = Object.keys(earlyGameItems).map(itemKey => {
  const item = Object.values(items).find(item => item.id === Number(itemKey));
  if (!item) return "";
  const itemImageUrl = `https://cdn.akamai.steamstatic.com${item.img}`;
  return `<img class="itemframe" src="${itemImageUrl}" alt="${item.dname}">`;
}).join("");

earlyItems.innerHTML = `<div id="itemsframe">${earlyItemsHtml}</div>`;

const midGameItems = popularItems.mid_game_items || {};
const midItemsHtml = Object.keys(midGameItems).map(itemKey => {
  const item = Object.values(items).find(item => item.id === Number(itemKey));
  if (!item) return "";
  if (item.cost <= 1350) return "";
  const itemImageUrl = `https://cdn.akamai.steamstatic.com${item.img}`;
  return `<img class="itemframe" src="${itemImageUrl}" alt="${item.dname}">`;
}).join("");

midItems.innerHTML = `<div id="itemsframe">${midItemsHtml}</div>`;

const lateGameItems = popularItems.late_game_items || {};
const lateItemsHtml = Object.keys(lateGameItems).map(itemKey => {
  const item = Object.values(items).find(item => item.id === Number(itemKey));
  if (!item) return "";
  if (item.cost <= 2800) return "";
  const itemImageUrl = `https://cdn.akamai.steamstatic.com${item.img}`;
  return `<img class="itemframe" src="${itemImageUrl}" alt="${item.dname}">`;
}).join("");

lateItems.innerHTML = `<div id="itemsframe">${lateItemsHtml}</div>`;

const allMatchups = await dotaApi.getHeroMatchUp(hero.id);
// Получаем с API массив всех матчапов для выбранного героя

const filteredMatchups = allMatchups
  .filter(matchup => matchup.games_played >= 50)
  // Оставляем только тех героев, против которых сыграно 50+ игр

  .map(matchup => ({
    ...matchup,
    winRate: matchup.wins / matchup.games_played
  }))
  // Для каждого объекта добавляем новое поле winRate
  // winRate = винрейт против этого героя

  .sort((a, b) => b.winRate - a.winRate);
// Сортируем массив по winRate от большего к меньшему

const bestMatchups = filteredMatchups.slice(0, 4);
// Берем первый элемент массива
// Это самый высокий winRate

const worstMatchups = filteredMatchups.slice(-4).reverse();

goodMatchups.innerHTML = `<div id="goodMatchupsId">${bestMatchups.map(matchup => {
  const bestHero = heroStats.find(heroStat => heroStat.id === matchup.hero_id);
  return `<div class="matchupItem">${bestHero.localized_name} ${(matchup.winRate * 100).toFixed(1)}%</div>`;
}).join("")}</div>`;

badMatchups.innerHTML = `<div id="worstMatchupsId">${worstMatchups.map(matchup => {
  const worstHero = heroStats.find(heroStat => heroStat.id === matchup.hero_id);
  return `<div class="matchupItem">${worstHero.localized_name} ${(matchup.winRate * 100).toFixed(1)}%</div>`;
}).join("")}</div>`;
// Берем последний элемент массива
// Это самый низкий winRate

  } else {
    herostats.innerHTML = "Герой не найден";
  }

});
} catch(error){
  console.log(error)
//    matchDetails.innerText = "не удалось загрузить матч"//поиск багов
};
})();
