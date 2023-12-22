const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

// Axios instance for OpenAI API
const openai = axios.create({
    baseURL: "https://api.openai.com/v1",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
});

// Function to create chat completion with GPT-4
async function createChatCompletion(messages, options = {}) {
    try {
        const response = await openai.post("/chat/completions", {
            model: options.model || "gpt-4",
            messages,
            ...options,
        });
        console.log(response.data);
        return response.data.choices;
    } catch (error) {
        console.error("Error creating chat completion:", error);
    }
}

app.post('/generateSong', async (req, res) => {
    const { name, year } = req.body;

    const messages = [{
        role: "system",
        content: `
        Write a holiday song that celebrates the achievements and pride of Iowa State University's College of Design graduates, includes the name '${name}'and multiple events of the year ${year} including: 
        - A notable sports accomplishment from ${year}.
        - The title of a famous pop song from ${year}.
        - A renowned design or product that made headlines in ${year}.
        - A movie blockbuster of year ${year}.
        Please avoid any controversial topics related to politics, terrorism, religion, or race.
        Don't use scatological terms.
        Never use the word hawkeye.
    `
    }];

    const options = {
        temperature: 0.7,
        max_tokens: 500,
    };

    const choices = await createChatCompletion(messages, options);

    if (choices && choices.length > 0) {
        const firstChoice = choices[0];
        if (firstChoice.message && 'content' in firstChoice.message) {
            res.json({ song: firstChoice.message.content }); // Correctly send the song text
        } else {
            res.status(500).send('Error generating song: No content');
        }
    } else {
        res.status(500).send('Error generating song: No choices');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
