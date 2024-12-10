document.addEventListener('DOMContentLoaded', function () {
    console.log('Popup loaded. Querying active tab...');
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        if (tabs.length === 0) {
            console.error('No active tabs found.');
            return;
        }
        console.log('Active tab found:', tabs[0]);
        chrome.tabs.sendMessage(tabs[0].id, { action: 'updateRequest' }, UpdateGame);
    });
}, false);

function UpdateGame(response) {
    if (response && response.gameState) {
        try {
            let gameState = JSON.parse(response.gameState);
            console.log("Game state received:", gameState);
            document.getElementById('bank-lumber-count').innerText = gameState.bank.lumber;
            document.getElementById('bank-brick-count').innerText = gameState.bank.brick;
            document.getElementById('bank-wool-count').innerText = gameState.bank.wool;
            document.getElementById('bank-grain-count').innerText = gameState.bank.grain;
            document.getElementById('bank-ore-count').innerText = gameState.bank.ore;
            document.getElementById('bank-development-card-count').innerText = gameState.bank.devCard;
        } catch (error) {
            console.error('Error parsing or updating game state:', error);
        }
    } else {
        console.error('Failed to receive game state or response:', response);
    }
}
