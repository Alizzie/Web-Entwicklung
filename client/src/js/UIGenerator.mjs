const main = document.getElementsByTagName('main')[0];

export function resetMain () {
  main.textContent = '';
  main.className = '';

  return main;
}
