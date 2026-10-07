/**
 * Breathing headlines.
 *
 * Every element marked `data-breathe` is split into letters, and the
 * stylesheet (components.css, "Breathing headline") swells each letter from
 * light to heavy and back. This file does the three things CSS cannot:
 *
 *  - split the text into letters and give each one its place in the wave;
 *  - pin the line breaks, so letters changing width never re-wrap the line;
 *  - stop the animation while the headline is off screen.
 *
 * The HTML that is served keeps the headline as plain text. Without
 * JavaScript, or for anyone who has asked for less motion, it stays that way.
 */

/** Seconds between one letter and the next. */
const STEP = 0.25;
/** Seconds for a letter to go from light to heavy and back (1.5s each way). */
const CYCLE = 3;

/** Wrap every character in a span and return the spans in reading order. */
function split(el: HTMLElement): HTMLElement[] {
  // Read aloud, the headline is still its sentence, not a run of letters.
  el.setAttribute("aria-label", el.innerText.replace(/\s+/g, " ").trim());

  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const texts: Text[] = [];
  while (walker.nextNode()) texts.push(walker.currentNode as Text);

  const letters: HTMLElement[] = [];
  for (const node of texts) {
    const fragment = document.createDocumentFragment();
    // Runs of ordinary spaces and line ends become one space. A no-break
    // space (&nbsp; in the content) is left alone: it is there to keep two
    // words on the same line, and `\s` would have turned it into a space
    // that breaks.
    for (const ch of Array.from((node.textContent ?? "").replace(/[ \t\n\r\f]+/g, " "))) {
      const span = document.createElement("span");
      span.className = "breath";
      span.setAttribute("aria-hidden", "true");
      span.textContent = ch;
      fragment.appendChild(span);
      letters.push(span);
    }
    node.replaceWith(fragment);
  }

  // Each letter runs a quarter of a second behind the one before it, counted
  // from the middle of the line as in the source component. A whole number
  // of cycles is then taken off every delay: the letters keep exactly the
  // same positions in the wave, but the wave is already under way when it
  // first appears instead of taking seconds to reach the end of the line.
  const count = letters.length;
  const lead = Math.ceil(((count / 2) * STEP) / CYCLE) * CYCLE;
  letters.forEach((letter, i) => {
    letter.style.animationDelay = `${((i - count / 2) * STEP - lead).toFixed(2)}s`;
  });

  return letters;
}

/**
 * Lay the headline out with every letter at its heaviest, see where the
 * lines break, and pin those breaks with <br> elements.
 */
function freeze(el: HTMLElement): void {
  el.querySelectorAll(".breath-br").forEach((br) => br.remove());
  el.classList.remove("is-frozen");
  el.classList.add("is-measuring");

  const starts: HTMLElement[] = [];
  let top: number | null = null;
  // True while the line we are on was started by a <br> in the content.
  let broken = false;

  el.querySelectorAll<HTMLElement>(".breath, br").forEach((node) => {
    if (node.tagName === "BR") {
      broken = true;
      return;
    }
    // Spaces hang off the end of a line; only letters mark where one starts.
    if (!node.textContent?.trim()) return;

    const y = node.getBoundingClientRect().top;
    if (top !== null && y > top + 1 && !broken) starts.push(node);
    top = y;
    broken = false;
  });

  for (const letter of starts) {
    const br = document.createElement("br");
    br.className = "breath-br";
    letter.before(br);
  }

  el.classList.remove("is-measuring");
  el.classList.add("is-frozen");
}

function setup(el: HTMLElement): void {
  split(el);
  freeze(el);

  // Re-pin the lines whenever the room for the headline changes. The work
  // is put off to the next frame: re-pinning changes the headline's own size,
  // which a resize observer must not do from inside its callback.
  let width = el.clientWidth;
  new ResizeObserver(() => {
    if (Math.abs(el.clientWidth - width) < 1) return;
    width = el.clientWidth;
    requestAnimationFrame(() => freeze(el));
  }).observe(el);

  // Letters changing weight are redrawn every frame; only while visible.
  new IntersectionObserver(([entry]) => {
    el.classList.toggle("is-paused", !entry.isIntersecting);
  }).observe(el);
}

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const headlines = [...document.querySelectorAll<HTMLElement>("[data-breathe]")];
  headlines.forEach(setup);
  // The breaks are measured again once the real font has arrived.
  document.fonts.ready.then(() => headlines.forEach(freeze));
}
