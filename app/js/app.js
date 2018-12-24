'use strict';
/* Helper functions --- */
// Repeat

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

Array.prototype.repeat = function (repeats) {
  var _ref,
      _this = this;

  // From https://stackoverflow.com/a/50672154/7982963
  return (_ref = []).concat.apply(_ref, _toConsumableArray(Array.from({
    length: repeats
  }, function () {
    return _this;
  })));
}; // Shuffle


Array.prototype.shuffle = function () {
  // from https://stackoverflow.com/a/6274381/7982963
  for (var i = this.length - 1; i > 0; i--) {
    var randomIndex = Math.floor(Math.random() * i);
    var _ref2 = [this[randomIndex], this[i]];
    this[i] = _ref2[0];
    this[randomIndex] = _ref2[1];
  }

  return this;
}; // Remove All children


Node.prototype.removeAll = function () {
  while (this.firstChild) {
    this.removeChild(this.firstChild);
  }

  return this;
}; // Pad time with zeros


var zeroPadded = function zeroPadded(num) {
  return num < 10 ? "0".concat(num) : num;
};
/* Card Class --- */


var Card = function Card(id, characterName, src) {
  _classCallCheck(this, Card);

  this.id = id;
  this.characterName = characterName;
  this.src = src;
};
/* ===================================
  Model
  ==================================== */


var model = {
  cards: [new Card(1, 'Akasaka', 'images/akasaka.png'), // id, name and src
  new Card(2, 'Armin', 'images/armin.png'), new Card(3, 'Gon', 'images/gon.png'), new Card(4, 'Hisoka', 'images/hisoka.png'), new Card(5, 'Killua', 'images/killua.png'), new Card(6, 'Kite', 'images/kite.png'), new Card(7, 'Kurapica', 'images/kurapica.png'), new Card(8, 'Tanaka', 'images/tanaka.png')],
  selectedId: null,
  firstClick: true,
  matchingResult: '',
  character: '',
  moves: 0,
  time: {
    seconds: 0,
    minutes: 0
  },
  stars: 3
  /* ===================================
    Octopus
    ==================================== */

};
var octopus = {
  getMovesRecord: function getMovesRecord() {
    return model.moves;
  },
  getTime: function getTime() {
    return model.time;
  },
  getStarsNum: function getStarsNum() {
    return model.stars;
  },
  getCards: function getCards() {
    return model.cards;
  },
  getSelectedId: function getSelectedId() {
    return model.selectedId;
  },
  setSelectedId: function setSelectedId(id) {
    model.selectedId = id;
  },
  resetSelectedId: function resetSelectedId() {
    model.selectedId = null;
  },
  incrementMoves: function incrementMoves() {
    model.moves++;
    movesView.render();
    modalView.render();
  },
  startTimer: function startTimer() {
    timerView.start();
  },
  updateTime: function updateTime(seconds, minutes) {
    model.time.seconds = seconds;
    model.time.minutes = minutes;
    timerView.render();
    modalView.render();
  },
  stopTimer: function stopTimer() {
    timerView.stop();
  },
  isFirstClick: function isFirstClick() {
    return model.firstClick;
  },
  falseFirstClick: function falseFirstClick() {
    model.firstClick = false;
  },
  determineStarsNum: function determineStarsNum() {
    starsView.determineNum(model.moves);
  },
  updateStars: function updateStars(num) {
    model.stars = num;
    starsView.render();
  },
  getMatchingResult: function getMatchingResult() {
    return model.matchingResult;
  },
  updateMatchingResult: function updateMatchingResult(str) {
    model.matchingResult = str;
    gameStatus.render();
  },
  getCharacter: function getCharacter() {
    return model.character;
  },
  updateCharacter: function updateCharacter(character) {
    model.character = character;
    gameStatus.render();
  },
  openDialog: function openDialog() {
    modalView.openDialog();
  },
  closeDialog: function closeDialog() {
    modalView.closeDialog();
  },
  reset: function reset(focusedIndex) {
    model.moves = 0;
    model.stars = 3;
    model.matchingResult = '';
    model.character = ''; // Board

    model.selectedId = null;
    model.firstClick = true;
    boardView.reset(); // Render

    movesView.render();
    timerView.reset();
    starsView.render();
    window.setTimeout(function () {
      return boardView.render(focusedIndex);
    }, 300); // Card showing time

    gameStatus.render();
  },
  init: function init() {
    keyboardSupportView.init();
    movesView.init();
    timerView.init();
    starsView.init();
    boardView.init();
    resetButton.init();
    rulesView.init();
    gameStatus.init();
    modalView.init();
  }
};
/* ===================================
  Views
  ==================================== */

/* Keyboard support --- */

var keyboardSupportView = {
  init: function init() {
    this.startButton = document.querySelector('.keyboard-support button');
    this.startButton.addEventListener('click', function focusFirstCard() {
      var firstCard = document.querySelector('.card button');
      firstCard.focus();
    });
  }
};
/* Rules --- */

var rulesView = {
  init: function init() {
    var _this2 = this;

    this.viewRulesButton = document.querySelector('#rules-section button');
    this.rules = document.querySelector('#rules');
    this.viewRulesButton.addEventListener('click', function () {
      if (_this2.viewRulesButton.getAttribute('aria-pressed') === 'false') {
        _this2.expand();
      } else {
        _this2.collapse();
      }
    });
  },
  expand: function expand() {
    rules.style.cssText = 'overflow: auto; height: auto;';
    this.viewRulesButton.setAttribute('aria-pressed', 'true');
    this.viewRulesButton.setAttribute('aria-expanded', 'true');
  },
  collapse: function collapse() {
    rules.style.cssText = 'overflow: hidden; height: 0;';
    this.viewRulesButton.setAttribute('aria-pressed', 'false');
    this.viewRulesButton.setAttribute('aria-expanded', 'false');
  }
};
/* Moves ---*/

var movesView = {
  init: function init() {
    this.movesRecord = document.querySelector('.moves-record');
    this.render();
  },
  render: function render() {
    var moves = octopus.getMovesRecord();
    this.movesRecord.textContent = moves === 1 ? moves + ' move' : moves + ' moves';
  }
};
/* Timer --- */

var timerView = {
  init: function init() {
    this.timer = document.querySelector('.timer');
    this.render();
  },
  start: function start() {
    var seconds = 0,
        minutes = 0;

    var incrementSecond = function incrementSecond() {
      if (seconds + 1 === 60) {
        minutes++;
        seconds = 0;
      } else {
        seconds++;
      }

      octopus.updateTime(seconds, minutes);
    };

    this.interval = window.setInterval(incrementSecond, 1000);
  },
  stop: function stop() {
    clearInterval(this.interval);
  },
  reset: function reset() {
    this.stop();
    var seconds = 0,
        minutes = 0;
    octopus.updateTime(seconds, minutes);
  },
  render: function render() {
    var _octopus$getTime = octopus.getTime(),
        seconds = _octopus$getTime.seconds,
        minutes = _octopus$getTime.minutes;

    var timeString = "".concat(zeroPadded(seconds), ":").concat(zeroPadded(minutes));
    this.timer.textContent = timeString;
  }
};
/* Stars --- */

var starsView = {
  init: function init() {
    this.starsLists = Array.from(document.querySelectorAll('.stars-list'));
    this.render();
  },
  determineNum: function determineNum(moves) {
    if (moves > 12) {
      var starsNum = moves > 16 ? 1 : moves > 20 ? 0 : 2;
      octopus.updateStars(starsNum);
    }
  },
  render: function render() {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < octopus.getStarsNum(); i++) {
      var listItem = document.createElement('li');
      listItem.classList.add('star');
      listItem.innerHTML = '<span role="img" aria-label="Star">★</span>';
      fragment.appendChild(listItem);
    }

    this.starsLists.forEach(function (starsList) {
      starsList.innerHTML = '';
      starsList.appendChild(fragment.cloneNode(true));
    });
  }
};
/* Reset button --- */

var resetButton = {
  init: function init() {
    var _this3 = this;

    this.button = document.querySelector('.reset');
    this.button.addEventListener('click', function () {
      _this3.reset();
    });
  },
  reset: function reset() {
    octopus.reset();
  }
};
/* Board --- */

var boardView = {
  init: function init() {
    var _this4 = this;

    this.board = document.querySelector('.board');
    this.adjustBoardHeight();
    this.rows = Array.from(document.querySelectorAll('.row'));
    this.clickEnabled = true;
    this.board.addEventListener('click', function (event) {
      if (!_this4.clickEnabled) return;
      var target = event.target;

      if (target.nodeName !== 'UL') {
        // Card is clicked
        if (octopus.isFirstClick()) {
          octopus.startTimer();
          octopus.falseFirstClick();
        }

        var card = target.nodeName === 'LI' ? target.querySelector('button') : target.nodeName === 'BUTTON' ? target : target.parentNode; // target: <div class="front"> inside button

        var currentId = card.getAttribute('data-id');
        var firstId = octopus.getSelectedId(); // Making sure player cant click the same card

        var sameCard = card.getAttribute('aria-selected') === 'true';
        if (sameCard) return;
        octopus.updateCharacter(card.getAttribute('data-name'));

        _this4.trueAriaSelectedAttr(card);

        if (firstId === null) {
          // No cards previously selected
          octopus.setSelectedId(currentId);
        } else {
          // A card is already clicked, so let's test with the new card
          octopus.incrementMoves();
          octopus.determineStarsNum();

          _this4.matchAndRespond(firstId, currentId);
        }
      }
    });
    this.interactiveKeys = {
      35: 'end',
      36: 'home',
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down'
    };
    this.render();
  },
  adjustBoardHeight: function adjustBoardHeight() {
    var _this5 = this;

    this.board.style.height = this.board.offsetWidth + 'px';
    window.addEventListener('resize', function () {
      _this5.board.style.height = _this5.board.offsetWidth + 'px';
    });
  },
  matchAndRespond: function matchAndRespond(firstId, secondId) {
    var _this6 = this;

    var visualFeedbackTime = 1100;
    this.clickEnabled = false;
    window.setTimeout(function () {
      return _this6.clickEnabled = true;
    }, visualFeedbackTime);

    if (firstId === secondId) {
      var matchedCards = this.cards.filter(function (card) {
        return card.getAttribute('data-id') === firstId;
      });
      octopus.updateMatchingResult('match');
      this.flashMatching(matchedCards); // Visiual feedback first

      this.trueDataMatchedAttr(matchedCards);
      this.checkWin();
    } else {
      var unmatchedCards = this.cards.filter(function (card) {
        return card.getAttribute('aria-selected') === 'true' && card.getAttribute('data-matched') === 'false';
      });
      octopus.updateMatchingResult('different');
      this.flashUnmatching(unmatchedCards); // Visiual feedback first

      window.setTimeout(function () {
        _this6.falseAriaSelectedAttr(unmatchedCards);
      }, visualFeedbackTime);
    }

    octopus.resetSelectedId();
  },
  flashMatching: function flashMatching(matchedCards) {
    var _this7 = this;

    var cardShowingTime = 300;
    var flashTime = 200; // Keyframe alternative

    window.setTimeout(function () {
      _this7.backgroundGreen(matchedCards);

      window.setTimeout(function () {
        _this7.backgroundWhite(matchedCards);

        window.setTimeout(function () {
          _this7.backgroundGreen(matchedCards);
        }, flashTime);
      }, flashTime);
    }, cardShowingTime);
  },
  flashUnmatching: function flashUnmatching(unmatchedCards) {
    var _this8 = this;

    var cardShowingTime = 300;
    var flashTime = 200; // Keyframe alternative

    window.setTimeout(function () {
      _this8.backgroundRed(unmatchedCards);

      window.setTimeout(function () {
        _this8.backgroundWhite(unmatchedCards);

        window.setTimeout(function () {
          _this8.backgroundRed(unmatchedCards);

          window.setTimeout(function () {
            _this8.backgroundWhite(unmatchedCards);
          }, flashTime);
        }, flashTime);
      }, flashTime);
    }, cardShowingTime);
  },
  backgroundRed: function backgroundRed(cards) {
    cards.forEach(function (card) {
      return card.style.backgroundColor = '#FCB8B8';
    });
  },
  backgroundGreen: function backgroundGreen(cards) {
    cards.forEach(function (card) {
      return card.style.backgroundColor = '#B8FCC0';
    });
  },
  backgroundWhite: function backgroundWhite(cards) {
    cards.forEach(function (card) {
      return card.style.backgroundColor = 'white';
    });
  },
  trueDataMatchedAttr: function trueDataMatchedAttr(matchedCards) {
    matchedCards.forEach(function (card) {
      return card.setAttribute('data-matched', 'true');
    });
  },
  trueAriaSelectedAttr: function trueAriaSelectedAttr(card) {
    card.setAttribute('aria-selected', 'true');
  },
  falseAriaSelectedAttr: function falseAriaSelectedAttr(unmatchedCards) {
    unmatchedCards.forEach(function (card) {
      return card.setAttribute('aria-selected', false);
    });
  },
  checkWin: function checkWin() {
    var allMatched = this.cards.every(function (card) {
      return card.getAttribute('data-matched') === 'true';
    });

    if (allMatched) {
      octopus.updateMatchingResult('Done');
      octopus.stopTimer();
      setTimeout(function () {
        octopus.openDialog();
      }, 300); // Card opening time
    }
  },
  reset: function reset() {
    this.falseAriaSelectedAttr(this.cards);
  },
  handleInput: function handleInput(card, cardOrder, direction) {
    var activeCard,
        previousCard = card;

    switch (direction) {
      case 'right':
        if (cardOrder !== 15) {
          // Last card
          activeCard = this.cards[cardOrder + 1];
          this.activateCard(previousCard, activeCard);
        }

        break;

      case 'left':
        if (cardOrder !== 0) {
          // First card
          activeCard = this.cards[cardOrder - 1];
          this.activateCard(previousCard, activeCard);
        }

        break;

      case 'down':
        if (cardOrder >= 12 && cardOrder <= 14) {
          // Last row
          activeCard = this.cards[cardOrder - 11];
          this.activateCard(previousCard, activeCard);
        } else if (cardOrder !== 15) {
          activeCard = this.cards[cardOrder + 4];
          this.activateCard(previousCard, activeCard);
        }

        break;

      case 'up':
        if (cardOrder >= 1 && cardOrder <= 3) {
          // First row
          activeCard = this.cards[cardOrder + 11];
          this.activateCard(previousCard, activeCard);
        } else if (cardOrder !== 0) {
          activeCard = this.cards[cardOrder - 4];
          this.activateCard(previousCard, activeCard);
        }

        break;

      case 'home':
        if (cardOrder <= 3) {
          activeCard = this.cards[0];
        } else if (cardOrder <= 7) {
          activeCard = this.cards[4];
        } else if (cardOrder <= 11) {
          activeCard = this.cards[8];
        } else {
          activeCard = this.cards[12];
        }

        this.activateCard(previousCard, activeCard);
        break;

      case 'end':
        if (cardOrder >= 12) {
          activeCard = this.cards[15];
        } else if (cardOrder >= 8) {
          activeCard = this.cards[11];
        } else if (cardOrder >= 4) {
          activeCard = this.cards[7];
        } else {
          activeCard = this.cards[3];
        }

        this.activateCard(previousCard, activeCard);
        break;
    }
  },
  activateCard: function activateCard(oldCard, newCard) {
    oldCard.blur();
    oldCard.setAttribute('tabindex', '-1'); // Remove from tab sequence

    newCard.focus();
    newCard.setAttribute('tabindex', '0'); //Set in the tab sequence
  },
  render: function render(focusedIndex) {
    var _this9 = this;

    this.rows.forEach(function (row) {
      return row.querySelector('ul').removeAll();
    });
    var fragment = document.createDocumentFragment();
    var rowIndex = 0;
    var cards = octopus.getCards().repeat(2).shuffle();
    cards.forEach(function (card, index) {
      var listItem = document.createElement('li');
      listItem.classList.add('card');

      if (index === 0) {
        // Only the first card will be in the tab sequence
        listItem.innerHTML = "<button type=\"button\" data-matched=\"false\" role=\"gridcell\" aria-selected=\"false\" aria-label=\"card ".concat(index + 1, "\" data-id=\"").concat(card.id, "\" data-num=\"").concat(index, "\" data-name=\"").concat(card.characterName, "\">\n          <img src=\"").concat(card.src, "\" alt=\"Anime Character\" class=\"back\">\n          <div class=\"front\"></div>\n        </button>");
      } else {
        // tabindex="-1"
        listItem.innerHTML = "<button type=\"button\" data-matched=\"false\" role=\"gridcell\" aria-selected=\"false\" aria-label=\"card ".concat(index + 1, "\" data-id=\"").concat(card.id, "\" tabindex=\"-1\" data-num=\"").concat(index, "\" data-name=\"").concat(card.characterName, "\">\n          <img src=\"").concat(card.src, "\" alt=\"Anime Character\" class=\"back\">\n          <div class=\"front\"></div>\n        </button>");
      }

      fragment.appendChild(listItem);

      if (fragment.children.length === 4) {
        // Row
        _this9.rows[rowIndex].querySelector('ul').appendChild(fragment);

        rowIndex++;
        fragment.removeAll();
      }
    });
    this.cards = Array.from(document.querySelectorAll('[data-id]'));

    if (focusedIndex) {
      this.cards[focusedIndex].focus();
    } // Managing Focus - Keyboard support


    this.cards.forEach(function (card) {
      card.addEventListener('keydown', function (event) {
        if (event.keyCode === 35 || event.keyCode === 36) event.preventDefault(); // home || end

        var cardOrder = card.getAttribute('data-num');

        _this9.handleInput(card, Number(cardOrder), _this9.interactiveKeys[event.keyCode]);
      });
    });
  }
};
/* Game status --- */

var gameStatus = {
  init: function init() {
    this.matchingResult = document.querySelector('#matching-result');
    this.character = document.querySelector('#character');
  },
  render: function render() {
    this.matchingResult.textContent = octopus.getMatchingResult();
    this.character.textContent = 'Character name: ' + octopus.getCharacter();
  }
};
/* Modal Window --- */

var modalView = {
  init: function init() {
    var _this10 = this;

    this.modalContainer = document.querySelector('#modal-container');
    this.modal = document.querySelector('#result-modal');
    this.movesAndTime = document.querySelector('#moves-time');
    this.button = document.querySelector('#play-again'); // Event listeners

    this.button.addEventListener('click', function () {
      octopus.closeDialog();
      octopus.reset(_this10.focusedElementBeforeModal.getAttribute('data-num')); // Pass a refernce to the last focused element so it's focused again after resetting
    });
    this.button.addEventListener('keydown', function (event) {
      if (event.keyCode === 9) event.preventDefault(); // tab: Focus trap
      else if (event.keyCode === 27) _this10.closeDialog(); // esc: close
    });
    this.modalContainer.addEventListener('click', function (event) {
      if (event.target === _this10.modalContainer) {
        _this10.closeDialog();
      }
    });
    this.render();
  },
  generateResultStr: function generateResultStr(moves, seconds, minutes) {
    var resultStr;

    if (minutes > 0) {
      resultStr = "".concat(moves, " ").concat(moves === 1 ? 'move' : 'moves', " in ").concat(minutes, " ").concat(minutes === 1 ? 'minute' : 'minutes');

      if (seconds > 0) {
        resultStr += " and ".concat(seconds, " ").concat(seconds === 1 ? 'second' : 'seconds');
      }
    } else {
      // minutes = 0
      resultStr = "".concat(moves, " ").concat(moves === 1 ? 'move' : 'moves', " in ").concat(seconds, " ").concat(seconds === 1 ? 'second' : 'seconds');
    }

    return resultStr;
  },
  openDialog: function openDialog() {
    this.focusedElementBeforeModal = document.activeElement; // Reference to the last focused element

    this.modalContainer.setAttribute('data-visible', 'true');
    this.modal.open = true;
    this.button.focus();
  },
  closeDialog: function closeDialog() {
    this.modalContainer.setAttribute('data-visible', 'false');
  },
  render: function render() {
    var _octopus$getTime2 = octopus.getTime(),
        seconds = _octopus$getTime2.seconds,
        minutes = _octopus$getTime2.minutes;

    var moves = octopus.getMovesRecord();
    var resultStr = this.generateResultStr(moves, seconds, minutes);
    this.movesAndTime.textContent = resultStr;
  }
};
octopus.init(); // Register Service Worker

if ('serviceWorker' in navigator) {
  window.onload = function () {
    navigator.serviceWorker.register('./sw.js').then(function (registration) {
      console.log('SW registered: ', registration);
    }).catch(function (registrationError) {
      console.log('SW registration failed: ', registrationError);
    });
  };
}