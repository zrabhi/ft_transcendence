import React from 'react'

interface User {
  username: string;
  status: string;
  avatar: string;
}

interface FriendsDataProps {
  friendList: User[];
}

export default function FriendsData({friendList}: FriendsDataProps) {
  if (friendList.length === 0) {
    return (
      <div className="no-friends">
        <div className="text-2xl font-bold mt-4 text-center ">No friends yet</div>
      </div>
    );
  }
  return (
    <div className="friends-list bg-purple-400 bg-opacity-20 rounded-[.5rem] overflow-hidden mt-4 ">
      <table className='w-full text-left'>
        <tbody>
          {friendList.map((user: any, index: number) => (
            <tr key={index} className='hover:bg-purple-400 hover:bg-opacity-20'>
              <td className='p-4' >
                <div className="flex items-center gap-4">
                  <div className="avatar w-16 h-16 rounded-full overflow-hidden">
                    <img src={user.avatar} alt="avatar" />
                  </div>
                  <div className="username">{user.username}</div>
                </div>
              </td>
              <td className='p-4' >
                <div className="status text-sm font-semibold tracking-wide">
                  {user.status}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
