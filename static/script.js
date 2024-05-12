let lastdata = {};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const getMetaImage = (url, cb) => {
    const img = new Image();
    img.onload = () => cb(null, img);
    img.onerror = (err) => cb(err);
    img.src = url;
};

function unmute() {
    document.getElementById("vid").muted = false;
}

setInterval(() => {
    fetch('liste.json')
    .then(response => response.json())
    .then(data => {
        if(JSON.stringify(data) !== JSON.stringify(lastdata)) {
            lastdata = data;
            document.getElementById("legende").innerHTML = data.txt;
            document.getElementById("pseudo").innerHTML = data.pseudo;
            document.getElementById("image").src = data.pdp;
            if (data.atta !== undefined) {
                if (data.type.startsWith("image")) {
                    getMetaImage(data.atta, (err, img) => {
                        let newHeight = img.naturalHeight;
                        let newWidth = img.naturalWidth;
                        if (newHeight > 750) {
                            newHeight = 750;
                            newWidth = img.naturalWidth*750/img.naturalHeight;
                        }
                        if(newWidth > 1330) {
                            newWidth = 1330;
                            newHeight = img.naturalHeight*1330/img.naturalWidth;
                        }
                        document.body.style.backgroundSize = `${newWidth}px ${newHeight}px`;
                    });
                    sleep(100).then(document.body.style.backgroundImage = `url(${data.atta})`);
                } else if (data.type.startsWith("video")) {
                    document.getElementById("vid").type = data.type;
                    document.getElementById("vid").src = data.atta;
                }
            }
            if (data.atta !== undefined && data.type.startsWith("video")) {
                var duration;
                var vid = document.getElementById("vid");
                vid.pause();
                vid.currentTime = '0';
                vid.onloadedmetadata = function() {
                    duration = Math.round(this.duration*1000);
                    document.getElementById("site").style.display = "block";
                    vid.play();
                    virtualpointer.move_to_element_and_click(document.getElementById("btn"), 0);
                    sleep(duration).then(() => {
                        document.getElementById("site").style.display = "none";
                        document.body.style.backgroundImage = `url()`;
                        document.getElementById("vid").type = "";
                        document.getElementById("vid").src = "";
                        document.getElementById("vid").muted = true;
                    });
                };
            } else {
                document.getElementById("site").style.display = "block";
                sleep(4500).then(() => {
                    document.getElementById("site").style.display = "none";
                    document.body.style.backgroundImage = `url()`;
                });
            }
        }
    }
    )
    .catch(error => console.log(error));
}, 1000);