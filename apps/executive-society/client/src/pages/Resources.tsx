import { useState } from "react";
import { ChevronLeft, Book, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "wouter";

interface ResourceItem {
  term: string;
  definition: string;
}

const rolesAndDynamics: ResourceItem[] = [
  {
    term: "Dominant (Dom/Domme)",
    definition: "The person who takes control in a power exchange relationship. May be referred to as Dom (typically male) or Domme (typically female). Responsible for the submissive's wellbeing and respecting negotiated boundaries."
  },
  {
    term: "submissive (sub)",
    definition: "The person who consensually surrenders control to their Dominant. This role involves trust, communication, and willingness to follow agreed-upon rules and protocols within negotiated limits."
  },
  {
    term: "Switch",
    definition: "Someone who enjoys both Dominant and submissive roles, either with different partners or at different times. Switches appreciate the full spectrum of power exchange dynamics."
  },
  {
    term: "Master/Mistress",
    definition: "A more formal or intense Dominant role, often indicating a higher protocol or 24/7 power exchange relationship. Implies significant authority and responsibility."
  },
  {
    term: "slave",
    definition: "A submissive in a Total Power Exchange (TPE) relationship where they have consensually given up most or all control to their Owner/Master/Mistress. This is an advanced dynamic requiring extensive trust and communication."
  },
  {
    term: "Top",
    definition: "The person who performs activities or 'does things to' the Bottom in a scene. A Top may or may not identify as Dominant outside of scenes."
  },
  {
    term: "Bottom",
    definition: "The person who receives activities in a scene. A Bottom may or may not identify as submissive outside of scenes."
  },
  {
    term: "24/7 or TPE (Total Power Exchange)",
    definition: "A lifestyle where the power exchange is continuous rather than limited to scenes. This advanced dynamic requires exceptional communication, trust, and mutual commitment."
  }
];

const commonKinks: ResourceItem[] = [
  {
    term: "Bondage",
    definition: "The practice of consensually restraining a partner using rope, cuffs, tape, or other materials. Ranges from light wrist ties to complex rope bondage (shibari). Safety and clear communication are essential."
  },
  {
    term: "Discipline",
    definition: "Rules, protocols, and consequences within a D/s relationship. May include training, behavioral expectations, and agreed-upon punishments or corrections."
  },
  {
    term: "Sadism/Masochism (S&M)",
    definition: "Sadism: deriving pleasure from consensually inflicting physical or psychological sensation. Masochism: deriving pleasure from receiving such sensations. These are practiced with explicit consent and negotiation."
  },
  {
    term: "Impact Play",
    definition: "Consensually striking the body for sensation and pleasure. Includes spanking, flogging, paddling, caning, and whipping. Requires knowledge of safe areas, technique, and aftercare."
  },
  {
    term: "Sensory Play",
    definition: "Activities that stimulate the senses through deprivation or enhancement. Includes blindfolds, earplugs, temperature play (ice/heat), feathers, and tactile sensations."
  },
  {
    term: "Edge Play",
    definition: "Advanced activities with higher risk, requiring extensive knowledge and experience. Examples include breath play, knife play, or fire play. Only for experienced practitioners with thorough safety knowledge."
  },
  {
    term: "Role Play",
    definition: "Adopting characters or scenarios for erotic play. Common themes include authority figures, captive/captor, age play (between consenting adults), and fantasy scenarios."
  },
  {
    term: "Pet Play",
    definition: "Role play where one person takes on the persona of an animal (puppy, kitten, pony, etc.) while another takes the handler/owner role. Can be playful, relaxing, or structured."
  },
  {
    term: "Primal Play",
    definition: "Exploring raw, instinctual desires through activities like wrestling, chasing, or growling. Often involves a predator/prey dynamic with enthusiastic physicality."
  },
  {
    term: "Exhibitionism/Voyeurism",
    definition: "Exhibitionism: deriving pleasure from being watched. Voyeurism: deriving pleasure from watching others. Must occur in appropriate, consensual environments."
  }
];

const importantConcepts: ResourceItem[] = [
  {
    term: "SSC (Safe, Sane, Consensual)",
    definition: "A foundational principle emphasizing that activities should be: Safe (risk-aware), Sane (all parties of sound mind), and Consensual (all parties freely agree)."
  },
  {
    term: "RACK (Risk-Aware Consensual Kink)",
    definition: "An alternative framework acknowledging that some activities carry inherent risk. Emphasizes informed consent with full awareness of potential dangers."
  },
  {
    term: "PRICK (Personal Responsibility, Informed Consensual Kink)",
    definition: "An extension of RACK emphasizing personal responsibility for one's choices, safety, and consequences within consensual activities."
  },
  {
    term: "Safeword",
    definition: "A pre-agreed word or signal that immediately stops all activity. Common systems include: Red (full stop), Yellow (slow down/check in), Green (continue). Essential for safe play."
  },
  {
    term: "Negotiation",
    definition: "The discussion before play where partners communicate desires, limits, boundaries, and expectations. Should cover activities, safewords, aftercare needs, and any medical or emotional considerations."
  },
  {
    term: "Hard Limits",
    definition: "Absolute boundaries that must never be crossed under any circumstances. These are non-negotiable and must be respected without question."
  },
  {
    term: "Soft Limits",
    definition: "Activities someone is hesitant about but might explore under specific circumstances with trusted partners. Require extra communication and respect."
  },
  {
    term: "Aftercare",
    definition: "The care given to all participants after a scene to address physical, emotional, and psychological needs. May include cuddling, hydration, blankets, reassurance, or medical attention. Critical for wellbeing."
  },
  {
    term: "Sub Drop / Top Drop",
    definition: "The emotional or physical low that can occur after intense scenes, caused by chemical changes in the body. Proper aftercare helps mitigate this. Can happen hours or days later."
  },
  {
    term: "Scene",
    definition: "A negotiated period of BDSM activity with defined beginning and end. May be brief or extended, simple or complex, depending on what partners have agreed upon."
  },
  {
    term: "Protocol",
    definition: "Agreed-upon rules of behavior, often in D/s relationships. Can include forms of address, positions, service requirements, or other structured expectations."
  },
  {
    term: "Consent",
    definition: "Freely given, informed, enthusiastic agreement. Can be withdrawn at any time. The cornerstone of all ethical BDSM practice. Ongoing communication ensures continued consent."
  }
];

const lifestyleTerms: ResourceItem[] = [
  {
    term: "Vanilla",
    definition: "Non-BDSM sexuality or relationships. Not a derogatory term, simply describes conventional sexual practices."
  },
  {
    term: "Kink",
    definition: "Broad term for unconventional sexual practices or preferences. Encompasses BDSM and many other alternative practices."
  },
  {
    term: "The Scene/Community",
    definition: "The collective BDSM community, including events (munches, parties, workshops), online spaces, and social groups. Provides education, support, and social connection."
  },
  {
    term: "Munch",
    definition: "A casual, public social gathering of kinky people, usually at a restaurant or café. No play occurs. Excellent for newcomers to meet the community in a low-pressure environment."
  },
  {
    term: "Play Party",
    definition: "A private event where BDSM activities occur in designated spaces. Typically requires vetting, has strict rules, and provides a safe environment for exploration."
  },
  {
    term: "Dungeon",
    definition: "A private or semi-public space equipped for BDSM activities. May include furniture, equipment, and designated play areas. Can be personal or commercial."
  },
  {
    term: "Collar",
    definition: "A symbol of commitment in D/s relationships. Training collars (trial), protection collars (temporary), and permanent collars (similar to marriage) represent different relationship stages."
  },
  {
    term: "Subspace",
    definition: "An altered state of consciousness some submissives enter during intense scenes. Characterized by euphoria, pain tolerance increase, and altered perception. Requires careful monitoring."
  },
  {
    term: "Topspace/Domspace",
    definition: "An altered state Dominants/Tops may enter during intense scenes. Characterized by heightened focus, control, and intensity. Also requires awareness and aftercare."
  }
];

export default function Resources() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  const filterItems = (items: ResourceItem[]) => {
    if (!searchTerm) return items;
    return items.filter(item => 
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const renderSection = (items: ResourceItem[]) => {
    const filtered = filterItems(items);
    
    if (filtered.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          No results found for "{searchTerm}"
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {filtered.map((item, index) => (
          <Card key={index} className="p-4 hover-elevate">
            <h3 className="font-medium text-foreground mb-2">{item.term}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.definition}</p>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <button
            data-testid="button-back"
            onClick={() => setLocation("/settings")}
            className="mb-4 text-muted-foreground flex items-center gap-1 hover-elevate active-elevate-2 px-2 py-1 rounded-md"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-primary/10 rounded-full">
              <Book className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-light text-foreground">BDSM Resources</h1>
              <p className="text-sm text-muted-foreground">Educational definitions and concepts</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              data-testid="input-search"
              type="text"
              placeholder="Search terms and definitions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-xl"
            />
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="roles" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-6">
            <TabsTrigger value="roles" data-testid="tab-roles">Roles & Dynamics</TabsTrigger>
            <TabsTrigger value="kinks" data-testid="tab-kinks">Common Kinks</TabsTrigger>
            <TabsTrigger value="concepts" data-testid="tab-concepts">Key Concepts</TabsTrigger>
            <TabsTrigger value="lifestyle" data-testid="tab-lifestyle">Lifestyle</TabsTrigger>
          </TabsList>

          <TabsContent value="roles" data-testid="content-roles">
            <div className="mb-4">
              <h2 className="text-xl font-light text-foreground mb-1">Roles & Power Dynamics</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Understanding different roles and relationship structures in BDSM
              </p>
            </div>
            {renderSection(rolesAndDynamics)}
          </TabsContent>

          <TabsContent value="kinks" data-testid="content-kinks">
            <div className="mb-4">
              <h2 className="text-xl font-light text-foreground mb-1">Common Kinks & Activities</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Popular BDSM activities and practices (always practice with consent and safety)
              </p>
            </div>
            {renderSection(commonKinks)}
          </TabsContent>

          <TabsContent value="concepts" data-testid="content-concepts">
            <div className="mb-4">
              <h2 className="text-xl font-light text-foreground mb-1">Essential Concepts</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Critical safety principles and practices for ethical BDSM
              </p>
            </div>
            {renderSection(importantConcepts)}
          </TabsContent>

          <TabsContent value="lifestyle" data-testid="content-lifestyle">
            <div className="mb-4">
              <h2 className="text-xl font-light text-foreground mb-1">Lifestyle & Community</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Terms related to the BDSM community and lifestyle
              </p>
            </div>
            {renderSection(lifestyleTerms)}
          </TabsContent>
        </Tabs>

        {/* Footer Note */}
        <Card className="p-4 mt-8 bg-muted/50">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Important:</strong> This resource is for educational purposes. 
            All BDSM activities require informed consent, clear communication, and respect for boundaries. 
            Never engage in activities without proper knowledge, negotiation, and safety precautions. 
            If you're new to BDSM, consider attending educational workshops or munches to learn from experienced community members.
          </p>
        </Card>
      </div>
    </div>
  );
}
