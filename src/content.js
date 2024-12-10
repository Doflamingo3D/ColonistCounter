let game = new Game();

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'updateRequest') {
        const gameState = {
            bank: {
                lumber: game.bank.GetResource('lumber'),
                brick: game.bank.GetResource('brick'),
                wool: game.bank.GetResource('wool'),
                grain: game.bank.GetResource('grain'),
                ore: game.bank.GetResource('ore'),
                devCard: game.bank.GetDevCardCount()
            }
        };
        sendResponse({ gameState: JSON.stringify(gameState) });
    }
});

let gameLog = document.getElementById('game-log-text');
if (gameLog === null) {
    WaitForGame();
} else {
    if (gameLog.getElementsByClassName('message_post').length === 0) {
        WaitToLeaveGame();
    } else {
        RecordGameLogs(gameLog);
    }
}

function WaitForGame() {
    const checkJoinedGame = function (mutationsList, observer) {
        const gameLog = document.getElementById('game-log-text');
        if (gameLog !== null) {
            observer.disconnect();
            RecordGameLogs();
        }
    };

    const observer = new MutationObserver(checkJoinedGame);

    const config = {
        childList: true,
        subtree: true
    };

    observer.observe(document.body, config);
}

function WaitToLeaveGame() {
    const checkLeftGame = function (mutationsList, observer) {
        const gameLog = document.getElementById('game-log-text');
        if (gameLog === null) {
            observer.disconnect();
            WaitForGame();
        }
    };

    const observer = new MutationObserver(checkLeftGame);

    const config = {
        childList: true,
        subtree: true
    };

    observer.observe(document.body, config);
}

function RecordGameLogs() {
    let gameLog = document.getElementById('game-log-text');

    const checkGameEntry = function (mutationsList, observer) {
        const mutation = mutationsList[0];

        const messages = gameLog.getElementsByClassName('message_post');
        if (messages.length !== 0) {
            ProcessEventLog(messages[messages.length - 1], game);
        }
    };

    const observer = new MutationObserver(checkGameEntry);
    const config = {
        childList: true
    };

    observer.observe(gameLog, config);
}
