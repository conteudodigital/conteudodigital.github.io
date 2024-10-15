// ESTRUTURA DO JS PARA ALIMENTAR O QUIZ
var content = [
  {
    /* TITULO - ATUALIZAR O NOME DA IMAGEM DE FUNDO (bgImage) SE TIVER */
    section: "title",
    bgImage: "quiz/img/SPE_EDF_EF83_LA_07ap.png",
    html: '	<p class="title is-1 fadeIn"></p>',
  },
  {
    /* CONTEUDO - ATUALIZAR O NOME DA IMAGEM DE FUNDO (bgImage) SE TIVER E SE NECESSÁRIO ACRESCENTAR QUALQUER CONTEUDO EM HTML */
    section: "recurso",
    bgImage: "quiz/img/content.png",
    html: '	<div class="recurso jornal">\
							<div id="page">\
								<section id="header" class="wrap columns h-line">\
									<div class="column is-2">\
										<div class="content">\
											<h4>EDIÇÃO ESPECIAL</h4>\
										</div>\
									</div>\
									<div class="middle column is-8">\
										<div class="content">\
											<h1 class="title has-text-centered">DAILY NEWS</h1>\
										</div>\
									</div>\
									<div class="column is-2">\
										<div class="content">\
										</div>\
									</div>\
								</section>\
								<section id="main" class="wrap h-line">\
									<h4 class="title is-5">Saúde</h4>\
									<h1 class="title is-1">OMS: 80% dos adolescentes no mundo não praticam atividades físicas suficientes</h1>\
									<div class="columns">\
										<div class="content column">\
											<p>Essa é uma manchete que foi vinculada no <i>site</i> oficial das Nações Unidas Brasil. Na reportagem, é abordado o problema mundial referente ao sedentarismo, informando que a Organização Mundial da Saúde elaborou um plano para aumentar pelo menos em 15%, até 2030*, a prática de atividades físicas por jovens e adultos.</p>\
											<p>Disponível em: <a href="https://news.un.org/pt/story/2019/11/1695381" <a href="https://news.un.org/pt/story/2019/11/1695381" target="_blank">Link da fonte</a></p>\
											<p>Na atividade a seguir, responda se o título da questão é uma manchete fake ou um fato.</p>\
										</div>\
										<div class="content column">\
											<div class="" style="position: relative;">\
												<img class="" src="quiz/img/SPE_EDF_EF83_LD_F002.jpg">\
												<p class="legenda"></p>\
												<p class="credito">©Shutterstock/Peter Snaterse</p>\
											</div>\
										</div>\
									</div>\
									<p class="fonte">*Fonte: OMS: 80% dos adolescentes no mundo não praticam atividades físicas suficientes.</p>\
								</section>\
							</div>\
						</div>',
  },
  {
    /* QUIZ - ATUALIZAR O NOME DA IMAGEM DE FUNDO (bgImage) SE TIVER E SE ALIMENTAR COM AS PERGUNTAS E RESPOSTAS DE CADA PERGUNTA */
    section: "quiz",
    quizType: "simples",
    /* simples, multipla, slider */
    actionType: "next",
    /* next, check, again */
    bgImage: "quiz/img/content.png",
    randomQuestions: false,
    questions: [
      {
        /* --------------------------- QUESTÃO 01  --------------------------- */
        className: "question-1",
        question: "Sedentarismo mata tanto quanto cigarro.",
        append: "",
        alternatives: [
          {
            answer: "FATO",
            img: "",
            value: "true",
            /* true ou valor numerico*/
            feedback:
              '	<p>Fato. De acordo com uma pesquisa publicada na revista médica <i>Lancet</i>, a falta de exercícios físicos causa tantas mortes quanto o tabagismo.</p>\
												<p class="fonte">Fonte: TRIGGLE, Nick. Sedentarismo mata tanto quanto cigarro, diz estudo. Disponível em: &lt;https://www.bbc.com/portuguese/noticias/2012/07/120718_sedentarismo_mata_as/&gt;. Acesso em: 23 abr. 2019.</p>',
          },
          {
            answer: "<i>FAKE</i>",
            img: "",
            value: "",
            /* true ou valor numerico*/
            feedback:
              '	<p>A resposta correta é <b>FATO</b>. De acordo com uma pesquisa publicada na revista médica <i>Lancet</i>, a falta de exercícios causa tantas mortes quanto o tabagismo.</p>\
												<p class="fonte">Fonte: TRIGGLE, Nick. Sedentarismo mata tanto quanto cigarro, diz estudo. Disponível em: &lt;https://www.bbc.com/portuguese/noticias/2012/07/120718_sedentarismo_mata_as/&gt;. Acesso em: 23 abr. 2019.</p>',
          },
        ],
        generalFeedback: "",
      },
      {
        /* --------------------------- QUESTÃO 02  --------------------------- */
        className: "question-2",
        question:
          "Um em cada dois adultos é sedentário, diz Organização Mundial da Saúde.",
        append: "",
        alternatives: [
          {
            answer: "FATO",
            img: "",
            value: "",
            /* true ou valor numerico*/
            feedback:
              '	<p>A resposta correta é <b>FAKE</b>. Segundo o estudo divulgado pela Organização Mundial da Saúde (OMS), um em cada 4 adultos é sedentário. A organização também divulgou uma meta global: que países-membros da OMS se comprometam com a redução do sedentarismo em 10% até 2025 e em 15% até 2030. </p>\
												<p class="fonte">Fonte: UM EM CADA 4 adultos é sedentário, diz Organização Mundial da Saúde. Disponível em: &lt;https://g1.globo.com/bemestar/noticia/um-em-cada-4-adultos-e-sedentario-ou-nao-pratica-suficiente-atividade-fisica-diz-oms.ghtml&gt;. Acesso em: 23 abr. 2019.</p>',
          },
          {
            answer: "<i>FAKE</i>",
            img: "",
            value: "true",
            /* true ou valor numerico*/
            feedback:
              '	<p><i>Fake.</i> Segundo o estudo divulgado pela Organização Mundial da Saúde (OMS), um em cada 4 adultos é sedentário. A organização também divulgou uma meta global: que países-membros da OMS se comprometam com a redução do sedentarismo em 10% até 2025 e em 15% até 2030. </p>\
												<p class="fonte">Fonte: UM EM CADA 4 adultos é sedentário, diz Organização Mundial da Saúde. Disponível em: &lt;https://g1.globo.com/bemestar/noticia/um-em-cada-4-adultos-e-sedentario-ou-nao-pratica-suficiente-atividade-fisica-diz-oms.ghtml&gt;. Acesso em: 23 abr. 2019.</p>',
          },
        ],
        generalFeedback: "",
      },
      {
        /* --------------------------- QUESTÃO 03  --------------------------- */
        className: "question-3",
        question: "Sedentarismo já ameaça reduzir expectativa de vida. ",
        append: "",
        alternatives: [
          {
            answer: " FATO",
            img: "",
            value: "true",
            /* true ou valor numerico*/
            feedback:
              '	<p>Fato. Estudos internacionais mostram que a inatividade física atual está criando a primeira geração de jovens que viverão menos que seus pais.</p>\
												<p class="fonte">Fonte: DEIRO, Bruno; PROENÇA, Pedro. Sedentarismo já ameaça reduzir expectativa de vida. Disponível em: &lt;https://www.estadao.com.br/noticias/geral,sedentarismo-ja-ameaca-reduzir-expectativa-de-vida-imp-,955381&gt;. Acesso em: 24 abr. 2019.</p>',
          },
          {
            answer: " <i>FAKE</i>",
            img: "",
            value: "",
            /* true ou valor numerico*/
            feedback:
              '	<p>A resposta correta é <b>FATO</b>. Estudos internacionais mostram que a inatividade física atual está criando primeira geração de jovens que viverão menos que seus pais.</p>\
												<p class="fonte">Fonte: DEIRO, Bruno; PROENÇA, Pedro. Sedentarismo já ameaça reduzir expectativa de vida. Disponível em: &lt;https://www.estadao.com.br/noticias/geral,sedentarismo-ja-ameaca-reduzir-expectativa-de-vida-imp-,955381&gt;. Acesso em: 24 abr. 2019.</p>',
          },
        ],
        generalFeedback: "",
      },
      {
        /* --------------------------- QUESTÃO 04  --------------------------- */
        className: "question-4",
        question:
          "De acordo com a Universidade Stanford, os Estados Unidos da América são o país mais sedentário do mundo.",
        append: "",
        alternatives: [
          {
            answer: " FATO",
            img: "",
            value: "",
            /* true ou valor numerico*/
            feedback:
              '<p>A resposta correta é <b>FAKE</b>. Reunindo informações de mais de 717.000 pessoas de 111 países, com acesso a determinado aplicativo que conta passos diários, uma pesquisa de Stanford aponta que o país cuja população é mais ativa fisicamente é a China, seguida respectivamente da Ucrânia, do Japão, da Rússia e da Espanha. As populações mais ociosas são as da Arábia Saudita, do Catar, das Filipinas e da Malásia. Entre os países ocidentais, o Brasil ocupa o topo da inatividade, seguido do México e dos EUA.  </p>\
												<p class="fonte">Fonte: GARATTONI, Bruno. Brasil é mais sedentário do que os EUA. Disponível em: &lt;https://super.abril.com.br/saude/brasil-e-mais-sedentario-do-que-os-eua/&gt;. Acesso em: 23 abr. 2019.</p>',
          },
          {
            answer: " <i>FAKE</i>",
            img: "",
            value: "true",
            /* true ou valor numerico*/
            feedback:
              '	<p><i>Fake</i>. Reunindo informações de mais de 717.000 pessoas de 111 países, com acesso a determinado aplicativo que conta passos diários, uma pesquisa de Stanford aponta que o país cuja população é mais ativa fisicamente é a China, seguida respectivamente da Ucrânia, do Japão, da Rússia e da Espanha. As populações mais ociosas são as da Arábia Saudita, do Catar, das Filipinas e da Malásia. Entre os países ocidentais, o Brasil ocupa o topo da inatividade, seguido do México e dos EUA.  </p>\
												<p class="fonte">Fonte: GARATTONI, Bruno. Brasil é mais sedentário do que os EUA. Disponível em: &lt;https://super.abril.com.br/saude/brasil-e-mais-sedentario-do-que-os-eua/&gt;. Acesso em: 23 abr. 2019.</p>',
          },
        ],
        generalFeedback: "",
      },
      {
        /* --------------------------- QUESTÃO 05  --------------------------- */
        className: "question-5",
        question:
          "Cem milhões de brasileiros não fazem nenhuma atividade física.",
        append: "",
        alternatives: [
          {
            answer: " FATO",
            img: "",
            value: "true",
            /* true ou valor numerico*/
            feedback:
              '	<p>Fato. De acordo com dados do IBGE de 2015, 100,5 milhões de brasileiros acima de 15 anos não praticam esporte ou atividade física, o que corresponde a 62,1% dessa população. Entre as pessoas que praticam exercícios físicos, o mais citado foi futebol, seguido de caminhadas e de outras atividades consideradas <i>fitness.</i></p>\
												<p class="fonte">Fonte: FERREIRA, Paula. Cem milhões de brasileiros não fazem nenhuma atividade física. Disponível em: &lt;https://oglobo.globo.com/sociedade/saude/cem-milhoes-de-brasileiros-nao-fazem-nenhuma-atividade-fisica-21348722&gt;. Acesso em: 23 abr. 2019.</p>',
          },
          {
            answer: " <i>FAKE</i>",
            img: "",
            value: "",
            /* true ou valor numerico*/
            feedback:
              '	<p>A resposta correta é <b>FATO</b>. De acordo com dados do IBGE de 2015, 100,5 milhões de brasileiros acima de 15 anos não praticam esporte ou atividade física, o que corresponde a 62,1% dessa população. Entre as pessoas que praticam exercícios físicos, o mais citado foi futebol, seguido de caminhadas e de outras atividades consideradas fitness.</p>\
												<p class="fonte">Fonte: FERREIRA, Paula. Cem milhões de brasileiros não fazem nenhuma atividade física. Disponível em: &lt;https://oglobo.globo.com/sociedade/saude/cem-milhoes-de-brasileiros-nao-fazem-nenhuma-atividade-fisica-21348722&gt;. Acesso em: 23 abr. 2019.</p>',
          },
        ],
        generalFeedback: "",
      },
      {
        /* --------------------------- QUESTÃO 06  --------------------------- */
        className: "question-6",
        question:
          "A Falta de exercícios físicos reduz expectativa de vida em até cinco anos.",
        append: "",
        alternatives: [
          {
            answer: " <i>FAKE</i>",
            img: "",
            value: "true",
            /* true ou valor numerico*/
            feedback:
              '	<p><i>Fake.</i> Pessoas que praticam atividades físicas reduzem em até 50% a chance de desenvolver doenças crônicas, como câncer, diabetes e problemas cardiovasculares. Já a falta de atividades físicas pode reduzir em até 10 anos a expectativa de vida. </p>\
												<p class="fonte">Fonte: FALTA de exercício físico reduz expectativa de vida em até 10 anos. Disponível em: &lt;https://www.terra.com.br/vida-e-estilo/saude/falta-de-exercicio-fisico-reduz-expectativa-de-vida-em-ate-10-anos,3cee7c2ceb549310VgnVCM4000009bcceb0aRCRD.html&gt;. Acesso em: 23 abr. 2019.</p>',
          },
          {
            answer: " FATO",
            img: "",
            value: "",
            /* true ou valor numerico*/
            feedback:
              '	<p>A resposta correta é <b>FAKE</b>. Pessoas que praticam atividades físicas reduzem em até 50% a chance de desenvolver doenças crônicas, como câncer, diabetes e problemas cardiovasculares. Já a falta de atividades físicas pode reduzir em até 10 anos a expectativa de vida.</p>\
												<p class="fonte">Fonte: FALTA de exercício físico reduz expectativa de vida em até 10 anos. Disponível em: &lt;https://www.terra.com.br/vida-e-estilo/saude/falta-de-exercicio-fisico-reduz-expectativa-de-vida-em-ate-10-anos,3cee7c2ceb549310VgnVCM4000009bcceb0aRCRD.html&gt;. Acesso em: 23 abr. 2019.</p>',
          },
        ],
        generalFeedback: "",
      },
      {
        /* --------------------------- QUESTÃO 07  --------------------------- */
        className: "question-7",
        question:
          "Um em cada três brasileiros não se exercita o suficiente, diz Organização Mundial da Saúde (OMS).",
        append: "",
        alternatives: [
          {
            answer: " FATO",
            img: "",
            value: "",
            /* true ou valor numerico*/
            feedback:
              '<p>A resposta correta é <b>FAKE</b>. De acordo com dados da OMS, um em cada dois brasileiros não se exercita o suficiente, e consequentemente estão no grupo que somam 1,4 bilhão de pessoas que correm risco de saúde por causa da ociosidade, fato que faz aumentar a propensão ao desenvolvimento de doenças cardiovasculares, por exemplo, bem como de diabetes do tipo 2, demência e alguns tipos de câncer.  </p>\
												<p class="fonte">Fonte: WENTZEL, Mariana. Um em cada dois brasileiros não se exercita o suficiente, diz OMS. Disponível em: &lt;https://www.bbc.com/portuguese/brasil-45415691&gt;. Acesso em: 23 abr. 2019.</p>',
          },
          {
            answer: " <i>FAKE</i>",
            img: "",
            value: "true",
            /* true ou valor numerico*/
            feedback:
              '	<p>Fake. De acordo com dados da OMS, um em cada dois brasileiros não se exercita o suficiente e, consequentemente, estão no grupo que somam 1,4 bilhão de pessoas que correm risco de saúde por causa da ociosidade, fato que faz aumentar a propensão ao desenvolvimento de doenças cardiovasculares, por exemplo, bem como de diabetes do tipo 2, demência e alguns tipos de câncer.  </p>\
												<p class="fonte">Fonte: WENTZEL, Mariana. Um em cada dois brasileiros não se exercita o suficiente, diz OMS. Disponível em: &lt;https://www.bbc.com/portuguese/brasil-45415691&gt;. Acesso em: 23 abr. 2019.</p>',
          },
        ],
        generalFeedback: "	",
      },
      {
        /* --------------------------- QUESTÃO 08  --------------------------- */
        className: "question-8",
        question:
          "Em 2010, Michelle Obama lançou nos EUA uma campanha chamada de “Vamos nos mover”, para combater a obesidade. Segundo ela, esse mal é uma das principais ameaças à saúde e à economia norte-americana.",
        append: "",
        alternatives: [
          {
            answer: " FATO",
            img: "",
            value: "true",
            /* true ou valor numerico*/
            feedback:
              '	<p>Fato. Sabendo que aproximadamente 32% das crianças e adolescentes norte-americanos sofrem com sobrepeso e obesidade, Michelle Obama lançou a campanha “Vamos nos mover”, contra a obesidade infantil nos EUA, com intuito de eliminar esse problema no país.</p>\
												<p class="fonte">Fonte: MICHELLE Obama lança campanha contra a obesidade infantil nos EUA. Disponível em: &lt;http://g1.globo.com/Noticias/Mundo/0,,MUL1483644-5602,00-MICHELLE+OBAMA+LANCA+CAMPANHA+CONTRA+A+OBESIDADE+INFANTIL+NOS+EUA.html&gt;. Acesso em: 23 abr. 2019.</p>',
          },
          {
            answer: " <i>FAKE</i>",
            img: "",
            value: "",
            /* true ou valor numerico*/
            feedback:
              '	<p>A resposta correta é <b>FATO</b>. Sabendo que aproximadamente 32% das crianças e adolescentes norte-americanos sofrem com sobrepeso e obesidade, Michelle Obama lançou a campanha “Vamos nos mover”, contra a obesidade infantil nos EUA, com intuito de eliminar esse problema no país.</p>\
												<p class="fonte">Fonte: MICHELLE Obama lança campanha contra a obesidade infantil nos EUA. Disponível em: &lt;http://g1.globo.com/Noticias/Mundo/0,,MUL1483644-5602,00-MICHELLE+OBAMA+LANCA+CAMPANHA+CONTRA+A+OBESIDADE+INFANTIL+NOS+EUA.html&gt;. Acesso em: 23 abr. 2019.</p>',
          },
        ],
        generalFeedback: "",
      },
      {
        /* --------------------------- QUESTÃO 09  --------------------------- */
        className: "question-9",
        question:
          "Estudo aponta que, em um ano, cerca de 2 mil mortes poderiam ter sido evitadas se os pacientes realizassem pelo menos uma caminhada de 30 minutos ao dia, cinco vezes por semana.",
        append: "",
        alternatives: [
          {
            answer: " FATO",
            img: "",
            value: "true",
            /* true ou valor numerico*/
            feedback:
              '	<p>Fato. De acordo com uma pesquisa colaborativa entre o Ministério da Saúde do Brasil e a revista <i>Nature</i>, no ano de 2015, o sedentarismo esteve ligado a 12% das mortes por câncer de mama no Brasil. Os dados apontam que cerca de 2 mil dessas mortes poderiam ter sido evitadas se as pacientes fizessem uma caminhada de aproximadamente 30 minutos por dia durante sua vida. </p>\
												<p class="fonte">Fonte: SEDENTARISMO está ligado a 12% das mortes por câncer de mama, diz estudo. Disponível em: &lt;https://exame.abril.com.br/ciencia/sedentarismo-esta-ligado-a-12-das-mortes-por-cancer-de-mama-diz-estudo/&gt;. Acesso em: 23 abr. 2019.</p>',
          },
          {
            answer: "<i> FAKE</i>",
            img: "",
            value: "",
            /* true ou valor numerico*/
            feedback:
              '	<p>A resposta correta é <b>FATO</b>. De acordo com uma pesquisa colaborativa entre o Ministério da Saúde do Brasil e a revista <i>Nature</i>, no ano de 2015, o Sedentarismo esteve ligado a 12% das mortes por câncer de mama no Brasil. Os dados apontam que cerca de 2 mil dessas mortes poderiam ter sido evitadas se as pacientes fizessem uma caminhada de aproximadamente 30 minutos por dia durante sua vida.</p>\
												<p class="fonte">Fonte: SEDENTARISMO está ligado a 12% das mortes por câncer de mama, diz estudo. Disponível em: &lt;https://exame.abril.com.br/ciencia/sedentarismo-esta-ligado-a-12-das-mortes-por-cancer-de-mama-diz-estudo/&gt;. Acesso em: 23 abr. 2019.</p>',
          },
        ],
        generalFeedback: "",
      },
      {
        /* --------------------------- QUESTÃO 10  --------------------------- */
        className: "question-10",
        question:
          "Obesidade leva a duas vezes mais mortes do que sedentarismo, diz estudo.",
        append: "",
        alternatives: [
          {
            answer: " FATO",
            img: "",
            value: "",
            /* true ou valor numerico*/
            feedback:
              '<p>A resposta correta é <b>FAKE</b>. Ao contrário disso, é o sedentarismo que leva a duas vezes mais mortes do que a obesidade. De acordo com dados de um estudo publicado pelo <i>American Journal of Clinical Nutrition</i>, fazer o equivalente a uma caminhada de 20 minutos todos os dias diminui entre 16% e 30% o risco de morte prematura.</p>\
												<p class="fonte">Fonte: SEDENTARISMO leva a duas vezes mais mortes do que obesidade, diz estudo. Disponível em: &lt;http://g1.globo.com/bemestar/noticia/2015/01/sedentarismo-leva-duas-vezes-mais-mortes-do-que-obesidade-diz-estudo.html&gt;. Acesso em: 23 abr. 2019.</p>',
          },
          {
            answer: " <i>FAKE</i>",
            img: "",
            value: "true",
            /* true ou valor numerico*/
            feedback:
              '		<p><i>Fake</i>. Ao contrário disso, é o sedentarismo que leva a duas vezes mais mortes do que a obesidade. De acordo com dados de um estudo publicado pelo <i>American Journal of Clinical Nutrition</i>, fazer o equivalente a uma caminhada de 20 minutos todos os dias diminui entre 16% e 30% o risco de morte prematura.</p>\
												<p class="fonte">Fonte: SEDENTARISMO leva a duas vezes mais mortes do que obesidade, diz estudo. Disponível em: &lt;http://g1.globo.com/bemestar/noticia/2015/01/sedentarismo-leva-duas-vezes-mais-mortes-do-que-obesidade-diz-estudo.html&gt;. Acesso em: 23 abr. 2019.</p>',
          },
        ],
        generalFeedback: "",
      },
    ],
  },
  {
    /* RESULTADO - ATUALIZAR O NOME DA IMAGEM DE FUNDO (bgImage) SE TIVER */
    section: "result",
    bgImage: "quiz/img/content.png",
  },
];
