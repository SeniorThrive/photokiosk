import React, { useState, useEffect } from 'react';
import { Camera, Heart, Share2, Settings, Bell, ArrowLeft, Plus, Check, X, ZoomIn, Users, Shield, Wifi, WifiOff, MessageCircle, ChevronRight, Upload, Link, UserCheck } from 'lucide-react';

interface Photo {
  id: string;
  src: string;
  alt: string;
  selected?: boolean;
}

interface SharedPhoto {
  id: string;
  src: string;
  alt: string;
  note: string;
  sender: string;
  timestamp: Date;
  liked?: boolean;
  seen?: boolean;
  source?: 'family' | 'caregiver';
  seniorResponse?: string;
}

const mockPhotos: Photo[] = [
  { id: '1', src: 'https://images.pexels.com/photos/1128318/pexels-photo-1128318.jpeg?auto=compress&cs=tinysrgb&w=400', alt: 'Garden flowers' },
  { id: '2', src: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=400', alt: 'Family dinner' },
  { id: '3', src: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400', alt: 'Sunset walk' },
  { id: '4', src: 'https://images.pexels.com/photos/1144176/pexels-photo-1144176.jpeg?auto=compress&cs=tinysrgb&w=400', alt: 'Beach day' },
  { id: '5', src: 'https://images.pexels.com/photos/1181317/pexels-photo-1181317.jpeg?auto=compress&cs=tinysrgb&w=400', alt: 'Morning coffee' },
  { id: '6', src: 'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&w=400', alt: 'Park visit' },
];

const mockSharedPhotos: SharedPhoto[] = [
  {
    id: '1',
    src: 'https://images.pexels.com/photos/1128318/pexels-photo-1128318.jpeg?auto=compress&cs=tinysrgb&w=400',
    alt: 'Garden flowers',
    note: 'Hope this brightens your day! The roses are blooming beautifully this spring.',
    sender: 'Sarah',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    liked: false,
    seen: false,
    source: 'family'
  },
  {
    id: '2',
    src: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=400',
    alt: 'Family dinner',
    note: 'Missing you at dinner tonight. The kids were asking about your famous apple pie recipe!',
    sender: 'Michael',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    liked: true,
    seen: true,
    source: 'family',
    seniorResponse: 'Thank you!'
  },
  {
    id: '3',
    src: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400',
    alt: 'Sunset walk',
    note: 'Took this during my evening walk and thought of our walks together. Love you!',
    sender: 'Emma',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
    liked: false,
    seen: true,
    source: 'family'
  },
  {
    id: '4',
    src: 'https://images.pexels.com/photos/1144176/pexels-photo-1144176.jpeg?auto=compress&cs=tinysrgb&w=400',
    alt: 'Daily check-in',
    note: 'Had a wonderful visit today! Your mom was in great spirits and we enjoyed tea together.',
    sender: 'Nurse Jennifer',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
    liked: false,
    seen: false,
    source: 'caregiver'
  }
];

const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (minutes < 60) {
    return `${minutes} minutes ago`;
  } else if (hours < 24) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
};

function App() {
  const [currentView, setCurrentView] = useState<'senior-hub' | 'family-hub' | 'photo-feed' | 'share-photos' | 'photo-detail' | 'settings' | 'connect-photos'>('senior-hub');
  const [selectedPhotos, setSelectedPhotos] = useState<Photo[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [shareNote, setShareNote] = useState('');
  const [sharedPhotos, setSharedPhotos] = useState<SharedPhoto[]>(mockSharedPhotos);
  const [isConnected, setIsConnected] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [notifications, setNotifications] = useState(2);
  const [selectedPhoto, setSelectedPhoto] = useState<SharedPhoto | null>(null);
  const [userType, setUserType] = useState<'senior' | 'family'>('senior');
  const [monthlyUploads, setMonthlyUploads] = useState(7); // 7 out of 10 used
  const [connectionType, setConnectionType] = useState<'none' | 'google' | 'apple' | 'upload'>('none');

  useEffect(() => {
    // Simulate network status
    const interval = setInterval(() => {
      setIsOnline(Math.random() > 0.1); // 90% online
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const connectPhotos = (source: 'google' | 'apple' | 'upload') => {
    setIsConnected(true);
    setConnectionType(source);
    setPhotos(mockPhotos);
    setCurrentView('share-photos');
  };

  const togglePhotoSelection = (photo: Photo) => {
    const isSelected = selectedPhotos.find(p => p.id === photo.id);
    if (isSelected) {
      setSelectedPhotos(prev => prev.filter(p => p.id !== photo.id));
    } else if (connectionType === 'upload' && selectedPhotos.length >= monthlyUploads) {
      // Only limit for upload, not for Google/Apple
      return;
    } else {
      setSelectedPhotos(prev => [...prev, photo]);
    }
  };

  const sharePhotos = () => {
    const newSharedPhotos = selectedPhotos.map(photo => ({
      ...photo,
      note: shareNote || 'Sharing this special moment with you',
      sender: 'You',
      timestamp: new Date(),
      liked: false,
      seen: false,
      source: 'family' as const
    }));
    
    setSharedPhotos(prev => [...newSharedPhotos, ...prev]);
    if (connectionType === 'upload') {
      setMonthlyUploads(prev => prev - selectedPhotos.length);
    }
    setSelectedPhotos([]);
    setShareNote('');
    setCurrentView('senior-hub');
  };

  const likePhoto = (photoId: string) => {
    setSharedPhotos(prev => prev.map(photo => 
      photo.id === photoId ? { ...photo, liked: !photo.liked } : photo
    ));
  };

  const markPhotoAsSeen = (photoId: string) => {
    setSharedPhotos(prev => prev.map(photo => 
      photo.id === photoId ? { ...photo, seen: true } : photo
    ));
  };

  const handleSeniorResponse = (photoId: string, response: string) => {
    setSharedPhotos(prev => prev.map(photo => 
      photo.id === photoId ? { ...photo, seniorResponse: response } : photo
    ));
  };

  // SENIOR USER VIEWS
  if (currentView === 'senior-hub') {
    const unseenPhotos = sharedPhotos.filter(photo => !photo.seen);
    const displayedPhotos = sharedPhotos;

    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-r from-orange-400 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Photo Kiosk</h1>
                  <p className="text-gray-600 text-lg">Share smiles, not complexity</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setCurrentView('settings')}
                  className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all"
                >
                  <Settings className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* New Photos Alert */}
          {unseenPhotos.length > 0 && (
            <div className="mb-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl p-8 text-white shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Bell className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">New Photos Just Arrived!</h3>
                    <p className="text-blue-100 text-lg">Your family shared {unseenPhotos.length} special moment{unseenPhotos.length > 1 ? 's' : ''} with you</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Family Photos Preview - Takes up 2/3 of the space */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900">Your Family Photos</h2>
              </div>

              {sharedPhotos.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-lg p-16 text-center border border-gray-100">
                  <Camera className="w-24 h-24 text-gray-300 mx-auto mb-8" />
                  <h3 className="text-2xl font-bold text-gray-700 mb-4">No photos yet</h3>
                  <p className="text-gray-500 text-lg leading-relaxed">
                    When your family shares photos with you, they'll appear here with their personal messages.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {displayedPhotos.map((photo: SharedPhoto) => (
                    <div key={photo.id} className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow">
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                              photo.source === 'caregiver' 
                                ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                                : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                            }`}>
                              {photo.source === 'caregiver' ? (
                                <UserCheck className="w-6 h-6 text-white" />
                              ) : (
                                <span className="text-white font-bold text-lg">
                                  {photo.sender[0]}
                                </span>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <div className="font-bold text-gray-900 text-lg">{photo.sender}</div>
                                {photo.source === 'caregiver' && (
                                  <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">
                                    Caregiver Visit
                                  </span>
                                )}
                              </div>
                              <div className="text-gray-500">{formatTimeAgo(photo.timestamp)}</div>
                            </div>
                          </div>
                          {!photo.seen && (
                            <div className="w-3 h-3 bg-blue-500 rounded-full shadow-lg"></div>
                          )}
                        </div>
                        
                        <div 
                          className="relative group mb-4 cursor-pointer"
                          onClick={() => {
                            setSelectedPhoto(photo);
                            setCurrentView('photo-detail');
                            markPhotoAsSeen(photo.id);
                          }}
                        >
                          <img
                            src={photo.src}
                            alt={photo.alt}
                            className="w-full h-64 object-cover rounded-2xl transition-transform duration-200 hover:scale-[1.02] shadow-lg"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 rounded-2xl flex items-center justify-center">
                            <ZoomIn className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg" />
                          </div>
                        </div>
                        
                        {photo.note && (
                          <div className="bg-amber-50 rounded-2xl p-4 mb-4 border border-amber-100">
                            <div className="flex items-start space-x-3">
                              <MessageCircle className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
                              <p className="text-gray-700 leading-relaxed">{photo.note}</p>
                            </div>
                          </div>
                        )}

                        {photo.seniorResponse && (
                          <div className="bg-blue-50 rounded-2xl p-4 mb-4 border border-blue-100">
                            <div className="flex items-start space-x-3">
                              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-xs font-bold">You</span>
                              </div>
                              <p className="text-blue-800 leading-relaxed font-medium">{photo.seniorResponse}</p>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => likePhoto(photo.id)}
                            className={`flex items-center space-x-2 px-6 py-3 rounded-2xl transition-all duration-200 font-bold shadow-lg ${
                              photo.liked
                                ? 'bg-red-50 text-red-600 hover:bg-red-100 border-2 border-red-200'
                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-2 border-gray-200'
                            }`}
                          >
                            <Heart className={`w-6 h-6 ${photo.liked ? 'fill-current' : ''}`} />
                            <span>{photo.liked ? 'Loved!' : 'Love This'}</span>
                          </button>

                          {!photo.seniorResponse && (
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleSeniorResponse(photo.id, 'Thank you!')}
                                className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl font-medium transition-colors border border-blue-200"
                              >
                                Thank you!
                              </button>
                              <button
                                onClick={() => handleSeniorResponse(photo.id, 'Thinking of you!')}
                                className="px-4 py-2 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-xl font-medium transition-colors border border-purple-200"
                              >
                                Thinking of you!
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Share Your Photos - Takes up 1/3 of the space */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 sticky top-8">
                <div className="p-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-orange-400 to-amber-500 rounded-3xl flex items-center justify-center mb-6 shadow-lg mx-auto">
                    <Share2 className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Share Your Moments</h2>
                  <p className="text-gray-600 mb-8 text-lg leading-relaxed text-center">
                    Connect to Google Photos, Apple Photos, or upload directly from your device.
                  </p>
                  <button
                    onClick={() => setCurrentView('connect-photos')}
                    className="w-full bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white font-bold py-5 px-6 rounded-2xl transition-all duration-200 transform hover:scale-[1.02] text-lg shadow-lg"
                  >
                    Share Photos
                  </button>

                  {/* Connection Status */}
                  {isConnected && (
                    <div className="mt-6 p-4 bg-green-50 rounded-2xl border border-green-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <Check className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-green-800">
                          <div className="font-bold">Connected</div>
                          <div className="text-sm text-green-700 capitalize">{connectionType} Photos</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Upload Limit Notice - Only show for upload connection */}
                  {connectionType === 'upload' && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 mb-1">{monthlyUploads}</div>
                        <div className="text-blue-800 text-sm font-medium">uploads remaining</div>
                        <div className="text-blue-600 text-xs mt-1">this month</div>
                      </div>
                    </div>
                  )}

                  {/* Unlimited Notice - Show for Google/Apple */}
                  {(connectionType === 'google' || connectionType === 'apple') && (
                    <div className="mt-6 p-4 bg-purple-50 rounded-2xl border border-purple-100">
                      <div className="text-center">
                        <div className="text-purple-800 font-bold mb-1">Unlimited Sharing</div>
                        <div className="text-purple-600 text-sm">with {connectionType === 'google' ? 'Google' : 'Apple'} Photos</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* User Type Switcher (for demo purposes) */}
              <div className="mt-8 text-center">
                <button
                  onClick={() => {
                    setUserType('family');
                    setCurrentView('family-hub');
                  }}
                  className="text-orange-600 hover:text-orange-700 font-medium text-lg underline"
                >
                  Switch to Family Member View
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'connect-photos') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <button
            onClick={() => setCurrentView('senior-hub')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors text-lg"
          >
            <ArrowLeft className="w-6 h-6 mr-3" />
            Back to Home
          </button>

          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-400 to-amber-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Camera className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Pick or Upload</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Connect to your photos or upload directly from your device. Choose what works best for you.
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => connectPhotos('google')}
                className="w-full flex items-center space-x-6 bg-white border-2 border-gray-200 hover:border-orange-300 hover:bg-orange-50 p-6 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Link className="w-8 h-8 text-white" />
                </div>
                <div className="text-left flex-1">
                  <div className="font-bold text-gray-900 text-xl mb-1">Connect Google Photos</div>
                  <div className="text-gray-600 text-lg">Unlimited sharing from your Google library</div>
                </div>
                <div className="text-right">
                  <div className="text-green-600 font-bold text-sm">UNLIMITED</div>
                </div>
              </button>

              <button
                onClick={() => connectPhotos('apple')}
                className="w-full flex items-center space-x-6 bg-white border-2 border-gray-200 hover:border-orange-300 hover:bg-orange-50 p-6 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center shadow-lg">
                  <Link className="w-8 h-8 text-white" />
                </div>
                <div className="text-left flex-1">
                  <div className="font-bold text-gray-900 text-xl mb-1">Connect Apple Photos</div>
                  <div className="text-gray-600 text-lg">Unlimited sharing from your iCloud library</div>
                </div>
                <div className="text-right">
                  <div className="text-green-600 font-bold text-sm">UNLIMITED</div>
                </div>
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-lg">
                  <span className="bg-white px-4 text-gray-500">or</span>
                </div>
              </div>

              <button
                onClick={() => connectPhotos('upload')}
                className="w-full flex items-center space-x-6 bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white p-6 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <div className="text-left flex-1">
                  <div className="font-bold text-xl mb-1">Upload from Device</div>
                  <div className="text-orange-100 text-lg">Choose photos directly from your device</div>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold text-sm">10/MONTH FREE</div>
                </div>
              </button>
            </div>

            <div className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-100">
              <div className="flex items-start space-x-4">
                <Shield className="w-8 h-8 text-blue-600 mt-1 flex-shrink-0" />
                <div className="text-blue-800">
                  <div className="font-bold text-lg mb-2">Your Privacy Matters</div>
                  <p className="text-blue-700 leading-relaxed">
                    We only access photos you choose to share. Your photo library stays private and secure. 
                    You can revoke access anytime and shared photos will disappear from your family's view.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'photo-feed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <button
            onClick={() => setCurrentView('senior-hub')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors text-lg"
          >
            <ArrowLeft className="w-6 h-6 mr-3" />
            Back to Home
          </button>

          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-900">Your Family Photos</h2>
            
            {sharedPhotos.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-lg p-16 text-center border border-gray-100">
                <Camera className="w-24 h-24 text-gray-300 mx-auto mb-8" />
                <h3 className="text-2xl font-bold text-gray-700 mb-4">No photos yet</h3>
                <p className="text-gray-500 text-lg leading-relaxed">
                  When your family shares photos with you, they'll appear here with their personal messages.
                </p>
              </div>
            ) : (
              sharedPhotos.map((photo: SharedPhoto) => (
                <div key={photo.id} className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${
                          photo.source === 'caregiver' 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                            : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                        }`}>
                          {photo.source === 'caregiver' ? (
                            <UserCheck className="w-8 h-8 text-white" />
                          ) : (
                            <span className="text-white font-bold text-xl">
                              {photo.sender[0]}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <div className="font-bold text-gray-900 text-xl">{photo.sender}</div>
                            {photo.source === 'caregiver' && (
                              <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">
                                Caregiver Visit
                              </span>
                            )}
                          </div>
                          <div className="text-gray-500 text-lg">{formatTimeAgo(photo.timestamp)}</div>
                        </div>
                      </div>
                      {!photo.seen && (
                        <div className="w-4 h-4 bg-blue-500 rounded-full shadow-lg"></div>
                      )}
                    </div>
                    
                    <div 
                      className="relative group mb-6 cursor-pointer"
                      onClick={() => {
                        setSelectedPhoto(photo);
                        setCurrentView('photo-detail');
                        markPhotoAsSeen(photo.id);
                      }}
                    >
                      <img
                        src={photo.src}
                        alt={photo.alt}
                        className="w-full rounded-2xl transition-transform duration-200 hover:scale-[1.02] shadow-lg"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 rounded-2xl flex items-center justify-center">
                        <ZoomIn className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg" />
                      </div>
                    </div>
                    
                    {photo.note && (
                      <div className="bg-amber-50 rounded-2xl p-6 mb-6 border border-amber-100">
                        <div className="flex items-start space-x-4">
                          <MessageCircle className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
                          <p className="text-gray-700 text-lg leading-relaxed">{photo.note}</p>
                        </div>
                      </div>
                    )}

                    {photo.seniorResponse && (
                      <div className="bg-blue-50 rounded-2xl p-6 mb-6 border border-blue-100">
                        <div className="flex items-start space-x-4">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-bold">You</span>
                          </div>
                          <p className="text-blue-800 text-lg leading-relaxed font-medium">{photo.seniorResponse}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-6">
                      <button
                        onClick={() => likePhoto(photo.id)}
                        className={`flex items-center space-x-3 px-8 py-4 rounded-2xl transition-all duration-200 text-lg font-bold shadow-lg ${
                          photo.liked
                            ? 'bg-red-50 text-red-600 hover:bg-red-100 border-2 border-red-200'
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-2 border-gray-200'
                        }`}
                      >
                        <Heart className={`w-7 h-7 ${photo.liked ? 'fill-current' : ''}`} />
                        <span>{photo.liked ? 'Loved!' : 'Love This'}</span>
                      </button>

                      {!photo.seniorResponse && (
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleSeniorResponse(photo.id, 'Thank you!')}
                            className="px-6 py-3 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl font-medium transition-colors border border-blue-200"
                          >
                            Thank you!
                          </button>
                          <button
                            onClick={() => handleSeniorResponse(photo.id, 'Thinking of you!')}
                            className="px-6 py-3 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-xl font-medium transition-colors border border-purple-200"
                          >
                            Thinking of you!
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'photo-detail') {
    if (!selectedPhoto) return null;

    return (
      <div className="min-h-screen bg-black">
        <div className="relative">
          <button
            onClick={() => setCurrentView('senior-hub')}
            className="absolute top-6 left-6 z-10 flex items-center text-white hover:text-gray-300 transition-colors text-lg bg-black/50 px-6 py-3 rounded-2xl backdrop-blur-sm"
          >
            <ArrowLeft className="w-6 h-6 mr-2" />
            Back
          </button>
          
          <div className="flex items-center justify-center min-h-screen p-6">
            <div className="max-w-4xl w-full">
              <img
                src={selectedPhoto.src}
                alt={selectedPhoto.alt}
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              
              <div className="bg-white rounded-2xl p-8 mt-6 shadow-xl">
                <div className="flex items-center space-x-4 mb-6">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg ${
                    selectedPhoto.source === 'caregiver' 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                      : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                  }`}>
                    {selectedPhoto.source === 'caregiver' ? (
                      <UserCheck className="w-7 h-7 text-white" />
                    ) : (
                      <span className="text-white font-bold text-lg">
                        {selectedPhoto.sender[0]}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <div className="font-bold text-gray-900 text-xl">{selectedPhoto.sender}</div>
                      {selectedPhoto.source === 'caregiver' && (
                        <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">
                          Caregiver Visit
                        </span>
                      )}
                    </div>
                    <div className="text-gray-500 text-lg">{formatTimeAgo(selectedPhoto.timestamp)}</div>
                  </div>
                </div>
                
                {selectedPhoto.note && (
                  <div className="bg-amber-50 rounded-2xl p-6 mb-6 border border-amber-100">
                    <p className="text-gray-700 text-lg leading-relaxed">{selectedPhoto.note}</p>
                  </div>
                )}

                {selectedPhoto.seniorResponse && (
                  <div className="bg-blue-50 rounded-2xl p-6 mb-6 border border-blue-100">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">You</span>
                      </div>
                      <p className="text-blue-800 text-lg leading-relaxed font-medium">{selectedPhoto.seniorResponse}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center space-x-6 flex-wrap gap-4">
                  <button
                    onClick={() => likePhoto(selectedPhoto.id)}
                    className={`flex items-center space-x-4 px-8 py-4 rounded-2xl transition-all duration-200 text-lg font-bold shadow-lg ${
                      selectedPhoto.liked
                        ? 'bg-red-50 text-red-600 hover:bg-red-100 border-2 border-red-200'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-2 border-gray-200'
                    }`}
                  >
                    <Heart className={`w-7 h-7 ${selectedPhoto.liked ? 'fill-current' : ''}`} />
                    <span>{selectedPhoto.liked ? 'Loved!' : 'Love This'}</span>
                  </button>

                  {!selectedPhoto.seniorResponse && (
                    <>
                      <button
                        onClick={() => handleSeniorResponse(selectedPhoto.id, 'Thank you!')}
                        className="px-8 py-4 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-2xl font-bold text-lg transition-colors border-2 border-blue-200 shadow-lg"
                      >
                        Thank you!
                      </button>
                      <button
                        onClick={() => handleSeniorResponse(selectedPhoto.id, 'Love this!')}
                        className="px-8 py-4 bg-green-50 text-green-600 hover:bg-green-100 rounded-2xl font-bold text-lg transition-colors border-2 border-green-200 shadow-lg"
                      >
                        Love this!
                      </button>
                      <button
                        onClick={() => handleSeniorResponse(selectedPhoto.id, 'Thinking of you!')}
                        className="px-8 py-4 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-2xl font-bold text-lg transition-colors border-2 border-purple-200 shadow-lg"
                      >
                        Thinking of you!
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'share-photos') {
    const canSelectMore = connectionType === 'upload' ? selectedPhotos.length < monthlyUploads : true;
    const limitMessage = connectionType === 'upload' ? `${monthlyUploads} photos` : 'Unlimited';

    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <button
            onClick={() => setCurrentView('senior-hub')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors text-lg"
          >
            <ArrowLeft className="w-6 h-6 mr-3" />
            Back to Home
          </button>

          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Select Your Favorites</h2>
              <div className="text-right">
                <div className="text-sm text-gray-500">Available</div>
                <div className="text-2xl font-bold text-orange-600">{limitMessage}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
              {photos.map((photo: Photo) => {
                const isSelected = selectedPhotos.find((p: Photo) => p.id === photo.id);
                return (
                  <div
                    key={photo.id}
                    className={`relative aspect-square rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 shadow-lg ${
                      isSelected 
                        ? 'ring-4 ring-orange-400 transform scale-[0.95]' 
                        : canSelectMore 
                          ? 'hover:transform hover:scale-[1.05] hover:shadow-xl'
                          : 'opacity-50 cursor-not-allowed'
                    }`}
                    onClick={() => (canSelectMore || isSelected) && togglePhotoSelection(photo)}
                  >
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      className="w-full h-full object-cover"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-orange-400/20 flex items-center justify-center">
                        <div className="w-12 h-12 bg-orange-400 rounded-full flex items-center justify-center shadow-lg">
                          <Check className="w-7 h-7 text-white" />
                        </div>
                      </div>
                    )}
                    {!canSelectMore && !isSelected && connectionType === 'upload' && (
                      <div className="absolute inset-0 bg-gray-500/50 flex items-center justify-center">
                        <div className="bg-gray-700 text-white px-3 py-1 rounded-lg text-sm font-medium">
                          Limit reached
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {selectedPhotos.length > 0 && (
              <div className="border-t border-gray-200 pt-8">
                <h4 className="text-xl font-bold text-gray-700 mb-4">Add a Message</h4>
                <textarea
                  value={shareNote}
                  onChange={(e) => setShareNote(e.target.value)}
                  placeholder="Add a personal note for your family... (optional)"
                  className="w-full p-6 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none h-32 text-lg"
                  rows={4}
                />
                
                <button
                  onClick={sharePhotos}
                  className="w-full mt-6 bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white font-bold py-5 px-6 rounded-2xl transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center space-x-4 text-lg shadow-lg"
                >
                  <Heart className="w-7 h-7" />
                  <span>Send {selectedPhotos.length} Photo{selectedPhotos.length > 1 ? 's' : ''}</span>
                </button>
              </div>
            )}

            {selectedPhotos.length === 0 && (
              <div className="text-center py-12">
                <Plus className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                <p className="text-gray-500 text-xl">
                  {connectionType === 'upload' 
                    ? `Tap up to ${monthlyUploads} photos to share`
                    : 'Tap photos to share - no limits!'
                  }
                </p>
                {connectionType === 'upload' && (
                  <p className="text-gray-400 text-lg mt-2">That's your free monthly allotment</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'family-hub') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Share2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Family Sharing</h1>
                  <p className="text-gray-600 text-lg">Turn scattered photos into shared smiles</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setCurrentView('settings')}
                  className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all"
                >
                  <Settings className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Quick Share */}
            <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
              <div className="p-8">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mb-6 shadow-lg">
                  <Share2 className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Share</h2>
                <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                  Connect to Google or Apple Photos for unlimited sharing, or upload directly with 10 free photos monthly.
                </p>
                <button
                  onClick={() => setCurrentView('connect-photos')}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-5 px-6 rounded-2xl transition-all duration-200 transform hover:scale-[1.02] text-lg shadow-lg"
                >
                  Share Photos Now
                </button>
              </div>
            </div>

            {/* Family Activity */}
            <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
              <div className="p-8">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mb-6 shadow-lg">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Family Activity</h2>
                <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                  See how your family is engaging with the photos you've shared. View hearts and responses.
                </p>
                <button
                  onClick={() => setCurrentView('photo-feed')}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-5 px-6 rounded-2xl transition-all duration-200 transform hover:scale-[1.02] text-lg shadow-lg"
                >
                  View Activity
                </button>
              </div>
            </div>
          </div>

          {/* Connection Benefits */}
          <div className="mt-12 bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-100">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Choose Your Sharing Style</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-red-50 rounded-2xl border border-red-100">
                  <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Link className="w-6 h-6 text-white" />
                  </div>
                  <div className="font-bold text-red-800 mb-2">Google Photos</div>
                  <div className="text-red-600">Unlimited sharing</div>
                </div>
                <div className="text-center p-6 bg-gray-50 rounded-2xl border border-gray-200">
                  <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Link className="w-6 h-6 text-white" />
                  </div>
                  <div className="font-bold text-gray-800 mb-2">Apple Photos</div>
                  <div className="text-gray-600">Unlimited sharing</div>
                </div>
                <div className="text-center p-6 bg-orange-50 rounded-2xl border border-orange-100">
                  <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                  <div className="font-bold text-orange-800 mb-2">Direct Upload</div>
                  <div className="text-orange-600">10 photos/month free</div>
                </div>
              </div>
            </div>
          </div>

          {/* User Type Switcher (for demo purposes) */}
          <div className="mt-12 text-center">
            <button
              onClick={() => {
                setUserType('senior');
                setCurrentView('senior-hub');
              }}
              className="text-green-600 hover:text-green-700 font-medium text-lg underline"
            >
              Switch to Senior View
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'settings') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <button
            onClick={() => setCurrentView(userType === 'senior' ? 'senior-hub' : 'family-hub')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors text-lg"
          >
            <ArrowLeft className="w-6 h-6 mr-3" />
            Back to Home
          </button>

          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-400 to-amber-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Control in Your Hands</h2>
              <p className="text-gray-600 text-lg">Manage your photo sharing preferences</p>
            </div>

            <div className="space-y-6">
              <div className="p-6 bg-green-50 rounded-2xl border border-green-100">
                <h3 className="font-bold text-green-800 mb-2 text-lg">Photo Access</h3>
                <p className="text-green-700 mb-4">
                  {isConnected ? `Connected to ${connectionType} photos. We store only what you share.` : 'No photo access connected.'}
                </p>
                <button className="text-green-600 hover:text-green-700 font-bold">
                  Manage Access
                </button>
              </div>

              {connectionType === 'upload' && (
                <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                  <h3 className="font-bold text-blue-800 mb-2 text-lg">Monthly Allotment</h3>
                  <p className="text-blue-700 mb-4">
                    You get 10 free photo uploads each month. No storage fees, no surprise bills.
                  </p>
                  <button className="text-blue-600 hover:text-blue-700 font-bold">
                    View Usage
                  </button>
                </div>
              )}

              {(connectionType === 'google' || connectionType === 'apple') && (
                <div className="p-6 bg-purple-50 rounded-2xl border border-purple-100">
                  <h3 className="font-bold text-purple-800 mb-2 text-lg">Unlimited Sharing</h3>
                  <p className="text-purple-700 mb-4">
                    With {connectionType === 'google' ? 'Google' : 'Apple'} Photos connected, you can share as many photos as you want.
                  </p>
                  <button className="text-purple-600 hover:text-purple-700 font-bold">
                    Manage Connection
                  </button>
                </div>
              )}

              <div className="p-6 bg-orange-50 rounded-2xl border border-orange-100">
                <h3 className="font-bold text-orange-800 mb-2 text-lg">Shared Photos</h3>
                <p className="text-orange-700 mb-4">
                  Change your mind? Delete shared photos anytime and they disappear from your family's view.
                </p>
                <button className="text-orange-600 hover:text-orange-700 font-bold">
                  Manage Shared Photos
                </button>
              </div>
            </div>

            {isConnected && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setIsConnected(false);
                    setConnectionType('none');
                    setPhotos([]);
                    setSelectedPhotos([]);
                    setCurrentView(userType === 'senior' ? 'senior-hub' : 'family-hub');
                  }}
                  className="w-full flex items-center justify-center space-x-3 bg-red-50 hover:bg-red-100 text-red-600 py-4 px-6 rounded-2xl transition-colors text-lg font-bold border-2 border-red-200"
                >
                  <X className="w-6 h-6" />
                  <span>Revoke Photo Access</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default App;