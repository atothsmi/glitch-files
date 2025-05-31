// Copyright 2020 The Regents of the University of California

// Created by Adam Smith (amsmith@ucsc.edu)
// Department of Computational Media, UC Santa Cruz

// Unless otherwise stated, all files in this project
// except README.md, rules.js, and story.toml are in 
// the state they were provided to students as part of
// a data structures course assignment.

//I changed/added code that I will indicate through comments

/* global toml */
/* global titleContainer storyContainer choicesContainer */
/* global start applyChoice */

const engine = {
  run: domain_source => {
    fetch(domain_source).then(async response => {
      engine.reset();
      start(await response.text());
    });
  },
  reset: () => {
    document.title = "";
    titleContainer.innerHTML = "";
    storyContainer.innerHTML = "";
    choicesContainer.innerHTML = "";
  },
  setTitle: text => {
    if (typeof text != "string") {
      console.error("Title should be a string!");
    }
    document.title = text;
    titleContainer.innerHTML = text;
  },
  appendChunk: (text, tags, color, textcolor) => { //added extra attributes to appendChunk
    if (typeof text != "string") {
      console.error("Chunk text should be a string!");
    }
    let p = document.createElement("p");
    p.innerHTML = text;
    p.style.backgroundColor = color || "rgb(255, 255, 255)"; //Changes background color based on color
    p.style.color = textcolor || "rgb(0, 0, 0)" //Changes text color based on textcolor
    storyContainer.appendChild(p);
    if (Array.isArray(tags)){ //Gives classes to p based on tags, from P4 (https://glitch.com/~conditional-base-2021)
      for (let tag of tags || []) {
        p.classList.add(tag);
      }
    }else{
      p.classList.add(tags);
    }
    
    
  },
  provideChoices: items => {
    if (!Array.isArray(items)) {
      console.error("Provided choices should be an array!");
    }
    choicesContainer.innerText = "";
    for (let item of items) {
      const button = document.createElement("button");
      if (typeof item.text != "string") {
        console.error("Choice item", item, "should have a string .text field!");
      }
      button.innerHTML = item.text;
      button.style.backgroundColor = item.color || "rgb(255, 255, 255)" //Changes background color based on color
      button.style.color = item.textcolor || "rgb(0, 0, 0)"//Changes text color based on textcolor
      if (typeof item.target != "string") {
        console.error(
          "Choice item",
          item,
          "should have a string .target field!"
        );
      }
      button.onclick = () => {
        applyChoice(item.target);
      };
      choicesContainer.appendChild(button);
    }
    window.scrollTo(0, document.body.scrollHeight);
  }
};

engine.run(document.currentScript.dataset.domainSource);