
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, Plus, Users, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

// Mock events data
const mockEvents = [
  {
    id: 1,
    title: 'Session photo spéciale',
    date: new Date(2025, 3, 15),
    time: '20:00',
    type: 'premium',
    attendees: 18,
  },
  {
    id: 2,
    title: 'Live Q&A',
    date: new Date(2025, 3, 18),
    time: '19:30',
    type: 'standard',
    attendees: 42,
  },
  {
    id: 3,
    title: 'Cours privé',
    date: new Date(2025, 3, 21),
    time: '18:00',
    type: 'vip',
    attendees: 3,
  },
  {
    id: 4,
    title: 'Séance dédicace',
    date: new Date(2025, 3, 28),
    time: '17:00',
    type: 'standard',
    attendees: 25,
  }
];

const CalendarView = () => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState(mockEvents);

  // Get events for the selected date
  const selectedDateEvents = events.filter(
    event => date && event.date.toDateString() === date.toDateString()
  );

  const handleAddEvent = () => {
    toast({
      title: "Créer un événement",
      description: "La fonction d'ajout d'événement sera bientôt disponible",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold mb-2">Calendrier</h1>
            <p className="text-muted-foreground">Planifiez et gérez vos événements à venir</p>
          </div>
          <Button onClick={handleAddEvent}>
            <Plus size={16} className="mr-1" />
            Nouvel événement
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarDays size={18} className="mr-2" />
                  Calendrier
                </CardTitle>
                <CardDescription>Sélectionnez une date</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                  modifiers={{
                    booked: events.map(event => event.date),
                  }}
                  modifiersStyles={{
                    booked: { 
                      fontWeight: "bold",
                      backgroundColor: "hsl(var(--primary) / 0.1)",
                      color: "hsl(var(--primary))"
                    }
                  }}
                />
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Événements du {date?.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</CardTitle>
                <CardDescription>
                  {selectedDateEvents.length === 0 
                    ? "Pas d'événements prévus ce jour" 
                    : `${selectedDateEvents.length} événement${selectedDateEvents.length > 1 ? 's' : ''} prévu${selectedDateEvents.length > 1 ? 's' : ''}`
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedDateEvents.map(event => (
                    <div 
                      key={event.id} 
                      className={cn(
                        "p-4 border rounded-lg flex flex-col md:flex-row justify-between",
                        event.type === 'premium' && "border-xvush-pink/30 bg-xvush-pink/5",
                        event.type === 'vip' && "border-xvush-gold/30 bg-xvush-gold/5",
                        event.type === 'standard' && "border-blue-400/30 bg-blue-400/5"
                      )}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{event.title}</h3>
                          <span className={cn(
                            "text-xs px-2 py-0.5 rounded-full",
                            event.type === 'premium' && "bg-xvush-pink text-white",
                            event.type === 'vip' && "bg-xvush-gold text-black",
                            event.type === 'standard' && "bg-blue-400 text-white"
                          )}>
                            {event.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <Clock size={14} className="mr-1" />
                            {event.time}
                          </span>
                          <span className="flex items-center">
                            <Users size={14} className="mr-1" />
                            {event.attendees} inscrit{event.attendees > 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 md:mt-0">
                        <Button size="sm" variant="outline">Gérer</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              {selectedDateEvents.length === 0 && (
                <CardFooter>
                  <Button 
                    onClick={handleAddEvent} 
                    variant="outline"
                    className="w-full"
                  >
                    <Plus size={16} className="mr-2" />
                    Ajouter un événement ce jour
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
