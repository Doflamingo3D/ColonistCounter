let game = new Game();

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request === 'updateRequest') {
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
		
		sendResponse({gameState: JSON.stringify(gameState)});
	};
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
  const checkJoinedGame = function(mutationsList, observer) {
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
};


function WaitToLeaveGame() {
  const checkLeftGame = function(mutationsList, observer) {
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
};


function RecordGameLogs() {
	let gameLog = document.getElementById('game-log-text');

  const checkGameEntry = function(mutationsList, observer) {
    const mutation = mutationsList[0];

    const messages = gameLog.getElementsByClassName('message_post');
    if (messages.length !== 0) {
      ProcessEventLog(messages[messages.length - 1], game);
    }
  }

  const observer = new MutationObserver(checkGameEntry);
  const config = {
    childList:true
  }

  observer.observe(gameLog, config);
}


const SYSTEM_LOG_RGB = 'rgb(102, 102, 102)';

function ProcessEventLog(element, game) {
  if (element == null) {
  	return;
  }

  if (element.style.color === SYSTEM_LOG_RGB) {
  	if (element.textContent.includes('won the game!')) {
  		WaitToLeaveGame();
  	}

  	return;
  }

  let clone = element.cloneNode(true);
  let imgElements = [...clone.getElementsByTagName('img')];
  for (let tag of imgElements) {
  	tag.outerText = `${tag.getAttribute('alt')} `;
  }

  let [entity, user, ...words] = ParseLogText(clone.textContent);
  let color = clone.style.color, keyword = FindKeyword(words);

  if (keyword === 'placed') {
    game.AddPlayer(user, color);
  } else if (keyword == 'got') {
  	game.PlayerReceivedResources(user, words.slice(1));
  } else if (keyword === 'received' && words[1] == 'starting' && words[2] == 'resources') {
    game.PlayerReceivedResources(user, words.slice(3));
  } else if (keyword === 'rolled') {
    // TODO dice statistics
  } else if (keyword === 'built') {
    game.PlayerPurchased(user, words[2]);
  } else if (keyword === 'bought') {
  	game.PlayerPurchased(user, words.slice(1).join(' '));
  } else if (keyword === 'discarded') {
    game.PlayerDiscarded(user, words.slice(1));
  } else if (keyword === 'used') {
    // TODO remove dev card
  } else if (keyword === 'stole') {
    // TODO figure out how to track hidden cards
    // if (isNaN(words[1])) {
    //   game.PlayerStole(user, words[3], words[1]);
    // } else {
    //   game.PlayerStoleAll(user, words[2], words[1]);
    // }
  } else if (keyword === 'traded') {
  	let tradedIndex = words.indexOf('traded'), forIndex = words.indexOf('for'), withIndex = words.indexOf('with');
    game.PlayerTraded(user, words[withIndex + 1], words.slice(tradedIndex + 1, forIndex), words.slice(forIndex + 1, withIndex));
  } else if (keyword === 'gave') {
  	let bankIndex = words.indexOf('bank'), andIndex = words.indexOf('and');
  	game.PlayerTradedWithBank(user, words.slice(bankIndex + 1, andIndex), words.slice(andIndex + 2));
  }
}


function ParseLogText(text) {
  return text.trim().replaceAll(':', '').split(' ').filter(word => word !== '');
}


const KEYWORDS = ['placed', 'received', 'rolled', 'got', 'built', 'bought', 'discarded', 'used', 'stole', 'traded', 'gave'];

function FindKeyword(words) {
  for (const word of words) {
    if (KEYWORDS.includes(word)) {
      return word;
    }
  }

  return null;
}