const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');


function getVideo() {
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then(localMediaStream => {
        console.log(localMediaStream);
        video.srcObject = localMediaStream;
        video.play();
    }).catch(err => {
        console.error(`OH NO!!`, err);
    });
}

function paintToCanvas() {
    const {videoWidth: width, videoHeight: height} = video;
    canvas.width = width;
    canvas.height = height;

    //get image to canvas every N time
    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);
        //get pixels
        let pixels = ctx.getImageData(0, 0, width, height);
        //change pixels
        pixels = redEffect(pixels);
        //put changed pixels in image
        ctx.putImageData(pixels, 0, 0);
    }, 16);
}

function takePhoto() {
    //play sound
    snap.currentTime = 0;
    snap.play();

    // take the data out of the canvas
    const data = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'handsome');
    link.innerHTML = `<img src="${data}" alt="Handsome Man" />`;
    strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
    for(let i=0; i < pixels.data.length; i+=4) {
        pixels.data[i + 0] = pixels.data[i + 0] + 100; //R
        pixels.data[i + 1] = pixels.data[i + 1] - 50; //G
        pixels.data[i + 2] = pixels.data[i + 2] * 0.5; //B
    }
    return pixels;
}

getVideo();

video.addEventListener('canplay', paintToCanvas);