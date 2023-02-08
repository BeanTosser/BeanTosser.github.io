// TODO
// * Prevent duplicate buttons
// * Make sure all dit/dah sounds play under all circumstances
// * Prettify the interface

const dahSound = new Audio("data:audio/wav;base64,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");
const ditSound = new Audio("data:audio/wav;base64,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")

// Borrowed from https://gist.github.com/mohayonao/094c71af14fe4791c5dd
const morseCodes = {
  "0": "-----",
  "1": ".----",
  "2": "..---",
  "3": "...--",
  "4": "....-",
  "5": ".....",
  "6": "-....",
  "7": "--...",
  "8": "---..",
  "9": "----.",
  "a": ".-",
  "b": "-...",
  "c": "-.-.",
  "d": "-..",
  "e": ".",
  "f": "..-.",
  "g": "--.",
  "h": "....",
  "i": "..",
  "j": ".---",
  "k": "-.-",
  "l": ".-..",
  "m": "--",
  "n": "-.",
  "o": "---",
  "p": ".--.",
  "q": "--.-",
  "r": ".-.",
  "s": "...",
  "t": "-",
  "u": "..-",
  "v": "...-",
  "w": ".--",
  "x": "-..-",
  "y": "-.--",
  "z": "--..",
  ".": ".-.-.-",
  ",": "--..--",
  "?": "..--..",
  "!": "-.-.--",
  "-": "-....-",
  "/": "-..-.",
  "@": ".--.-.",
  "(": "-.--.",
  ")": "-.--.-"
}

const DAH_TIME = 600;
const DIT_TIME = 300;

let symbols = [];
let letterButtons = ["a","a","a","a","a","a","a","a"];

for(const [letter, code] of Object.entries(morseCodes)){
  symbols.push([letter, code]);
};
let currentSymbol;
let rnd = Math.random();
let currentEntry = "";
let allowEntry = true;

const displayElement = document.getElementById("displayElement");
const promptElement = document.getElementById("promptElement");
const rewardElement = document.getElementById("rewardElement");
const hintElement = document.getElementById("hintElement");
const letterButtonArea = document.getElementById("letter_buttons");
const codeButtonArea = document.getElementById("codeButtons");

const transmitButton = document.getElementById("transmit_button");
const receiveButton = document.getElementById("receive_button");

const numSymbols = symbols.length;
const REWARD_TIME = 2000;
const prompt_TIME = 2000;

let transmitMode = true;

function clearEntry(){
  currentEntry = "";
}

function enterDit(){
  if(allowEntry){
    playDit();
    currentEntry += ".";
    checkAnswer();
  }
}

function enterDah(){
  if(allowEntry){
    playDah();
    currentEntry += "-";
    checkAnswer();
  }
}

function checkAnswer(){
  displayElement.innerHTML = currentEntry;
  if(transmitMode){
    if(currentEntry.length === currentSymbol[1].length){
      if(currentEntry === currentSymbol[1]){
        allowEntry = false;
        rewardElement.innerHTML = "Correct!";
        setTimeout(function(){
          reset(false);
        }, REWARD_TIME)
      } else {
        allowEntry = false;
        rewardElement.innerHTML = "Incorrect!"
        setTimeout(function(){
          reset(true);
        }, REWARD_TIME)
      }
      
    } else {
      if(currentEntry[currentEntry.length - 1] !== currentSymbol[1][currentEntry.length - 1]){
        allowEntry = false;
        rewardElement.innerHTML = "Incorrect!";
        setTimeout(function(){
          reset(true);
        }, REWARD_TIME)
      }
    }
  } else {

  }
}

function pressLetter(letterIndex){
  if(allowEntry){
    allowEntry = false;
    currentEntry = letterButtons[letterIndex];
    console.log("You pressed: " + currentEntry);
    console.log("The correct answer was: " + currentSymbol[0]);
    if(currentEntry.toLowerCase() === currentSymbol[0].toLowerCase()){
      rewardElement.innerHTML = "Correct!";
      setTimeout(function(){
        reset(false);
      }, REWARD_TIME)
    } else {
      rewardElement.innerHTML = "Incorrect!";
      setTimeout(function(){
        reset(true);
      }, REWARD_TIME)
    }
  }
}

function reset(reuseSymbol){
  if(!reuseSymbol) selectRandomSymbol();
  currentEntry = "";
  allowEntry = true;
  displayElement.innerHTML = currentEntry;
  if(transmitMode){
    if(Math.random() > 0.5){
      promptElement.innerHTML = currentSymbol[0];
    } else {
      promptElement.innerHTML = currentSymbol[0].toUpperCase();
    }
  } else {
    promptElement.innerHTML = currentSymbol[1];
    randomizeLetterButtons();
    playFullCode();
  }
  rewardElement.innerHTML = "";
}

function playDit(){
    ditSound.play();
}

function playDah(){
  dahSound.play();
}

function selectRandomSymbol(){
  currentSymbol = symbols[Math.floor(Math.random() * numSymbols)];
}

function randomizeLetterButtons(){
  // Randomly choose which button will have the correct symbol
  let alreadyUsedLetters = [currentSymbol[0]];
  let correctButtonIndex = Math.floor(Math.random() * letterButtonArea.children.length);
  for(let i = 0; i < letterButtons.length; i++){
    let newLetter = "";
    if(i === correctButtonIndex){
      newLetter = currentSymbol[0];
    } else {
      while(true){
        newLetter = symbols[Math.floor(Math.random() * numSymbols)][0];
        if(alreadyUsedLetters.indexOf(newLetter) === -1){
          break;
        } else {
        }
      }
      alreadyUsedLetters.push(newLetter);
    }
    if(Math.random() > 0.5){
      newLetter = newLetter.toUpperCase();
    }
    letterButtons[i] = newLetter;
    letterButtonArea.children[i].innerHTML = newLetter;

  }
}

function showHint(){
  if(transmitMode){
    promptElement.innerHTML = currentSymbol[1];
  } else {
    promptElement.innerHTML = currentSymbol[0];
    playFullCode();
  }
  promptElement.style.color = "red";
  setTimeout(() => {
    if(transmitMode){
      promptElement.innerHTML = currentSymbol[0];
    } else {
      promptElement.innerHTML = currentSymbol[1];
    }
    promptElement.style.color="black";
  }, prompt_TIME)
}

function switchMode(){
  if(transmitMode){
    transmitMode = false;
    letterButtonArea.style.display = "grid";
    codeButtonArea.style.display = "none";
    transmitButton.removeAttribute("disabled");
    receiveButton.setAttribute("disabled","");
  } else{
    transmitMode = true;
    letterButtonArea.style.display = "none";
    codeButtonArea.style.display = "grid";
    transmitButton.setAttribute("disabled","");
    receiveButton.removeAttribute("disabled");
  }
  reset();
}

function playPartialCode(codePart){
  if(codePart[0] === "."){
    playDit();
    if(codePart.length > 1){
      setTimeout(() => {
        playPartialCode(codePart.slice(1));
      }, DIT_TIME)
    }
  } else {
    playDah();
    if(codePart.length > 1){
      setTimeout(() => {
        playPartialCode(codePart.slice(1));
      }, DAH_TIME)
    }
  }
}

function playFullCode(){
  if(currentSymbol[1][0] === "."){
    playDit();
    if(currentSymbol[1].length > 1){
      setTimeout(() => {
        playPartialCode(currentSymbol[1].slice(1));
      }, DIT_TIME)
    } 
  } else {
    playDah();
    if(currentSymbol[1].length > 1){
      setTimeout(() => {
        playPartialCode(currentSymbol[1].slice(1));
      }, DAH_TIME)
   }
 }
}

function initialize(){
  // Hide letter buttons
  letterButtonArea.style.display = "none";
  reset();
}

initialize();
