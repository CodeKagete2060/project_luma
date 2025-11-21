import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

export const aiController = {
  async generateResponse(req, res) {
    try {
      const { prompt, context } = req.body;

      if (!prompt) {
        return res.status(400).json({ message: 'Prompt is required' });
      }

      const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `${context ? context + '\n\n' : ''}${prompt}`,
        max_tokens: 2000,
        temperature: 0.7,
      });

      const response = completion.data.choices[0].text.trim();
      
      res.json({ response });
    } catch (error) {
      console.error('AI generation error:', error);
      res.status(500).json({ 
        message: 'Error generating AI response',
        error: error.response?.data?.error || error.message 
      });
    }
  },

  async analyzeAssignment(req, res) {
    try {
      const { assignmentText } = req.body;

      if (!assignmentText) {
        return res.status(400).json({ message: 'Assignment text is required' });
      }

      const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `Analyze this assignment and provide feedback:\n\n${assignmentText}`,
        max_tokens: 1000,
        temperature: 0.5,
      });

      const analysis = completion.data.choices[0].text.trim();
      
      res.json({ analysis });
    } catch (error) {
      console.error('Assignment analysis error:', error);
      res.status(500).json({ 
        message: 'Error analyzing assignment',
        error: error.response?.data?.error || error.message 
      });
    }
  }
};