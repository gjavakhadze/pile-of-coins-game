var game = new Phaser.Game(1100, 600, Phaser.AUTO, 'wrapper', {preload: preload, create: create}),
	graphics,
	coinBags,
	coinPile,
	gameInfoText,
	COIN_BAGS_COUNT = 10,
	TOOLBAR_HEIGHT = 20,
	OFFSET_FROM_LEFT = 50,
	OFFSET_FROM_TOP = 50;

function preload() {
	game.load.image('bagOfCoins', 'assets/bagOfCoins.png');
	game.load.image('bagOfCoins2', 'assets/bagOfCoins2.png');
	game.load.image('pileOfCoins', 'assets/pileOfCoins.png');
	game.load.image('arrowDown', 'assets/arrowDown.png');
	game.load.image('arrowUp', 'assets/arrowUp.png');
}

function create() {
	// disable context menu on canvas
	this.game.canvas.oncontextmenu = function (e) {
		e.preventDefault();
	};

	initGraphics();
	initGameInfoText();
	initCoinPile();
	initCoinBags();

	drawCoinPile();
	drawCoinBags();

	game.stage.backgroundColor = '#b37607';
}

function initGraphics() {
	graphics = game.add.graphics(0, 0);
}

function initGameInfoText() {
	gameInfoText = game.add.text(0, 0, 'ერთი ორი სამი', {
		fill: 'white',
		align: 'center',
		font: 'bold 24px Sylfaen',
		boundsAlignH: 'center',
		boundsAlignV: 'middle'
	});
	gameInfoText.x = game.world.centerX - gameInfoText.width / 2;
	gameInfoText.y = TOOLBAR_HEIGHT - gameInfoText.height / 2;
}

function initCoinPile() {
	coinPile = {};
	coinPile.pileImage = game.add.image(0, 0, 'pileOfCoins');
	coinPile.pileImage.width = 300;
	coinPile.pileImage.height = 150;
	coinPile.pileImage.x = game.world.centerX - coinPile.pileImage.width / 2;
	coinPile.pileImage.y = TOOLBAR_HEIGHT + 50;
	coinPile.pileImage.visible = false;

	coinPile.amount = random(0, 100);
	coinPile.amountText = game.add.text(0, 0, '', {
		fill: 'white',
		align: 'center',
		font: 'bold 30px Sylfaen',
		boundsAlignH: 'center',
		boundsAlignV: 'middle'
	});
	coinPile.amountText.x = coinPile.pileImage.x + coinPile.pileImage.width / 2 - coinPile.amountText.width / 2;
	coinPile.amountText.y = coinPile.pileImage.y + coinPile.pileImage.height + 10;
	coinPile.updateLayout = function () {
		this.amountText.x = this.pileImage.x + this.pileImage.width / 2 - this.amountText.width / 2;
		this.amountText.y = this.pileImage.y + this.pileImage.height + 10;
	};
	coinPile.amountText.visible = false;
}

function initCoinBags() {
	coinBags = [];
	for (var i = 0; i < COIN_BAGS_COUNT; i++) {
		var bag = {};
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
			for (var j = 0; j < coinBags.length; j++) {
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

		bag.amount = random(1, 30);
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
			onArrowImageClick(img);
			onComputerTurn();
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

function drawCoinPile() {
	coinPile.pileImage.visible = true;
	coinPile.amountText.visible = true;

	coinPile.amountText.text = coinPile.amount;

	coinPile.updateLayout();
}

function drawCoinBags() {
	for (var i = 0; i < coinBags.length; i++) {
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
	var amount = bag.coinChangeAmount - 1;
	if (isCoinChangeAmountAllowed(bag, amount)) {
		bag.coinChangeAmount = amount;
	}
	drawCoinBag(bag);
}

function onCoinBagIncrease(bag) {
	var amount = bag.coinChangeAmount + 1;
	if (isCoinChangeAmountAllowed(bag, amount)) {
		bag.coinChangeAmount = amount;
	}
	drawCoinBag(bag);
}

function isCoinChangeAmountAllowed(bag, amount) {
	if (amount > 0 && amount <= coinPile.amount) {
		return true;
	} else if (amount < 0 && -amount <= bag.amount ) {
		return true;
	} else if (amount === 0) {
		return true;
	}
	return false;
}

function onArrowImageClick(img) {
	if (img.reference.coinChangeAmount > 0) {
		coinPile.amount -= img.reference.coinChangeAmount;
		img.reference.amount += img.reference.coinChangeAmount;
		img.reference.coinChangeAmount = 0;
	} else if (img.reference.coinChangeAmount < 0) {
		coinPile.amount += -img.reference.coinChangeAmount;
		img.reference.amount -= -img.reference.coinChangeAmount;
		img.reference.coinChangeAmount = 0;
	}
	drawCoinBag(img.reference);
	drawCoinPile();
}

function onComputerTurn() {
	for (var i = 0; i < coinBags.length; i++) {
		coinBags[i].bagImage.inputEnabled = false;
		coinBags[i].arrowImage.inputEnabled = false;
		coinBags[i].bagImage.alpha = 0.7;
	}
	game.time.events.add(Phaser.Timer.SECOND * 2, function () {
		var optimalTurn = getOptimalTurn();
		console.log(optimalTurn);
		coinBags[optimalTurn.index].bagImage.alpha = 1.0;
		coinBags[optimalTurn.index].coinChangeAmount = -optimalTurn.amount;
		drawCoinBag(coinBags[optimalTurn.index]);
		game.time.events.add(Phaser.Timer.SECOND * 5, function () {
			onArrowImageClick(coinBags[optimalTurn.index].arrowImage);
			for (var i = 0; i < coinBags.length; i++) {
				coinBags[i].bagImage.inputEnabled = true;
				coinBags[i].arrowImage.inputEnabled = true;
				coinBags[i].bagImage.alpha = 0.7;
			}
		});
	});
}

function getOptimalTurn() {
	var max = 0, xor = 0, index = -1;
	for (var i = 0; i < coinBags.length; i++) {
		max = Math.max(coinBags[i].amount);
	}
	for (var i = 1; i <= max; i++) {

	}
	for (var i = 0; i < coinBags.length; i++) {
		xor ^= coinBags[i].amount;
	}
	for (var i = 0; i < coinBags.length; i++) {
		if (coinBags[i].amount >= xor) {
			index = i;
			break;
		}
	}
	return {
		index: index,
		amount: xor
	};
}

function random(fromNumber, toNumber, toExclude) {
	if (toExclude === undefined) {
		toExclude = [];
	}
	var r = game.rnd.between(fromNumber, toNumber);
	while (toExclude.indexOf(r) !== -1) {
		r = game.rnd.between(fromNumber, toNumber);
	}
	return r;
}