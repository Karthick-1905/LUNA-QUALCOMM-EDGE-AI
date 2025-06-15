import { 
  BarChart3, 
  ChevronDown,
  ChevronUp,
  User,
  Clock,
  Activity,
  Zap,
  Palette,
  Target,
  TrendingUp,
  BookOpen,
  Gauge,
  Star,
  Settings,
  Users,
  Eye,
  Heart,
  Coffee,
  X,
  MessageSquare,
  Send
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '../../utils';

function CollapsibleSection({ title, icon: Icon, children, defaultOpen = true, className }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className={cn("border-b border-zinc-800 last:border-b-0", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between hover:bg-zinc-900/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon className="w-4 h-4 text-zinc-400" />
          <h3 className="text-sm font-medium text-white">{title}</h3>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-zinc-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-zinc-400" />
        )}
      </button>
      {isOpen && (
        <div className="px-4 pb-4">
          {children}
        </div>
      )}
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, unit, color = "text-blue-400" }) {
  return (
    <div className="bg-zinc-800/50 rounded-lg p-3 border border-zinc-700">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={cn("w-4 h-4", color)} />
        <span className="text-xs text-zinc-400 uppercase tracking-wide">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-lg font-bold text-white">{value}</span>
        {unit && <span className="text-xs text-zinc-400">{unit}</span>}
      </div>
    </div>
  );
}

function ProgressBar({ value, max, color = "bg-blue-500" }) {
  const percentage = Math.min((value / max) * 100, 100);
  
  return (
    <div className="w-full bg-white rounded-full h-2">
      <div 
        className={cn("h-2 rounded-full transition-all duration-300")}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

function ChatbotDialog({ open, onClose, transcript }) {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [language, setLanguage] = useState("English");
  const messagesEndRef = useRef(null);

  const languageOptions = [
    { label: "English", value: "English" },
    { label: "Hindi", value: "Hindi" },
    { label: "Tamil", value: "Tamil" },
    { label: "Kannada", value: "Kannada" },
  ];

  const fetchSummary = (lang) => {
    if (!transcript) {
      setSummary("");
      setError("No transcript available to summarize.");
      return;
    }
    setLoading(true);
    setSummary("");
    setError("");
    fetch('/api/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ context: transcript, language: lang })
    })
      .then(res => res.json())
      .then(data => {
        setSummary(data.summary || "No summary returned.");
      })
      .catch(() => setError("Failed to fetch summary."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (open) fetchSummary(language);
    // eslint-disable-next-line
  }, [open]);

  useEffect(() => {
    if (open) fetchSummary(language);
    // eslint-disable-next-line
  }, [language]);

  if (!open) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="w-80 h-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-zinc-900  text-white rounded-t-lg">
          <h3 className="text-sm font-medium">Summary</h3>
          <button
            onClick={onClose}
            className="text-white hover:bg-blue-700 rounded p-1 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {/* Language Dropdown */}
        <div className="p-4 border-b border-gray-200 bg-zinc-900">
          <label htmlFor="summary-language" className="block text-xs text-white mb-1">Select Language:</label>
          <select
            id="summary-language"
            value={language}
            onChange={e => setLanguage(e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-zinc-700  "
          >
            {languageOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        {/* Summary Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 bg-zinc-900 ">
          {loading && (
            <div className="text-gray-700">Generating summary...</div>
          )}
          {error && (
            <div className="text-red-500">{error}</div>
          )}
          {!loading && !error && summary && (
            <div className="bg-white text-gray-800 px-3 py-2 rounded-lg text-sm shadow-sm border border-gray-200 whitespace-pre-line">
              {summary}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
}

export function calculateTranscriptionMetrics(data) {
  if (!data || !data.statistics) {
    return {
      totalDuration: 0,
      speakerCount: 0,
      totalWords: 0,
      totalSegments: 0,
      averageConfidence: 0,
      averageWordsPerMinute: 0,
      speakerMetrics: {}
    };
  }

  const stats = data.statistics;
  const speakingTimes = stats.speaker_speaking_times;
  const wordCounts = stats.speaker_word_counts;

  const totalDuration = Object.values(speakingTimes).reduce((sum, time) => sum + time, 0);

  const speakerMetrics = {};
  stats.speakers_list.forEach(speakerId => {
    const duration = speakingTimes[speakerId] || 0;
    const wordCount = wordCounts[speakerId] || 0;
    
    speakerMetrics[speakerId] = {
      duration,
      wordCount,
      wordsPerMinute: duration > 0 ? (wordCount / duration) * 60 : 0,
      participationPercentage: (duration / totalDuration) * 100
    };
  });


  const totalWords = stats.total_words;
  const averageWordsPerMinute = totalDuration > 0 ? (totalWords / totalDuration) * 60 : 0;

  return {
    totalDuration,
    speakerCount: stats.total_speakers,
    totalWords,
    totalSegments: stats.speakers_list.length,
    averageConfidence: 1, 
    averageWordsPerMinute,
    speakerMetrics
  };
}


export default function RightSidebar({
  speakers,
  speakerStats,
  isOpen = true,
  onClose,
  transcriptionData,
}) {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTotalDuration = () => {
    return speakerStats.reduce((total, stat) => total + stat.totalTime, 0);
  };

  const getAverageConfidence = () => {
    if (speakerStats.length === 0) return 0;
    const totalConfidence = speakerStats.reduce((sum, stat) => sum + stat.averageConfidence, 0);
    return totalConfidence / speakerStats.length;
  };

  const getTotalWords = () => {
    return speakerStats.reduce((total, stat) => total + (stat.wordsPerMinute * (stat.totalTime / 60)), 0);
  };

  const metrics = calculateTranscriptionMetrics(transcriptionData);

  const stats = transcriptionData?.statistics || {};

  const [showChatbot, setShowChatbot] = useState(false);

  // Get transcript text for summary
  const transcriptText = transcriptionData?.transcription?.segments
    ? transcriptionData?.transcription.segments.map(seg => seg.text).join(' ')
    : '';

  if (!isOpen) return null;

  return (
<div className="w-80 bg-zinc-950 border-l border-zinc-800 flex flex-col overflow-hidden">
      {/* Header with Close Button */}
      <div className="p-4 border-b border-zinc-800 bg-gradient-to-br from-zinc-900/50 to-zinc-800/30">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Analytics</h2>
            <p className="text-xs text-zinc-400 mt-1">Real-time insights and project metrics</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
              title="Close panel"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Project Overview */}
        <CollapsibleSection title="Project Overview" icon={BarChart3}>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <MetricCard 
              icon={Clock} 
              label="Duration" 
              value={formatTime(metrics.totalDuration)} 
              color="text-blue-400"
            />
            <MetricCard 
              icon={Users} 
              label="Speakers" 
              value={metrics.speakerCount} 
              color="text-purple-400"
            />
            <MetricCard 
              icon={BookOpen} 
              label="Total Words" 
              value={metrics.totalWords.toLocaleString()} 
              color="text-green-400"
            />
            <MetricCard 
              icon={MessageSquare} 
              label="Segments" 
              value={metrics.totalSegments} 
              color="text-orange-400"
            />
          </div>
          
          {/* Add new metrics displays */}
          <div className="space-y-3">
            <div className="bg-zinc-800/40 rounded-lg p-3 border border-zinc-700/50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm text-white font-medium">Overall Confidence</span>
                </div>
                <span className="text-sm text-white font-mono">
                  {Math.round(metrics.averageConfidence * 100)}%
                </span>
              </div>
              <ProgressBar 
                value={metrics.averageConfidence * 100} 
                max={100} 
                color="bg-gradient-to-r from-cyan-500 to-blue-500"
              />
            </div>

            <div className="bg-zinc-800/40 rounded-lg p-3 border border-zinc-700/50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-white font-medium">Average Speech Rate</span>
                </div>
                <span className="text-sm text-white font-mono">
                  {Math.round(metrics.averageWordsPerMinute)} WPM
                </span>
              </div>
              <ProgressBar 
                value={metrics.averageWordsPerMinute} 
                max={200} 
                color="bg-gradient-to-r from-green-500 to-emerald-500"
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* Enhanced Speaker Analytics */}
        <CollapsibleSection title="Speaker Analytics" icon={User}>
          <div className="space-y-4">
            {speakerStats.map((stat) => {
              const speaker = speakers.find(s => s.id === stat.speakerId);
              if (!speaker) return null;

              const speakingPercentage = (stat.totalTime / getTotalDuration()) * 100;

              return (
                <div key={stat.speakerId} className="p-4 bg-zinc-800/40 rounded-lg border border-zinc-700/50 hover:border-zinc-600/50 transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative">
                      <div 
                        className="w-8 h-8 rounded-full ring-2 ring-zinc-600/50 flex items-center justify-center" 
                        style={{ backgroundColor: speaker.color }}
                      >
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-zinc-900"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-white truncate">{speaker.name}</h4>
                      <p className="text-xs text-zinc-400">
                        {speakingPercentage.toFixed(1)}% of conversation
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {/* Speaking Time Progress */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-zinc-400">Speaking Time</span>
                        <span className="text-xs text-white font-mono">{formatTime(stat.totalTime)}</span>
                      </div>
                      <ProgressBar 
                        value={speakingPercentage} 
                        max={100} 
                        color="bg-gradient-to-r from-purple-500 to-pink-500"
                      />
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center p-2 bg-zinc-700/50 rounded">
                        <div className="text-white font-medium">{stat.segmentCount}</div>
                        <div className="text-zinc-400">Segments</div>
                      </div>
                      <div className="text-center p-2 bg-zinc-700/50 rounded">
                        <div className={cn(
                          "font-medium",
                          stat.averageConfidence > 0.9 ? "text-green-400" :
                          stat.averageConfidence > 0.7 ? "text-yellow-400" : "text-red-400"
                        )}>
                          {Math.round(stat.averageConfidence * 100)}%
                        </div>
                        <div className="text-zinc-400">Accuracy</div>
                      </div>
                      <div className="text-center p-2 bg-zinc-700/50 rounded">
                        <div className="text-white font-medium">{Math.round(stat.wordsPerMinute)}</div>
                        <div className="text-zinc-400">WPM</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>        </CollapsibleSection>



        {/* Quick Actions */}
        {/* <CollapsibleSection title="Quick Actions" icon={Coffee} defaultOpen={false}> */}
          <div className="space-y-3">
            <button
              className="w-full bg-gray hover:from-green-700 hover:to-teal-700 text-white rounded-lg p-3 text-sm font-medium transition-all transform hover:scale-[1.02]"
              onClick={() => setShowChatbot(true)}
            >
              <div className="flex items-center gap-2 justify-center">
                <Activity className="w-4 h-4" />
                <span>Generate Summary</span>
              </div>
            </button>
          </div>
        {/* </CollapsibleSection> */}
      </div>
      {showChatbot && (
        <ChatbotDialog open={showChatbot} onClose={() => setShowChatbot(false)} transcript={transcriptText} />
      )}
    </div>
  );
}
