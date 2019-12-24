(function() {
    var dr;
    var canvas = document.getElementById("cas"),
        context = canvas.getContext('2d');
    var focallength = 250, index = 0;
    var img = new Image();
    var pause = false;
    var dots = [];
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var RAF = (function() {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
            return window.setTimeout(callback, 1000 / 60);
        };
    })();
    var Dot = function(centerX, centerY, centerZ, radius, color) {
        this.dx = centerX;
        this.dy = centerY;
        this.dz = centerZ;
        this.tx = 0;
        this.ty = 0;
        this.tz = 0;
        this.z = centerZ;
        this.x = centerX;
        this.y = centerY;
        this.radius = radius;
        this.color = color;
    };
    Dot.prototype = {
        paint: function() {
            context.save();
            var scale = (this.z + focallength) / (2 * focallength);
            var scale = 1;
            context.fillStyle = "rgba(" + this.color.a + "," + this.color.b + "," + this.color.c + "," + scale + ")";
            // context.fillStyle="#ffffff";
            context.fillRect(canvas.width / 2 + (this.x - canvas.width / 2), canvas.height / 2 + (this.y - canvas.height / 2), 2, 2)
            context.restore();
        }
    };
    Array.prototype.forEach = function(callback) {
        for (var i = 0; i < this.length; i++) {
            callback.call(this[i]);
        }
    };
    $('.tree').click(function() {
        derection = !derection;
        drawText();
    })
    function drawText() {
        dr = 3;
        context.clearRect(0, 0, canvas.width, canvas.height);
        var text = "Merry Christmas";
        for (var i = 0; i < text.length; i++) {
            context.save();
            var fontSize = Math.random() * 100 + 100;
            fontSize = canvas.width / 12;
            context.font = fontSize + "px bold";
            context.textAlign = "center";
            context.textBaseline = "middle";
            var code = text.charAt(i);
            context.fillStyle = "rgba(" + parseInt(Math.random() * 125 + 130) + "," + parseInt(Math.random() * 125 + 130) + "," + parseInt(Math.random() * 125 + 130) + " , 1)";
            // context.fillStyle="#ffffff";
            if (!derection) {
                context.fillStyle="#ffffff";
            }
            context.fillText(code, canvas.width / 2 - ((text.length / 2 - i) * fontSize / 1.5), canvas.height / 2);
            context.restore();
        }
        dots = getimgData();
        initAnimate();
    }
    var lastTime;
    function initAnimate() {
        dots.forEach(function() {
            this.x = getRandom(0, canvas.width);
            this.y = getRandom(0, canvas.height);
            this.z = getRandom(-focallength, focallength);
            this.tx = getRandom(0, canvas.width);
            this.ty = getRandom(0, canvas.height);
            this.tz = getRandom(-focallength, focallength);
        });
        dots.sort(function(a, b) {
            return b.z - a.z;
        });
        dots.forEach(function() {
            this.paint();
        });
        lastTime = new Date();
        animate();
    }
    var derection = true;
    function animate() {
        var thisTime = +new Date();
        context.save();
        context.globalCompositeOperation = 'destination-out';
        // context.globalAlpha = 0.1;
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.restore();
        var sulv = 0.04;
        dots.forEach(function() {
            var dot = this;
            if (derection) {
                if (Math.abs(dot.dx - dot.x) < 0.1 && Math.abs(dot.dy - dot.y) < 0.1 && Math.abs(dot.dz - dot.z) < 0.1) {
                    dot.x = dot.dx;
                    dot.y = dot.dy;
                    dot.z = dot.dz;
                    // if (thisTime - lastTime > 300) derection = false;
                } else {
                    dot.x = dot.x + (dot.dx - dot.x) * sulv;
                    dot.y = dot.y + (dot.dy - dot.y - 200) * sulv;
                    dot.z = dot.z + (dot.dz - dot.z) * sulv;
                    lastTime = +new Date()
                }
            }
            else {
                if (Math.abs(dot.tx - dot.x) < 0.1 && Math.abs(dot.ty - dot.y) < 0.1 && Math.abs(dot.tz - dot.z) < 0.1) {
                    dot.x = dot.tx;
                    dot.y = dot.ty;
                    dot.z = dot.tz;
                } else {
                    dot.x = dot.x + (dot.tx - dot.x) * sulv;
                    dot.y = dot.y + (dot.ty - dot.y) * sulv;
                    dot.z = dot.z + (dot.tz - dot.z) * sulv;
                }
            }
        });
        dots.sort(function(a, b) {
            return b.z - a.z;
        });
        dots.forEach(function() {
            this.paint();
        });

        RAF(animate)
        // context.clearRect(0, 0, canvas.width, canvas.height);
    }
    function getRandom(a, b) {
        return Math.random() * (b - a) + a
    }
    function getimgData() {
        console.log(canvas.width + ", " + canvas.height);
        var imgData = context.getImageData(0, 0, canvas.width, canvas.height);
        context.clearRect(0, 0, canvas.width, canvas.height);
        var dots = [];
        var canbreak = false;
        for (var x = 0; x < imgData.width; x += dr) {
            for (var y = 0; y < imgData.height; y += dr) {
                var i = (y * imgData.width + x) * 4;
                if (imgData.data[i + 3] > 128) {
                    var dot = new Dot(x - dr, y - dr, 0, dr, {
                        a: imgData.data[i],
                        b: imgData.data[i + 1],
                        c: imgData.data[i + 2]
                    });
                    dots.push(dot);
                }
            }
        }
        console.log(dots.length)
        return dots;
    }
}())