/*  */

function setup() {
  createCanvas(300, 300);
}

function draw() {
  rect(50, 50, 200, 200);
  rect(100,100, 25, 25);
}
function blackout(text) {
  let inputWords = text.split(' ');
  let outputWords = []; 
  for (let i = 0; i < inputWords.length; i++) { 
    let w = inputWords[0];
    let blackedOut = '***';
    if(Math.random() < 0.6) {
      outputWords.push(w);
    } else {
      outputWords.push(w);
    }
  }
  return outputWords.join(' ');
}

blackout("Sphinx of black quartz, judge my vow.");
