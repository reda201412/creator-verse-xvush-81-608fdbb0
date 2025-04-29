
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Filter, Mail, UserPlus, UserMinus, 
  ChevronDown, ArrowUpDown, MoreHorizontal, MessageSquare
} from 'lucide-react';

import ProfileNav from '@/components/ProfileNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import SubscriberStats from '@/components/subscribers/SubscriberStats';
import SubscriberFilters from '@/components/subscribers/SubscriberFilters';
import ProfileAvatar from '@/components/ProfileAvatar';

// Types for the subscriber data
type SubscriptionTier = 'standard' | 'premium' | 'vip';
type SubscriberStatus = 'active' | 'inactive' | 'pending';

interface Subscriber {
  id: string;
  name: string;
  username: string;
  avatar: string;
  email: string;
  joinedDate: string;
  tier: SubscriptionTier;
  status: SubscriberStatus;
  spending: number;
  lastActive: string;
  engagement: number; // 0-100
}

// Mock data for subscribers
const mockSubscribers: Subscriber[] = [
  {
    id: '1',
    name: 'Thomas Martin',
    username: 'thomas_m',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=250&h=250&fit=crop',
    email: 'thomas.m@example.com',
    joinedDate: '2023-01-15',
    tier: 'premium',
    status: 'active',
    spending: 124,
    lastActive: '2023-05-21',
    engagement: 87
  },
  {
    id: '2',
    name: 'Sophie Dubois',
    username: 'sophie_d',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=250&h=250&fit=crop',
    email: 'sophie.d@example.com',
    joinedDate: '2023-02-03',
    tier: 'vip',
    status: 'active',
    spending: 310,
    lastActive: '2023-05-22',
    engagement: 95
  },
  {
    id: '3',
    name: 'Lucas Petit',
    username: 'lucas_p',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&h=250&fit=crop',
    email: 'lucas.p@example.com',
    joinedDate: '2023-03-12',
    tier: 'standard',
    status: 'inactive',
    spending: 45,
    lastActive: '2023-04-30',
    engagement: 32
  },
  {
    id: '4',
    name: 'Emma Bernard',
    username: 'emma_b',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=250&h=250&fit=crop',
    email: 'emma.b@example.com',
    joinedDate: '2023-01-28',
    tier: 'premium',
    status: 'active',
    spending: 178,
    lastActive: '2023-05-20',
    engagement: 76
  },
  {
    id: '5',
    name: 'Hugo Moreau',
    username: 'hugo_m',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=250&h=250&fit=crop',
    email: 'hugo.m@example.com',
    joinedDate: '2023-04-05',
    tier: 'standard',
    status: 'pending',
    spending: 0,
    lastActive: '2023-04-05',
    engagement: 12
  },
  {
    id: '6',
    name: 'Léa Rousseau',
    username: 'lea_r',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&h=250&fit=crop',
    email: 'lea.r@example.com',
    joinedDate: '2023-02-17',
    tier: 'vip',
    status: 'active',
    spending: 289,
    lastActive: '2023-05-22',
    engagement: 91
  },
  {
    id: '7',
    name: 'Nathan Dupont',
    username: 'nathan_d',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=250&h=250&fit=crop',
    email: 'nathan.d@example.com',
    joinedDate: '2023-03-08',
    tier: 'premium',
    status: 'active',
    spending: 134,
    lastActive: '2023-05-19',
    engagement: 68
  },
  {
    id: '8',
    name: 'Camille Leroux',
    username: 'camille_l',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=250&h=250&fit=crop',
    email: 'camille.l@example.com',
    joinedDate: '2023-01-03',
    tier: 'standard',
    status: 'inactive',
    spending: 67,
    lastActive: '2023-04-12',
    engagement: 43
  }
];

const SubscribersManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [subscribers, setSubscribers] = useState<Subscriber[]>(mockSubscribers);
  const [filteredSubscribers, setFilteredSubscribers] = useState<Subscriber[]>(mockSubscribers);
  const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<keyof Subscriber | ''>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [activeFilters, setActiveFilters] = useState<{
    tier: SubscriptionTier | 'all';
    status: SubscriberStatus | 'all';
    joinedDate: string | 'all';
  }>({
    tier: 'all',
    status: 'all',
    joinedDate: 'all',
  });
  
  // Message dialog state
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [messageContent, setMessageContent] = useState('');

  // Filter subscribers based on search query and active filters
  useEffect(() => {
    let result = [...subscribers];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(sub => 
        sub.name.toLowerCase().includes(query) || 
        sub.username.toLowerCase().includes(query) ||
        sub.email.toLowerCase().includes(query)
      );
    }
    
    // Apply tier filter
    if (activeFilters.tier !== 'all') {
      result = result.filter(sub => sub.tier === activeFilters.tier);
    }
    
    // Apply status filter
    if (activeFilters.status !== 'all') {
      result = result.filter(sub => sub.status === activeFilters.status);
    }
    
    // Apply joined date filter
    if (activeFilters.joinedDate !== 'all') {
      const now = new Date();
      const monthsAgo = new Date();
      
      switch (activeFilters.joinedDate) {
        case 'last30days':
          monthsAgo.setDate(now.getDate() - 30);
          result = result.filter(sub => new Date(sub.joinedDate) >= monthsAgo);
          break;
        case 'last3months':
          monthsAgo.setMonth(now.getMonth() - 3);
          result = result.filter(sub => new Date(sub.joinedDate) >= monthsAgo);
          break;
        case 'last6months':
          monthsAgo.setMonth(now.getMonth() - 6);
          result = result.filter(sub => new Date(sub.joinedDate) >= monthsAgo);
          break;
      }
    }
    
    // Apply sorting
    if (sortColumn) {
      result = [...result].sort((a, b) => {
        const valueA = a[sortColumn];
        const valueB = b[sortColumn];
        
        if (typeof valueA === 'string' && typeof valueB === 'string') {
          return sortDirection === 'asc' 
            ? valueA.localeCompare(valueB) 
            : valueB.localeCompare(valueA);
        }
        
        // For numeric values
        if (typeof valueA === 'number' && typeof valueB === 'number') {
          return sortDirection === 'asc' 
            ? valueA - valueB 
            : valueB - valueA;
        }
        
        return 0;
      });
    }
    
    setFilteredSubscribers(result);
  }, [searchQuery, subscribers, sortColumn, sortDirection, activeFilters]);

  // Handle sorting
  const handleSort = (column: keyof Subscriber) => {
    if (sortColumn === column) {
      // Toggle direction if same column
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New column, set to asc
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Handle checkbox selection
  const handleSelectSubscriber = (id: string) => {
    setSelectedSubscribers(prev => {
      if (prev.includes(id)) {
        return prev.filter(subId => subId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedSubscribers.length === filteredSubscribers.length) {
      setSelectedSubscribers([]);
    } else {
      setSelectedSubscribers(filteredSubscribers.map(sub => sub.id));
    }
  };

  // Send message to selected subscribers
  const handleSendMessage = () => {
    if (messageContent.trim() === '') {
      toast({
        title: "Message vide",
        description: "Veuillez saisir un message avant d'envoyer.",
        variant: "destructive"
      });
      return;
    }

    const recipientCount = selectedSubscribers.length;
    
    // Close dialog and reset content
    setMessageDialogOpen(false);
    setMessageContent('');
    
    toast({
      title: "Message envoyé",
      description: `Votre message a été envoyé à ${recipientCount} abonné${recipientCount > 1 ? 's' : ''}.`,
      duration: 5000,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <ProfileNav 
        username="juliesky" 
        onBack={() => navigate('/creator')}  
      />
      
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Gestion des Abonnés</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMessageDialogOpen(true)}
              disabled={selectedSubscribers.length === 0}
            >
              <Mail size={16} className="mr-2" />
              Envoyer un message
              {selectedSubscribers.length > 0 && 
                <Badge variant="secondary" className="ml-2">
                  {selectedSubscribers.length}
                </Badge>
              }
            </Button>
          </div>
        </div>
        
        <Separator />
        
        {/* Subscriber stats overview */}
        <SubscriberStats 
          totalSubscribers={subscribers.length}
          activeSubscribers={subscribers.filter(s => s.status === 'active').length}
          premiumSubscribers={subscribers.filter(s => s.tier === 'premium').length}
          vipSubscribers={subscribers.filter(s => s.tier === 'vip').length}
          averageSpending={
            subscribers.reduce((acc, s) => acc + s.spending, 0) / subscribers.length
          }
        />
        
        {/* Search and filters */}
        <div className="flex flex-col md:flex-row gap-4 items-start justify-between">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <SubscriberFilters 
            activeFilters={activeFilters}
            onFilterChange={setActiveFilters}
          />
        </div>
        
        {/* Subscribers table */}
        <Card>
          <CardContent className="p-0 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={
                        filteredSubscribers.length > 0 && 
                        selectedSubscribers.length === filteredSubscribers.length
                      }
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead>Abonné</TableHead>
                  <TableHead 
                    className="cursor-pointer hidden md:table-cell"
                    onClick={() => handleSort('joinedDate')}
                  >
                    <div className="flex items-center">
                      Date d'abonnement
                      <ArrowUpDown size={14} className="ml-1" />
                    </div>
                  </TableHead>
                  <TableHead>Formule</TableHead>
                  <TableHead 
                    className="cursor-pointer hidden lg:table-cell"
                    onClick={() => handleSort('spending')}
                  >
                    <div className="flex items-center">
                      Dépenses
                      <ArrowUpDown size={14} className="ml-1" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hidden lg:table-cell"
                    onClick={() => handleSort('engagement')}
                  >
                    <div className="flex items-center">
                      Engagement
                      <ArrowUpDown size={14} className="ml-1" />
                    </div>
                  </TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubscribers.length > 0 ? (
                  filteredSubscribers.map(subscriber => (
                    <TableRow key={subscriber.id}>
                      <TableCell>
                        <Checkbox 
                          checked={selectedSubscribers.includes(subscriber.id)}
                          onCheckedChange={() => handleSelectSubscriber(subscriber.id)}
                          aria-label={`Select ${subscriber.name}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <ProfileAvatar 
                            src={subscriber.avatar} 
                            alt={subscriber.name}
                            size="sm"
                          />
                          <div className="flex flex-col">
                            <span className="font-medium">{subscriber.name}</span>
                            <span className="text-xs text-muted-foreground">@{subscriber.username}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {new Date(subscriber.joinedDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            subscriber.tier === 'vip' 
                              ? 'default' 
                              : subscriber.tier === 'premium' 
                                ? 'secondary' 
                                : 'outline'
                          }
                          className={
                            subscriber.tier === 'vip' 
                              ? 'bg-purple-600' 
                              : subscriber.tier === 'premium' 
                                ? 'bg-pink-500' 
                                : ''
                          }
                        >
                          {subscriber.tier === 'vip' ? 'VIP' : 
                           subscriber.tier === 'premium' ? 'Premium' : 'Standard'}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {subscriber.spending > 0 ? `${subscriber.spending}€` : '-'}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              subscriber.engagement > 75 
                                ? 'bg-green-500' 
                                : subscriber.engagement > 40 
                                  ? 'bg-amber-500' 
                                  : 'bg-red-500'
                            }`}
                            style={{ width: `${subscriber.engagement}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground mt-1">
                          {subscriber.engagement}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            subscriber.status === 'active'
                              ? 'border-green-500 text-green-600 bg-green-50 dark:bg-green-950/30'
                              : subscriber.status === 'inactive'
                              ? 'border-red-500 text-red-600 bg-red-50 dark:bg-red-950/30'
                              : 'border-amber-500 text-amber-600 bg-amber-50 dark:bg-amber-950/30'
                          }
                        >
                          {subscriber.status === 'active'
                            ? 'Actif'
                            : subscriber.status === 'inactive'
                            ? 'Inactif'
                            : 'En attente'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => {
                                setSelectedSubscribers([subscriber.id]);
                                setMessageDialogOpen(true);
                              }}
                            >
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Message privé
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <UserPlus className="mr-2 h-4 w-4" />
                              Promouvoir
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <UserMinus className="mr-2 h-4 w-4" />
                              Bloquer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex flex-col items-center text-muted-foreground">
                        <Filter className="h-10 w-10 mb-2" />
                        <p>Aucun abonné trouvé avec ces critères</p>
                        <Button 
                          variant="link" 
                          onClick={() => {
                            setSearchQuery('');
                            setActiveFilters({
                              tier: 'all',
                              status: 'all',
                              joinedDate: 'all',
                            });
                          }}
                        >
                          Réinitialiser les filtres
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      
      {/* Message dialog */}
      <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Envoyer un message</DialogTitle>
            <DialogDescription>
              Ce message sera envoyé à {selectedSubscribers.length} abonné{selectedSubscribers.length > 1 ? 's' : ''}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedSubscribers.length <= 5 && (
              <div className="flex flex-wrap gap-2">
                {selectedSubscribers.map(id => {
                  const subscriber = subscribers.find(s => s.id === id);
                  if (!subscriber) return null;
                  
                  return (
                    <div key={id} className="flex items-center gap-2 bg-muted px-2 py-1 rounded-full text-xs">
                      <ProfileAvatar src={subscriber.avatar} size="xs" />
                      <span>@{subscriber.username}</span>
                    </div>
                  );
                })}
              </div>
            )}
            
            <Textarea 
              placeholder="Écrivez votre message ici..."
              className="min-h-32"
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setMessageDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSendMessage}>
              Envoyer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscribersManagement;
