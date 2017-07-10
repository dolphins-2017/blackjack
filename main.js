var App = {

	"players": [
		{
			'cards': [], 
			'score': 0
		}
	],

	"setDeck": function setDeck(data){
		this.deckId = data["deck_id"];
	},
	"getDeck": function getDeck(){
		return this.deckId;
	},

	"setCardsValue": function setCardsValue(data){
		var cardsValues = [];
		for (var idx = 0; idx < data['cards'].length; idx++) {
			cardValue = data['cards'][idx]['value'];
			cardsValues.push(cardValue);

		}
		return cardsValues;
	},

	"getCardsValue": function getCardsValue(){
		return this.cardsValue;
	},

	"faceValues": function faceValues(data){
		var points = 0; 
		for(var idx = 0; idx < data['cards'].length; idx++) {
			if (data['cards'][idx]['value'] === 'ACE' || data['cards'][idx]['value'] === 'KING' || data['cards'][idx]['value'] ===  'QUEEN' || data['cards'][idx]['value'] === 'JACK') {
				data['cards'][idx]['value'] = 10;
			} else {
				data['cards'][idx]['value'] = parseInt(data['cards'][idx]['value']);
			}
			this.players[0]['cards'].push(data['cards'][idx]);
			points = points + data['cards'][idx]['value'];
				
		}
		this.players[0]['score'] += points;
		console.log(this.players[0]['score']);
	}

};




var CardsAPI = {
    "base": "https://deckofcardsapi.com/api/deck/",
    "getDeck": function getDeck( callback ){

        $.ajax({
            "url": this.base + "new/shuffle/", 
            "crossDomain": true,
            "dataType": "json"
        }).then(function( data, status, responseObject ){
            callback( data );
        });
    },
    "drawCard": function drawCard( deck_id, count, callback ){

        $.ajax({
            "url": this.base + deck_id + "/draw/?count=" + count , 
            "crossDomain": true,
            "dataType": "json"
        }).then(function( data, status, responseObject ){
            callback( data );
        });
    }

};



$(document).ready(function(){
    var $getDeckButton, $drawCardButton;

    $getDeckButton = $( "#getNewDeck" );
    $drawCardButton = $( "#drawCard" );

    $getDeckButton.on( "click", function( event ){
        event.preventDefault();
        
        var after1 = function( data ){
          	var template, rendered
            template = $( "#cards-deck-template" ).html();
            App.setDeck( data );
      		rendered = Mustache.render( template, {"content": data });
            $("#getNewDeck").html( rendered );
        };

        CardsAPI.getDeck( after1 );
    
    });


     $drawCardButton.on( "click", function( event ){
        event.preventDefault();
        var count, after2;
        after2 = function( data ){
          	var template, rendered;
            template = $( "#your-card" ).html();
            App.setCardsValue( data );
            App.faceValues(data);
      		rendered = Mustache.render( template, {"content": App.players[0] });
            $("#cards").html( rendered );
            
        };

        count = (App.players[0].cards.length ? 1:2);
        CardsAPI.drawCard( App.getDeck(), count, after2 );
    
    });


});


