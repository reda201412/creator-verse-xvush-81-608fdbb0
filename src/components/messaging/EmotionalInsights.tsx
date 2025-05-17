
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Message } from '@/types/messaging';

interface EmotionalInsightProps {
  messages?: Message[];
}

const EmotionalInsights: React.FC<EmotionalInsightProps> = ({ messages }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Emotional Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Analyze conversation emotional patterns</p>
        {messages?.length ? (
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">
              {messages.length} messages analyzed
            </p>
            {/* Analysis content would go here */}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No messages to analyze</p>
        )}
      </CardContent>
    </Card>
  );
};

export default EmotionalInsights;
