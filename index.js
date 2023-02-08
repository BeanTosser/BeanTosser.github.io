// TODO
// * Prevent duplicate buttons
// * Make sure all dit/dah sounds play under all circumstances
// * Prettify the interface

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

let context = new (window.AudioContext || window.webkitAudioContext)();
function createOscillator(duration){
  let osc = context.createOscillator(); // instantiate an oscillator
  osc.type = 'sine'; // this is the default - also square, sawtooth, triangle
  osc.frequency.value = 440; // Hz
  osc.connect(context.destination); // connect it to the destination
  return osc;
}

let variableOscillator;

const DIT_TIME = 400.0 / 3.0;
const DAH_TIME = DIT_TIME * 3;
// The user should be able to hold the manual key at least a little bit longer than the current "dit" time and
// still have the entered symbol be considered at dit. If the manual key is held longer than ditTime * the error ratio then
// a "dah" will be entered.
const DIT_TIME_ERROR_RATIO = 1.25;

// Code speed denoted in dit DURATIONS per minute
// So a dit time of 200 milliseconds, for instance, would correpsond with a speed of 1000 / 200 (dits per second) * 60
const MIN_SPEED = 150;
const MAX_SPEED = 1200;
const INITIAL_SPEED = 500;

let ditTime, dahTime;

let manualKeyStartTime = 0;

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
const speedSlider = document.getElementById("speed_slider");
const speedDisplay = document.getElementById("display_speed");
const transmitButton = document.getElementById("transmit_button");
const receiveButton = document.getElementById("receive_button");

const numSymbols = symbols.length;
const REWARD_TIME = 2000;
const prompt_TIME = 2000;

let transmitMode = true;

function clearEntry(){
  currentEntry = "";
}

function changeCodeSpeed(speed){
  ditTime = 1000 / (speed / 60);
  dahTime = ditTime * 3;
  speedDisplay.innerHTML = speed.toString();
}

function enterDit(){
  if(allowEntry){
    context.resume();
    playDit();
    currentEntry += ".";
    checkAnswer();
  }
}

function enterDah(){
  if(allowEntry){
    context.resume();
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
    let ditOsc = createOscillator();
    ditOsc.start();
    ditOsc.stop(context.currentTime + ditTime/1000.0)
}

function playDah(){
  let dahOsc = createOscillator();
  dahOsc.start();
  dahOsc.stop(context.currentTime + dahTime/1000.0)
}

function startOscillator(){
  // Start a timer to track how long the button was held
  startTime = new Date();
  variableOscillator = createOscillator();
  variableOscillator.start();
}

function stopOscillator(){
  variableOscillator.stop();
  let elapsedTime = new Date() - startTime;
  if(elapsedTime > ditTime + (ditTime * DIT_TIME_ERROR_RATIO)){
    currentEntry += "-"; 
  } else {
    currentEntry += ".";
  }
  checkAnswer();
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
      }, ditTime * 2)
    }
  } else {
    playDah();
    if(codePart.length > 1){
      setTimeout(() => {
        playPartialCode(codePart.slice(1));
      }, dahTime + ditTime)
    }
  }
}

function playFullCode(){
  if(currentSymbol[1][0] === "."){
    playDit();
    if(currentSymbol[1].length > 1){
      setTimeout(() => {
        playPartialCode(currentSymbol[1].slice(1));
      }, ditTime * 2)
    } 
  } else {
    playDah();
    if(currentSymbol[1].length > 1){
      setTimeout(() => {
        playPartialCode(currentSymbol[1].slice(1));
      }, dahTime + ditTime)
   }
 }
}

function initialize(){
  // Hide letter buttons
  letterButtonArea.style.display = "none";
  changeCodeSpeed(INITIAL_SPEED);
  speedSlider.setAttribute("min", MIN_SPEED.toString());
  speedSlider.setAttribute("max", MAX_SPEED.toString());
  speedSlider.setAttribute("value", INITIAL_SPEED.toString())
  speedDisplay.innerHTML=INITIAL_SPEED.toString();
  reset();
}

initialize();
