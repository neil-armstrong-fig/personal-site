import {applyDeferredPoster} from "@src/pages/cycling/_components/lazy-video-posters/poster/ApplyDeferredPoster";

let initialised = false;

// Browsers fetch a <video poster> immediately even with preload="none", so a chapter with many clips would download
// every poster before first paint. The poster lives in data-poster until the clip is near the viewport.
export function initialiseLazyVideoPosters(): void {
  if (initialised) {
    return;
  }

  initialised = true;
  const videos = [...document.querySelectorAll<HTMLVideoElement>("video[data-poster]")];

  if (!("IntersectionObserver" in window)) {
    videos.forEach(applyDeferredPoster);
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting || !(entry.target instanceof HTMLVideoElement)) {
          continue;
        }

        observer.unobserve(entry.target);
        applyDeferredPoster(entry.target);
      }
    },
    {rootMargin: "200% 0px"},
  );

  for (const video of videos) {
    observer.observe(video);
  }
}
