'use strict'
//получаем информацию о class
let playerinfo = document.querySelectorAll(".baseinfo")
//получаем информацию о id
const input = document.getElementById("steamid")
const player = document.getElementById("player");
const mmrjs = document.getElementById("mmr");
const tmmrjs = document.getElementById("tmmr");
const wrjs = document.getElementById("wr");
//ожидание клика и после код
document.querySelector('.searchbtn').addEventListener('click', function(event){
  let account_id = input.value.trim()
    if (!input.value){
       alert("нерпавельный Id")
    }

    fetch (`https://api.opendota.com/api/players/${account_id}`)
    .then(response => response.json()) // Конвертация в JSON
    .then(data => { //только тут работа с данными
        player.innerText = data.profile.personaname;
        mmrjs.innerText = data.computed_mmr;
        if (data.computed_mmr_turbo !== null) {
          tmmrjs.innerText = data.computed_mmr_turbo;    
        } else {
          tmmrjs.innerText = "нет игр в турбо"  
        }
        const img = document.createElement('img');
          img.src = data.profile.avatarfull; // Установка пути из JSON
        document.getElementById('steamavatar').appendChild(img);
    });
    fetch (`https://api.opendota.com/api/players/${account_id}/wl`)
    .then(response => response.json()) //конвертация в JSON
    .then(data => { //только тут работа с данными
      if (data.win + data.lose == 0) {
        wrjs.innerText = "игры не найдены";
      } else {
      wrjs.innerText = ((data.win / (data.win + data.lose)) * 100).toFixed(1) + "%";
      }
    });

})