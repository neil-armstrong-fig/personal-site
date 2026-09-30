import {assertContains} from "@src/scripts/validate-build/html/AssertContains";
import {assertNotContains} from "@src/scripts/validate-build/html/AssertNotContains";
import {matchCount} from "@src/scripts/validate-build/html/MatchCount";

export function assertCyclingOutput(html: string, route: string): void {
  if (route === "/cycling/") {
    assertCyclingArchive(html, route);
  }

  if (/^\/cycling\/[^/]+\/$/.test(route)) {
    assertCyclingTrip(html, route);
  }

  if (/^\/cycling\/[^/]+\/[^/]+\/$/.test(route)) {
    assertCyclingTripChapter(html, route);
  }
}

function assertCyclingArchive(html: string, route: string): void {
  for (const expected of [
    "data-cycling-archive-masthead",
    'data-map-variant="archive"',
    "data-trip-route-map",
    "data-trip-route-attribution",
    ">Trips</dt>",
    ">Distance</dt>",
    "Riding days",
  ]) {
    assertContains(html, expected, route);
  }

  const cardCount = matchCount(html, /\sdata-trip-card(?:\s|>)/g);
  const mapCount = matchCount(html, /\sdata-map-variant="archive"/g);

  if (cardCount !== mapCount) {
    throw new Error(`${route} must render one truthful overview map for each of its ${cardCount} trip cards.`);
  }

  for (const retiredCopy of ["Published trips", "by bike", "Route concept", "Privacy-trimmed map next"]) {
    if (html.toLowerCase().includes(retiredCopy.toLowerCase())) {
      throw new Error(`${route} still contains retired archive copy: ${retiredCopy}`);
    }
  }
}

// Trip overview and chapter pages now share the same masthead/route-visual/highlights hero, so the invariants
// that only depend on that hero (not on RideLog or the chapter-only nav) are asserted once here.
function assertCyclingHero(html: string, route: string): void {
  for (const expected of [
    "data-trip-masthead",
    "data-route-visual",
    'data-map-variant="detail"',
    "data-trip-route-map",
    "data-trip-route-picker",
    "data-trip-route-option",
    "data-trip-route-clear",
    "data-trip-route-key",
    "data-trip-route-selection",
    "data-trip-route-attribution",
    "data-trip-highlights",
    "data-map-fullscreen-button",
    "data-routes-url",
    "<details",
    "Full route",
  ]) {
    assertContains(html, expected, route);
  }

  for (const privateReference of ["private-source", "editorial-notes.md"]) {
    if (html.includes(privateReference)) {
      throw new Error(`${route} exposes private editorial-note material: ${privateReference}`);
    }
  }

  if (html.includes("<table")) {
    throw new Error(`${route} must render responsive ride cards rather than the retired activity table.`);
  }

  if (html.includes("Photography for now")) {
    throw new Error(`${route} still contains the retired route-map placeholder copy.`);
  }

  if (html.includes("data-trip-route-selector")) {
    throw new Error(`${route} still contains the retired native route selector.`);
  }

  if (route.startsWith("/cycling/tokyo-to-seoul/")) {
    assertContains(html, "data-trip-chapter-links", route);
    assertContains(html, "This part&#39;s Dates", route);
  }

  assertRouteKey(html, route);
}

function assertCyclingTrip(html: string, route: string): void {
  assertCyclingHero(html, route);

  for (const expected of ["data-ride-log", "data-activity-route-map", "Ride log"]) {
    assertContains(html, expected, route);
  }
}

function assertCyclingTripChapter(html: string, route: string): void {
  assertCyclingHero(html, route);

  for (const expected of ["data-trip-chapter-nav", "Part "]) {
    assertContains(html, expected, route);
  }

  for (const overviewOnlyMarker of ["data-ride-log", "data-trip-chapter-toc"]) {
    assertNotContains(html, overviewOnlyMarker, route);
  }

  if (/data-highlighted-route-ids="([^"]+)"/.exec(html) === null) {
    throw new Error(`${route} must highlight this chapter's own routes on the detail map.`);
  }
}

function assertRouteKey(html: string, route: string): void {
  assertContains(html, 'data-route-key-kind="day"', route);
  assertConditionalRouteToggle(html, route, "outing");
  assertConditionalRouteToggle(html, route, "transit");
  assertConditionalRouteToggle(html, route, "ferry");

  for (const fixedKind of ["day", "bonus"] as const) {
    assertNotContains(html, `data-route-visibility-toggle="${fixedKind}"`, route);
  }

  if (route === "/cycling/tokyo-to-seoul/") {
    for (const keyKind of ["outing", "transit", "ferry"] as const) {
      assertContains(html, `data-route-key-kind="${keyKind}"`, route);
    }

    assertNotContains(html, "data-trip-transit-note", route);
    assertNotContains(html, 'data-route-key-kind="bonus"', route);
    assertContains(html, "data-activity-route-controls", route);
    assertContains(html, "data-activity-route-controls hidden", route);
  }

  if (route === "/cycling/porto-to-faro/") {
    for (const keyKind of ["bonus", "ferry"] as const) {
      assertContains(html, `data-route-key-kind="${keyKind}"`, route);
    }

    for (const keyKind of ["outing", "transit"] as const) {
      assertNotContains(html, `data-route-key-kind="${keyKind}"`, route);
    }
  }

  if (route === "/cycling/rotterdam-to-rotterdam/") {
    for (const keyKind of ["bonus", "outing", "transit", "ferry"] as const) {
      assertNotContains(html, `data-route-key-kind="${keyKind}"`, route);
    }

    assertNotContains(html, "data-activity-route-controls", route);
  }
}

function assertConditionalRouteToggle(html: string, route: string, keyKind: string): void {
  let toggleKind = keyKind;

  if (keyKind === "outing") {
    toggleKind = "outings";
  }

  if (keyKind === "ferry") {
    toggleKind = "ferries";
  }

  const key = `data-route-key-kind="${keyKind}"`;
  const toggle = `data-route-visibility-toggle="${toggleKind}"`;

  if (html.includes(key)) {
    assertContains(html, toggle, route);
    return;
  }

  assertNotContains(html, toggle, route);
}
