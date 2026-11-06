document.addEventListener("DOMContentLoaded", function () {
  const viewer = document.querySelector(".artwork-viewer");
  const viewerImage = viewer && viewer.querySelector(".artwork-viewer-image");
  const closeButton = viewer && viewer.querySelector(".artwork-viewer-close");
  const artworkTiles = document.querySelectorAll(
    ".artwork-card, .screen1 .card-image, .screen1 .Dcard-image, .screen1 .DDcard-image, .screen1 .cn"
  );

  if (!viewer || !viewerImage || !closeButton || typeof viewer.showModal !== "function") {
    console.error("The Gallery artwork viewer could not be initialized.");
    return;
  }

  function openArtwork(tile) {
    const image = tile.querySelector("img");
    if (image) {
      viewerImage.src = image.currentSrc || image.src;
      viewerImage.alt = image.alt;
      viewer.showModal();
      return;
    }

    const backgroundImage = window.getComputedStyle(tile).backgroundImage;
    const imageMatch = backgroundImage.match(/^url\(["']?(.*?)["']?\)$/);

    if (!imageMatch) {
      console.error("Could not find the full-size image for this artwork.", tile);
      return;
    }

    const artworkClass = Array.from(tile.classList).find(function (className) {
      return /^(?:DD|D)?pic\d+$/.test(className);
    });
    const artworkNumber = artworkClass && artworkClass.match(/\d+$/);

    viewerImage.src = imageMatch[1];
    viewerImage.alt = artworkNumber
      ? "Artwork " + artworkNumber[0]
      : "Selected artwork";
    viewer.showModal();
  }

  artworkTiles.forEach(function (tile) {
    const isNativeButton = tile.tagName === "BUTTON";
    if (!isNativeButton) {
      tile.setAttribute("role", "button");
      tile.setAttribute("tabindex", "0");
    }

    tile.addEventListener("click", function () {
      openArtwork(tile);
    });

    if (!isNativeButton) {
      tile.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openArtwork(tile);
        }
      });
    }
  });

  closeButton.addEventListener("click", function () {
    viewer.close();
  });

  viewer.addEventListener("click", function (event) {
    if (event.target === viewer) {
      viewer.close();
    }
  });

  viewer.addEventListener("close", function () {
    viewerImage.removeAttribute("src");
    viewerImage.alt = "";
  });
});
