# DSA Learning Assistant

A sophisticated chat application designed to provide guided assistance for data structures and algorithms (DSA) problems. This application helps users understand and solve LeetCode problems by offering hints, explanations, and intuition-building guidance without revealing complete solutions.

<img width="1000" alt="Screenshot 2025-03-02 at 5 57 11 PM" src="https://github.com/user-attachments/assets/63f0c2a2-ac33-441b-bfae-a10e133e7848" />

<img width="1710" alt="Screenshot 2025-03-02 at 5 58 29 PM" src="https://github.com/user-attachments/assets/50970d2f-f692-48d8-ba16-b9cfb977d1e9" />

## 🚀 Features

- **Guided Learning**: Get hints and partial explanations instead of complete solutions
- **LeetCode Integration**: Submit any LeetCode problem URL and ask specific questions about it
- **Real-time Response Streaming**: Watch as responses are generated word by word
- **Syntax Highlighting**: Code snippets are properly formatted with syntax highlighting
- **Light/Dark Mode**: Choose your preferred theme or use system settings
- **Responsive Design**: Works seamlessly on both desktop and mobile devices
- **Google Authentication**: Secure access with Google Sign-In

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TailwindCSS
- **UI Components**: shadcn/ui
- **Authentication**: NextAuth.js with Google provider
- **AI Integration**: Google Gemini AI API
- **Styling**: TailwindCSS with custom theming
- **Markdown Rendering**: React Markdown with syntax highlighting

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)
- Google Cloud Platform account for OAuth credentials
- Google Gemini API key

## 🔧 Installation

1. **Clone the repository**

```bash
git clone https://github.com/enggsatyamraj/scaler_task.git
cd scaler_task
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory with the following variables:

```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_GEMINI_API_KEY=your_gemini_api_key
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

> **Note**: You can also use OpenAI API by adding `OPENAI_API_KEY=your_openai_api_key` if preferred.

4. **Run the development server**

```bash
npm run dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000) to use the application.

## 🏗️ Project Architecture

### Directory Structure

```
scaler/
├── public/                # Static assets
├── src/
│   ├── app/               # Next.js app router
│   │   ├── api/           # API routes
│   │   │   ├── auth/      # Authentication endpoints
│   │   │   ├── chat/      # Regular chat endpoint
│   │   │   └── chat-stream/ # Streaming chat endpoint
│   │   ├── globals.css    # Global styles
│   │   ├── layout.js      # Root layout
│   │   └── page.js        # Home page
│   ├── components/        # React components
│   │   ├── ui/            # UI components from shadcn/ui
│   │   └── ...            # Custom components
│   └── lib/               # Utility functions and services
│       ├── gemini-service.js  # Google Gemini API integration
│       ├── openai-service.js  # OpenAI API integration (alternative)
│       ├── prompt-templates.js # Prompt engineering templates
│       └── utils.js       # Helper functions
└── .env.local             # Environment variables
```

### Key Components

- **ChatInterface**: Main chat UI with message handling and streaming
- **MessageList**: Displays chat messages with proper formatting
- **MarkdownContent**: Renders AI responses with Markdown and code highlighting
- **LeetcodeInput**: Allows users to input LeetCode problem URLs
- **ThemeProvider**: Manages application theming (light/dark mode)

## 🔄 How It Works

1. **Authentication Flow**:
   - User signs in with Google credentials
   - NextAuth.js handles the OAuth flow and session management

2. **Chat Flow**:
   - User submits a LeetCode problem URL
   - User asks a question about the problem
   - Question is sent to the API along with the context
   - AI generates a response that guides without solving
   - Response is streamed back word-by-word for a better UX

3. **AI Integration**:
   - Carefully crafted prompts ensure the AI provides guidance without solutions
   - Context is maintained throughout the conversation
   - Streaming responses provide a more interactive experience

## 📝 API Endpoints

- **POST /api/chat**: Regular (non-streaming) chat endpoint
- **POST /api/chat-stream**: Streaming chat endpoint for real-time responses
- **GET/POST /api/auth/[...nextauth]**: NextAuth.js authentication endpoints

## 🎨 Theming

The application supports three theme modes:
- **Light**: Clean, bright interface
- **Dark**: Eye-friendly dark interface
- **System**: Automatically matches your system preferences

## 🧠 Prompt Engineering

The application uses sophisticated prompt engineering to:
- Guide users without revealing complete solutions
- Provide progressive hints based on user questions
- Explain DSA concepts relevant to the problem
- Generate dry runs and examples when requested

## 🚀 Deployment

### Vercel (Recommended)

The easiest way to deploy is using Vercel:

1. Push your code to a GitHub repository
2. Import the project to Vercel
3. Configure the environment variables
4. Deploy

### Other Platforms

You can also deploy to other platforms like Netlify, Railway, or your own server. Make sure to:
- Set up the proper build command: `npm run build`
- Configure environment variables
- Set the output directory to `.next`

## 🛣️ Roadmap

- [ ] Add support for code execution
- [ ] Implement problem difficulty filtering
- [ ] Create a dashboard for tracking progress
- [ ] Add support for more coding platforms
- [ ] Implement user feedback system

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 💬 Acknowledgements

- [Next.js](https://nextjs.org/) for the React framework
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [TailwindCSS](https://tailwindcss.com/) for the styling
- [NextAuth.js](https://next-auth.js.org/) for authentication
- [Google Gemini AI](https://ai.google.dev/) for the AI capabilities

---

Made with ❤️ by [Satyam Raj](https://github.com/enggsatyamraj)

For more information, visit the [GitHub repository](https://github.com/enggsatyamraj/scaler_task).
