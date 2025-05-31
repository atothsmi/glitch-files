# *The World Moves On* by ATS

This is about visiting someone you haven't seen in a long time, but you've been meaning to see for just as long. It follows the conversation you have with them after showing up at their doorstep unannounced, but full of concern for them.


# Experience Goals
For this project, I wanted to talk about loss and depression from the view of an outside observer. I purposefully give very little context physically to the scene, because I want the player to focus on the words being said rather than trying to look around. The idea of the page scrolling down without player control was important to me too, because I wanted to capture the feeling of time moving on even if you don't make choices.

# Reference Art {must do this part}
Use *multiple* image or video reference (with links to online sources) to provide a reference point for your desired experience.
I knew I wanted to focus on text for this project, because I didn't have much time to take a bunch of photos or draw a bunch of pictures, so I used the following images for aesthetic and ~vibe~/emotional reference mostly. These images also serve as a basis for what the setting looks like in my head, but I wanted to leave the exact setting open to interpretation. Part of the point is that this conversation could happen to anyone.

![Sad Teen](https://cdn.glitch.me/a754d412-0134-40c4-a888-3e7e000c1f87%2F1440_teen_depression_reward_system_feat-1030x580.jpg?v=1638572303795)
Source: [ScienceNewsForStudents - Teen depression linked to how the brain processes rewards](https://www.sciencenewsforstudents.org/article/teen-depression-sadness-brain-processes-rewards)

![Lonely Apartment](https://cdn.glitch.me/a754d412-0134-40c4-a888-3e7e000c1f87%2Fmpkrmr.jpg?v=1638572305735)
Source:[Maciej Bledowski | Almay Stock Photo](https://www.alamy.com/black-and-white-picture-of-an-old-building-with-fire-escapes-new-york-city-usa-image186061815.html)

![Messy Room](https://cdn.glitch.me/a754d412-0134-40c4-a888-3e7e000c1f87%2FVictoria%20Verseau_%20Approaching%20a%20Ghost%2C%202019_Bonniers%20Konsthall%2C%20Stockholm%2C%20Sweden.jpg?v=1638572311668)
Source: [Victoria Verseau, *Approaching a Ghost* (still), 2019 | Hammer Museum UCLA](https://hammer.ucla.edu/online-artists-film-international-2021/victoria-verseau)

# Authoring Process
I wrote everything in a google doc first (not super interesting, I know). I did several planning documents for this project's storylets, because I wanted to really try to use the sort of grab bag nature of storylets to allow users to click through many different versions of a scene and to try multiple tactics in the same playthrough.

# Technical Foundation
I used [P5's Storylets Base](https://glitch.com/~storylets-base) for this project, because I wanted to experiment with the format more than I did in the other projects I did for that assignment (they both sort of still had a branching narrative map as their base rather than like just a handful of scenes the player can try out). The most similar project to this one is [this project I made for P5](https://glitch.com/edit/#!/design-2-0-beta). In a conversation, someone can try multiple different methods of talking to someone without canceling out other methods of talking, so I wanted to model that behavior using storylets instead of a branching narrative, because that would be a lot more work to do with a branching narrative.

# Artistic Presentation
Describe the changes you've made to the default visual presentation (e.g. the index.html or engine.js provided in the starter code) to make experience more appropriate to your content.
I added a gradient to the background to simulate a descent and progress into somewhere more emotionally intense.

I made everything a shade of black and white, because I wanted to capture the intensity of mood of some parts verses others. In general, black represents anger or hostility, gray represents quiet melancholy, and white represents naivety or avoidance.

I also changed the font of the title, narration(centered bits), you talking (right bits), and them talking (left bits). I wanted each part to feel like a different character, like there was a different personality associated with each of those aspects. I also moved dialouge over to better give the reader a sense of who is talking at any given time, because I didn't want to use a bunch of dialouge tags.

Finally, I made it so that each storylet would play slowly in turn instead of all at once using setTimeout. To figure out how this function works, I looked at this project by [@mremorin](https://glitch.com/edit/#!/p6-texting-simulator?path=js%2Fnarrator.js%3A44%3A25).

# Authoring Language
Describe some of the new constructs you've added to your authoring language. Use a specific inline code example or refer to specific lines in specific files that the reader can use to see the new construct. This description should focus on your data files (*.yaml/json/toml) and explain how that new language feature is used for some artistic effect in your project 

I added a tag property ([from P4](https://glitch.com/~conditional-base-2021)), textcolor, and color tag to my authoring language so I could control the exact color and placement of each individual storylet. I used tags to control the placement and animation of the storylets, while color and textcolor just handled the background color and text color of each storylet respectively.

In some cases, I wanted more storylets with different animation speeds, placement, and colors to play without the player choosing anything to go next, so I used next tag to indicate which storylets should be played after this the player chooses the initial storylet. 

Here is the tags being placed in the story.toml file (from line 451).

    [storylets.ask1]
    txt="Ask"
    desc='“Hey, could you-”'
    next=['ask11','ask12', 'ask13', 'ask14', 'ask15', 'ask16']
    req= [['goinside1'],['comein1']]
    con=[['leave1'],['judge4'], ['chat4']]
    tag=['right', 'slow']
    color=64
    textcolor=225

# Technical Interpretation
To accommodate my tag, color, and textcolor constructs, I expanded the engine.provideChoices and the engine.appendChunk functions to make them take in additional values and I added some code to process them and make them show up on the html of the webpage.

Here is the code from engine.appendChunk I added (from line 43). I did stuff very similar to here in engine.provideChoices to change the visuals (lines 67 and 68)

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
        
In order to accommodate for next tag and to make the storylets come one after another, I altered rules.js to play the storylets named in next if that initial storylet had a next property and I added a setTimeout to each of those calls with increasing wait time inbetween each to make the storylets appear one after another.

Here is the code from engine.provideChoices I added/altered to make that stuff happen (from line 22).

    let wait = 0;
      chosen.add(target); //target selected
      choicesContainer.innerText = "";
      if (story.next !== undefined){
        chunkIt(story.desc, story.tag, rgbify(story.color), rgbify(story.textcolor));
        for (let n in story.next){
          wait += 1700
          timetotal += wait
          setTimeout(function() {
            chunkIt(next[story.next[n]].desc, next[story.next[n]].tag, rgbify(next[story.next[n]].color), rgbify(next[story.next[n]].textcolor));
        }, wait); 
      }}else{
        chunkIt(story.desc, story.tag, rgbify(story.color), rgbify(story.textcolor));
      } //display description
      setTimeout(function(){engine.provideChoices(filterChoices());}, wait); //filter+provide choices
    }
    
Also, for my color and textcolor constructs, I knew I wanted shades of gray, but I didn't want to have to type out "rgb(200, 200, 200)" or something like that a million times, so I made a function called rgbify in my rules.js file in order to turn a single number into a string that can be processed by css as an rbg value (line 199)


# Other Credits!!!
__I was helped immensely by looking at rules.js code from [@Jubb](https://glitch.com/~p5-dog-park-fun) and the [slides](https://docs.google.com/presentation/d/1f8lA_Gt4ZmcDV0SsYX26qWxr55e1my0yWo1wecNptOA/edit#slide=id.g1021c955cfb_0_83) for this project. Thank you for helping me understand the logic of this program!__
__I was greatly inspired by this p6 project by [@mremorin](https://glitch.com/edit/#!/p6-texting-simulator?path=js%2Fnarrator.js%3A44%3A25) for learning about how to bend asynchronous javascript to my will in terms of using setTimeout. Thank you!__
