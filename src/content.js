let game;

try {
    game = new Game();
    console.log("Game object initialized:", game);
} catch (error) {
    console.error("Failed to initialize the Game object:", error);
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'updateRequest') {
        try {
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
            console.log("Sending game state:", gameState);
            sendResponse({ gameState: JSON.stringify(gameState) });
        } catch (error) {
            console.error("Failed to construct or send game state:", error);
            sendResponse(null);
        }
    }
});
