
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Flame } from 'lucide-react';

interface CreativeEconomyProps {
  className?: string;
}

const CreativeEconomy: React.FC<CreativeEconomyProps> = ({ className }) => {
  // Mock data for the creative economy metrics
  const metrics = [
    {
      title: "Contenu Premium",
      value: "2,457",
      description: "Nombre de contenus premium disponibles",
      icon: Sparkles,
      color: "text-amber-500"
    },
    {
      title: "Créateurs Actifs",
      value: "356",
      description: "Nombre de créateurs ayant publié ce mois-ci",
      icon: Flame,
      color: "text-red-500"
    },
    {
      title: "Transactions",
      value: "12,890",
      description: "Nombre total de transactions réalisées",
      icon: Flame,
      color: "text-green-500"
    },
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Économie Créative</CardTitle>
        <CardDescription>Aperçu de l'activité économique de la plateforme</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {metrics.map((metric, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center gap-2">
                <metric.icon className={`h-4 w-4 ${metric.color}`} />
                <h3 className="text-sm font-medium">{metric.title}</h3>
              </div>
              <p className="text-2xl font-bold">{metric.value}</p>
              <p className="text-xs text-muted-foreground">{metric.description}</p>
            </div>
          ))}
        </div>
        
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Rejoignez l'économie créative et commencez à monétiser votre contenu!
          </p>
          <Badge variant="secondary">En savoir plus</Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreativeEconomy;
