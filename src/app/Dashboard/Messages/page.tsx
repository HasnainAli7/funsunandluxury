"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { FaCircle, FaTimes, FaBars } from 'react-icons/fa';
import Link from 'next/link';
import { RootState } from '@/store/store';
import { collection, addDoc, query, where, onSnapshot, doc, setDoc, updateDoc, getDoc, orderBy, DocumentData } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import { useSearchParams } from 'next/navigation';
import '@/styles/bootstrap.min.css';
import './page.module.css';
import moment from "moment";

const Messages = () => {
  const searchParams = useSearchParams();
  const VId = searchParams.get('venderId') || "0";
  const user = useSelector((state: RootState) => state.auth.user) as any ;
  const [messages, setMessages] = useState<any[]>([]);
  const [Users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [Chatloading, setChatloading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [newMessage, setNewMessage] = useState<string>('');
  const [venderId, setVenderId] = useState<number>(parseInt(VId));
  const [typingStatus, setTypingStatus] = useState<string>('');
  const [SelectedChatUser, setSelectedChatUser] = useState<any[]>([]);
  const [activeUserId, setActiveUserId] = useState<number | null>(null);
  const chatId = `${Math.min(user.id, venderId)}_${Math.max(user.id, venderId)}`;

  useEffect(() => {
     
    if (user && venderId) {

      setChatloading(true);

      const q = query(
        collection(db, 'Chats', chatId, 'Messages'),
        where('senderId', 'in', [Number(user.id), Number(venderId)]),
        orderBy('timestamp')
      );

      const unsubscribeMessages = onSnapshot(q, (querySnapshot) => {
        const msgs: DocumentData[] = [];
        querySnapshot.forEach((doc) => {
          msgs.push(doc.data());
        });
        setChatloading(false);
        setMessages(msgs);
      });

      const typingDocRef = doc(db, 'Chats', chatId, 'TypingStatus', 'typing');
      const unsubscribeTyping = onSnapshot(typingDocRef, (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          if (data?.typing && data.typing !== user.id) {
            setTypingStatus('Typing...');
          } else {
            setTypingStatus('');
          }
        }
      });

      return () => {
        unsubscribeMessages();
        unsubscribeTyping();
      };
    }
  }, [user, venderId]);
  
 useEffect(() => {
    GetAllUsers();
  }, []);

  const GetAllUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error('Failed to fetch Users listings');
      }
      const data = await response.json();
      setUsers(data.filter((x: { id: number; }) => x.id !== Number(user?.id)));
      setSelectedChatUser(data.filter((x: { id: number; })=>x.id==venderId));
      setActiveUserId(venderId);
      setError(undefined);
    } catch (error: any) {
      setError(error?.message || 'Failed to fetch Users listings');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (newMessage.trim()) {
      await addDoc(collection(db, 'Chats', chatId, 'Messages'), {
        senderId: Number(user.id),
        senderType: user?.roles[0],
        fullname:user?.name,
        profile:user?.Profile_ImagePath,
        message: newMessage,
        timestamp: new Date()
      });
      setNewMessage('');
      await setTypingStatusInDb('');
    }
  };

  const handleTyping = async (isTyping: boolean) => {
    if (isTyping) {
      await setTypingStatusInDb(user.id);
    } else {
      await setTypingStatusInDb('');
    }
  };

  const setTypingStatusInDb = async (typingStatus: string) => {
    const typingDocRef = doc(db, 'Chats', chatId, 'TypingStatus', 'typing');
    await setDoc(typingDocRef, { typing: typingStatus }, { merge: true });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    handleTyping(e.target.value.trim().length > 0);
  };

  return (
    <main className="content">
      <div className="container-fluid">
        <h1 className="h3 mb-3">Messages</h1>
        <div className="card" style={{minHeight: "100vh"}}>
          <div className="row g-0" style={{minHeight: "100vh"}}>
            <div className="col-12 col-lg-5 col-xl-3 pt-4 border-right">
              {/* <div className="px-4 d-none d-md-block">
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <input
                      type="text"
                      className="form-control my-3"
                      placeholder="Search..."
                    />
                  </div>
                </div>
              </div> */}
            {loading?
             <div className="d-flex justify-content-center align-items-center mt-5">
              <div className="spinner-border text-primary"></div>
             </div>
             :  
             <>
             {Users && Users.length > 0 ? Users.map((item: any, index: any) => (
              <a
                href="javascript:void(0);"
                onClick={() =>{
                  setVenderId(item.id);
                  setSelectedChatUser(Users.filter(x=>x.id==item.id));
                  setActiveUserId(item.id);
                }}
                key={index}
                className="list-group-item list-group-item-action border-0"
                style={{backgroundColor: activeUserId === item.id ? '#f0f0f0' : 'transparent' }}>
                <div className="d-flex align-items-start">
                  <img
                    src={item.Profile_ImagePath}
                    className="rounded-circle mr-1"
                    alt={item.fullName}
                    width={40}
                    height={40}
                  />
                  <div className="flex-grow-1 ml-3">
                    {item.fullName}
                  </div>
                </div>
              </a>
            )) : null}
             </>
            }
             <hr className="d-block d-lg-none mt-1 mb-0" />
            </div>
          
            <div className="col-12 col-lg-7 col-xl-9">
            {loading || Chatloading?
             <div className="d-flex justify-content-center align-items-center mt-5">
            <div className="spinner-border text-primary"></div>
             </div>
             :<>
             {SelectedChatUser && SelectedChatUser.length > 0?(
              <>
              <div className="py-2 px-4 border-bottom d-none d-lg-block">
                <div className="d-flex align-items-center py-1">
                  <div className="position-relative">
                    <img
                      src={SelectedChatUser[0].Profile_ImagePath}
                      className="rounded-circle mr-1"
                      alt={SelectedChatUser[0].fullName}
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className="flex-grow-1 pl-3">
                    <strong>{SelectedChatUser[0].fullName}</strong>
                    <div className="text-muted small">
                      <em>{typingStatus}</em>
                    </div>
                  </div>
                </div>
              </div>
             
              <div className="position-relative">
                <div className="chat-messages p-4">
                  {messages.map((msg, index) => (
                    <div key={index}>
                      {msg.senderType === "User" ? (
                        <div className="chat-message-right pb-4">
                          <div>
                            <img
                              src={msg.profile}
                              className="rounded-circle mr-1"
                              alt="User Avatar"
                              width={40}
                              height={40}
                            />
                            <div className="text-muted small text-nowrap mt-2">{moment.unix(msg.timestamp.seconds).format("hh:mm A")}</div>
                          </div>
                          <div className="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">
                            <div className="font-weight-bold mb-1">{msg.fullname}</div>
                            {msg.message}
                          </div>
                        </div>
                      ) : (
                        <div className="chat-message-left pb-4">
                          <div>
                            <img
                               src={msg.profile}
                              className="rounded-circle mr-1"
                              alt="Vendor Avatar"
                              width={40}
                              height={40}
                            />
                            <div className="text-muted small text-nowrap mt-2">{moment.unix(msg.timestamp.seconds).format("hh:mm A")}</div>
                          </div>
                          <div className="flex-shrink-1 bg-light rounded py-2 px-3 ml-3">
                            <div className="font-weight-bold mb-1">{msg.fullname}</div>
                            {msg.message}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-grow-0 py-3 px-4 border-top">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Type your message"
                    value={newMessage}
                    onChange={handleInputChange}
                    onBlur={() => handleTyping(false)}
                  />
                  <button onClick={sendMessage} className="btn btn-primary">Send</button>
                </div>
              </div>
              </>
              ):null}
              </>
            }
            </div>
            
          </div>
        </div>
      </div>
    </main>
  )
};

export default Messages;
