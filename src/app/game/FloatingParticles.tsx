'use client'

export function FloatingParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {[...Array.from({ length: 15 })].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-red-500/20 rounded-full animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
          }}
        />
      ))}
    </div>
  )
}
