export default class Board {
  constructor(container) {
    this.container = container;
    this.board = null;
    this.cardsToDo = [];
    this.cardsInProgress = [];
    this.cardsDone = [];
    this.cards = [this.cardsToDo, this.cardsInProgress, this.cardsDone];

    this.saveCards = this.saveCards.bind(this);
    this.onAddButton = this.onAddButton.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
  }

  init() {
    this.drawBoard();
    this.loadSavedCards();
    this.drawSavedCards();
    this.registerEvents();
  }

  drawBoard() {
    this.board = document.createElement("div");
    this.board.classList.add("board");
    this.board.innerHTML = `
      <div class="column">
        <h2 class="column__title">TODO</h2>
        <ul class="cards-list todo"></ul>
        <form class="form hidden">
          <textarea class="form__textarea" placeholder="Enter a title for this card..."></textarea>
          <div class="form__control">
            <button class="form__add-button">Add Card</button>
            <div class="form__close-button">✕</div>
          </div>
        </form>
        <div class="column__show-button">
          <div class="column__show-button-plus">+</div>
          <div>Add another card</div>
        </div>
      </div>
      <div class="column">
        <h2 class="column__title">IN PROGRESS</h2>
        <ul class="cards-list in-progress"></ul>
        <form class="form hidden">
          <textarea class="form__textarea" placeholder="Enter a title for this card..."></textarea>
          <div class="form__control">
            <button class="form__add-button">Add Card</button>
            <div class="form__close-button">✕</div>
          </div>
        </form>
        <div class="column__show-button">
          <div class="column__show-button-plus">+</div>
          <div>Add another card</div>
        </div>
      </div>
      <div class="column">
        <h2 class="column__title">DONE</h2>
        <ul class="cards-list done"></ul>
        <form class="form hidden">
          <textarea class="form__textarea" placeholder="Enter a title for this card..."></textarea>
          <div class="form__control">
            <button class="form__add-button">Add Card</button>
            <div class="form__close-button">✕</div>
          </div>
        </form>
        <div class="column__show-button">
          <div class="column__show-button-plus">+</div>
          <div>Add another card</div>
        </div>
      </div>`;

    this.container.appendChild(this.board);
  }

  loadSavedCards() {
    const savedCards = localStorage.getItem("cards");

    if (savedCards) {
      this.cards = JSON.parse(savedCards);
    }
  }

  drawSavedCards() {
    const parents = [".todo", ".in-progress", ".done"];

    for (let i = 0; i < parents.length; i++) {
      const parent = this.board.querySelector(parents[i]);

      this.cards[i].forEach((title) => {
        this.addCard(parent, title);

        switch (i) {
          case 0:
            this.cardsToDo.push(title);
            break;
          case 1:
            this.cardsInProgress.push(title);
            break;
          case 2:
            this.cardsDone.push(title);
            break;
        }
      });
    }
  }

  registerEvents() {
    const cardsList = this.board.querySelectorAll(".card");
    [...cardsList].forEach((el) => {
      el.addEventListener("mouseover", this.onCardOver);
      el.addEventListener("mouseleave", this.onCardLeave);
      el.addEventListener("mousedown", this.onMouseDown);
    });

    const addButtonList = this.board.querySelectorAll(".form__add-button");
    [...addButtonList].forEach((el) => {
      el.addEventListener("click", this.onAddButton);
    });

    const closeButtonList = this.board.querySelectorAll(".form__close-button");
    [...closeButtonList].forEach((el) => {
      el.addEventListener("click", this.onCloseButton);
    });

    const showButtonList = this.board.querySelectorAll(".column__show-button");
    [...showButtonList].forEach((el) => {
      el.addEventListener("click", this.onShowButton);
    });

    window.addEventListener("beforeunload", this.saveCards);
  }

  saveCards() {
    this.cardsToDo = [];
    this.cardsInProgress = [];
    this.cardsDone = [];

    const toDo = this.board.querySelector(".todo");
    const inProgress = this.board.querySelector(".in-progress");
    const done = this.board.querySelector(".done");

    const cardsToDo = [...toDo.querySelectorAll(".card__title")];
    const cardsInProgress = [...inProgress.querySelectorAll(".card__title")];
    const cardsDone = [...done.querySelectorAll(".card__title")];

    cardsToDo.forEach((card) => this.cardsToDo.push(card.textContent));
    cardsInProgress.forEach((card) =>
      this.cardsInProgress.push(card.textContent),
    );
    cardsDone.forEach((card) => this.cardsDone.push(card.textContent));

    this.cards = [this.cardsToDo, this.cardsInProgress, this.cardsDone];

    localStorage.setItem("cards", JSON.stringify(this.cards));
  }

  onShowButton(event) {
    const allForms = document.querySelectorAll(".form");
    allForms.forEach((form) => (form.classList = "form hidden"));

    const allShowButtons = document.querySelectorAll(".column__show-button");
    allShowButtons.forEach(
      (button) => (button.classList = "column__show-button"),
    );

    const column = event.target.closest(".column");
    const form = column.querySelector(".form");
    const showButton = column.querySelector(".column__show-button");

    form.classList.remove("hidden");
    showButton.classList.add("hidden");
  }

  onCloseButton(event) {
    const column = event.target.closest(".column");
    const form = column.querySelector(".form");
    const textarea = column.querySelector(".form__textarea");
    const showButton = column.querySelector(".column__show-button");

    textarea.value = null;
    form.classList.add("hidden");
    showButton.classList.remove("hidden");
  }

  onAddButton(event) {
    event.preventDefault();

    const column = event.target.closest(".column");
    const form = column.querySelector(".form");
    const showButton = column.querySelector(".column__show-button");

    const parent = column.querySelector(".cards-list");
    const textarea = column.querySelector(".form__textarea");
    const title = textarea.value;

    if (/\S.*/.test(title)) {
      this.addCard(parent, title);

      textarea.value = null;
      form.classList.add("hidden");
      showButton.classList.remove("hidden");
    } else {
      textarea.value = null;
    }
  }

  addCard(parent, title) {
    const card = document.createElement("li");
    card.classList.add("card");

    const cardTitle = document.createElement("div");
    cardTitle.classList.add("card__title");
    cardTitle.textContent = title;

    const removeButton = document.createElement("div");
    removeButton.classList.add("card__remove-button", "hidden");
    removeButton.textContent = "✕";

    card.appendChild(cardTitle);
    card.appendChild(removeButton);
    parent.appendChild(card);

    card.addEventListener("mouseover", this.onCardOver);
    card.addEventListener("mouseleave", this.onCardLeave);
    card.addEventListener("mousedown", this.onMouseDown);
  }

  removeCard(event) {
    const parent = event.target.closest(".cards-list");
    const card = event.target.closest(".card");

    parent.removeChild(card);
  }

  onCardOver(event) {
    const card = event.target.closest(".card");
    const removeButton = card.querySelector(".card__remove-button");

    removeButton.classList.remove("hidden");
  }

  onCardLeave(event) {
    const card = event.target.closest(".card");
    const removeButton = card.querySelector(".card__remove-button");

    removeButton.classList.add("hidden");
  }

  onMouseDown(event) {
    event.preventDefault();

    const removeButton = event.target.closest(".card__remove-button");

    if (removeButton) {
      this.removeCard(event);
    } else {
      this.draggedElement = event.target.closest(".card");
      this.offsetWidth = this.draggedElement.offsetWidth;
      this.offsetHeight = this.draggedElement.offsetHeight;
      const { left, top } = this.draggedElement.getBoundingClientRect();
      this.shiftX = event.clientX - left;
      this.shiftY = event.clientY - top;

      this.cloneElement = this.draggedElement.cloneNode(true);
      this.cloneElement.classList.add("dragged");
      this.cloneElement.style.width = this.offsetWidth + "px";
      this.cloneElement.style.height = this.offsetHeight + "px";
      document.body.append(this.cloneElement);

      this.moveAt(event.pageX, event.pageY);

      this.draggedElement.hidden = true;
      document.addEventListener("mousemove", this.onMouseMove);
      this.cloneElement.addEventListener("mouseup", this.onMouseUp);
    }
  }

  moveAt(pageX, pageY) {
    this.cloneElement.style.left = pageX - this.shiftX + "px";
    this.cloneElement.style.top = pageY - this.shiftY + "px";
  }

  onMouseMove(event) {
    this.moveAt(event.pageX, event.pageY);
    this.showNewPlace(event);
  }

  onMouseUp() {
    if (this.newPlace) {
      this.newPlace.replaceWith(this.draggedElement);
    }

    this.draggedElement.hidden = false;

    document.body.querySelector(".dragged").remove();
    document.removeEventListener("mousemove", this.onMouseMove);
    this.cloneElement = null;
  }

  showNewPlace(event) {
    this.cloneElement.hidden = true;
    const elementBelow = document.elementFromPoint(
      event.clientX,
      event.clientY,
    );
    this.cloneElement.hidden = false;

    if (elementBelow) {
      const cardsArea = elementBelow.closest(".cards-list");

      if (cardsArea) {
        const cardsList = cardsArea.querySelectorAll(".card");
        const cardsCenterPositions = [];

        if (cardsList) {
          for (const card of cardsList) {
            const { top, height } = card.getBoundingClientRect();
            cardsCenterPositions.push(top + height / 2);
          }
        }

        if (!this.newPlace) {
          this.newPlace = document.createElement("div");
          this.newPlace.classList.add("card-new-place");
        }

        this.newPlace.style.width = this.offsetWidth + "px";
        this.newPlace.style.height = this.offsetHeight + "px";

        const cardIndex = cardsCenterPositions.findIndex(
          (item) => item > event.pageY,
        );

        if (cardIndex !== -1) {
          cardsArea.insertBefore(this.newPlace, cardsList[cardIndex]);
        } else {
          cardsArea.appendChild(this.newPlace);
        }
      } else {
        const newPlaceElement = document.body.querySelector(".card-new-place");
        if (newPlaceElement) {
          newPlaceElement.remove();
          this.newPlace = null;
        }
      }
    }
  }
}
