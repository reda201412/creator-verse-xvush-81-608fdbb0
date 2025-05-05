
export interface Creator {
  id: string;
  name: string;
  avatar: string;
  growth: number;
  supporters: number;
  returnsHistory: number[];
  returnsRate: number;
  popularity: number;
  tags: string[];
  isRising: boolean;
}

export interface Investment {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  amount: number;
  tokensInvested: number;
  date: string;
  returns: number;
  growth: number;
  status: 'active' | 'completed' | 'pending';
}
