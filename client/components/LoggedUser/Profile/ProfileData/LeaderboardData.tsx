import React from 'react'

interface User {
  username: string;
  points: number;
}

interface LeaderboardDataProps {
  users: User[];
}

export default function LeaderboardData({ users }: LeaderboardDataProps) {
  return (
    <div className="leaderboard rounded-lg overflow-hidden">
      <table className='w-full text-left mt-4'>
        <thead className='text-sm tracking-wide capitalize font-light bg-purple-700 bg-blend-darken bg-opacity-25'>
          <tr className='' >
            <th className='p-4' >rank</th>
            <th className='p-4' >username</th>
            <th className='p-4' >points</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: any, index: number) => (
            <tr key={index} className='hover:bg-purple-700 rounded-md hover:bg-opacity-20'>
              <td className='p-4' >{index + 1}</td>
              <td className='p-4' >{user.username}</td>
              <td className='p-4' >{user.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
