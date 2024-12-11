import "./style.css";

const GITHUB_API_URL = "https://api.github.com/repos/marmelab/react-admin";

const getGithubStats = () => {
  const headers = new Headers();
  headers.append("Content-Type", "application/x-www-form-urlencoded");

  const request = new Request(GITHUB_API_URL, {
    headers,
  });

  return fetch(request).then((response) => response.json());
};

const githubStarsContent = document.getElementById("github-stars-content");
if (githubStarsContent === null) {
  throw new Error("github-stars-content element not found");
}

const githubStarsContentMobile = document.getElementById(
  "github-stars-content-mobile"
);
if (githubStarsContentMobile === null) {
  throw new Error("github-stars-content-mobile element not found");
}

getGithubStats().then(({ stargazers_count }) => {
  githubStarsContent.innerText = stargazers_count;
  githubStarsContentMobile.innerText = stargazers_count;
});

window.addEventListener(
  "scroll",
  () => {
    const scroll =
      window.pageYOffset / (document.body.offsetHeight - window.innerHeight);
    document.body.style.setProperty("--scroll", `${scroll}`);
  },
  false
);

const navButton = document.querySelector<HTMLButtonElement>("nav button");
if (navButton === null) {
  throw new Error("navButton not found");
}

const mobileMenu = document.querySelector<HTMLDivElement>("#mobile-menu");
if (mobileMenu === null) {
  throw new Error("mobileMenu not found");
}

let opened = false;

navButton.addEventListener("click", () => {
  const [closeIcon, openIcon] = Array.from(
    navButton.querySelectorAll<SVGElement>("svg")
  );

  if (opened) {
    closeIcon.classList.remove("hidden");
    openIcon.classList.add("hidden");
    mobileMenu.classList.add("hidden");
  } else {
    openIcon.classList.remove("hidden");
    closeIcon.classList.add("hidden");
    mobileMenu.classList.remove("hidden");
  }
  opened = !opened;
});

const buildingBlocksULs = [
  document.querySelector<HTMLUListElement>("#building-blocks > ul"),
];
if (buildingBlocksULs[0] === null) {
  throw new Error("buildingBlocksULs is empty");
}

for (let i = 0; i < 5; i++) {
  buildingBlocksULs.push(
    buildingBlocksULs[0].cloneNode(true) as (typeof buildingBlocksULs)[0]
  );

  for (let j = 0; j < buildingBlocksULs[i]!.childElementCount; j++) {
    const randomIndex = Math.floor(
      Math.random() * buildingBlocksULs[i]!.childElementCount
    );
    const randomChild = buildingBlocksULs[i]!.children[randomIndex];
    buildingBlocksULs[i]!.removeChild(randomChild);
    buildingBlocksULs[i]!.appendChild(randomChild);
  }

  if (i > 2) {
    buildingBlocksULs[i]!.classList.add("md:hidden");
  }

  buildingBlocksULs[0].parentElement!.appendChild(buildingBlocksULs[i]!);
}

for (let i = 0; i < buildingBlocksULs.length; i++) {
  buildingBlocksULs[i]!.classList.add(
    i % 2 === 0 ? "justify-start" : "justify-end"
  );

  buildingBlocksULs[i]!.style.animation =
    "slide" + (i % 2 === 0 ? "Left" : "Right") + " 90s linear infinite";
}

function hideBanner() {
  const banner = document.getElementById("banner");
  if (banner) {
    banner.style.display = "none";
  }
}
const closeBanner = document.getElementById("closeBanner");
if (closeBanner) {
  closeBanner.addEventListener("click", (e) => {
    e.preventDefault();
    hideBanner();
  });
}

const emojis = ["🎄", "🎅", "🎁", "🎉", "🦌", "🤶", "🌟", "🔔", "🧦"];
const emojiContainer = document.getElementById("randomEmoji");
if (emojiContainer !== null) {
  emojiContainer.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
}
