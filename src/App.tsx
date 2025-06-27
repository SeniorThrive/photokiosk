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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                <Camera className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-black tracking-tight">Family Photos</h1>
                <p className="text-sm text-gray-500">Stay connected with your loved ones</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setCurrentView('family')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    currentView === 'family'
                      ? 'bg-white text-black shadow-sm'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  Family
                </button>
                <button
                  onClick={() => setCurrentView('caregiver')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    currentView === 'caregiver'
                      ? 'bg-white text-black shadow-sm'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  Caregiver
                </button>
              </div>
              <div className="relative">
                <Bell className="h-5 w-5 text-gray-600" />
                {photos.some(p => p.hasNewActivity) && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="space-y-12">
          {photos.map((photo) => (
            <article key={photo.id} className="bg-white">
              {/* Photo Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-black">{photo.uploadedBy}</span>
                      {photo.isCaregiver && (
                        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                          Caregiver
                        </span>
                      )}
                      {photo.hasNewActivity && (
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{photo.timestamp}</p>
                  </div>
                </div>
              </div>

              {/* Photo */}
              <div className="mb-4">
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="w-full rounded-lg cursor-pointer"
                  onClick={() => setSelectedPhoto(photo)}
                />
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-4 mb-3">
                <button
                  onClick={() => handleLike(photo.id)}
                  className="flex items-center space-x-1 text-gray-600 hover:text-black transition-colors"
                >
                  <Heart className="h-5 w-5" />
                  <span className="text-sm font-medium">{photo.likes}</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-600 hover:text-black transition-colors">
                  <MessageCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">{photo.comments.length}</span>
                </button>
              </div>

              {/* Caption */}
              <div className="mb-4">
                <p className="text-sm text-black leading-relaxed">{photo.caption}</p>
              </div>

              {/* Comments */}
              {photo.comments.length > 0 && (
                <div className="space-y-3 mb-4">
                  {photo.comments.map((comment) => (
                    <div key={comment.id} className="text-sm">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-black">{comment.author}</span>
                        {comment.isCaregiver && (
                          <span className="text-xs text-blue-600">Caregiver</span>
                        )}
                        <span className="text-xs text-gray-500">{comment.timestamp}</span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{comment.message}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Quick Replies */}
              <div className="flex flex-wrap gap-2 mb-4">
                {QUICK_REPLIES.map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickReply(photo.id, reply)}
                    className="text-xs text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full transition-colors"
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
                  placeholder="Add a comment..."
                  className="flex-1 text-sm border-0 border-b border-gray-200 focus:border-black focus:outline-none pb-2 bg-transparent"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && newComment.trim()) {
                      handleComment(photo.id, newComment);
                    }
                  }}
                />
                <button
                  onClick={() => newComment.trim() && handleComment(photo.id, newComment)}
                  disabled={!newComment.trim()}
                  className="text-blue-600 disabled:text-gray-400 text-sm font-medium"
                >
                  Post
                </button>
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-medium text-black">{selectedPhoto.caption}</h3>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="text-gray-500 hover:text-black"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-auto max-h-[calc(90vh-80px)]">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.caption}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;