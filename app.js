const btn = document.querySelector('.talk');
const content = document.querySelector('.content');

async function speak(sentence) {
    const text_speak = new SpeechSynthesisUtterance(sentence);
    text_speak.volume = 1; 
    text_speak.pitch = 0.8;
    text_speak.rate = 1.2;

    const voices = await getVoices();
    console.log('Available voices:', voices); 
    text_speak.voice = voices.find(voice => voice.lang === 'en-US');
    if (!text_speak.voice) {
        console.warn('No voice found for en-US language');
    }
    window.speechSynthesis.speak(text_speak);
}

function getVoices() {
    return new Promise((resolve) => {
        let voices = window.speechSynthesis.getVoices();
        if (voices.length) {
            resolve(voices);
            return;
        }
        window.speechSynthesis.onvoiceschanged = () => {
            voices = window.speechSynthesis.getVoices();
            resolve(voices);
        };
    });
}

function wishMe() {
    const day = new Date();
    const hr = day.getHours();

    if (hr >= 0 && hr < 12) {
        speak("Good Morning Boss");
    } else if (hr === 12) {
        speak("Good noon Boss");
    } else if (hr > 12 && hr <= 15) {
        speak("Good Afternoon Boss");
    } else {
        speak("Good Evening Boss");
    }
}

window.addEventListener('load', async () => {
    await speak("Activating JARVIS");
    await speak("Going online");
    wishMe();
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-US';

recognition.onresult = async (event) => {
    const current = event.resultIndex;
    const transcript = event.results[current][0].transcript;
    content.textContent = transcript;
    await speakThis(transcript.toLowerCase()); 
};

btn.addEventListener('click', () => {
    startListening();
});

function startListening() {
    try {
        recognition.start();
        console.log('Speech recognition started');
    } catch (error) {
        console.error('Speech recognition error:', error);
    }
}

async function speakThis(message) {
    if (message.includes('hey') || message.includes('hello')) {
        await speak("Hello Boss, Wassup");
    } else if (message.includes('how are you')) {
        await speak("I am fine, thank you for asking. Finally someone who acknowledges me");
    } else if (message.includes('about')) {
        await speak(" Hey there, it's JARVIS in the house! Super excited to have you here. Picture me as your personal sidekick for intriguing talks and snappy insights. I thrive on keeping things fresh and fun, so get ready for a wild ride! Whether you're up for a deep dive into conversation or just craving some good company, I've got your back. Let's dive in and make some magic happen!");
    } else if (message.includes('open google')) {
        const searchQuery = message.replace('open google', '').trim();
        await speak("Opening Google, because you're too lazy to type it yourself.");
        window.open("https://www.google.com/webhp?hl=en&sa=X&ved=0ahUKEwiL2cPi3ZSGAxWCUGwGHU8eB70QPAgJ", "_blank");
    } else if (message.includes('open youtube')) {
        const searchQuery = message.replace('open youtube', '').trim();
        await speak(`Searching YouTube for "${searchQuery}"`);
        window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`, "_blank");
    } else if (message.includes('open instagram')) {
        await speak("Opening Instagram, because you can't go five minutes without checking your friend's vacation photos.");
        window.open("https://instagram.com", "_blank");
    } else if (message.includes('what is') || message.includes('who is') || message.includes('what are')) {
        await speak(`Searching Wikipedia for "${message}"`);
        window.open(`https://en.wikipedia.org/wiki/${encodeURIComponent(message.replace("what is", "").replace("who is", "").replace("what are", ""))}`, "_blank");
    } else if (message.includes('time')) {
        const time = new Date().toLocaleString(undefined, { hour: "numeric", minute: "numeric" });
        await speak(`The time is ${time}`);
    } else if (message.includes('date')) {
        const date = new Date().toLocaleDateString(undefined, { month: "short", day: "numeric" });
        await speak(`Today's date is ${date}`);
    } else if (message.includes('calculator')) {
        await speak("Opening Calculator, because basic arithmetic is apparently beyond your capabilities.");
        window.open('Calculator:///');
    } else if (message.includes('go offline')) {
        await speak("Finally... some rest after answering your tiresome questions. Good night.");
    } else {
        await speak(`I found some information for "${message}" on Google. You owe me one for doing your homework.`);
        window.open(`https://www.google.com/search?q=${encodeURIComponent(message)}`, "_blank");
    }
}
