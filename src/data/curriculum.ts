export type Card = {
  id: string;
  title: string;
  content: string;
  formula?: string;
  example?: string;
};

export type Lesson = {
  id: string;
  title: string;
  description: string;
  cards: Card[];
  unlockScoreThreshold: number; // minimum score required in previous quiz
};

export type QuestionType = 'multiple_choice' | 'true_false' | 'fill_in_the_blank';

export type Question = {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[];
  correctAnswer: string | boolean;
  explanation: string;
};

export type Quiz = {
  id: string;
  lessonId: string;
  questions: Question[];
};

export const LESSONS: Lesson[] = [
  {
    id: 'l1',
    title: 'What is a Financial Market?',
    description: 'The foundation of modern trading. Understand how buyers and sellers connect.',
    unlockScoreThreshold: 0,
    cards: [
      {
        id: 'l1_c1',
        title: 'The Marketplace',
        content: 'A financial market is simply a place where buyers and sellers trade assets like stocks, bonds, and currencies.',
        example: 'Like a farmer\'s market, but instead of apples, you buy shares of Apple.'
      },
      {
        id: 'l1_c2',
        title: 'Liquidity',
        content: 'Liquidity refers to how easily an asset can be converted into cash without affecting its price. High liquidity means easy trading.',
      }
    ]
  },
  {
    id: 'l2',
    title: 'Understanding Stocks',
    description: 'Owning a piece of the pie. What it means to hold shares in a company.',
    unlockScoreThreshold: 70, // 70% in quiz 1
    cards: [
      {
        id: 'l2_c1',
        title: 'Equities',
        content: 'A stock (or equity) represents a fraction of ownership in a corporation. When you buy a stock, you become a partial owner.',
      },
      {
        id: 'l2_c2',
        title: 'Market Capitalization',
        content: 'The total value of a company\'s outstanding shares of stock.',
        formula: 'Market Cap = Current Share Price × Total Outstanding Shares'
      }
    ]
  },
  {
    id: 'l3',
    title: 'Bonds & Fixed Income',
    description: 'Lending your money for steady returns. How debt instruments work.',
    unlockScoreThreshold: 70,
    cards: [
      {
        id: 'l3_c1',
        title: 'What is a Bond?',
        content: 'A bond is a fixed-income instrument representing a loan made by an investor to a borrower (typically corporate or governmental).',
      },
      {
        id: 'l3_c2',
        title: 'Yield to Maturity (YTM)',
        content: 'The estimated annual rate of return an investor can expect if the bond is held until it matures.'
      }
    ]
  },
  {
    id: 'l4',
    title: 'Options & Derivatives',
    description: 'Contracts that derive value from an underlying asset. Calls, Puts, and leverage.',
    unlockScoreThreshold: 70,
    cards: [
      {
        id: 'l4_c1',
        title: 'Derivatives',
        content: 'A derivative is a contract between two or more parties whose value is based on an agreed-upon underlying financial asset. Common forms are Options and Futures.',
      },
      {
        id: 'l4_c2',
        title: 'Call vs Put Option',
        content: 'A Call option gives you the RIGHT TO BUY an asset at a specific price. A Put option gives you the RIGHT TO SELL it.',
        example: 'If you think AAPL will go up, you buy a Call option.'
      }
    ]
  },
  {
    id: 'l5',
    title: 'Black-Scholes Intuition',
    description: 'The mathematical model that revolutionized options pricing.',
    unlockScoreThreshold: 70,
    cards: [
      {
        id: 'l5_c1',
        title: 'The Black-Scholes Model',
        content: 'A pricing model used to determine the fair price or theoretical value for a call or a put option based on factors like volatility, type of option, strike price, and time to expiration.',
      },
      {
        id: 'l5_c2',
        title: 'The Greeks',
        content: 'Sensitivities of the option\'s price to various variables: Delta (price), Gamma (Delta rate of change), Theta (time decay), Vega (volatility), and Rho (interest rates).',
      }
    ]
  }
];

export const QUIZZES: Quiz[] = [
  {
    id: 'q1',
    lessonId: 'l1',
    questions: [
      {
        id: 'q1_1',
        text: 'A financial market is primarily a place where:',
        type: 'multiple_choice',
        options: ['Goods are consumed', 'Buyers and sellers trade assets', 'Money is printed', 'Taxes are collected'],
        correctAnswer: 'Buyers and sellers trade assets',
        explanation: 'Financial markets facilitate the exchange of financial assets like stocks and bonds.'
      },
      {
        id: 'q1_2',
        text: 'Liquidity means you can quickly convert an asset into cash without affecting its price.',
        type: 'true_false',
        correctAnswer: true,
        explanation: 'Highly liquid markets (like large stocks) allow large trades with minimal price impact.'
      }
    ]
  },
  {
    id: 'q2',
    lessonId: 'l2',
    questions: [
      {
        id: 'q2_1',
        text: 'Owning a stock means you own a fraction of a _____',
        type: 'fill_in_the_blank',
        correctAnswer: 'corporation',
        explanation: 'Stocks represent equity (ownership) in a corporation or company.'
      },
      {
        id: 'q2_2',
        text: 'How is Market Capitalization calculated?',
        type: 'multiple_choice',
        options: ['Assets minus Liabilities', 'Price per Share × Total Outstanding Shares', 'Total Revenue × Profit Margin'],
        correctAnswer: 'Price per Share × Total Outstanding Shares',
        explanation: 'Market Cap measures the total market value of a company\'s equity.'
      }
    ]
  },
  {
    id: 'q3',
    lessonId: 'l3',
    questions: [
      {
        id: 'q3_1',
        text: 'A bond is essentially a conditional grant given to a company.',
        type: 'true_false',
        correctAnswer: false,
        explanation: 'A bond is a LOAN structure where you are the lender, not a grant.'
      },
      {
        id: 'q3_2',
        text: 'What does YTM stand for?',
        type: 'multiple_choice',
        options: ['Yearly Total Margin', 'Yield to Maturity', 'Year To Market'],
        correctAnswer: 'Yield to Maturity',
        explanation: 'YTM represents the anticipated return on a bond held to maturity.'
      }
    ]
  },
  {
    id: 'q4',
    lessonId: 'l4',
    questions: [
      {
        id: 'q4_1',
        text: 'A Call option gives you the right to _____ the underlying asset.',
        type: 'fill_in_the_blank',
        correctAnswer: 'buy',
        explanation: 'Call = right to buy. Put = right to sell.'
      },
      {
        id: 'q4_2',
        text: 'Derivatives have intrinsic value regardless of their underlying asset.',
        type: 'true_false',
        correctAnswer: false,
        explanation: 'Derivatives DERIVE their value strictly from the underlying asset.'
      }
    ]
  },
  {
    id: 'q5',
    lessonId: 'l5',
    questions: [
      {
        id: 'q5_1',
        text: 'Which "Greek" measures the sensitivity of an option\'s price relative to the underlying asset\'s price?',
        type: 'multiple_choice',
        options: ['Delta', 'Vega', 'Theta', 'Gamma'],
        correctAnswer: 'Delta',
        explanation: 'Delta specifically measures price sensitivity.'
      },
      {
        id: 'q5_2',
        text: 'Theta represents the time decay of an options contract.',
        type: 'true_false',
        correctAnswer: true,
        explanation: 'As expiration approaches, the extrinsic value of an option decreases, modeled by Theta.'
      }
    ]
  }
];
