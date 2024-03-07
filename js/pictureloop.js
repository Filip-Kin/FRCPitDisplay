function delay(milliseconds) {
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}

const pictureloop = async () => {
    const pics = [
        'beartear.png',
        'terminal-supply.png',
        'ford.png',
        'berkley-foundation.png',
        'mens-club.png',
        'michigan.png',
        '3m.png',
        'automation-ally.png',
        'bosch.png',
        'dadra.png',
        'dodea.png',
        'raytheon.png',
        'stellantis.png',
        'womans-league.png'
    ];

    i = 0;
    while (true) {
        document.getElementById("loop").setAttribute("src", `/img/${pics[i]}`)
        if (i < 6) {
            await delay(6000);
        } else {
            await delay(3000);
        }

        i++;
        if (i == pics.length) {
            i = 0;
        }
    }
}
