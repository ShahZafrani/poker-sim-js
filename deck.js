

var tableDiv, playerDiv, statusDiv, winnerDiv = null;

// object for gamestate
var gs = null
function resetGame() {
  gs = {
    "players" : [
      {
        "name": "Alice",
        "hand": []
      },
      {
        "name": "Bob",
        "hand": []
      },
      {
        "name": "Eve",
        "hand": []
      }
    ],
    "deck" : createDeck(),
    "tableCards" : [],
    "status": 0
  }
  winnerDiv.innerHTML = ""
}
//assign values once page loads (this helps avoid a race condition)
window.onload = function(){
  initializeDisplay();
};
function initializeDisplay(){
  tableDiv = document.getElementById("table");
  playerDiv = document.getElementById("players");
  statusDiv = document.getElementById("status");
  winnerDiv = document.getElementById("winnerDiv");
}

// suits all have the same value
var suits = ['Spades', 'Hearts', 'Diamonds', 'Clubs']
// the indexes in this array are used for face values
var faces = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A']

// extend array prototype as opposed to importing lodash
Array.prototype.count = function(elem) {
  var occurances = 0
  for (i = 0; i < this.length; i++) {
    if(this[i] == elem) {
      occurances += 1
    }
  }
  return occurances
}
// because js needs indexing like python. some_list[-1] is the last element.
Array.prototype.last = function() {
    return this[this.length - 1]
}

// returns an random index that exists in the deck
function getRandomCardIndex(remainingDeckSize) {
  return Math.floor(Math.random() * Math.floor(remainingDeckSize));
}

// get a random card and remove it from the deck object.
function getCard(deck) {
  var cardIndex = getRandomCardIndex(deck.length)
  var card = deck[cardIndex]
  deck.splice(cardIndex, 1)
  return card
}

// there is no jokers in this deck
function createDeck() {
  var d = []
  for(s = 0; s < 4; s++) {
    for(f = 0; f < 13; f++) {
      let card = faces[f]+suits[s]
      d.push(card)
    }
  }
  return d
}

function printState() {
  console.log("Status: ", statusEnum[gs.status].desc)
  console.log("Players:")
  for(p = 0; p < gs.players.length; p++) {
    console.log(gs.players[p].name)
    console.log(gs.players[p].hand)
  }
  console.log("On the table: ", gs.tableCards)
  console.log("Remaining in Deck: ", gs.deck.length)
  console.log(gs.deck)
}

// it's not pretty, but it works.
function drawState() {
  statusDiv.innerHTML = statusEnum[gs.status].desc

  playerDiv.innerHTML = ''
  for(p = 0; p < gs.players.length; p++) {
    var output = gs.players[p].name + ": " + gs.players[p].hand
    var node = document.createElement("li");
    playerDiv.appendChild(node);
    var text = document.createTextNode(output);
    node.appendChild(text);
  }
  tableDiv.innerHTML = gs.tableCards
}

// there's gotta be a better way to do this. Oh well, it fits MVP
function nextState() {
  var next = statusEnum[gs.status].action
  gs.status += 1
  next()
  drawState()
  printState()
}


function bets() {
  //todo ... maybe
}

function dealHand(handSize) {
  for(p = 0; p < gs.players.length; p ++) {
    for(h = 0; h < handSize; h++) {
      gs.players[p].hand.push(getCard(gs.deck))
    }
  }
}


// These could be reduce to one function with a for loop. I prefer different functions
function dealToTable(amount) {
  var burnCard = getCard(gs.deck)
  console.log("one card burned")
  for(c = 0; c < amount; c++) {
    gs.tableCards.push(getCard(gs.deck))
  }
}

function buildHand() {
  //todo for texas hold em
}

function cardVal(cardFace) {
  var indexVal = "0" + faces.indexOf(cardFace)
  // the value always needs to be a 2 digit string. "02" or "11"
  return indexVal.slice(-2)
}

function evalScore(hand) {
  var handFaces = []
  var handSuits = []
  var output = {
    "high": null,
    "pairs": [],
    "three": null,
    "four": null,
    "straight": null,
    "flush": null,
    "score" : "0"
  }
  var numPairs = 0
  for (c = 0; c < hand.length; c++) {
    handFaces.push(hand[c].slice(0,1))
    handSuits.push(hand[c].slice(1))
  }
  handFaces.sort(function(x, y)
            {
               return cardVal(x) - cardVal(y)
            })

  var lowestCard = handFaces[0]
  var highestCard = handFaces.last()
  output.high = highestCard
  //default score is high card
  output.score = "1" + "0000" + cardVal(output.high)
  var suitSet = new Set(handSuits)
  var faceSet = new Set(handFaces)
  //check for straights
  if((faces.indexOf(highestCard) - faces.indexOf(lowestCard)) == 4 && (faceSet.size == 5)) {
    isStraight = true
  }
  //check for flush
  if(suitSet.size === 1) {
    output.flush = true
  }
  if(output.straight) {
    output.score = "5" + "0000" + cardVal(output.high)
  }
  if(output.flush) {
    output.score = "6" + "0000" + cardVal(output.high)
  }
  if(output.flush && output.straight) {
    //return encoding for straight_flush with highcard and suit
    output.score = "9" + "0000" + cardVal(output.high)
  }
  //check for pairs
  faceSet.forEach(function(elem) {
    var count = handFaces.count(elem)
    switch(count){
        case 2:
          output.pairs.push(elem)
          break
        case 3:
          output.three = (elem)
          break
        case 4:
          output.four = (elem)
          output.score = "8" + "00" + cardVal(elem) +cardVal(output.high)
          break
        default:
          break
    }
  })
  if(output.pairs[0]) {
    output.score = "2" + "00" + cardVal(output.pairs[0]) + cardVal(output.high)
  }
  if(output.pairs[1]){
    var pairVals = [cardVal(output.pairs[0]), cardVal(output.pairs[1])]
    pairVals.sort().reverse()
    output.score = "3" + pairVals[0] + pairVals[1] + cardVal(output.high)
  }
  if(output.three) {
    output.score = "4" + "00" + cardVal(output.three) + cardVal(output.high)
  }
  if(output.three && output.pairs[0]) {
    output.score = "7" + cardVal(output.three) + cardval(output.pairs[0]) + cardVal(output.high)
  }
  return output.score
}

function determineWinner() {
  var winner = {
    "name": "no one",
    "score" : 0
  }
  for(p = 0; p < gs.players.length; p++) {
    var score = evalScore(gs.players[p].hand)
    console.log(gs.players[p].name, " : ", score)
    if (score > winner.score) {
      winner.name = gs.players[p].name
      winner.score = score
    } else if (score == winner.score) {
      var first = winner.name
      winner.name = "Split Pot between: " + first + " and " + gs.players[p].name 
    }
  }
  winnerDiv.innerHTML = "Winner is: " + winner.name
}



var statusEnum = [
  {
    'desc' : 'Waiting For Hands',
    'action' : function(){
      dealHand(5)
    }
  },
  {
    'desc': 'Calculating Winner',
    'action' : function(){
      determineWinner()
    }
  },
  {
    'desc': 'Preparing for next game',
    'action' : function(){
      resetGame()
    }
  }
]


// var statusEnum = holdEmEnum

var holdEmEnum = [
  {
    'desc' : 'Waiting For Hands',
    'action' : function(){
      dealHand(2)
    }
  },
  // {
  //   'desc' : 'Placing Bets Before Flop',
  //   'action' : bets()
  // },
  {
    'desc' : 'Waiting For Flop',
    'action' : function(){
      dealToTable(3)
    }
  },
  // {
  //   'desc' : 'Placing Bets Before Turn',
  //   'action' : bets()
  // },
  {
    'desc' : 'Waiting For Turn',
    'action' : function(){
      dealToTable(1)
    }
  },
  // {
  //   'desc' : 'Placing Bets Before River',
  //   'action' : bets()
  // },
  {
    'desc' : 'Waiting For River',
    'action' : function(){
      dealToTable(1)
    }
  },
  // {
  //   'desc' : 'Placing Bets Before Winner is revealed',
  //   'action' : bets()
  // },
  {
    'desc': 'Calculating Winner',
    'action' : function(){
      determineWinner()
    }
  },
  {
    'desc': 'Preparing for next game',
    'action' : function(){
      resetGame()
    }
  }
]

function chooseGame(game) {

}

// initializes first gameState
resetGame()
