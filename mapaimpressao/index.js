const pageNumberInput = document.getElementById('pageNumber');
const pagesContainer = document.getElementById('pagesContainer');
const nCadernos = document.getElementById('nCadernos');
const exportBtn = document.getElementById('exportBtn');
const caixaCaderno = document.querySelector('.caixaCaderno');
const popModal = document.querySelector('.popModal');
const checkmark = document.querySelector('.checkmark');
var loadScreen = document.querySelector('.loaderSc');
var editText = document.getElementById('editText');
var corselected = "#000000";
var divSelected;
var idSelected = 0;
var body = document.body,
    html = document.documentElement;

var height = Math.max(body.scrollHeight, body.offsetHeight,
    html.clientHeight, html.scrollHeight, html.offsetHeight);
var width = Math.max(body.scrollWidth, body.offsetWidth,
    html.clientWidth, html.scrollWidth, html.offsetWidth);

console.log(loadScreen);

//const doc = new jsPDF();
var levelZoom = 150;
var nPag = 4;


var visualizacao = "caderno";//caderno ou pagina
if (document.getElementById('inputVisualizacao').checked) {
    visualizacao = "pagina";
} else {
    visualizacao = "caderno";
}

const itens = [
    {
        nome: "Folha de rosto",
        sigla: "FR",
        pagina: 1,
        cor: "#e5e5e5"
    },
    {
        nome: "Ficha catalográfica",
        sigla: "FC",
        pagina: 2,
        cor: "#e5e5e5"
    }
]

for (let i = 0; i < 1000; i++) {
    const element = { nome: "", sigla: "", pagina: i + 3, cor: "#ffffff" };
    itens.push(element);
}
console.log(itens)



pageNumberInput.addEventListener('input', () => {
    if (pageNumberInput.value < 1000) {
        criaPaginas();
    } else {
        alert("numero maximo de paginas deve ser 1000");

    }

});
function mudaModoVisualizacao(evt) {
    console.log(evt.target.checked);
    if (evt.target.checked) {
        visualizacao = "pagina";
    } else {
        visualizacao = "caderno";
    }
    criaPaginas();
}
function mudaModoQuantCaderno(evt) {
    console.log(evt.target.value);
    nPag = evt.target.value
    criaPaginas();
}

function criaPaginas() {
    const numPages = pageNumberInput.value;
    pagesContainer.innerHTML = '';

    const totalPages = Math.ceil(numPages / nPag);

    for (let i = 1; i <= totalPages; i++) {
        let pageGroup = document.createElement('div');
        pageGroup.classList.add('caderno');

        for (let j = 1; j <= nPag; j++) {
            const pageIndex = (i - 1) * nPag + j;

            if (numPages < pageIndex) {
                console.log("pagina vermelha");
                pageGroup.classList.add('cadVermelho');
            } else {
                pageGroup.classList.add('cadBranco');
            }
            if (pageIndex <= numPages) {
                let pageDiv = document.createElement('div');
                pageDiv.classList.add('pagina');
                pageDiv.style.backgroundColor = itens[pageIndex - 1].cor;
                pageDiv.setAttribute('data-id', pageIndex);

                let molinhazz = document.createElement('div');
                pageDiv.appendChild(molinhazz);
                molinhazz.classList.add('pagina-after');

                let span = document.createElement('span');
                span.classList.add('page-text');
                span.style.pointerEvents = 'none';
                span.innerHTML = itens[pageIndex - 1].nome;
                pageDiv.appendChild(span);


                let spanPag = document.createElement('span');
                spanPag.classList.add('page-number');
                spanPag.style.pointerEvents = 'none';
                spanPag.innerHTML = itens[pageIndex - 1].pagina;
                pageDiv.appendChild(spanPag);

                verificaCor(itens[pageIndex - 1].cor,span,spanPag);


                let molinhazz2 = document.createElement('div');
                pageDiv.appendChild(molinhazz2);
                molinhazz2.classList.add('pagina-before');

                if (nPag == 8) {
                    pageDiv.style.height = '32px';
                }
                if (nPag == 16) {
                    pageDiv.style.height = '12px';
                }
                if (visualizacao == "caderno") {
                    pageGroup.appendChild(pageDiv);
                } else {
                    pagesContainer.appendChild(pageDiv);
                }

                pageDiv.addEventListener('click', (evt) => {
                    console.log(evt.target.style.backgroundColor);
                    divSelected = evt.target;
                    let obcor = document.querySelector("#base-color");
                    let txt = divSelected.querySelector(".page-text");
                    editText.value=txt.innerHTML;


                    function rgbToHex(rgb) {
                        let sep = rgb.indexOf(",") > -1 ? "," : " ";
                        rgb = rgb.substr(4).split(")")[0].split(sep);

                        let r = (+rgb[0]).toString(16),
                            g = (+rgb[1]).toString(16),
                            b = (+rgb[2]).toString(16);

                        if (r.length == 1)
                            r = "0" + r;
                        if (g.length == 1)
                            g = "0" + g;
                        if (b.length == 1)
                            b = "0" + b;

                        return "#" + r + g + b;
                    }

                    obcor.value = rgbToHex(divSelected.style.backgroundColor);


                    popModal.classList.remove("hidden");
                    if (evt.pageY > height - 500) {
                        popModal.style.top = height - 500 + "px";
                    } else {
                        popModal.style.top = evt.pageY + "px";
                    }

                    if (evt.pageX > width - 500) {
                        popModal.style.left = width - 700 + "px";
                    } else {
                        popModal.style.left = evt.pageX + "px";
                    }


                });
            }
        }
        if (visualizacao == "caderno") {
            pagesContainer.appendChild(pageGroup);
        }

    }
    let nCad = numPages / nPag
    //nCadernos.innerHTML = nCad;
    anime({
        targets: nCadernos,
        innerHTML: [nCadernos.innerHTML, nCad],
        easing: 'easeOutQuad',
        duration: 500,
        round: 10 // Will round the animated value to 1 decimal
    });

    if (isInt(nCad)) {

        caixaCaderno.classList.remove("caixaDanger")
        checkmark.classList.remove("hidden");
    } else {
        caixaCaderno.classList.add("caixaDanger");
        checkmark.classList.add("hidden");
        anime({
            targets: caixaCaderno,
            scale: [1.25, 1]
        });
    }

    zoomTotal();

    height = Math.max(body.scrollHeight, body.offsetHeight,
        html.clientHeight, html.scrollHeight, html.offsetHeight);
    width = Math.max(body.scrollWidth, body.offsetWidth,
        html.clientWidth, html.scrollWidth, html.offsetWidth);

    console.log(height, width);
}
exportBtn.addEventListener('click', () => {
    html2canvas(pagesContainer, {
        onrendered: function (canvas) {
            const imgData = canvas.toDataURL('image/png');
            const img = new Image();
            img.src = imgData;
            console.log("reder ok")

            const link = document.createElement('a');
            link.href = imgData;
            link.download = 'paginas.png';
            link.click();
            //const pdf = new jsPDF();
            //pdf.addImage(img, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
            //pdf.save('paginas.png');
        }
    });
});
function updateBaseColor(color) {
    let dataId = divSelected.getAttribute('data-id');
    let obcor = document.querySelector("#base-color");
    let txt = divSelected.querySelector(".page-text");
    let txtN = divSelected.querySelector(".page-number");
    document.getElementById('base-color').value = color;

    itens[dataId - 1].nome = editText.value;
    itens[dataId - 1].cor = obcor.value;

    txt.innerHTML = editText.value;
    divSelected.style.backgroundColor = obcor.value;

    verificaCor(obcor.value,txt,txtN);
    
}
function verificaCor(color,txt,txtN){
    const rgb = parseInt(color.substring(1), 16);   // convert hex to decimal
    const r = (rgb >> 16) & 0xff;  // extract red
    const g = (rgb >>  8) & 0xff;  // extract green
    const b = (rgb >>  0) & 0xff;  // extract blue

    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709

    console.log("luma",luma)

    if (luma < 150) {
        txt.style.color = 'white'; // bright text for dark backgrounds
        txtN.style.color = 'white';
    } else {
        txt.style.color = 'black'; // dark text for bright backgrounds
        txtN.style.color = 'black';
    }
}
function fechaModal() {
    popModal.classList.add("hidden");
    let dataId = divSelected.getAttribute('data-id');
    let obcor = document.querySelector("#base-color");
    let txt = divSelected.querySelector(".page-text");
    let txtN = divSelected.querySelector(".page-number");

    itens[dataId - 1].nome = editText.value;
    itens[dataId - 1].cor = obcor.value;

    
    txt.innerHTML = editText.value;
    divSelected.style.backgroundColor = obcor.value;

    verificaCor(obcor.value,txt,txtN);
}
function mudaCor(evt) {
    let dataId = divSelected.getAttribute('data-id');
    let obcor = document.querySelector("#base-color");
    obcor.value = evt.value;
    corselected = evt.value;
    divSelected.style.backgroundColor = evt.value;
    popModal.classList.add("hidden");
    itens[dataId - 1].nome = editText.value;
    itens[dataId - 1].cor = corselected;
    let txt = divSelected.querySelector(".page-text");
    txt.innerHTML = editText.value;
    verificaCor();
}
function zoomin(evt) {
    if (levelZoom < 300) {
        levelZoom += 25;
    }
    loadScreen.style.display = "flex";
    evt.target.style.pointerEvents = "none";
    evt.target.style.opacity = "0.25";
    setTimeout(() => {
        zoomTotal();
    }, 200);
    setTimeout((evt) => {
        evt.target.style.pointerEvents = "auto";
        evt.target.style.opacity = "1";
        loadScreen.style.display = "none";
    }, 300, evt);


}
function zoomout(evt) {
    if (levelZoom > 100) {
        levelZoom -= 25;
    }
    loadScreen.style.display = "flex";
    evt.target.style.pointerEvents = "none";
    evt.target.style.opacity = "0.25";
    setTimeout(() => {
        zoomTotal();
    }, 200);
    setTimeout((evt) => {
        evt.target.style.pointerEvents = "auto";
        evt.target.style.opacity = "1";
        loadScreen.style.display = "none";
    }, 300, evt);
}
function zoomTotal() {
    var elements = document.querySelectorAll('.caderno');
    var elementsPag = document.querySelectorAll('.pagina');
    if (visualizacao == "caderno") {
        if(nPag == 16){
            pagesContainer.setAttribute('style', 'display:grid;grid-template-columns: repeat(auto-fill, minmax(' + (levelZoom+150) + 'px,1fr))');
        } else {
            pagesContainer.setAttribute('style', 'display:grid;grid-template-columns: repeat(auto-fill, minmax(' + levelZoom + 'px,1fr))');
        }
    } else {
        pagesContainer.setAttribute('style', 'display:flex;flex-wrap:wrap;grid-gap:0px');
    }

    for (var i = 0; i < elements.length; i++) {
        if (visualizacao == "caderno") {
            if (nPag == 8) {
                elements[i].setAttribute('style', 'display:flex;height:' + (levelZoom + 100) + 'px;');
            } else if(nPag == 16){
                elements[i].setAttribute('style', 'display:flex;height:' + (levelZoom + 100) + 'px;');
            } else {
                elements[i].setAttribute('style', 'display:flex;height:' + levelZoom + 'px;');
            }
        } else {
            elements[i].setAttribute('style', 'height:' + levelZoom * 1.5 + 'px;width:' + levelZoom + 'px;');
        }
    }

    for (var i = 0; i < elementsPag.length; i++) {
        let pagafter = elementsPag[i].querySelector('.pagina-after');
        let pagbefore = elementsPag[i].querySelector('.pagina-before');
        pagbefore.style.display = 'none';
        if (visualizacao == "caderno") {
            pagafter.style.display = 'none';
            if (nPag == 8) {
                elementsPag[i].setAttribute('style', 'width:calc(50% - 10px);height:22%');
            } else if(nPag == 16){
                elementsPag[i].setAttribute('style', 'width:calc(50% - 70px);height:15%');
            } else {
                elementsPag[i].setAttribute('style', 'width:calc(50% - 10px);height:45%');
            }
        } else {

            elementsPag[i].setAttribute('style', 'width:' + levelZoom / 1.5 + 'px;height:' + levelZoom + 'px;margin-top:20px;background-color:' + elementsPag[i].style.backgroundColor);
            var estilomola = document.createElement("style");
            if ((i + 1) % 2 === 0) {
                elementsPag[i].style.marginLeft = "10px";
                pagafter.style.display = 'block';
                //elementsPag[i].classList.add("pagina-after");
                //estilomola.innerHTML = ".pagina::after {content: '';position: absolute;right: 0;width: 10px; height: 100%;background-image: repeating-linear-gradient(0deg, transparent, transparent 9px, #ccc 9px, #ccc 10px);clip-path: polygon(100% 0, 0 0, 0 100%, 100% 100%);} ";   
            } else {
                pagafter.style.display = 'none';
                elementsPag[i].style.marginLeft = "0px";
                if (i > 1) {
                    pagbefore.style.display = 'block';
                }
                // estilomola.innerHTML = ".pagina::after {content: '';position: absolute;right: 0;width: 10px; height: 100%;background-image: repeating-linear-gradient(0deg, transparent, transparent 9px, #ccc 9px, #ccc 10px);clip-path: polygon(0 0, 0 0, 0 0, 0 0);} "; 
            }

            elementsPag[i].appendChild(estilomola);
        }

    }

}
function procuraPagina(_pag) {
    let retorna = _pag;
    itens.forEach(element => {
        if (element.pagina == _pag) {
            if (levelZoom > 150) {
                retorna = element.nome;
            } else {
                retorna = element.sigla;
            }

        }
    });
    return retorna;
}
function isInt(value) {
    return !isNaN(value) &&
        parseInt(Number(value)) == value &&
        !isNaN(parseInt(value, 10));
}

criaPaginas();


