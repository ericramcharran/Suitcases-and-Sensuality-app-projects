import { useState } from "react";
import { ChevronLeft, FileText, Calendar, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";

interface SignedDocument {
  title: string;
  signedDate: string | null;
  signature: string | null;
  content: string;
}

export default function LegalDocuments() {
  const [, setLocation] = useLocation();
  const [selectedDoc, setSelectedDoc] = useState<SignedDocument | null>(null);
  
  const userId = localStorage.getItem('userId');

  const { data: user } = useQuery<User>({
    queryKey: [`/api/users/${userId}`],
    enabled: !!userId
  });

  const documents: SignedDocument[] = [
    {
      title: "Terms of Service",
      signedDate: user?.termsSignedDate ? new Date(user.termsSignedDate).toISOString() : null,
      signature: user?.termsSignature || null,
      content: "Terms of Service Agreement"
    },
    {
      title: "Consent Framework",
      signedDate: user?.consentSignedDate ? new Date(user.consentSignedDate).toISOString() : null,
      signature: user?.consentSignature || null,
      content: "Consent Framework Agreement"
    },
    {
      title: "Privacy Policy",
      signedDate: user?.privacySignedDate ? new Date(user.privacySignedDate).toISOString() : null,
      signature: user?.privacySignature || null,
      content: "Privacy Policy Agreement"
    },
    {
      title: "Vesting Agreement",
      signedDate: user?.guidelinesSignedDate ? new Date(user.guidelinesSignedDate).toISOString() : null,
      signature: user?.guidelinesSignature || null,
      content: "Financial Vesting Agreement Timeline"
    }
  ];

  return (
    <div className="min-h-screen bg-muted p-4 sm:p-6">
      <button
        data-testid="button-back"
        onClick={() => setLocation("/settings")}
        className="mb-4 sm:mb-6 text-muted-foreground flex items-center gap-1 hover-elevate active-elevate-2 px-2 py-2 rounded-md min-h-[44px]"
      >
        <ChevronLeft className="w-5 h-5" />
        Back
      </button>

      <div className="max-w-2xl mx-auto w-full">
        <h2 className="text-2xl sm:text-3xl font-light mb-4 sm:mb-6 text-foreground">
          Legal Documents
        </h2>
        <p className="text-muted-foreground mb-6">
          View your signed legal agreements and their signatures
        </p>

        {!selectedDoc ? (
          <div className="space-y-3">
            {documents.map((doc, index) => (
              <Card
                key={index}
                data-testid={`document-${index}`}
                className="p-4 hover-elevate active-elevate-2 cursor-pointer"
                onClick={() => setSelectedDoc(doc)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground flex items-center gap-2">
                      {doc.title}
                      {doc.signature && (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      )}
                    </h3>
                    {doc.signedDate ? (
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Signed on {new Date(doc.signedDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    ) : (
                      <p className="text-sm text-yellow-600 dark:text-yellow-400">
                        Not yet signed
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div>
            <Card className="p-6 mb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-foreground">
                    {selectedDoc.title}
                  </h3>
                  {selectedDoc.signedDate && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Signed on {new Date(selectedDoc.signedDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  )}
                </div>
              </div>

              {selectedDoc.signature ? (
                <div className="mt-6">
                  <h4 className="font-medium text-foreground mb-3">Digital Signature</h4>
                  <div className="border-2 border-border rounded-lg p-4 bg-white">
                    <img 
                      src={selectedDoc.signature} 
                      alt="Digital signature" 
                      className="max-h-32 mx-auto"
                      data-testid="signature-image"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    This signature was digitally captured and timestamped
                  </p>
                </div>
              ) : (
                <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <p className="text-sm text-yellow-600 dark:text-yellow-400">
                    This document has not been signed yet.
                  </p>
                </div>
              )}
            </Card>

            <button
              data-testid="button-back-to-list"
              onClick={() => setSelectedDoc(null)}
              className="w-full"
            >
              <Card className="p-4 hover-elevate active-elevate-2 cursor-pointer text-center">
                <p className="text-foreground font-medium">Back to Documents</p>
              </Card>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
