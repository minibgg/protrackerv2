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
        tmmrjs.innerText = data.computed_mmr_turbo;
        
    });

})

873568882