// creditos e versao do jogo
var configAbout = {
	title: gameConfig.nome,
	color: "#2F76A2",
	displayData: [
		["Versão", ["1.0.1/2014"]],
		["Autoria", ["Katherine Scott"]],
		["Design e Ilustração", ["Sergey Vasgas e Caroline Cavalcante"]],
		["Locução", ["Jürgen Pfitzner e Ana Clara Fischer"]]
	]
};

// introducao do jogo com som de fundo
var introAbout = {
	'type' : 'box', // "box" ou "audio"
	'message' : 'Pratique o verbo <i><b>be</b></i> no singular com os jogos a seguir.',
	'sound' : 'mp3/intro.mp3'
}

var config = [

	// ==================== Nivel 1 > Etapa 1 ===========================================================
{
	"typeLevel": "memory",
	"message" : "THERE ARE TWELVE CARDS IN THIS GAME. SIX OF THE CARDS ARE IN THE AFFIRMATIVE FORM AND SIX OF THEM ARE IN THE NEGATIVE FORM. FIND THE PAIRS.",
	"soundMessage" : "mp3/enunciado01.mp3",
	"numberCardsCorrect": 2,
	"numberCardsLine" : 4,
	"imgCardBack" : "img/memory/tela/carta.png",
	"flipStartCardsTimeout": 3000,
	"cards":[
		{
		    "classe": "card-position-1",
		    "width": 113,
		    "height": 130,
		    "src": "img/memory/cards/id01.png",
		    "id" : "0",
		    "soundCheck" : "",
		  "feedback" : "img/memory/cards/feedback.gif"
		},{
		    "classe": "card-position-1",
		    "width": 113,
		    "height": 130,
		    "src": "img/memory/cards/id02.png",
		    "id" : "0",
		    "soundCheck" : "",
		  "feedback" : "img/memory/cards/feedback.gif"
		},{
		    "classe": "card-position-1",
		    "width": 113,
		    "height": 130,
		    "src": "img/memory/cards/id03.png",
		    "id" : "1",
		    "soundCheck" : "",
		  "feedback" : "img/memory/cards/feedback.gif"
		},{
		    "classe": "card-position-1",
		    "width": 113,
		    "height": 130,
		    "src": "img/memory/cards/id04.png",
		    "id" : "1",
		    "soundCheck" : "",
		  "feedback" : "img/memory/cards/feedback.gif"
		},{
		    "classe": "card-position-1",
		    "width": 113,
		    "height": 130,
		    "src": "img/memory/cards/id05.png",
		    "id" : "2",
		    "soundCheck" : "",
		  "feedback" : "img/memory/cards/feedback.gif"
		},{
		    "classe": "card-position-1",
		    "width": 113,
		    "height": 130,
		    "src": "img/memory/cards/id06.png",
		    "id" : "2",
		    "soundCheck" : "",
		  "feedback" : "img/memory/cards/feedback.gif"
		},{
		    "classe": "card-position-1",
		    "width": 113,
		    "height": 130,
		    "src": "img/memory/cards/id07.png",
		    "id" : "3",
		    "soundCheck" : "",
		  "feedback" : "img/memory/cards/feedback.gif"
		},{
		    "classe": "card-position-1",
		    "width": 113,
		    "height": 130,
		    "src": "img/memory/cards/id08.png",
		    "id" : "3",
		    "soundCheck" : "",
		  "feedback" : "img/memory/cards/feedback.gif"
		},{
		    "classe": "card-position-1",
		    "width": 113,
		    "height": 130,
		    "src": "img/memory/cards/id09.png",
		    "id" : "4",
		    "soundCheck" : "",
		  "feedback" : "img/memory/cards/feedback.gif"
		},{
		    "classe": "card-position-1",
		    "width": 113,
		    "height": 130,
		    "src": "img/memory/cards/id10.png",
		    "id" : "4",
		    "soundCheck" : "",
		  "feedback" : "img/memory/cards/feedback.gif"
		},{
		    "classe": "card-position-1",
		    "width": 113,
		    "height": 130,
		    "src": "img/memory/cards/id11.png",
		    "id" : "5",
		    "soundCheck" : "",
		  "feedback" : "img/memory/cards/feedback.gif"
		},{
		    "classe": "card-position-1",
		    "width": 113,
		    "height": 130,
		    "src": "img/memory/cards/id12.png",
		    "id" : "5",
		    "soundCheck" : "",
		  "feedback" : "img/memory/cards/feedback.gif"
		}
	]
},
// ==================== Nivel 2 > Etapa 1 ==========================================================================
/*{
	"typeLevel": "memory_deck",
	"message" : "THERE ARE TWELVE CARDS IN THIS GAME. OBSERVE THE PICTURE AND MATCH THE QUESTION TO THE ANSWER ACCORDINGLY.",
	"soundMessage" : "mp3/enunciado02.mp3",
	"numberCardsCorrect": 2,
	"numberCardsLine" : 4,
	"imgCardBack" : "img/memory/tela/carta.png",
	"flipStartCardsTimeout": 2000,
	"showCardDeckTimeout" : 3000,
    "cartaDeck" :[
		{id: 0, src: "img/memory/tela/cachorro.png", audio:""},
		{id: 1, src: "img/memory/tela/cara.png", audio:""},
		{id: 2, src: "img/memory/tela/mrcollins.png", audio:""},
		{id: 3, src: "img/memory/tela/lilly.png", audio:""},
		{id: 4, src: "img/memory/tela/jeff.png", audio:""},
		{id: 5, src: "img/memory/tela/bicicleta.png", audio:""}
	],
	"cards":[
		{
		    "classe": "card-position-1",
		    "width": 113,
		    "height": 130,
		    "src": "img/memory/cards/id14.png",
		    "id" : "0",
		    "feedback" : "img/memory/cards/feedback.gif",
		    "feedbackReplace" : true
		},{
		    "classe": "card-position-1",
		    "width": 113,
		    "height": 130,
		    "src": "img/memory/cards/id15.png",
		    "id" : "0",
		    "feedback" : "img/memory/cards/feedback.gif",
		    "feedbackReplace" : true
		},
		//---------
		{
		    "classe": "card-position-1",
		    "width": 113,
		    "height": 130,
		    "src": "img/memory/cards/id17.png",
		    "id" : "1",
		    "feedback" : "img/memory/cards/feedback.gif",
		    "feedbackReplace" : true
		},{
		    "classe": "card-position-1",
		    "width": 113,
		    "height": 130,
		    "src": "img/memory/cards/id18.png",
		    "id" : "1",
		    "feedback" : "img/memory/cards/feedback.gif",
		    "feedbackReplace" : true
		},
		//---------
		{
		    "classe": "card-position-1",
		    "width": 113,
		    "height": 130,
		    "src": "img/memory/cards/id20.png",
		    "id" : "2",
		    "feedback" : "img/memory/cards/feedback.gif",
		    "feedbackReplace" : true
		},{
		    "classe": "card-position-1",
		    "width": 113,
		    "height": 130,
		    "src": "img/memory/cards/id21.png",
		    "id" : "2",
		    "feedback" : "img/memory/cards/feedback.gif",
		    "feedbackReplace" : true
		},
		//---------
		{
		    "classe": "card-position-1",
		    "width": 113,
		    "height": 130,
		    "src": "img/memory/cards/id23.png",
		    "id" : "3",
		    "feedback" : "img/memory/cards/feedback.gif",
		    "feedbackReplace" : true
		},{
		    "classe": "card-position-1",
		    "width": 113,
		    "height": 130,
		    "src": "img/memory/cards/id24.png",
		    "id" : "3",
		    "feedback" : "img/memory/cards/feedback.gif",
		    "feedbackReplace" : true
		},
		//---------
		{
		    "classe": "card-position-1",
		    "width": 113,
		    "height": 130,
		    "src": "img/memory/cards/id26.png",
		    "id" : "4",
		    "feedback" : "img/memory/cards/feedback.gif",
		    "feedbackReplace" : true
		},{
		    "classe": "card-position-1",
		    "width": 113,
		    "height": 130,
		    "src": "img/memory/cards/id27.png",
		    "id" : "4",
		    "feedback" : "img/memory/cards/feedback.gif",
		    "feedbackReplace" : true
		},
		//---------
		{
		    "classe": "card-position-1",
		    "width": 113,
		    "height": 130,
		    "src": "img/memory/cards/id29.png",
		    "id" : "5",
		    "feedback" : "img/memory/cards/feedback.gif",
		    "feedbackReplace" : true
		},{
		    "classe": "card-position-1",
		    "width": 113,
		    "height": 130,
		    "src": "img/memory/cards/id30.png",
		    "id" : "5",
		    "feedback" : "img/memory/cards/feedback.gif",
		    "feedbackReplace" : true
		}
	]
},
// ==================== NÃ­vel 3 > Etapa 1 (associacao) ====================================================

{
	"typeLevel": "crossword",
	"message": "LOOK AT THIS GIRL! SHE IS TALKING ABOUT HERSELF. USE THE CODE SYMBOLS TO DECODE THE SENTENCES AND DISCOVER INFORMATION ABOUT HER.",
	"soundMessage": "mp3/enunciado03.mp3",
	"showLocalHint": false,
	"initialScore": 10,
	"rightIncrement": 2,
	"wrongIncrement": -1,
	"type": "image", //image, text
	"bonusTimeMultiplier": 11,
	"audioHints":true,
	"rows": 2,
	"columns": 18,
	"ignorarAcentuacao": false,
	"pre_filled": {"rows": [], "columns":[]},
	"letters": {"C0_0":"m","C1_0":"y","C2_0":"*","C3_0":"n","C4_0":"a","C5_0":"m","C6_0":"e","C7_0":"*","C8_0":"i","C9_0":"s","C10_0":"*","C11_0":"d","C12_0":"o","C13_0":"n","C14_0":"n","C15_0":"a","C16_0":"*","C0_1":"r","C1_1":"u","C2_1":"t","C3_1":"h","C4_1":"*","C5_1":"i","C6_1":"s","C7_1":"*","C8_1":"m","C9_1":"y","C10_1":"*","C11_1":"m","C12_1":"o","C13_1":"t","C14_1":"h","C15_1":"e","C16_1":"r","C17_1":"*"},

	"hints": [
		{
			"row": 1,
			"text": "",
			"audio": "",
			"image": "img/crossword/meninagato.png"
		},{
			"row": 2,
			"text": "",
			"audio": ""
			
		}
	]
},
// ==================== NÃ­vel 3 > Etapa 2 (memoria com deck) ====================
{
	"typeLevel": "crossword",
	"message": "LOOK AT THIS GIRL! SHE IS TALKING ABOUT HERSELF. USE THE CODE SYMBOLS TO DECODE THE SENTENCES AND DISCOVER INFORMATION ABOUT HER.",
	"soundMessage": "mp3/enunciado03.mp3",
	"showLocalHint": false,
	"initialScore": 10,
	"rightIncrement": 2,
	"wrongIncrement": -1,
	"type": "image", //image, text
	"bonusTimeMultiplier": 11,
	"audioHints":true,
	"rows": 2,
	"columns": 18,
	"ignorarAcentuacao": false,
	"pre_filled": {"rows": [], "columns":[]},
	"letters": {"C0_0":"m","C1_0":"y","C2_0":"*","C3_0":"f","C4_0":"a","C5_0":"t","C6_0":"h","C7_0":"e","C8_0":"r","C9_0":"*","C10_0":"i","C11_0":"s","C12_0":"*","C13_0":"m","C14_0":"a","C15_0":"r","C16_0":"k","C17_0":"*",
	"C0_1":"h","C1_1":"e","C2_1":"*","C3_1":"i","C4_1":"s","C5_1":"*","C6_1":"a","C7_1":"*","C8_1":"d","C9_1":"o","C10_1":"c","C11_1":"t","C12_1":"o","C13_1":"r","C14_1":"*"},

	"hints": [
		{
			"row": 1,
			"text": "",
			"audio": "",
			"image": "img/crossword/meninagato.png"
		},{
			"row": 2,
			"text": "",
			"audio": ""
			
		}
	]
},


// ==================== NÃ­vel 3 > Etapa 3 (associacao) ====================
{
	"typeLevel": "crossword",
	"message": "USE THE CODE SYMBOLS TO DECODE THE SENTENCES AND DISCOVER INFORMATION.",
	"soundMessage": "mp3/enunciado04.mp3",
	"showLocalHint": false,
	"initialScore": 10,
	"rightIncrement": 2,
	"wrongIncrement": -1,
	"type": "image", //image, text
	"bonusTimeMultiplier": 11,
	"audioHints":true,
	"rows": 2,
	"columns": 20,
	"ignorarAcentuacao": false,
	"pre_filled": {"rows": [], "columns":[]},
	"letters": {"C0_0":"h","C1_0":"e","C2_0":"*","C3_0":"i","C4_0":"s","C5_0":"*","C6_0":"n","C7_0":"o","C8_0":"t","C9_0":"*","C10_0":"a","C11_0":"*","C12_0":"t","C13_0":"e","C14_0":"a","C15_0":"c","C16_0":"h","C17_0":"e","C18_0":"r","C19_0":"*",
		"C0_1":"i","C1_1":"s","C2_1":"*","C3_1":"h","C4_1":"e","C5_1":"*","C6_1":"a","C7_1":"*","C8_1":"g","C9_1":"o","C10_1":"o","C11_1":"d","C12_1":"*","C13_1":"d","C14_1":"o","C15_1":"c","C16_1":"t","C17_1":"o","C18_1":"r","C19_1":"*"},

	"hints": [
		{
			"row": 1,
			"text": "",
			"audio": "",
			"image": "img/crossword/meninagato.png"
		},{
			"row": 2,
			"text": "",
			"audio": ""
			
		}
	]
},


// ==================== NÃ­vel 3> Etapa 4 (memoria com deck) ====================
{
	"typeLevel": "crossword",
	"message": "USE THE CODE SYMBOLS TO DECODE THE SENTENCES AND DISCOVER INFORMATION.",
	"soundMessage": "mp3/enunciado04.mp3",
	"showLocalHint": false,
	"initialScore": 10,
	"rightIncrement": 2,
	"wrongIncrement": -1,
	"type": "image", //image, text
	"bonusTimeMultiplier": 11,
	"audioHints":true,
	"rows": 2,
	"columns": 20,
	"ignorarAcentuacao": false,
	"pre_filled": {"rows": [], "columns":[]},
	"letters": {"C0_0":"y","C1_0":"e","C2_0":"s","C3_0":"*","C4_0":"h","C5_0":"e","C6_0":"*","C7_0":"i","C8_0":"s","C9_0":"*",
	"C0_1":"t","C1_1":"h","C2_1":"i","C3_1":"s","C4_1":"*","C5_1":"i","C6_1":"s","C7_1":"*","C8_1":"m","C9_1":"y","C10_1":"*","C11_1":"c","C12_1":"a","C13_1":"t","C14_1":"*","C15_1":"b","C16_1":"o","C17_1":"b","C18_1":"*"},

	"hints": [
		{
			"row": 1,
			"text": "",
			"audio": "",
			"image": "img/crossword/meninagato.png"
		},{
			"row": 2,
			"text": "",
			"audio": ""
			
		}
	]
}*/

];