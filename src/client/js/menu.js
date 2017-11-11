createLobbyBtn.addEventListener("click", function() {
    optionPanel.style.display = "block";
    optionPanel.getElementsByClassName("popup")[0].style.left = "50%";
    optionPanel.getElementsByClassName("popup")[0].style.top = "50%";
    validationClock = setInterval(validateCreateLobby, 0);
});
createLobbyConfirm.addEventListener("click", function() {
    if (validateCreateLobby()) {
        let spectatorsSendable;
        if (spectatorsBool.checked) {
            spectatorsSendable = "t";
        } else {
            spectatorsSendable = "f";
        }
        createLobbyRequest(parseInt(createLobbyWidth.value), parseInt(createLobbyHeight.value), createLobbyBgColor.value, parseInt(createLobbyPlayers.value), spectatorsSendable);
        clearInterval(validationClock);
    }
});
submitIDBtn.addEventListener("click", function() {
    joinLobbyRequest(Number(lobbyIDInput.value));
});
createLobbyBgColor.addEventListener("keydown", function() {
    setTimeout(function() {
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

communicator.sendCreateLobbyRequest = function(width, height, bgColor, playernumber, spectators) {
    let COMMAND_ID = 0;
    
    let message = formatter.toUByte(COMMAND_ID) + formatter.toUShort(width) + formatter.toUShort(height) + formatter.toUShort(playernumber) + spectators + bgColor;
    console.log(message)
    
    socket.send(message);
};
function createLobbyRequest(width, height, bgColor, playernumber, spectators) {
    if (connected && !connectingToLobby) {
        connectingToLobby = true;

        communicator.sendCreateLobbyRequest(width, height, bgColor, playernumber, spectators);
    }
}

communicator.sendJoinLobbyRequest = function(lobbyID) {
    let COMMAND_ID = 1;
    
    let message = formatter.toUByte(COMMAND_ID) + formatter.toUTribyte(lobbyID);
    
    socket.send(message);
};
function joinLobbyRequest(ID) {
    if (connected && !connectingToLobby) {
        connectingToLobby = true;

        communicator.sendJoinLobbyRequest(ID);
    }
}