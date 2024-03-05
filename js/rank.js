function generateRank(update) {
    // Set rank
    let rd = document.getElementById('rank');
    getStats().then(json => {
        let rank = json.qual.ranking.rank
        if (json.qual === null || rank === null) { // Rank is not null after 1st match is played
            rd.innerHTML = '<i class="material-icons">timer</i> Waiting for event to start';
            return;
        }
        
        let oldRank = localStorage.getItem("OldRank");

        if (oldRank === 0) {
            rd.innerHTML = 'Rank '+rank;
        }
        else if ((oldRank - rank) < 0) {
            rd.innerHTML = 'Rank '+rank+ `<i class="material-icons">arrow_downward</i>`;
        }
        else if ((oldRank - rank) > 0) {
            rd.innerHTML = 'Rank '+rank+ `<i class="material-icons">arrow_upward</i>`;
        }
        else {
            rd.innerHTML = 'Rank '+rank;
        }
       
        localStorage.setItem("OldRank",rank);
    }).catch(err => {
        if (update) {
            if (!rd.innerHTML.includes('offline')) rd.innerHTML += ' <i class="material-icons">offline_bolt</i>';
        } else {
            rd.innerHTML = '<i class="material-icons">error</i>'
        }
        console.error(err);
    });
}