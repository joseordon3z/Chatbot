import { getGeminiResponse } from "./api.js";
import { darkModeText, lightModeText } from "./icons.js";
import { getLoadingStructure, getMessageStructure } from "./structures.js";

const form = document.querySelector("form");
const input = document.querySelector("input");
const header = document.querySelector("header");
const chatContainer = document.querySelector(".chat-container");
const scrollTarget = document.querySelector("#scroll-target");
const modeButton = document.querySelector("#mode");
const container = document.querySelector("#container");
const deleteButton = document.querySelector("#delete");

let isGeneratingResponse = false;

document.addEventListener("DOMContentLoaded", () => {
    loadDataFromLocalStorage();

    form.addEventListener("submit", submitForm);

    modeButton.addEventListener("click", toggleMode);

    deleteButton.addEventListener("click", deleteChatHistory);
});

const submitForm = async (e) => {
    e.preventDefault();

    const message = input.value.trim();
    form.reset();

    if (!message || isGeneratingResponse) return;

    sendMessage(message);
    respondLoadingMessage();
    const chatbotResponse = await getGeminiResponse(message);
    chatContainer.removeChild(chatContainer.lastChild);
    respondChatbotMessage(chatbotResponse);
};

const sendMessage = (message) => {
    isGeneratingResponse = true;
    header.classList.add("hidden");

    const div = document.createElement("div");
    div.className = "message";
    div.innerHTML = getMessageStructure(message, "./images/naruto.jpg", true);
    chatContainer.appendChild(div);
    autoScroll();
};

const respondLoadingMessage = () => {
    const div = document.createElement("div");
    div.className = "message loading";

    div.innerHTML = getLoadingStructure();
    chatContainer.appendChild(div);
    autoScroll();
};

const respondChatbotMessage = (chatbotResponse) => {
    const div = document.createElement("div");
    div.className = "message";
    div.innerHTML = getMessageStructure(chatbotResponse, "./images/gemini.svg");
    chatContainer.appendChild(div);
    isGeneratingResponse = false;
    localStorage.setItem("chat-history", chatContainer.innerHTML);
    autoScroll();
};

const autoScroll = () => {
    scrollTarget.scrollIntoView({ behavior: "smooth" });
};

const toggleMode = () => {
    const isLightMode = container.classList.contains(lightModeText);

    const currentMode = isLightMode ? darkModeText : lightModeText;
    container.className = currentMode;

    const nextMode = isLightMode ? lightModeText : darkModeText;
    modeButton.innerText = nextMode;
    localStorage.setItem("mode", currentMode);
};

const loadDataFromLocalStorage = () => {
    const savedChatHistory = localStorage.getItem("chat-history");
    const savedMode = localStorage.getItem("mode");

    const currentMode = savedMode || lightModeText;
    const nextMode =
        currentMode === lightModeText ? darkModeText : lightModeText;

    container.className = currentMode;
    modeButton.innerText = nextMode;
    chatContainer.innerHTML = savedChatHistory;
    header.classList.toggle("hidden", savedChatHistory);
    autoScroll();
};

const deleteChatHistory = () => {
    if (confirm("Are you sure you want to delete all your chats?")) {
        localStorage.removeItem("chat-history");
        loadDataFromLocalStorage();
    }
};
