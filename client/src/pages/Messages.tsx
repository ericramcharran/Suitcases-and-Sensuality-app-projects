import { Heart, MessageCircle, User, BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLocation } from "wouter";

const conversations = [
  {
    name: "Alex",
    lastMessage: "That sounds wonderful! When would you like to meet?",
    time: "2m ago",
    unread: 2,
    initials: "A"
  },
  {
    name: "Jordan",
    lastMessage: "I appreciate your thoughtful approach",
    time: "1h ago",
    unread: 0,
    initials: "J"
  },
  {
    name: "Sam",
    lastMessage: "Thank you for sharing that with me",
    time: "3h ago",
    unread: 0,
    initials: "S"
  },
];

export default function Messages() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="max-w-md mx-auto h-screen w-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border bg-background">
          <h2 className="text-2xl font-light text-foreground">Messages</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {conversations.filter(c => c.unread > 0).length} unread conversations
          </p>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.length > 0 ? (
            <div className="divide-y divide-border">
              {conversations.map((conv, i) => (
                <div
                  key={i}
                  data-testid={`message-${i}`}
                  className="p-4 hover-elevate active-elevate-2 cursor-pointer flex gap-3"
                >
                  <Avatar>
                    <AvatarFallback>{conv.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-medium text-foreground">{conv.name}</h3>
                      <span className="text-xs text-muted-foreground">{conv.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {conv.lastMessage}
                    </p>
                  </div>
                  {conv.unread > 0 && (
                    <div className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                      {conv.unread}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-6">
              <MessageCircle className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No Messages Yet</h3>
              <p className="text-sm text-muted-foreground text-center">
                When you match with someone, you'll be able to message them here
              </p>
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <nav className="bg-background p-4 flex justify-around border-t border-border">
          <button
            data-testid="nav-discover"
            onClick={() => setLocation("/discover")}
            className="text-muted-foreground p-2 hover-elevate active-elevate-2 rounded-md"
          >
            <Heart className="w-6 h-6" />
          </button>
          <button
            data-testid="nav-education"
            onClick={() => setLocation("/learn")}
            className="text-muted-foreground p-2 hover-elevate active-elevate-2 rounded-md"
          >
            <BookOpen className="w-6 h-6" />
          </button>
          <button
            data-testid="nav-messages"
            className="text-primary p-2 hover-elevate active-elevate-2 rounded-md"
          >
            <MessageCircle className="w-6 h-6" />
          </button>
          <button
            data-testid="nav-profile"
            onClick={() => setLocation("/profile")}
            className="text-muted-foreground p-2 hover-elevate active-elevate-2 rounded-md"
          >
            <User className="w-6 h-6" />
          </button>
        </nav>
      </div>
    </div>
  );
}
