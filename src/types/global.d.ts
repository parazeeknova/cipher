declare global {
  interface CustomJwtSessionClaims {
    publicMetadata: {
      role?: 'gamemaster' | 'player' | 'admin'
    }
    privateMetadata: {
      role?: 'gamemaster' | 'player' | 'admin'
    }
  }

  interface UserPublicMetadata {
    role?: 'gamemaster' | 'player' | 'admin'
  }
}

export {}
