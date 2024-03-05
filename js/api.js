// Just wrappers for the http requests required to make API magic work
const headers = {
    'X-TBA-Auth-Key': tbaApiKey
}

function getTeam(team = teamId) {
    return new Promise((resolve, reject) => {
        fetch(apiBaseUrl + '/team/' + team, { headers: headers })
            .then(res => res.json())
            .then(json => {
                console.debug(json);
                if (json.hasOwnProperty('Errors')) return reject(json);
                return resolve(json);
            }).catch(err => reject(err));
    });
}

function getEvents(year = 0) {
    return new Promise((resolve, reject) => {
        year = (year === 0) ? '' : '/' + year;
        fetch(apiBaseUrl + '/team/' + teamId + '/events' + year, { headers: headers })
            .then(res => res.json())
            .then(json => {
                console.debug(json);
                if (json.hasOwnProperty('Errors')) return reject(json);
                return resolve(json);
            }).catch(err => reject(err));
    });
}

function getEvent(event = eventId) {
    return new Promise((resolve, reject) => {
        fetch(apiBaseUrl + '/event/' + event, { headers: headers })
            .then(res => res.json())
            .then(json => {
                console.debug(json);
                if (json.hasOwnProperty('Errors')) return reject(json);
                return resolve(json);
            }).catch(err => reject(err));
    });
}

function getMatches(event = eventId, team = teamId) {
    return new Promise((resolve, reject) => {
        fetch(apiBaseUrl + '/team/' + team + '/event/' + event + '/matches/simple', { headers: headers })
            .then(res => res.json())
            .then(json => {
                console.debug(json);
                if (json.hasOwnProperty('Errors')) return reject(json);
                return resolve(json);
            }).catch(err => reject(err));
    });
}

function getMatchesComplex(team = teamId, event = eventId) {
    return new Promise((resolve, reject) => {
        fetch(apiBaseUrl + '/team/' + team + '/event/' + event + '/matches', { headers: headers })
            .then(res => res.json())
            .then(json => {
                console.debug(json);
                if (json.hasOwnProperty('Errors')) return reject(json);
                return resolve(json);
            }).catch(err => reject(err));
    });
}

function getTeamsFromEvent(event= eventId) {
    return new Promise((resolve, reject) => {
        fetch(apiBaseUrl + '/event/' + event + '/teams/simple', { headers: headers })
            .then(res => res.json())
            .then(json => {
                console.debug(json);
                if (json.hasOwnProperty('Errors')) return reject(json);
                return resolve(json);
            }).catch(err => reject(err));
    });
}

/*async function getAvgScore(event = eventId) {
    let matches = await getMatches(event)
    let totalScore = 0

    matches.forEach((value, index, arr) => {
        if (value.alliances.blue || value.alliances.red) {
            if (value.alliances.blue.team_keys || value.alliances.red.team_keys) {
                if (value.alliances.blue.team_keys.indexOf(teamId)) {
                    totalScore += value.alliances.blue.score;
                }
                else if (value.alliances.red.team_keys.indexOf(teamId)) {
                    totalScore += value.alliances.red.score;
                }
            }
        }
    })

    console.log(totalScore/matches.length)
}*/

function getAllMatches(event = eventId) {
    return new Promise((resolve, reject) => {
        fetch(apiBaseUrl + '/event/' + event + '/matches/simple', { headers: headers })
            .then(res => res.json())
            .then(json => {
                console.debug(json);
                if (json.hasOwnProperty('Errors')) return reject(json);
                return resolve(json);
            }).catch(err => reject(err));
    });
}

async function getAllMatchesComplex(event = eventId) {
    return new Promise((resolve, reject) => {
        fetch(apiBaseUrl + '/event/' + event + '/matches', { headers: headers })
            .then(res => res.json())
            .then(json => {
                console.debug(json);
                if (json.hasOwnProperty('Errors')) return reject(json);
                return resolve(json);
            }).catch(err => reject(err));
    });
}

function getMatch(match, event = eventId) {
    // TODO
}

function getStats(team = teamId, event = eventId) {
    return new Promise((resolve, reject) => {
        fetch(apiBaseUrl + '/team/' + team + '/event/' + event + '/status', { headers: headers })
            .then(res => res.json())
            .then(json => {
                console.debug(json);
                if (json === null || json.hasOwnProperty('Errors')) return reject(json);
                return resolve(json);
            }).catch(err => reject(err));
    });
}

function getDistrictEvent(district_key = districtKey) {
    return new Promise((resolve, reject) => {
        fetch(apiBaseUrl + '/district/' + district_key + '/rankings', { headers: headers })
            .then(res => res.json())
            .then(json => {
                if (json === null || json.hasOwnProperty('Errors')) return reject(json);
                let TeamData
                json.forEach(value => {
                    if (value.team_key === "frc4384") {
                        console.log(value)
                        TeamData = value
                    }
                })
                return resolve(TeamData);
            }).catch(err => reject(err));
    });
}