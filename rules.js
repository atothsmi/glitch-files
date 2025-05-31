/* global toml */
/* global engine */
/* global choicesContainer */

let domain;
let chosen;
let mood;

function start(text) {
  domain = toml.parse(text);
  chosen = new Set() //init data struct, chosen storylets
  engine.setTitle(domain.title) //set the title
  let introduction = domain.storylets.intro;
  chunkIt(introduction.desc, introduction.tag, rgbify(introduction.color), rgbify(introduction.textcolor)); //display story's intro chunks
  chosen.add("intro")
  engine.provideChoices(filterChoices()); //provide choices based on filter
}

function applyChoice(target) {
  let story =  domain.storylets[target];
  let next = domain.storylets
  let timetotal = 0;
  let wait = 0;
  chosen.add(target); //target selected
  choicesContainer.innerText = "";
  if (story.next !== undefined){
    chunkIt(story.desc, story.tag, rgbify(story.color), rgbify(story.textcolor));
    for (let n in story.next){
      wait += 3000
      timetotal += wait
      setTimeout(function() {
        chunkIt(next[story.next[n]].desc, next[story.next[n]].tag, rgbify(next[story.next[n]].color), rgbify(next[story.next[n]].textcolor));
    }, wait);
    
  }}else{
    chunkIt(story.desc, story.tag, rgbify(story.color), rgbify(story.textcolor));
  } //display description
  setTimeout(function(){engine.provideChoices(filterChoices());}, wait); //filter+provide choices
}

function chunkIt(text, tag, color, textcolor){
  //text is an array of strings or a string
  if (Array.isArray(text)){
    for (let part of text){
      engine.appendChunk(part, tag || [], color, textcolor);
      window.scrollTo(0, document.body.scrollHeight);
      }
  } else{
    engine.appendChunk(text, tag || [], color, textcolor);
    window.scrollTo(0, document.body.scrollHeight);
    
  }
}

// This code is based on code from this glitch project
// https://glitch.com/edit/#!/p5-dog-park-fun?path=README.md%3A1%3A0
// I didn't super understand what to do for this part
// and looking at this person's code helped me to figure out
// what kind of logic to implement here.
function filterChoices(){
  let choices = [] //this part sets up an empty array
  
  //this part loops through all the storylets
  for (let id in domain.storylets){ 
    
    //this part makes it so we don't have to write this out a bunch
    let storylet = domain.storylets[id]
    
    //if already chosen, go to next storylet
    if (chosen.has(id)){
      continue;
    }
    
    // if  and not met, go to next storylet
    if ("req" in storylet){
      if(!conditionsHold(storylet.req)){
        continue;
      }
    }
    
    // if conflicts and met, go to next storylet
    if ("con" in storylet){
      if(conditionsHold(storylet.con)){
        continue;
      }
    }
    
    //add storylet identifiers to choices array
    choices.push({"text":storylet.txt, "target":id, "color": rgbify(storylet.color), "textcolor": rgbify(storylet.textcolor)})
    }
  return choices
}

// This code is based on the code from the project slides
// https://docs.google.com/presentation/d/1q7trdkEu3zWCC60Ibtrqzn1dE9utxyqTEUm1qEd39eU/edit#slide=id.g10434e9c7dc_0_5
// I kept the comments, because I won't remember what's happening
// if I get rid of them.
// Also I only sort of get what's going on so I'm keeping them
// in so I can look back and understand it later
function conditionsHold(condition){
	
	if (typeof(condition) === "string") {
		condition = [ condition ];
		// now it is an array: an AND condition with one item
	}

	if (typeof(condition[0]) === "string") {
		condition = [ condition ];
		// now it is an array of arrays: an OR condition of one case
	}
	
	for (let out of condition)  {
		let satisfied = true; // hope for the best
		for (let inner of out){
			if (!chosen.has(inner)){
				satisfied = false; // hopes dashed
			}
		}

		if (satisfied) {
			return true;
		}
	}

	// We get here if we never returned true above.
	// So, we know none of the disjuncts were satisfied.
	return false;
}


// I wrote all of the code beneath this comment
// before I looked harder at the slides and found the skeleton
// code and before I looked at the code of someone whose code worked a different way
// It worked, but it wasn't legible.
function conditionsHold_NotUsed(target){
  let required = true; //default requirments met
  let noconflict = true; //default no conflicts
  let storylet = domain.storylets[target]

  if (chosen.has(target)){ //returns if already visited
    return false}
  if (typeof(storylet.req) === 'string'){ //a single string
    if (!chosen.has(storylet.req)){ //if not in chosen false
      required = false;}
  }
  else{
    for (let i in storylet.req){ //an array
      if (typeof(storylet.req[i]) === 'string'){ //an array of string
        if (!chosen.has(storylet.req[i])){ //if string not in chosen
          required = false; //return false and stop loop
          break}
      }
      else{ //an array of arrays of single strings
          if (!chosen.has(storylet.req[i][0])){ //
            required = false;} //
          else{
            required = true;
            break}
       }
    }
  }    
  if (typeof(storylet.con) === 'string'){
    if (chosen.has(storylet.con)){
      noconflict = false;}
  }
  else{
    for (let i in storylet.con){
      if (typeof(storylet.con[i]) === 'string'){
        if (!chosen.has(storylet.con[i])){
          noconflict = true;
          break}
        else{
          noconflict = false;}
      }
      else{
        if (chosen.has(storylet.con[i][0])){
          noconflict = false;
          break}
        else{
          noconflict = true;}
      }
    }
  } 
  return required && noconflict
}


function filterChoices_NotUsed(){
  let choices = []
  for (let id in domain.storylets){ 
    if (conditionsHold(id)){
      choices.push({"text":domain.storylets[id].name, "target":id});
    }
  }
  return choices
}


function rgbify(color){
  if (color == undefined){
    return
  }
  let rgbified = "rgb("
  for (var i = 1;i <= 3; i++){
    rgbified += color
    if (i == 3){
      rgbified += ")"
    }else{
      rgbified += ","
    }
  }
  return rgbified
}