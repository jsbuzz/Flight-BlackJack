'use strict';

define(

  [
    'flight/lib/component'
  ],

function(defineComponent) {

    var symbols = ['diams', 'hearts', 'spades', 'clubs'];
    var suits = {
        diams  : '♦',
        hearts : '♥',
        spades : '♠',
        clubs  : '♣'
    };
    var ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'j', 'q', 'k', 'a'];

    var cardSet;

    return defineComponent(deck);

    function deck() {

      this.defaultAttrs({
        playOffTimeout: 600
      });

      this.after("initialize", function() {
        this.on("uiCardRequested", serveCard);
        this.on("uiInitGame", initGame);
        this.on("playerRoundOver", playOff);
        this.on("dataGameOver", gameOver);

        resetCards();
      });
    }

    function playOff() {
        this.nextDealerCard = setTimeout(function() {
            serveCard.call(this, null, {for: 'dealer'});
            playOff.call(this);
        }.bind(this), this.attr.playOffTimeout);
    }

    function gameOver() {
        setTimeout(function() { // do this asynchronously
            clearTimeout(this.nextDealerCard);
        }.bind(this), 1);
    }

    function initGame() {
        setTimeout(function() { // do this asynchronously
            // two cards for the player
            serveCard.call(this, null, {for: 'player'});
            serveCard.call(this, null, {for: 'player'});

            // two cards for the dealer
            serveCard.call(this, null, {for: 'dealer', back: true});
            serveCard.call(this, null, {for: 'dealer'});
        }.bind(this), 1);
    }

    function serveCard(ev, data) {
        var card = pullCard();
        data || (data = {});

        $.extend(data, {
            symbol: card.symbol,
            rank: card.rank,
            html: '<li><div class="card rank-%rank% %symbol%%back%"><span class="rank">%rank%</span><span class="suit">%suit%</span></div></li>'
                    .replace(/%[a-z]+%/g, function(key) {
                        key = key.substr(1, key.length - 2);
                        switch(key) {
                            case 'suit'   : return suits[card.symbol];
                            case 'back'   : return data.back ? ' back' : '';
                            default: return card[key];
                        };
                    })
        });
        this.trigger('dataCardServed', data);
    }

    function resetCards() {
        cardSet = [];
        for (var s = 0; s < symbols.length; s++) {    
            for (var r = 0; r < ranks.length; r++) {
                cardSet.push({
                    symbol: symbols[s],
                    rank: ranks[r]
                });
            }
        }
    }

    function pullCard() {
        if(!cardSet.length) {
            resetCards();
        }
        var pos = Math.floor(Math.random()*cardSet.length),
            card = cardSet[pos];

        cardSet = cardSet.slice(0, pos).concat(cardSet.slice(pos+1)); 
        return card;
    }
});
