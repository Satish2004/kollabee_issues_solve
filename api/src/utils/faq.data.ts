export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const faqData: FAQItem[] = [
  {
    id: "check_profile_status",
    question: "Check Profile Status",
    answer: "",
  },
  {
    id: "check_order_status",
    question: "Check Order Status",
    answer: "",
  },
  {
    id: "q1",
    question: "What is Kollabee?",
    answer:
      "Kollabee is a platform that connects buyers and suppliers, streamlining the procurement process and facilitating efficient business relationships. Our platform helps businesses find reliable partners and manage their supply chain effectively.",
  },
  {
    id: "q2",
    question: "How do I register as a supplier?",
    answer:
      'To register as a supplier on Kollabee, click on the "Join as Supplier" button on our homepage. Fill out the required information including your company details, product categories, and business credentials. Our team will review your application and get back to you within 2-3 business days.',
  },
  {
    id: "q3",
    question: "What benefits do buyers get on Kollabee?",
    answer:
      "Buyers on Kollabee enjoy several benefits including access to a verified network of suppliers, competitive pricing through our bidding system, quality assurance through our supplier rating mechanism, streamlined procurement processes, and dedicated support from our customer service team.",
  },
  {
    id: "q4",
    question: "How does Kollabee ensure supplier quality?",
    answer:
      "Kollabee implements a rigorous verification process for all suppliers. We check business credentials, conduct background checks, and continuously monitor supplier performance through buyer ratings and feedback. We also have a dispute resolution system to address any quality issues that may arise.",
  },
  {
    id: "q5",
    question: "What payment methods are supported?",
    answer:
      "Kollabee supports various payment methods including credit/debit cards, bank transfers, PayPal, and escrow services for large transactions. All payments are processed securely through our platform with encryption and fraud protection measures in place.",
  },
  {
    id: "q6",
    question: "How can I contact Kollabee support?",
    answer:
      "You can reach our support team through multiple channels: email at support@kollabee.com, live chat available on our website during business hours (9 AM - 6 PM EST), or by phone at +1-800-KOLLABEE. We typically respond to inquiries within 24 hours.",
  },
  {
    id: "q7",
    question: "Is Kollabee available internationally?",
    answer:
      "Yes, Kollabee operates globally, connecting buyers and suppliers across different countries. Our platform supports multiple languages and currencies to facilitate international trade. We also provide guidance on international shipping, customs, and compliance requirements.",
  },
];
