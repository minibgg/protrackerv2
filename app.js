'use strict'
//получаем информацию о class .baseinfo
let playerinfo = document.querySelectorAll(".baseinfo")
const input = document.getElementById("steamid")
const player = document.getElementById("player");
const mmrjs = document.getElementById("mmr");
const tmmrjs = document.getElementById("tmmr");
const wrjs = document.getElementById("wr");
//переносим информацию из js в html
//function updateDisplay() {
//    playerinfo.innerText = 
//}
document.querySelector('.searchbtn').addEventListener('click', function(event){
  let account_id = input.value.trim()
    if (!input.value){
       alert("нерпавельный Id")
    }

    fetch (`https://api.opendota.com/api/players/${account_id}`)
    .then(response => response.json()) // Конвертация в JSON
    .then(data => {
        player.innerText = data.profile.personaname;
        mmrjs.innerText = data.computed_mmr;
        if (data.computed_mmr_turbo !== null) {
          tmmrjs.innerText = data.computed_mmr_turbo;    
        } else {
          tmmrjs.innerText = "нет игр в турбо"  
        }
    });
    fetch (`https://api.opendota.com/api/players/${account_id}/wl`)
    .then(response => response.json())
    .then(data => {
      if (data.win + data.lose == 0) {
        wrjs.innerText = "игры не найдены";
      } else {
      wrjs.innerText = ((data.win / (data.win + data.lose)) * 100).toFixed(1) + "%";
      }
    });

})

873568882