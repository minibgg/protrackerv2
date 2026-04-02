"use strict";

const input = document.querySelector(".inputhero");
const resultsContainer = document.querySelector(".hero-results");
const herostats = document.querySelector(".heroStats")

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
};

(async () => {
try{
  const heroStats = await dotaApi.getHeroStats()
  document.querySelector('.searchbtn').addEventListener('click', async function searchplayer() {
    const searchInput = input.value
    const result =  heroStats.filter(hero => {
      const heroName = hero.localized_name.toLowerCase();
      const cleanName = heroName.replace("-", " ");
      return cleanName.includes(searchInput.toLowerCase());
    })
    console.log(result)
    if (result.length > 0) {
      const hero = result[0]; // Берем первого найденного героя
        herostats.innerHTML = `
        <div class="heroRole">Roles: ${hero.roles}</div>
        <div>Hero attribute: ${hero.primary_attr}</div>
        `;
} else {
    herostats.innerHTML = "Герой не найден";
}
});
} catch(error){
  console.log(error)
//    matchDetails.innerText = "не удалось загрузить матч"//поиск багов
};
})();
