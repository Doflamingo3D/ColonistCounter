document.addEventListener('DOMContentLoaded', function () {
	chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, 'updateRequest', UpdateGame);
    });

}, false);


function UpdateGame(response) {
  let gameState = JSON.parse(response.gameState);
  document.getElementById('bank-lumber-count').innerText = gameState.bank.lumber;
  document.getElementById('bank-brick-count').innerText = gameState.bank.brick;
  document.getElementById('bank-wool-count').innerText = gameState.bank.wool;
  document.getElementById('bank-grain-count').innerText = gameState.bank.grain;
  document.getElementById('bank-ore-count').innerText = gameState.bank.ore;
  document.getElementById('bank-development-card-count').innerText = gameState.bank.devCard;
}