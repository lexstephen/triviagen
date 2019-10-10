
const wordApp = {};
wordApp.url = "https://api.datamuse.com/words";
wordApp.iteration = 0;
wordApp.randomWordLoop;

$(() => {
    wordApp.init();
});

wordApp.init = () => {
    let wordString;
    wordApp.showRandomNames();
    wordApp.loopListener();
    wordApp.jjaListener();
}

wordApp.showRandomNames = () => {
    wordApp.getWord("", {topics: "food", v: "enwiki"});
    wordApp.getWord("", {rel_jja: "drink", topics: "food", v: "enwiki"});
    wordApp.randomWordLoop = setInterval(wordApp.loopInterval, 5000);  
}

wordApp.loopInterval = () => {
    $('#rhymeString').empty();
    wordApp.iteration = 0;
    wordApp.getWord("", {topics: "animals", v: "enwiki"});
    wordApp.getWord("", {rel_jja: "cute", topics: "adjectives", v: "enwiki"});
};

wordApp.loopListener = () => {
    $('#playLoop').click(function() {
        // console.log('clicked play');
        // $('#playLoop').toggleClass('active');
        $('#playLoop').prop('disabled', true);
        $('#pauseLoop').prop('disabled', false);
        // $('#pauseLoop').toggleClass('active');
        wordApp.loopInterval();
        wordApp.randomWordLoop = setInterval(wordApp.loopInterval, 5000);     
    });
    
    $('#pauseLoop').click(function() {
        console.log('clicked pause');
        // $('#playLoop').toggleClass('active');
        $('#playLoop').prop('disabled', false);
        $('#pauseLoop').prop('disabled', true);
        // $('#pauseLoop').toggleClass('active');
        clearInterval(wordApp.randomWordLoop);
    });

};

wordApp.jjaListener = () => {
    $('#nounForm').submit((ev) => {
        ev.preventDefault();
        wordApp.iteration = 0;
        $('#rhymeString').empty();
        const word = $('#inputWord').val();
        wordApp.getWord(`${word}`,{topics: word, rel_jja: word});
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

wordApp.getWord = (word, params) => {   
    // console.log("title",$('.lead').text());         
    wordApp.requestObject.data = params; 
    $.ajax(wordApp.requestObject).then(
        (result) => {
            // const randomNumber = 0;
            const randomNumber = Math.floor(Math.random() * result.length);
            if(result[randomNumber] !== undefined) {
                const thisWord = result[randomNumber].word;
                $('#rhymeString').append(` ${word} ${thisWord}`);
                wordApp.iteration++;
                if(wordApp.iteration < 2) {
                    wordApp.getWord(``,{ rel_rhy: thisWord});
                }
            }
        });
}