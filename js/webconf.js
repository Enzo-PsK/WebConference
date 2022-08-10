window.onload = () => {
  const registerBtn = document.getElementById("registerBtn");

  const url_base = "https://fcawebbook.herokuapp.com";

  renderSpeakers();

  registerBtn.addEventListener("click", () => {
    Swal.fire({
      title: "Subscribe on WebConference",
      html:
        '<input id="txtName" class="swal2-input" placeholder="Name">' +
        '<input id="txtEmail" class="swal2-input" placeholder="Email">',
      showCancelButton: true,
      confirmButtonText: "Subscribe",
      cancelButtonText: "Cancel",
      showLoaderOnConfirm: true,
      preConfirm: () => {
        const name = document.getElementById("txtName").value;
        const email = document.getElementById("txtEmail").value;

        return fetch(`${url_base}/conferences/1/participants/${email}`, {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          method: "POST",
          body: `participantname=${name}`,
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(response.statusText);
            }
            return response.json();
          })
          .catch((error) => {
            Swal.showValidationMessage(`Pedido falhou: ${error}`);
          })
          .then((result) => {
            if (result.value) {
              if (!result.value.err_code) {
                Swal.fire({
                  title: "Inscrição feita com sucesso!",
                });
              } else {
                Swal.fire({
                  title: `${result.value.err_message}`,
                });
              }
            }
          });
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
  });

  async function renderSpeakers() {
    console.log("Rendering speakers");
    const speakersDiv = document.getElementById("speakersDiv");
    let speakersTxt = "";
    const response = await fetch(`${url_base}/conferences/1/speakers`);
    const speakers = await response.json();
    //Data model from API
    // const speakers = [
    //   {
    //     idSpeaker:0
    //     bio: "xxxxxxxx"
    //     name: "Enzo Borges",
    //     job: "Developer",
    //     photo: " ",
    //     twitter: "https://www.twitter.com",
    //     facebook: "https://www.facebook.com",
    //     linkedin: "https://www.linkedin.com",
    //   },
    // ];

    for (const speaker of speakers) {
      speakersTxt += `
      <div class="col-sm-4">
        <div class="team-member">
          <img class="mx-auto rounded-circle viewSpeaker" src="${speaker.photo}" alt="" id="${speaker.idSpeaker}">
          <h4 class="text-center">${speaker.name}</h4>
          <p class="text-muted text-center">${speaker.job}</p>
          <ul class="list-inline social-buttons text-center">`;

      if (speaker.twitter !== null) {
        speakersTxt += `
            <li class="list-inline-item">
            <a href="${speaker.twitter}" target="_blank"> <i class="fab fa-twitter"></i> </a>
            </li>`;
      }
      if (speaker.facebook !== null) {
        speakersTxt += `
            <li class="list-inline-item">
            <a href="${speaker.facebook}" target="_blank"> <i class="fab fa-facebook-f"></i> </a>
            </li>`;
      }
      if (speaker.linkedin !== null) {
        speakersTxt += `
            <li class="list-inline-item">
            <a href="${speaker.linkedin}" target="_blank"> <i class="fab fa-linkedin-in"></i> </a>
            </li>`;
      }
      speakersTxt += `
          </ul>
        </div>
      </div>`;

      const btnView = document.getElementsByClassName("viewSpeaker");
      for (let i = 0; i < btnView.length; i++) {
        btnView[i].addEventListener("click", () => {
          for (const speaker of speakers) {
            if (speaker.idSpeaker == btnView[i].getAttribute("id")) {
              //Modal Window
              Swal.fire({
                title: speaker.name,
                text: speaker.bio,
                imageUrl: speaker.photo,
                imageWidth: 400,
                imageHeight: 400,
                imageAlt: "Speaker photo",
                animation: false,
              });
            }
          }
        });
      }
    }
    speakersDiv.innerHTML = speakersTxt;
  }

  async function renderSponsors() {
    const sponsorsDiv = document.getElementById("sponsorsDiv");
    let sponsorsTxt = "";
    const response = await fetch(`${url_base}/conferences/1/sponsors`);
    const sponsors = await response.json();

    for (const sponsor of sponsors) {
      sponsorsTxt = `
      <div class="col-md-3 col-sm-6">
        <a href="${sponsor.link}" target="_blank">
          <img class="img-fluid d-block mx-auto" src="${sponsor.logo}" alt="${sponsor.name}">
        </a>
      </div>
      `;
    }
    sponsorsDiv.innerHTML = sponsorsTxt;
  }
};
