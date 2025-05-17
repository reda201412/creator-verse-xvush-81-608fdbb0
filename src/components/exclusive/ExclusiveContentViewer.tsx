import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface ExclusiveContentViewerProps {
  content: string;
}

const ExclusiveContentViewer: React.FC<ExclusiveContentViewerProps> = ({ content }) => {
  const [hasAccess, setHasAccess] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contenu Exclusif</CardTitle>
      </CardHeader>
      <CardContent>
        {hasAccess ? (
          <p>{content}</p>
        ) : (
          <p>Ce contenu est réservé aux abonnés. Abonnez-vous pour y accéder !</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ExclusiveContentViewer;
