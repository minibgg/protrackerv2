"use strict";

const input = document.querySelector(".inputhero");
const resultsContainer = document.querySelector(".hero-results");

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
    let inputhero = input.value
    console.log(inputhero)

      function renderHeroes(heroes) {
  resultsContainer.innerHTML = "";

  if (heroes.length === 0) {
    resultsContainer.innerHTML = "<p>Герои не найдены.</p>";
    return;
  }

  heroes.forEach((hero) => {
    resultsContainer.innerHTML += `
      <div class="hero-card">
        <h3>${hero.localized_name}</h3>
        <p>Основной атрибут: ${hero.primary_attr}</p>
        <p>Тип атаки: ${hero.attack_type}</p>
      </div>
    `;
  });
}
  })
} catch(error){
  console.log(error)
//    matchDetails.innerText = "не удалось загрузить матч"//поиск багов
}
})();
