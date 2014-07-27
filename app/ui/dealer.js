'use strict';

define(

  [
    'flight/lib/component',
    'app/mixin/with_deck'
  ],

  function(defineComponent, with_deck) {

    return defineComponent(dealer, with_deck);

    function dealer() {
        this.defaultAttrs({
            player: 'dealer'
        });

        this.after('initialize', function() {
            this.on(document, 'playerRoundOver', function() {
                this.$node.find('.card.back').removeClass('back');
            });
        });
    }
  }
);
