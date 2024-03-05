function delay(milliseconds){
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}

const pictureloop = async () => {
    const picsRaw = await fetch(myApi+"/getloop")
    const pics = await picsRaw.json()

    for (var i = 0; i < pics.length; i++) {
        document.getElementById("loop").setAttribute("src", myApi+`/img/loop/${pics[i]}`)
       await delay(5000)
        if (i === pics.length-1) {
            i = 0;
        }
    }
}