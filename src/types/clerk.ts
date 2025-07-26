export interface CustomJwtSessionClaims {
  metadata: {
    role?: string
  }
  publicMetadata: {
    role?: string
  }
}

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: string
    }
    publicMetadata: {
      role?: string
    }
  }
}
