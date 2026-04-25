interface LoginButtonProps {
  onSignIn: () => void;
  onSignOut: () => void;
  loading: boolean;
  username: string | null;
  avatarUrl: string | null;
}

export default function LoginButton({ onSignIn, onSignOut, loading, username, avatarUrl }: LoginButtonProps) {
  if (loading) {
    return <div className="auth-btn auth-btn--loading">CONNECTING...</div>;
  }

  if (username) {
    return (
      <div className="auth-user">
        {avatarUrl && (
          <img
            src={avatarUrl}
            alt={username}
            className="auth-avatar"
            width={24}
            height={24}
          />
        )}
        <span className="auth-username">{username}</span>
        <button className="auth-btn auth-btn--signout" onClick={onSignOut}>
          [EXIT]
        </button>
      </div>
    );
  }

  return (
    <button className="auth-btn auth-btn--signin" onClick={onSignIn}>
      ⌥ SIGN IN WITH GITHUB
    </button>
  );
}
