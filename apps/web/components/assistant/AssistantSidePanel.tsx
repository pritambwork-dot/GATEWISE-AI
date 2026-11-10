'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles, Send, X, Trash2, ShieldCheck, RefreshCw,
  Cpu, AlertCircle, ExternalLink, Bot, CheckCircle
} from 'lucide-react';
import { api } from '@/lib/services/api';
import { ToolExecutionCard } from './ToolExecutionCard';
import { ActionProposalCard, ActionProposalData } from './ActionProposalCard';
import { SuggestedPrompts } from './SuggestedPrompts';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  tools?: { tool: string; args?: any; result?: any }[];
  proposals?: ActionProposalData[];
  timestamp: string;
}

interface AssistantSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AssistantSidePanel({ isOpen, onClose }: AssistantSidePanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-msg',
      role: 'assistant',
      content:
        "Welcome to the **GATEWISE AI Assistant**. I am your institutional operations co-pilot for the IIM Sambalpur Campus.\n\n" +
        "You can ask me to summarize today's gate traffic, analyze verification trends, check visitor check-ins, or review pending identity referrals.\n\n" +
        "*(Note: Under institutional security rules, biometric entry decisions and identity approvals remain strictly human-supervised.)*",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isStreaming) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsStreaming(true);

    const assistantMsgId = `asst-${Date.now()}`;
    const newAssistantMsg: Message = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      tools: [],
      proposals: [],
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newAssistantMsg]);

    try {
      let accumulatedText = '';
      const currentTools: { tool: string; args?: any; result?: any }[] = [];
      const currentProposals: ActionProposalData[] = [];

      // Stream chat responses from backend
      for await (const event of api.streamAssistantChat(textToSend, sessionId)) {
        if (event.type === 'text_delta' && event.delta) {
          accumulatedText += event.delta;
        } else if (event.type === 'tool_start' && event.tool_name) {
          currentTools.push({ tool: event.tool_name, args: event.arguments });
        } else if (event.type === 'tool_result' && event.tool_name) {
          const existing = currentTools.find((t) => t.tool === event.tool_name);
          if (existing) {
            existing.result = event.result;
          }
        } else if (event.type === 'action_proposal' && event.proposal) {
          currentProposals.push(event.proposal);
        } else if (event.type === 'done' && event.session_id) {
          setSessionId(event.session_id);
        }

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMsgId
              ? {
                  ...msg,
                  content: accumulatedText,
                  tools: [...currentTools],
                  proposals: [...currentProposals],
                }
              : msg
          )
        );
      }
    } catch (err: any) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMsgId
            ? {
                ...msg,
                content:
                  msg.content ||
                  `Operational Advisory: The assistant engine experienced a temporary connection hiccup (${err?.message || 'Network Timeout'}). Institutional verification operations remain 100% active.`,
              }
            : msg
        )
      );
    } finally {
      setIsStreaming(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'fresh-init',
        role: 'assistant',
        content: "Chat cleared. How can I assist with campus gate operations today?",
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] z-50 bg-white border-l border-gatewise-border shadow-2xl flex flex-col antialiased transition-all">
      {/* Top Header */}
      <div className="px-5 py-4 border-b border-gatewise-border bg-gradient-to-r from-emerald-950 via-gatewise-deep to-gatewise-primary text-white flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-emerald-300 shadow-inner">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-extrabold text-sm tracking-tight text-white">GATEWISE AI Assistant</h3>
              <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-[10px] font-semibold text-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Active</span>
              </span>
            </div>
            <p className="text-[11px] text-emerald-200/80">Campus Operations & Verification Co-Pilot</p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={handleClearChat}
            className="p-1.5 rounded-lg text-emerald-200/80 hover:text-white hover:bg-white/10 transition-colors"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-200/80 hover:text-white hover:bg-white/10 transition-colors"
            title="Close Assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-slate-50/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[92%] rounded-2xl p-4 text-xs leading-relaxed shadow-xs transition-all ${
                msg.role === 'user'
                  ? 'bg-gatewise-primary text-white rounded-br-xs font-medium'
                  : 'bg-white text-gatewise-text border border-gatewise-border rounded-bl-xs'
              }`}
            >
              {/* Message Content */}
              <div className="whitespace-pre-wrap">{msg.content}</div>

              {/* Tool Execution Cards */}
              {msg.tools && msg.tools.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-slate-100">
                  {msg.tools.map((t, idx) => (
                    <ToolExecutionCard
                      key={`${t.tool}-${idx}`}
                      toolName={t.tool}
                      arguments={t.args}
                      result={t.result}
                    />
                  ))}
                </div>
              )}

              {/* Action Proposal Cards */}
              {msg.proposals && msg.proposals.length > 0 && (
                <div className="mt-2.5">
                  {msg.proposals.map((prop, idx) => (
                    <ActionProposalCard
                      key={`${prop.proposal_id}-${idx}`}
                      proposal={prop}
                      onNavigate={onClose}
                    />
                  ))}
                </div>
              )}
            </div>

            <span className="text-[10px] text-gatewise-secondary/60 mt-1 px-1">
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}

        {isStreaming && (
          <div className="flex items-center space-x-2 text-xs text-gatewise-secondary p-2 bg-white rounded-xl border border-gatewise-border w-fit animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-gatewise-primary animate-spin" />
            <span>Consulting institutional backend services...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts & Input Composer */}
      <div className="p-4 border-t border-gatewise-border bg-white space-y-2 shrink-0">
        <SuggestedPrompts onSelectPrompt={(p) => handleSend(p)} disabled={isStreaming} />

        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask about gate traffic, pending enrollments..."
            disabled={isStreaming}
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-gatewise-border bg-slate-50 text-xs text-gatewise-text placeholder:text-gatewise-secondary/70 focus:outline-none focus:ring-1 focus:ring-gatewise-primary focus:bg-white transition-all disabled:opacity-50"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputQuery.trim() || isStreaming}
            className="w-9 h-9 rounded-xl bg-gatewise-primary hover:bg-gatewise-deep text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:pointer-events-none shadow-xs shrink-0"
            title="Send query"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[10px] text-center text-gatewise-secondary/70 pt-1">
          Zero biometric data transmitted. Institutional decisions remain strictly human-supervised.
        </p>
      </div>
    </div>
  );
}
