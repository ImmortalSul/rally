"use client";

import { useState } from "react";
import Link from "next/link";
import { ToastProvider, useToast } from "../../components/ui/toast";

// Types for the admin panel
interface StatType {
  id: string;
  name: string;
  description: string;
  numId: string; // Format: XXXXX-XXXXX (sport-line)
  sport: string;
  sportCode: string;
  lineCode: string;
}

interface Player {
  id: string;
  name: string;
  sport: string;
  team: string;
  jerseyNumber: string;
  position: string;
  avatar: string;
}

interface Line {
  id: string;
  playerId: string;
  playerName: string;
  statTypeId: string;
  statName: string;
  value: number;
  sport: string;
  gameTime: string;
  status: "active" | "resolved" | "cancelled";
  overOdds: string;
  underOdds: string;
}

interface Game {
  id: string;
  title: string;
  sport: string;
  participants: number;
  maxParticipants: number;
  buyIn: number;
  prizePool: number;
  legs: number;
  timeLeft: string;
  status: "waiting" | "active" | "completed";
  host: { name: string; avatar: string };
}

export default function AdminPage() {
  return (
    <ToastProvider>
      <AdminPageContent />
    </ToastProvider>
  );
}

function AdminPageContent() {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<
    "stats" | "lines" | "players" | "resolve-lines" | "resolve-games"
  >("stats");

  // Sport configurations
  const sports = [
    {
      name: "NBA",
      code: "00001",
      icon: "🏀",
      color: "from-[#00CED1] to-[#FFAB91]",
    },
    {
      name: "NFL",
      code: "00002",
      icon: "🏈",
      color: "from-[#FFAB91] to-[#00CED1]",
    },
    {
      name: "Soccer",
      code: "00003",
      icon: "⚽",
      color: "from-[#00CED1] to-[#FFAB91]",
    },
    {
      name: "Baseball",
      code: "00004",
      icon: "⚾",
      color: "from-[#FFAB91] to-[#00CED1]",
    },
  ];

  // Mock data for stat types
  const [statTypes, setStatTypes] = useState<StatType[]>([
    {
      id: "1",
      name: "Points",
      description: "Total points scored in the game",
      numId: "00001-00001",
      sport: "NBA",
      sportCode: "00001",
      lineCode: "00001",
    },
    {
      id: "2",
      name: "3-Pointers Made",
      description: "Total three-point shots made",
      numId: "00001-00002",
      sport: "NBA",
      sportCode: "00001",
      lineCode: "00002",
    },
    {
      id: "3",
      name: "Passing Yards",
      description: "Total passing yards in the game",
      numId: "00002-00001",
      sport: "NFL",
      sportCode: "00002",
      lineCode: "00001",
    },
    {
      id: "4",
      name: "Goals Scored",
      description: "Total goals scored in the match",
      numId: "00003-00001",
      sport: "Soccer",
      sportCode: "00003",
      lineCode: "00001",
    },
  ]);

  // Mock data for players
  const [players, setPlayers] = useState<Player[]>([
    {
      id: "1",
      name: "LeBron James",
      sport: "NBA",
      team: "LAL",
      jerseyNumber: "23",
      position: "SF",
      avatar: "LJ",
    },
    {
      id: "2",
      name: "Josh Allen",
      sport: "NFL",
      team: "BUF",
      jerseyNumber: "17",
      position: "QB",
      avatar: "JA",
    },
    {
      id: "3",
      name: "Lionel Messi",
      sport: "Soccer",
      team: "MIA",
      jerseyNumber: "10",
      position: "FW",
      avatar: "LM",
    },
  ]);

  // Mock data for lines
  const [lines, setLines] = useState<Line[]>([
    {
      id: "1",
      playerId: "1",
      playerName: "LeBron James",
      statTypeId: "1",
      statName: "Points",
      value: 28.5,
      sport: "NBA",
      gameTime: "Tonight 8:00 PM",
      status: "active",
      overOdds: "+110",
      underOdds: "-130",
    },
    {
      id: "2",
      playerId: "2",
      playerName: "Josh Allen",
      statTypeId: "3",
      statName: "Passing Yards",
      value: 285.5,
      sport: "NFL",
      gameTime: "Sunday 1:00 PM",
      status: "active",
      overOdds: "-110",
      underOdds: "-110",
    },
  ]);

  // Mock data for games (using existing lobby structure)
  const [games, setGames] = useState<Game[]>([
    {
      id: "1",
      title: "🔥 NBA Sunday Showdown",
      sport: "NBA",
      participants: 9,
      maxParticipants: 12,
      buyIn: 25,
      prizePool: 280,
      legs: 4,
      timeLeft: "2h 15m",
      status: "active",
      host: { name: "Jack Sturt", avatar: "JS" },
    },
    {
      id: "2",
      title: "Monday Night Football",
      sport: "NFL",
      participants: 11,
      maxParticipants: 12,
      buyIn: 50,
      prizePool: 580,
      legs: 5,
      timeLeft: "45m",
      status: "active",
      host: { name: "Mike Chen", avatar: "MC" },
    },
  ]);

  // Form states
  const [newStatType, setNewStatType] = useState({
    name: "",
    description: "",
    sport: "",
    sportCode: "",
    lineCode: "",
  });

  const [newPlayer, setNewPlayer] = useState({
    name: "",
    sport: "",
    team: "",
    jerseyNumber: "",
    position: "",
  });

  const [newLine, setNewLine] = useState({
    playerId: "",
    statTypeId: "",
    value: "",
    gameTime: "",
    overOdds: "",
    underOdds: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSport, setSelectedSport] = useState("all");

  // Helper functions
  const generateNextLineCode = (sportCode: string): string => {
    const existingLines = statTypes.filter((st) => st.sportCode === sportCode);
    const maxLineCode = existingLines.reduce((max, stat) => {
      const lineNum = parseInt(stat.lineCode);
      return lineNum > max ? lineNum : max;
    }, 0);
    return String(maxLineCode + 1).padStart(5, "0");
  };

  const handleCreateStatType = () => {
    if (!newStatType.name || !newStatType.description || !newStatType.sport) {
      addToast("Please fill in all fields", "error");
      return;
    }

    const sport = sports.find((s) => s.name === newStatType.sport);
    if (!sport) return;

    const lineCode = generateNextLineCode(sport.code);
    const numId = `${sport.code}-${lineCode}`;

    const statType: StatType = {
      id: String(statTypes.length + 1),
      name: newStatType.name,
      description: newStatType.description,
      numId: numId,
      sport: newStatType.sport,
      sportCode: sport.code,
      lineCode: lineCode,
    };

    setStatTypes([...statTypes, statType]);
    setNewStatType({
      name: "",
      description: "",
      sport: "",
      sportCode: "",
      lineCode: "",
    });
    addToast("Stat type created successfully!", "success");
  };

  const handleCreatePlayer = () => {
    if (
      !newPlayer.name ||
      !newPlayer.sport ||
      !newPlayer.team ||
      !newPlayer.jerseyNumber ||
      !newPlayer.position
    ) {
      addToast("Please fill in all fields", "error");
      return;
    }

    const player: Player = {
      id: String(players.length + 1),
      name: newPlayer.name,
      sport: newPlayer.sport,
      team: newPlayer.team,
      jerseyNumber: newPlayer.jerseyNumber,
      position: newPlayer.position,
      avatar: newPlayer.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase(),
    };

    setPlayers([...players, player]);
    setNewPlayer({
      name: "",
      sport: "",
      team: "",
      jerseyNumber: "",
      position: "",
    });
    addToast("Player added successfully!", "success");
  };

  const handleCreateLine = () => {
    if (
      !newLine.playerId ||
      !newLine.statTypeId ||
      !newLine.value ||
      !newLine.gameTime ||
      !newLine.overOdds ||
      !newLine.underOdds
    ) {
      addToast("Please fill in all fields", "error");
      return;
    }

    const player = players.find((p) => p.id === newLine.playerId);
    const statType = statTypes.find((st) => st.id === newLine.statTypeId);
    if (!player || !statType) return;

    const line: Line = {
      id: String(lines.length + 1),
      playerId: newLine.playerId,
      playerName: player.name,
      statTypeId: newLine.statTypeId,
      statName: statType.name,
      value: parseFloat(newLine.value),
      sport: player.sport,
      gameTime: newLine.gameTime,
      status: "active",
      overOdds: newLine.overOdds,
      underOdds: newLine.underOdds,
    };

    setLines([...lines, line]);
    setNewLine({
      playerId: "",
      statTypeId: "",
      value: "",
      gameTime: "",
      overOdds: "",
      underOdds: "",
    });
    addToast("Line created successfully!", "success");
  };

  const handleResolveLine = (
    lineId: string,
    result: "over" | "under" | "cancel"
  ) => {
    setLines(
      lines.map((line) =>
        line.id === lineId
          ? { ...line, status: result === "cancel" ? "cancelled" : "resolved" }
          : line
      )
    );
    const message =
      result === "cancel"
        ? "Line cancelled successfully!"
        : `Line resolved as ${result.toUpperCase()} successfully!`;
    addToast(message, "success");
  };

  const handleResolveGame = (gameId: string, action: "end" | "cancel") => {
    setGames(
      games.map((game) =>
        game.id === gameId
          ? {
              ...game,
              status: action === "end" ? "completed" : ("cancelled" as any),
            }
          : game
      )
    );
    const message =
      action === "end"
        ? "Game ended successfully!"
        : "Game cancelled successfully!";
    addToast(message, "success");
  };

  // Filter functions
  const filteredLines = lines.filter((line) => {
    const matchesSearch =
      line.playerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      line.statName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSport =
      selectedSport === "all" || line.sport === selectedSport;
    return matchesSearch && matchesSport;
  });

  const filteredGames = games.filter((game) => {
    const matchesSearch = game.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesSport =
      selectedSport === "all" || game.sport === selectedSport;
    return matchesSearch && matchesSport;
  });

  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Enhanced Top Navigation Bar */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-slate-900/95 to-slate-800/95 backdrop-blur-md border-b border-slate-700/50 shadow-2xl">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left: Back Button + Title */}
          <div className="flex items-center space-x-3">
            <Link
              href="/main"
              className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 transition-colors"
            >
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
            <h1 className="text-xl font-bold text-white">
              <span className="bg-gradient-to-r from-[#00CED1] to-[#FFAB91] bg-clip-text text-transparent">
                Admin Panel
              </span>
            </h1>
          </div>

          {/* Right: Status or Info */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-[#00CED1]/20 to-[#FFAB91]/20 border border-[#00CED1]/30 rounded-xl px-4 py-2 backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-gradient-to-br from-[#00CED1] to-[#FFAB91] rounded-lg flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="font-bold text-sm bg-gradient-to-r from-[#00CED1] to-[#FFAB91] bg-clip-text text-transparent">
                  Admin Access
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 pb-20">
        <div className="max-w-6xl mx-auto pt-6">
          {/* Tab Navigation */}
          <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-3 shadow-2xl mb-6">
            <div className="flex flex-wrap gap-2">
              {[
                { id: "stats", name: "Stat Types", icon: "📊" },
                { id: "players", name: "Players", icon: "👤" },
                { id: "lines", name: "Create Lines", icon: "📈" },
                { id: "resolve-lines", name: "Resolve Lines", icon: "✅" },
                { id: "resolve-games", name: "Resolve Games", icon: "🎮" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-[#00CED1] to-[#FFAB91] text-white shadow-lg"
                      : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 hover:text-white border border-slate-700/50"
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>
          </div>{" "}
          {/* Tab Content */}
          {activeTab === "stats" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Create New Stat Type Form */}
              <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <span className="w-8 h-8 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full mr-3 flex items-center justify-center">
                    <span className="text-lg">➕</span>
                  </span>
                  Create Stat Type
                </h2>{" "}
                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Stat Name
                    </label>
                    <input
                      type="text"
                      value={newStatType.name}
                      onChange={(e) =>
                        setNewStatType({ ...newStatType, name: e.target.value })
                      }
                      placeholder="e.g., Points, Assists, Goals"
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Description
                    </label>
                    <textarea
                      value={newStatType.description}
                      onChange={(e) =>
                        setNewStatType({
                          ...newStatType,
                          description: e.target.value,
                        })
                      }
                      placeholder="Describe what this stat measures..."
                      rows={3}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Sport
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {sports.map((sport) => (
                        <button
                          key={sport.name}
                          onClick={() =>
                            setNewStatType({
                              ...newStatType,
                              sport: sport.name,
                            })
                          }
                          className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                            newStatType.sport === sport.name
                              ? "border-[#00CED1] bg-[#00CED1]/10 shadow-lg"
                              : "border-slate-600/30 bg-slate-700/30 hover:border-slate-500/50"
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <span className="text-xl">{sport.icon}</span>
                            <div className="text-left">
                              <div className="text-white font-semibold text-sm">
                                {sport.name}
                              </div>
                              <div className="text-slate-400 text-xs">
                                Code: {sport.code}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {newStatType.sport && (
                    <div className="bg-slate-700/30 rounded-xl p-4">
                      <h4 className="text-white font-semibold mb-2">
                        Generated ID Preview
                      </h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-slate-300">Sport Code:</span>
                        <span className="text-[#00CED1] font-mono">
                          {
                            sports.find((s) => s.name === newStatType.sport)
                              ?.code
                          }
                        </span>
                        <span className="text-slate-300">-</span>
                        <span className="text-slate-300">Line Code:</span>
                        <span className="text-[#FFAB91] font-mono">
                          {generateNextLineCode(
                            sports.find((s) => s.name === newStatType.sport)
                              ?.code || ""
                          )}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        Full ID:{" "}
                        {sports.find((s) => s.name === newStatType.sport)?.code}
                        -
                        {generateNextLineCode(
                          sports.find((s) => s.name === newStatType.sport)
                            ?.code || ""
                        )}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleCreateStatType}
                    className="w-full bg-gradient-to-r from-[#00CED1] to-[#FFAB91] hover:from-[#00CED1]/90 hover:to-[#FFAB91]/90 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                  >
                    Create Stat Type
                  </button>
                </div>
              </div>

              {/* Existing Stat Types */}
              <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <span className="w-8 h-8 bg-gradient-to-r from-[#FFAB91] to-[#00CED1] rounded-full mr-3 flex items-center justify-center">
                    <span className="text-lg">📋</span>
                  </span>
                  Existing Stat Types
                  <span className="ml-auto bg-gradient-to-r from-[#00CED1]/20 to-[#FFAB91]/20 border border-[#00CED1]/30 rounded-lg px-3 py-1 text-sm">
                    {statTypes.length} Total
                  </span>
                </h2>

                {/* Search and Filter */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search stat types..."
                      className="w-full px-4 py-3 pl-11 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all"
                    />
                  </div>

                  <div>
                    <select
                      value={selectedSport}
                      onChange={(e) => setSelectedSport(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all"
                    >
                      <option value="all">All Sports</option>
                      {sports.map((sport) => (
                        <option key={sport.name} value={sport.name}>
                          {sport.icon} {sport.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Sports Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  {sports.map((sport) => {
                    const sportCount = statTypes.filter(
                      (st) => st.sport === sport.name
                    ).length;
                    return (
                      <div
                        key={sport.name}
                        className="bg-slate-800/30 rounded-lg p-3 text-center border border-slate-700/30"
                      >
                        <div className="text-xl mb-1">{sport.icon}</div>
                        <div className="text-white font-semibold text-sm">
                          {sport.name}
                        </div>
                        <div className="text-[#00CED1] text-xs">
                          {sportCount} stats
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {statTypes
                    .filter((stat) => {
                      const matchesSearch =
                        stat.name
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()) ||
                        stat.description
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()) ||
                        stat.numId
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase());
                      const matchesSport =
                        selectedSport === "all" || stat.sport === selectedSport;
                      return matchesSearch && matchesSport;
                    })
                    .map((stat) => (
                      <div
                        key={stat.id}
                        className="bg-slate-700/30 rounded-xl p-4 hover:bg-slate-700/50 transition-all duration-200 border border-slate-600/20 hover:border-[#00CED1]/30"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <div
                                className={`w-10 h-10 rounded-lg bg-gradient-to-br ${sports.find((s) => s.name === stat.sport)?.color} flex items-center justify-center`}
                              >
                                <span className="text-lg">
                                  {
                                    sports.find((s) => s.name === stat.sport)
                                      ?.icon
                                  }
                                </span>
                              </div>
                              <div className="flex-1">
                                <h4 className="text-white font-semibold text-lg">
                                  {stat.name}
                                </h4>
                                <div className="flex items-center space-x-2">
                                  <span className="text-[#00CED1] text-sm font-medium">
                                    {stat.sport}
                                  </span>
                                  <span className="text-slate-400">•</span>
                                  <span className="text-[#FFAB91] font-mono text-sm">
                                    {stat.numId}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <p className="text-slate-300 text-sm leading-relaxed mb-3 pl-13">
                              {stat.description}
                            </p>
                            <div className="flex items-center space-x-4 text-xs pl-13">
                              <div className="bg-slate-800/50 rounded-lg px-2 py-1">
                                <span className="text-slate-400">
                                  Sport Code:{" "}
                                </span>
                                <span className="text-[#00CED1] font-mono">
                                  {stat.sportCode}
                                </span>
                              </div>
                              <div className="bg-slate-800/50 rounded-lg px-2 py-1">
                                <span className="text-slate-400">
                                  Line Code:{" "}
                                </span>
                                <span className="text-[#FFAB91] font-mono">
                                  {stat.lineCode}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col space-y-2">
                            <button className="p-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition-colors group">
                              <svg
                                className="w-4 h-4 text-slate-400 group-hover:text-[#00CED1]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                            <button className="p-2 bg-slate-800/50 hover:bg-red-500/20 rounded-lg transition-colors group">
                              <svg
                                className="w-4 h-4 text-slate-400 group-hover:text-red-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  {statTypes.filter((stat) => {
                    const matchesSearch =
                      stat.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      stat.description
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      stat.numId
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase());
                    const matchesSport =
                      selectedSport === "all" || stat.sport === selectedSport;
                    return matchesSearch && matchesSport;
                  }).length === 0 && (
                    <div className="text-center py-8">
                      <div className="text-slate-400 mb-2">
                        <svg
                          className="w-12 h-12 mx-auto"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.467.901-6.056 2.37l-.413-.387L5.5 17l.031-.029A7.718 7.718 0 0112 13.5c2.34 0 4.467.901 6.056 2.37l-.413.387L17.5 16l.031.029z"
                          />
                        </svg>
                      </div>
                      <p className="text-slate-400">
                        No stat types found matching your criteria
                      </p>
                      <p className="text-slate-500 text-sm mt-1">
                        Try adjusting your search or filter
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {activeTab === "players" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Add New Player Form */}
              <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <span className="w-8 h-8 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full mr-3 flex items-center justify-center">
                    <span className="text-lg">👤</span>
                  </span>
                  Add New Player
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Player Name
                    </label>
                    <input
                      type="text"
                      value={newPlayer.name}
                      onChange={(e) =>
                        setNewPlayer({ ...newPlayer, name: e.target.value })
                      }
                      placeholder="e.g., LeBron James"
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Sport
                    </label>
                    <select
                      value={newPlayer.sport}
                      onChange={(e) =>
                        setNewPlayer({ ...newPlayer, sport: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all"
                    >
                      <option value="">Select Sport</option>
                      {sports.map((sport) => (
                        <option key={sport.name} value={sport.name}>
                          {sport.icon} {sport.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-semibold mb-2">
                        Team
                      </label>
                      <input
                        type="text"
                        value={newPlayer.team}
                        onChange={(e) =>
                          setNewPlayer({ ...newPlayer, team: e.target.value })
                        }
                        placeholder="e.g., LAL"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">
                        Jersey #
                      </label>
                      <input
                        type="text"
                        value={newPlayer.jerseyNumber}
                        onChange={(e) =>
                          setNewPlayer({
                            ...newPlayer,
                            jerseyNumber: e.target.value,
                          })
                        }
                        placeholder="e.g., 23"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Position
                    </label>
                    <input
                      type="text"
                      value={newPlayer.position}
                      onChange={(e) =>
                        setNewPlayer({ ...newPlayer, position: e.target.value })
                      }
                      placeholder="e.g., SF, QB, FW"
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all"
                    />
                  </div>

                  <button
                    onClick={handleCreatePlayer}
                    className="w-full bg-gradient-to-r from-[#00CED1] to-[#FFAB91] hover:from-[#00CED1]/90 hover:to-[#FFAB91]/90 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                  >
                    Add Player
                  </button>
                </div>
              </div>

              {/* Existing Players */}
              <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <span className="w-8 h-8 bg-gradient-to-r from-[#FFAB91] to-[#00CED1] rounded-full mr-3 flex items-center justify-center">
                    <span className="text-lg">👥</span>
                  </span>
                  Existing Players
                </h2>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {players.map((player) => (
                    <div
                      key={player.id}
                      className="bg-slate-700/30 rounded-xl p-4 hover:bg-slate-700/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#00CED1] to-[#FFAB91] rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">
                            {player.avatar}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-semibold">
                            {player.name}
                          </h4>
                          <div className="flex items-center space-x-2 text-sm">
                            <span className="text-lg">
                              {
                                sports.find((s) => s.name === player.sport)
                                  ?.icon
                              }
                            </span>
                            <span className="text-slate-300">
                              {player.team}
                            </span>
                            <span className="text-slate-400">
                              #{player.jerseyNumber}
                            </span>
                            <span className="text-slate-400">
                              {player.position}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {activeTab === "lines" && (
            <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="w-8 h-8 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full mr-3 flex items-center justify-center">
                  <span className="text-lg">📈</span>
                </span>
                Create New Line
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Select Player
                    </label>
                    <select
                      value={newLine.playerId}
                      onChange={(e) =>
                        setNewLine({ ...newLine, playerId: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all"
                    >
                      <option value="">Select a player</option>
                      {players.map((player) => (
                        <option key={player.id} value={player.id}>
                          {sports.find((s) => s.name === player.sport)?.icon}{" "}
                          {player.name} ({player.team})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Select Stat Type
                    </label>
                    <select
                      value={newLine.statTypeId}
                      onChange={(e) =>
                        setNewLine({ ...newLine, statTypeId: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all"
                    >
                      <option value="">Select stat type</option>
                      {statTypes
                        .filter((st) => {
                          const selectedPlayer = players.find(
                            (p) => p.id === newLine.playerId
                          );
                          return (
                            !selectedPlayer || st.sport === selectedPlayer.sport
                          );
                        })
                        .map((stat) => (
                          <option key={stat.id} value={stat.id}>
                            {stat.name} ({stat.numId})
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Line Value
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={newLine.value}
                      onChange={(e) =>
                        setNewLine({ ...newLine, value: e.target.value })
                      }
                      placeholder="e.g., 28.5"
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Game Time
                    </label>
                    <input
                      type="text"
                      value={newLine.gameTime}
                      onChange={(e) =>
                        setNewLine({ ...newLine, gameTime: e.target.value })
                      }
                      placeholder="e.g., Tonight 8:00 PM"
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-semibold mb-2">
                        Over Odds
                      </label>
                      <input
                        type="text"
                        value={newLine.overOdds}
                        onChange={(e) =>
                          setNewLine({ ...newLine, overOdds: e.target.value })
                        }
                        placeholder="e.g., +110"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">
                        Under Odds
                      </label>
                      <input
                        type="text"
                        value={newLine.underOdds}
                        onChange={(e) =>
                          setNewLine({ ...newLine, underOdds: e.target.value })
                        }
                        placeholder="e.g., -130"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleCreateLine}
                    className="w-full bg-gradient-to-r from-[#00CED1] to-[#FFAB91] hover:from-[#00CED1]/90 hover:to-[#FFAB91]/90 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                  >
                    Create Line
                  </button>
                </div>
              </div>
            </div>
          )}
          {activeTab === "resolve-lines" && (
            <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="w-8 h-8 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full mr-3 flex items-center justify-center">
                  <span className="text-lg">✅</span>
                </span>
                Resolve Lines
              </h2>

              {/* Search and Filter */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by player or stat name..."
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all"
                  />
                </div>

                <div>
                  <select
                    value={selectedSport}
                    onChange={(e) => setSelectedSport(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all"
                  >
                    <option value="all">All Sports</option>
                    {sports.map((sport) => (
                      <option key={sport.name} value={sport.name}>
                        {sport.icon} {sport.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Lines List */}
              <div className="space-y-4">
                {filteredLines.map((line) => (
                  <div
                    key={line.id}
                    className="bg-slate-700/30 rounded-xl p-4 hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-lg">
                            {sports.find((s) => s.name === line.sport)?.icon}
                          </span>
                          <h4 className="text-white font-semibold">
                            {line.playerName}
                          </h4>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              line.status === "active"
                                ? "bg-[#00CED1]/20 text-[#00CED1]"
                                : line.status === "resolved"
                                  ? "bg-[#FFAB91]/20 text-[#FFAB91]"
                                  : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {line.status}
                          </span>
                        </div>
                        <div className="text-slate-300 mb-2">
                          {line.statName}:{" "}
                          <span className="text-[#FFAB91] font-bold">
                            {line.value}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-slate-400">
                          <span>Over: {line.overOdds}</span>
                          <span>Under: {line.underOdds}</span>
                          <span>{line.gameTime}</span>
                        </div>
                      </div>

                      {line.status === "active" && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleResolveLine(line.id, "over")}
                            className="px-4 py-2 bg-[#00CED1] hover:bg-[#00CED1]/90 text-white font-semibold rounded-lg transition-colors"
                          >
                            Over
                          </button>
                          <button
                            onClick={() => handleResolveLine(line.id, "under")}
                            className="px-4 py-2 bg-[#FFAB91] hover:bg-[#FFAB91]/90 text-white font-semibold rounded-lg transition-colors"
                          >
                            Under
                          </button>
                          <button
                            onClick={() => handleResolveLine(line.id, "cancel")}
                            className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white font-semibold rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === "resolve-games" && (
            <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="w-8 h-8 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full mr-3 flex items-center justify-center">
                  <span className="text-lg">🎮</span>
                </span>
                Resolve Games
              </h2>

              {/* Search and Filter */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by game title..."
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all"
                  />
                </div>

                <div>
                  <select
                    value={selectedSport}
                    onChange={(e) => setSelectedSport(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all"
                  >
                    <option value="all">All Sports</option>
                    {sports.map((sport) => (
                      <option key={sport.name} value={sport.name}>
                        {sport.icon} {sport.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Games List */}
              <div className="space-y-4">
                {filteredGames.map((game) => (
                  <div
                    key={game.id}
                    className="bg-slate-700/30 rounded-xl p-4 hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-lg">
                            {sports.find((s) => s.name === game.sport)?.icon}
                          </span>
                          <h4 className="text-white font-semibold">
                            {game.title}
                          </h4>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              game.status === "active"
                                ? "bg-[#00CED1]/20 text-[#00CED1]"
                                : game.status === "waiting"
                                  ? "bg-yellow-500/20 text-[#FFAB91]"
                                  : "bg-[#FFAB91]/20 text-[#FFAB91]"
                            }`}
                          >
                            {game.status}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-slate-400 mb-2">
                          <span>
                            Players: {game.participants}/{game.maxParticipants}
                          </span>
                          <span>Buy-in: ${game.buyIn}</span>
                          <span>Pool: ${game.prizePool}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="text-slate-300">Host:</span>
                          <span className="text-[#FFAB91]">
                            {game.host.name}
                          </span>
                          <span className="text-slate-400">
                            • {game.timeLeft} remaining
                          </span>
                        </div>
                      </div>

                      {game.status === "active" && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleResolveGame(game.id, "end")}
                            className="px-4 py-2 bg-[#00CED1] hover:bg-[#00CED1]/90 text-white font-semibold rounded-lg transition-colors"
                          >
                            End Game
                          </button>
                          <button
                            onClick={() => handleResolveGame(game.id, "cancel")}
                            className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white font-semibold rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
