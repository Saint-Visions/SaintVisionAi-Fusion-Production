"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  Send,
  Bot,
  Sparkles,
  Zap,
  Settings,
  RotateCcw,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Minimize2,
  Maximize2,
} from "@tabler/icons-react";
import { useAuth } from "@/context/auth-context";
import { motion, AnimatePresence } from "framer-motion";
import { streamFromAPI, simulateStreaming } from "@/lib/utils/streaming-utils";
import { BotActivationTransform } from "./bot-activation-transform";
import {
  SaintSalAIAvatar,
  SaintSalBossAvatar,
} from "../branding/saintsol-headshot";
import { useBossMode, detectBossMode } from "../../lib/utils/boss-mode";
import {
  useMobileDetection,
  addHapticFeedback,
} from "../../lib/utils/mobile-utils";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  aiModel: "primary" | "secondary";
  timestamp: Date;
  tokens?: number;
}

interface DualResponse {
  primary: string;
  secondary: string;
  comparison?: string;
}

export const DualAIAssistant = () => {
  const { userProfile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<
    "primary" | "secondary" | "both"
  >("both");
  const [isMinimized, setIsMinimized] = useState(false);
  const [botActivated, setBotActivated] = useState(false);
  const [activationLevel, setActivationLevel] = useState<
    "idle" | "thinking" | "responding" | "active"
  >("idle");
  const [errorCount, setErrorCount] = useState(0);
  const [hasMultipleErrors, setHasMultipleErrors] = useState(false);
  const { isBoss, activateBoss, checkBoss } = useBossMode();
  const { isMobile, isTouch } = useMobileDetection();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Available models based on plan
  const getAvailableModels = () => {
    switch (userProfile?.plan) {
      case "ENTERPRISE":
        return {
          primary: { name: "GPT-4 Turbo", icon: "🧠", color: "#10B981" },
          secondary: { name: "Claude-3 Sonnet", icon: "⚡", color: "#8B5CF6" },
        };
      case "PRO":
        return {
          primary: { name: "GPT-4", icon: "🧠", color: "#10B981" },
          secondary: { name: "Claude-3 Haiku", icon: "⚡", color: "#8B5CF6" },
        };
      default:
        return {
          primary: { name: "GPT-3.5", icon: "🤖", color: "#6B7280" },
          secondary: { name: "Claude-2", icon: "💫", color: "#6B7280" },
        };
    }
  };

  const models = getAvailableModels();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Streaming response simulation
  // Real streaming from backend API with chunked transfer encoding
  const streamAIResponse = async (
    prompt: string,
    model: "primary" | "secondary",
    onToken: (token: string, isComplete: boolean) => void,
  ): Promise<void> => {
    try {
      // Backend API endpoints for streaming
      const modelEndpoints = {
        primary: "/api/ai/stream/primary",
        secondary: "/api/ai/stream/secondary",
      };

      await streamFromAPI(modelEndpoints[model], {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          model: getAvailableModels()[model].name,
          stream: true,
          max_tokens: 500,
          user_plan: userProfile?.plan || "FREE",
        }),
        streamingOptions: {
          onToken,
          onError: (error) => {
            console.error(`Streaming error for ${model}:`, error);
            setErrorCount((prev) => {
              const newCount = prev + 1;
              if (newCount >= 3) {
                setHasMultipleErrors(true);
              }
              return newCount;
            });
            // Fallback to simulation on backend error
            simulateStreamFallback(prompt, model, onToken);
          },
        },
      });
    } catch (error) {
      console.error(
        `Failed to connect to streaming backend for ${model}:`,
        error,
      );
      // Fallback to simulation when backend is unavailable
      await simulateStreamFallback(prompt, model, onToken);
    }
  };

  // Fallback simulation for demo/development when backend streaming unavailable
  const simulateStreamFallback = async (
    prompt: string,
    model: "primary" | "secondary",
    onToken: (token: string, isComplete: boolean) => void,
  ): Promise<void> => {
    const responses = {
      primary: [
        `Based on my analysis, here's a comprehensive approach to your question: "${prompt}". Let me break this down systematically and provide actionable insights that you can implement immediately. First, consider the foundational elements and core principles that drive successful outcomes...`,
        `I'll provide a detailed response to "${prompt}" with practical insights and actionable recommendations. This requires a multi-faceted approach that takes into account various perspectives, industry best practices, and proven methodologies...`,
        `Analyzing your query about "${prompt}", I can offer several perspectives and solutions. The key is to understand the underlying mechanisms and build upon proven strategies while adapting to your specific context...`,
      ],
      secondary: [
        `Here's an alternative perspective on "${prompt}": I'd approach this from a different angle that considers unconventional methodologies and creative solutions. Innovation often comes from challenging assumptions and exploring uncharted territories...`,
        `Looking at "${prompt}" through a creative lens, I see opportunities for innovation that others might miss. Let's explore some out-of-the-box thinking and unique approaches that could lead to breakthrough results...`,
        `From a strategic standpoint regarding "${prompt}", consider these unconventional approaches that could yield surprising results. Sometimes the best solutions come from unexpected directions and interdisciplinary thinking...`,
      ],
    };

    const fullResponse =
      responses[model][Math.floor(Math.random() * responses[model].length)];

    // Use the streaming utility for consistent token rendering
    await simulateStreaming(fullResponse, {
      tokenDelay: 75,
      chunkSize: 1,
      streamingOptions: { onToken },
    });
  };

  const simulateAIResponse = async (
    prompt: string,
    model: "primary" | "secondary",
  ): Promise<string> => {
    return new Promise((resolve) => {
      let finalContent = "";
      streamAIResponse(prompt, model, (content, isComplete) => {
        finalContent = content;
        if (isComplete) {
          resolve(finalContent);
        }
      });
    });
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // Add haptic feedback on mobile
    if (isTouch) {
      addHapticFeedback("light");
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      aiModel: "primary",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);

    // Check for boss mode activation
    if (checkBoss(currentInput)) {
      activateBoss("user-input");
      // Extra haptic feedback for boss mode
      if (isTouch) {
        addHapticFeedback("heavy");
      }
    }

    // Trigger bot activation sequence
    setBotActivated(true);
    setActivationLevel("thinking");

    try {
      if (selectedModel === "both") {
        // Create placeholder messages for streaming
        const primaryId = Date.now().toString() + "_primary";
        const secondaryId = Date.now().toString() + "_secondary";

        const primaryPlaceholder: Message = {
          id: primaryId,
          content: "",
          role: "assistant",
          aiModel: "primary",
          timestamp: new Date(),
          tokens: 0,
        };

        const secondaryPlaceholder: Message = {
          id: secondaryId,
          content: "",
          role: "assistant",
          aiModel: "secondary",
          timestamp: new Date(),
          tokens: 0,
        };

        setMessages((prev) => [
          ...prev,
          primaryPlaceholder,
          secondaryPlaceholder,
        ]);

        // Start streaming both responses simultaneously
        setActivationLevel("responding");

        const primaryPromise = streamAIResponse(
          currentInput,
          "primary",
          (content, isComplete) => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === primaryId
                  ? { ...msg, content, tokens: content.split(" ").length }
                  : msg,
              ),
            );
            if (isComplete) {
              setActivationLevel("active");
            }
          },
        );

        const secondaryPromise = streamAIResponse(
          currentInput,
          "secondary",
          (content, isComplete) => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === secondaryId
                  ? { ...msg, content, tokens: content.split(" ").length }
                  : msg,
              ),
            );
          },
        );

        await Promise.all([primaryPromise, secondaryPromise]);
      } else {
        // Single model streaming response
        const assistantId = Date.now().toString();
        const assistantPlaceholder: Message = {
          id: assistantId,
          content: "",
          role: "assistant",
          aiModel: selectedModel,
          timestamp: new Date(),
          tokens: 0,
        };

        setMessages((prev) => [...prev, assistantPlaceholder]);

        setActivationLevel("responding");

        await streamAIResponse(
          currentInput,
          selectedModel,
          (content, isComplete) => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantId
                  ? { ...msg, content, tokens: content.split(" ").length }
                  : msg,
              ),
            );
            if (isComplete) {
              setActivationLevel("active");
            }
          },
        );
      }
    } catch (error) {
      console.error("Error generating response:", error);
      setErrorCount((prev) => {
        const newCount = prev + 1;
        if (newCount >= 3) {
          setHasMultipleErrors(true);
        }
        return newCount;
      });
    } finally {
      setIsLoading(false);
      // Return to idle state after 3 seconds
      setTimeout(() => {
        setActivationLevel("idle");
        setBotActivated(false);
      }, 3000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  if (isMinimized) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="dual-ai-minimized"
        onClick={() => setIsMinimized(false)}
      >
        <div className="minimized-content">
          <BotActivationTransform
            isActivated={botActivated}
            activationLevel={activationLevel}
          />
          <span className="minimized-text">Dual AI Assistant</span>
          <div className="minimized-indicator"></div>
        </div>

        <style jsx>{`
          .dual-ai-minimized {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #1f2937, #374151);
            border: 1px solid rgba(253, 255, 220, 0.2);
            border-radius: 50px;
            padding: 12px 20px;
            cursor: pointer;
            z-index: 1000;
            backdrop-filter: blur(8px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          }

          .minimized-content {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .minimized-icon {
            color: #10b981;
          }

          .minimized-text {
            color: #fdffdc;
            font-weight: 600;
            font-size: 14px;
          }

          .minimized-indicator {
            width: 8px;
            height: 8px;
            background: #10b981;
            border-radius: 50%;
            animation: pulse 2s infinite;
          }

          @keyframes pulse {
            0%,
            100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
        `}</style>
      </motion.div>
    );
  }

  return (
    <div className="dual-ai-assistant">
      {/* Header */}
      <div className="ai-header">
        <div className="header-left">
          <div className="ai-title">
            <div className="flex gap-3 items-center">
              {isBoss ? (
                <SaintSalBossAvatar
                  size="md"
                  status={
                    hasMultipleErrors
                      ? "offline"
                      : isLoading
                        ? "busy"
                        : "online"
                  }
                  animated={true}
                />
              ) : (
                <SaintSalAIAvatar
                  size="md"
                  status={
                    hasMultipleErrors
                      ? "offline"
                      : isLoading
                        ? "busy"
                        : "online"
                  }
                  animated={true}
                />
              )}
              <BotActivationTransform
                isActivated={botActivated}
                activationLevel={activationLevel}
              />
            </div>
            <span>
              {isBoss
                ? "BOSS MODE ACTIVATED"
                : hasMultipleErrors
                  ? "AI Assistant - Connection Issues"
                  : "Dual AI Assistant"}
            </span>
            <div
              className={`plan-badge ${hasMultipleErrors ? "error-state" : isBoss ? "boss-mode" : ""}`}
            >
              {isBoss
                ? "ULTIMATE"
                : hasMultipleErrors
                  ? `${errorCount} Errors`
                  : userProfile?.plan}
            </div>
          </div>
          <div className="model-selector">
            <button
              onClick={() => setSelectedModel("primary")}
              className={`model-btn ${selectedModel === "primary" ? "active" : ""}`}
              style={{ "--model-color": models.primary.color } as any}
            >
              <span className="model-icon">{models.primary.icon}</span>
              <span className="model-name">{models.primary.name}</span>
            </button>
            <button
              onClick={() => setSelectedModel("both")}
              className={`model-btn ${selectedModel === "both" ? "active" : ""}`}
            >
              <Zap className="w-4 h-4" />
              <span>Both</span>
            </button>
            <button
              onClick={() => setSelectedModel("secondary")}
              className={`model-btn ${selectedModel === "secondary" ? "active" : ""}`}
              style={{ "--model-color": models.secondary.color } as any}
            >
              <span className="model-icon">{models.secondary.icon}</span>
              <span className="model-name">{models.secondary.name}</span>
            </button>
          </div>
        </div>
        <div className="header-actions">
          {hasMultipleErrors && (
            <div className="flex gap-2 items-center mr-2">
              <button
                onClick={() => {
                  setErrorCount(0);
                  setHasMultipleErrors(false);
                }}
                className="px-2 py-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded text-red-300 text-xs font-medium transition-colors"
              >
                Reset Errors
              </button>
              <button
                onClick={() => setSelectedModel("both")}
                className="px-2 py-1 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 rounded text-yellow-300 text-xs font-medium transition-colors"
              >
                Try Fallback
              </button>
            </div>
          )}
          <button onClick={clearChat} className="action-btn" title="Clear chat">
            <RotateCcw className="w-4 h-4" />
          </button>
          <button className="action-btn" title="Settings">
            <Settings className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsMinimized(true)}
            className="action-btn"
            title="Minimize"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="messages-container">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`message ${message.role}`}
            >
              {message.role === "assistant" && (
                <div className="message-header">
                  <div className="ai-indicator">
                    <span className="ai-icon">
                      {message.aiModel === "primary"
                        ? models.primary.icon
                        : models.secondary.icon}
                    </span>
                    <span className="ai-model">
                      {message.aiModel === "primary"
                        ? models.primary.name
                        : models.secondary.name}
                    </span>
                  </div>
                  <div className="message-actions">
                    <button
                      onClick={() => copyMessage(message.content)}
                      className="msg-action"
                      title="Copy"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    <button className="msg-action" title="Like">
                      <ThumbsUp className="w-3 h-3" />
                    </button>
                    <button className="msg-action" title="Dislike">
                      <ThumbsDown className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
              <div className="message-content">{message.content}</div>
              {message.tokens && (
                <div className="message-meta">
                  <span className="token-count">{message.tokens} tokens</span>
                  <span className="timestamp">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="loading-indicator"
          >
            <div className="flex flex-col gap-3 items-center p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl text-gray-200 text-sm text-center">
              <div className="flex gap-2 items-center">
                <div className="loading-spinner"></div>
                <span>Request is in progress...</span>
              </div>
              <div className="text-xs text-gray-400">
                {selectedModel === "both"
                  ? "Getting responses from both AI models"
                  : `${selectedModel === "primary" ? models.primary.name : models.secondary.name} is thinking`}
              </div>
              <div className="flex gap-2 items-center">
                <button
                  onClick={() => {
                    setIsLoading(false);
                    setActivationLevel("idle");
                    setBotActivated(false);
                  }}
                  className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-300 text-xs font-medium transition-colors"
                >
                  Cancel Request
                </button>
                <button
                  onClick={() =>
                    setSelectedModel(
                      selectedModel === "primary" ? "secondary" : "primary",
                    )
                  }
                  className="px-3 py-1 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 rounded-lg text-yellow-300 text-xs font-medium transition-colors"
                >
                  Switch Model
                </button>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="input-container">
        <div className="input-wrapper">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Ask ${selectedModel === "both" ? "both AI models" : selectedModel === "primary" ? models.primary.name : models.secondary.name}...`}
            className="chat-input"
            disabled={isLoading}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            {...(isMobile && {
              inputMode: "text",
              enterKeyHint: "send",
            })}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="send-btn"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      <style jsx>{`
        .dual-ai-assistant {
          display: flex;
          flex-direction: column;
          height: 600px;
          background: linear-gradient(
            135deg,
            rgba(17, 24, 39, 0.95),
            rgba(31, 41, 55, 0.95)
          );
          border: 1px solid rgba(253, 255, 220, 0.2);
          border-radius: 16px;
          overflow: hidden;
          backdrop-filter: blur(16px);
          font-family:
            Inter,
            -apple-system,
            Roboto,
            Helvetica,
            sans-serif;
        }

        .ai-header {
          padding: 16px 20px;
          border-bottom: 1px solid rgba(253, 255, 220, 0.1);
          background: rgba(0, 0, 0, 0.3);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }

        .header-left {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .ai-title {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #fdffdc;
          font-weight: 700;
          font-size: 16px;
        }

        .plan-badge {
          background: linear-gradient(45deg, #10b981, #059669);
          color: white;
          font-size: 10px;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 4px;
          transition: all 0.3s ease;
        }

        .plan-badge.error-state {
          background: linear-gradient(45deg, #ef4444, #dc2626);
          animation: errorPulse 2s infinite;
        }

        .plan-badge.boss-mode {
          background: linear-gradient(
            45deg,
            #7c2d12,
            #dc2626,
            #7c3aed,
            #000000
          );
          background-size: 300% 300%;
          animation: bossGlow 1.5s ease-in-out infinite;
          color: #ffffff;
          font-weight: 900;
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 0 20px rgba(220, 38, 38, 0.6);
        }

        @keyframes errorPulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        @keyframes bossGlow {
          0%,
          100% {
            background-position: 0% 50%;
            transform: scale(1);
          }
          50% {
            background-position: 100% 50%;
            transform: scale(1.05);
          }
        }

        .model-selector {
          display: flex;
          gap: 4px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          padding: 4px;
        }

        .model-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 8px 12px;
          border: none;
          background: transparent;
          color: #9ca3af;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .model-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #fdffdc;
        }

        .model-btn.active {
          background: var(--model-color, #fdffdc);
          color: #000;
        }

        .model-icon {
          font-size: 14px;
        }

        .model-name {
          font-size: 11px;
        }

        .header-actions {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          padding: 8px;
          border: none;
          background: rgba(255, 255, 255, 0.1);
          color: #9ca3af;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .action-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          color: #fdffdc;
        }

        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .message {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .message.user {
          align-items: flex-end;
        }

        .message.assistant {
          align-items: flex-start;
        }

        .message-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          max-width: 80%;
        }

        .ai-indicator {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #9ca3af;
        }

        .ai-icon {
          font-size: 14px;
        }

        .message-actions {
          display: flex;
          gap: 4px;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .message:hover .message-actions {
          opacity: 1;
        }

        .msg-action {
          padding: 4px;
          border: none;
          background: rgba(255, 255, 255, 0.1);
          color: #9ca3af;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .msg-action:hover {
          background: rgba(255, 255, 255, 0.2);
          color: #fdffdc;
        }

        .message-content {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 12px 16px;
          color: #e5e7eb;
          line-height: 1.5;
          max-width: 80%;
          word-wrap: break-word;
        }

        .message.user .message-content {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          border-color: #10b981;
        }

        .message-meta {
          display: flex;
          gap: 12px;
          font-size: 11px;
          color: #6b7280;
          margin-top: 4px;
        }

        .loading-indicator {
          display: flex;
          justify-content: center;
          padding: 20px;
        }

        .loading-content {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #9ca3af;
          font-size: 14px;
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(253, 255, 220, 0.1);
          border-top: 2px solid #fdffdc;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .input-container {
          padding: 16px 20px;
          border-top: 1px solid rgba(253, 255, 220, 0.1);
          background: rgba(0, 0, 0, 0.3);
        }

        .input-wrapper {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .chat-input {
          flex: 1;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          padding: 12px 16px;
          color: #fdffdc;
          font-size: 14px;
          outline: none;
          transition: all 0.2s ease;
        }

        .chat-input:focus {
          border-color: #10b981;
          box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
        }

        .chat-input::placeholder {
          color: #9ca3af;
        }

        .send-btn {
          padding: 12px;
          background: linear-gradient(135deg, #10b981, #059669);
          border: none;
          border-radius: 10px;
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .send-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        .send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .loading-indicator {
          margin: 16px;
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(59, 130, 246, 0.3);
          border-top: 2px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .dual-ai-assistant {
            height: 100vh;
            border-radius: 0;
            max-height: 100vh;
            overflow: hidden;
          }

          .ai-header {
            padding: 12px 16px;
            flex-wrap: wrap;
            gap: 8px;
          }

          .ai-title {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .ai-title > div:first-child {
            gap: 2;
          }

          .model-selector {
            overflow-x: auto;
            padding: 2px;
            scrollbar-width: none;
            -ms-overflow-style: none;
          }

          .model-selector::-webkit-scrollbar {
            display: none;
          }

          .model-btn {
            padding: 6px 8px;
            font-size: 11px;
            white-space: nowrap;
            min-width: fit-content;
          }

          .messages-container {
            padding: 16px 12px;
            height: calc(100vh - 180px);
          }

          .message-content {
            max-width: 85%;
            font-size: 14px;
          }

          .input-container {
            padding: 12px 16px;
            background: rgba(0, 0, 0, 0.5);
          }

          .chat-input {
            font-size: 16px;
            padding: 14px 16px;
          }

          .send-btn {
            padding: 14px;
            min-width: 48px;
            min-height: 48px;
          }

          .header-actions {
            flex-wrap: wrap;
            gap: 4px;
          }

          .action-btn {
            padding: 8px;
            min-width: 40px;
            min-height: 40px;
          }

          .plan-badge {
            font-size: 9px;
            padding: 1px 4px;
          }

          .loading-indicator {
            margin: 8px;
          }
        }

        @media (max-width: 480px) {
          .ai-header {
            padding: 8px 12px;
          }

          .messages-container {
            padding: 12px 8px;
            height: calc(100vh - 160px);
          }

          .input-container {
            padding: 8px 12px;
          }

          .header-actions {
            order: 3;
            width: 100%;
            justify-content: center;
            margin-top: 8px;
          }
        }

        /* Scrollbar styling */
        .messages-container::-webkit-scrollbar {
          width: 6px;
        }

        .messages-container::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
        }

        .messages-container::-webkit-scrollbar-thumb {
          background: rgba(253, 255, 220, 0.2);
          border-radius: 3px;
        }

        .messages-container::-webkit-scrollbar-thumb:hover {
          background: rgba(253, 255, 220, 0.3);
        }
      `}</style>
    </div>
  );
};

export default DualAIAssistant;
