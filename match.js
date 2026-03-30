'use strict'

const matchDetails = document.getElementById('matchDetails');

function getMatchIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

async function loadMatchDetails() {
    const matchId = getMatchIdFromUrl();


    const dotaApi = {
    async getMatchInfo(matchId){
    const res = await fetch(`https://api.opendota.com/api/matches/${matchId}`)
    const data = await res.json();
    return data;
  },
}

try{
    const data = await dotaApi.getMatchInfo(matchId)

    matchDetails.innerText = `ID матча: ${data.match_id}`;

} catch(error){
    matchDetails.innerText = "не удалось загрузить матч"
}
}
loadMatchDetails();