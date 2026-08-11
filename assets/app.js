(() => {
  "use strict";

  const data = window.ATLAS_DATA;
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const fmt = (value, digits = 0) => value == null ? "—" : new Intl.NumberFormat("zh-CN", { maximumFractionDigits: digits }).format(value);
  const compact = (value) => value == null ? "—" : new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 2 }).format(value);
  const bytes = (value) => `${(value / 1024 ** 3).toFixed(2)} GiB`;
  const date = (value) => value ? value.slice(0, 10) : "—";
  const escape = (value) => String(value ?? "—").replace(/[&<>'"]/g, (char) => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[char]));

  $("#source-status").textContent = data.source_status.toUpperCase();
  $("#generated-at").textContent = `Payload generated ${data.generated_at_utc}`;
  $("#hero-events").textContent = fmt(data.headline.events);
  $("#hero-markets").textContent = fmt(data.headline.traded_markets);
  $("#hero-span").textContent = data.headline.span_years.toFixed(2);
  $("#scale-direct-answer").innerHTML = `共有 <b>${fmt(data.headline.events)} 个有效 events</b> 和 <b>${fmt(data.headline.traded_markets)} 个有成交 markets</b>。全局 UTC 时间点分别为 1 分钟 ${fmt(data.frequencies["1m"].distinct_utc_buckets)} 个、15 分钟 ${fmt(data.frequencies["15m"].distinct_utc_buckets)} 个、1 小时 ${fmt(data.frequencies["1h"].distinct_utc_buckets)} 个；对应的 market-time 观测行是 ${fmt(data.frequencies["1m"].rows)}、${fmt(data.frequencies["15m"].rows)} 和 ${fmt(data.frequencies["1h"].rows)}。覆盖 ${date(data.frequencies["1m"].first_bucket_utc)} 至 ${date(data.frequencies["1m"].last_bucket_utc)}，共 ${fmt(data.headline.span_days, 2)} 天（${data.headline.span_years.toFixed(2)} 年）。`;

  $("#status-list").innerHTML = data.status.map((item) => `
    <div class="status-item">
      <i class="status-dot ${escape(item.state)}"></i>
      <div><b>${escape(item.name)}</b><small>${escape(item.detail)}</small></div>
      <span>${escape(item.state)}</span>
    </div>`).join("");

  const metrics = [
    ["TRUSTED TRANSACTIONS", compact(data.headline.trusted_trades), "rows", `${fmt(data.headline.trusted_trades)} 笔可信成交`],
    ["TRADED MARKETS", compact(data.headline.traded_markets), "markets", `catalog 共 ${fmt(data.headline.catalog_markets)} 个`],
    ["VALID EVENTS", compact(data.headline.events), "events", "有可信成交的父事件"],
    ["MARKET-MINUTES", compact(data.frequencies["1m"].rows), "rows", `${fmt(data.frequencies["1m"].rows)} 条观测`],
    ["MARKET-15-MINUTES", compact(data.frequencies["15m"].rows), "rows", `${fmt(data.frequencies["15m"].rows)} 条观测`],
    ["MARKET-HOURS", compact(data.frequencies["1h"].rows), "rows", `${fmt(data.frequencies["1h"].rows)} 条观测`],
    ["REGULAR HOURS", compact(data.headline.regular_hour_rows), "rows", "含最多一小时状态延续"],
    ["OBSERVED SPAN", data.headline.span_years.toFixed(2), "years", `${fmt(data.headline.span_days, 2)} 天`],
  ];
  $("#headline-metrics").innerHTML = metrics.map(([tag, value, unit, detail]) => `
    <article class="metric"><span class="metric-tag">${tag}</span><div class="metric-value">${value}<i>${unit}</i></div><p>${detail}</p></article>`).join("");

  const frequencyOrder = ["1m", "15m", "1h"];
  $("#frequency-table").innerHTML = `<thead><tr><th>尺度</th><th>不同 UTC buckets</th><th>Market-time 行</th><th>Markets</th><th>观测范围</th><th>磁盘</th><th>研究用途</th></tr></thead><tbody>${frequencyOrder.map((key) => {
    const row = data.frequencies[key];
    return `<tr><td><b>${key}</b></td><td>${fmt(row.distinct_utc_buckets)}</td><td>${fmt(row.rows)}</td><td>${fmt(row.market_count)}</td><td>${date(row.first_bucket_utc)} → ${date(row.last_bucket_utc)}</td><td>${bytes(row.bytes)}</td><td>${escape(row.role)}</td></tr>`;
  }).join("")}</tbody>`;

  const renderFields = (key, target, countTarget) => {
    const fields = data.schemas[key];
    $(target).innerHTML = fields.map((field) => `<code>${escape(field)}</code>`).join("");
    $(countTarget).textContent = `${fields.length} fields`;
  };
  renderFields("event", "#event-fields", "#event-field-count");
  renderFields("market", "#market-fields", "#market-field-count");
  renderFields("observed_bar", "#bar-fields", "#bar-field-count");
  $("#direct-event-fields").textContent = fmt(data.schemas.event.length);
  $("#direct-market-fields").textContent = fmt(data.schemas.market.length);
  $("#direct-bar-fields").textContent = fmt(data.schemas.observed_bar.length);

  const quantileLabels = [["p25", "P25"], ["p50", "P50"], ["p75", "P75"], ["p90", "P90"], ["p95", "P95"], ["p99", "P99"], ["max", "MAX"]];
  const renderQuantiles = (frequency) => {
    const row = data.frequencies[frequency];
    const values = row.points_per_market;
    const maxLog = Math.log1p(values.max);
    $("#distribution-title").textContent = `${frequency} observed 点数分布`;
    $("#distribution-mean").textContent = `mean ${fmt(row.mean_points_per_market, 1)}`;
    $("#quantile-chart").innerHTML = quantileLabels.map(([key, label]) => {
      const value = values[key];
      const width = Math.log1p(value) / maxLog * 100;
      return `<div class="quantile-row"><span>${label}</span><div class="bar-track"><i style="width:${width.toFixed(2)}%"></i></div><b>${fmt(value)}</b></div>`;
    }).join("");
    $("#frequency-detail").innerHTML = `<span>UTC buckets <b>${fmt(row.distinct_utc_buckets)}</b></span><span>rows <b>${fmt(row.rows)}</b></span><span>disk <b>${bytes(row.bytes)}</b></span><span>role <b>${escape(row.role)}</b></span>`;
  };
  renderQuantiles("1h");
  const hourlyPoints = data.frequencies["1h"].points_per_market;
  $("#distribution-direct-answer").innerHTML = `轨迹长度呈明显长尾：1 小时 observed 轨迹的中位数只有 <b>${fmt(hourlyPoints.p50)} 个点</b>，P90 为 ${fmt(hourlyPoints.p90)}、P99 为 ${fmt(hourlyPoints.p99)}，最长达到 ${fmt(hourlyPoints.max)}；而 1 分钟层共有 ${fmt(data.frequencies["1m"].rows)} 条 market-time 观测。三种频率服务不同任务，正式实验以 1 小时为主，同时保留 15 分钟响应诊断和 1 分钟基础层。`;
  $$(".frequency-tabs button").forEach((button) => button.addEventListener("click", () => {
    $$(".frequency-tabs button").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    renderQuantiles(button.dataset.frequency);
  }));

  const eventMarket = data.event_distributions.market_count;
  const eventMaxLog = Math.log1p(eventMarket.max);
  $("#event-market-chart").innerHTML = quantileLabels.map(([key, label]) => {
    const value = eventMarket[key];
    return `<div class="quantile-row"><span>${label}</span><div class="bar-track"><i style="width:${(Math.log1p(value) / eventMaxLog * 100).toFixed(2)}%"></i></div><b>${fmt(value)}</b></div>`;
  }).join("");

  const caseNotes = {
    "long-trajectory": {
      context: "2024 美国总统选举父事件包含 17 个候选人 markets；这里展示 Donald Trump 获胜命题。",
      reading: "从 2024 年 1 月持续到选举结果确认，小时价格由约 0.42 走向 0.998，选举日前成交显著变密。",
      value: "适合检验长历史预测、高流动性状态变化和多尺度轨迹表示。",
      warning: "同一父事件下候选人概率具有机械互斥约束，不能把 sibling 联动直接解释成跨事件信息传导。",
    },
    "multi-market-event": {
      context: "一场 Dota 2 BO5 父事件包含 137 个 markets，覆盖系列赛、单局胜负及其他条件命题；这里仅展示 Game 2 胜者。",
      reading: "该 market 只有 7 个小时 observed 点，价格从 0.59 快速走到 0.999，是短生命周期高信息密度轨迹。",
      value: "说明 event_id 适合组织命题集合，但预测轨迹仍必须落在具体 market 上。",
      warning: "系列赛胜者、单局胜者和统计命题语义不同，未经关系规则不能平均成一条“事件概率”。",
    },
    "deadline-family": {
      context: "“停火是否在某日前延长”父事件含 4 个相邻截止日期命题，文本高度相似但结算条件不同。",
      reading: "246 个小时 observed 点、44,413 笔可信成交；所选命题从 0.38 波动后走向 0.001。",
      value: "适合检验短期响应、deadline 邻近关系和 family-aware 时间外切分。",
      warning: "相邻日期改写若跨 train/test，会造成近重复命题泄漏；catalog deadline 也不能替代真实成交边界。",
    },
    "non-binary-label": {
      context: "Seattle vs. New England 父事件含 95 个 markets；该命题的 answer1 是 Seahawks，answer2 是 Patriots。",
      reading: "340 个小时 observed 点、61,548 笔成交，answer1 概率由约 0.67 走向 0.999。",
      value: "展示统一价格方向后，体育、政治和宏观命题可以共享轨迹接口。",
      warning: "0.67 表示 Seahawks 概率 67%，不是抽象的 Yes=67%；样本必须携带 answer 文本。",
    },
    "invalid-catalog-date": {
      context: "Israel × Hezbollah 停火命题的原始 catalog 日期存在矛盾，但 market/event 身份和可信成交仍可追踪。",
      reading: "真实成交形成 106 个小时 observed 点、13,613 笔成交，价格由约 0.87 走向 0.999。",
      value: "展示元数据异常不必整条删除：可保留异常标记，并由可信成交界定观察窗口。",
      warning: "不能用错误的 created/end date 生成历史长度、目标 horizon 或时间 split。",
    },
    "identity-quarantine": {
      context: "Super Bowl 55 题目和 outcomes 都可读，但 event_id 缺失，无法回溯到可靠父事件。",
      reading: "当前可信数据中没有可接受成交和 observed bars，因此不存在可用于训练的概率轨迹。",
      value: "它是身份治理的负例：语义可理解与数据可训练是两个不同条件。",
      warning: "不得仅凭文本相似度猜测 event_id 后混入严格 event-level 或 cross-event 训练。",
    },
    "catalog-only": {
      context: "2020 Pennsylvania 选举命题存在于 catalog，但本项目可信成交覆盖中没有对应轨迹。",
      reading: "1m、15m、1h observed 点均为 0；catalog 生命周期不是实际可观测概率序列。",
      value: "它明确区分“目录规模”与“可训练市场数量”，避免夸大数据覆盖。",
      warning: "没有成交状态、mask 和目标值时，不能根据 catalog 日期虚构日历轨迹。",
    },
  };

  const sparkline = (points) => {
    if (!points.length) return `<div class="no-trajectory"><b>无可信 P1B 小时轨迹</b><span>横轴：UTC 时间 · 纵轴：p_answer1 概率（0–1）</span></div>`;
    const width = 640, height = 210;
    const plot = { left: 58, right: 16, top: 15, bottom: 164 };
    const timestamps = points.map((point) => Date.parse(point.time));
    const firstTime = timestamps[0];
    const lastTime = timestamps.at(-1);
    const timeSpan = Math.max(lastTime - firstTime, 1);
    const coords = points.map((point, index) => {
      const timeRatio = Number.isFinite(timestamps[index]) ? (timestamps[index] - firstTime) / timeSpan : index / Math.max(points.length - 1, 1);
      const probability = Math.min(1, Math.max(0, Number(point.price)));
      const x = plot.left + timeRatio * (width - plot.left - plot.right);
      const y = plot.top + (1 - probability) * (plot.bottom - plot.top);
      return [x, y];
    });
    const line = coords.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
    const area = `${plot.left},${plot.bottom} ${line} ${width - plot.right},${plot.bottom}`;
    const middleTime = new Date(firstTime + timeSpan / 2).toISOString();
    const yTicks = [1, .5, 0].map((value) => {
      const y = plot.top + (1 - value) * (plot.bottom - plot.top);
      return `<line class="grid" x1="${plot.left}" y1="${y}" x2="${width - plot.right}" y2="${y}"></line><text class="tick y-tick" x="${plot.left - 10}" y="${y + 3}">${value.toFixed(1)}</text>`;
    }).join("");
    const xTicks = [[plot.left, date(points[0].time), "start"], [(plot.left + width - plot.right) / 2, date(middleTime), "middle"], [width - plot.right, date(points.at(-1).time), "end"]]
      .map(([x, label, anchor]) => `<line class="tick-mark" x1="${x}" y1="${plot.bottom}" x2="${x}" y2="${plot.bottom + 5}"></line><text class="tick x-tick" x="${x}" y="${plot.bottom + 18}" text-anchor="${anchor}">${label}</text>`).join("");
    return `<svg class="sparkline" viewBox="0 0 ${width} ${height}" role="img" aria-label="横轴为 UTC 时间，纵轴为 p_answer1 概率，范围 0 到 1">
      <title>p_answer1 小时价格轨迹</title>
      <desc>横轴为 UTC 时间；纵轴为 answer1 概率，固定范围从 0 到 1。</desc>
      ${yTicks}<line class="axis" x1="${plot.left}" y1="${plot.top}" x2="${plot.left}" y2="${plot.bottom}"></line><line class="axis" x1="${plot.left}" y1="${plot.bottom}" x2="${width - plot.right}" y2="${plot.bottom}"></line>
      <polygon class="area" points="${area}"></polygon><polyline class="line" points="${line}"></polyline>${xTicks}
      <text class="axis-label y-label" transform="translate(14 ${(plot.top + plot.bottom) / 2}) rotate(-90)" text-anchor="middle">p_answer1 probability</text>
      <text class="axis-label x-label" x="${(plot.left + width - plot.right) / 2}" y="${height - 7}" text-anchor="middle">UTC time</text>
    </svg>`;
  };

  $("#case-grid").innerHTML = data.cases.map((item, index) => {
    const filter = item.has_trusted_trades ? "trajectory" : "governance";
    const eventMarkets = item.event ? `${fmt(item.event.market_count)} markets in event` : "no verified event";
    const notes = caseNotes[item.slug];
    const points = item.trajectory_1h;
    const firstPrice = points.length ? Number(points[0].price).toFixed(3) : "—";
    const lastPrice = points.length ? Number(points.at(-1).price).toFixed(3) : "—";
    const period = item.first_trade_hour_utc ? `${date(item.first_trade_hour_utc)} → ${date(item.last_trade_hour_utc)}` : "无可信成交区间";
    return `<article class="case-card" data-kind="${filter}">
      <div class="case-top"><span>CASE ${String(index + 1).padStart(2, "0")} · MARKET ${escape(item.market_id)}</span><b>${escape(item.type)}</b></div>
      <p class="case-event">${escape(item.event_title || "未验证父事件")}</p>
      <h3>${escape(item.question_text)}</h3>
      <p class="case-question">${escape(item.answer1)} ↔ ${escape(item.answer2)} · ${escape(eventMarkets)}</p>
      <p class="case-summary">${escape(item.summary)}</p>
      <div class="case-stats"><span><b>${fmt(item.trusted_trade_count)}</b>trusted trades</span><span><b>${fmt(item.observed_points["1m"])}</b>1m points</span><span><b>${fmt(item.observed_points["15m"])}</b>15m points</span><span><b>${fmt(item.observed_points["1h"])}</b>1h points</span></div>
      ${sparkline(item.trajectory_1h)}
      <div class="axis-legend"><span><b>横轴 X</b>UTC 时间（左 → 右）</span><span><b>纵轴 Y</b><code>p_answer1</code> 概率（0–1）</span></div>
      <div class="case-timeline"><span>${escape(period)}</span><span>p_answer1 <b>${firstPrice} → ${lastPrice}</b></span></div>
      <div class="case-detail-grid">
        <section><span>EVENT CONTEXT</span><p>${escape(notes.context)}</p></section>
        <section><span>TRAJECTORY READING</span><p>${escape(notes.reading)}</p></section>
        <section><span>WHY REPRESENTATIVE</span><p>${escape(notes.value)}</p></section>
        <section><span>MODELING WARNING</span><p>${escape(notes.warning)}</p></section>
      </div>
      <div class="case-callout">它回答：${escape(item.question)}</div>
    </article>`;
  }).join("");
  $$(".case-toolbar button").forEach((button) => button.addEventListener("click", () => {
    $$(".case-toolbar button").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    $$(".case-card").forEach((card) => card.classList.toggle("hidden", button.dataset.filter !== "all" && card.dataset.kind !== button.dataset.filter));
  }));

  const pilotMetrics = [
    [fmt(31949309), "formal calendar samples"],
    [fmt(26330043), "cold-family samples"],
    [fmt(192), "protocol × shard files"],
    [fmt(3), "A-H / A-D / A-S protocols"],
  ];
  $("#pilot-metrics").innerHTML = pilotMetrics.map(([value, label]) => `<article class="pilot-metric"><b>${value}</b><span>${label}</span></article>`).join("");

  const sample = data.pilot.sample;
  const pilotPreview = {
    sample_id: sample.sample_id,
    market_id: sample.market_id,
    event_id: sample.event_id,
    as_of_time: sample.as_of_time,
    history_times_utc: sample.history_times_utc,
    history_p_answer1: sample.history_p_answer1,
    target_times_utc: sample.target_times_utc,
    target_p_answer1: sample.target_p_answer1,
    split: sample.split,
  };
  const formalPreview = {
    dataset_version: "polymarket-track-a-v0",
    sample_count: 31949309,
    cold_family_sample_count: 26330043,
    protocols: ["A-H: 24h -> 1/6/24h", "A-D: 10d -> 7d", "A-S: 16d -> 1d"],
    identity: ["sample_id", "protocol", "market_id", "event_id", "event_family_id"],
    boundary: ["as_of_time", "temporal_split", "cold_family_eligible"],
    history: ["p_answer1", "has_trade", "volume", "trade_count", "signed_usd", "staleness", "mask"],
    target: ["target_p_answer1", "target_mask", "horizons"],
    split_rule: "time + event family",
    status: "materialized; deterministic simple baselines complete",
  };
  $("#pilot-preview").textContent = JSON.stringify(pilotPreview, null, 2);
  $("#formal-preview").textContent = JSON.stringify(formalPreview, null, 2);
  $("#pilot-limitations").innerHTML = data.pilot.limitations.map((item) => `<article class="limitation">${escape(item)}</article>`).join("");
})();
