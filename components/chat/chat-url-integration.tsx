"use client";

import React, { useState, useCallback } from "react";
import {
  Link,
  Copy,
  Share,
  QrCode,
  Code,
  ExternalLink,
  Check,
  X,
  Sparkles,
  Zap,
} from "@tabler/icons-react";
import {
  ChatUrlBuilder,
  ChatSharer,
  ChatTemplates,
} from "../../lib/utils/chat-url-utils";
import { useFusionSync } from "../../context/fusion-sync-context";
import { motion, AnimatePresence } from "framer-motion";

interface ChatUrlIntegrationProps {
  prompt?: string;
  conversationId?: string;
  className?: string;
  showTemplates?: boolean;
  showQRCode?: boolean;
  showEmbed?: boolean;
}

export const ChatUrlIntegration = ({
  prompt = "",
  conversationId,
  className = "",
  showTemplates = true,
  showQRCode = false,
  showEmbed = false,
}: ChatUrlIntegrationProps) => {
  const { broadcastEvent } = useFusionSync();
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [sharedSuccessfully, setSharedSuccessfully] = useState(false);
  const [showUrlBuilder, setShowUrlBuilder] = useState(false);
  const [customPrompt, setCustomPrompt] = useState(prompt);
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [embedCode, setEmbedCode] = useState("");

  // Generate shareable URL
  const generateUrl = useCallback(
    (promptText: string = customPrompt) => {
      const url = new ChatUrlBuilder()
        .setPrompt(promptText)
        .setConversationId(conversationId || "")
        .setSource("url-integration")
        .build();

      setGeneratedUrl(url);

      broadcastEvent(
        "dashboard-action",
        {
          action: "chat-url-generated",
          prompt: promptText,
          conversationId,
          url,
        },
        "chat-url-integration",
      );

      return url;
    },
    [customPrompt, conversationId, broadcastEvent],
  );

  // Copy URL to clipboard
  const copyUrl = useCallback(
    async (urlToCopy?: string) => {
      const url = urlToCopy || generateUrl();

      try {
        await navigator.clipboard.writeText(url);
        setCopiedUrl(true);
        setTimeout(() => setCopiedUrl(false), 2000);

        broadcastEvent(
          "dashboard-action",
          {
            action: "chat-url-copied",
            url,
            prompt: customPrompt,
          },
          "chat-url-integration",
        );
      } catch (error) {
        console.error("Failed to copy URL:", error);
      }
    },
    [generateUrl, broadcastEvent, customPrompt],
  );

  // Share URL
  const shareUrl = useCallback(
    async (promptText: string = customPrompt) => {
      try {
        const success = await ChatSharer.shareViaUrl(promptText, {
          title: "SaintSal™ AI Chat",
          text: `Let's chat about: "${promptText.substring(0, 80)}..."`,
        });

        if (success) {
          setSharedSuccessfully(true);
          setTimeout(() => setSharedSuccessfully(false), 2000);

          broadcastEvent(
            "dashboard-action",
            {
              action: "chat-url-shared",
              prompt: promptText,
              method: "native-share",
            },
            "chat-url-integration",
          );
        }
      } catch (error) {
        console.error("Failed to share URL:", error);
      }
    },
    [customPrompt, broadcastEvent],
  );

  // Generate QR code
  const generateQR = useCallback(() => {
    const qrUrl = ChatSharer.generateQRCode(customPrompt);
    setShowQR(true);

    broadcastEvent(
      "dashboard-action",
      {
        action: "qr-code-generated",
        prompt: customPrompt,
      },
      "chat-url-integration",
    );

    return qrUrl;
  }, [customPrompt, broadcastEvent]);

  // Generate embed code
  const generateEmbed = useCallback(() => {
    const embed = ChatSharer.generateEmbedCode(customPrompt, {
      width: 400,
      height: 600,
      theme: "dark",
    });
    setEmbedCode(embed);

    broadcastEvent(
      "dashboard-action",
      {
        action: "embed-code-generated",
        prompt: customPrompt,
      },
      "chat-url-integration",
    );

    return embed;
  }, [customPrompt, broadcastEvent]);

  // Use template
  const useTemplate = useCallback(
    (templateFunction: () => string, templateName: string) => {
      const templateUrl = templateFunction();
      const fullUrl = `${window.location.origin}${templateUrl}`;
      copyUrl(fullUrl);

      broadcastEvent(
        "dashboard-action",
        {
          action: "template-used",
          template: templateName,
          url: fullUrl,
        },
        "chat-url-integration",
      );
    },
    [copyUrl, broadcastEvent],
  );

  return (
    <div className={`chat-url-integration ${className}`}>
      {/* Main URL Controls */}
      <div className="url-controls">
        <div className="controls-header">
          <div className="header-icon">
            <Link className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="controls-title">Share AI Chat</h3>
          <button
            onClick={() => setShowUrlBuilder(!showUrlBuilder)}
            className="toggle-builder"
          >
            {showUrlBuilder ? (
              <X className="w-4 h-4" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <button
            onClick={() => copyUrl()}
            className={`quick-action ${copiedUrl ? "success" : ""}`}
            disabled={!customPrompt.trim()}
          >
            {copiedUrl ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            {copiedUrl ? "Copied!" : "Copy URL"}
          </button>

          <button
            onClick={() => shareUrl()}
            className={`quick-action ${sharedSuccessfully ? "success" : ""}`}
            disabled={!customPrompt.trim()}
          >
            {sharedSuccessfully ? (
              <Check className="w-4 h-4" />
            ) : (
              <Share className="w-4 h-4" />
            )}
            {sharedSuccessfully ? "Shared!" : "Share"}
          </button>

          {showQRCode && (
            <button
              onClick={generateQR}
              className="quick-action"
              disabled={!customPrompt.trim()}
            >
              <QrCode className="w-4 h-4" />
              QR Code
            </button>
          )}

          {showEmbed && (
            <button
              onClick={generateEmbed}
              className="quick-action"
              disabled={!customPrompt.trim()}
            >
              <Code className="w-4 h-4" />
              Embed
            </button>
          )}
        </div>
      </div>

      {/* URL Builder */}
      <AnimatePresence>
        {showUrlBuilder && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="url-builder"
          >
            <div className="builder-content">
              <div className="input-group">
                <label className="input-label">Custom Prompt</label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Enter your AI prompt here..."
                  className="prompt-input"
                  rows={3}
                />
              </div>

              {generatedUrl && (
                <div className="generated-url">
                  <label className="input-label">Generated URL</label>
                  <div className="url-display">
                    <input
                      type="text"
                      value={generatedUrl}
                      readOnly
                      className="url-input"
                    />
                    <button
                      onClick={() => copyUrl(generatedUrl)}
                      className="copy-btn"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={() => generateUrl()}
                className="generate-btn"
                disabled={!customPrompt.trim()}
              >
                <Zap className="w-4 h-4" />
                Generate URL
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Templates */}
      {showTemplates && (
        <div className="chat-templates">
          <div className="templates-header">
            <h4 className="templates-title">Quick Templates</h4>
            <span className="templates-subtitle">Click to copy URL</span>
          </div>
          <div className="templates-grid">
            <button
              onClick={() =>
                useTemplate(
                  () => ChatTemplates.businessIdeas(),
                  "business-ideas",
                )
              }
              className="template-item"
            >
              <div className="template-icon">💡</div>
              <span className="template-text">Business Ideas</span>
            </button>

            <button
              onClick={() =>
                useTemplate(
                  () => ChatTemplates.marketingStrategy(),
                  "marketing-strategy",
                )
              }
              className="template-item"
            >
              <div className="template-icon">📈</div>
              <span className="template-text">Marketing Strategy</span>
            </button>

            <button
              onClick={() =>
                useTemplate(() => ChatTemplates.emailWriting(), "email-writing")
              }
              className="template-item"
            >
              <div className="template-icon">✉️</div>
              <span className="template-text">Email Writing</span>
            </button>

            <button
              onClick={() =>
                useTemplate(
                  () => ChatTemplates.explainConcept(),
                  "explain-concept",
                )
              }
              className="template-item"
            >
              <div className="template-icon">🧠</div>
              <span className="template-text">Explain Topics</span>
            </button>

            <button
              onClick={() =>
                useTemplate(
                  () => ChatTemplates.problemSolving(),
                  "problem-solving",
                )
              }
              className="template-item"
            >
              <div className="template-icon">🔧</div>
              <span className="template-text">Problem Solving</span>
            </button>

            <button
              onClick={() =>
                useTemplate(
                  () => ChatTemplates.contentCreation(),
                  "content-creation",
                )
              }
              className="template-item"
            >
              <div className="template-icon">✨</div>
              <span className="template-text">Content Creation</span>
            </button>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      <AnimatePresence>
        {showQR && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={() => setShowQR(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="qr-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h4>QR Code for Chat</h4>
                <button onClick={() => setShowQR(false)}>
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="qr-content">
                <img
                  src={generateQR()}
                  alt="QR Code for chat URL"
                  className="qr-image"
                />
                <p className="qr-description">
                  Scan this QR code to start the conversation
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .chat-url-integration {
          background: rgba(24, 24, 27, 0.5);
          border: 1px solid rgba(253, 255, 220, 0.2);
          border-radius: 12px;
          padding: 20px;
          font-family:
            Inter,
            -apple-system,
            Roboto,
            Helvetica,
            sans-serif;
        }

        .url-controls {
          margin-bottom: 20px;
        }

        .controls-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }

        .header-icon {
          flex-shrink: 0;
        }

        .controls-title {
          flex: 1;
          font-size: 16px;
          font-weight: 600;
          color: #fdffdc;
          margin: 0;
        }

        .toggle-builder {
          padding: 4px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          color: #a1a1aa;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .toggle-builder:hover {
          background: rgba(255, 255, 255, 0.2);
          color: #fdffdc;
        }

        .quick-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .quick-action {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 8px;
          color: #3b82f6;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .quick-action:hover:not(:disabled) {
          background: rgba(59, 130, 246, 0.2);
          border-color: rgba(59, 130, 246, 0.5);
        }

        .quick-action:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .quick-action.success {
          background: rgba(34, 197, 94, 0.1);
          border-color: rgba(34, 197, 94, 0.3);
          color: #22c55e;
        }

        .url-builder {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 20px;
        }

        .builder-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .input-label {
          font-size: 12px;
          font-weight: 500;
          color: #a1a1aa;
        }

        .prompt-input {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          padding: 8px 12px;
          color: #fdffdc;
          font-size: 14px;
          resize: vertical;
          min-height: 60px;
        }

        .prompt-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        }

        .generated-url {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .url-display {
          display: flex;
          gap: 8px;
        }

        .url-input {
          flex: 1;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          padding: 8px 12px;
          color: #e5e7eb;
          font-size: 13px;
          font-family: monospace;
        }

        .copy-btn {
          padding: 8px;
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 6px;
          color: #3b82f6;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .copy-btn:hover {
          background: rgba(59, 130, 246, 0.2);
        }

        .generate-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 16px;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          border: none;
          border-radius: 8px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .generate-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .generate-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .chat-templates {
          border-top: 1px solid rgba(253, 255, 220, 0.1);
          padding-top: 20px;
        }

        .templates-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .templates-title {
          font-size: 14px;
          font-weight: 600;
          color: #fdffdc;
          margin: 0;
        }

        .templates-subtitle {
          font-size: 12px;
          color: #6b7280;
        }

        .templates-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 8px;
        }

        .template-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          color: #e5e7eb;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .template-item:hover {
          border-color: rgba(253, 255, 220, 0.3);
          background: rgba(253, 255, 220, 0.05);
        }

        .template-icon {
          font-size: 14px;
          flex-shrink: 0;
        }

        .template-text {
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .qr-modal {
          background: rgba(24, 24, 27, 0.95);
          border: 1px solid rgba(253, 255, 220, 0.2);
          border-radius: 12px;
          padding: 24px;
          max-width: 300px;
          width: 90%;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .modal-header h4 {
          color: #fdffdc;
          font-size: 16px;
          font-weight: 600;
          margin: 0;
        }

        .modal-header button {
          padding: 4px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          color: #a1a1aa;
          cursor: pointer;
        }

        .qr-content {
          text-align: center;
        }

        .qr-image {
          width: 200px;
          height: 200px;
          border-radius: 8px;
          margin-bottom: 12px;
        }

        .qr-description {
          color: #a1a1aa;
          font-size: 14px;
          margin: 0;
        }

        /* Mobile responsiveness */
        @media (max-width: 640px) {
          .templates-grid {
            grid-template-columns: 1fr;
          }

          .quick-actions {
            flex-direction: column;
          }

          .url-display {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default ChatUrlIntegration;
