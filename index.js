// Grab elements, create settings, etc.
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var video = document.getElementById('video');

var connection = {}
function connect() {
    if(window.WebSocket != undefined) {
        if(connection.readyState === undefined || connection.readyState > 1)
        {
            connection = new WebSocket('ws://localhost:1880/ws/test');
            connection.onopen = onopen
            connection.binaryType = 'arraybuffer';
        }
    }
}
function onopen (event) {
    sendBuffer('hi server')
}
function sendBuffer(b) {
    connection.send(b);
}
connect()

// Get access to the camera!
if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Not adding `{ audio: true }` since we only want video now
    navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
        video.src = window.URL.createObjectURL(stream);
        video.play();

    });
}


document.getElementById("snap").addEventListener("click", function() {
    context.drawImage(video, 0, 0, 640, 480);
    var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    var data = imageData.data;
    var buffer = data.buffer; // arraybuffer
    sendBuffer(buffer)
    console.log(data)
});


/* Legacy code below: getUserMedia 
else if(navigator.getUserMedia) { // Standard
    navigator.getUserMedia({ video: true }, function(stream) {
        video.src = stream;
        video.play();
    }, errBack);
} else if(navigator.webkitGetUserMedia) { // WebKit-prefixed
    navigator.webkitGetUserMedia({ video: true }, function(stream){
        video.src = window.webkitURL.createObjectURL(stream);
        video.play();
    }, errBack);
} else if(navigator.mozGetUserMedia) { // Mozilla-prefixed
    navigator.mozGetUserMedia({ video: true }, function(stream){
        video.src = window.URL.createObjectURL(stream);
        video.play();
    }, errBack);
}
*/