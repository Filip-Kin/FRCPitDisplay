function delay(milliseconds){
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}

const pictureloop = async () => {
    const pics = ['beartear.png'];

    i = 0;
    while (true) {
        document.getElementById("loop").setAttribute("src", `/img/${pics[i]}`)
        await delay(5000)
        
        i++;
        if (i == pics.length) {
            i = 0;
        }
    }
}
