export function splitChars(el: HTMLElement): HTMLElement[] {
  const text = el.textContent ?? ''
  el.innerHTML = ''
  const chars: HTMLElement[] = []
  for (const char of text) {
    const mask = document.createElement('span')
    mask.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:bottom;'
    const inner = document.createElement('span')
    inner.className = 'scramble-char'
    inner.textContent = char === ' ' ? '\u00a0' : char
    mask.appendChild(inner)
    el.appendChild(mask)
    chars.push(inner)
  }
  return chars
}
export function splitWords(el: HTMLElement): HTMLElement[] {
  const text = el.textContent ?? ''
  el.innerHTML = ''
  const words: HTMLElement[] = []
  text.split(' ').forEach((word, i, arr) => {
    const mask = document.createElement('span')
    mask.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:bottom;'
    const inner = document.createElement('span')
    inner.className = 'scramble-char'
    inner.textContent = word
    mask.appendChild(inner)
    el.appendChild(mask)
    words.push(inner)
    if (i < arr.length - 1) el.appendChild(document.createTextNode(' '))
  })
  return words
}
