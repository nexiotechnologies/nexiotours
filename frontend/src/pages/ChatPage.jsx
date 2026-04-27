import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Send, MoreVertical, MessageSquare, ArrowLeft, Globe, User } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function ChatPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (activeConv) {
      fetchMessages(activeConv.id);
    }
  }, [activeConv]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const res = await api.get('/chat/conversations/');
      const data = res.data.results || res.data || [];
      setConversations(data);
      if (data.length > 0) setActiveConv(data[0]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load conversations");
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (convId) => {
    try {
      const res = await api.get(`/chat/conversations/${convId}/messages/`);
      setMessages(res.data.results || res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const sendMsg = async () => {
    if (!input.trim() || !activeConv) return;
    
    const tempMsg = {
      id: Date.now(),
      sender_name: "Me",
      text: input.trim(),
      created_at: new Date().toISOString(),
      is_me: true
    };
    
    setMessages([...messages, tempMsg]);
    const currentInput = input;
    setInput("");

    try {
      await api.post(`/chat/conversations/${activeConv.id}/messages/`, {
        text: currentInput.trim()
      });
      fetchMessages(activeConv.id);
    } catch (err) {
      toast.error("Failed to send message");
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      {/* Background Gradients */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '20%', right: '-10%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(0, 122, 255, 0.05) 0%, transparent 70%)', filter: 'blur(120px)' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(175, 82, 222, 0.05) 0%, transparent 70%)', filter: 'blur(100px)' }} />
      </div>

      <div style={{ flex: 1, display: 'flex', paddingTop: 72, position: 'relative', zIndex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        <aside style={{ 
          width: 360, 
          borderRight: '1px solid rgba(255,255,255,0.06)', 
          background: 'rgba(255,255,255,0.01)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ padding: '32px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
             <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 20 }}>Inquiries</h2>
             <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                <input 
                  placeholder="Search messages..."
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '12px 12px 12px 48px', color: '#fff', fontSize: 14, outline: 'none' }}
                />
             </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
            {loading ? (
              <div style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>Loading conversations...</div>
            ) : conversations.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>No conversations found.</div>
            ) : conversations.map(c => (
              <motion.div
                key={c.id}
                onClick={() => setActiveConv(c)}
                whileHover={{ background: 'rgba(255,255,255,0.05)' }}
                style={{
                  padding: '16px 16px',
                  borderRadius: 16,
                  cursor: 'pointer',
                  background: activeConv?.id === c.id ? 'rgba(0, 122, 255, 0.1)' : 'transparent',
                  display: 'flex',
                  gap: 16,
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  marginBottom: 4
                }}
              >
                <div style={{ 
                  width: 52, height: 52, borderRadius: 18, 
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))', 
                  border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 
                }}>
                  {c.other_participant_name?.[0] || <User size={24} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontWeight: 600, fontSize: 16 }}>{c.other_participant_name || 'Guest User'}</span>
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>{c.last_message_time || ''}</span>
                   </div>
                   <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {c.last_message_preview || 'No messages yet'}
                   </p>
                </div>
              </motion.div>
            ))}
          </div>
        </aside>

        {/* Chat Main Area */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.2)' }}>
          {activeConv ? (
            <>
              <header style={{ 
                padding: '24px 32px', 
                borderBottom: '1px solid rgba(255,255,255,0.06)', 
                background: 'rgba(255,255,255,0.01)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(0,122,255,0.1)', color: '#007AFF', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(0,122,255,0.2)' }}>
                    <MessageSquare size={20} />
                  </div>
                  <div>
                     <h3 style={{ fontSize: 18, fontWeight: 700 }}>{activeConv.other_participant_name}</h3>
                     <span style={{ fontSize: 12, color: '#34C759', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34C759' }} /> Online
                     </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                   <button style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Globe size={18} /></button>
                   <button style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MoreVertical size={18} /></button>
                </div>
              </header>

              <div style={{ flex: 1, overflowY: 'auto', padding: '40px 60px', display: 'flex', flexDirection: 'column', gap: 24 }}>
                <AnimatePresence>
                  {messages.map((msg, i) => {
                    const isMe = msg.is_me || msg.sender === user?.id;
                    return (
                      <motion.div 
                        key={msg.id || i}
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}
                      >
                         <div style={{ 
                           maxWidth: '65%', 
                           padding: '16px 20px', 
                           borderRadius: isMe ? '24px 24px 4px 24px' : '24px 24px 24px 4px',
                           background: isMe ? '#007AFF' : 'rgba(255,255,255,0.05)',
                           border: isMe ? 'none' : '1px solid rgba(255,255,255,0.08)',
                           color: '#fff',
                           boxShadow: isMe ? '0 8px 24px rgba(0,122,255,0.2)' : 'none'
                         }}>
                            <p style={{ fontSize: 15, lineHeight: 1.5 }}>{msg.text}</p>
                            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 8, display: 'block', textAlign: 'right' }}>
                              {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                         </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                <div ref={bottomRef} />
              </div>

              <footer style={{ padding: '32px', borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.2)' }}>
                 <div style={{ 
                   display: 'flex', gap: 16, alignItems: 'center', 
                   background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                   borderRadius: 24, padding: '8px 8px 8px 24px',
                   boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.1)'
                 }}>
                    <input 
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && sendMsg()}
                      placeholder="Type your message..."
                      style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: 15, outline: 'none' }}
                    />
                    <button 
                      onClick={sendMsg}
                      style={{ 
                        width: 48, height: 48, borderRadius: 18, 
                        background: '#007AFF', color: '#fff', border: 'none', 
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'transform 0.2s ease',
                        boxShadow: '0 4px 15px rgba(0,122,255,0.3)'
                      }}
                      onMouseDown={e => e.currentTarget.style.transform = 'scale(0.92)'}
                      onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                       <Send size={20} />
                    </button>
                 </div>
              </footer>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.2)' }}>
               <MessageSquare size={64} style={{ marginBottom: 24, opacity: 0.1 }} />
               <p style={{ fontSize: 18, fontWeight: 500 }}>Select a conversation to start chatting</p>
            </div>
          )}
        </main>
      </div>
      
      <style>{`
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); borderRadius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
}
