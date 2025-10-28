import "./style.css";
import "./newsletter.css";

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

  // Use Fisher-Yates shuffle algorithm for better randomness
  const children = Array.from(buildingBlocksULs[i]!.children);
  for (let j = children.length - 1; j > 0; j--) {
    const randomIndex = Math.floor(Math.random() * (j + 1));
    // Swap elements
    [children[j], children[randomIndex]] = [children[randomIndex], children[j]];
  }

  // Replace children with shuffled array
  buildingBlocksULs[i]!.innerHTML = "";
  children.forEach((child) => buildingBlocksULs[i]!.appendChild(child));

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
  window.localStorage.setItem("hideBannerDate", Date.now().toString());
}
// Extend Window interface to include hideBanner
declare global {
  interface Window {
    hideBanner: typeof hideBanner;
  }
}
window.hideBanner = hideBanner;
const hideBannerDate = parseInt(
  window.localStorage.getItem("hideBannerDate") || "0",
  10
);
if (!hideBannerDate || Date.now() - hideBannerDate > 14 * 24 * 60 * 60 * 1000) {
  const emojis = ["🎄", "🎅", "🎁", "🎉", "🦌", "🤶", "🌟", "🔔", "🧦"];
  const randomEmoji = document.getElementById("randomEmoji");
  if (randomEmoji) {
    randomEmoji.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
  }
  const banner = document.getElementById("banner");
  if (banner) {
    banner.style.display = "flex";
  }
}
