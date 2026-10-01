interface DeferredPosterVideo {
  dataset: DOMStringMap;
  poster: string;
}

export function applyDeferredPoster(video: DeferredPosterVideo): void {
  const poster = video.dataset.poster;

  if (poster === undefined) {
    return;
  }

  video.poster = poster;
  delete video.dataset.poster;
}
