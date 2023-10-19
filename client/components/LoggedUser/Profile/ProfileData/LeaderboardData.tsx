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
    <div className="leaderboard overflow-hidden rounded-[.5rem] mt-4">
      <table className='w-full text-left rounded-[.5rem] '>
        <thead className='text-sm tracking-wide capitalize font-light bg-purple-400 bg-opacity-40'>
          <tr className='' >
            <th className='p-4' >rank</th>
            <th className='p-4' >username</th>
            <th className='p-4' >points</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: any, index: number) => (
            <tr key={index} className='hover:bg-purple-400 rounded-md hover:bg-opacity-30'>
              <td className='p-4' >{index + 1}</td>
              <td className='p-4' >{user.username}</td>
              <td className='p-4' >{user.win * 50}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
