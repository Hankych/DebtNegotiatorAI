# CollectWise AI Debt Negotiator

A Next.js application that provides an AI-powered debt negotiation interface, helping users establish manageable payment plans.

## Features

- Interactive chat interface with AI debt negotiation assistant
- Support for multiple payment frequencies (monthly, biweekly, weekly)
- Real-time payment plan generation
- Secure payment processing integration
- Modern, responsive UI with loading states and animations

## Prerequisites

- Node.js 18.x or higher
- npm
- OpenAI API key

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd CollectWise-TakeHome
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your OpenAI API key:
```
OPENAI_API_KEY=your_api_key_here
```

## Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
CollectWise-TakeHome/
├── src/
│   ├── app/
│   │   ├── api/         # API routes
│   │   ├── layout.tsx   # Root layout
│   │   └── page.tsx     # Home page
│   ├── components/      # React components
│   ├── styles/         # CSS modules
│   ├── types/          # TypeScript types
│   └── utils/          # Utility functions
├── public/            # Static assets
├── .env.local        # Environment variables
├── package.json
└── README.md
```

## Key Assumptions

1. Payment URL Generation:
   - The payment URL must include `termLength` parameter which is strictly one of:
     - "monthly"
     - "biweekly"
     - "weekly"
   - This frequency information is essential for payment processing
