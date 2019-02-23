const parseGame = game => {
  const teams = game.teams || "[]";
  const phrases = game.phrases || "{}";
  return {
    id: game.id,
    teams: JSON.parse(teams),
    phrases: JSON.parse(phrases)
  };
};

export const prepareGameForState = game => {
  const parsedGame = parseGame(game);
  return {
    id: parsedGame.id,
    isActive: Boolean(game.isActive),
    teams: parsedGame.teams,
    phrases: parsedGame.phrases
  };
};

export const copyText = text => {
  const textarea = document.createElement("textarea");
  textarea.textContent = window.location.href;
  textarea.contentEditable = "true";
  textarea.readOnly = false;
  textarea.disabled = false;
  // Can't be `display: none` for `select()` to work.
  textarea.setAttribute(
    "style",
    "opacity: 0; position: fixed; top: -1000px; left: -1000px;"
  );
  // Node needs to actually be in the live DOM during copy...
  if (document.body !== null) {
    document.body.appendChild(textarea);
  }
  textarea.select();
  let didCopy = document.execCommand("copy");
  if (!didCopy) {
    // iOS-specific copying
    // Borrowed from http://bit.ly/2Gc3gTp
    const range = document.createRange();
    range.selectNodeContents(textarea);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    textarea.setSelectionRange(0, 999999);
    didCopy = document.execCommand("copy");
  }
  if (document.body !== null) {
    document.body.removeChild(textarea);
  }
};
