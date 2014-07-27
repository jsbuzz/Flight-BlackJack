'use strict';

define(

  function() {

    return withDeck;

    function withDeck() {

        this.defaultAttrs({
            cardsSelector: 'ul.table',
            hitSelector: 'li.hit',
            allCardsSelector: '.table li:not(.control)'
        });

        this.after('initialize', function() {
            this.on(document, 'dataCardServed', addCard);
            this.on(document, 'uiInitGame', resetDeck);
            this.on('click', {
                hitSelector: requestCard
            });
        });
    }

    function addCard(ev, data) {
        if(data.for !== this.attr.player) {
            return ;
        }
        if(this.attr.player === 'dealer') {
            $(data.html).appendTo(this.select('cardsSelector'));
        } else {
            $(data.html).insertBefore(this.attr.hitSelector);
        }
    }

    function resetDeck() {
        this.select('allCardsSelector').remove();
    }

    function requestCard() {
        this.trigger('uiCardRequested', {for: this.attr.player});
    }

  }
);
