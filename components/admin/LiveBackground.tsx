"use client";

export function LiveBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="live-bg-base" />
      <div className="live-orb live-orb-1" />
      <div className="live-orb live-orb-2" />
      <div className="live-orb live-orb-3" />
      <div className="live-orb live-orb-4" />
      <div className="live-grid" />
      <div className="live-noise" />
    </div>
  );
}
