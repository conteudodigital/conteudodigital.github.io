function objParametros() {
    var idAtividade = 0;
    var idUsuario = 0;
    var idTurma = 0;
    var bolEncerrado = 0;
    var bolSincroniza = 0;
    var bolOcultadoGeral = 0;
    var dados = '';
    var dadosTmp = '';
}

//Classe atividade para funcoes do webservice
function Atividade() {
    var parametros = new objParametros();
    var servico = new WebService();
    var urlSave;
    var urlRetrieve;
    var urlUser;

    var isAprendeBrasil = (window.location.href.indexOf('aprendebrasil') > -1);

    if (gameConfig.producao) {
        if (isAprendeBrasil) {
            urlSave = (gameConfig.urlSalvarAtividade) ? gameConfig.urlSalvarAtividade.replace('educacional', 'aprendebrasil') : '';
            urlRetrieve = (gameConfig.urlRetornaAtividade) ? gameConfig.urlRetornaAtividade.replace('educacional', 'aprendebrasil') : '';
            urlUser = (gameConfig.urlUsuarioSessao) ? gameConfig.urlUsuarioSessao.replace('educacional', 'aprendebrasil') : '';
        }
		else {
            urlSave = (gameConfig.urlSalvarAtividade) ? gameConfig.urlSalvarAtividade : '';
            urlRetrieve = (gameConfig.urlRetornaAtividade) ? gameConfig.urlRetornaAtividade : '';
            urlUser = (gameConfig.urlUsuarioSessao) ? gameConfig.urlUsuarioSessao : '';
        }
    }

    this.retSalvaAtividade = function() {
    }

    this.FailureCallBack = function(x, t, m) {
        var message = 'Erro na comunicação com servidor, verifique sua conexão com a Internet e tente novamente.';
        if (t === 'timeout') {
            message = 'Tempo esgotado ao tentar carregar dados do jogo, verifique sua conexão com a Internet e tente novamente.';
        }
        $('div.loading').html('<p class="erro">' + message + '<br/><br/><a href="javascript:void(0)" onclick="location.reload()">Tentar novamente</a></p>');
    }

    // Salva uma atividade para o usuario em questao
    this.salvaAtividade = function(atividade, usuario, bolOculta, bolSincroniza, dados) {
		parametros.idAtividade = atividade;
		parametros.idUsuario = usuario;
		parametros.bolOcultadoGeral = bolOculta;
		parametros.bolSincroniza = bolSincroniza;
		parametros.dados = dados;
		parametros.idTurma = 0;
		servico.requestService(urlSave, parametros, this.retSalvaAtividade, this.FailureCallBack);
    }

    // Retorna a atividade solicitada
    this.retornaAtividade = function(atividade, usuario, callback) {
		parametros.idAtividade = atividade;
		parametros.idUsuario = usuario;
		servico.requestService(urlRetrieve, parametros, callback, this.FailureCallBack);
    }

    this.retornaUsuario = function(callback) {
		parametros = {};
		servico.requestService(urlUser, parametros, callback, this.FailureCallBack);
    }

    //Coloca como encerrado a atividade para a turma
}

// Objeto WebService para consumir os metodos da atividade
function WebService() {
    this.requestService = function (url, parametros, retornoSucess, retornoError) {
        ajaxService(url, parametros, retornoSucess, retornoError);
    }

    function ajaxService(url, parametros, retornoSucess, retornoError) {
        $.ajax({
            url: url,
            type: 'POST',
            data: JSON.stringify(parametros),
            timeout: 10000,
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            success: eval(retornoSucess),
            error: eval(retornoError)
        });
    }
}