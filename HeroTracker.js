"use strict";

const input = document.querySelector(".inputhero");
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
        <img src="${heroImageUrl}" alt="${hero.localized_name}">
        <h3>${hero.localized_name}</h3>
        <div>Roles: ${hero.roles}</div>
        <div>Attribute: ${hero.primary_attr.toUpperCase()}</div>
      </div>
    `;

    const popularItems = await dotaApi.getItemPopularity(hero.id);
const items = await dotaApi.getItems();

const startGameItems = popularItems.start_game_items || {};
const startItemsHtml = Object.keys(startGameItems).map(itemKey => {//создает object с масивами типо
  const item = Object.values(items).find(item => item.id === Number(itemKey));//масив item и в нем item_id: [1][2][3]
  if (!item) return "";
  const itemImageUrl = `https://cdn.akamai.steamstatic.com${item.img}`;//ищем видем item_id в popularitem из него в item number->name
  return `<img src="${itemImageUrl}" alt="${item.dname}">`;//вывод
}).join("");

startItems.innerHTML = startItemsHtml;

const earlyGameItems = popularItems.early_game_items || {};
const earlyItemsHtml = Object.keys(earlyGameItems).map(itemKey => {
  const item = Object.values(items).find(item => item.id === Number(itemKey));
  if (!item) return "";
  const itemImageUrl = `https://cdn.akamai.steamstatic.com${item.img}`;
  return `<img src="${itemImageUrl}" alt="${item.dname}">`;
}).join("");

earlyItems.innerHTML = earlyItemsHtml;

const midGameItems = popularItems.mid_game_items || {};
const midItemsHtml = Object.keys(midGameItems).map(itemKey => {
  const item = Object.values(items).find(item => item.id === Number(itemKey));
  if (!item) return "";
  if (item.cost <= 1350) return "";
  const itemImageUrl = `https://cdn.akamai.steamstatic.com${item.img}`;
  return `<img src="${itemImageUrl}" alt="${item.dname}">`;
}).join("");

midItems.innerHTML = midItemsHtml;

const lateGameItems = popularItems.late_game_items || {};
const lateItemsHtml = Object.keys(lateGameItems).map(itemKey => {
  const item = Object.values(items).find(item => item.id === Number(itemKey));
  if (!item) return "";
  if (item.cost <= 2800) return "";
  const itemImageUrl = `https://cdn.akamai.steamstatic.com${item.img}`;
  return `<img src="${itemImageUrl}" alt="${item.dname}">`;
}).join("");

lateItems.innerHTML = lateItemsHtml;

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

goodMatchups.innerHTML = bestMatchups.map(matchup => {
  const bestHero = heroStats.find(heroStat => heroStat.id === matchup.hero_id);
  return `<div>${bestHero.localized_name} ${(matchup.winRate * 100).toFixed(1)}%</div>`;
}).join("");

badMatchups.innerHTML = worstMatchups.map(matchup => {
  const worstHero = heroStats.find(heroStat => heroStat.id === matchup.hero_id);
  return `<div>${worstHero.localized_name} ${(matchup.winRate * 100).toFixed(1)}%</div>`;
}).join("");
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
