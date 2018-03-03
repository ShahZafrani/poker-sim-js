// Ugly but workable way to test logic and functions. 

Array.prototype.count = function(elem) {
  var occurances = 0
  for (i = 0; i < this.length; i++) {
    if(this[i] == elem) {
      occurances += 1
    }
  }
  return occurances
}


var test = [1,1,1,2,2,3]

console.log(test)
console.log("test: 3 occurs 1 times: ",test.count(3))


Array.prototype.last = function() {
    return this[this.length - 1]
}


console.log("test. last elem should be 3: ", test.last())

var faces = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A']

var handFaces = ['K', 'J', 'Q', 'T', '9']
handFaces.sort(function(x, y)
          {
             return faces.indexOf(x) - faces.indexOf(y)
          })
var lowestCard = handFaces[0]
var highestCard = handFaces.last()
var faceSet = new Set(handFaces)
//check for straights
if ((faces.indexOf(highestCard) - faces.indexOf(lowestCard)) == 4 && (faceSet.size == 5)) {
  console.log('test pass: straight')
} else {
  console.log('test fail: not straight')
}

var handFaces = ['3', '2', '4', '6', '5']
handFaces.sort(function(x, y)
          {
             return faces.indexOf(x) - faces.indexOf(y)
          })
var lowestCard = handFaces[0]
var highestCard = handFaces.last()
var faceSet = new Set(handFaces)
//check for straights
if ((faces.indexOf(highestCard) - faces.indexOf(lowestCard)) == 4 && (faceSet.size == 5)) {
  console.log('test pass: straight')
} else {
  console.log('test fail: not straight')
}

var handFaces = ['2', '4', '4', '6', '5']
handFaces.sort(function(x, y)
          {
             return faces.indexOf(x) - faces.indexOf(y)
          })
var lowestCard = handFaces[0]
var highestCard = handFaces.last()
var faceSet = new Set(handFaces)
//check for straights
if ((faces.indexOf(highestCard) - faces.indexOf(lowestCard)) == 4 && (faceSet.size == 5)) {
  console.log('test fail: straight')
} else {
  console.log('test pass: not straight')
}

function cardVal(cardFace) {
  var indexVal = "0" + faces.indexOf(cardFace)
  return indexVal.slice(-2)
}

console.log('cval K', cardVal('K'))
console.log('cval 2', cardVal('2'))
console.log('cval T', cardVal('T'))

var handSuits = ["Hearts", "Hearts", "Hearts", "Hearts", "Hearts"]
var suitSet = new Set(handSuits)
console.log(handSuits)
if(suitSet.size === 1) {
  console.log("pass! Hand is a flush")
} else {
  console.log("Fail! Hand should be a flush.")
}

var handSuits = ["Diamonds", "Hearts", "Hearts", "Diamonds", "Hearts"]
var suitSet = new Set(handSuits)
console.log(handSuits)
if(suitSet.size === 1) {
  console.log("Fail! Hand is NOT a flush")
} else {
  console.log("Pass! Hand is NOT a flush.")
}
