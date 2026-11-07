export function initialiseDeferredTripImages(): void {
  const wrappers = document.querySelectorAll<HTMLElement>("[data-deferred-trip-image]");

  if (!("IntersectionObserver" in window)) {
    wrappers.forEach(revealImage);
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      for (const entry of entries) {
        if (entry.isIntersecting && entry.target instanceof HTMLElement) {
          observer.unobserve(entry.target);
          revealImage(entry.target);
        }
      }
    },
    {rootMargin: "200px 0px"},
  );

  for (const wrapper of wrappers) {
    observer.observe(wrapper);
  }
}

function revealImage(wrapper: HTMLElement): void {
  const template = wrapper.querySelector("template");

  if (template === null) {
    return;
  }

  wrapper.append(template.content.cloneNode(true));
  template.remove();
  delete wrapper.dataset.deferredTripImage;
}
