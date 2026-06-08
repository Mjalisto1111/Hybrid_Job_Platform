import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';

function Chat() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [participantId, setParticipantId] = useState<number | ''>('');
  const { user } = useAuth();

  const loadConversations = async () => {
    try {
      const resp = await api.get('/chat/conversations');
      setConversations(resp.data.conversations || []);
    } catch (e) {
      setConversations([]);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  const openConversation = async (conv: any) => {
    setSelected(conv);
    try {
      const resp = await api.get(`/chat/messages/${conv.id}`);
      setMessages(resp.data.messages || []);
    } catch (e) {
      setMessages([]);
    }
  };

  const createConversation = async () => {
    if (!participantId) {
      alert('Enter participant id');
      return;
    }
    try {
      const resp = await api.post('/chat/conversations', { title: 'Private chat', participant_ids: [Number(participantId)] });
      alert('Conversation created');
      loadConversations();
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to create conversation');
    }
  };

  const sendMessage = async () => {
    if (!selected) return alert('Select a conversation');
    try {
      const payload = { conversation_id: selected.id, receiver_id: participantId || undefined, content: newMessage };
      const resp = await api.post('/chat/messages', payload);
      setMessages((m) => [...m, resp.data.message]);
      setNewMessage('');
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to send message');
    }
  };

  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
        <h2 className="text-3xl font-semibold text-white">Real-time communication</h2>
        <p className="mt-3 text-slate-400">Chat with customers, workers, and hiring managers using SocketIO-powered conversations.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="col-span-1 rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="text-lg font-semibold text-white">Start conversation</h3>
          <p className="text-slate-400 text-sm">Enter participant user id to start a private chat.</p>
          <input value={participantId} onChange={(e) => setParticipantId(e.target.value === '' ? '' : Number(e.target.value))} className="w-full mt-3 rounded p-2 bg-slate-800 text-white" placeholder="Participant id" />
          <button onClick={createConversation} className="mt-3 rounded-2xl bg-sky-500 px-4 py-2 font-semibold text-slate-950">Create</button>
          <hr className="my-4" />
          <h4 className="text-white">Conversations</h4>
          <div className="mt-3 space-y-2">
            {conversations.map((c) => (
              <div key={c.id} className="flex items-center justify-between">
                <button onClick={() => openConversation(c)} className="text-left text-slate-200">{c.title || `Conversation ${c.id}`}</button>
                <span className="text-slate-400 text-sm">{c.created_at}</span>
              </div>
            ))}
            {!conversations.length && <div className="text-slate-400">No conversations yet.</div>}
          </div>
        </div>

        <div className="col-span-2 rounded-3xl border border-slate-800 bg-slate-900 p-6">
          {selected ? (
            <>
              <h3 className="text-xl font-semibold text-white">{selected.title || `Conversation ${selected.id}`}</h3>
              <div className="mt-4 space-y-3 max-h-80 overflow-auto p-2">
                {messages.map((m) => (
                  <div key={m.id} className={`p-3 rounded ${m.sender_id === user?.id ? 'bg-sky-500/10' : 'bg-slate-800'}`}>
                    <div className="text-slate-300">{m.content}</div>
                    <div className="text-xs text-slate-500 mt-1">{m.created_at}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className="flex-1 rounded p-2 bg-slate-800 text-white" placeholder="Type a message" />
                <button onClick={sendMessage} className="rounded-2xl bg-emerald-500 px-4 py-2 font-semibold text-slate-950">Send</button>
              </div>
            </>
          ) : (
            <div className="text-slate-400">Select a conversation to view messages and send replies.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Chat;
