
import React from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type SubscriptionTier = 'standard' | 'premium' | 'vip';
type SubscriberStatus = 'active' | 'inactive' | 'pending';

interface SubscriberFiltersProps {
  activeFilters: {
    tier: SubscriptionTier | 'all';
    status: SubscriberStatus | 'all';
    joinedDate: string | 'all';
  };
  onFilterChange: (filters: {
    tier: SubscriptionTier | 'all';
    status: SubscriberStatus | 'all';
    joinedDate: string | 'all';
  }) => void;
}

const SubscriberFilters = ({ activeFilters, onFilterChange }: SubscriberFiltersProps) => {
  const activeFilterCount = Object.values(activeFilters).filter(val => val !== 'all').length;
  
  const resetFilters = () => {
    onFilterChange({
      tier: 'all',
      status: 'all',
      joinedDate: 'all'
    });
  };
  
  const getFilterLabel = (filter: keyof typeof activeFilters): string => {
    switch (filter) {
      case 'tier':
        if (activeFilters.tier === 'all') return 'Tous';
        if (activeFilters.tier === 'standard') return 'Standard';
        if (activeFilters.tier === 'premium') return 'Premium';
        return 'VIP';
      
      case 'status':
        if (activeFilters.status === 'all') return 'Tous';
        if (activeFilters.status === 'active') return 'Actifs';
        if (activeFilters.status === 'inactive') return 'Inactifs';
        return 'En attente';
      
      case 'joinedDate':
        if (activeFilters.joinedDate === 'all') return 'Tous';
        if (activeFilters.joinedDate === 'last30days') return '30 derniers jours';
        if (activeFilters.joinedDate === 'last3months') return '3 derniers mois';
        return '6 derniers mois';
    }
  };
  
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-9">
            <Filter className="mr-2 h-4 w-4" />
            Filtres
            {activeFilterCount > 0 && (
              <Badge 
                className="ml-2 bg-primary text-primary-foreground" 
                variant="default"
              >
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Filtrer les abonnés</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
              Formule
            </DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={activeFilters.tier}
              onValueChange={(value) => 
                onFilterChange({ ...activeFilters, tier: value as SubscriptionTier | 'all' })
              }
            >
              <DropdownMenuRadioItem value="all">Tous</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="standard">Standard</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="premium">Premium</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="vip">VIP</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuGroup>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
              Statut
            </DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={activeFilters.status}
              onValueChange={(value) =>
                onFilterChange({ ...activeFilters, status: value as SubscriberStatus | 'all' })
              }
            >
              <DropdownMenuRadioItem value="all">Tous</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="active">Actifs</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="inactive">Inactifs</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="pending">En attente</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuGroup>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
              Date d'abonnement
            </DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={activeFilters.joinedDate}
              onValueChange={(value) =>
                onFilterChange({ ...activeFilters, joinedDate: value })
              }
            >
              <DropdownMenuRadioItem value="all">Tous</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="last30days">30 derniers jours</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="last3months">3 derniers mois</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="last6months">6 derniers mois</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Active filter badges */}
      {activeFilters.tier !== 'all' && (
        <Badge variant="outline" className="flex items-center gap-1">
          Formule: {getFilterLabel('tier')}
          <Button
            variant="ghost"
            size="icon"
            className="h-3 w-3 p-0 ml-1"
            onClick={() => onFilterChange({ ...activeFilters, tier: 'all' })}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}
      
      {activeFilters.status !== 'all' && (
        <Badge variant="outline" className="flex items-center gap-1">
          Statut: {getFilterLabel('status')}
          <Button
            variant="ghost"
            size="icon"
            className="h-3 w-3 p-0 ml-1"
            onClick={() => onFilterChange({ ...activeFilters, status: 'all' })}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}
      
      {activeFilters.joinedDate !== 'all' && (
        <Badge variant="outline" className="flex items-center gap-1">
          Période: {getFilterLabel('joinedDate')}
          <Button
            variant="ghost"
            size="icon"
            className="h-3 w-3 p-0 ml-1"
            onClick={() => onFilterChange({ ...activeFilters, joinedDate: 'all' })}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}
      
      {activeFilterCount > 0 && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 px-2 text-xs"
          onClick={resetFilters}
        >
          Réinitialiser
        </Button>
      )}
    </div>
  );
};

export default SubscriberFilters;
