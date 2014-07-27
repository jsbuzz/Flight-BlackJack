'use strict';

define(

  [
    'flight/lib/component'
  ],

function(defineComponent) {
    var scores;

    return defineComponent(score);

    function score() {
      this.after("initialize", function() {
        this.on('playerRoundOver', function(ev, data) {
            scores[data.for].finished = true;
        });
        this.on("dataCardServed playerRoundOver", checkScores);
        this.on("uiInitGame", resetScores);
      });
    }

    function resetScores() {
        scores = {};
    }

    function checkScores(ev, data) {
        if(ev.type !== 'playerRoundOver') {
            var score = scores[data.for] || {soft: 0, hard: 0};

            if(data.rank === 'a') {
                score.soft += 1;
                score.hard += 11;
            } else if(isFinite(data.rank)) {
                score.soft += parseInt(data.rank);
                score.hard += parseInt(data.rank);
            } else {
                score.soft += 10;
                score.hard += 10;            
            }
            score.optimal = score.hard <= 21 ? score.hard : score.soft;
            scores[data.for] = score;

            this.trigger('dataScoreChanged', {
                for: data.for,
                score: score
            });
        }

        Object.keys(scores).forEach(function(player) {
            var score = scores[player];

            if(score.optimal > 21) {
                this.trigger('dataGameOver', {
                    won: player === 'player' ? 'dealer' : 'player'
                });            
            } else if(player !== 'dealer' && score.optimal === 21) {
                this.trigger('dataGameOver', {
                    won: player,
                    blackJack: true
                });            
            } else if(score.finished && score.optimal < scores.dealer.optimal) {
                this.trigger('dataGameOver', {
                    won: 'dealer',
                    reason: 'simply won'
                });            
            }
        }.bind(this));

    }

    function randomFrom(arr) {
      return arr[Math.floor(Math.random()*arr.length)];
    }
});
