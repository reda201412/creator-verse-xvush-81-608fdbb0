
import SubscriptionTier from './SubscriptionTier';
import { cn } from '@/lib/utils';

interface SubscriptionPanelProps {
  className?: string;
  onSubscribe?: (tier: string) => void;
}

const SubscriptionPanel = ({ className, onSubscribe }: SubscriptionPanelProps) => {
  const handleSubscribe = (tier: string) => {
    if (onSubscribe) {
      onSubscribe(tier);
    }
  };

  return (
    <div className={cn("glass-card rounded-xl p-5", className)}>
      <h2 className="text-xl font-semibold mb-5">Rejoignez l'univers exclusif</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SubscriptionTier 
          name="Fan"
          price={7}
          features={[
            "Accès à tout le contenu standard",
            "Messages privés (réponse sous 48h)",
            "Contenu exclusif hebdomadaire"
          ]}
          discountInfo="7 jours d'essai à $1"
          buttonLabel="Devenir Fan"
          onSubscribe={() => handleSubscribe('fan')}
        />
        
        <SubscriptionTier 
          name="Super-Fan"
          price={19}
          features={[
            "Tout le contenu Fan +",
            "Sessions live hebdomadaires",
            "Réponses prioritaires (sous 24h)",
            "Contenu personnalisé mensuel"
          ]}
          discountInfo="Économisez 15% sur 3 mois"
          buttonLabel="Devenir Super-Fan"
          popular={true}
          onSubscribe={() => handleSubscribe('superfan')}
        />
        
        <SubscriptionTier 
          name="VIP"
          price={49}
          features={[
            "Tout le contenu Super-Fan +",
            "Contenu sur demande mensuel",
            "Réponses garanties sous 6h",
            "Accès à l'archive complète",
            "Cadeaux trimestriels"
          ]}
          discountInfo="Économisez 25% sur 12 mois"
          buttonLabel="Devenir VIP"
          onSubscribe={() => handleSubscribe('vip')}
        />
      </div>
    </div>
  );
};

export default SubscriptionPanel;
