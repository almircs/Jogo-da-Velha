const cellElements = document.querySelectorAll("[data-cell]");
const board = document.querySelector("[data-board]");
const turnSymbol = document.querySelector("[data-turn]");
const winningMessageTextElement = document.querySelector("[data-winning-message-text]");
const winningMessage = document.querySelector("[data-winning-message]");
const restartButton = document.querySelector("[data-restart-button]");

const scoreElements = {
  x: document.querySelector('[data-score="x"]'),
  circle: document.querySelector('[data-score="circle"]'),
  draw: document.querySelector('[data-score="draw"]'),
};

const score = { x: 0, circle: 0, draw: 0 };

const SYMBOL = { x: "X", circle: "O" };

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

let isCircleTurn = false;

const currentPlayer = () => (isCircleTurn ? "circle" : "x");

const startGame = () => {
  isCircleTurn = false;

  cellElements.forEach((cell, index) => {
    cell.classList.remove("circle", "x", "winner");
    cell.disabled = false;
    cell.setAttribute("aria-label", `Casa ${index + 1}, vazia`);
  });

  updateTurn();
  winningMessage.classList.remove("show-winning-message");
  cellElements[0].focus();
};

const endGame = (winner) => {
  if (winner) {
    winningMessageTextElement.innerText = `${SYMBOL[winner]} venceu!`;
    score[winner] += 1;
  } else {
    winningMessageTextElement.innerText = "Empate!";
    score.draw += 1;
  }

  updateScore();
  cellElements.forEach((cell) => (cell.disabled = true));

  // Pequena pausa para o jogador ver a jogada vencedora destacada
  setTimeout(() => {
    winningMessage.classList.add("show-winning-message");
    restartButton.focus();
  }, winner ? 700 : 300);
};

const findWinningCombination = (player) =>
  winningCombinations.find((combination) =>
    combination.every((index) => cellElements[index].classList.contains(player))
  );

const checkForDraw = () =>
  [...cellElements].every(
    (cell) => cell.classList.contains("x") || cell.classList.contains("circle")
  );

const updateTurn = () => {
  const player = currentPlayer();
  board.classList.remove("circle", "x");
  board.classList.add(player);
  turnSymbol.innerText = SYMBOL[player];
  turnSymbol.className = `turn-symbol ${player}`;
};

const updateScore = () => {
  Object.keys(score).forEach((key) => {
    scoreElements[key].innerText = score[key];
  });
};

// Quem joga pelo teclado não perde o foco quando a casa fica desabilitada
const focusNextFreeCell = (fromIndex) => {
  const cells = [...cellElements];
  for (let step = 1; step < cells.length; step++) {
    const next = cells[(fromIndex + step) % cells.length];
    if (!next.disabled) {
      next.focus();
      return;
    }
  }
};

const handleClick = (event) => {
  const cell = event.currentTarget;
  if (cell.disabled) return;

  const player = currentPlayer();
  const index = [...cellElements].indexOf(cell);

  // Colocar a marca (X ou O)
  cell.classList.add(player);
  cell.disabled = true;
  cell.setAttribute("aria-label", `Casa ${index + 1}, ${SYMBOL[player]}`);

  // Verificar vitória e empate
  const winningCombination = findWinningCombination(player);

  if (winningCombination) {
    winningCombination.forEach((i) => cellElements[i].classList.add("winner"));
    endGame(player);
  } else if (checkForDraw()) {
    endGame(null);
  } else {
    // Passar a vez
    isCircleTurn = !isCircleTurn;
    updateTurn();
    focusNextFreeCell(index);
  }
};

cellElements.forEach((cell) => cell.addEventListener("click", handleClick));
restartButton.addEventListener("click", startGame);

startGame();
