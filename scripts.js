
const wordApp = {};
wordApp.url = "https://api.datamuse.com/words";
wordApp.baseWord = "";
wordApp.randomWordLoop;
wordApp.fallbackWords = ["toronto", "raccoon", "canada", "travel", "food", "intelligence", "animals", "dogs", "cats", "rap", "love", "champions", "monster", "celebrity", "fame", "gender"];
wordApp.$inputWord = $('#inputWord');

$(() => {
    wordApp.init();
});

wordApp.init = () => {
    // Populate baseWord with a random starter word from fallbackArray
    wordApp.baseWord = wordApp.getRandomWord([]);
    console.log(wordApp.baseWord);
    wordApp.getRandomName();
    // $('#playLoop').prop('disabled', true);
    wordApp.$inputWord.prop('placeholder', wordApp.baseWord);
    wordApp.loopListener();
    wordApp.submitListener();
}

wordApp.getRandomName = () => {
    let firstWord, secondWord, thirdWord, secondWordArray, thirdWordArray;
    clearInterval(wordApp.randomWordLoop);
    console.log(wordApp.baseWord);
    
    // Chained promises to use the returned words in subsequent requests
    const starterWordsArray = wordApp.getWords({topics: wordApp.baseWord, v: "enwiki"});
    $.when(starterWordsArray).done((firstSet) => {
        firstWord = wordApp.getRandomWord(firstSet);
        const secondWordArray = wordApp.getWords({rel_bga: firstWord, v: "enwiki"});
        $.when(secondWordArray).done((secondSet) => {
            secondWord = wordApp.getRandomWord(secondSet);
            const thirdWordArray = wordApp.getWords({rel_rhy: secondWord, v: "enwiki"});
            $.when(thirdWordArray).done((thirdSet) => {
                thirdWord = wordApp.getRandomWord(thirdSet);
                $('#rhymeString').text(`${firstWord} ${secondWord} ${thirdWord}`);
                wordApp.randomWordLoop = setInterval(wordApp.getRandomName, 5000);
            });
        });
    });

    // Update the div with the generated string and set a new interval
    $.when(starterWordsArray, secondWordArray, thirdWordArray).done(() => {
    })
}

// Find a random word from the array of words provided, or pick a random word from the fallbackWords array
wordApp.getRandomWord = (result) => {
    let randomNumber = Math.floor(Math.random() * result.length);
    if(result[randomNumber] !== undefined) {
        return result[randomNumber].word;
    } else {
        const fallbackWord = wordApp.fallbackWords[Math.floor(Math.random() * wordApp.fallbackWords.length)];
        console.log("fall", fallbackWord)
        
        return wordApp.fallbackWords[Math.floor(Math.random() * wordApp.fallbackWords.length)];
    }
}

wordApp.loopListener = () => {
    $('#playLoop').click(function() {
        $('#playLoop').prop('disabled', true);
        $('#pauseLoop').prop('disabled', false);
        wordApp.getRandomName();
    });
    $('#pauseLoop').click(function() {
        $('#playLoop').prop('disabled', false);
        $('#pauseLoop').prop('disabled', true);
        clearInterval(wordApp.randomWordLoop);
    });
};

wordApp.submitListener = () => {
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
    url: 'http://proxy.hackeryou.com',
    dataType: 'json',
    method:'GET',
    data: {
        reqUrl: wordApp.url,
        params: {}
    }
}

wordApp.getWords = (params) => {   
    wordApp.requestObject.data.params = params; 
    const result = $.ajax(wordApp.requestObject)
    return result;
}