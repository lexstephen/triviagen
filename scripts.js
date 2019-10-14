// document ready
$(function() {

const wordApp = {};
wordApp.url = "https://api.datamuse.com/words";
wordApp.baseWord;
wordApp.randomWordLoop;
wordApp.fallbackWords = ["toronto", "raccoon", "canada", "travel", "food", "intelligence", "animals", "dogs", "cats", "rap", "love", "champions", "monster", "celebrity", "fame", "gender", "magic", "fantasy", "education", "politics"];
wordApp.$inputWord = $('#inputWord');

$(() => {
    wordApp.init();
});

wordApp.init = () => {
    // Populate baseWord with a random starter word from fallbackArray
    wordApp.baseWord = wordApp.getRandomWord([]);
    wordApp.getRandomName();
    wordApp.$inputWord.prop('placeholder', wordApp.baseWord);
    wordApp.setListeners();
    // if ( document.hidden ) { console.log("hidden"); return; }

    // const windowInterval = setInterval(() => {
    //     if ( document.hidden ) { 
    //         console.log("pause");
    //         clearInterval(wordApp.randomWordLoop);
    //     }
    //     else {
    //         console.log("setting");
    //         clearInterval(wordApp.randomWordLoop);
    //         wordApp.getRandomName();
    //     }
    // }, 2000);
}

wordApp.getRandomName = () => {
    clearInterval(wordApp.randomWordLoop);

    // Chained promises to use the returned words in subsequent requests
    const firstWordArray = wordApp.getWords({topics: wordApp.baseWord, v: "enwiki"});
    $.when(firstWordArray).done((firstSet) => {
        const firstWord = wordApp.getRandomWord(firstSet);

        const secondWordArray = wordApp.getWords({rel_bga: firstWord, v: "enwiki"});
        $.when(secondWordArray).done((secondSet) => {
            const secondWord = wordApp.getRandomWord(secondSet);

            const thirdWordArray = wordApp.getWords({rel_rhy: secondWord, v: "enwiki"});
            $.when(thirdWordArray).done((thirdSet) => {
                const thirdWord = wordApp.getRandomWord(thirdSet);
            
                // Got our three words! Display them.
                $('#rhymeString').text(`${firstWord} ${secondWord} ${thirdWord}`);
                wordApp.randomWordLoop = setInterval(wordApp.getRandomName, 5000);
            });
        });
    });
}

// Find a random word from the array of words provided, or pick a random word from the fallbackWords array
wordApp.getRandomWord = (result) => {
    const randomNumber = Math.floor(Math.random() * result.length);
    if(result[randomNumber] !== undefined) {
        return result[randomNumber].word;
    } else {
        return wordApp.fallbackWords[Math.floor(Math.random() * wordApp.fallbackWords.length)];
    }
}

wordApp.setListeners = () => {
    $('#playLoop').click(function() {
        $('#playLoop').prop('disabled', true);
        $('#pauseLoop').prop('disabled', false);
        clearInterval(wordApp.randomWordLoop);
        wordApp.getRandomName();
    });
    $('#pauseLoop').click(function() {
        $('#playLoop').prop('disabled', false);
        $('#pauseLoop').prop('disabled', true);
        clearInterval(wordApp.randomWordLoop);
    });
    $('#nounForm').submit((ev) => {
        ev.preventDefault();
        clearInterval(wordApp.randomWordLoop);
        // $('#rhymeString').empty();
        if(wordApp.$inputWord.val() !== "") {
            console.log("input not empty");
            wordApp.baseWord = wordApp.$inputWord.val();    
        } else {
            console.log("")
        }
        wordApp.getRandomName(wordApp.baseWord);
    })
}

wordApp.requestObject = {
    url: 'https://proxy.hackeryou.com',
    dataType: 'json',
    method:'GET',
    data: {
        reqUrl: wordApp.url,
        params: {}
    }
}

wordApp.getWords = (params) => {   
    wordApp.requestObject.data.params = params; 
    return result = $.ajax(wordApp.requestObject)
}


$('.nameDisplayContainer').hide();

// determine what number of name inputs exist
let nameCount = $('#nameInputs input[type="text"]').length;

// let $numberOfTeams = $('#numberOfTeams');

// set a default team max size for page loads
const $teamMaxSize = $('#teamMaxSize');
$teamMaxSize.val("3");

// initialize arrays to hold names and groups of teams
let names = [];
let teamNames = [];
let teamSizeValues = [];

// watch for click to add extra name inputs
$('#increaseNames').on('click', () => {
    const listItem = `<label for="name${nameCount}" class="visually-hidden">Name: </label>
    <i class="fas fa-user"></i> <input type="text" id="name${nameCount}">    
    <br>`;
    $('#nameInputs').append(listItem);
    nameCount++;
});

// hide display/show form if edit button is clicked
$('#nameEdit').on('click', function() {
    $('.nameForm').show();
    $('.nameDisplayContainer').hide();
});

// watch for form submission, generate teams and display
$('#teamForm').on('submit', (ev) => {
    ev.preventDefault();
    $('.nameForm').hide();
    $('.nameDisplayContainer').show();

    // clear out previous generated values
    names = [];
    teamNames = [];
    teamSizeValues = [];

    // call the functions needed to randomize and generate
    getPlayerNames();
    determineTeamSizes();
    randomizeNames();
    populateTeams();
    printTeams();
});

// read inputs and store names in a simple array
function getPlayerNames() {
    $('#nameInputs input').each(function (index, name) {
        if(name.value !== "") {
            names.push(name.value); 
        }
    });
}

// find the ideal number of players per team and set up teamSizeValues array
function determineTeamSizes() {
    let teamMaxSize = $teamMaxSize.val();
    // let totalPlayerCount = parseInt(names.length);
    let totalPlayerCount = names.length;
    let numberOfTeamsNeeded = Math.ceil(totalPlayerCount / teamMaxSize);
    
    // let teamSizeValues = [];
    if(totalPlayerCount % numberOfTeamsNeeded === 0) {
        // if the numbers are easily divided just roll with it
        for (tm = 0; tm < numberOfTeamsNeeded; tm++) {
            teamSizeValues[tm] = totalPlayerCount / numberOfTeamsNeeded;
        }
    } else  {
        // if the numbers don't divide gracefully,
        // keep track of how many you have assigned,
        // determine the average number per team,
        // and spread the remainder among them, 
        // making sure not to exceed max size 
        // or leave anyone playing alone if possible
        let remainder = totalPlayerCount % numberOfTeamsNeeded;
        let playersToAssign = totalPlayerCount;
        let averagePlayersPerTeam = Math.ceil(totalPlayerCount  / numberOfTeamsNeeded);

        for (tm = 0; tm < numberOfTeamsNeeded; tm++) {
            // figure out how many players will be on this team
            // and save to arrayVal
            if(playersToAssign - averagePlayersPerTeam > 0) {
                if(remainder > 0) {
                    if((averagePlayersPerTeam + 1) <= teamMaxSize) {
                        // if there's room for an extra player, add them
                        // and decrease outstanding remainder by one
                        arrayVal = averagePlayersPerTeam + 1;
                        remainder = remainder--;
                    } else {
                        arrayVal = averagePlayersPerTeam;
                    }
                }
            } else {
                // if one person is left playing alone
                // find them a partner from the previous team
                if(playersToAssign === 1 && (teamSizeValues[tm - 1] - 1 > 1)) {
                    teamSizeValues[tm - 1] = teamSizeValues[tm - 1] - 1;
                    arrayVal = playersToAssign + 1;
                } else {
                    arrayVal = playersToAssign;
                }
            }

            // populate the team with the correct number of players
            teamSizeValues[tm] = arrayVal;
            // update how many players are left
            playersToAssign = playersToAssign - arrayVal;
        }
    }
}

// shuffle array of names
// I am usually a PHP developer and man do I miss shuffle()
// this is based on the Fisher-Yates shuffle
// as you can see above they sadly did not publish an Equal Number Of Teams algorithm
function randomizeNames() {
    let count = names.length - 1;
    do {
        let randNumber = Math.floor(Math.random() * count);
        let tempInfo = names[count];
        names[count] = names[randNumber];
        names[randNumber] = tempInfo;
        count--;
    } while (count > 1);
}

// copy names into teamSizeValues according to their respective sizes
function populateTeams() {
    for (x = 0; x < teamSizeValues.length; x++) {
        let tempTeam = [];
        for (y = 0; y < teamSizeValues[x]; y++) {
            tempTeam.push(names.pop());
        }
        teamNames[x] = tempTeam;
    }
}

// build and set the HTML that shows the generated teams 
function printTeams() {
    let html = `<div class="teams"><div class="teamgroup">`;
    for (x = 0; x < teamNames.length; x++) {
        html += `<div class="team"><h3>Team ${x+1}</h3>
        <ul>`;
        for (y = 0; y < teamNames[x].length; y++) {
        html += `<li>${teamNames[x][y]}`;
        }
        html += `</ul></div>`;
    }
    html += `</div></div>`;
    $('#nameDisplay').html(html);
}
});