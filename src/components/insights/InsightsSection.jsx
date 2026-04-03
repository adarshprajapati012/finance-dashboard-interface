import React, { useState, useCallback, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Sparkles, TrendingUp, AlertCircle, RefreshCw, Zap, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LOADING_MESSAGES = [
  "Waking up the financial AI from its nap...",
  "Counting your Rupees (and judging your coffee habits)...",
  "Doing complex math so you don't have to...",
  "Teaching a neural network what 'rent' means...",
  "Interrogating your recent transactions...",
  "Wondering why you bought that on Amazon...",
  "Finding exactly where that ₹500 went...",
  "Consuming large amounts of digital caffeine...",
  "Locating spare change in the digital couch cushions...",
  "Translating your spending into robot speak...",
  "Bribing the algorithms for better financial advice...",
  "Polishing your insights to a dazzling shine..."
];

export const InsightsSection = () => {
  const { transactions } = useFinance();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    let interval;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 2800);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const generateInsights = useCallback(async () => {
    if (transactions.length === 0) {
      setError("Please add some transactions first.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const summary = transactions.slice(0, 20).map(t => 
        `${t.date.split('T')[0]} | ${t.type} | ${t.category} | ${t.amount} | ${t.description}`
      ).join('\n');

      const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
      
      if (!apiKey || apiKey === 'your_openrouter_api_key_here') {
        throw new Error("API key is missing. Please add VITE_OPENROUTER_API_KEY to your .env file.");
      }

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": window.location.origin, 
          "X-Title": "FinDashboard", 
        },
        body: JSON.stringify({
          model: "nvidia/nemotron-3-super-120b-a12b:free",
          messages: [
            {
              role: "system",
              content: `You are a financial advisor AI. 
IMPORTANT CONTEXT: The user's currency is Indian Rupees (₹). Ensure all monetary values you talk about or output are formatted as ₹. Do NOT use Dollar ($) signs.
Analyze this data deeply. Respond AS FAST AS POSSIBLE. Keep text aggressively short. Provide your response as a raw JSON object with exactly the following structure (NO markdown wrappers, NO \`\`\`json):
{
  "summary": "1 very short sentence summarizing their overall status using ₹.",
  "action_item": "1 highly actionable advice (max 6 words).",
  "insights": [
    { "type": "warning" | "success" | "info", "text": "Ultra-short data-driven insight." },
    { "type": "warning" | "success" | "info", "text": "Ultra-short data-driven insight." },
    { "type": "warning" | "success" | "info", "text": "Ultra-short data-driven insight." }
  ]
}`
            },
            {
              role: "user",
              content: `Here are my recent transactions (Date | Type | Category | Amount | Description): \n${summary}`
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const resData = await response.json();
      const content = resData.choices[0].message.content.trim();
      
      let parsedData;
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : content;
        parsedData = JSON.parse(jsonStr);
        if (!parsedData.insights) parsedData.insights = [];
      } catch (e) {
        console.error("Failed to parse AI response:", content);
        throw new Error("The AI returned an invalid format. Please try again.");
      }

      setData(parsedData);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [transactions]);

  const getIcon = (type) => {
    switch(type) {
      case 'warning': return AlertCircle;
      case 'success': return TrendingUp;
      default: return Sparkles;
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 col-span-1 lg:col-span-3 relative group overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
      
      <div className="flex justify-between items-center mb-6 relative z-10">
        <h3 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          AI Financial Intelligence
        </h3>
        
        <button 
          onClick={generateInsights}
          disabled={isLoading}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm shadow-lg shadow-primary/25"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Processing' : 'Analyze Finances'}
        </button>
      </div>

      <div className="relative z-10 min-h-[140px] flex flex-col justify-center">
        {error && (
          <div className="p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {!error && !data && !isLoading && (
          <div className="text-center text-muted-foreground py-8">
            Click "Analyze Finances" to let our AI scan your latest transactions.
          </div>
        )}

        {!error && isLoading && (
          <div className="py-12 flex flex-col items-center justify-center gap-8">
            <div className="relative w-24 h-24 flex items-center justify-center scale-110">
              <motion.div 
                animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.4, 0.1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-[-100%] rounded-full bg-primary/30 blur-2xl z-0"
              />
              
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border shadow-lg border-dashed border-emerald-400/40 z-10"
              />

              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 rounded-full border-2 border-t-primary border-r-transparent border-b-primary/30 border-l-transparent z-10"
              />

              <motion.div 
                animate={{ scale: [0.85, 1.15, 0.85] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-12 h-12 rounded-full bg-gradient-to-br from-primary to-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.8)] z-20 flex items-center justify-center"
              >
                <Zap className="w-6 h-6 text-white" />
              </motion.div>
            </div>
            
            <div className="h-8 overflow-hidden relative w-full flex justify-center">
              <AnimatePresence mode="popLayout">
                <motion.p
                  key={loadingStep}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className="text-muted-foreground font-medium text-center"
                >
                  {LOADING_MESSAGES[loadingStep]}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        )}

        {data && !error && !isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-5 backdrop-blur-sm">
                <h4 className="text-sm uppercase tracking-wider font-bold text-primary mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> AI Summary
                </h4>
                <p className="text-foreground leading-relaxed text-sm font-medium">{data.summary}</p>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5 backdrop-blur-sm">
                <h4 className="text-sm uppercase tracking-wider font-bold text-emerald-500 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Recommended Action
                </h4>
                <p className="text-foreground leading-relaxed text-sm font-medium">{data.action_item}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.insights.map((insight, idx) => {
                const Icon = getIcon(insight.type);
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.15 + 0.2 }}
                    key={idx} 
                    className="flex flex-col gap-3 p-5 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 transition-colors"
                  >
                    <div className={`p-2 rounded-lg w-fit ${
                      insight.type === 'warning' ? 'bg-rose-500/20 text-rose-400' : 
                      insight.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-primary/20 text-primary'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-medium text-foreground leading-relaxed line-clamp-4 text-balance">{insight.text}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
