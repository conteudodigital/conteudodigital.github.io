var imgs = [
    "./assets/CQT_AT_2022_AI_02_V3_LDIDA_GEO_LA_OED_F003.jpg",
    "./assets/CQT_AT_2022_AI_02_V3_LDIDA_GEO_LA_OED_F004.jpg",
    "./assets/CQT_AT_2022_AI_02_V3_LDIDA_GEO_LA_OED_F005.jpg",
    "./assets/CQT_AT_2022_AI_02_V3_LDIDA_GEO_LA_OED_F006.jpg",
  ],
  n = imgs.length,
  current = n - 1,
  closedWidth = Math.floor(window.innerWidth / 10);

for (var i = 0; i < n; i++) {
  var bgImg = document.createElement("div");
  bg.appendChild(bgImg);

  gsap.set(bgImg, {
    attr: { id: "bgImg" + i, class: "bgImg" },
    width: "100%",
    height: "100%",
    backgroundImage: "url(" + imgs[i] + ")",
    backgroundSize: "cover",
    backgroundPosition: "center",
  });

  var b = document.createElement("div");
  fg.appendChild(b);

  gsap.fromTo(
    b,
    {
      attr: { id: "b" + i, class: "box" },
      innerHTML: "<p><sub>Fig.</sub> " + (i + 1) + "</p>",
      width: "100%",
      height: "100%",
      borderLeft: i > 0 ? "solid 5px rgba(255, 255, 255, 0.8)" : "", // Ajuste na espessura e cor da borda
      backgroundColor: "rgba(250,250,250,0)",
      left: i * closedWidth,
      transformOrigin: "100% 100%",
      x: "100%",
    },
    {
      duration: i * 0.15,
      x: 0,
      ease: "expo.inOut",
    }
  );

  b.onmouseover = b.onclick = (e) => {
    if (Number(e.currentTarget.id.substr(1)) == current) return;

    var staggerOrder = !!(current < Number(e.currentTarget.id.substr(1)));
    current = Number(e.currentTarget.id.substr(1));
    gsap.to(".box", {
      duration: 0.5,
      ease: "elastic.out(0.3)",
      left: (i) =>
        i <= current
          ? i * closedWidth
          : window.innerWidth - (n - i) * closedWidth,
      x: 0,
      stagger: staggerOrder ? 0.05 : -0.05,
    });

    bg.appendChild(document.getElementById("bgImg" + current));
    gsap.fromTo(
      "#bgImg" + current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: "power1.inOut" }
    );
    gsap.fromTo(
      "#bgImg" + current,
      { scale: 1.05, rotation: 0.05 },
      { scale: 1, rotation: 0, duration: 1.5, ease: "sine" }
    );
  };
}

window.onresize = (e) => {
  closedWidth = Math.floor(window.innerWidth / 10);
  gsap.set(".box", {
    x: 0,
    left: (i) =>
      i <= current
        ? i * closedWidth
        : window.innerWidth - (n - i) * closedWidth,
  });
};

// script.js
$(".figure")
  .on("mouseenter", function () {
    const id = $(this).attr("id"); // Supondo que cada figura tenha um id correspondente
    $(`#${id}::after`).css("content", `ATUAL: ${getCityInfo(id)}`); // Função fictícia para pegar o texto correto
    $(this).addClass("selected");
  })
  .on("mouseleave", function () {
    const id = $(this).attr("id");
    $(`#${id}::after`).css("content", ""); // Limpa o conteúdo quando o mouse sai
    $(this).removeClass("selected");
  });

function getCityInfo(id) {
  const cityInfo = {
    b0: "Cidade do Rio de Janeiro em 1889",
    b1: "Cidade do Rio de Janeiro atualmente",
    b2: "Cuiabá em 1941",
    b3: "Cuiabá atualmente",
  };
  return cityInfo[id] || ""; // Retorna a informação da cidade correspondente ao id
}
