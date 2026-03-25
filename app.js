'use strict'
//получаем информацию о class .baseinfo
let playerinfo = document.querySelectorAll(".baseinfo")
const input = document.getElementById("steamid")
//переносим информацию из js в html
//function updateDisplay() {
//    playerinfo.innerText = 
//}
document.querySelector('.searchbtn').addEventListener('click', function(event){
  let account_id = input.value.trim()
    fetch (`https://api.opendota.com/api/players/${account_id}`)
    .then(response => response.json()) // Конвертация в JSON
    .then(data => console.log(data));
      if (!input.value){
        alert("нерпавельный Id")
      }
      if (!data) {
        alert(123)
      }
})

