// =========================================
//      Configuracoes globais do jogo
// =========================================

var gameConfig = {

    // nome do jogo (ex "Seja um botânico")
    'nome' : 'Verb be in the singular',

    // Define se o jogo esta pronto para ser enviado para producao
    'producao' : false,

    // Se "false" sera adicionado um hash ao final de cada arquivo (default "true" para fazer cache dos arquivos)
    'cache' : false,

    // Deve ser tratado dentro de cada engine, por ex "if (gameConfig.debug) { ... }"
    'debug' : false,

    // Define os pontos iniciais dos jogos

    // Gameficacao
    'msgCarregando' : 'Aguarde, carregando...',
    'msgNaoConseguiu' : 'Tente novamente.',
    'larguraJanelaGameficacao' : 400,
    'alturaJanelaGameficacao': 400,
    'bloquearJanelaGameficacao' : true,

    // ID que sera usado para identificar jogo na gamificacao
    'idAtividade' : 174,

    // URLs para gamificacao
    'urlUsuarioSessao' : 'http://www.educacional.com.br/Recursos/conteudoEF1/usuario_sessao.asp',
    'urlSalvarAtividade' : 'http://www.educacional.com.br/CpService/CpService.asmx/SalvaAtividade',
    'urlRetornaAtividade' : 'http://www.educacional.com.br/CpService/CpService.asmx/ReturnAtividade',

}