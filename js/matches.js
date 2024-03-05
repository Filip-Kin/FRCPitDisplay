function isEmpty(obj) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop))
            return false;
    }

    return true;
}

function generateMatches(update) {
    // Match table
    let m = document.getElementById('matches');
    let comp_lvl = "qm"
    if (window.location.toString().split("?")[1] !== undefined) {
        if (window.location.toString().split("?")[1].split("comp_level=")[1] === undefined) return
        comp_lvl = window.location.toString().split("?")[1].split("comp_level=")[1]
    }
    getMatches().then(json => {
        if (json.length < 1) {
            m.innerHTML = '<tr><td colspan=9 class="center"><h3>Matches Unavailible</h3></td></tr><tr><td colspan=9 class="center"><h5>Matches will be set before the opening ceremony</h5></td></tr>';
            console.log('Matches not yet set');
            return;
        }
        // Get current match to calc eta
        getAllMatchesComplex().then(ajson => {
            console.log(ajson);
            let highestMatch = 0;
            ajson.forEach(match => {
                if (match.winning_alliance !== '' && highestMatch < match.match_number) { // Go through all the matches until you find the highest number of match
                    highestMatch = match.match_number;
                }
            });

            // Array of elements to remove flickering when updating
            let matches = [];

            // Fix sorting on single digit numbers
            let dmatches = [];


            // Find matches under 10 and add them to a second array
            json.forEach((match, i) => {
                if (match.comp_level !== comp_lvl) { // IDK what to do after qualifiers
                    delete json[i];
                } else if (match.match_number < 10) { // If it's less than 10, add to array
                    dmatches.push(match);
                }
            });

            let title = "Qualifications"

            if (comp_lvl === "qf") {
                title = "Quarter Finals"
            } else if (comp_lvl === "sf") {
                title = "Semi Finals"
            } else if (comp_lvl === "f") {
                title = "Finals"
            }
            m.innerHTML = `<tr class="key"><th colspan="16">${title}</th></tr>`;

            if (isEmpty(json)) {
                m.innerHTML = `<tr class="key"><th colspan="16">No Matches</th></tr>`;
            } else {

                // Remove matches under 10
                json = json.filter((value) => {
                    return value.match_number > 9;
                });
                // Add matches under 10 back
                dmatches.reverse();
                dmatches.forEach(match => {
                    json.unshift(match); // This adds the element to the beginning of the array I think
                });

                // Create elements (fire, water, earth, air. Yeah I'm a programmer god)
                json.forEach(async match => {
                    let r = document.createElement('tr');
                    r.classList.add('match');
                    // calc eta
                    let eta = 0;
                    if (match.alliances.red.score < 0) { // Less than 0 score means the match hasn't played yet
                        eta = (match.match_number - highestMatch) * 8; // Basically assuming each match takes 8 minutes
                        if (eta > 59) { // If it's more than 59 minutes, make it pretty with hours
                            if (eta <= resetTime) { // There's that variable from the config, still dk what it does
                                eta = '<4'; // But apparently it means the match is close
                            } else if (eta % 60 !== 0) { // If the minute amount is not divisible by 60 with no remainder
                                eta = (eta / 60).toString().split('.'); // So convert to hours and remove the decimal
                                eta = eta[0] + 'h ' + (('0.' + eta[1]) * 60).toFixed(0) + 'm'; // idk what I did here
                            } else { // Divisible by 60, so just do hours not minutes
                                eta = (eta / 60) + 'h';
                            }
                        } else {
                            eta += 'm'; // Not more than an hour, so just do minutes
                        }
                    } else {
                        eta = ''; // Match has a score >0 so it's already been played
                    }

                    let compMatchNums = {}
                    var rp = "";
                    //RP
                    let color;
                    for (let teamColor in match.alliances) {
                        if (match.alliances[teamColor].team_keys.includes(teamId)) {
                            color = teamColor;
                        }
                    }

                    let scoreBreakdown = ajson.filter(a => (a.match_number === match.match_number))[0].score_breakdown;
                    if (scoreBreakdown !== null) {
                        rp = scoreBreakdown[color].rp
                    }

                    // Gather data
                    let cols = [
                            match.match_number,
                            eta,
                            match.alliances.red.team_keys[0].replace('frc', ''), // Remove frc from team ids because more pretty
                            match.alliances.red.team_keys[1].replace('frc', ''),
                            match.alliances.red.team_keys[2].replace('frc', ''),
                            match.alliances.blue.team_keys[0].replace('frc', ''),
                            match.alliances.blue.team_keys[1].replace('frc', ''),
                            match.alliances.blue.team_keys[2].replace('frc', ''),
                            (match.alliances.red.score < 0) ? '' : match.alliances.red.score, // If score no exists (<0) then be blank
                            (match.alliances.blue.score < 0) ? '' : match.alliances.blue.score,
                            rp,
                        ]
                        // Now make it fancy and in HTML
                    cols.forEach(col => {
                        let c = document.createElement('td');
                        c.innerHTML = col;
                        if (col === teamId.replace('frc', '')) { // If the column has our team number, than apply the .us class, because we extra spechial
                            c.classList.add('us');
                        }
                        r.appendChild(c); // Add to row
                    });
                    // Stylize for winner, because winners got that style
                    if (['blue', 'red'].includes(match.winning_alliance)) {
                        r.classList.add(match.winning_alliance + '-win'); // CSS class, because CSS is funner than an ugly JS for loop

                    }

                    if (match.alliances[match.winning_alliance] !== undefined) {
                        if (match.alliances[match.winning_alliance].team_keys.includes(teamId)) {
                            r.children.item(0).innerHTML = `<b style="color:lime;">${match.match_number}</b>`
                        } else {
                            r.children.item(0).innerHTML = `<b style="color:Red;">${match.match_number}</b>`
                        }
                    }
                    matches.push(r); // Add to table
                });

                // Update table
                matches.forEach(r => m.appendChild(r));
            }

        });
    }).catch(err => {
        if (update) {
            if (!m.innerHTML.includes('offline')) m.innerHTML += '<tr><td colspan=9 class="center offline"><h2><i class="material-icons">offline_bolt</i></h2></td></tr>';
        } else {
            m.innerHTML = '<tr><td colspan=9 class="center"><h3>Matches Unavailible</h3></td></tr><tr><td colspan=9 class="center"><i class="material-icons">error</i> ' + err.message + '</td></tr>';
        }
        console.error(err);
    });
}