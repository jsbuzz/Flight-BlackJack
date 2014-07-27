'use strict';

define(

  [
    'flight/lib/component',
    'app/mixin/with_deck'
  ],

  function(defineComponent, with_deck) {

    return defineComponent(playerControls, with_deck);

    function playerControls() {
        this.defaultAttrs({
            staySelector: '.card.stay',
            controlsSelector : 'li.control',
            resetSelector: 'button#reset',
            scoreBoardSelector: '.score-board',
            player: 'player'
        });

        this.after('initialize', function() {
            this.on(document, 'dataScoreChanged', showScore);
            this.on(document, 'uiInitGame', function() {
                this.select('controlsSelector').show();
                this.select('resetSelector').hide();
                this.select('scoreBoardSelector').html('');
            });
            this.on(document, 'dataGameOver', function(ev, data) {
                this.select('resetSelector').show();
                this.select('controlsSelector').hide();
                this.select('scoreBoardSelector').html(data.won === this.attr.player ? 
                    (data.blackJack ? 'BlackJack! Lucky hand!' : 'You won!!!') : 'You loose...');
            });
            this.on('click', {
                staySelector: function() {
                    this.select('controlsSelector').hide();
                    this.trigger('playerRoundOver', {for: this.attr.player});
                },
                resetSelector: function() {
                    this.trigger('uiInitGame');
                }
            });

            this.select('controlsSelector').hide();
        });
    }

    function showScore(ev, data) {
        if(data.for !== this.attr.player) {
            return ;
        }
        this.select('scoreBoardSelector').html('Your count: ' + data.score.optimal);
    }
  }
);
