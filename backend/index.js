import express from 'express';
import cors from 'cors';    
import dotenv from 'dotenv';
import OpenAI from 'openai';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,  
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/summarize', async(req, res) =>{
    const {text, length} = req.body;

    let instruction = "Summarize the following text into 3-5 concise sentences.";
    if (length === 'short') {
      instruction = "Summarize the following text in 1-2 short sentences.";
    } else if (length === 'long') {
      instruction = "Summarize the following text in a detailed paragraph.";
    }

    if (!text) {
        return res.status(400).json({ error: 'Text is required' });
    }
    try{
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages:[
                {role: 'system', content: "You are a helpful assistant that summarizes text."},
                {role: 'user', content: `${instruction}\n\n${text}`}
            ],});
        const summary = completion.choices[0].message.content;
        res.json({ summary });}
    catch (error) {
        console.error('Error generating summary:', error);
        res.status(500).json({ error: 'Failed to generate summary' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});