import { useState, useEffect, useRef, useMemo } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ArrowLeft, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { formatDistanceToNow } from "date-fns";

interface Message {
  id: string;
  matchId: string;
  senderId: string;
  receiverId: string;
  content: string;
  read: boolean;
  createdAt: string;
}

interface Match {
  id: string;
  userId: string;
  targetUserId: string;
}

export default function Chat() {
  const [, params] = useRoute("/chat/:matchId");
  const [, setLocation] = useLocation();
  const matchId = params?.matchId;
  const currentUserId = localStorage.getItem("userId");
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // Fetch match details
  const { data: match, isLoading: isLoadingMatch } = useQuery<Match>({
    queryKey: [`/api/matches/${matchId}`],
    enabled: !!matchId,
  });

  // Get the other user's ID from the match (handle both directions)
  // Use useMemo to prevent flip-flopping on re-renders
  const otherUserId = useMemo(() => {
    if (!match || !currentUserId) return null;
    
    if (match.userId === currentUserId) {
      return match.targetUserId;
    } else if (match.targetUserId === currentUserId) {
      return match.userId;
    }
    return null;
  }, [match, currentUserId]);

  // Fetch messages for this match
  const { data: messages = [], isLoading } = useQuery<Message[]>({
    queryKey: ['/api/messages', matchId],
    enabled: !!matchId,
  });

  interface UserData {
    id: string;
    name: string;
    profileName?: string;
    profileImages: string[];
    role: string;
  }

  const { data: otherUser } = useQuery<UserData>({
    queryKey: ['/api/users', otherUserId],
    enabled: !!otherUserId,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!matchId || !currentUserId || !otherUserId) {
        throw new Error("Missing required data");
      }

      const res = await apiRequest('POST', '/api/messages', {
        matchId,
        senderId: currentUserId,
        receiverId: otherUserId,
        content,
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/messages', matchId] });
      queryClient.invalidateQueries({ queryKey: ['/api/messages/conversations', currentUserId] });
      setMessageText("");
    },
  });

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Track which messages we've already marked as read to avoid redundant API calls
  const markedAsReadRef = useRef<Set<string>>(new Set());

  // Mark unread messages as read
  useEffect(() => {
    const unreadMessages = messages.filter(
      msg => msg.receiverId === currentUserId && !msg.read && !markedAsReadRef.current.has(msg.id)
    );

    unreadMessages.forEach(async (msg) => {
      try {
        await apiRequest('PATCH', `/api/messages/${msg.id}/read`);
        // Only add to Set after successful API call
        markedAsReadRef.current.add(msg.id);
      } catch (error) {
        console.error('Failed to mark message as read:', error);
        // Don't add to Set on failure, allowing retry on next render
      }
    });
  }, [messages, currentUserId]);

  // WebSocket connection for real-time messages
  useEffect(() => {
    if (!currentUserId) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}?userId=${currentUserId}`);
    wsRef.current = ws;

    ws.onopen = () => {
      // WebSocket connected
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'new_message' && data.data.matchId === matchId) {
        queryClient.invalidateQueries({ queryKey: ['/api/messages', matchId] });
        queryClient.invalidateQueries({ queryKey: ['/api/messages/conversations', currentUserId] });
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, [currentUserId, matchId]);

  const handleSend = () => {
    if (!messageText.trim()) return;
    sendMessageMutation.mutate(messageText);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isLoading || isLoadingMatch) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading conversation...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="max-w-md mx-auto h-screen w-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border bg-background flex items-center gap-3">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setLocation("/messages")}
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          {otherUser && (
            <>
              <Avatar>
                {otherUser.profileImages && otherUser.profileImages.length > 0 && (
                  <AvatarImage src={otherUser.profileImages[0]} alt={otherUser.profileName || otherUser.name} />
                )}
                <AvatarFallback>
                  {(otherUser.profileName || otherUser.name).split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="font-medium text-foreground">
                  {otherUser.profileName || otherUser.name}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {otherUser.role}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground text-center">
                No messages yet. Start the conversation!
              </p>
            </div>
          ) : (
            messages.map((message, index) => {
              const isCurrentUser = message.senderId === currentUserId;
              const showTimestamp = 
                index === 0 || 
                new Date(message.createdAt).getTime() - new Date(messages[index - 1].createdAt).getTime() > 300000; // 5 minutes

              return (
                <div key={message.id}>
                  {showTimestamp && (
                    <div className="text-center text-xs text-muted-foreground mb-2">
                      {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                    </div>
                  )}
                  <div
                    className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                    data-testid={`message-${message.id}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                        isCurrentUser
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {message.content}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-border bg-background">
          <div className="flex gap-2 items-end">
            <Textarea
              ref={textareaRef}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="resize-none min-h-[44px] max-h-[120px]"
              rows={1}
              data-testid="input-message"
            />
            <Button
              onClick={handleSend}
              disabled={!messageText.trim() || sendMessageMutation.isPending || !otherUserId}
              size="icon"
              data-testid="button-send"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
