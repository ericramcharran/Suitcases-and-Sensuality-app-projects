import { Heart, MessageCircle, User, BookOpen } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";

interface Conversation {
  matchId: string;
  user: {
    id: string;
    name: string;
    profileImages: string[];
  };
  latestMessage: {
    content: string;
    createdAt: string;
  } | null;
  unreadCount: number;
  createdAt: string;
}

export default function Messages() {
  const [, setLocation] = useLocation();
  const currentUserId = sessionStorage.getItem("userId");

  const { data: conversations = [], isLoading } = useQuery<Conversation[]>({
    queryKey: ['/api/messages/conversations', currentUserId],
    enabled: !!currentUserId,
  });

  const totalUnread = conversations.filter(c => c.unreadCount > 0).length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="max-w-md mx-auto h-screen w-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border bg-background">
          <h2 className="text-2xl font-light text-foreground">Messages</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {totalUnread > 0 ? `${totalUnread} unread conversation${totalUnread > 1 ? 's' : ''}` : 'All caught up'}
          </p>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-muted-foreground">Loading conversations...</div>
            </div>
          ) : conversations.length > 0 ? (
            <div className="divide-y divide-border">
              {conversations.map((conv) => (
                <div
                  key={conv.matchId}
                  data-testid={`conversation-${conv.matchId}`}
                  onClick={() => setLocation(`/chat/${conv.matchId}`)}
                  className="p-4 hover-elevate active-elevate-2 cursor-pointer flex gap-3"
                >
                  <Avatar>
                    {conv.user.profileImages && conv.user.profileImages.length > 0 && (
                      <AvatarImage src={conv.user.profileImages[0]} alt={conv.user.name} />
                    )}
                    <AvatarFallback>
                      {conv.user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-medium text-foreground">
                        {conv.user.name}
                      </h3>
                      {conv.latestMessage && (
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(conv.latestMessage.createdAt), { addSuffix: true })}
                        </span>
                      )}
                    </div>
                    {conv.latestMessage ? (
                      <p className="text-sm text-muted-foreground truncate">
                        {conv.latestMessage.content}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        Start a conversation
                      </p>
                    )}
                  </div>
                  {conv.unreadCount > 0 && (
                    <div 
                      data-testid={`unread-count-${conv.matchId}`}
                      className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium"
                    >
                      {conv.unreadCount}
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
