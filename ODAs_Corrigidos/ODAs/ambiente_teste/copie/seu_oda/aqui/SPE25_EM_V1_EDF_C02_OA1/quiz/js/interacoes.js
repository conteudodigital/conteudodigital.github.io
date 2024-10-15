var interacoes = {
	/* ================== SLIDESHOW  ================== */

	carrossel: {
		nome: {
			autoplay: "",
			imagens: [
				{
					imagem: "",
					credito: "",
					legenda: ""
				},
				{
					imagem: "",
					credito: "",
					legenda: ""
				},
				{
					imagem: "",
					credito: "",
					legenda: ""
				}
			]
		}
	},
	slideshow: {
		nome: {
			animation: "fade",
			autoplay: "true",
			imagens: [
				{
					imagem:
						"https://images.unsplash.com/photo-1535627487506-52f3fdd444aa?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=b1e7203cd2e2c8ff857f457c170dbdb5&auto=format&fit=crop&w=1490&q=80",
					credito: "Photo by Carles Rabada",
					legenda: "2050, future is here"
				},
				{
					imagem:
						"https://images.unsplash.com/photo-1535546204504-586398ee6677?ixlib=rb-0.3.5&s=1d955b3e8599ca353dcf0d4c9390dea8&auto=format&fit=crop&w=925&q=80",
					credito: "Photo by Debby Hudson",
					legenda: "Home office"
				},
				{
					imagem:
						"https://images.unsplash.com/photo-1535543017286-db5952b6ade2?ixlib=rb-0.3.5&s=9eb4cdc11eb5edd7cef7538a83af9ea0&auto=format&fit=crop&w=634&q=80",
					credito: "Photo by emily lau",
					legenda: "ghost in the shell"
				}
			]
		}
	},
	vitrine: {
		nome: {
			autoplay: "",
			imagens: [
				{
					imagem: "",
					credito: "",
					legenda: ""
				},
				{
					imagem: "",
					credito: "",
					legenda: ""
				},
				{
					imagem: "",
					credito: "",
					legenda: ""
				}
			]
		}
	},
	mosaico: {
		nome: {
			autoplay: "",
			imagens: [
				{
					imagem: "",
					credito: "",
					legenda: ""
				},
				{
					imagem: "",
					credito: "",
					legenda: ""
				},
				{
					imagem: "",
					credito: "",
					legenda: ""
				}
			]
		}
	},
	comparacao: {
		nome: {
			autoplay: "",
			imagens: [
				{
					imagem: "",
					credito: "",
					legenda: ""
				},
				{
					imagem: "",
					credito: "",
					legenda: ""
				},
				{
					imagem: "",
					credito: "",
					legenda: ""
				}
			]
		}
	},
	create: function(tipo, nome) {
		var tipoInteracao = tipo,
			nomeInteracao = nome,
			aux = "";

		switch (tipoInteracao) {
			case "carrossel":
				console.log("CARROSSEL COM n IMAGENS");
				break;
			case "slideshow":
				for (var i = 0; i < interacoes[tipoInteracao][nomeInteracao].imagens.length; i++ ) {
					aux += '<div class="carousel-item has-background is-active image">\
								<img class="is-background" src="' +	interacoes[tipoInteracao][nomeInteracao].imagens[i].imagem + '"/>\
								<p class="legenda">' + interacoes[tipoInteracao][nomeInteracao].imagens[i].legenda + '</p>\
								<p class="credito">' + interacoes[tipoInteracao][nomeInteracao].imagens[i].credito + '</p>\
							 </div>';
				}
				return '<div class="carousel carousel-animated carousel-animate-'+interacoes[tipoInteracao][nomeInteracao].animation+'" data-autoplay="'+interacoes[tipoInteracao][nomeInteracao].autoplay+'">\
						  <div id="slideshow" class="carousel-container">\
							'+aux+'\
						  </div>\
						  <div class="carousel-navigation is-overlay">\
							 <div class="carousel-nav-left">\
								<i class="fa fa-chevron-left" aria-hidden="true"></i>\
							 </div>\
							 <div class="carousel-nav-right">\
								<i class="fa fa-chevron-right" aria-hidden="true"></i>\
							 </div>\
						  </div>\
						</div>';
				break;
			case "vitrine":
				console.log("VITRINE COM n IMAGENS");
				break;
			case "mosaico":
				console.log("MOSAICO COM n IMAGENS");
				break;
			case "comparacao":
				console.log("COMPARAÇÃO COM DUAS IMAGENS");
				break;
			default:
				alert("Opção Inválida");
				return;
		}
	}
};
