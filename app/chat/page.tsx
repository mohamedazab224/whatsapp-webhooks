// app/chat/page.tsx - النسخة المكتملة
'use client';

import { useState, useEffect, useRef } from 'react';

export default function ChatPage() {
  const [userId, setUserId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<Array<{role: string, content: string, sources?: any[], files?: any[]}>>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // جلب مشاريع المستخدم
  useEffect(() => {
    if (userId) {
      fetchProjects();
    }
  }, [userId]);

  const fetchProjects = async () => {
    try {
      const res = await fetch(`/api/projects?userId=${userId}&action=list`);
      const data = await res.json();
      setProjects(data.projects || []);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  const importExistingFolders = async () => {
    if (!userId) return;
    
    setImporting(true);
    try {
      const res = await fetch(`/api/projects?userId=${userId}&action=import`);
      const data = await res.json();
      
      if (data.success) {
        alert(`✅ تم استيراد ${data.projects.length} مشروع`);
        fetchProjects(); // تحديث القائمة
      }
    } catch (error) {
      console.error('Failed to import folders:', error);
      alert('❌ فشل في استيراد المجلدات');
    } finally {
      setImporting(false);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !userId || !projectId) {
      alert('يرجى اختيار مشروع وإدخال رسالة');
      return;
    }

    const userMessage = message;
    setMessage('');
    setLoading(true);

    // إضافة رسالة المستخدم
    const newConversation = [...conversation, { 
      role: 'user', 
      content: userMessage 
    }];
    setConversation(newConversation);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          projectId,
          message: userMessage,
          sessionId: 'web-session'
        })
      });

      const data = await res.json();
      
      if (data.success) {
        setConversation([
          ...newConversation,
          { 
            role: 'assistant', 
            content: data.answer,
            sources: data.sources || [],
            files: data.files || []
          }
        ]);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setConversation([
        ...newConversation,
        { 
          role: 'assistant', 
          content: '❌ فشل في إرسال الرسالة. حاول مرة أخرى.' 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const performSearch = async () => {
    if (!searchQuery.trim() || !userId || !projectId) {
      alert('يرجى إدخال كلمة البحث واختيار المشروع');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/search?userId=${userId}&action=smart&query=${encodeURIComponent(searchQuery)}&projectId=${projectId}`);
      const data = await res.json();
      
      if (data.success) {
        setSearchResults(data.results || []);
        setShowSearchResults(true);
      }
    } catch (error) {
      console.error('Failed to search:', error);
      alert('فشل في البحث');
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setConversation([]);
    if (userId && projectId) {
      fetch(`/api/chat?userId=${userId}&projectId=${projectId}&action=clear`);
    }
  };

  const getFileIcon = (fileType: string) => {
    const type = fileType?.toLowerCase();
    if (type.includes('pdf')) return '📄';
    if (type.includes('image') || type.includes('img')) return '🖼️';
    if (type.includes('video')) return '🎥';
    if (type.includes('excel') || type.includes('xlsx') || type.includes('csv')) return '📊';
    if (type.includes('cad')) return '📐';
    if (type.includes('document') || type.includes('doc')) return '📝';
    if (type.includes('text') || type.includes('txt')) return '📋';
    return '📁';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // التمرير إلى آخر رسالة
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* الرأس */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              🤖 دردشة ذكية مع DeepSeek
            </h1>
            <p className="text-gray-600 mt-2">
              استخرج المعلومات من ملفاتك المخزنة في Supabase Storage
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-3">
            <button
              onClick={() => window.open('https://zrrffsjbfkphridqyais.supabase.co', '_blank')}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 flex items-center gap-2"
            >
              <span>🔗</span> Supabase Dashboard
            </button>
            <button
              onClick={importExistingFolders}
              disabled={importing || !userId}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              {importing ? '🔄 جاري الاستيراد...' : '📥 استيراد المجلدات'}
            </button>
          </div>
        </div>

        {/* معلومات التخزين */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg p-5 md:p-6 mb-8 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold mb-2">📍 موقع التخزين الحالي</h3>
              <p className="text-blue-100 text-sm md:text-base break-all">
                https://zrrffsjbfkphridqyais.supabase.co/storage/v1/object/public/whatsapp-media/
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {['pdf', 'img', 'video', 'xlsx', 'cad', 'cvs'].map(folder => (
                  <span key={folder} className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                    📁 {folder}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">
                {projects.reduce((sum, p) => sum + (p.ai_project_files?.[0]?.count || 0), 0)}
              </div>
              <div className="text-blue-100">ملف مخزن</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* الجزء الأيسر: التحكم والمشاريع */}
          <div className="lg:col-span-1 space-y-6">
            {/* بطاقة المستخدم */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">👤 معلومات المستخدم</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    معرف المستخدم
                  </label>
                  <input
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="أدخل ID المستخدم"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المشروع المختار
                  </label>
                  <select
                    value={projectId}
                    onChange={(e) => {
                      setProjectId(e.target.value);
                      setShowSearchResults(false);
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={!userId || projects.length === 0}
                  >
                    <option value="">-- اختر مشروعا --</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {getFileIcon(project.project_name)} {project.project_name} 
                        ({project.ai_project_files?.[0]?.count || 0})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={fetchProjects}
                    disabled={!userId}
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    🔄 تحديث
                  </button>
                  <button
                    onClick={clearChat}
                    disabled={!projectId}
                    className="flex-1 px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    🗑️ مسح المحادثة
                  </button>
                </div>
              </div>
            </div>

            {/* بطاقة البحث */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">🔍 بحث سريع</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    كلمة البحث
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && performSearch()}
                      placeholder="ابحث في الملفات..."
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={!projectId}
                    />
                    <button
                      onClick={performSearch}
                      disabled={!searchQuery.trim() || !projectId}
                      className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      🔎
                    </button>
                  </div>
                </div>
                
                {showSearchResults && searchResults.length > 0 && (
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-gray-700">نتائج البحث ({searchResults.length})</h4>
                      <button
                        onClick={() => setShowSearchResults(false)}
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        ✕ إغلاق
                      </button>
                    </div>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {searchResults.map((result, index) => (
                        <div key={index} className="border rounded-lg p-3 hover:bg-gray-50">
                          <div className="flex items-center gap-2 mb-1">
                            <span>{getFileIcon(result.file_type)}</span>
                            <span className="font-medium truncate">{result.original_filename}</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {result.file_type} • {formatFileSize(result.file_size || 0)}
                          </div>
                          {result.text_content_preview && (
                            <div className="text-sm text-gray-600 mt-2 line-clamp-2">
                              {result.text_content_preview}
                            </div>
                          )}
                          <a
                            href={result.storage_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:text-blue-800 mt-2 inline-block"
                          >
                            🔗 فتح الملف
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* بطاقة المشاريع */}
            {projects.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">📂 جميع المشاريع</h3>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                        projectId === project.id 
                          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100' 
                          : 'hover:border-blue-300 hover:bg-gray-50'
                      }`}
                      onClick={() => {
                        setProjectId(project.id);
                        setConversation([]);
                        setShowSearchResults(false);
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">
                            {getFileIcon(project.project_name)}
                          </span>
                          <span className="font-semibold text-gray-800">
                            {project.project_name}
                          </span>
                        </div>
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                          {project.ai_project_files?.[0]?.count || 0} ملف
                        </span>
                      </div>
                      {project.project_description && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {project.project_description}
                        </p>
                      )}
                      <div className="text-xs text-gray-500">
                        {project.bucket_path}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* الجزء الأيمن: الدردشة */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg h-[600px] md:h-[700px] flex flex-col">
              {/* رأس المحادثة */}
              <div className="border-b p-4 md:p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                      {projectId 
                        ? `💬 دردشة مع ${projects.find(p => p.id === projectId)?.project_name || 'المشروع'}`
                        : '💬 اختر مشروعاً للبدء'
                      }
                    </h2>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-sm text-gray-500">
                        {conversation.length} رسالة
                      </span>
                      <span className="px-2 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-600 rounded-full text-xs">
                        DeepSeek AI
                      </span>
                      <span className="px-2 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-600 rounded-full text-xs">
                        Supabase
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => window.open('https://zrrffsjbfkphridqyais.supabase.co/storage/v1/object/public/whatsapp-media', '_blank')}
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:opacity-90 flex items-center gap-2"
                    >
                      <span>📁</span>
                      <span className="hidden md:inline">فتح التخزين</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* محتوى الدردشة */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6">
                {conversation.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8">
                    <div className="text-7xl mb-6 animate-pulse">🤖</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">
                      مرحباً! أنا مساعد DeepSeek الذكي
                    </h3>
                    <p className="text-gray-600 max-w-md mb-8">
                      اختر مشروعاً من القائمة وابدأ بطرح أسئلتك. يمكنني مساعدتك في:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg">
                      {[
                        '🔍 البحث في الملفات',
                        '📊 تحليل البيانات',
                        '📄 استخراج المعلومات',
                        '💡 تلخيص المحتوى',
                        '🔗 ربط المعلومات',
                        '📋 الإجابة على الأسئلة'
                      ].map((feature, idx) => (
                        <div key={idx} className="bg-gray-50 rounded-lg p-4 text-center">
                          <div className="text-lg mb-2">{feature.split(' ')[0]}</div>
                          <div className="text-sm text-gray-600">{feature.substring(2)}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-8 text-sm text-gray-500">
                      مثال: "ما هي الملفات المتاحة؟" أو "ابحث عن كلمة 'عقد'"
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {conversation.map((msg, index) => (
                      <div key={index} className="animate-fadeIn">
                        <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div
                            className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-5 ${
                              msg.role === 'user'
                                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                msg.role === 'user' ? 'bg-white/20' : 'bg-white'
                              }`}>
                                {msg.role === 'user' ? '👤' : '🤖'}
                              </div>
                              <div className="font-semibold">
                                {msg.role === 'user' ? 'أنت' : 'DeepSeek Assistant'}
                              </div>
                            </div>
                            <div className="whitespace-pre-wrap leading-relaxed">
                              {msg.content}
                            </div>
                            
                            {/* عرض مصادر المعلومات */}
                            {msg.role === 'assistant' && msg.sources && msg.sources.length > 0 && (
                              <div className="mt-4 pt-4 border-t border-white/20">
                                <div className="text-sm font-medium mb-2">📚 المصادر المستخدمة:</div>
                                <div className="flex flex-wrap gap-2">
                                  {msg.sources.slice(0, 3).map((source: any, idx: number) => (
                                    <a
                                      key={idx}
                                      href={source.file_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs px-3 py-1.5 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                                    >
                                      📄 {source.file_name}
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* عرض الملفات المقترحة */}
                        {msg.role === 'assistant' && msg.files && msg.files.length > 0 && (
                          <div className="mt-3 ml-4">
                            <div className="text-sm text-gray-500 mb-2">📁 ملفات ذات صلة:</div>
                            <div className="flex overflow-x-auto gap-2 pb-2">
                              {msg.files.slice(0, 5).map((file: any, idx: number) => (
                                <a
                                  key={idx}
                                  href={file.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-shrink-0 bg-white border rounded-lg p-3 hover:shadow-md transition-shadow min-w-[180px]"
                                >
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="text-lg">{getFileIcon(file.type)}</span>
                                    <div className="font-medium text-sm truncate">
                                      {file.name}
                                    </div>
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {formatFileSize(file.size || 0)}
                                  </div>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>
                )}
              </div>

              {/* إدخال الرسالة */}
              <div className="border-t p-4 md:p-6 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                    placeholder={
                      projectId 
                        ? `اسأل عن ${projects.find(p => p.id === projectId)?.project_name || 'المشروع'}... (اضغط Enter للإرسال)`
                        : 'اختر مشروعاً أولاً...'
                    }
                    className="flex-1 px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    disabled={loading || !projectId}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={loading || !projectId || !message.trim()}
                    className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="animate-spin">⟳</span>
                        <span className="hidden md:inline">جاري الإرسال...</span>
                      </>
                    ) : (
                      <>
                        <span>🚀</span>
                        <span className="hidden md:inline">إرسال</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="flex flex-wrap gap-3 mt-4">
                  {[
                    'ما هي الملفات المتاحة؟',
                    'لخص محتوى الملفات',
                    'ابحث عن كلمة مهمة',
                    'ما حجم التخزين؟'
                  ].map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => setMessage(suggestion)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* التذييل */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>
            نظام الذكاء الاصطناعي المتقدم مع DeepSeek و Supabase Storage
          </p>
          <p className="mt-1">
            يدعم جميع أنواع الملفات: PDF, صور, فيديو, Excel, CAD, مستندات نصية
          </p>
          <div className="mt-4 flex justify-center gap-6">
            <a 
              href="https://deepseek.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
              <span>⚡</span> DeepSeek API
            </a>
            <a 
              href="https://supabase.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-green-600 hover:text-green-800"
            >
              <span>🛢️</span> Supabase Storage
            </a>
            <a 
              href="https://nextjs.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <span>▲</span> Next.js 14
            </a>
          </div>
        </div>
      </div>

      {/* CSS للرسوم المتحركة */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .line-clamp-2 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
      `}</style>
    </div>
  );
}
