export interface News {
    _id: string;
    title: string;
    summary: string;
    rewritten: string;
    category: string;
    source: string;
    url: string;
    factCheck: {
      isVerified: boolean;
      details: string;
    };
    sentiment: string;
    tags: string[];
    createdAt: Date;
    views: number;
  }