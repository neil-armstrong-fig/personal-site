import type {FaqEntry} from "@src/pages/about/_components/faq/types/FaqEntry";

// Plain text on purpose: the FAQPage structured data must match the visible answers exactly.
export const faqEntries: readonly FaqEntry[] = [
  {
    question: "What do you do?",
    answer:
      "I’m a software architect and developer in Belfast. I build TypeScript, React, and AWS serverless products and lead the teams doing it, while staying close to the code and the pipelines.",
  },
  {
    question: "Do you work on new products or on legacy systems?",
    answer:
      "Both. I’ve taken new products to production quickly, including a full motor-insurance journey on AWS serverless in twelve months. I’ve also replaced an end-of-life document editor in a single summer and got a time-critical PHP modernisation back on track.",
  },
  {
    question: "What is your technical stack?",
    answer:
      "React and TypeScript on the front end. Node.js, Kotlin, C#, and Java on the back end. On AWS I use Lambda, DynamoDB, RDS, EventBridge, and API Gateway, with CDK or Terraform. For testing it’s Playwright and acceptance tests written as readable domain-specific languages.",
  },
  {
    question: "How do you use AI in your work?",
    answer:
      "I use AI-native practices to speed up and improve delivery, while the person is still accountable for every decision and result. Acceptance tests are how I check that nothing has regressed.",
  },
  {
    question: "Where are you based, and would you relocate?",
    answer: "I’m in Belfast, Northern Ireland, and open to relocation. I have the right to work in the UK and the EU.",
  },
  {
    question: "Are you available for work?",
    answer:
      "It changes over time, so ask and I’ll tell you where it stands. I’m open to conversations about interesting work.",
  },
  {
    question: "What is the best way to contact you?",
    answer: "Message me on LinkedIn. The contact page has a form too, and I’m happy to send my CV on request.",
  },
  {
    question: "That’s some serious cycling!",
    answer:
      "Yep. It’s my counterweight to software. Nothing resets you from a computer screen like a big cycle trip. My solo trips are written up in the cycling section, with maps and photos for those interested.",
  },
];
