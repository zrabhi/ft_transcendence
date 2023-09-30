const UserCard = ({ channel, onClick }: any): JSX.Element => {
    return (
      <div
        onClick={onClick}
        className="user-card-container block p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700"
      >
        <User user={channel} />
        <div>{channel.message}</div>
      </div>
    );
  };


  export const User = ({ user }: any): JSX.Element => {
    return (
      <div className="user-card-content">
        <img
          className="mb-3 rounded-full shadow-lg"
          width={50}
          height={50}
          src={user?.avatar}
          alt={user?.username ? user.username : "#" + user?.name}
        />
        <div className="flex flex-col justify-between">
          <div>{user?.username ? user.username : "#" + user?.name}</div>
          <div className='text-xs'>{user?.status ? user.status : ""}</div>
        </div>
      </div>
    );
  };

  export default UserCard;