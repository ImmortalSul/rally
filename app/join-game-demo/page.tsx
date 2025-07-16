import JoinGameComponent from "../../components/gambling/join-game-component";
import JoinGameComponentCompact1 from "../../components/gambling/join-game-component-compact-1";
import JoinGameComponentCompact2 from "../../components/gambling/join-game-component-compact-2";

export default function JoinGameDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Join Game Components Demo 🎮
          </h1>
          <p className="text-slate-400 text-lg">
            Showcasing different variations of the join game lobby interface
          </p>
        </div>

        {/* Original Full-Width Component */}
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">
              Original Full-Width Component
            </h2>
            <p className="text-slate-400">
              The main join game component with NBA theme and 8-player lobby
            </p>
          </div>
          <JoinGameComponent />
        </div>

        {/* Two Compact Components Side by Side */}
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">
              Compact Component Variations
            </h2>
            <p className="text-slate-400">
              Two smaller components showcasing different sports and lobby
              configurations
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* NFL Component */}
            <div className="space-y-2">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white">
                  NFL Monday Night 🏈
                </h3>
                <p className="text-slate-400 text-sm">
                  6-player private lobby • $50 buy-in
                </p>
              </div>
              <JoinGameComponentCompact1 />
            </div>

            {/* Soccer & Hockey Component */}
            <div className="space-y-2">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white">
                  Champions League & NHL ⚽🏒
                </h3>
                <p className="text-slate-400 text-sm">
                  10-player public lobby • $35 buy-in
                </p>
              </div>
              <JoinGameComponentCompact2 />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-8 border-t border-slate-700/50">
          <p className="text-slate-500">
            Demo showcasing responsive component variations for different lobby
            types
          </p>
        </div>
      </div>
    </div>
  );
}
