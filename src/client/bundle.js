"use strict";

function mouseXElement(element) {
    return mouseX - element.getBoundingClientRect().left;
}
function mouseYElement(element) {
    return mouseY - element.getBoundingClientRect().top;
}
Math.clamp = function (value, min, max) {
    if (value < min) {
        return min;
    } else if (value > max) {
        return max;
    } else {
        return value;
    }
};
function hslToRgb(h, s, l) {
    var r, g, b;

    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        var hue2rgb = function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function rgbToHsv(r, g, b) {
    r /= 255, g /= 255, b /= 255;

    var max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    var h,
        s,
        v = max;

    var d = max - min;
    s = max == 0 ? 0 : d / max;

    if (max == min) {
        h = 0; // achromatic
    } else {
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);break;
            case g:
                h = (b - r) / d + 2;break;
            case b:
                h = (r - g) / d + 4;break;
        }

        h /= 6;
    }

    return [h, s, v];
}
function hsv2hsl(h, s, v) {
    var hsl = [0, 0, 0];
    hsl[0] = h;
    hsl[2] = (2 - s) * v;
    hsl[1] = s * v;
    hsl[1] /= hsl[2] <= 1 ? hsl[2] : 2 - hsl[2];
    hsl[2] /= 2;

    return hsl;
}
Array.prototype.max = function () {
    return Math.max.apply(null, this);
};

Array.prototype.min = function () {
    return Math.min.apply(null, this);
};

function percentify(x, d) {
    return (x * 100).toFixed(d) + "%";
}

var Color = function Color(startR, startG, startB, startA) {
    this.getRGB = function () {
        return "rgb(" + Math.floor(this._r) + "," + Math.floor(this._g) + "," + Math.floor(this._b) + ")";
    };

    this.getRGBA = function () {
        return "rgba(" + Math.floor(this._r) + "," + Math.floor(this._g) + "," + Math.floor(this._b) + "," + Number(this._a.toFixed(2)) + ")";
    };

    this.getHex = function () {
        return "#" + ("0" + Math.floor(this._r).toString(16)).slice(-2) + ("0" + Math.floor(this._g).toString(16)).slice(-2) + ("0" + Math.floor(this._b).toString(16)).slice(-2);
    };

    this.getHSV = function () {
        return "hsv(" + this.getHue().toFixed(1) + ", " + percentify(this.getHSVSaturation(), 1) + ", " + percentify(this.getValue(), 1) + ")";
    };

    this.getHSVA = function () {
        return "hsva(" + this.getHue().toFixed(1) + ", " + percentify(this.getHSVSaturation(), 1) + ", " + percentify(this.getValue(), 1) + ", " + this._a.toFixed(3) + ")";
    };

    this.getHSL = function () {
        return "hsl(" + this.getHue().toFixed(1) + ", " + percentify(this.getHSLSaturation(), 1) + ", " + percentify(this.getLightness(), 1) + ")";
    };

    this.getHSLA = function () {
        return "hsla(" + this.getHue().toFixed(1) + ", " + percentify(this.getHSLSaturation(), 1) + ", " + percentify(this.getLightness(), 1) + ", " + this._a.toFixed(3) + ")";
    };

    this.getRed = function () {
        return this._r;
    };

    this.getGreen = function () {
        return this._g;
    };

    this.getBlue = function () {
        return this._b;
    };

    this.getAlpha = function () {
        return this._a;
    };

    this.getHue = function () {
        var color = [this._r / 255, this._g / 255, this._b / 255];
        var min = color.min();
        var max = color.max();
        var delta = max - min;

        var hue;

        if (!delta) {
            hue = 0;
        } else if (max == color[0]) {
            hue = 60 * ((color[1] - color[2]) / (max - min) % 6);
        } else if (max == color[1]) {
            hue = 60 * (2 + (color[2] - color[0]) / (max - min));
        } else {
            hue = 60 * (4 + (color[0] - color[1]) / (max - min));
        }

        return hue >= 0 ? hue : hue + 360;
    };

    this.getHSVSaturation = function () {
        var color = [this._r / 255, this._g / 255, this._b / 255];
        var min = color.min();
        var max = color.max();
        var delta = max - min;

        if (!max) {
            return 0;
        } else {
            return delta / max;
        }
    };

    this.getHSLSaturation = function () {
        var color = [this._r / 255, this._g / 255, this._b / 255];
        var min = color.min();
        var max = color.max();
        var delta = max - min;

        if (!delta) {
            return 0;
        } else {
            return delta / (1 - Math.abs(max + min - 1));
        }
    };

    this.getValue = function () {
        return [this._r / 255, this._g / 255, this._b / 255].max();
    };

    this.getLightness = function () {
        var color = [this._r / 255, this._g / 255, this._b / 255];

        return (color.max() + color.min()) / 2;
    };

    this.setRGB = function (r, g, b) {
        this.setRed(r);
        this.setGreen(g);
        this.setBlue(b);
    };

    this.setRGBA = function (r, g, b, a) {
        this.setRGB(r, g, b);
        this.setAlpha(a);
    };

    this.setRed = function (r) {
        this._r = this._fixRGB(r);
    };

    this.setGreen = function (g) {
        this._g = this._fixRGB(g);
    };

    this.setBlue = function (b) {
        this._b = this._fixRGB(b);
    };

    this.setAlpha = function (a) {
        if (a === undefined) {
            a = 1;
        }

        if (a < 0) {
            a = 0;
        } else if (a > 1) {
            a = 1;
        }

        this._a = a;
    };

    this._fixRGB = function (x) {
        if (x < 0) {
            return 0;
        } else if (x > 255) {
            return 255;
        } else {
            return x;
        }
    };

    this.setHex = function (code) {
        if (code.charAt(0) != "#") {
            code = "#" + code;
        }

        if (code.length == 4) {
            this.setRGB(parseInt(code.slice(1, 2), 16) * 17, parseInt(code.slice(2, 3), 16) * 17, parseInt(code.slice(3, 4), 16) * 17);
        } else if (code.length == 7) {
            this.setRGB(parseInt(code.slice(1, 3), 16), parseInt(code.slice(3, 5), 16), parseInt(code.slice(5, 7), 16));
        }
    };

    this.setHSV = function (h, s, v) {
        this._setCylindrical(true, h, s, v);
    };

    this.setHSVA = function (h, s, v, a) {
        this.setHSV(h, s, v);
        this.setAlpha(a);
    };

    this.setHSL = function (h, s, l) {
        this._setCylindrical(false, h, s, l);
    };

    this.setHSLA = function (h, s, l, a) {
        this.setHSL(h, s, l);
        this.setAlpha(a);
    };

    this.setHue = function (h) {
        this._setCylindrical(true, h, this.getHSVSaturation(), this.getValue());
    };

    this.setHSVSaturation = function (s) {
        this._setCylindrical(true, this.getHue(), s, this.getValue());
    };

    this.setHSLSaturation = function (s) {
        this._setCylindrical(false, this.getHue(), s, this.getLightness());
    };

    this.setValue = function (v) {
        this._setCylindrical(true, this.getHue(), this.getHSVSaturation(), v);
    };

    this.setLightness = function (l) {
        this._setCylindrical(false, this.getHue(), this.getHSLSaturation(), l);
    };

    this._setCylindrical = function (isHSV, h, x, y) {
        while (h < 0) {
            h += 360;
        }
        while (h >= 360) {
            h -= 360;
        }

        if (x < 0) {
            x = 0;
        } else if (x > 1) {
            x = 1;
        }

        if (y < 0) {
            y = 0;
        } else if (y > 1) {
            y = 1;
        }

        var a = isHSV ? y * x : (1 - Math.abs(2 * y - 1)) * x;
        var b = a * (1 - Math.abs(h / 60 % 2 - 1));
        var c = isHSV ? y - a : y - a / 2;

        var colors;

        if (h < 60) {
            colors = [a, b, 0];
        } else if (h < 120) {
            colors = [b, a, 0];
        } else if (h < 180) {
            colors = [0, a, b];
        } else if (h < 240) {
            colors = [0, b, a];
        } else if (h < 300) {
            colors = [b, 0, a];
        } else {
            colors = [a, 0, b];
        }

        this.setRGB((colors[0] + c) * 255, (colors[1] + c) * 255, (colors[2] + c) * 255);
    };

    this.setRGBA(startR, startG, startB, startA);
};

function hermite(t, points, tangents, knots, derivative, result) {

    var n = points.length; // number or points / tangents / knots
    var d = points[0].length; // vector dimensionality
    var v = result || new Array(d); // destination vector

    if (knots) {
        // find knot interval for t
        for (var i = 0; i < n - 1; i++) {
            if (t >= knots[i] && t <= knots[i + 1]) {
                break;
            }
        }

        if (i === n - 1) throw new Error('out of bounds');

        var i0 = i;
        var i1 = i + 1;
        var k0 = knots[i0];
        var k1 = knots[i1];
        var scale = k1 - k0;

        t = (t - k0) / scale;
    } else {

        var t = t * (n - 1); // rescale t to [0, n-1]
        var i0 = t | 0; // truncate
        var i1 = i0 + 1;

        if (i0 > n - 1) throw new Error('out of bounds');
        if (i0 === n - 1) i1 = i0;

        var scale = i1 - i0;

        t = (t - i0) / scale;
    }

    if (derivative) {
        var t2 = t * t;
        var h00 = 6 * t2 - 6 * t;
        var h10 = 3 * t2 - 4 * t + 1;
        var h01 = -6 * t2 + 6 * t;
        var h11 = 3 * t2 - 2 * t;
    } else {
        var t2 = t * t;
        var it = 1 - t;
        var it2 = it * it;
        var tt = 2 * t;
        var h00 = (1 + tt) * it2;
        var h10 = t * it2;
        var h01 = t2 * (3 - tt);
        var h11 = t2 * (t - 1);
    }

    for (var i = 0; i < d; i++) {
        v[i] = h00 * points[i0][i] + h10 * tangents[i0][i] * scale + h01 * points[i1][i] + h11 * tangents[i1][i] * scale;
    }

    return v;
}

var stopwatchEventStartTimes = {};
var stopwatch = {
    start: function start(name) {
        stopwatchEventStartTimes[name] = window.performance.now();
    },
    end: function end(name) {
        console.log("Timer '" + name + "' took " + (window.performance.now() - stopwatchEventStartTimes[name]).toFixed(3) + "ms.");
        delete stopwatchEventStartTimes[name];
    }
};

function getNormalizedAngleDelta(alpha, beta) {
    var difference = alpha - beta;
    if (beta - alpha < -Math.PI) {
        difference -= Math.PI * 2;
    } else if (difference < -Math.PI) {
        difference += Math.PI * 2;
    }
    return difference;
}
function AudioObject(url, onLoad) {
    var self = this;

    this.audio = document.createElement("audio");
    this.audio.src = url;

    this.loadClock = function (onLoad) {
        this.loadInterval = setInterval(function () {
            if (self.audio.readyState == 4) {
                onLoad();
                clearInterval(self.loadInterval);
            }
        });
    };

    if (onLoad) {
        this.loadClock(onLoad);
    }

    this.getSrc = function () {
        return this.audio.src;
    };

    this.setSrc = function () {
        return this;
    };

    this.getCurrentTime = function () {
        return this.audio.currentTime;
    };

    this.setCurrentTime = function (secs, onSet) {
        var currentTime = this.getCurrentTime();
        this.audio.currentTime = secs;
        if (onSet) {
            if (currentTime != secs) {
                this.currentTimeSetInterval = setInterval(function () {
                    if (self.getCurrentTime() != currentTime) {
                        onSet();
                        clearInterval(self.currentTimeSetInterval);
                    }
                });
            } else {
                onSet();
            }
        }
        return this;
    };

    this.getDuration = function () {
        return this.audio.duration;
    };

    this.getMuteState = function () {
        return this.audio.muted;
    };

    this.mute = function () {
        this.audio.muted = true;
        return this;
    };

    this.unmute = function () {
        this.audio.muted = false;
        return this;
    };

    this.getPlaybackRate = function () {
        return this.audio.playbackRate;
    };

    this.setPlaybackRate = function (rate) {
        this.audio.playbackRate = rate;
        return this;
    };

    this.getVolume = function () {
        return this.audio.volume;
    };

    this.setVolume = function (volume) {
        this.audio.volume = volume;
        return this;
    };

    this.getLoopState = function () {
        return this.audio.loop;
    };

    this.loop = function () {
        this.audio.loop = true;
        return this;
    };

    this.noLoop = function () {
        this.audio.loop = false;
        return this;
    };

    this.play = function (onPlay) {
        var timeAtCall = this.audio.currentTime;
        this.audio.play();
        if (onPlay) {
            this.playInterval = setInterval(function () {
                if (self.audio.currentTime != timeAtCall) {
                    onPlay();
                    clearInterval(self.playInterval);
                }
            });
        }
        return true;
    };

    this.pause = function (onPause) {
        this.audio.pause();
        if (onPause) {
            onPause();
        }
        return true;
    };

    this.stop = function (onStop) {
        this.pause();
        this.setCurrentTime(0);
        if (onStop) {
            onStop();
        }
        return true;
    };

    this.restart = function (onRestart) {
        this.stop();
        this.play(onRestart);
        return true;
    };

    this.playFrom = function (secs, onPlay) {
        this.setCurrentTime(secs, function () {
            self.play(onPlay);
        });
        return this.audio.currentTime;
    };

    this.goTo = function (secs, onArrival) {
        var arrivalTime = this.audio.currentTime = secs;
        if (onArrival && !this.audio.paused) {
            this.goToInterval = setInterval(function () {
                if (self.audio.currentTime != arrivalTime) {
                    onArrival();
                    clearInterval(self.goToInterval);
                }
            });
        }
        return this.audio.currentTime;
    };
}
"use strict";

var connectingToLobby = false;
var connected = false;
var communicator = {};
var socket = new WebSocket("ws://" + window.location.hostname + ":1337/");

communicator.sendPingRequest = function () {
    var COMMAND_ID = 255;

    socket.send(formatter.toUByte(COMMAND_ID));
};
var pingDisplay = document.getElementById("pingDisplay");
var pingClock = void 0;
var pingRequestSendTime = void 0;
function pinger() {
    communicator.sendPingRequest();
    pingRequestSendTime = window.performance.now();
}

socket.onopen = function () {
    connected = true;
    socket.onmessage = serverCommandHandler;
    pinger();
};

socket.onclose = function () {
    connected = false;
    clearTimeout(pingClock);
};

communicator.getLobbyJoinInfo = function (data) {

    console.log(data);

    var info = {
        lobbyID: formatter.fromUTribyte(data.slice(1, 4)),
        width: formatter.fromUShort(data.slice(4, 6)),
        height: formatter.fromUShort(data.slice(6, 8)),
        candraw: data.slice(0, 1)
    };

    if (info.candraw == "t") {
        console.log("fucccboi");
        amspectator = false;
    } else {
        amspectator = true;
        document.getElementById("utensils").style.display = "none";
    }

    var redrawInstructionsLength = formatter.fromUTribyte(data.slice(8, 11));
    var redrawInstructionsRaw = data.slice(11, 11 + redrawInstructionsLength);
    var redrawInstructions = [];

    while (redrawInstructionsRaw.length) {
        var redrawInstructionLength = formatter.fromUTribyte(redrawInstructionsRaw.slice(0, 3));
        var redrawInstructionRaw = redrawInstructionsRaw.slice(3, 3 + redrawInstructionLength);
        var redrawInstruction = [formatter.fromUByte(redrawInstructionRaw.slice(0, 1)), formatter.fromUByte(redrawInstructionRaw.slice(1, 2)), communicator.getRGBAStr(redrawInstructionRaw.slice(2, 6))];

        var points = [];
        for (var i = 0; i < (redrawInstructionLength - 6) / 4; i++) {
            points.push([formatter.fromSShort(redrawInstructionRaw.slice(6 + i * 4, 6 + i * 4 + 2)), formatter.fromSShort(redrawInstructionRaw.slice(8 + i * 4, 8 + i * 4 + 2))]);
        }
        redrawInstruction.unshift(points);
        redrawInstructions.push(redrawInstruction);

        redrawInstructionsRaw = redrawInstructionsRaw.slice(redrawInstructionLength + 3);
    }

    info.redrawInstructions = redrawInstructions;
    data = data.slice(8 + redrawInstructionsLength + 3);

    var paletteLength = formatter.fromUByte(data.slice(0, 1));
    var paletteRaw = data.slice(1, 1 + paletteLength * 4);
    var palette = [];

    for (var _i = 0; _i < paletteLength; _i++) {
        palette.push(communicator.getRGBAStr(paletteRaw.slice(_i * 4, _i * 4 + 4)));
    }

    info.palette = palette;
    data = data.slice(1 + paletteLength * 4);

    info.bgColor = data;

    return info;
};
communicator.getPalette = function (data) {
    var palette = [];

    for (var i = 0; i < data.length / 4; i++) {
        palette.push(communicator.getRGBAStr(data.slice(i * 4, i * 4 + 4)));
    }

    return palette;
};
function serverCommandHandler(event) {
    var commandID = event.data.charCodeAt(0);
    var data = event.data.slice(1);

    if (commandID === 0) {
        // Join lobby
        var info = communicator.getLobbyJoinInfo(data);

        console.log(info);

        joinLobby(info.width, info.height, info.bgColor);
        lobbyID = info.lobbyID;

        var startTime = window.performance.now();
        processRedrawingInstructions(info.redrawInstructions);
        palette = info.palette;
        updatePalette();
        requestAnimationFrame(updatePlayerCanvas);
        console.log("Joined lobby in " + (window.performance.now() - startTime).toFixed(3) + "ms (" + event.data.length / 1000 + "kB).");

        idDisplayP.innerHTML = "Lobby ID: <span class='lobbyIDHighlight'><b style='user-select:text;'>" + lobbyID + "</b></span>";
        socket.onmessage = serverCommandHandler;
    } else if (commandID === 1) {
        // Incorrect lobby ID
        alert("That lobby does not exist!");
        connectingToLobby = false;
    } else if (commandID === 2) {
        // Player update
        handlePlayerUpdate(data);
    } else if (commandID === 3) {
        // Player disconnect
        delete playerData[formatter.fromUInt(data)];
    } else if (commandID === 4) {
        // Line instruction
        handleLineInstruction(data);
        updatePlayerCanvas();
    } else if (commandID === 5) {
        // Palette update
        palette = communicator.getPalette(data);
        updatePalette();
    } else if (commandID === 6) {
        // Lobby full
        alert("Lobby Full");
        connectingToLobby = false;
    } else if (commandID === 255) {
        // Ping
        var roundTripTime = Math.ceil(window.performance.now() - pingRequestSendTime);

        pingDisplay.innerHTML = roundTripTime + "ms";
        pingClock = setTimeout(pinger, Math.max(500, 1000 - roundTripTime));
    }
}

communicator.getPlayerUpdateInfo = function (data) {
    return {
        playerID: formatter.fromUInt(data.slice(0, 4)),
        x: formatter.fromSShort(data.slice(4, 6)),
        y: formatter.fromSShort(data.slice(6, 8)),
        type: formatter.fromUByte(data.slice(8, 9)),
        size: formatter.fromUByte(data.slice(9, 10)),
        color: communicator.getRGBAStr(data.slice(10, 14))
    };
};
function handlePlayerUpdate(updateData) {
    var info = communicator.getPlayerUpdateInfo(updateData);

    playerData[info.playerID] = info;
    updatePlayerCanvas();
}

function joinLobby(width, height, backgroundColor) {
    bgColor = backgroundColor;

    controls.style.display = "none";
    writingUtensils.style.display = "inline-block";
    optionPanel.style.display = "none";

    canvas.setAttribute("width", width);
    canvas.setAttribute("height", height);
    playerCanvas.setAttribute("width", width);
    playerCanvas.setAttribute("height", height);
    canvasholder.style.height = height + "px";
    canvasholder.style.width = width + "px";

    ctx = canvas.getContext("2d");
    playerCtx = playerCanvas.getContext("2d");

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    currentUI = "draw";
}
"use strict";

var controls = document.getElementById("controls");
var createLobbyBtn = document.getElementById("createLobby");
var writingUtensils = document.getElementById("writingUtensils");
var submitIDBtn = document.getElementById("submitId");
var lobbyIDInput = document.getElementById("lobbyId");
var canvas = document.getElementById("mainCanvas");
var playerCanvas = document.getElementById("playerCanvas");
var idDisplayP = document.getElementById("idDisplay");
var pencilRadio = document.getElementById("pencil");
var rubberRadio = document.getElementById("rubber");
var brushRadio = document.getElementById("brush");
var penRadio = document.getElementById("pen");
var sizeSlider = document.getElementById("sizeSlider");
var optionPanel = document.getElementById("options");
var createLobbyConfirm = document.getElementById("createLobbyConfirm");
var createLobbyWidth = document.getElementById("createLobbyWidth");
var createLobbyHeight = document.getElementById("createLobbyHeight");
var createLobbyBgColor = document.getElementById("createLobbyBgColor");
var createLobbyClose = document.getElementById("createLobbyClose");
var createLobbyPlayers = document.getElementById("createLobbyPlayers");
var createLobbySpecBool = document.getElementById("spectatorsBool");
var canvasholder = document.getElementById("canvases");
var colorPickContainer = document.getElementById("colorpick");
var openColorPickButton = document.getElementById("openColorPickMenu");
var closeColorPickButton = document.getElementById("colorpickclose");
var eyeDropSelect = document.getElementById("eyeDrop");

var validationClock = void 0;
var ctx = null;
var playerCtx = null;
var bgColor = null;
var mouseX = 0,
    mouseY = 0,
    isDrawing = false;
var lastPosition = { x: 0, y: 0 };
var currColor = "rgba(0,0,0,1)";
var brushSize = Number(sizeSlider.value);
var r = Math.round;
var lobbyID = null;
var playerData = {};
var eyeDropperSelected = false;
var currentUI = "menu";
var currEyeDropperColor = null;
var palette = [];
var amspectator = void 0;

colorPickContainer.style.display = "none";

communicator.sendCursorUpdate = function (x, y, type, size, color) {
    var COMMAND_ID = 2;

    if (!color) color = "rbga(0,0,0,1)"; // Incase something goes wrong somewhere
    var message = formatter.toSShort(x) + formatter.toSShort(y) + formatter.toUByte(type) + formatter.toUByte(size) + communicator.getBinRGBA(color);

    socket.send(formatter.toUByte(COMMAND_ID) + message);
};
communicator.sendLineUpdate = function (x, y) {
    var COMMAND_ID = 4;

    var message = formatter.toSShort(x) + formatter.toSShort(y);

    socket.send(formatter.toUByte(COMMAND_ID) + message);
};
communicator.sendColorUpdate = function (color) {
    var COMMAND_ID = 6;

    socket.send(formatter.toUByte(COMMAND_ID) + communicator.getBinRGBA(color));
};

if (!amspectator) {
    document.addEventListener("mousemove", function (event) {
        mouseX = event.clientX;
        mouseY = event.clientY;

        var thisPosition = {
            x: r(mouseXElement(canvas)),
            y: r(mouseYElement(canvas))
        };

        if (isDrawing && !eyeDropperSelected && currentUI == "draw") {
            if (currentLines["localLine"] && !currentLines["localLine"].locallyBlocked) {
                currentLines["localLine"].extendLine(thisPosition);
            }
            communicator.sendLineUpdate(thisPosition.x, thisPosition.y);

            if (usingNewColor && (pencilRadio.checked || brushRadio.checked)) {
                // Send new color for palette update
                communicator.sendColorUpdate(currColor);
                usingNewColor = false;
            }
        }

        if (eyeDropperSelected) {
            // Update eyedropper's color based on pixel below it
            var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            var currentIndex = Math.clamp(thisPosition.x, 0, canvas.width) * 4 + Math.clamp(thisPosition.y, 0, canvas.height) * canvas.width * 4;
            currEyeDropperColor = "rgba(" + imageData.data[currentIndex] + "," + imageData.data[currentIndex + 1] + "," + imageData.data[currentIndex + 2] + ",1)";
            console.log(currEyeDropperColor);
        }

        if (connected && lobbyID) {
            // Send cursor information
            communicator.sendCursorUpdate(thisPosition.x, thisPosition.y, getCursorType(), brushSize, eyeDropperSelected ? currEyeDropperColor : currColor);
        }

        lastPosition = {
            x: mouseXElement(canvas),
            y: mouseYElement(canvas)
        };
    });
    document.addEventListener("mousedown", function () {
        if (eyeDropperSelected) {
            if (lastPosition.x >= 0 && lastPosition.x <= canvas.width && lastPosition.y >= 0 && lastPosition.y <= canvas.height) {
                if (currEyeDropperColor !== currColor) usingNewColor = true;
                updateColorPickerFromRGB(currEyeDropperColor);
                currColor = currEyeDropperColor;
            }

            eyeDropperSelected = false;
            justDisabledEyedropper = true;
            eyeDropSelect.style.border = "3px solid gray";
            eyeDropSelect.style.textShadow = "none";
            openColorPickButton.style.backgroundColor = currColor;
        }
    });
    communicator.sendLineCreation = function (x, y, type, size, color) {
        var COMMAND_ID = 3;

        var message = formatter.toSShort(x) + formatter.toSShort(y) + formatter.toUByte(type) + formatter.toUByte(size) + communicator.getBinRGBA(color);

        socket.send(formatter.toUByte(COMMAND_ID) + message);
    };
    canvas.addEventListener("mousedown", function () {
        isDrawing = true;

        if (!currentLines["localLine"] && !eyeDropperSelected && currentUI == "draw") {
            // If there's no localline
            addLine("localLine", lastPosition, getCursorType(), brushSize, currColor);
            communicator.sendLineCreation(lastPosition.x, lastPosition.y, getCursorType(), brushSize, currColor);
        }
    });
    communicator.sendLineEnd = function () {
        var COMMAND_ID = 5;

        socket.send(formatter.toUByte(COMMAND_ID));
    };
    document.addEventListener("mouseup", function () {
        isDrawing = false;
        if (currentLines["localLine"] && !currentLines["localLine"].locallyBlocked) {
            currentLines["localLine"].locallyBlocked = true;
            currentLines["localLine"].evolve();
            communicator.sendLineEnd();
        }

        setTimeout(function () {
            justDisabledEyedropper = false;
        });
    });
}
// Makes popups be closable
var popupCloseButtons = document.getElementsByClassName("fa fa-window-close fa-lg");

var _loop = function _loop(i) {
    popupCloseButtons[i].addEventListener("click", function () {
        popupCloseButtons[i].parentNode.parentNode.style.display = "none";
    });
};

for (var i = 0; i < popupCloseButtons.length; i++) {
    _loop(i);
}
createLobbyClose.addEventListener("click", function () {
    clearInterval(validationClock);
});
"use strict";

if (!amspectator) {
    var updateCanvas = function updateCanvas() {
        if (newHue) {
            var imageData = colorCtx.getImageData(0, 0, colorCanvas.width, colorCanvas.height);
            var rgbval = hslToRgb(colorSlider.value / 360, 1, 0.5);
            for (var y = 0; y < colorCanvas.height; ++y) {
                for (var x = 0; x < colorCanvas.width; ++x) {
                    var index = x * 4 + y * colorCanvas.width * 4;
                    var darknessFactor = 1 - y / colorCanvas.height;
                    var lightnessFactor = 1 - x / colorCanvas.width;
                    imageData.data[index] = (rgbval[0] * (1 - lightnessFactor) + 255 * lightnessFactor) * darknessFactor;
                    imageData.data[index + 1] = (rgbval[1] * (1 - lightnessFactor) + 255 * lightnessFactor) * darknessFactor;
                    imageData.data[index + 2] = (rgbval[2] * (1 - lightnessFactor) + 255 * lightnessFactor) * darknessFactor;
                    imageData.data[index + 3] = 255;
                }
            }
            colorCtx.putImageData(imageData, 0, 0);
            newHue = false;
        }

        if (newRGB) {
            alphaSliderCtx.globalAlpha = 1;
            for (var _x = 0; _x < Math.ceil((alphaSliderCanvas.width - 2) / 6) + 1; _x++) {
                for (var _y = 0; _y <= 2; _y++) {
                    alphaSliderCtx.fillStyle = (_x + _y) % 2 ? "#ededed" : "#cccccc";
                    alphaSliderCtx.fillRect(_x * 6 + 1, _y * 6, 6, 6);
                }
            }
            for (var _x2 = 0; _x2 < alphaSliderCanvas.width; _x2++) {
                alphaSliderCtx.globalAlpha = 1 - _x2 / alphaSliderCanvas.width;
                alphaSliderCtx.fillStyle = getRGBFromRGBA(currColor);
                alphaSliderCtx.fillRect(_x2, 0, 1, alphaSliderCanvas.height);
            }
            newRGB = false;
        }
        openColorPickButton.style.backgroundColor = currColor;
    };

    var updateColorPicker = function updateColorPicker() {
        var color = new Color();
        color.setHSV(colorSlider.value, circleX / colorCanvas.width, 1 - circleY / colorCanvas.height);

        if (!justPickedPalette) {
            color.setAlpha(1 - alphaSlider.value / 100);
            var newColor = color.getRGBA();

            if (newColor !== currColor) {
                usingNewColor = true;
                circleSelect.style.backgroundColor = getRGBFromRGBA(currColor);
                document.styleSheets[0].addRule('#alphaSlider input::-webkit-slider-thumb', "background: -webkit-linear-gradient(top, " + currColor + " 0%, " + currColor + " 24%,rgba(0,0,0,0) 25%,rgba(0,0,0,0) 75%," + currColor + " 76%," + currColor + " 100%);");
            }

            if (getRGBFromRGBA(newColor) !== getRGBFromRGBA(currColor)) {
                newRGB = true;
            }

            currColor = newColor;
        }

        circleSelect.style.transform = "translate(calc(-50% + " + circleX + "px), calc(-50% + " + circleY + "px))";
    };

    var colorUpdate = function colorUpdate(forceRerender) {
        // Updates all the stuff
        if (colorSlider.value != oldHueValue || newHue) {
            newHue = true;
            document.styleSheets[0].addRule('#colorSlider::-webkit-slider-thumb', "background-color: hsl(" + colorSlider.value + ", 100%, 50%);");
        }
        oldHueValue = colorSlider.value;

        updateColorPicker();

        if (forceRerender || newRGB) {
            newRGB = true;
            document.styleSheets[0].addRule('#alphaSlider input::-webkit-slider-thumb', "background: -webkit-linear-gradient(top, " + currColor + " 0%, " + currColor + " 24%,rgba(0,0,0,0) 25%,rgba(0,0,0,0) 75%," + currColor + " 76%," + currColor + " 100%);");
            circleSelect.style.backgroundColor = getRGBFromRGBA(currColor);
        }

        updateCanvas();
    };

    var updatePalette = function updatePalette() {
        recentColorContainer.innerHTML = "";

        var _loop = function _loop(_i) {
            var newPaletteEntry = document.createElement("div");
            newPaletteEntry.className = "recentColor";
            newPaletteEntry.style.backgroundColor = palette[_i];
            newPaletteEntry.addEventListener("click", function () {
                currColor = palette[_i];
                updateColorPickerFromRGB(palette[_i]);
                usingNewColor = true;
                justPickedPalette = true;
                newHue = newRGB = true; // Hehe nice syntax
            });
            paletteContainer.appendChild(newPaletteEntry);
        };

        for (var _i = 0; _i < palette.length; _i++) {
            _loop(_i);
        }
    };

    var updateColorPickerFromRGB = function updateColorPickerFromRGB(rgb) {
        var rgbaArr = rgb.slice(5).slice(0, -1).split(",");
        var hsv = rgbToHsv(rgbaArr[0], rgbaArr[1], rgbaArr[2]);
        colorSlider.value = hsv[0] * 360;
        circleX = hsv[1] * colorCanvas.width;
        circleY = (1 - hsv[2]) * colorCanvas.height;
        alphaSlider.value = (1 - rgbaArr[3]) * 100;
    };

    var getRGBFromRGBA = function getRGBFromRGBA(rgba) {
        var rgbaArr = rgba.slice(5).slice(0, -1).split(",");
        return "rgb(" + rgbaArr[0] + "," + rgbaArr[1] + "," + rgbaArr[2] + ")";
    };

    var getAlphaFromRGBA = function getAlphaFromRGBA(rgba) {
        var rgbaArr = rgba.slice(5).slice(0, -1).split(",");
        return rgbaArr[3];
    };

    var colorCanvas = document.getElementById("colorpickcanvas");
    var colorCtx = colorCanvas.getContext("2d");
    var sliderCanvas = document.getElementById("colorslidercanvas");
    var sliderCtx = sliderCanvas.getContext("2d");
    var colorSlider = document.getElementById("colorSlider");
    var circleSelect = document.getElementById("selectcircle");
    var paletteContainer = document.getElementById("recentColorContainer");
    var alphaSlider = document.getElementById("alphaSliderRange");
    var alphaSliderCanvas = document.getElementById("alphaslidercanvas");
    var alphaSliderCtx = alphaSliderCanvas.getContext("2d");
    var draggingColor = false;
    var usingNewColor = false;
    var justPickedPalette = false;
    var circleX = 0;
    var circleY = colorCanvas.height;
    var justDisabledEyedropper = false;
    var newHue = true;
    var newRGB = true;
    var oldHueValue = 0;

    communicator.getRGBAStr = function (str) {
        return "rgba(" + str.charCodeAt(0) + "," + str.charCodeAt(1) + "," + str.charCodeAt(2) + "," + str.charCodeAt(3) / 255 + ")";
    };
    communicator.getBinRGBA = function (str) {
        var rgbaArr = str.slice(5).slice(0, -1).split(",");
        return formatter.toUByte(rgbaArr[0]) + formatter.toUByte(rgbaArr[1]) + formatter.toUByte(rgbaArr[2]) + formatter.toUByte(Math.round(rgbaArr[3] * 255));
    };

    closeColorPickButton.addEventListener("click", function () {
        clearInterval(colorUpdateClock);
        openColorPickButton.style.backgroundColor = currColor;
    });
    openColorPickButton.addEventListener("click", function () {
        colorUpdate(true);
        colorUpdateClock = setInterval(colorUpdate);
        colorPickContainer.style.display = "block";
        if (Math.random() <= 0.001) {
            document.querySelector("#colorpick h3").innerHTML = "Pick a collar..";
            document.body.style.background = "url(https://i.ytimg.com/vi/s0SBjdkautM/mqdefault.jpg) repeat";
            var audio = document.createElement("audio");
            new AudioObject("client/audio/succ.mp3").loop().play();
        }
    });
    colorCanvas.addEventListener("mousedown", function () {
        draggingColor = true;
        circleX = Math.min(colorCanvas.width, Math.max(0, mouseXElement(colorCanvas)));
        circleY = Math.min(colorCanvas.height, Math.max(0, mouseYElement(colorCanvas)));
        updateColorPicker();
    });

    window.addEventListener("mouseup", function () {
        draggingColor = false;
    });
    document.addEventListener("mousemove", function () {
        if (draggingColor) {
            justPickedPalette = false;
            circleX = Math.min(colorCanvas.width, Math.max(0, mouseXElement(colorCanvas)));
            circleY = Math.min(colorCanvas.height, Math.max(0, mouseYElement(colorCanvas)));
        }
    });

    colorSlider.addEventListener("mousedown", function () {
        justPickedPalette = false;
        colorUpdate(true);
    });
    alphaSlider.addEventListener("touchend", function () {
        justPickedPalette = false;
        colorUpdate(true);
    });

    eyeDropSelect.addEventListener("click", function () {
        if (!justDisabledEyedropper) {
            eyeDropSelect.style.border = "3px solid #2ECC40";
            eyeDropSelect.style.textShadow = "0px 0px 10px white";
            eyeDropperSelected = true;
        }
    });

    for (var i = 0; i < sliderCanvas.width; ++i) {
        sliderCtx.beginPath();
        sliderCtx.rect(i, 0, 1, sliderCanvas.height);
        sliderCtx.fillStyle = "hsl(" + i / sliderCanvas.width * 360 + ", 100%, 50%)";
        sliderCtx.fill();
    }


    var colorUpdateClock = void 0;
}
'use strict';

window.onload = addListeners();
var x_pos = 0,
    y_pos = 0,
    followedElement = null;

function addListeners() {
  var elements = document.getElementsByClassName('topbar');

  var _loop = function _loop(i) {
    elements[i].addEventListener('mousedown', function (event) {
      mouseDown(elements[i], event);
    }, false);
  };

  for (var i = 0; i < elements.length; ++i) {
    _loop(i);
  }
  window.addEventListener('mouseup', mouseUp, true);
  window.addEventListener("mousemove", mouseMove, false);
}

function mouseUp() {
  followedElement = null;
}

function mouseMove(e) {
  if (followedElement !== null) {
    divMove(followedElement, e);
  }
}

function mouseDown(elem, event) {
  var div = elem.parentNode;
  x_pos = event.clientX - div.offsetLeft;
  y_pos = event.clientY - div.offsetTop;
  followedElement = elem;
}

function divMove(elem, event) {
  var div = elem.parentNode;
  div.style.position = 'absolute';
  div.style.top = event.clientY - y_pos + 'px';
  div.style.left = event.clientX - x_pos + 'px';
}
"use strict";

var currentLines = {};

communicator.getLineStartInfo = function (data) {
    return {
        lineID: formatter.fromUTribyte(data.slice(0, 3)),
        x: formatter.fromSShort(data.slice(3, 5)),
        y: formatter.fromSShort(data.slice(5, 7)),
        type: formatter.fromUByte(data.slice(7, 8)),
        size: formatter.fromUByte(data.slice(8, 9)),
        color: communicator.getRGBAStr(data.slice(9, 13))
    };
};
communicator.getLineExtensionInfo = function (data) {
    return {
        lineID: formatter.fromUTribyte(data.slice(0, 3)),
        x: formatter.fromSShort(data.slice(3, 5)),
        y: formatter.fromSShort(data.slice(5, 7))
    };
};
function handleLineInstruction(instruction) {
    var lineCommandID = instruction.charCodeAt(0);
    var data = instruction.slice(1);

    if (lineCommandID === 0) {
        // New line
        var info = communicator.getLineStartInfo(data);

        addLine(info.lineID, { x: info.x, y: info.y }, info.type, info.size, info.color);
    } else if (lineCommandID === 1) {
        // Get own line ID from server
        var ownLineID = formatter.fromUTribyte(data);

        if (currentLines["localLine"]) {
            currentLines["localLine"].updateID(ownLineID);
            currentLines[ownLineID] = currentLines["localLine"];
        }
    } else if (lineCommandID === 2) {
        // Extend line
        var info = communicator.getLineExtensionInfo(data);
        currentLines[info.lineID].extendLine({ x: info.x, y: info.y });
    } else if (lineCommandID === 3) {
        var lineID = formatter.fromUTribyte(data);

        if (currentLines["localLine"] && currentLines["localLine"] === currentLines[lineID]) {
            delete currentLines["localLine"];
        } else {
            currentLines[lineID].evolve();
        }
    } else if (lineCommandID === 4) {
        // Combine line
        var lineID = formatter.fromUTribyte(data);

        currentLines[lineID].combine();
    }
    updatePlayerCanvas();
}

function processRedrawingInstructions(instructions) {
    for (var i = 0; i < instructions.length; i++) {
        var instruction = instructions[i];

        var points = [];
        for (var j = 0; j < instruction[0].length; j++) {
            points.push({ x: instruction[0][j][0], y: instruction[0][j][1] });
        }
        var line = new Line(null, points, instruction[1], instruction[2], instruction[3]);

        line.drawFinalLine(ctx);
    }
}

function addLine(id, startPoint, type, size, color) {
    if (!amspectator) {
        var newLine = new Line(id, [startPoint], type, size, color);
        newLine.createCanvas();

        currentLines[id] = newLine;
    }
}

function Line(id, points, type, size, color) {
    this.id = id;
    this.points = points;
    this.type = type;
    this.size = size;this.color = color;
    this.RGB = getRGBFromRGBA(color);
    this.alpha = getAlphaFromRGBA(color);
    this.locallyBlocked = false;

    this.createCanvas = function () {
        this.canvas = document.createElement("canvas");
        this.canvas.setAttribute("width", canvas.width);
        this.canvas.setAttribute("height", canvas.height);
        this.canvas.style.boxShadow = "0px 0px 25px rgba(238, 130, 238, 0.6)";
        if (this.type !== 1) this.canvas.style.opacity = this.alpha;
        typeof id === "number" ? this.setZIndexFromID(id) : this.canvas.style.zIndex = 900000;
        canvasholder.appendChild(this.canvas);

        this.ctx = this.canvas.getContext("2d");
    };

    this.setZIndexFromID = function (id) {
        this.canvas.style.zIndex = 2 + id;
    };

    this.updateID = function (id) {
        this.id = id;
        this.setZIndexFromID(id);
    };

    this.extendLine = function (newPoint) {
        this.points.push(newPoint);
        this.drawLastSegment();
    };

    this.drawLastSegment = function () {
        if (this.type === 4) {
            var width = this.size;
            this.setLineStyle(this.ctx, this.RGB);
            var p1 = this.points[this.points.length - 1];
            var p2 = this.points[this.points.length - 2];
            this.ctx.beginPath();
            this.ctx.moveTo(p1.x, p1.y - width / 2);
            this.ctx.lineTo(p1.x, p1.y + width / 2);
            this.ctx.lineTo(p2.x, p2.y + width / 2);
            this.ctx.lineTo(p2.x, p2.y - width / 2);
            this.ctx.closePath();
            this.ctx.fill();
        } else {
            this.ctx.beginPath();
            this.ctx.moveTo(this.points[this.points.length - 2].x, this.points[this.points.length - 2].y);
            this.ctx.lineTo(this.points[this.points.length - 1].x, this.points[this.points.length - 1].y);
            this.setLineStyle(this.ctx, this.RGB);
            this.ctx.stroke();
        }
    };

    this.setLineStyle = function (context, color) {
        context.lineCap = "round";
        context.lineJoin = "round";

        if (this.type === 0) {
            // pencil
            context.strokeStyle = color;
            context.lineWidth = this.size;
        } else if (this.type === 1) {
            // rubber
            context.strokeStyle = bgColor;
            context.lineWidth = this.size * 2;
        } else if (this.type === 2) {
            // brush
            if (this.points.length >= 2) {
                var dist = Math.hypot(this.points[this.points.length - 2].x - this.points[this.points.length - 1].x, this.points[this.points.length - 2].y - this.points[this.points.length - 1].y);
                context.strokeStyle = color;
                context.lineWidth = Math.max(1, Math.pow(0.935, dist) * this.size);
            }
        } else if (this.type === 4) {
            // pen
            context.strokeStyle = color;
        }
    };

    this.evolve = function () {
        if (this.type !== 1) {
            this.canvas.style.opacity = 1;

            this.ctx.clearRect(0, 0, canvas.width, canvas.height);

            this.drawFinalLine(this.ctx);
        }
    };

    this.drawFinalLine = function (context) {
        var calcedPoints = [];
        if (this.type === 1 || this.type === 4) {
            // Special treatment, as rubber shouldn't receive the hermite line modelling
            for (var i = 0; i < this.points.length; i++) {
                calcedPoints.push([this.points[i].x, this.points[i].y]);
            }
        } else {
            var _points = [];
            var tangents = [[0, 0]];

            for (var _i = 0; _i < this.points.length; _i++) {
                _points.push([this.points[_i].x, this.points[_i].y]);

                if (_i < this.points.length - 1 && _i > 0) {
                    var alpha = Math.atan2(this.points[_i].y - this.points[_i - 1].y, this.points[_i].x - this.points[_i - 1].x);
                    var beta = Math.atan2(this.points[_i + 1].y - this.points[_i].y, this.points[_i + 1].x - this.points[_i].x);
                    var difference = getNormalizedAngleDelta(alpha, beta);
                    var pheta = alpha - difference / 2;

                    var a = Math.hypot(this.points[_i + 1].x - this.points[_i].x, this.points[_i + 1].y - this.points[_i].y);
                    var b = Math.hypot(this.points[_i].x - this.points[_i - 1].x, this.points[_i].y - this.points[_i - 1].y);
                    var dist = (a + b) / 2;

                    tangents.push([Math.cos(pheta) * dist, Math.sin(pheta) * dist]);
                }
            }
            tangents.push([0, 0]);

            var lineLength = 0;
            var distances = [];

            for (var _i2 = 0; _i2 < this.points.length - 1; _i2++) {
                var _dist = Math.hypot(this.points[_i2 + 1].x - this.points[_i2].x, this.points[_i2 + 1].y - this.points[_i2].y);

                lineLength += _dist;
                if (this.type === 2) distances.push(_dist);
            }

            var intervalCount = lineLength / 5;
            var intervalSize = 1 / intervalCount;

            for (var t = 0; t <= 1; t += intervalSize) {
                calcedPoints.push(hermite(t, _points, tangents));
            }
        }

        this.setLineStyle(context, this.color);

        if (this.type === 2) {
            for (var _i3 = 0; _i3 < calcedPoints.length - 1; _i3++) {
                context.beginPath();
                context.moveTo(calcedPoints[_i3 + 1][0], calcedPoints[_i3 + 1][1]);
                context.lineTo(calcedPoints[_i3][0], calcedPoints[_i3][1]);

                var percentage = _i3 / (calcedPoints.length - 2);
                var respectivePoint = percentage * (this.points.length - 1);
                var currentDist = void 0;
                if (respectivePoint < 0.5) {
                    currentDist = distances[0];
                } else if (respectivePoint > this.points.length - 1 - 0.5) {
                    currentDist = distances[distances.length - 1];
                } else {
                    var midpoint = respectivePoint - 0.5;
                    var lower = Math.floor(midpoint);
                    currentDist = distances[lower] * (1 - (midpoint - lower)) + distances[Math.ceil(midpoint)] * (midpoint - lower); // Linear interpolation
                }

                context.lineWidth = Math.max(1, Math.pow(0.935, currentDist) * this.size);
                context.stroke();
            }
        } else if (this.type === 4) {
            var width = this.size;
            for (var _i4 = 0; _i4 < calcedPoints.length - 1; _i4++) {
                var p1 = calcedPoints[_i4];
                var p2 = calcedPoints[_i4 + 1];
                context.beginPath();
                context.moveTo(p1[0], p1[1] - width / 2);
                context.lineTo(p1[0], p1[1] + width / 2);
                context.lineTo(p2[0], p2[1] + width / 2);
                context.lineTo(p2[0], p2[1] - width / 2);
                context.closePath();
                context.fill();
            }
        } else if (this.type === 0 || this.type === 1) {
            context.beginPath();
            context.moveTo(calcedPoints[0][0], calcedPoints[0][1]);
            for (var _i5 = 1; _i5 < calcedPoints.length; _i5++) {
                context.lineTo(calcedPoints[_i5][0], calcedPoints[_i5][1]);
            }
            context.stroke();
        } else if (this.type === 3) {
            context.beginPath();
            lineDiff = this.size;
            context.moveTo(calcedPoints[0][0] - lineDiff, calcedPoints[0][1] - lineDiff);
            for (var _i6 = 1; _i6 < calcedPoints.length; _i6 + 2) {
                context.lineTo(calcedPoints[_i6][0] + lineDiff, calcedPoints[_i6][1] + lineDiff);
                context.lineTo(calcedPoints[_i6][0] - lineDiff, calcedPoints[_i6][1] - lineDiff);
            }
            context.stroke();
        }
    };

    this.combine = function () {
        ctx.drawImage(this.canvas, 0, 0);

        canvasholder.removeChild(this.canvas);

        if (currentLines["localLine"] && currentLines["localLine"].id === this.id) {
            console.log("Double delete LEL");
            delete currentLines["localLine"];
        }
        delete currentLines[this.id];
    };
}
"use strict";

sizeSlider.addEventListener("change", function () {
    brushSize = Number(sizeSlider.value);
});

dl.addEventListener("click", dlCanvas);
function dlCanvas() {
    var dt = canvas.toDataURL('image/png');
    this.download = "DrawTogether@" + lobbyID;
    this.href = dt;
};

function getCursorType() {
    var type = 0;
    if (rubberRadio.checked) {
        type = 1;
    } else if (brushRadio.checked) {
        type = 2;
    } else if (penRadio.checked) {
        type = 4;
    }
    if (eyeDropperSelected) {
        type = 3;
    }
    return type;
}

function updatePlayerCanvas() {
    playerCtx.clearRect(0, 0, playerCanvas.getAttribute("width"), playerCanvas.getAttribute("height"));

    for (var id in playerData) {
        renderPlayer(false, playerData[id].x, playerData[id].y, playerData[id].type, playerData[id].size, playerData[id].color);
    }
    renderPlayer(true, lastPosition.x, lastPosition.y, getCursorType(), brushSize, eyeDropperSelected ? currEyeDropperColor : currColor);

    requestAnimationFrame(updatePlayerCanvas);
}

function renderPlayer(isLocal, x, y, type, brushSize, color) {
    if (!isLocal) {
        playerCtx.globalAlpha = 0.5;
    } else {
        playerCtx.globalAlpha = 1;
    }
    if (type === 0) {
        playerCtx.beginPath();
        playerCtx.arc(x, y, brushSize / 2 + 3, 0, Math.PI * 2);
        playerCtx.fillStyle = color;
        playerCtx.fill();
        playerCtx.lineWidth = 1;
        playerCtx.strokeStyle = "ghostwhite";
        playerCtx.stroke();
    } else if (type === 1) {
        playerCtx.beginPath();
        playerCtx.arc(x, y, brushSize, 0, Math.PI * 2);
        playerCtx.lineWidth = 1;
        playerCtx.strokeStyle = "black";
        playerCtx.stroke();
    } else if (type === 2) {
        playerCtx.beginPath();
        playerCtx.ellipse(x, y, brushSize / 2 + 3, (brushSize / 2 + 3) / 2, -Math.PI / 4, 0, Math.PI * 2);
        playerCtx.fillStyle = color;
        playerCtx.fill();
        playerCtx.lineWidth = 1;
        playerCtx.strokeStyle = "ghostwhite";
        playerCtx.stroke();
    } else if (type === 3) {
        playerCtx.beginPath();
        playerCtx.moveTo(x - 8, y);
        playerCtx.lineTo(x + 8, y);
        playerCtx.strokeStyle = "black";
        playerCtx.lineWidth = 1;
        playerCtx.stroke();

        playerCtx.beginPath();
        playerCtx.moveTo(x, y - 8);
        playerCtx.lineTo(x, y + 8);
        playerCtx.stroke();

        playerCtx.beginPath();
        playerCtx.arc(x, y, 12, 0, Math.PI * 2);
        playerCtx.lineWidth = 8;
        playerCtx.stroke();
        playerCtx.strokeStyle = color;
        playerCtx.lineWidth = 6;
        playerCtx.stroke();
    } else if (type === 4) {
        playerCtx.beginPath();
        playerCtx.moveTo(x, y - brushSize / 2);
        playerCtx.lineTo(x + brushSize / 2, y - brushSize / 2);
        playerCtx.lineTo(x, y + brushSize / 2);
        playerCtx.lineTo(x - brushSize / 2, y + brushSize / 2);
        playerCtx.closePath();
        playerCtx.fillStyle = color;
        playerCtx.fill();
    }
}
"use strict";

createLobbyBtn.addEventListener("click", function () {
    optionPanel.style.display = "block";
    optionPanel.getElementsByClassName("popup")[0].style.left = "50%";
    optionPanel.getElementsByClassName("popup")[0].style.top = "50%";
    validationClock = setInterval(validateCreateLobby, 0);
});
createLobbyConfirm.addEventListener("click", function () {
    if (validateCreateLobby()) {
        var spectatorsSendable = void 0;
        if (spectatorsBool.checked) {
            spectatorsSendable = "t";
        } else {
            spectatorsSendable = "f";
        }
        createLobbyRequest(parseInt(createLobbyWidth.value), parseInt(createLobbyHeight.value), createLobbyBgColor.value, parseInt(createLobbyPlayers.value), spectatorsSendable);
        clearInterval(validationClock);
    }
});
submitIDBtn.addEventListener("click", function () {
    joinLobbyRequest(Number(lobbyIDInput.value));
});
createLobbyBgColor.addEventListener("keydown", function () {
    setTimeout(function () {
        createLobbyBgColor.style.borderColor = createLobbyBgColor.value;
    }, 16);
});
function validateCreateLobby() {
    if (Number(createLobbyWidth.value) >= 256 && Number(createLobbyHeight.value) >= 256 && Number(createLobbyWidth.value) <= 16384 && Number(createLobbyHeight.value) <= 16384 && Number(createLobbyPlayers.value) <= 12 && Number(createLobbyPlayers.value) >= 1) {
        createLobbyConfirm.disabled = false;
        createLobbyWidth.style.background = "white";
        createLobbyHeight.style.background = "white";
        createLobbyConfirm.style.opacity = 1;
        return true;
    } else {
        createLobbyConfirm.disabled = true;
        createLobbyWidth.style.background = "red";
        createLobbyHeight.style.background = "red";
        createLobbyConfirm.style.opacity = 0.333;
        return false;
    }
}

communicator.sendCreateLobbyRequest = function (width, height, bgColor, playernumber, spectators) {
    var COMMAND_ID = 0;

    var message = formatter.toUByte(COMMAND_ID) + formatter.toUShort(width) + formatter.toUShort(height) + formatter.toUShort(playernumber) + spectators + bgColor;
    console.log(message);

    socket.send(message);
};
function createLobbyRequest(width, height, bgColor, playernumber, spectators) {
    if (connected && !connectingToLobby) {
        connectingToLobby = true;

        communicator.sendCreateLobbyRequest(width, height, bgColor, playernumber, spectators);
    }
}

communicator.sendJoinLobbyRequest = function (lobbyID) {
    var COMMAND_ID = 1;

    var message = formatter.toUByte(COMMAND_ID) + formatter.toUTribyte(lobbyID);

    socket.send(message);
};
function joinLobbyRequest(ID) {
    if (connected && !connectingToLobby) {
        connectingToLobby = true;

        communicator.sendJoinLobbyRequest(ID);
    }
}
