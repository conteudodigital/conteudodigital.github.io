// ESTRUTURA DO JS PARA ALIMENTAR O QUIZ
var content = [{
		/* TITULO - ATUALIZAR O NOME DA IMAGEM DE FUNDO (bgImage) SE TIVER */
		section: 'title',
		bgImage: '',
		html: '<div id="abertura" style="height: 100vh;">'
	},
	{
		/* CONTEUDO - ATUALIZAR O NOME DA IMAGEM DE FUNDO (bgImage) SE TIVER E SE NECESSÁRIO ACRESCENTAR QUALQUER CONTEUDO EM HTML */
		section: 'recurso',
		bgImage: 'quiz/img/SPE_FIL_EF64_LA_10ap_fundo.png',
		html: '<div class="recurso">\
		<div class="recurso-texto">\
							<p class="subtitle is-5">Você sabe quais atitudes devemos cultivar para exercer a empatia? Vamos conhecer um pouco mais sobre isso. </p>\
							<div class="image">\
								<img src="quiz/img/SPE_EF64_FIL_LD_F011.jpg">\
								<p class="legenda"></p>\
								<p class="credito">©Alexandre Beck</p>\
							</div>\
							<p class="fonte">BECK, Alexandre. Armandinho. Disponível em: &lt;https://tirasarmandinho.tumblr.com/search/empatia&gt;. Acesso em: 9 jul. 2018.</p>\
							</div>'
	},
	{
		/* CONTEUDO - ATUALIZAR O NOME DA IMAGEM DE FUNDO (bgImage) SE TIVER E SE NECESSÁRIO ACRESCENTAR QUALQUER CONTEUDO EM HTML */
		section: 'recurso',
		bgImage: 'quiz/img/SPE_FIL_EF64_LA_10ap_fundo.png',
		html: '<div class="recurso">\
		<div class="recurso-texto">\
							<p class="subtitle is-5">Empatia é a capacidade humana de estabelecer uma conexão com os sentimentos de outra pessoa. Por isso, afirma-se que exercer a empatia é um modo de estabelecer uma profunda relação emocional com o outro.</p>\
							<p>É muito mais do que simplesmente prestar atenção nos sentimentos de outra pessoa. Trata-se de se colocar no lugar dela, entendendo esses sentimentos como se fossem nossos.</p>\
							<p>Muitas vezes, essa atitude não é fácil, pois sentir verdadeiramente o que o outro sente requer, da nossa parte, compreensão, paciência, diálogo, entrega, entre outras atitudes.</p>\
							<p>Agora que você já sabe o que é empatia, responda ao <i>quiz</i> a seguir e veja quantas perguntas você consegue acertar sobre o tema. Boa sorte!</p>\
							</div>'
	},
	{
		/* QUIZ - ATUALIZAR O NOME DA IMAGEM DE FUNDO (bgImage) SE TIVER E SE ALIMENTAR COM AS PERGUNTAS E RESPOSTAS DE CADA PERGUNTA */
		section: 'quiz',
		quizType: 'simples',
		/* simples, multipla, slider */
		actionType: 'next',
		/* next, check, again */
		bgImage: 'quiz/img/SPE_FIL_EF64_LA_10ap_fundo.png',
		randomQuestions: false,
		questions: [{
				/* --------------------------- QUESTÃO 01  --------------------------- */
				/* --------------------------- QUESTÃO 02  --------------------------- */

				className: 'question-2',
				question: 'Pedro, João e Manoela estavam assistindo a um filme no cinema. Uma das cenas emocionou tanto Pedro, que ele começou a chorar. João começou a rir dele, achando graça da situação. Então, Manoela disse a João que, apesar de não ter chorado naquela cena, entende porque Pedro se emocionou e que não há motivos para deboche. Das opções abaixo, qual explica melhor uma relação de empatia?',
				append: '',
				alternatives: [{
						answer: 'Manoela com Pedro.',
						img: '',
						value: 'true',
						/* true ou valor numerico*/
						feedback: 'Correto! A empatia é a maneira de estabelecer uma ligação emocional e Manoela entendeu as razões de Pedro para chorar naquela cena do filme. '
					},
					{
						answer: 'João com Pedro.',
						img: '',
						value: '',
						/* true ou valor numerico*/
						feedback: 'Incorreto! Nesse caso, João não exerceu empatia com Pedro, pois riu dos sentimentos dele.'
					},
					{
						answer: 'João com Manoela e Pedro.',
						img: '',
						value: '',
						/* true ou valor numerico*/
						feedback: 'Incorreto! João não considerou, inicialmente, o ponto de vista de Pedro e Manoela.'
					}
				],
				generalFeedback: ''
			},
			{
				/* --------------------------- QUESTÃO 03  --------------------------- */

				className: 'question-3',
				question: 'Qual das opções a seguir é uma característica da empatia?',
				append: '',
				alternatives: [{
						answer: 'Ser indiferente com os sentimentos do outro.',
						img: '',
						value: '',
						/* true ou valor numerico*/
						feedback: 'Incorreto! Ser indiferente não significa ser empático, uma vez que, sendo indiferente, a pessoa não se importa com o sentimento alheio.'
					},
					{
						answer: 'Ter simpatia com o outro.',
						img: '',
						value: '',
						/* true ou valor numerico*/
						feedback: 'Incorreto! Simpatia não implica, necessariamente, em uma atitude de empatia. É mais superficial.'
					},
					{
						answer: 'Conectar-se emocionalmente com o outro.',
						img: '',
						value: 'true',
						/* true ou valor numerico*/
						feedback: 'Correto! A empatia acontece quando se estabelece uma relação de conexão emocional com o outro.'
					}
				],
				generalFeedback: ''
			},
			{
				/* --------------------------- QUESTÃO 04  --------------------------- */

				className: 'question-4',
				question: 'Rodrigo sofre constantemente <i>bullying</i> de um garoto da escola chamado Carlos. Alguns colegas de classe, incomodados com isso, resolveram fazer o mesmo: <i>bullying</i> com Carlos – para ele “sentir na pele” os sofrimentos que causou em Rodrigo. Neste caso, podemos dizer que houve...',
				append: '',
				alternatives: [{
						answer: 'empatia com Carlos.',
						img: '',
						value: '',
						/* true ou valor numerico*/
						feedback: 'Incorreto! A atitude de vingança de maneira nenhuma está conectada à empatia.'
					},
					{
						answer: 'empatia apenas com Rodrigo.',
						img: '',
						value: 'true',
						/* true ou valor numerico*/
						feedback: 'Correto! Os colegas, embora tenham se solidarizado com os sofrimentos de Rodrigo, não levaram em consideração o sofrimento de Carlos.'
					},
					{
						answer: 'empatia com Rodrigo e Carlos.',
						img: '',
						value: '',
						/* true ou valor numerico*/
						feedback: 'Incorreto. Houve empatia apenas com Rodrigo.'
					}
				],
				generalFeedback: ''
			},
			{
				/* --------------------------- QUESTÃO 05  --------------------------- */

				className: 'question-5',
				question: 'Durante uma aula de filosofia, Joana ficou chateada porque alguns alunos não a deixaram falar na sua vez, interrompendo-a com risadas. Se algum colega de Joana quisesse ser empático com ela, deveria:',
				append: '',
				alternatives: [{
						answer: 'dar risada desses colegas quando eles tentassem participar da aula.',
						img: '',
						value: '',
						/* true ou valor numerico*/
						feedback: 'Incorreto! Lembre-se: vingança não é empatia.'
					},
					{
						answer: 'pedir aos colegas que ouçam o que Joana tem a dizer.',
						img: '',
						value: 'true',
						/* true ou valor numerico*/
						feedback: 'Correto! Esta seria uma atitude empática.'
					},
					{
						answer: 'brigar com os colegas que estavam rindo.',
						img: '',
						value: '',
						/* true ou valor numerico*/
						feedback: 'Incorreto! Esta não é uma atitude empática.'
					}
				],
				generalFeedback: ''
			},
			{
				/* --------------------------- QUESTÃO 06  --------------------------- */

				className: 'question-6',
				question: 'Das atitudes abaixo, qual nos ajuda a exercer melhor a empatia em qualquer situação?',
				append: '',
				alternatives: [{
						answer: 'Ouvir a todos.',
						img: '',
						value: 'true',
						/* true ou valor numerico*/
						feedback: 'Correto! Saber ouvir evita julgamentos precipitados e produz abertura para conhecer a realidade do outro.'
					},
					{
						answer: 'Sorrir sempre.',
						img: '',
						value: '',
						/* true ou valor numerico*/
						feedback: 'Incorreto! Sorrir é ótimo, mas, em algumas situações, pode não ajudar a exercer a empatia com alguém. '
					},
					{
						answer: 'Omitir-se sempre.',
						img: '',
						value: '',
						/* true ou valor numerico*/
						feedback: 'Incorreto! Omitir-se significa excluir-se da participação do grupo e, consequentemente, se afasta da empatia.'
					}
				],
				generalFeedback: ''
			},
			{
				/* --------------------------- QUESTÃO 07  --------------------------- */

				className: 'question-7',
				question: 'Você está conversando com alguém sobre religião e ouve algo que não concorda. Entretanto, você quer estabelecer uma relação de empatia com essa pessoa. Como você deveria agir?',
				append: '',
				alternatives: [{
						answer: 'Explicar educadamente para a pessoa que você está certo.',
						img: '',
						value: '',
						/* true ou valor numerico*/
						feedback: 'Incorreto! É fundamental não ser rude com as pessoas. Mas isso não significa ser empático, neste caso.'
					},
					{
						answer: 'Nunca mais tocar neste assunto com essa pessoa.',
						img: '',
						value: '',
						/* true ou valor numerico*/
						feedback: 'Incorreto! Deixar de entender as razões do outro não é exercer a empatia.'
					},
					{
						answer: 'Escutar atentamente os argumentos dela e apresentar os seus a ela.',
						img: '',
						value: 'true',
						/* true ou valor numerico*/
						feedback: 'Correto! Nem sempre é possível concordar com a opinião de alguém, mas isso não significa que não devemos estabelecer uma relação de diálogo.'
					}
				],
				generalFeedback: ''
			},
			{
				/* --------------------------- QUESTÃO 08  --------------------------- */

				className: 'question-8',
				question: 'Das atitudes abaixo, assinale apenas a opção que <b>NÃO</b> se refere ao exercício da empatia.',
				append: '',
				alternatives: [{
						answer: 'Prestar atenção no que o outro está falando.',
						img: '',
						value: '',
						/* true ou valor numerico*/
						feedback: 'Incorreto! Esta atitude é importante para exercer a empatia.'
					},
					{
						answer: 'Aceitar que nem sempre devemos falar.',
						img: '',
						value: '',
						/* true ou valor numerico*/
						feedback: 'Incorreto! Nem sempre a melhor coisa a fazer é falar. Principalmente em situações tristes, como a perda de um ente querido. Isto é empatia.'
					},
					{
						answer: 'Se afastar de pessoas que nos irritam',
						img: '',
						value: 'true',
						/* true ou valor numerico*/
						feedback: 'Correta! Esta atitude não é um modo correto de exercer a empatia.  '
					}
				],
				generalFeedback: ''
			}
		]
	},
	{
		/* RESULTADO - ATUALIZAR O NOME DA IMAGEM DE FUNDO (bgImage) SE TIVER */
		section: 'result',
		bgImage: '',
	}
];