const API_KEY_ARRAY = ["AIzaSyCUrRy", "_RvjgqyIPqifxq", "i5pl3nMgi3P8RE"];

const API_Key = API_KEY_ARRAY.join("");

const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_Key}`;

export const getGeminiResponse = async (message) => {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "applications/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: message }] }],
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error.message);
        }

        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        alert(error.message);
    }
};
