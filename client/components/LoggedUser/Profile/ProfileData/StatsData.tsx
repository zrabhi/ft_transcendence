import React from 'react'

export default function StatsData({user}: any) {
  return (
    // wins bar
    // losses bar
    // total games bar
    // win rate bar
    // number of goals
    // number of received goals
    <div className="mx-auto p-4 mt-4 bg-purple-400 bg-opacity-40 rounded-[.5rem] shadow-md">
      <h1 className="text-2xl font-bold mb-4">User Stats</h1>

      <div className="stat mb-6">
        <p className="text-slate-100 font-semibold">Wins: {user.win}</p>
        <div className="w-full bg-gray-300 h-4 rounded-full">
          <div className="w-3/5 bg-green-500 h-4 rounded-full"></div>
        </div>
      </div>

      <div className="stat mb-6">
        <p className="text-slate-100 font-semibold">Losses: {user.loss} </p>
        <div className="w-full bg-gray-300 h-4 rounded-full">
          <div className="w-2/5 bg-red-500 h-4 rounded-full"></div>
        </div>
      </div>

      <div className="stat mb-6">
        <p className="text-slate-100 font-semibold">Total Games: {user.win + user.loss} </p>
        <div className="w-full bg-gray-300 h-4 rounded-full">
          <div className="w-full bg-slate-800 h-4 rounded-full"></div>
        </div>
      </div>

      <div className="stat mb-6">
        <p className="text-slate-100 font-semibold">Win Rate: {user.win / (user.win + user.loss) * 100}% </p>
        <div className="w-full bg-gray-300 h-4 rounded-full">
          <div className="w-3/5 bg-green-500 bg-opacity-60 h-4 rounded-full"></div>
        </div>
      </div>

      <div className="stat mb-6">
        <p className="text-slate-100 font-semibold">Goals Scored:  </p>
        <div className="w-full bg-gray-300 h-4 rounded-full">
          <div className="w-3/5 bg-green-500 bg-opacity-80 h-4 rounded-full"></div>
        </div>
      </div>

      <div className="stat mb-6">
        <p className="text-slate-100 font-semibold">Goals Received: 23</p>
        <div className="w-full bg-gray-300 h-4 rounded-full">
          <div className="w-2/5 bg-red-500 bg-opacity-60 h-4 rounded-full"></div>
        </div>
      </div>
    </div>
  )
}
