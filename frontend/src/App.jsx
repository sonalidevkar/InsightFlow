
import { useMemo, useState } from "react";
import {
  LayoutDashboard,
  MessageSquare,
  BrainCircuit,
  Lightbulb,
  CheckCircle2,
  CircleAlert,
  TrendingUp,
  Search,
  Upload,
  Plus,
  Download,
  ArrowUpRight,
  Sparkles,
  Filter,
  X
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";
import "./App.css";

const sampleFeedback = [
  { id: 1, customer: "Aarav", text: "My order arrived three days late.", category: "Delivery", sentiment: "Negative", date: "2026-10-12" },
  { id: 2, customer: "Priya", text: "Excellent product quality. Very happy!", category: "Product Quality", sentiment: "Positive", date: "2026-10-12" },
  { id: 3, customer: "Rohan", text: "Customer support never replied to my messages.", category: "Support", sentiment: "Negative", date: "2026-10-11" },
  { id: 4, customer: "Neha", text: "Delivery is too slow and my order is delayed.", category: "Delivery", sentiment: "Negative", date: "2026-10-11" },
  { id: 5, customer: "Isha", text: "The price is reasonable and the website is easy to use.", category: "Pricing", sentiment: "Positive", date: "2026-10-10" },
  { id: 6, customer: "Karan", text: "The product quality is poor.", category: "Product Quality", sentiment: "Negative", date: "2026-10-10" },
  { id: 7, customer: "Anaya", text: "The app works fine.", category: "Website", sentiment: "Neutral", date: "2026-10-09" },
  { id: 8, customer: "Vikram", text: "My refund is still pending. Please help.", category: "Support", sentiment: "Negative", date: "2026-10-09" },
  { id: 9, customer: "Meera", text: "Fast delivery and helpful customer service.", category: "Delivery", sentiment: "Positive", date: "2026-10-08" },
  { id: 10, customer: "Om", text: "The checkout process is confusing.", category: "Website", sentiment: "Negative", date: "2026-10-08" },
  { id: 11, customer: "Sara", text: "Support solved my problem quickly. Great experience!", category: "Support", sentiment: "Positive", date: "2026-10-07" },
  { id: 12, customer: "Dev", text: "Shipping charges are too expensive.", category: "Pricing", sentiment: "Negative", date: "2026-10-07" }
];

const positiveWords = [
  "good", "great", "excellent", "love", "fast", "helpful",
  "easy", "amazing", "happy", "best", "reasonable",
  "satisfied", "perfect", "thank"
];

const negativeWords = [
  "bad", "late", "delay", "slow", "poor", "hate",
  "problem", "issue", "expensive", "never", "broken",
  "pending", "confusing", "difficult", "wrong",
  "terrible", "complaint", "not", "failed"
];

function analyseFeedback(text) {
  const lower = text.toLowerCase();

  const positive = positiveWords.filter(word =>
    lower.includes(word)
  ).length;

  const negative = negativeWords.filter(word =>
    lower.includes(word)
  ).length;

  let sentiment = "Neutral";

  if (positive > negative) sentiment = "Positive";
  if (negative > positive) sentiment = "Negative";

  let category = "Other";

  if (/delivery|deliver|shipping|shipped|order arrived/i.test(text)) {
    category = "Delivery";
  } else if (/support|refund|reply|replied|service|help/i.test(text)) {
    category = "Support";
  } else if (/quality|product|broken/i.test(text)) {
    category = "Product Quality";
  } else if (/price|cost|expensive|charge/i.test(text)) {
    category = "Pricing";
  } else if (/website|app|checkout|login|page/i.test(text)) {
    category = "Website";
  }

  return { sentiment, category };
}

function StatCard({ title, value, note, icon: Icon, color }) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <span>{title}</span>
        <span
          className="stat-icon"
          style={{ color, backgroundColor: `${color}18` }}
        >
          <Icon size={20} />
        </span>
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-note">{note}</div>
    </div>
  );
}

export default function App() {
  const [feedback, setFeedback] = useState(sampleFeedback);
  const [issues, setIssues] = useState([
    { id: 1, title: "Repeated delivery delays", category: "Delivery", status: "Open" },
    { id: 2, title: "Slow customer support", category: "Support", status: "In Progress" },
    { id: 3, title: "Product quality complaints", category: "Product Quality", status: "Open" }
  ]);

  const [page, setPage] = useState("Overview");
  const [search, setSearch] = useState("");
  const [sentimentFilter, setSentimentFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [customer, setCustomer] = useState("");
  const [message, setMessage] = useState("");
  const [notice, setNotice] = useState("");

  const stats = useMemo(() => {
    const positive = feedback.filter(f => f.sentiment === "Positive").length;
    const negative = feedback.filter(f => f.sentiment === "Negative").length;
    const neutral = feedback.filter(f => f.sentiment === "Neutral").length;

    return {
      total: feedback.length,
      positive,
      negative,
      neutral,
      positivePercent: feedback.length
        ? Math.round((positive / feedback.length) * 100)
        : 0
    };
  }, [feedback]);

  const categories = [...new Set(feedback.map(f => f.category))];

  const filteredFeedback = feedback.filter(item => {
    const matchesSearch =
      `${item.customer} ${item.text} ${item.category}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesSentiment =
      sentimentFilter === "All" ||
      item.sentiment === sentimentFilter;

    const matchesCategory =
      categoryFilter === "All" ||
      item.category === categoryFilter;

    return matchesSearch && matchesSentiment && matchesCategory;
  });

  const sentimentData = [
    { name: "Positive", value: stats.positive, color: "#16a34a" },
    { name: "Negative", value: stats.negative, color: "#ef4444" },
    { name: "Neutral", value: stats.neutral, color: "#eab308" }
  ];

  const topicData = categories.map(category => ({
    name: category,
    count: feedback.filter(f => f.category === category).length,
    negative: feedback.filter(
      f => f.category === category && f.sentiment === "Negative"
    ).length
  })).sort((a, b) => b.count - a.count);

  const recommendations = [...topicData]
    .filter(topic => topic.negative > 0)
    .sort((a, b) => b.negative - a.negative);

  function addFeedback(event) {
    event.preventDefault();

    if (!message.trim()) return;

    const result = analyseFeedback(message);

    const entry = {
      id: Date.now(),
      customer: customer.trim() || "Anonymous",
      text: message.trim(),
      category: result.category,
      sentiment: result.sentiment,
      date: new Date().toISOString().slice(0, 10)
    };

    setFeedback(previous => [entry, ...previous]);
    setCustomer("");
    setMessage("");
    setShowForm(false);
    setPage("Feedback");
    setNotice("Feedback analysed and added successfully.");
  }

  function importCSV(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = e => {
      const lines = String(e.target.result || "")
        .split(/\r?\n/)
        .filter(line => line.trim());

      if (lines.length < 2) {
        setNotice("CSV is empty or contains no data rows.");
        return;
      }

      const headers = lines[0]
        .split(",")
        .map(h => h.trim().replace(/^"|"$/g, "").toLowerCase());

      const textIndex = headers.findIndex(h =>
        /feedback|comment|review|message|text/.test(h)
      );

      const customerIndex = headers.findIndex(h =>
        /customer|name|user/.test(h)
      );

      const rows = lines.slice(1).map((line, index) => {
        const columns = line.match(/("(?:[^"]|"")*"|[^,]*)(,|$)/g)
          ?.map(v => v.replace(/,$/, "").trim().replace(/^"|"$/g, "").replace(/""/g, '"')) || [];

        const text = columns[textIndex >= 0 ? textIndex : 0];
        if (!text?.trim()) return null;

        const result = analyseFeedback(text);

        return {
          id: Date.now() + index,
          customer: columns[customerIndex >= 0 ? customerIndex : -1] || "CSV Customer",
          text,
          category: result.category,
          sentiment: result.sentiment,
          date: new Date().toISOString().slice(0, 10)
        };
      }).filter(Boolean);

      if (rows.length) {
        setFeedback(previous => [...rows, ...previous]);
        setNotice(`${rows.length} feedback entries imported successfully.`);
        setPage("Feedback");
      } else {
        setNotice("No usable feedback rows found in the CSV.");
      }
    };

    reader.readAsText(file);
    event.target.value = "";
  }

  function exportReport() {
    const report = {
      project: "InsightFlow",
      generatedAt: new Date().toISOString(),
      summary: stats,
      topicAnalysis: topicData,
      recommendations,
      issues,
      feedback
    };

    const blob = new Blob(
      [JSON.stringify(report, null, 2)],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "insightflow-report.json";
    link.click();

    URL.revokeObjectURL(url);
    setNotice("Insight report exported successfully.");
  }

  function updateIssue(issue) {
    const nextStatus = {
      Open: "In Progress",
      "In Progress": "Resolved",
      Resolved: "Open"
    };

    setIssues(previous => previous.map(item =>
      item.id === issue.id
        ? { ...item, status: nextStatus[item.status] }
        : item
    ));
  }

  const navigation = [
    { name: "Overview", icon: LayoutDashboard },
    { name: "Feedback", icon: MessageSquare },
    { name: "AI Insights", icon: BrainCircuit },
    { name: "Issue Tracking", icon: CheckCircle2 }
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">
            <BrainCircuit size={25} />
          </div>
          <div>
            <strong>InsightFlow</strong>
            <small>Customer Intelligence</small>
          </div>
        </div>

        <p className="side-label">WORKSPACE</p>

        <nav className="navigation">
          {navigation.map(item => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                className={`nav-item ${page === item.name ? "active" : ""}`}
                onClick={() => setPage(item.name)}
              >
                <Icon size={19} />
                <span>{item.name}</span>
                {item.name === "Feedback" && (
                  <span className="nav-count">{feedback.length}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="ai-promo">
            <Sparkles size={20} />
            <h4>AI-powered insights</h4>
            <p>Turn customer voices into smarter business decisions.</p>
          </div>
          <div className="profile">
            <div className="avatar">IF</div>
            <div>
              <strong>InsightFlow Admin</strong>
              <small>Workspace owner</small>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div>
            <p className="breadcrumb">Workspace / {page}</p>
            <h1>{page === "Overview" ? "Customer Insights Overview" : page}</h1>
          </div>
          <div className="top-actions">
            <span className="live-status"><span /> Analytics ready</span>
            <button
              className="btn btn-primary"
              onClick={() => {
                setPage("Feedback");
                setShowForm(true);
              }}
            >
              <Plus size={17} /> Add feedback
            </button>
          </div>
        </header>

        {notice && (
          <div className="notice">
            <CheckCircle2 size={17} />
            <span>{notice}</span>
            <button onClick={() => setNotice("")} aria-label="Dismiss">
              <X size={16} />
            </button>
          </div>
        )}

        {page === "Overview" && (
          <>
            <section className="welcome-banner">
              <div className="banner-copy">
                <span className="eyebrow"><Sparkles size={14} /> FEEDBACK INTELLIGENCE</span>
                <h2>Understand your customers.<br />Make smarter decisions.</h2>
                <p>
                  Transform customer feedback into clear insights,
                  discover recurring problems, and find opportunities to improve.
                </p>
                <button className="banner-button" onClick={() => setPage("AI Insights")}>
                  Explore AI insights <ArrowUpRight size={17} />
                </button>
              </div>
              <div className="banner-visual">
                <div className="brain-circle"><BrainCircuit size={68} /></div>
                <div className="float-chip chip-a"><TrendingUp size={16} /> Smart analytics</div>
                <div className="float-chip chip-b"><MessageSquare size={16} /> Customer voice</div>
              </div>
            </section>

            <section className="stats-grid">
              <StatCard title="Total Feedback" value={stats.total} note="All customer responses" icon={MessageSquare} color="#6674dd" />
              <StatCard title="Positive Sentiment" value={`${stats.positivePercent}%`} note={`${stats.positive} positive responses`} icon={TrendingUp} color="#16a34a" />
              <StatCard title="Negative Feedback" value={stats.negative} note="Requires attention" icon={CircleAlert} color="#ef4444" />
              <StatCard title="Active Issues" value={issues.filter(i => i.status !== "Resolved").length} note="Open or in progress" icon={CheckCircle2} color="#d97706" />
            </section>

            <section className="dashboard-grid">
              <div className="panel">
                <div className="panel-heading">
                  <div>
                    <h3>Sentiment distribution</h3>
                    <p>Understand how customers feel</p>
                  </div>
                  <BrainCircuit size={20} />
                </div>

                <div className="sentiment-layout">
                  <div className="donut-wrap">
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie
                          data={sentimentData}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={62}
                          outerRadius={88}
                          paddingAngle={4}
                        >
                          {sentimentData.map(item => (
                            <Cell key={item.name} fill={item.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="donut-center">
                      <strong>{stats.total}</strong>
                      <small>Responses</small>
                    </div>
                  </div>

                  <div className="legend">
                    {sentimentData.map(item => (
                      <div className="legend-row" key={item.name}>
                        <span className="legend-dot" style={{ background: item.color }} />
                        <span>{item.name}</span>
                        <strong>{item.value}</strong>
                        <small>{stats.total ? Math.round(item.value / stats.total * 100) : 0}%</small>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="panel">
                <div className="panel-heading">
                  <div>
                    <h3>Top feedback topics</h3>
                    <p>Frequently mentioned categories</p>
                  </div>
                  <button className="text-button" onClick={() => setPage("AI Insights")}>
                    View insights <ArrowUpRight size={15} />
                  </button>
                </div>

                <ResponsiveContainer width="100%" height={270}>
                  <BarChart data={topicData.slice(0, 5)} layout="vertical" margin={{ left: 8, right: 15 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" allowDecimals={false} />
                    <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#6674dd" radius={[0, 5, 5, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="panel">
              <div className="panel-heading">
                <div>
                  <h3><Lightbulb className="inline-icon" size={19} /> Recommended priorities</h3>
                  <p>Ranked by the number of negative mentions</p>
                </div>
                <button className="text-button" onClick={() => setPage("AI Insights")}>See all <ArrowUpRight size={15} /></button>
              </div>

              {recommendations.slice(0, 3).map((item, index) => (
                <div className="recommend-row" key={item.name}>
                  <div className="rank-number">{index + 1}</div>
                  <div className="recommend-main">
                    <strong>{item.name}</strong>
                    <p>{item.negative} negative mentions among {item.count} feedback entries.</p>
                  </div>
                  <span className={`priority-badge ${item.negative >= 3 ? "high" : "medium"}`}>
                    {item.negative >= 3 ? "High priority" : "Monitor"}
                  </span>
                </div>
              ))}
            </section>
          </>
        )}

        {page === "Feedback" && (
          <section className="panel feedback-panel">
            <div className="panel-heading">
              <div>
                <h3>Feedback management</h3>
                <p>Search, filter, add and import customer feedback.</p>
              </div>
              <div className="feedback-actions">
                <label className="btn btn-outline upload-label">
                  <Upload size={16} /> Import CSV
                  <input type="file" accept=".csv,text/csv" hidden onChange={importCSV} />
                </label>
                <button className="btn btn-primary" onClick={() => setShowForm(value => !value)}>
                  <Plus size={16} /> Add feedback
                </button>
              </div>
            </div>

            {showForm && (
              <form className="feedback-form" onSubmit={addFeedback}>
                <h3>New customer feedback</h3>
                <label>
                  Customer name
                  <input value={customer} onChange={e => setCustomer(e.target.value)} placeholder="Enter customer name" />
                </label>
                <label>
                  Feedback message
                  <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="What did the customer say?" required rows={3} />
                </label>
                <div className="form-actions">
                  <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary"><BrainCircuit size={16} /> Analyse & save</button>
                </div>
              </form>
            )}

            <div className="filter-row">
              <div className="search-box">
                <Search size={17} />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search feedback..." />
              </div>
              <div className="select-wrap">
                <Filter size={15} />
                <select value={sentimentFilter} onChange={e => setSentimentFilter(e.target.value)}>
                  <option>All</option>
                  <option>Positive</option>
                  <option>Negative</option>
                  <option>Neutral</option>
                </select>
              </div>
              <div className="select-wrap">
                <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
                  <option>All</option>
                  {categories.map(category => <option key={category}>{category}</option>)}
                </select>
              </div>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Customer feedback</th><th>Category</th><th>Sentiment</th><th>Date</th></tr>
                </thead>
                <tbody>
                  {filteredFeedback.map(item => (
                    <tr key={item.id}>
                      <td>
                        <div className="customer-cell">
                          <div className="customer-avatar">{item.customer.charAt(0).toUpperCase()}</div>
                          <div><strong>{item.customer}</strong><p>{item.text}</p></div>
                        </div>
                      </td>
                      <td><span className="category-pill">{item.category}</span></td>
                      <td><span className={`sentiment-pill ${item.sentiment.toLowerCase()}`}>{item.sentiment}</span></td>
                      <td>{item.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!filteredFeedback.length && <div className="empty-state">No feedback matches your filters.</div>}
            </div>
          </section>
        )}

        {page === "AI Insights" && (
          <div className="insights-page">
            <section className="insights-banner">
              <div className="insights-icon"><BrainCircuit size={30} /></div>
              <div>
                <span className="eyebrow">AI-ASSISTED ANALYSIS</span>
                <h2>Insights that drive action</h2>
                <p>Identify patterns, measure sentiment, and prioritize recurring complaints.</p>
              </div>
            </section>

            <section className="stats-grid">
              <StatCard title="Negative responses" value={stats.negative} note={`${feedback.length ? Math.round(stats.negative / feedback.length * 100) : 0}% of feedback`} icon={CircleAlert} color="#ef4444" />
              <StatCard title="Topics identified" value={categories.length} note="Categories found" icon={BrainCircuit} color="#6674dd" />
              <StatCard title="Positive responses" value={stats.positive} note="Positive customer signals" icon={CheckCircle2} color="#16a34a" />
            </section>

            <section className="panel">
              <div className="panel-heading">
                <div><h3>Actionable recommendations</h3><p>Evidence-based suggestions from current feedback.</p></div>
                <Lightbulb color="#d97706" />
              </div>

              {recommendations.map((item, index) => {
                let action = "Review the customer journey and address repeated friction points.";

                if (item.name === "Delivery") action = "Investigate shipping delays, review delivery partners, and notify customers proactively.";
                if (item.name === "Support") action = "Audit unanswered tickets, set response-time targets, and improve refund follow-ups.";
                if (item.name === "Product Quality") action = "Investigate product defects and add quality checks before dispatch.";
                if (item.name === "Pricing") action = "Make additional charges transparent and review pricing concerns.";

                return (
                  <div className="insight-card" key={item.name}>
                    <div className="insight-rank">#{index + 1}</div>
                    <div className="insight-content">
                      <h4>{item.name}</h4>
                      <p>{item.negative} negative mentions out of {item.count} related entries ({Math.round(item.negative / item.count * 100)}%).</p>
                      <p><strong>Suggested action:</strong> {action}</p>
                    </div>
                    <span className={`priority-badge ${item.negative >= 3 ? "high" : "medium"}`}>
                      {item.negative >= 3 ? "High" : "Monitor"}
                    </span>
                  </div>
                );
              })}

              {!recommendations.length && <p className="empty-state">No negative issues found in the current dataset.</p>}
            </section>
          </div>
        )}

        {page === "Issue Tracking" && (
          <section className="panel">
            <div className="panel-heading">
              <div><h3>Issue tracking</h3><p>Click the status to move each issue to the next stage.</p></div>
              <CheckCircle2 size={21} />
            </div>

            <div className="issue-list">
              {issues.map(issue => (
                <div className="issue-row" key={issue.id}>
                  <div className="issue-icon"><CircleAlert size={21} /></div>
                  <div className="issue-info">
                    <strong>{issue.title}</strong>
                    <p>{issue.category} · Based on recurring feedback</p>
                  </div>
                  <button className={`status-button ${issue.status.toLowerCase().replace(" ", "-")}`} onClick={() => updateIssue(issue)}>
                    {issue.status} <ArrowUpRight size={14} />
                  </button>
                </div>
              ))}
            </div>
            <p className="muted-note">Demo issue status is stored in the current browser session.</p>
          </section>
        )}

        <footer className="footer">
          <span>InsightFlow © 2026</span>
          <span>BUILD BATTLE 2026 · AI × Web Development</span>
          <button onClick={exportReport}><Download size={15} /> Export report</button>
        </footer>
      </main>
    </div>
  );
}
