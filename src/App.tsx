import React, { useState } from 'react';
import { Heart, MessageCircle, Camera, Bell, Send, User, Clock, X } from 'lucide-react';

interface Photo {
  id: string;
  url: string;
  caption: string;
  timestamp: string;
  uploadedBy: string;
  isCaregiver: boolean;
  likes: number;
  comments: Comment[];
  hasNewActivity: boolean;
}

interface Comment {
  id: string;
  author: string;
  message: string;
  timestamp: string;
  isCaregiver: boolean;
}

const QUICK_REPLIES = [
  "❤️ Love this!",
  "😊 So sweet!",
  "👏 Beautiful!",
  "🥰 Miss you!",
  "📞 Call me later",
  "🙏 Thank you"
];

function App() {
  const [currentView, setCurrentView] = useState<'family' | 'caregiver'>('family');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [newComment, setNewComment] = useState('');

  const [photos, setPhotos] = useState<Photo[]>([
    {
      id: '1',
      url: 'https://images.pexels.com/photos/1128318/pexels-photo-1128318.jpeg?auto=compress&cs=tinysrgb&w=800',
      caption: 'Grandma enjoying her afternoon tea in the garden',
      timestamp: '2 hours ago',
      uploadedBy: 'Sarah (Caregiver)',
      isCaregiver: true,
      likes: 5,
      hasNewActivity: true,
      comments: [
        {
          id: '1',
          author: 'Mom',
          message: 'She looks so peaceful! Thank you for taking such good care of her.',
          timestamp: '1 hour ago',
          isCaregiver: false
        }
      ]
    },
    {
      id: '2',
      url: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=800',
      caption: 'Reading time with her favorite book',
      timestamp: '5 hours ago',
      uploadedBy: 'Mike (Caregiver)',
      isCaregiver: true,
      likes: 8,
      hasNewActivity: false,
      comments: [
        {
          id: '2',
          author: 'David',
          message: 'That\'s her favorite mystery novel! She\'s read it three times.',
          timestamp: '3 hours ago',
          isCaregiver: false
        },
        {
          id: '3',
          author: 'Mike (Caregiver)',
          message: 'She told me all about the plot! She has such a great memory for stories.',
          timestamp: '2 hours ago',
          isCaregiver: true
        }
      ]
    },
    {
      id: '3',
      url: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=800',
      caption: 'Family dinner last Sunday',
      timestamp: '3 days ago',
      uploadedBy: 'Jennifer',
      isCaregiver: false,
      likes: 12,
      hasNewActivity: false,
      comments: []
    }
  ]);

  const handleLike = (photoId: string) => {
    setPhotos(photos.map(photo => 
      photo.id === photoId 
        ? { ...photo, likes: photo.likes + 1 }
        : photo
    ));
  };

  const handleComment = (photoId: string, message: string) => {
    const newCommentObj: Comment = {
      id: Date.now().toString(),
      author: currentView === 'caregiver' ? 'Sarah (Caregiver)' : 'Family Member',
      message,
      timestamp: 'Just now',
      isCaregiver: currentView === 'caregiver'
    };

    setPhotos(photos.map(photo => 
      photo.id === photoId 
        ? { 
            ...photo, 
            comments: [...photo.comments, newCommentObj],
            hasNewActivity: true
          }
        : photo
    ));
    setNewComment('');
  };

  const handleQuickReply = (photoId: string, reply: string) => {
    handleComment(photoId, reply);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200/60 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <Camera className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Family Photos</h1>
                <p className="text-sm text-slate-500 mt-0.5">Stay connected with your loved ones</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex bg-slate-100/80 rounded-xl p-1.5 shadow-inner">
                <button
                  onClick={() => setCurrentView('family')}
                  className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    currentView === 'family'
                      ? 'bg-white text-blue-600 shadow-md transform scale-105'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  Family View
                </button>
                <button
                  onClick={() => setCurrentView('caregiver')}
                  className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    currentView === 'caregiver'
                      ? 'bg-white text-blue-600 shadow-md transform scale-105'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  Caregiver View
                </button>
              </div>
              <div className="relative">
                <Bell className="h-6 w-6 text-slate-600 hover:text-slate-900 cursor-pointer transition-colors" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {photos.map((photo) => (
            <article key={photo.id} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 overflow-hidden hover:shadow-xl transition-all duration-300">
              {/* Photo Header */}
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-slate-600" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-slate-900">{photo.uploadedBy}</span>
                          {photo.isCaregiver && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                              <Clock className="h-3 w-3 mr-1" />
                              Caregiver Visit
                            </span>
                          )}
                          {photo.hasNewActivity && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200 animate-pulse">
                              <Bell className="h-3 w-3 mr-1" />
                              New Activity
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-500 mt-0.5">{photo.timestamp}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Photo */}
              <div className="relative group">
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="w-full h-96 object-cover cursor-pointer transition-transform duration-300 group-hover:scale-[1.02]"
                  onClick={() => setSelectedPhoto(photo)}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
              </div>

              {/* Photo Footer */}
              <div className="p-6">
                <p className="text-slate-900 text-lg leading-relaxed mb-5">{photo.caption}</p>
                
                {/* Actions */}
                <div className="flex items-center space-x-6 mb-6">
                  <button
                    onClick={() => handleLike(photo.id)}
                    className="flex items-center space-x-2 text-slate-600 hover:text-red-500 transition-colors duration-200 group"
                  >
                    <Heart className="h-6 w-6 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">{photo.likes}</span>
                  </button>
                  <button className="flex items-center space-x-2 text-slate-600 hover:text-blue-500 transition-colors duration-200 group">
                    <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">{photo.comments.length}</span>
                  </button>
                </div>

                {/* Comments */}
                {photo.comments.length > 0 && (
                  <div className="space-y-4 mb-6">
                    {photo.comments.map((comment) => (
                      <div key={comment.id} className="bg-slate-50/80 rounded-xl p-4 border border-slate-100">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-slate-900">{comment.author}</span>
                            {comment.isCaregiver && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                                Caregiver
                              </span>
                            )}
                          </div>
                          <span className="text-sm text-slate-500">{comment.timestamp}</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed">{comment.message}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quick Reply Buttons */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {QUICK_REPLIES.map((reply, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickReply(photo.id, reply)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-full text-sm text-slate-700 transition-all duration-200 hover:scale-105 hover:shadow-md border border-slate-200"
                    >
                      {reply}
                    </button>
                  ))}
                </div>

                {/* Comment Input */}
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a heartfelt comment..."
                    className="flex-1 px-5 py-3 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-200"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && newComment.trim()) {
                        handleComment(photo.id, newComment);
                      }
                    }}
                  />
                  <button
                    onClick={() => newComment.trim() && handleComment(photo.id, newComment)}
                    disabled={!newComment.trim()}
                    className="px-5 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:hover:scale-100 disabled:hover:shadow-none"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-900">{selectedPhoto.caption}</h3>
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="overflow-auto max-h-[calc(90vh-120px)]">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.caption}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;