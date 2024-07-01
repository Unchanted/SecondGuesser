const responses = {
  link: [
    "Are you sure you want to click that link?",
    "Do you really need to visit another website right now?",
    "Is this link worth your precious time?",
    "What if this link leads to a rickroll?",
    "Are you prepared for what you might find on the other side?"
  ],
  input: [
    "Double-check what you're typing!",
    "Are you sure that's the right spelling?",
    "Maybe you should think twice before submitting that.",
    "Is that really what you want to say?",
    "Have you considered the consequences of your words?"
  ],
  video: [
    "Are you sure you want to watch this video now?",
    "Don't you have something more productive to do?",
    "Is this video really worth your time?",
    "What if this video changes your life forever?",
    "Are you prepared for the existential crisis this video might induce?"
  ],
  audio: [
    "Do you really want to listen to this right now?",
    "Is this the best soundtrack for your current activity?",
    "Are your ears ready for this?",
    "What if this song gets stuck in your head all day?",
    "Have you considered the silence option?"
  ]
};

const getRandomResponse = (category) => {
  const categoryResponses = responses[category];
  return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
};

const secondGuess = (message) => {
  const popup = document.createElement('div');
  popup.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    padding: 10px;
    z-index: 9999;
    max-width: 300px;
    font-family: Arial, sans-serif;
    font-size: 14px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    border-radius: 5px;
  `;
  popup.textContent = message;
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 3000);
};

const notifyBackgroundScript = (category) => {
  chrome.runtime.sendMessage({action: "secondGuess", category: category}, (response) => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
    } else {
      console.log("Background script notified:", response);
    }
  });
};

document.addEventListener('click', (event) => {
  if (event.target.tagName === 'A') {
    const message = getRandomResponse('link');
    secondGuess(message);
    notifyBackgroundScript('link');
  }
});

document.addEventListener('input', (event) => {
  if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
    const message = getRandomResponse('input');
    secondGuess(message);
    notifyBackgroundScript('input');
  }
});

document.addEventListener('play', (event) => {
  if (event.target.tagName === 'VIDEO') {
    const message = getRandomResponse('video');
    secondGuess(message);
    notifyBackgroundScript('video');
  } else if (event.target.tagName === 'AUDIO') {
    const message = getRandomResponse('audio');
    secondGuess(message);
    notifyBackgroundScript('audio');
  }
}, true);

console.log("Second-Guessing content script loaded");
