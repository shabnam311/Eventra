import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Star, Gift, Check } from 'lucide-react';
import { toast } from 'react-toastify';

export default function EngagementLeaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claimed, setClaimed] = useState(false);

  useEffect(() => {
    // Simulate fetching dynamic leaderboard data
    const fetchLeaderboard = () => {
      setTimeout(() => {
        setUsers([
          { id: 1, name: 'Alex Johnson', points: 1250, role: 'Speaker' },
          { id: 2, name: 'Sam Rivera', points: 950, role: 'Attendee' },
          { id: 3, name: 'Jordan Lee', points: 820, role: 'Attendee' },
          { id: 4, name: 'Taylor Swift', points: 640, role: 'VIP' },
          { id: 5, name: 'Morgan Webb', points: 510, role: 'Attendee' },
        ]);
        setLoading(false);
      }, 1000);
    };
    fetchLeaderboard();
  }, []);

  const handleClaimReward = () => {
    setClaimed(true);
    toast.success("Reward claimed! 100 bonus points added.");
    // Simulate optimistic UI update
    setUsers(prev => {
      const newUsers = [...prev];
      if (newUsers.length > 0) {
        newUsers[0] = { ...newUsers[0], points: newUsers[0].points + 100 };
      }
      return newUsers;
    });
  };

  const getRankIcon = (index) => {
    switch (index) {
      case 0: return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 1: return <Medal className="w-5 h-5 text-gray-400" />;
      case 2: return <Medal className="w-5 h-5 text-amber-600" />;
      default: return <span className="font-bold text-slate-400 w-5 text-center">{index + 1}</span>;
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full mx-auto animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-6"></div>
        <div className="space-y-4">
          {[1,2,3,4].map(i => <div key={i} className="h-16 bg-gray-100 dark:bg-gray-700/50 rounded-xl"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full mx-auto border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-transparent">
            Event Leaderboard
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Top engaged participants</p>
        </div>
        <div className="p-3 bg-orange-50 dark:bg-orange-900/30 rounded-xl">
          <Star className="w-6 h-6 text-orange-500" />
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <AnimatePresence>
          {users.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center justify-between p-4 rounded-xl border ${
                index === 0 
                ? 'bg-yellow-50/50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-900/50' 
                : 'bg-gray-50 dark:bg-gray-800/50 border-transparent hover:border-gray-200 dark:hover:border-gray-700'
              } transition-colors`}
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-8">
                  {getRankIcon(index)}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-100">{user.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user.role}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{user.points}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">pts</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <button 
        onClick={handleClaimReward}
        disabled={claimed}
        className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white transition-all ${
          claimed 
          ? 'bg-green-500 cursor-not-allowed' 
          : 'bg-gradient-to-r from-pink-500 to-orange-400 hover:shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5'
        }`}
      >
        {claimed ? (
          <><Check className="w-5 h-5" /> Reward Claimed</>
        ) : (
          <><Gift className="w-5 h-5" /> Claim Participation Reward</>
        )}
      </button>
    </div>
  );
}
