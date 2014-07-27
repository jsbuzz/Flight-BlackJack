'use strict';

define(

  [
    'app/data/deck',
    'app/data/score',
    'app/ui/playerControls',
    'app/ui/dealer'
  ],

  function(deck, score, playerControls, dealer) {

    function initialize() {
      deck.attachTo(document);
      score.attachTo(document);
      playerControls.attachTo('#player-controls');
      dealer.attachTo('#dealer');
      $(document.body).removeClass('loading');
    }

    return initialize;
  }
);
