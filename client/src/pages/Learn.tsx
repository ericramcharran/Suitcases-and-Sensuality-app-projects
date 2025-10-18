import { useState } from "react";
import { Heart, MessageCircle, User, BookOpen, ChevronRight, ChevronLeft, Shield, AlertTriangle, Users, Lightbulb, HeartHandshake, Flag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Separator } from "@/components/ui/separator";

const educationTopics = [
  {
    id: "basics",
    icon: BookOpen,
    title: "Understanding BDSM Basics",
    description: "Core principles, terminology, and foundational concepts",
    duration: "10 min read",
    content: {
      intro: "BDSM is an umbrella term for a wide variety of consensual erotic practices involving power exchange, sensation play, and role-based dynamics.",
      sections: [
        {
          heading: "What BDSM Stands For",
          content: "BDSM encompasses Bondage & Discipline, Dominance & Submission, and Sadism & Masochism. Each element represents different aspects of consensual power exchange and sensation exploration."
        },
        {
          heading: "Core Principles",
          points: [
            "SSC (Safe, Sane, Consensual): All activities must prioritize physical and emotional safety, sound judgment, and enthusiastic consent",
            "RACK (Risk-Aware Consensual Kink): Acknowledges that all activities carry some risk, requiring informed consent and awareness",
            "PRICK (Personal Responsibility, Informed Consensual Kink): Emphasizes personal accountability and education"
          ]
        },
        {
          heading: "Common Terminology",
          points: [
            "Dominant/Dom: The person who takes control in a scene or relationship",
            "Submissive/Sub: The person who surrenders control",
            "Switch: Someone who enjoys both dominant and submissive roles",
            "Scene: A specific period of BDSM activity",
            "Safeword: A pre-agreed word that immediately stops all activity",
            "Hard Limits: Activities that are absolutely off-limits",
            "Soft Limits: Activities someone is hesitant about but might explore"
          ]
        },
        {
          heading: "It's Not About Abuse",
          content: "BDSM is fundamentally different from abuse. In BDSM, all parties enthusiastically consent, boundaries are respected, and care is prioritized. Abuse involves coercion, lack of consent, and disregard for wellbeing."
        }
      ]
    }
  },
  {
    id: "consent",
    icon: HeartHandshake,
    title: "Consent & Communication",
    description: "Essential skills for healthy power exchange relationships",
    duration: "15 min read",
    content: {
      intro: "Consent is the foundation of all BDSM activities. Without clear, enthusiastic, and ongoing consent, BDSM becomes abuse.",
      sections: [
        {
          heading: "What True Consent Looks Like",
          points: [
            "Freely Given: No coercion, pressure, or manipulation",
            "Enthusiastic: Active desire to participate, not reluctant agreement",
            "Informed: Full understanding of what will happen",
            "Specific: Consent to one activity doesn't mean consent to all",
            "Reversible: Can be withdrawn at any time for any reason"
          ]
        },
        {
          heading: "Communication Best Practices",
          points: [
            "Discuss desires, boundaries, and limits before any scene",
            "Use clear, direct language rather than hints or assumptions",
            "Check in regularly during activities",
            "Establish safewords and hand signals for non-verbal situations",
            "Debrief after scenes to discuss what worked and what didn't"
          ]
        },
        {
          heading: "The Traffic Light System",
          content: "A popular check-in method where Green means 'all good, continue,' Yellow means 'approaching my limit, slow down,' and Red means 'stop immediately.' This allows for nuanced communication during scenes."
        },
        {
          heading: "Negotiation Framework",
          points: [
            "Share your experience level honestly",
            "Discuss specific activities you're interested in or want to avoid",
            "Talk about physical and emotional triggers",
            "Agree on safewords and check-in methods",
            "Discuss aftercare needs and preferences",
            "Set time limits for the scene if desired"
          ]
        }
      ]
    }
  },
  {
    id: "safety",
    icon: Shield,
    title: "Safety & Risk Awareness",
    description: "Physical and emotional safety practices",
    duration: "12 min read",
    content: {
      intro: "BDSM activities involve inherent risks. Understanding and mitigating these risks is essential for safe, enjoyable experiences.",
      sections: [
        {
          heading: "Physical Safety Essentials",
          points: [
            "Never leave someone bound and alone",
            "Keep safety scissors nearby for quick release",
            "Avoid restricting breathing or blood flow for extended periods",
            "Learn proper techniques before trying impact play or bondage",
            "Have a first aid kit accessible",
            "Know the location of nerve clusters and vulnerable areas to avoid"
          ]
        },
        {
          heading: "Emotional Safety",
          points: [
            "Recognize that BDSM can trigger unexpected emotional responses",
            "Create a safe environment to express vulnerability",
            "Respect emotional boundaries as much as physical ones",
            "Watch for signs of subdrop or topdrop (emotional crashes after scenes)",
            "Never shame someone for using their safeword or expressing limits"
          ]
        },
        {
          heading: "Risk Mitigation Strategies",
          points: [
            "Start slowly and build intensity gradually",
            "Educate yourself through reputable resources and experienced mentors",
            "Never engage in BDSM while intoxicated",
            "Communicate about STIs and safer sex practices",
            "Have an emergency plan if something goes wrong",
            "Trust your instincts - if something feels wrong, stop"
          ]
        },
        {
          heading: "When to Seek Medical Attention",
          content: "Seek immediate medical help for loss of sensation lasting more than a few minutes, severe pain, difficulty breathing, chest pain, changes in consciousness, or any injury you're unsure about. Your health is more important than embarrassment."
        }
      ]
    }
  },
  {
    id: "negotiation",
    icon: Users,
    title: "Negotiation Techniques",
    description: "How to discuss boundaries, limits, and desires",
    duration: "8 min read",
    content: {
      intro: "Effective negotiation ensures all parties have aligned expectations and feel safe exploring together.",
      sections: [
        {
          heading: "Before the Conversation",
          points: [
            "Reflect on your own desires, boundaries, and limits",
            "Research activities you're curious about",
            "Think about what you absolutely need for a good experience",
            "Consider your emotional and physical state"
          ]
        },
        {
          heading: "The Negotiation Process",
          points: [
            "Choose a neutral, comfortable setting without time pressure",
            "Start with broader interests before getting specific",
            "Use checklists or questionnaires as conversation starters",
            "Be honest about your experience level",
            "Discuss what success looks like for this scene",
            "Talk about what happens if someone gets triggered"
          ]
        },
        {
          heading: "Key Topics to Cover",
          points: [
            "Hard and soft limits for both parties",
            "Desired intensity level and duration",
            "Specific activities that interest you",
            "Medical conditions or physical limitations",
            "Emotional triggers or past trauma",
            "Safewords and check-in methods",
            "Aftercare preferences"
          ]
        },
        {
          heading: "Ongoing Negotiation",
          content: "Negotiation doesn't end after one conversation. As relationships evolve and you gain experience, continue discussing boundaries, trying new things, and adjusting your dynamic. Regular check-ins strengthen trust and intimacy."
        }
      ]
    }
  },
  {
    id: "aftercare",
    icon: Lightbulb,
    title: "Aftercare Essentials",
    description: "Post-scene care and emotional support",
    duration: "10 min read",
    content: {
      intro: "Aftercare is the physical and emotional care given after BDSM activities. It helps partners transition back to everyday mindsets and process the experience.",
      sections: [
        {
          heading: "Why Aftercare Matters",
          content: "BDSM activities can trigger intense physical and emotional responses. The adrenaline, endorphins, and vulnerability involved can lead to sudden emotional crashes (subdrop or topdrop). Aftercare helps prevent or manage these crashes and reinforces trust and connection."
        },
        {
          heading: "Physical Aftercare",
          points: [
            "Provide water and light snacks to restore blood sugar",
            "Use blankets for warmth as body temperature may drop",
            "Apply appropriate care to any marks or tender areas",
            "Allow time to recover before resuming normal activities",
            "Check bondage sites for circulation issues"
          ]
        },
        {
          heading: "Emotional Aftercare",
          points: [
            "Offer physical affection like cuddling or holding",
            "Provide verbal reassurance and appreciation",
            "Create a calm, safe environment",
            "Allow space to process emotions without judgment",
            "Stay present and attentive to your partner's needs"
          ]
        },
        {
          heading: "Aftercare for Dominants",
          content: "Aftercare isn't just for submissives. Dominants can also experience emotional vulnerability, exhaustion, or doubt after intense scenes. They may need reassurance that they didn't go too far and appreciation for the care they provided."
        },
        {
          heading: "Long-Term Aftercare",
          points: [
            "Check in the next day via text or call",
            "Discuss the scene when both parties have processed it",
            "Address any lingering concerns or unexpected reactions",
            "Adjust future scenes based on what you learned"
          ]
        }
      ]
    }
  },
  {
    id: "red-flags",
    icon: AlertTriangle,
    title: "Red Flags & Warning Signs",
    description: "Identifying unhealthy dynamics and abuse",
    duration: "12 min read",
    content: {
      intro: "Understanding the difference between consensual BDSM and abuse is crucial for your safety. Learn to recognize warning signs and protect yourself.",
      sections: [
        {
          heading: "Major Red Flags",
          points: [
            "Pressuring you to do things you've said no to",
            "Ignoring safewords or boundaries",
            "Refusing to negotiate or discuss limits",
            "Isolating you from friends, family, or community",
            "Moving too fast or pushing for commitment immediately",
            "Claiming 'real' submissives don't have limits",
            "Using BDSM as an excuse for abusive behavior",
            "Refusing to provide aftercare or emotional support"
          ]
        },
        {
          heading: "Consent Violations",
          points: [
            "Doing things you didn't agree to during a scene",
            "Adding new activities without discussion",
            "Claiming you consented when you didn't",
            "Using coercion, guilt, or manipulation to get 'consent'",
            "Ignoring your withdrawal of consent"
          ]
        },
        {
          heading: "Abuse Disguised as BDSM",
          content: "Abusers may use BDSM terminology to justify controlling behavior. Remember: Dominance is earned through trust and care, not demanded through fear. Submission is a gift freely given, not something owed. If someone claims BDSM requires you to accept mistreatment, they're wrong."
        },
        {
          heading: "Trust Your Instincts",
          points: [
            "If something feels wrong, it probably is",
            "You don't owe anyone an explanation for your boundaries",
            "Real Dominants respect limits and prioritize your wellbeing",
            "You can withdraw consent or end a relationship at any time",
            "The BDSM community should be supportive, not judgmental"
          ]
        },
        {
          heading: "If You're in Danger",
          content: "Reach out to domestic violence resources, trusted friends, or law enforcement. BDSM does not make abuse acceptable or change the fact that you deserve help and safety. The resources below are available 24/7."
        }
      ]
    }
  },
];

export default function Learn() {
  const [, setLocation] = useLocation();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const currentTopic = educationTopics.find(t => t.id === selectedTopic);

  if (currentTopic) {
    const Icon = currentTopic.icon;
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="max-w-md mx-auto h-screen w-full flex flex-col">
          {/* Article Header */}
          <div className="p-4 border-b border-border bg-background">
            <Button
              data-testid="button-back"
              variant="ghost"
              size="sm"
              onClick={() => setSelectedTopic(null)}
              className="mb-2 -ml-2"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Resources
            </Button>
            <div className="flex items-center gap-2 mb-2">
              <Icon className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-medium text-foreground">{currentTopic.title}</h2>
            </div>
            <p className="text-sm text-muted-foreground">{currentTopic.duration}</p>
          </div>

          {/* Article Content */}
          <div className="flex-1 overflow-y-auto p-4 pb-24">
            <p className="text-foreground mb-6 leading-relaxed">{currentTopic.content.intro}</p>
            
            {currentTopic.content.sections.map((section, idx) => (
              <div key={idx} className="mb-6">
                <h3 className="text-lg font-medium text-foreground mb-3">{section.heading}</h3>
                
                {section.content && (
                  <p className="text-foreground/90 leading-relaxed mb-3">{section.content}</p>
                )}
                
                {section.points && (
                  <ul className="space-y-2">
                    {section.points.map((point, pIdx) => (
                      <li key={pIdx} className="flex gap-2 text-foreground/90">
                        <span className="text-primary mt-1.5">•</span>
                        <span className="flex-1">{point}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            <Separator className="my-6" />

            <Card className="p-4 bg-primary/10 border-primary/20">
              <h4 className="font-medium text-primary mb-2">Need Support?</h4>
              <div className="text-sm text-primary/90 space-y-1">
                <p>Sexual Assault Hotline: 1-800-656-4673</p>
                <p>Domestic Violence Hotline: 1-800-799-7233</p>
                <p>Crisis Text Line: Text HOME to 741741</p>
              </div>
            </Card>
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
              className="text-primary p-2 hover-elevate active-elevate-2 rounded-md"
            >
              <BookOpen className="w-6 h-6" />
            </button>
            <button
              data-testid="nav-messages"
              onClick={() => setLocation("/messages")}
              className="text-muted-foreground p-2 hover-elevate active-elevate-2 rounded-md"
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="max-w-md mx-auto h-screen w-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border bg-background">
          <h2 className="text-2xl font-light text-foreground">Education</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Resources for safe, informed practice
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            {educationTopics.map((topic, i) => {
              const Icon = topic.icon;
              return (
                <Card
                  key={i}
                  data-testid={`card-topic-${i}`}
                  className="p-4 hover-elevate active-elevate-2 cursor-pointer"
                  onClick={() => setSelectedTopic(topic.id)}
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex gap-3 flex-1">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground mb-1">{topic.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {topic.description}
                        </p>
                        <p className="text-xs text-muted-foreground">{topic.duration}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  </div>
                </Card>
              );
            })}
          </div>

          <Card className="p-4 mt-6 bg-primary/10 border-primary/20">
            <h4 className="font-medium text-primary mb-2">Emergency Resources</h4>
            <div className="text-sm text-primary/90 space-y-1">
              <p>Sexual Assault Hotline: 1-800-656-4673</p>
              <p>Domestic Violence Hotline: 1-800-799-7233</p>
              <p>Crisis Text Line: Text HOME to 741741</p>
            </div>
          </Card>
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
            className="text-primary p-2 hover-elevate active-elevate-2 rounded-md"
          >
            <BookOpen className="w-6 h-6" />
          </button>
          <button
            data-testid="nav-messages"
            onClick={() => setLocation("/messages")}
            className="text-muted-foreground p-2 hover-elevate active-elevate-2 rounded-md"
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
