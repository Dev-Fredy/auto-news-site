export interface Submission {
    userId: string;
    url: string;
    title: string;
    summary: string;
    rewritten: string;
    category: string;
    sentiment: string;
    factCheck: {
      isVerified: boolean;
      details: string;
    };
    tags: string[];
    status: "pending" | "approved" | "rejected";
    createdAt: Date;
  }