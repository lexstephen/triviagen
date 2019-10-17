// document ready
$(function() {
    const wordApp = {};
    const teamApp = {};
    const quizApp = {};

    wordApp.url = "https://api.datamuse.com/words";
    wordApp.baseWord;
    wordApp.randomWordLoop;
    wordApp.fallbackWords = ["toronto", "raccoon", "canada", "travel", "food", "intelligence", "animals", "dogs", "cats", "rap", "love", "champions", "monster", "celebrity", "fame", "gender", "magic", "fantasy", "education", "politics"];
    wordApp.$inputWord = $('#inputWord');

    teamApp.$nameDisplayContainer = $('.nameDisplayContainer');
    // determine what number of name inputs exist
    teamApp.nameCount = $('#nameInputs input[type="text"]').length;
    // set a default team max size for page loads
    teamApp.$teamMaxSize = $('#teamMaxSize');
    // initialize arrays to hold names and groups of teams
    teamApp.names = [];
    teamApp.teamNames = [];
    teamApp.teamSizeValues = [];

    quizApp.score = 0;
    quizApp.questions = [];


    $(() => {
        wordApp.init();
        teamApp.init();
        quizApp.init();
    });


    quizApp.init = () => {
        quizApp.getQuestions();
    }

    teamApp.init = () => {
        teamApp.$teamMaxSize.val("3");
        teamApp.$nameDisplayContainer.hide();
        teamApp.setListeners();
    }

    wordApp.init = () => {
        // Populate baseWord with a random starter word from fallbackArray
        wordApp.baseWord = wordApp.getRandomWord([]);
        wordApp.getRandomName();
        wordApp.$inputWord.prop('placeholder', wordApp.baseWord);
        wordApp.setListeners();
    }

    class Question {
        constructor(question, options, correct, questionNumber) {
            this.question = question;
            this.options = options;
            this.correct = correct;
            this.questionNumber = questionNumber;
        };
        calculate(selection, questionNumber) {
            console.log(selection);
            console.log(this.correct);
            if(selection == this.correct) {
                quizApp.score++;
                console.log("correct")
                $('#quizScore').text(`${quizApp.score} / ${this.options.length + 1}`);
                // for (let num in this.options) {
                //     console.log(num);
                //     $(`#q${questionNumber}__${num}`).prop('disabled', 'true');
                //     // $(`#q${questionNumber}__${num}`).addClass('true');
                // }
                $(`.q${questionNumber} input`).prop('disabled', 'true');
                    
                $(`label[for=q${questionNumber}__${selection}]`).addClass('true');


            } else {
                $(`label[for=q${questionNumber}__${selection}]`).addClass('false');
            }
        };
        print() {
            // console.log(this.options);
            let html = `
            <h4>${this.question}</h4>`;
            for (let option in this.options) {
                html += `<span class="radioSet q${this.questionNumber}">
                    <input type="radio" id="q${this.questionNumber}__${option}" name="q${this.questionNumber}" value="${option}">
                    <label class="radioLabel" for="q${this.questionNumber}__${option}">${this.options[option]}</label>
                </span>`
                // html += `<li></li>`
            }
            // html += `</ul>`
            return html;
        }
    };

    
    quizApp.setListeners = () => {
        $('input:radio').on('click', function(e) {
            const name = e.currentTarget.name;
            const split = name.split("q");
            const questionNumber = split[1];
            const question = quizApp.questions[questionNumber];
            question.calculate(e.currentTarget.value, questionNumber);
            console.log(questionNumber)
            console.log(e.currentTarget.name); //e.currenTarget.name points to the property name of the 'clicked' target.
            console.log(e.currentTarget.value); //e.currenTarget.value points to the property value of the 'clicked' target.
            // console.log();
        });


        console.log('set');
        // $('#playLoop').click(function() {
        //     // $('#playLoop').prop('disabled', true);
        //     // $('#pauseLoop').prop('disabled', false);
        //     clearInterval(wordApp.randomWordLoop);
        //     wordApp.getRandomName();
        // });
        
        
        // $('input[type="radio"]').click(function() {
        //     // $('#playLoop').prop('disabled', false);
        //     // $('#pauseLoop').prop('disabled', true);
        //     clearInterval(wordApp.randomWordLoop);
        // });
    }

quizApp.getQuestions = () => {
    const questionArray = $.ajax({
        url: 'https://opentdb.com/api.php',
        dataType: 'json',
        method:'GET',
        data: {
            amount: 15,
            category: 12,
            type: 'multiple',
        }
    });

    $.when(questionArray).done((questions) => {
        let count = 0;
        questions.results.forEach((result) => {
            const options = result.incorrect_answers;
            const rand = Math.floor(Math.random() * options.length);
            const temp = options[rand];
            options[rand] = result.correct_answer;
            options.push(temp);
            // console.log(options);
            q = new Question(result.question, options, rand, count);
            // q.calculate("bop");
count++;
// console.log(count);
        // console.log(result);
        $('#questionDisplay').append(q.print());
        quizApp.questions.push(q);
    });

    // $('#questionDisplay').append(`eeee`);
    quizApp.setListeners();

    // return quizApp.questions;
    })
}



wordApp.getWords = (params) => {   
    wordApp.requestObject.data.params = params; 
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
        // $('#playLoop').click(function() {
        //     // $('#playLoop').prop('disabled', true);
        //     // $('#pauseLoop').prop('disabled', false);
        //     clearInterval(wordApp.randomWordLoop);
        //     wordApp.getRandomName();
        // });
        $('#pauseLoop').click(function() {
            // $('#playLoop').prop('disabled', false);
            // $('#pauseLoop').prop('disabled', true);
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

    teamApp.setListeners = () => {
        // watch for click to add extra name inputs
        $('#increaseNames').on('click', () => {
            const listItem = `<div class="nameBox"><i class="fas fa-user"></i> <input type="text" id="name${teamApp.nameCount}"></div>`;
            $('#nameInputs').append(listItem);
            teamApp.nameCount++;
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
            teamApp.names = [];
            teamApp.teamNames = [];
            teamApp.teamSizeValues = [];

            // call the functions needed to randomize and generate
            teamApp.getPlayerNames();
            teamApp.determineTeamSizes();
            teamApp.randomizeNames();
            teamApp.populateTeams();
            teamApp.printTeams();
        });
    }

    // read inputs and store names in a simple array
    teamApp.getPlayerNames = () => {
        $('#nameInputs input').each(function (index, name) {
            if(name.value !== "") {
                teamApp.names.push(name.value); 
            }
        });
    }

    // find the ideal number of players per team and set up teamSizeValues array
    teamApp.determineTeamSizes = () => {
        const teamMaxSize = teamApp.$teamMaxSize.val();
        
        // let totalPlayerCount = parseInt(names.length);
        let totalPlayerCount = teamApp.names.length;
        let numberOfTeamsNeeded = Math.ceil(totalPlayerCount / teamMaxSize);
        
        // let teamSizeValues = [];
        if(totalPlayerCount % numberOfTeamsNeeded === 0) {
            // if the numbers are easily divided just roll with it
            for (tm = 0; tm < numberOfTeamsNeeded; tm++) {
                teamApp.teamSizeValues[tm] = totalPlayerCount / numberOfTeamsNeeded;
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
                    if(playersToAssign === 1 && (teamApp.teamSizeValues[tm - 1] - 1 > 1)) {
                        teamApp.teamSizeValues[tm - 1] = teamApp.teamSizeValues[tm - 1] - 1;
                        arrayVal = playersToAssign + 1;
                    } else {
                        arrayVal = playersToAssign;
                    }
                }

                // populate the team with the correct number of players
                teamApp.teamSizeValues[tm] = arrayVal;
                // update how many players are left
                playersToAssign = playersToAssign - arrayVal;
            }
        }
    }

    // shuffle array of names
    // I am usually a PHP developer and man do I miss shuffle()
    // this is based on the Fisher-Yates shuffle
    // as you can see above they sadly did not publish an Equal Number Of Teams algorithm
    teamApp.randomizeNames = () => {
        let count = teamApp.names.length - 1;
        do {
            let randNumber = Math.floor(Math.random() * count);
            let tempInfo = teamApp.names[count];
            teamApp.names[count] = teamApp.names[randNumber];
            teamApp.names[randNumber] = tempInfo;
            count--;
        } while (count > 1);
    }

    // copy names into teamSizeValues according to their respective sizes
    teamApp.populateTeams = () => {
        for (x = 0; x < teamApp.teamSizeValues.length; x++) {
            let tempTeam = [];
            for (y = 0; y < teamApp.teamSizeValues[x]; y++) {
                tempTeam.push(teamApp.names.pop());
            }
            teamApp.teamNames[x] = tempTeam;
        }
    }

    // build and set the HTML that shows the generated teams 
    teamApp.printTeams = () => {
        let html = ``;
        // let html = `<div class="teams"><div class="teamgroup">`;
        for (x = 0; x < teamApp.teamNames.length; x++) {
            html += `<div class="team"><h2>team ${x+1}</h2>
            <ul class="fa-ul">`;
            for (y = 0; y < teamApp.teamNames[x].length; y++) {
            html += `<li><span class="fa-li"><i class="fas fa-user"></i></span> ${teamApp.teamNames[x][y]}</li>`;
            }
            html += `</ul></div>`;
        }
        // html += `</div></div>`;
        $('#nameDisplay').html(html);
    }
});