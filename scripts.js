
const wordApp = {};
wordApp.url = "https://api.datamuse.com/words";
wordApp.baseWord = "music";
wordApp.randomWordLoop;

$(() => {
    wordApp.init();
});

wordApp.init = () => {
    let wordString;
    wordApp.generateRandomName();
    // wordApp.randomWordLoop = setInterval(wordApp.loopInterval, 5000);  
    wordApp.loopListener();
    wordApp.jjaListener();
}

wordApp.generateRandomName = () => {
    clearInterval(wordApp.randomWordLoop);
    let firstWord, secondWord, thirdWord;
    const starterWordsArray = wordApp.getWords("", {topics: wordApp.baseWord, v: "enwiki"});
    $.when(starterWordsArray).done((firstSet) => {
        firstWord = wordApp.pickRandomIndex(firstSet);
        const secondWordArray = wordApp.getWords("", {rel_bga: firstWord, v: "enwiki"});
        $.when(secondWordArray).done((secondSet) => {
            secondWord = wordApp.pickRandomIndex(secondSet);
                const thirdWordArray = wordApp.getWords("", {rel_rhy: secondWord, v: "enwiki"});
                $.when(thirdWordArray).done((thirdSet) => {
                    thirdWord = wordApp.pickRandomIndex(thirdSet);
                    console.log(wordApp.baseWord + ": " + " " + firstWord + " [" + secondWord + "] " + thirdWord);
                    $('#rhymeString').text(`${firstWord} ${secondWord} ${thirdWord}`)
                });
        });
    });
    wordApp.randomWordLoop = setInterval(wordApp.generateRandomName, 5000);
}

wordApp.pickRandomIndex = (result) => {
    let randomNumber = Math.floor(Math.random() * result.length);
    if(result[randomNumber] !== undefined) {
        return result[randomNumber].word;
    } else {
        return "toronto";
    }
}

wordApp.loopInterval = () => {
};

wordApp.loopListener = () => {
    $('#playLoop').click(function() {
        $('#playLoop').prop('disabled', true);
        $('#pauseLoop').prop('disabled', false);
        wordApp.loopInterval();
        $('#rhymeString').empty();
        wordApp.generateRandomName();
        // wordApp.randomWordLoop = setInterval(wordApp.generateRandomName, 5000);     
    });
    
    $('#pauseLoop').click(function() {
        $('#playLoop').prop('disabled', false);
        $('#pauseLoop').prop('disabled', true);
        clearInterval(wordApp.randomWordLoop);
    });
};

wordApp.jjaListener = () => {
    $('#nounForm').submit((ev) => {
        ev.preventDefault();
        clearInterval(wordApp.randomWordLoop);
        $('#rhymeString').empty();
        wordApp.baseWord = $('#inputWord').val();    
        wordApp.generateRandomName(wordApp.baseWord);
    })
}

wordApp.requestObject = {
    url: wordApp.url,
    method: "GET",
    dataType: "json",
    data: {}
}

// wordApp.buildRequest = (params) => {
//     // wordApp.requestObject.data = {};                
//     wordApp.requestObject.data = params;                
//     // for (let key in params) {
//     //     wordApp.requestObject.data[key] = params[key];
//     // }
//     wordApp.getWord();
// }

wordApp.getWords = (word, params) => {   
    // console.log("getWds");
    // console.log("title",$('.lead').text());         
    wordApp.requestObject.data = params; 
    const result = $.ajax(wordApp.requestObject)
    // .then(
    //     (result) => {
    //         // const randomNumber = 0;
    //         
    //     }
    //     );
    return result;
}