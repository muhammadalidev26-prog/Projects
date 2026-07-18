// ======================================================
// "Choose Your Adventure" - Game Logic
// ======================================================

// Grab the button and the results box from the page
const startBtn = document.getElementById("startBtn");
const resultsBox = document.getElementById("results");

// When the button is clicked, start the game
startBtn.addEventListener("click", startGame);

function startGame() {
  // ---- Score & Health ----
  // score tracks how well the player is doing
  // health represents how "alive" the player still is
  let score = 0;
  let health = 100;
  let gold = 0;
  let hiddenEnding = false; // becomes true if the secret code is found

  // ---------------------------------------------
  // 1. Welcome Screen
  // ---------------------------------------------
  alert("Welcome, traveler... You are about to enter The Forgotten Dungeon.");

  const playerName = prompt("Before we begin, what is your name?");

  // prompt() returns null if the player clicks "Cancel"
  if (playerName === null) {
    showResults("Maybe another time.");
    return; // stop the game completely
  }

  // Using string concatenation as required
  alert("Welcome " + playerName + "!");

  // ---------------------------------------------
  // 2. Ask for Age
  // ---------------------------------------------
  const age = Number(prompt("How old are you?"));

  if (age < 13) {
    alert("Too young for this adventure!");
  } else if (age >= 13 && age <= 17) {
    alert("Young adventurer!");
  } else {
    alert("Good luck!");
  }

  // ---------------------------------------------
  // 3. First Choice - Left or Right door
  // ---------------------------------------------
  let doorChoice = prompt("You see two doors.\nLeft or Right?");

  // Normalize the input so "Left", "LEFT", " left " all work the same way
  doorChoice = doorChoice === null ? "" : doorChoice.trim().toLowerCase();

  if (!(doorChoice === "left" || doorChoice === "right")) {
    // Neither "left" nor "right" was typed
    score -= 3;
    health -= 50;
    endGame(playerName, score, health, gold, hiddenEnding, "You hesitate and lose.");
    return;
  }

  // ---------------------------------------------
  // 4. Left Door - the sleeping dragon
  // ---------------------------------------------
  if (doorChoice === "left") {
    let dragonChoice = prompt("There is a sleeping dragon.\nFight or Sneak?");
    dragonChoice = dragonChoice === null ? "" : dragonChoice.trim().toLowerCase();

    if (dragonChoice === "fight") {
      health = 0; // the dragon wins
      score -= 5;
      endGame(playerName, score, health, gold, hiddenEnding, "The dragon wakes up and defeats you. You lose.");
      return;
    } else {
      // Sneaking past successfully is a good decision
      score += 2;
      health -= 10; // a small scare costs a little health
      alert("You quietly sneak past the dragon. Phew!");
    }
  }

  // ---------------------------------------------
  // 5. Right Door - the chest
  // ---------------------------------------------
  if (doorChoice === "right") {
    const openChest = confirm("There is a chest. Open it?");

    if (openChest) {
      gold = gold + 50; // calculation
      score += 3;
      alert("You found treasure! +" + 50 + " gold.");
    } else {
      score += 1;
      alert("You decide not to risk it and keep walking.");
    }
  }

  // ---------------------------------------------
  // Check health after the first major choice
  // ---------------------------------------------
  if (health <= 0) {
    endGame(playerName, score, health, gold, hiddenEnding, "You collapse from your injuries. Game over.");
    return;
  }

  // ---------------------------------------------
  // Extra Challenge - Secret Magic Number
  // ---------------------------------------------
  const magicNumber = Number(prompt("A strange voice asks: enter the magic number to test your fate."));

  if (magicNumber === 777) {
    hiddenEnding = true;
    score += 10;
    alert("The number glows... a hidden path reveals itself!");
  }

  // ---------------------------------------------
  // 6. Final Choice - Red or Blue door
  // ---------------------------------------------
  // The winning door changes randomly each playthrough
  const winningDoor = Math.random() < 0.5 ? "red" : "blue";

  let finalChoice = prompt("There are two exits:\nRed door\nBlue door\nOnly one wins.");
  finalChoice = finalChoice === null ? "" : finalChoice.trim().toLowerCase();

  if (finalChoice === winningDoor) {
    score += 5;
    alert("The " + finalChoice + " door leads outside. You made it!");
  } else if (finalChoice === "red" || finalChoice === "blue") {
    score -= 2;
    health -= 30;
    alert("The " + finalChoice + " door was a trap!");
  } else {
    // Typed something other than red/blue
    score -= 3;
    health -= 20;
    alert("You freeze in place, unsure which door to pick.");
  }

  // ---------------------------------------------
  // 7. Ending
  // ---------------------------------------------
  endGame(playerName, score, health, gold, hiddenEnding, null);
}

// ======================================================
// Decides the final message and shows the results
// ======================================================
function endGame(playerName, score, health, gold, hiddenEnding, forcedMessage) {
  let result;

  if (forcedMessage) {
    // Used for early-exit endings (hesitated, fought the dragon, etc.)
    result = forcedMessage;
  } else if (health <= 0) {
    result = "You died in the dungeon.";
  } else if (hiddenEnding) {
    result = "You found the secret ending! Legendary escape!";
  } else {
    // Ternary operator, as required by the bonus challenge
    result = score >= 7 ? "You escaped!" : "You survived, but barely made it out.";
  }

  const summary =
    "Player: " + playerName + "\n" +
    "Final Score: " + score + "\n" +
    "Health: " + health + "\n" +
    "Gold: " + gold + "\n\n" +
    "Result:\n" + result;

  alert(summary);
  showResults(summary);
}

// Displays the final summary on the page itself, not just in a popup
function showResults(text) {
  resultsBox.textContent = text;
  resultsBox.classList.remove("hidden");
}
