import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import OpenAI from 'openai'

dotenv.config()

// Make sure OPENKEY is set in your .env (and on Render)
console.log('OPENKEY present?', !!process.env.OPENKEY)

const openai = new OpenAI({
  apiKey: process.env.OPENKEY,
})

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from!',
  })
})

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // ← modern, cheap, supported model
      messages: [
        {
          role: 'system',
          content: 'You are a helpful coding assistant.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0,
      max_tokens: 700,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    })

    res.status(200).send({
      bot: response.choices[0].message.content,
    })
  } catch (error) {
    console.error('Error calling OpenAI:')

    // Log the actual API error details if available
    if (error.response) {
      console.error('Status:', error.response.status)
      console.error('Data:', error.response.data)
      res.status(error.response.status).send(error.response.data)
    } else {
      console.error(error.message || error)
      res.status(500).send(error.message || 'Something went wrong')
    }
  }
})

app.listen(5000, () =>
  console.log('AI server started on http://localhost:5000'),
)
