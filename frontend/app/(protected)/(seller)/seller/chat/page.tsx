"use client"
import React, { useState } from 'react';
import {Avatar} from "@/components/ui/avatar"
import {AvatarFallback} from "@/components/ui/avatar"
import {AvatarImage} from "@/components/ui/avatar";
import {User} from "lucide-react";

// Types
type Message = {
  id: string;
  sender: string;
  content: string;
  time: string;
  isAdmin?: boolean;
  isMe?: boolean;
  attachment?: boolean;
};

type Contact = {
  id: string;
  name: string;
  online?: boolean;
  avatar: string;
  lastMessage?: string;
  time?: string;
  isAdmin?: boolean;
  hasWarning?: boolean;
  isUrgent?: boolean;
};

const KollaBeeMessaging: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'customer' | 'admin'>('customer');
  const [activeContact, setActiveContact] = useState<string | null>(null);

  // Mock data
  const contacts: Contact[] = [
    { 
      id: '1', 
      name: 'Anurag', 
      online: true, 
      avatar: '/api/placeholder/40/40', 
      lastMessage: 'Hey there!',
      time: '13m'
    },
    { 
      id: '2', 
      name: 'Anton', 
      avatar: '/api/placeholder/40/40', 
      lastMessage: '14340 vb notes',
      time: '15m',
      hasWarning: true
    },
    { 
      id: '3', 
      name: 'Bobbie', 
      avatar: '/api/placeholder/40/40', 
      lastMessage: '14340 vb notes',
      time: '10m',
      hasWarning: true
    },
    { 
      id: '4', 
      name: 'Anurag', 
      avatar: '/api/placeholder/40/40', 
      lastMessage: 'availability',
      time: '34m'
    },
    { 
      id: '5', 
      name: 'Karen', 
      avatar: '/api/placeholder/40/40', 
      lastMessage: '14540 vb notes',
      time: '10m',
      hasWarning: true,
      isUrgent: true
    },
    { 
      id: '6', 
      name: 'Admin', 
      isAdmin: true, 
      avatar: '/api/placeholder/40/40', 
      lastMessage: 'No need to work hard',
      time: '2h'
    },
  ];

  const messages: Message[] = [
    {
      id: '1',
      sender: 'Admin',
      content: 'Hey now!',
      time: '10:25',
      isAdmin: true
    },
    {
      id: '2',
      sender: 'You',
      content: 'Hey, what\'s up! How are you doing, my friend? It\'s been a while 😀',
      time: '10:30',
      isMe: true
    },
    {
      id: '3',
      sender: 'Admin',
      content: 'Have you seen the latest holographic display technology?',
      time: '12:25',
      isAdmin: true
    },
    {
      id: '4',
      sender: 'You',
      content: 'I want to purchase this product do you have this too?',
      time: '10:30',
      isMe: true
    },
    {
      id: '5',
      sender: 'You',
      content: '',
      time: '10:30',
      isMe: true,
      attachment: true
    }
  ];

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center h-full py-16">
      <p className="text-gray-500 mb-4">You have not received any message</p>
      <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
        Start Interacting
      </button>
    </div>
  );

  const renderMessagesList = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="flex items-center text-xl font-medium">
          Messages
          {activeTab === 'customer' ? (
            <span className="ml-2 bg-gray-200 px-2 py-0.5 text-xs rounded-full">12</span>
          ) : (
            <span className="ml-2 bg-gray-200 px-2 py-0.5 text-xs rounded-full">5</span>
          )}
        </h2>
      </div>
      
      {activeTab === 'customer' && (
        <div className="mt-4 px-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search for Contact" 
              className="w-full border rounded-md py-2 pl-8 pr-4"
            />
            <svg className="w-4 h-4 absolute left-2.5 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      )}
      
      <div className="overflow-y-auto flex-1">
        {activeTab === 'admin' ? (
          contacts.filter(contact => contact.isAdmin).map(contact => (
            <div 
              key={contact.id}
              className="flex items-center p-4 border-b hover:bg-gray-50 cursor-pointer"
              onClick={() => setActiveContact(contact.id)}
            >
              <div className="flex-shrink-0">
                <Avatar className="w-10 h-10 rounded-full" >
                    <User className="w-6 h-6" />
                </Avatar>
              </div>
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{contact.name}</span>
                  <span className="text-xs text-gray-500">{contact.time}</span>
                </div>
                <p className="text-sm text-gray-500 truncate">{contact.lastMessage}</p>
              </div>
            </div>
          ))
        ) : (
          contacts.filter(contact => !contact.isAdmin).map(contact => (
            <div 
              key={contact.id}
              className="flex items-center p-4 border-b hover:bg-gray-50 cursor-pointer"
              onClick={() => setActiveContact(contact.id)}
            >
              <div className="flex-shrink-0 relative">
                <Avatar className="w-10 h-10 rounded-full" >
                  <User className="w-6 h-6" />
                </Avatar>
                {contact.online && (
                  <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white"></span>
                )}
              </div>
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{contact.name}</span>
                  <span className="text-xs text-gray-500">{contact.time}</span>
                </div>
                <div className="flex items-center">
                  <p className="text-sm text-gray-500 truncate flex-1">{contact.lastMessage}</p>
                  {contact.hasWarning && (
                    <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded">
                      {contact.isUrgent ? 'Highly Urgent' : 'Question'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderChatView = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex items-center">
          <div className="mr-2">
            {activeTab === 'admin' ? (
              <Avatar className="w-8 h-8 rounded-full" />
            ) : (
              <Avatar className="w-8 h-8 rounded-full" />
            )}
          </div>
          <div>
            <h3 className="font-medium">{activeTab === 'admin' ? 'Admin' : 'Anurag'}</h3>
            {activeTab === 'customer' && (
              <div className="flex items-center text-xs text-gray-500">
                <span className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
                  Online
                </span>
                <span className="mx-1">•</span>
                <span>@anuragdesigns_1997</span>
              </div>
            )}
            {activeTab === 'admin' && (
              <div className="flex items-center text-xs text-gray-500">
                <span className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
                  Online
                </span>
              </div>
            )}
          </div>
        </div>

        {activeTab === 'customer' ? (
          <button className="px-3 py-1 border text-sm rounded hover:bg-gray-50">
            Report
          </button>
        ) : (
          <button className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Request for Call
            </span>
          </button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="text-center text-xs text-gray-500 my-2">25 April</div>
        
        {messages.map((message) => (
          <div key={message.id} className={`mb-4 flex ${message.isMe ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md ${message.isMe ? 'order-2' : 'order-1'}`}>
              <div className="flex items-end">
                {!message.isMe && (
                  <Avatar className="w-6 h-6 rounded-full mr-2 mb-1" />
                )}
                <div>
                  <div className={`px-4 py-2 rounded-lg ${message.isMe ? 'bg-red-500 text-white' : 'bg-gray-100'}`}>
                    {message.content && <p>{message.content}</p>}
                    {message.attachment && (
                      <div className="relative mt-2 bg-gray-200 rounded-lg overflow-hidden">
                       <Avatar className="w-12 h-12 rounded-full" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className={`text-xs text-gray-500 mt-1 flex items-center ${message.isMe ? 'justify-end' : 'justify-start'}`}>
                    {message.time}
                    {message.isMe && (
                      <svg className="w-4 h-4 ml-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t">
        <div className="flex items-center">
          <div className="flex-1 border rounded-lg overflow-hidden flex">
            <svg className="w-6 h-6 text-gray-400 mx-2 my-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
            <input 
              type="text" 
              placeholder="Send a message..." 
              className="py-2 px-2 w-full focus:outline-none"
            />
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
          <button className="ml-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
            <div className="flex items-center">
              <span className="mr-1">Send</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className=" h-screen">

<div className="flex items-center w-full bg-white p-4 border border-gray-200 mb-4 rounded-xl">
          <div className="flex w-full items-center gap-8 pl-6">
          <button
            className={` py-1 text-center text-sm ${activeTab === 'customer' ? 'border-b-2 border-red-500 font-medium text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-500 w-fit' : 'text-gray-500'}`}
            onClick={() => setActiveTab('customer')}
          >
            Buyers message
          </button>
          <button
            className={` py-1 text-center text-sm ${activeTab === 'admin' ? 'border-b-2 border-red-500 font-medium text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-500 w-fit ' : 'text-gray-500'}`}
            onClick={() => setActiveTab('admin')}
          >
            Admin message
          </button>
        </div>
        </div>
      {/* Left sidebar */}
      <div   className="flex items-start gap-8 h-full">
      <div className="w-64 border-r flex flex-col bg-white">
      
        
     
        
     
        
        <div className="flex-1 overflow-y-auto bg-white">
          {!activeContact ? renderMessagesList() : null}
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col bg-white h-full">
        {activeContact ? (
          renderChatView()
        ) : (
          activeTab === 'customer' ? renderEmptyState() : renderChatView()
        )}
      </div>
      
      {/* UI Controls at bottom */}
     

      {/* Right sidebar */}
        </div>
    </div>
  );
};

export default KollaBeeMessaging;