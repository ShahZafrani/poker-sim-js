# poker-sim-js
Five Card Draw and Texas Hold Em Simulator
Served as practice for coding challenges.
Features quick n' dirty DOM manipulation.
The main point of interest here is the way the hand scores are encoded. 
+ Straight Flush:
  + "9" + "0000" + [highCardValue]
+ Four of a Kind:
  + "8" + "00" + [valueOfMatchingCard] + [highCardValue]
+ Full House:
  + "7" + [valueOfTripleCard] + [valueOfPairCard] + [highCardValue]
+ Flush:
  + "6" + "0000" + [highCardValue]
+ Straight:
  + "5" + "0000" + [highCardValue]
+ Three of a Kind:
  + "4" + "00" + [valueOfTripleCard] + [highCardValue]
+ Two Pair:
  + "3" + [valueOfHigherPair] + [valueOfLowerPair] + [highCardValue]
+ One Pair:
  + "2" + "00" + [valueOfPair] + [highCardValue]
+ High Card:
  + "1" + "0000" + [highCardValue]
  
