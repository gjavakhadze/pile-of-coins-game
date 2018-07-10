let game = new Phaser.Game(1100, 600, Phaser.AUTO, 'wrapper', {preload: preload, create: create}),
	graphics,
	coinBags,
	humanCoinPile,
	pcCoinPile,
	gameInfoText,
	humanImage,
	pcImage,
	COIN_BAGS_COUNT = 2,
	TOOLBAR_HEIGHT = 80,
	OFFSET_FROM_RIGHT = 50,
	OFFSET_FROM_LEFT = 50,
	OFFSET_FROM_TOP = 50;

function preload() {
	game.load.image('bagOfCoins', 'assets/bagOfCoins.png');
	game.load.image('bagOfCoins2', 'assets/bagOfCoins2.png');
	game.load.image('pileOfCoins', 'assets/pileOfCoins.png');
	game.load.image('arrowDown', 'assets/arrowDown.png');
	game.load.image('arrowUp', 'assets/arrowUp.png');
	game.load.image('human', 'assets/human.png');
	game.load.image('pc', 'assets/desktopComputer.png');
}

function create() {
	// disable context menu on canvas
	this.game.canvas.oncontextmenu = function (e) {
		e.preventDefault();
	};

	initGraphics();
	initToolBar();
	initCoinPiles();
	initCoinBags();

	drawCoinPiles();
	drawCoinBags();

	game.stage.backgroundColor = '#b37607';
}

function initGraphics() {
	graphics = game.add.graphics(0, 0);
}

function initToolBar() {
	gameInfoText = game.add.text(0, 0, '', {
		fill: 'white',
		align: 'center',
		font: 'bold 30px Sylfaen',
		boundsAlignH: 'center',
		boundsAlignV: 'middle'
	});
	gameInfoText.x = game.world.centerX - gameInfoText.width / 2;
	gameInfoText.y = TOOLBAR_HEIGHT - gameInfoText.height / 2;
	gameInfoText.updateLayout = function () {
		this.x = game.world.centerX - this.width / 2;
		this.y = TOOLBAR_HEIGHT - this.height / 2;
	};
}

function initCoinPiles() {
	humanCoinPile = {};
	humanCoinPile.pileImage = game.add.image(0, 0, 'pileOfCoins');
	humanCoinPile.pileImage.width = 300;
	humanCoinPile.pileImage.height = 150;
	humanCoinPile.pileImage.x = OFFSET_FROM_LEFT;
	humanCoinPile.pileImage.y = TOOLBAR_HEIGHT + 50;
	humanCoinPile.pileImage.visible = false;

	humanImage = game.add.image(0, 0, 'human');
	humanImage.width = 120;
	humanImage.height = 120;
	humanImage.x = humanCoinPile.pileImage.x + humanCoinPile.pileImage.width / 2 - humanImage.width / 2;
	humanImage.y = humanCoinPile.pileImage.y - humanImage.height;
	humanImage.alpha = 1.0;
	humanImage.visible = false;

	humanCoinPile.amount = random(0, 10);
	humanCoinPile.amountText = game.add.text(0, 0, '', {
		fill: 'white',
		align: 'center',
		font: 'bold 30px Sylfaen',
		boundsAlignH: 'center',
		boundsAlignV: 'middle'
	});
	humanCoinPile.amountText.x = humanCoinPile.pileImage.x + humanCoinPile.pileImage.width / 2 - humanCoinPile.amountText.width / 2;
	humanCoinPile.amountText.y = humanCoinPile.pileImage.y + humanCoinPile.pileImage.height + 10;
	humanCoinPile.updateLayout = function () {
		this.amountText.x = this.pileImage.x + this.pileImage.width / 2 - this.amountText.width / 2;
		this.amountText.y = this.pileImage.y + this.pileImage.height + 10;
	};
	humanCoinPile.amountText.visible = false;

	pcCoinPile = {};
	pcCoinPile.pileImage = game.add.image(0, 0, 'pileOfCoins');
	pcCoinPile.pileImage.width = 300;
	pcCoinPile.pileImage.height = 150;
	pcCoinPile.pileImage.x = game.width - pcCoinPile.pileImage.width - OFFSET_FROM_RIGHT;
	pcCoinPile.pileImage.y = TOOLBAR_HEIGHT + 50;
	pcCoinPile.pileImage.alpha = 0.3;
	pcCoinPile.pileImage.visible = false;

	pcImage = game.add.image(0, 0, 'pc');
	pcImage.width = 120;
	pcImage.height = 120;
	pcImage.x = pcCoinPile.pileImage.x + pcCoinPile.pileImage.width / 2 - pcImage.width / 2;
	pcImage.y = pcCoinPile.pileImage.y - pcImage.height;
	pcImage.alpha = 0.3;
	pcImage.visible = false;

	pcCoinPile.amount = random(0, 10);
	pcCoinPile.amountText = game.add.text(0, 0, '', {
		fill: 'white',
		align: 'center',
		font: 'bold 30px Sylfaen',
		boundsAlignH: 'center',
		boundsAlignV: 'middle'
	});
	pcCoinPile.amountText.x = pcCoinPile.pileImage.x + pcCoinPile.pileImage.width / 2 - pcCoinPile.amountText.width / 2;
	pcCoinPile.amountText.y = pcCoinPile.pileImage.y + pcCoinPile.pileImage.height + 10;
	pcCoinPile.updateLayout = function () {
		this.amountText.x = this.pileImage.x + this.pileImage.width / 2 - this.amountText.width / 2;
		this.amountText.y = this.pileImage.y + this.pileImage.height + 10;
	};
	pcCoinPile.amountText.visible = false;
}

function initCoinBags() {
	coinBags = [];
	for (let i = 0; i < COIN_BAGS_COUNT; i++) {
		let bag = {};
		bag.index = i;
		bag.active = false;

		bag.bagImage = game.add.image(0, 0, 'bagOfCoins');
		bag.bagImage.reference = bag;
		bag.bagImage.width = 90;
		bag.bagImage.height = 90;
		bag.bagImage.x = OFFSET_FROM_LEFT + i * (bag.bagImage.width + 10);
		bag.bagImage.y = game.world.height - bag.bagImage.height - OFFSET_FROM_TOP;
		bag.bagImage.alpha = 0.7;
		bag.bagImage.inputEnabled = true;
		bag.bagImage.events.onInputDown.add(function (img, pointer) {
			for (let j = 0; j < coinBags.length; j++) {
				if (img.reference !== coinBags[j]) {
					coinBags[j].active = false;
					coinBags[j].bagImage.alpha = 0.7;
					coinBags[j].coinChangeAmount = 0;
					drawCoinBag(coinBags[j]);
				}
			}

			if (img.reference.active) {
				if (pointer.leftButton.isDown) {
					onCoinBagDecrease(img.reference);
				} else if (pointer.rightButton.isDown) {
					onCoinBagIncrease(img.reference);
				}
			} else {
				img.reference.active = true;
				img.alpha = 1;
			}
			drawCoinBag(img.reference);
		});
		bag.bagImage.visible = false;

		bag.amount = random(1, 10);
		bag.amountText = game.add.text(0, 0, '', {
			fill: 'white',
			align: 'center',
			font: 'bold 20px Sylfaen',
			boundsAlignH: 'center',
			boundsAlignV: 'middle'
		});
		bag.amountText.x = bag.bagImage.x + bag.bagImage.width / 2 - bag.amountText.width / 2;
		bag.amountText.y = bag.bagImage.y + bag.bagImage.height / 2;
		bag.amountText.visible = false;

		bag.arrowImage = game.add.image(0, 0, 'arrowUp');
		bag.arrowImage.reference = bag;
		bag.arrowImage.width = 50;
		bag.arrowImage.height = 50;
		bag.arrowImage.x = bag.bagImage.x + bag.bagImage.width / 2 - bag.arrowImage.width / 2;
		bag.arrowImage.y = bag.bagImage.y - bag.arrowImage.height - 10;
		bag.arrowImage.inputEnabled = true;
		bag.arrowImage.events.onInputOver.add(function (img) {
			img.alpha = 0.5;
		});
		bag.arrowImage.events.onInputOut.add(function (img) {
			img.alpha = 1.0;
		});
		bag.arrowImage.events.onInputDown.add(function (img) {
			onArrowImageClick(img, 'human');
			if (!canMakeAction('pc')) {
				updateGameInfoText('Game over, you win!', 'white');
			} else {
				onComputerTurn();
			}
		});
		bag.arrowImage.visible = false;

		bag.coinChangeAmount = 0;
		bag.coinChangeAmountText = game.add.text(0, 0, '', {
			fill: 'white',
			align: 'center',
			font: 'bold 20px Sylfaen',
			boundsAlignH: 'center',
			boundsAlignV: 'middle'
		});
		bag.coinChangeAmountText.x = bag.arrowImage.x + bag.arrowImage.width / 2 - bag.coinChangeAmountText.width / 2;
		bag.coinChangeAmountText.y = bag.arrowImage.y - bag.coinChangeAmountText.width / 2 - 5;
		bag.coinChangeAmountText.visible = false;

		bag.updateLayout = function () {
			this.bagImage.x = OFFSET_FROM_LEFT + this.index * (this.bagImage.width + 10);
			this.bagImage.y = game.world.height - this.bagImage.height - OFFSET_FROM_TOP;

			this.amountText.x = this.bagImage.x + this.bagImage.width / 2 - this.amountText.width / 2;
			this.amountText.y = this.bagImage.y + this.bagImage.height / 2;

			this.arrowImage.x = this.bagImage.x + this.bagImage.width / 2 - this.arrowImage.width / 2;
			this.arrowImage.y = this.bagImage.y - this.arrowImage.height - 10;

			this.coinChangeAmountText.x = this.arrowImage.x + this.arrowImage.width / 2 - this.coinChangeAmountText.width / 2;
			this.coinChangeAmountText.y = this.arrowImage.y - this.coinChangeAmountText.width / 2 - 20;
		};

		coinBags.push(bag);
	}
}

function drawCoinPiles() {
	humanCoinPile.pileImage.visible = true;
	humanCoinPile.amountText.visible = true;
	humanImage.visible = true;
	humanCoinPile.amountText.text = humanCoinPile.amount;
	humanCoinPile.updateLayout();

	pcCoinPile.pileImage.visible = true;
	pcCoinPile.amountText.visible = true;
	pcImage.visible = true;
	pcCoinPile.amountText.text = pcCoinPile.amount;
	pcCoinPile.updateLayout();
}

function drawCoinBags() {
	for (let i = 0; i < coinBags.length; i++) {
		drawCoinBag(coinBags[i]);
	}
}

function drawCoinBag(bag) {
	bag.bagImage.visible = true;
	bag.amountText.visible = true;

	bag.amountText.text = bag.amount;

	if (bag.coinChangeAmount > 0) {
		bag.arrowImage.visible = true;
		bag.coinChangeAmountText.visible = true;
		bag.arrowImage.loadTexture('arrowDown');
		bag.coinChangeAmountText.text = '+' + bag.coinChangeAmount;
	} else if (bag.coinChangeAmount < 0) {
		bag.arrowImage.visible = true;
		bag.coinChangeAmountText.visible = true;
		bag.arrowImage.loadTexture('arrowUp');
		bag.coinChangeAmountText.text = bag.coinChangeAmount;
	} else {
		bag.arrowImage.visible = false;
		bag.coinChangeAmountText.visible = false;
	}

	bag.updateLayout();
}

function onCoinBagDecrease(bag) {
	let amount = bag.coinChangeAmount - 1;
	if (isCoinChangeAmountAllowed(bag, amount)) {
		bag.coinChangeAmount = amount;
	}
	drawCoinBag(bag);
}

function onCoinBagIncrease(bag) {
	let amount = bag.coinChangeAmount + 1;
	if (isCoinChangeAmountAllowed(bag, amount)) {
		bag.coinChangeAmount = amount;
	}
	drawCoinBag(bag);
}

function isCoinChangeAmountAllowed(bag, amount) {
	if (amount > 0 && amount <= humanCoinPile.amount) {
		return true;
	} else if (amount < 0 && -amount <= bag.amount ) {
		return true;
	} else if (amount === 0) {
		return true;
	}
	return false;
}

function onArrowImageClick(img, type) {
	let currentCoinPile = null;
	if (type === 'human') {
		currentCoinPile = humanCoinPile;
	} else if (type === 'pc') {
		currentCoinPile = pcCoinPile;
	}
	if (img.reference.coinChangeAmount > 0) {
		currentCoinPile.amount -= img.reference.coinChangeAmount;
		img.reference.amount += img.reference.coinChangeAmount;
		img.reference.coinChangeAmount = 0;
	} else if (img.reference.coinChangeAmount < 0) {
		currentCoinPile.amount += -img.reference.coinChangeAmount;
		img.reference.amount -= -img.reference.coinChangeAmount;
		img.reference.coinChangeAmount = 0;
	}
	drawCoinBag(img.reference);
	drawCoinPiles();
}

function onComputerTurn() {
	for (let i = 0; i < coinBags.length; i++) {
		coinBags[i].bagImage.inputEnabled = false;
		coinBags[i].arrowImage.inputEnabled = false;
		coinBags[i].bagImage.alpha = 0.7;
	}
	humanImage.alpha = 0.3;
	humanCoinPile.pileImage.alpha = 0.3;
	pcImage.alpha = 1.0;
	pcCoinPile.pileImage.alpha = 1.0;
	game.time.events.add(Phaser.Timer.SECOND * 2, function () {
		let optimalTurn = getComputerOptimalTurn();
		coinBags[optimalTurn.index].coinChangeAmount = optimalTurn.amount;
		coinBags[optimalTurn.index].bagImage.alpha = 1.0;
		drawCoinBag(coinBags[optimalTurn.index]);
		game.time.events.add(Phaser.Timer.SECOND * 5, function () {
			onArrowImageClick(coinBags[optimalTurn.index].arrowImage, 'pc');
			for (let i = 0; i < coinBags.length; i++) {
				coinBags[i].bagImage.inputEnabled = true;
				coinBags[i].arrowImage.inputEnabled = true;
				coinBags[i].bagImage.alpha = 0.7;
			}
			humanImage.alpha = 1.0;
			humanCoinPile.pileImage.alpha = 1.0;
			pcImage.alpha = 0.3;
			pcCoinPile.pileImage.alpha = 0.3;

			if (!canMakeAction('human')) {
				updateGameInfoText('Game over, you lost!', 'white');
			}
		});
	});
}

function getComputerOptimalTurn() {
	let amount = 0, index = -1, xor = 0;
	for (let i = 0; i < coinBags.length; i++) {
		xor = xor ^ coinBags[i].amount;
	}
	for (let i = 0; i < coinBags.length; i++) {
		for (let j = 1; j <= coinBags[i].amount; j++) {
			let currentXor = xor;
			currentXor = currentXor ^ coinBags[i].amount;
			currentXor = currentXor ^ (coinBags[i].amount - j);
			if (currentXor === 0 && j > amount) {
				amount = j;
				index = i;
			}
		}
	}
	if (index !== -1) {
		amount = -amount;
	}
	if (index === -1) {
		for (let i = 0; i < coinBags.length; i++) {
			for (let j = 1; j <= pcCoinPile.amount; j++) {
				let currentXor = xor;
				currentXor = currentXor ^ coinBags[i].amount;
				currentXor = currentXor ^ (coinBags[i].amount + j);
				if (currentXor === 0 && j > amount) {
					amount = j;
					index = i;
				}
			}
		}
	}
	if (index === -1) {
		let canAdd = false, canTakeOut = false;
		for (let i = 0; i < coinBags.length; i++) {
			if (coinBags[i].amount > 0) {
				canTakeOut = true;
				break;
			}
		}
		if (pcCoinPile.amount > 0) {
			canAdd = true;
		}
		if (canAdd && canTakeOut) {
			let randomValue = random(0, 1);
			let randomMove = randomValue === 0 ? getPcAddCoinsRandom() : getPcTakeOutCoinsRandom();
			index = randomMove.index;
			amount = randomValue === 0 ? randomMove.amount : -randomMove.amount;
		} else if (canAdd) {
			let randomMove = getPcAddCoinsRandom();
			index = randomMove.index;
			amount = randomMove.amount;
		} else if (canTakeOut) {
			let randomMove = getPcTakeOutCoinsRandom();
			index = randomMove.index;
			amount = -randomMove.amount;
		} else {
			console.log('illegal state');
		}
	}
	return {
		index: index,
		amount: amount
	};
}

function getPcAddCoinsRandom() {
	let index = random(0, coinBags.length - 1);
	let amount = random(1, pcCoinPile.amount);
	return {
		index: index,
		amount: amount
	}
}

function getPcTakeOutCoinsRandom() {
	let nonZeroCoinBags = [];
	for (let i = 0; i < coinBags.length; i++) {
		if (coinBags[i].amount > 0) {
			nonZeroCoinBags.push(coinBags[i]);
		}
	}
	let index = random(0, nonZeroCoinBags.length - 1);
	let amount = random(1, nonZeroCoinBags[index].amount);
	return {
		index: index,
		amount: amount
	}
}

function updateGameInfoText(text, color) {
	gameInfoText.text = text;
	gameInfoText.style.fill = color;
	gameInfoText.updateLayout();
}

function canMakeAction(type) {
	for (let i = 0; i < coinBags.length; i++) {
		if (coinBags[i].amount > 0) {
			return true;
		}
	}
	if (type === 'pc') {
		return pcCoinPile.amount > 0;
	} else if (type === 'human') {
		return humanCoinPile.amount > 0;
	}
	return false;
}

function random(fromNumber, toNumber, toExclude) {
	if (toExclude === undefined) {
		toExclude = [];
	}
	let r = game.rnd.between(fromNumber, toNumber);
	while (toExclude.indexOf(r) !== -1) {
		r = game.rnd.between(fromNumber, toNumber);
	}
	return r;
}