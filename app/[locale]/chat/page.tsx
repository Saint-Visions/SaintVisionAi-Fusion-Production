"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AuthProvider } from "../../../context/auth-context";
import { FusionSyncProvider } from "../../../context/fusion-sync-context";
import { AuthenticatedMobileLayout } from "../../../components/mobile/authenticated-mobile-layout";
import { useAuth } from "../../../context/auth-context";
import {
  useFusionSync,
  useAIContextSync,
} from "../../../context/fusion-sync-context";
import { DualAIAssistant } from "../../../components/ai/dual-ai-assistant";
import { CompanionCard } from "../../../components/ai/companion-card";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  Send,
  Bot,
  Sparkles,
  Link,
  Copy,
  Share,
  ExternalLink,
  RefreshCw,
  Zap,
} from "@tabler/icons-react";
import { ChatUrlIntegration } from "../../../components/chat/chat-url-integration";

interface ChatPageProps {
  params: {
    locale: string;
  };
  searchParams: Record<string, string>;
}

function ChatInterface() {
  const { userProfile } = useAuth();
  const { broadcastEvent } = useFusionSync();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [urlPrompt, setUrlPrompt] = useState<string>("");
  const [isProcessingUrlPrompt, setIsProcessingUrlPrompt] = useState(false);
  const [conversationId, setConversationId] = useState<string>("");
  const [shareableUrl, setShareableUrl] = useState<string>("");

  // AI Context Sync
  const { aiContext, updateAIContext } = useAIContextSync(conversationId);

  // Extract prompt from URL parameters
  useEffect(() => {
    const prompt = searchParams.get("prompt");
    if (prompt) {
      const decodedPrompt = decodeURIComponent(prompt);
      setUrlPrompt(decodedPrompt);
      setIsProcessingUrlPrompt(true);

      // Generate conversation ID for this chat session
      const newConversationId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setConversationId(newConversationId);

      // Broadcast chat initiation event
      broadcastEvent(
        "ai-interaction",
        {
          action: "chat-initiated-from-url",
          prompt: decodedPrompt,
          conversationId: newConversationId,
          userPlan: userProfile?.plan,
        },
        "chat-page",
      );

      // Auto-process the URL prompt after component loads
      setTimeout(() => {
        processUrlPrompt(decodedPrompt, newConversationId);
      }, 1000);
    } else {
      // Generate conversation ID for regular chat
      const newConversationId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setConversationId(newConversationId);
    }
  }, [searchParams, userProfile, broadcastEvent]);

  const processUrlPrompt = useCallback(
    async (prompt: string, convId: string) => {
      setIsProcessingUrlPrompt(true);

      try {
        // Update AI context with URL prompt
        updateAIContext({
          initialPrompt: prompt,
          source: "url-parameter",
          timestamp: new Date(),
          userPlan: userProfile?.plan,
        });

        // Broadcast processing event
        broadcastEvent(
          "ai-interaction",
          {
            action: "processing-url-prompt",
            prompt,
            conversationId: convId,
            userPlan: userProfile?.plan,
          },
          "chat-page",
        );

        // Simulate processing delay
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (error) {
        console.error("Error processing URL prompt:", error);
      } finally {
        setIsProcessingUrlPrompt(false);
      }
    },
    [updateAIContext, userProfile, broadcastEvent],
  );

  const generateShareableUrl = useCallback((prompt: string) => {
    const baseUrl = window.location.origin;
    const chatUrl = `${baseUrl}/chat?prompt=${encodeURIComponent(prompt)}`;
    setShareableUrl(chatUrl);
    return chatUrl;
  }, []);

  const copyShareableUrl = useCallback(
    async (prompt: string) => {
      const url = generateShareableUrl(prompt);
      try {
        await navigator.clipboard.writeText(url);
        broadcastEvent(
          "dashboard-action",
          {
            action: "url-copied",
            url,
            conversationId,
          },
          "chat-page",
        );
      } catch (error) {
        console.error("Failed to copy URL:", error);
      }
    },
    [generateShareableUrl, broadcastEvent, conversationId],
  );

  const shareChat = useCallback(
    async (prompt: string) => {
      const url = generateShareableUrl(prompt);

      if (navigator.share) {
        try {
          await navigator.share({
            title: "SaintSal™ AI Chat",
            text: `Check out this AI conversation: "${prompt.substring(0, 100)}..."`,
            url: url,
          });
        } catch (error) {
          // Fallback to copy
          copyShareableUrl(prompt);
        }
      } else {
        copyShareableUrl(prompt);
      }
    },
    [generateShareableUrl, copyShareableUrl],
  );

  const startNewChat = useCallback(() => {
    const newConversationId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setConversationId(newConversationId);
    setUrlPrompt("");
    setIsProcessingUrlPrompt(false);

    // Clear URL parameters
    router.push("/chat");

    broadcastEvent(
      "ai-interaction",
      {
        action: "new-chat-started",
        conversationId: newConversationId,
        userPlan: userProfile?.plan,
      },
      "chat-page",
    );
  }, [router, broadcastEvent, userProfile]);

  return (
    <div className="chat-interface">
      {/* Chat Header */}
      <div className="chat-header">
        <div className="header-content">
          <div className="header-left">
            <div className="chat-title">
              <MessageCircle className="w-6 h-6 text-blue-400" />
              <h1>AI Chat</h1>
              <div className="plan-badge">{userProfile?.plan || "FREE"}</div>
            </div>
            {urlPrompt && (
              <div className="url-prompt-indicator">
                <Link className="w-4 h-4 text-yellow-400" />
                <span>Started from URL prompt</span>
              </div>
            )}
          </div>

          <div className="header-actions">
            <button
              onClick={startNewChat}
              className="action-btn"
              title="New Chat"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            {shareableUrl && (
              <button
                onClick={() => copyShareableUrl(urlPrompt)}
                className="action-btn"
                title="Copy Shareable URL"
              >
                <Copy className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* URL Prompt Processing Banner */}
      <AnimatePresence>
        {isProcessingUrlPrompt && urlPrompt && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="processing-banner"
          >
            <div className="banner-content">
              <div className="processing-icon">
                <Zap className="w-5 h-5 animate-pulse text-yellow-400" />
              </div>
              <div className="processing-text">
                <div className="processing-title">Processing URL prompt...</div>
                <div className="processing-prompt">"{urlPrompt}"</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Assistant Area */}
      <div className="ai-assistant-area">
        {userProfile?.plan === "FREE" ? (
          <div className="companion-wrapper">
            <CompanionCard className="chat-companion" />
            {urlPrompt && !isProcessingUrlPrompt && (
              <div className="url-prompt-display">
                <div className="prompt-header">
                  <span className="prompt-label">URL Prompt:</span>
                  <button
                    onClick={() => shareChat(urlPrompt)}
                    className="share-btn"
                  >
                    <Share className="w-3 h-3" />
                  </button>
                </div>
                <div className="prompt-content">"{urlPrompt}"</div>
                <div className="prompt-notice">
                  Upgrade to PRO for full AI chat capabilities with this prompt!
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="dual-ai-wrapper">
            <DualAIAssistant />
            {urlPrompt && (
              <div className="url-prompt-context">
                <div className="context-header">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  <span>URL Context</span>
                </div>
                <div className="context-content">
                  <div className="context-prompt">"{urlPrompt}"</div>
                  <div className="context-actions">
                    <button
                      onClick={() => shareChat(urlPrompt)}
                      className="context-action"
                    >
                      <Share className="w-3 h-3" />
                      Share
                    </button>
                    <button
                      onClick={() => copyShareableUrl(urlPrompt)}
                      className="context-action"
                    >
                      <Copy className="w-3 h-3" />
                      Copy URL
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* URL Integration */}
      <div className="url-integration-section">
        <ChatUrlIntegration
          prompt={urlPrompt}
          conversationId={conversationId}
          showTemplates={true}
          showQRCode={userProfile?.plan !== "FREE"}
          showEmbed={userProfile?.plan === "ENTERPRISE"}
        />
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <div className="actions-header">
          <h3>Quick Actions</h3>
        </div>
        <div className="actions-grid">
          <button
            className="quick-action"
            onClick={() => {
              const url = generateShareableUrl(
                "Help me brainstorm business ideas",
              );
              router.push(url.replace(window.location.origin, ""));
            }}
          >
            <Bot className="w-4 h-4" />
            Business Ideas
          </button>
          <button
            className="quick-action"
            onClick={() => {
              const url = generateShareableUrl("Analyze my marketing strategy");
              router.push(url.replace(window.location.origin, ""));
            }}
          >
            <Sparkles className="w-4 h-4" />
            Marketing Analysis
          </button>
          <button
            className="quick-action"
            onClick={() => {
              const url = generateShareableUrl("Write a professional email");
              router.push(url.replace(window.location.origin, ""));
            }}
          >
            <Send className="w-4 h-4" />
            Email Writing
          </button>
          <button
            className="quick-action"
            onClick={() => {
              const url = generateShareableUrl("Explain complex topics simply");
              router.push(url.replace(window.location.origin, ""));
            }}
          >
            <MessageCircle className="w-4 h-4" />
            Explain Topics
          </button>
        </div>
      </div>

      <style jsx>{`
        .chat-interface {
          min-height: 100vh;
          background: linear-gradient(
            135deg,
            rgba(0, 0, 0, 1) 0%,
            rgba(24, 24, 27, 1) 100%
          );
          color: white;
          font-family:
            Inter,
            -apple-system,
            Roboto,
            Helvetica,
            sans-serif;
        }

        .chat-header {
          padding: 20px;
          border-bottom: 1px solid rgba(253, 255, 220, 0.1);
          background: rgba(24, 24, 27, 0.5);
          backdrop-filter: blur(8px);
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-left {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .chat-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .chat-title h1 {
          font-size: 24px;
          font-weight: 700;
          color: #fdffdc;
          margin: 0;
        }

        .plan-badge {
          background: linear-gradient(45deg, #10b981, #059669);
          color: white;
          font-size: 12px;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 6px;
        }

        .url-prompt-indicator {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: #f59e0b;
        }

        .header-actions {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          padding: 8px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: #a1a1aa;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .action-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          color: #fdffdc;
        }

        .processing-banner {
          background: linear-gradient(
            135deg,
            rgba(245, 158, 11, 0.1),
            rgba(251, 191, 36, 0.1)
          );
          border: 1px solid rgba(245, 158, 11, 0.3);
          border-radius: 0;
          padding: 16px 20px;
        }

        .banner-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .processing-icon {
          flex-shrink: 0;
        }

        .processing-text {
          flex: 1;
        }

        .processing-title {
          font-size: 14px;
          font-weight: 600;
          color: #f59e0b;
          margin-bottom: 4px;
        }

        .processing-prompt {
          font-size: 13px;
          color: #a1a1aa;
          font-style: italic;
        }

        .ai-assistant-area {
          padding: 40px 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .companion-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
        }

        .chat-companion {
          max-width: 500px;
        }

        .url-prompt-display {
          width: 100%;
          max-width: 600px;
          background: rgba(24, 24, 27, 0.5);
          border: 1px solid rgba(253, 255, 220, 0.2);
          border-radius: 12px;
          padding: 20px;
        }

        .prompt-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .prompt-label {
          font-size: 14px;
          font-weight: 600;
          color: #fdffdc;
        }

        .share-btn {
          padding: 4px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          color: #a1a1aa;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .share-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          color: #fdffdc;
        }

        .prompt-content {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          padding: 12px;
          color: #e5e7eb;
          font-style: italic;
          margin-bottom: 12px;
        }

        .prompt-notice {
          font-size: 12px;
          color: #f59e0b;
          text-align: center;
          padding: 8px;
          background: rgba(245, 158, 11, 0.1);
          border-radius: 6px;
        }

        .dual-ai-wrapper {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .url-integration-section {
          padding: 40px 20px;
          background: rgba(24, 24, 27, 0.2);
          border-top: 1px solid rgba(253, 255, 220, 0.1);
          border-bottom: 1px solid rgba(253, 255, 220, 0.1);
        }

        .url-integration-section > :global(div) {
          max-width: 1200px;
          margin: 0 auto;
        }

        .url-prompt-context {
          background: rgba(24, 24, 27, 0.5);
          border: 1px solid rgba(253, 255, 220, 0.2);
          border-radius: 12px;
          padding: 16px;
        }

        .context-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          color: #fdffdc;
          font-weight: 600;
          font-size: 14px;
        }

        .context-content {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .context-prompt {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          padding: 12px;
          color: #e5e7eb;
          font-style: italic;
        }

        .context-actions {
          display: flex;
          gap: 8px;
        }

        .context-action {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 6px 12px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          color: #a1a1aa;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .context-action:hover {
          background: rgba(255, 255, 255, 0.2);
          color: #fdffdc;
        }

        .quick-actions {
          padding: 40px 20px;
          background: rgba(24, 24, 27, 0.3);
        }

        .actions-header {
          max-width: 1200px;
          margin: 0 auto 24px;
        }

        .actions-header h3 {
          color: #fdffdc;
          font-size: 20px;
          font-weight: 600;
          margin: 0;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .quick-action {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 16px;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(253, 255, 220, 0.1);
          border-radius: 12px;
          color: #e5e7eb;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .quick-action:hover {
          border-color: rgba(253, 255, 220, 0.3);
          background: rgba(253, 255, 220, 0.05);
          transform: translateY(-2px);
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .chat-header {
            padding: 16px;
          }

          .header-content {
            flex-direction: column;
            gap: 12px;
            align-items: stretch;
          }

          .ai-assistant-area {
            padding: 24px 16px;
          }

          .quick-actions {
            padding: 24px 16px;
          }

          .actions-grid {
            grid-template-columns: 1fr;
          }

          .dual-ai-wrapper {
            gap: 16px;
          }
        }
      `}</style>
    </div>
  );
}

export default function ChatPage(props: ChatPageProps) {
  return (
    <AuthProvider>
      <FusionSyncProvider>
        <AuthenticatedMobileLayout
          showDashboard={true}
          dashboardPosition="left"
          builderModel="chat-layout"
          enableSlots={true}
          className="chat-page-layout"
          slots={{
            header: "chat-header-slot",
            sidebar: "chat-sidebar-slot",
            main: "chat-main-slot",
            footer: "chat-footer-slot",
            overlay: "chat-overlay-slot",
          }}
        >
          <ChatInterface />
        </AuthenticatedMobileLayout>
      </FusionSyncProvider>
    </AuthProvider>
  );
}
