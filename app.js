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
document.querySelector('.searchbtn').addEventListener('click', function searchplayer(searchbutton){
  let account_id = input.value.trim()
    if (!input.value){
       alert("нерпавельный Id")
    }
    
    fetch (`https://api.opendota.com/api/players/${account_id}`)//информация об аккаунте
    .then(response => response.json()) // Конвертация в JSON
    .then(data => { //только тут работа с данными
        player.innerText = data.profile.personaname;
        if (data.computed_mmr !== null) {
          mmrjs.innerText = "Примерный mmr:" + data.computed_mmr.toFixed(0);
        } else {
          mmrjs.innerText = "Нет игр в рейтинге"
        }
        if (data.computed_mmr_turbo !== null) {
          tmmrjs.innerText = "Примерный turbo mmr: " + data.computed_mmr_turbo.toFixed(0);    
        } else {
          tmmrjs.innerText = "Нет игр в турбо"  
        }
        const img = document.createElement('img');
          img.src = data.profile.avatarfull; // Установка пути из JSON
        document.getElementById('steamavatar').appendChild(img);
    });
    fetch (`https://api.opendota.com/api/players/${account_id}/wl`) //только win lose
    .then(response => response.json()) //конвертация в JSON
    .then(data => { //только тут работа с данными
      if (data.win + data.lose == 0) {
        wrjs.innerText = "игры не найдены";
      } else {
      wrjs.innerText = "WR: " + ((data.win / (data.win + data.lose)) * 100).toFixed(1) + "%";
      }
    });
          fetch(`https://api.opendota.com/api/players/${account_id}/recentMatches`)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          const match_id = data[0].match_id
          fetch(`https://api.opendota.com/api/matches/${match_id}`)
          .then(response => response.json())
          .then(data => {
            console.log(data)
            console.log(data.players[0].hero_id)
          });
    });



    document.querySelector(".updatebtn").addEventListener('click', function(updatebutton){
      fetch(`http://127.0.0.1:3000/api/refresh/${account_id}`, { //поменять всё когда пойму
        method: 'POST'
      })
      .then(response => response.json())
      .then(() => {
        let tries = 0;

    let interval = setInterval(() => {
      fetch(`https://api.opendota.com/api/players/${account_id}/recentMatches`)
        .then(response => response.json())
        .then(data => {
          console.log(data);

          if (data.length > 0) {
            clearInterval(interval);
            console.log('данные появились');
          }

          tries++;
          if (tries >= 10) {
            clearInterval(interval);
            console.log('время ожидания вышло');
          }
          document.getElementById("matchhistory").innerText = data[0].match_id

        });
    }, 3000);
//      fetch (`https://api.opendota.com/api/players/${account_id}/recentMatches`) //последние игры
//    .then(response => response.json()) //конвертация в JSON
//    .then(data => { //только тут работа с данными
//      console.log(data[0].match_id)
//      document.getElementById("matchhistory").innerText = 
//    });
  });//до сюда
});

})
//test steam id
//234816423
//873568882
//1315428024
//121893417