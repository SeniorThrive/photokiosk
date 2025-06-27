import React, { useState } from 'react';
import { Heart, MessageCircle, Camera, Bell, Send, User, Clock } from 'lucide-react';

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
      url: 'https://images.pexels.com/photos/1128318/pexels-photo-1128318.jpeg?auto=compress&cs=tinysrgb&w=400',
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
      url: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=400',
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
      url: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Camera className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Family Photos</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setCurrentView('family')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === 'family'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Family View
                </button>
                <button
                  onClick={() => setCurrentView('caregiver')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === 'caregiver'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Caregiver View
                </button>
              </div>
              <Bell className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid gap-6">
          {photos.map((photo) => (
            <div key={photo.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
              {/* Photo Header */}
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <User className="h-5 w-5 text-gray-400" />
                      <span className="font-medium text-gray-900">{photo.uploadedBy}</span>
                      {photo.isCaregiver && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <Clock className="h-3 w-3 mr-1" />
                          Caregiver Visit
                        </span>
                      )}
                      {photo.hasNewActivity && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <Bell className="h-3 w-3 mr-1" />
                          New Activity
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{photo.timestamp}</span>
                </div>
              </div>

              {/* Photo */}
              <div className="relative">
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="w-full h-96 object-cover cursor-pointer hover:opacity-95 transition-opacity"
                  onClick={() => setSelectedPhoto(photo)}
                />
              </div>

              {/* Photo Footer */}
              <div className="p-4">
                <p className="text-gray-900 mb-3">{photo.caption}</p>
                
                {/* Actions */}
                <div className="flex items-center space-x-4 mb-4">
                  <button
                    onClick={() => handleLike(photo.id)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors"
                  >
                    <Heart className="h-5 w-5" />
                    <span>{photo.likes}</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors">
                    <MessageCircle className="h-5 w-5" />
                    <span>{photo.comments.length}</span>
                  </button>
                </div>

                {/* Comments */}
                {photo.comments.length > 0 && (
                  <div className="space-y-3 mb-4">
                    {photo.comments.map((comment) => (
                      <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-sm text-gray-900">{comment.author}</span>
                            {comment.isCaregiver && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                Caregiver
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">{comment.timestamp}</span>
                        </div>
                        <p className="text-gray-700 text-sm">{comment.message}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quick Reply Buttons */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {QUICK_REPLIES.map((reply, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickReply(photo.id, reply)}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
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
                    placeholder="Write a comment..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && newComment.trim()) {
                        handleComment(photo.id, newComment);
                      }
                    }}
                  />
                  <button
                    onClick={() => newComment.trim() && handleComment(photo.id, newComment)}
                    disabled={!newComment.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-full overflow-auto">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{selectedPhoto.caption}</h3>
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.caption}
              className="w-full h-auto max-h-96 object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;