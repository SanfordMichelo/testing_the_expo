// COUNTDOWN JAVASCRPT

const eventDate = new Date("July 15, 2026 09:00:00").getTime();

const countdown = setInterval(function () {
  const now = new Date().getTime();
  const distance = eventDate - now;

  // Time calculations
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor(
    (distance % (1000 * 60 * 60)) / (1000 * 60)
  );
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Display result
  document.getElementById("days").innerText = days;
  document.getElementById("hours").innerText = hours;
  document.getElementById("minutes").innerText = minutes;
  document.getElementById("seconds").innerText = seconds;

  // If event is over
  if (distance < 0) {
    clearInterval(countdown);

    document.getElementById("days").innerText = "00";
    document.getElementById("hours").innerText = "00";
    document.getElementById("minutes").innerText = "00";
    document.getElementById("seconds").innerText = "00";
  }
}, 1000);

const competitionSlides = document.querySelectorAll(".competition-slide");
const competitionPrev = document.querySelector(".competition-prev");
const competitionNext = document.querySelector(".competition-next");
const competitionDotsContainer = document.querySelector(".competition-dots");

let competitionCurrent = 0;
let competitionInterval;

// Create dots
competitionSlides.forEach((slide, index) => {

    const dot = document.createElement("span");
    dot.classList.add("competition-dot");

    if (index === 0) {
        dot.classList.add("competition-active");
    }

    dot.addEventListener("click", () => {
        competitionCurrent = index;
        showCompetitionSlide(competitionCurrent);
        resetCompetitionTimer();
    });

    competitionDotsContainer.appendChild(dot);
});

const competitionDots = document.querySelectorAll(".competition-dot");

function showCompetitionSlide(index) {

    // smoother DOM update (prevents flicker)
    requestAnimationFrame(() => {

        competitionSlides.forEach(slide =>
            slide.classList.remove("competition-active")
        );

        competitionDots.forEach(dot =>
            dot.classList.remove("competition-active")
        );

        competitionSlides[index].classList.add("competition-active");
        competitionDots[index].classList.add("competition-active");
    });
}

function nextCompetitionSlide() {

    competitionCurrent++;

    if (competitionCurrent >= competitionSlides.length) {
        competitionCurrent = 0;
    }

    showCompetitionSlide(competitionCurrent);
}

function previousCompetitionSlide() {

    competitionCurrent--;

    if (competitionCurrent < 0) {
        competitionCurrent = competitionSlides.length - 1;
    }

    showCompetitionSlide(competitionCurrent);
}

competitionNext.addEventListener("click", () => {
    nextCompetitionSlide();
    resetCompetitionTimer();
});

competitionPrev.addEventListener("click", () => {
    previousCompetitionSlide();
    resetCompetitionTimer();
});

function startCompetitionSlider() {

    // ⚡ 1 SLIDE PER SECOND
    competitionInterval = setInterval(nextCompetitionSlide, 1000);
}

function resetCompetitionTimer() {

    clearInterval(competitionInterval);
    startCompetitionSlider();
}

// start slider
startCompetitionSlider();