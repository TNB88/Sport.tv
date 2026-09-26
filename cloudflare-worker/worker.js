const SOURCES = {
  "truyen-hinh": {
    name: "Truyền Hình",
    enabled: true,
    upstream: "https://raw.githubusercontent.com/PLTV2026/TVQ8/main/MUCKENH.m3u",
  },
  "thanh-tv": {
    name: "Thanh TV",
    enabled: true,
    upstream: "https://raw.githubusercontent.com/vuminhthanh12/vuminhthanh12/refs/heads/main/vmttv",
  },
  "vietanh-tv": {
    name: "VietAnhTV",
    enabled: true,
    upstream: "https://tv.vietanhtv.top/sex/",
  },
};

const FOOTBALL_MATCHES_API = "https://api.gvapi.cc/api/matches";
const FOOTBALL_REMOTE_CONFIG = "https://raw.githubusercontent.com/TNB88/Sport.tv/main/sport-stream-domains.json";
const XOILAC_REFERERS = [
  "https://xoilacxbi.tv/",
  "https://xoilaclivettbdl.tv/",
];
const XOILAC_REFERER = XOILAC_REFERERS[0];

// Danh sách nguồn thật lấy theo kiến trúc provider của GETOUT. Provider lỗi/rỗng
// sẽ không xuất hiện trong catalog; khi domain hoạt động lại nó tự hiện trở lại.
const SPORT_STREAM_PROVIDERS = [
  { id: "chuoichien", name: "Chuối Chiên" },
  {
    id: "bonglau",
    name: "Bông Lau",
    icon: "https://ui-avatars.com/api/?name=BL&size=256&background=3F0D12&color=FFD166&bold=true&format=png",
  },
  { id: "colatv", name: "COLA TV" },
  { id: "gavang33", name: "Gà Vàng 33" },
  { id: "giovang", name: "Giờ Vàng" },
  {
    id: "socolive",
    name: "SoCoLive",
    icon: "https://raw.githubusercontent.com/TNB88/Sport.tv/main/provider-icons/socolive-logo.jpg",
  },
  {
    id: "khandai",
    name: "Khán Đài",
    icon: "https://raw.githubusercontent.com/TNB88/Sport.tv/main/provider-icons/khandai-logo.webp",
  },
  { id: "phalang", name: "Phá Làng TV" },
  { id: "xoiche", name: "Xôi Chè" },
  { id: "xoilacxth", name: "Xôi Lạc" },
];

const SPORT_STREAM_VISIBLE_MATCH_LIMIT = 18;

const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "public, max-age=60",
  "access-control-allow-origin": "*",
  "x-content-type-options": "nosniff",
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: JSON_HEADERS,
  });
}

function stripVietnamese(value = "") {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/đ/gi, "d")
    .toLowerCase();
}

function parseM3u(text, sourceId) {
  const result = [];
  const lines = text.replace(/\r/g, "").split("\n");
  let pending = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    if (line.startsWith("#EXTINF:")) {
      const comma = line.lastIndexOf(",");
      const attributes = comma >= 0 ? line.slice(0, comma) : line;
      const name = comma >= 0 ? line.slice(comma + 1).trim() : "Kênh thể thao";
      const fields = {};
      for (const match of attributes.matchAll(/([\w-]+)="([^"]*)"/g)) {
        fields[match[1].toLowerCase()] = match[2].trim();
      }
      pending = {
        sourceId,
        name,
        group: fields["group-title"] || "Thể thao",
        logo: fields["tvg-logo"] || "",
        referer: "",
        userAgent: "",
      };
      continue;
    }

    if (!pending) continue;
    if (line.startsWith("#EXTVLCOPT:http-referrer=")) {
      pending.referer = line.slice(line.indexOf("=") + 1).trim();
      continue;
    }
    if (line.startsWith("#EXTVLCOPT:http-user-agent=")) {
      pending.userAgent = line.slice(line.indexOf("=") + 1).trim();
      continue;
    }
    if (line.startsWith("#")) continue;
    if (!/^https?:\/\//i.test(line)) {
      pending = null;
      continue;
    }

    pending.url = line;
    result.push(pending);
    pending = null;
  }
  return result;
}

function isSportItem(item) {
  const text = stripVietnamese(`${item.group} ${item.name}`);
  return [
    "cola tv", "ga vang", "khan dai", "xoilac", "xoiche",
    "pha lang", "chuoi chien", "gio vang", "bong lau", "socolive",
  ].some((keyword) => text.includes(keyword));
}

function providerFor(item) {
  const text = stripVietnamese(`${item.group} ${item.name}`);
  if (text.includes("cola tv")) return "colatv";
  if (text.includes("ga vang")) return "gavang33";
  if (text.includes("chuoi chien")) return "chuoichien";
  if (text.includes("bong lau")) return "bonglau";
  if (text.includes("socolive")) return "socolive";
  if (text.includes("gio vang")) return "giovang";
  if (text.includes("pha lang")) return "phalang";
  if (text.includes("xoi che")) return "xoiche";
  if (text.includes("xoi lac")) return "xoilacxth";
  if (text.includes("khan dai") || text.includes("live events")) return "khandai";
  return "gavang33";
}

function playbackSource(item) {
  const separator = item.url.indexOf("|");
  const streamUrl = separator >= 0 ? item.url.slice(0, separator) : item.url;
  const headers = {};

  if (item.referer) headers.Referer = item.referer;
  if (item.userAgent) headers["User-Agent"] = item.userAgent;

  if (separator >= 0) {
    const encodedHeaders = item.url.slice(separator + 1);
    for (const pair of encodedHeaders.split("&")) {
      const equals = pair.indexOf("=");
      if (equals <= 0) continue;
      const rawName = pair.slice(0, equals);
      const rawValue = pair.slice(equals + 1);
      try {
        const name = decodeURIComponent(rawName);
        const value = decodeURIComponent(rawValue);
        if (name.toLowerCase() === "http-referrer") headers.Referer = value;
        else headers[name] = value;
      } catch (_) {
        // Bỏ qua header bị mã hóa sai, vẫn giữ được URL phát chính.
      }
    }
  }

  return {
    name: item.name || "Bình Pro",
    provider: "Bình Pro",
    url: streamUrl,
    headers,
    type: /\.m3u8(?:$|[?#])/i.test(streamUrl) ? "hls" : "direct",
  };
}

async function fetchPlaylist(source) {
  const response = await fetch(source.upstream, {
    redirect: "follow",
    headers: {
      "user-agent": "okhttp/5.0.0-alpha.11",
      accept: "application/vnd.apple.mpegurl, application/x-mpegURL, text/plain, */*",
    },
    cf: { cacheEverything: true, cacheTtl: 120 },
  });
  if (!response.ok) throw new Error(`upstream_${response.status}`);
  return response.text();
}

async function sportStreamItems() {
  const sourceEntries = Object.entries(SOURCES).filter(
    ([id, item]) => item.enabled && (id === "truyen-hinh" || id === "thanh-tv"),
  );
  const settled = await Promise.allSettled(
    sourceEntries.map(async ([id, source]) => parseM3u(await fetchPlaylist(source), id)),
  );
  const allItems = settled.flatMap((item) => item.status === "fulfilled" ? item.value : []);
  const seen = new Set();
  const filtered = [];

  for (const item of allItems) {
    if (!isSportItem(item)) continue;
    // Bản mobile hiện chưa nhận ClearKey/Widevine từ M3U, chỉ đưa nguồn phát trực tiếp.
    if (/\.mpd(?:$|[?#])/i.test(item.url)) continue;
    const dedupeKey = `${stripVietnamese(item.name)}|${item.url}`;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);
    filtered.push(item);
    if (filtered.length >= 240) break;
  }

  return filtered;
}

const SPORT_USER_AGENT = "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/120 Mobile Safari/537.36";
const CHUOI_API = "https://api-v2.chuoichientv.com/v2/matches?page=1&limit=100&sport=football&type=blv";
const COLA_APIS = [
  "https://api1.colatv88xd.cc/api/matches",
  "https://api2.colatv88xd.cc/api/matches",
  "https://api3.colatv88xd.cc/api/matches",
];
const GIOVANG_BASE = "https://live-api.keonhacaitp.one";
const SOCOLIVE_RECOMMEND = "https://json.vnres.co/match_recommend.json";
const GAVANG_REMOTE_CONFIG = "https://raw.githubusercontent.com/leeshin5757/getout/main/txt/gavangtv";

function matchTimeMs(match) {
  const raw = Number(match.matchTime ?? match.match_time ?? match.time_start ?? 0);
  return raw > 100000000000 ? raw : raw * 1000;
}

function providerById(id) {
  return SPORT_STREAM_PROVIDERS.find((provider) => provider.id === id) || {
    id,
    name: id,
  };
}

function jsonpObject(text) {
  const start = text.indexOf("(");
  const end = text.lastIndexOf(")");
  const raw = start >= 0 && end > start ? text.slice(start + 1, end) : text;
  return JSON.parse(raw);
}

async function fetchText(url, options = {}, ttl = 15) {
  const response = await fetch(url, {
    redirect: "follow",
    ...options,
    cf: { cacheEverything: true, cacheTtl: ttl, ...(options.cf || {}) },
  });
  if (!response.ok) throw new Error(`upstream_${response.status}`);
  return response.text();
}

async function fetchJson(url, options = {}, ttl = 15) {
  return JSON.parse(await fetchText(url, options, ttl));
}

function sourceCollector(providerName, headers = {}) {
  const sources = [];
  const seen = new Set();
  return {
    add(name, url) {
      if (typeof url !== "string") return;
      const cleanUrl = url.trim();
      if (!/^https?:\/\//i.test(cleanUrl) || seen.has(cleanUrl)) return;
      seen.add(cleanUrl);
      sources.push({
        name: name || "Nguồn tự động",
        provider: providerName,
        url: cleanUrl,
        headers,
        type: /\.m3u8(?:$|[?#])/i.test(cleanUrl) ? "hls" : "direct",
      });
    },
    result() {
      return sources;
    },
  };
}

async function footballRuntimeConfig() {
  const fallback = {
    enabled: true,
    matchesApi: FOOTBALL_MATCHES_API,
    referers: XOILAC_REFERERS,
  };
  try {
    const remote = await fetchJson(
      `${FOOTBALL_REMOTE_CONFIG}?t=${Math.floor(Date.now() / 300000)}`,
      { headers: { "user-agent": "BinhPro-SportsTV-Worker/2.0", accept: "application/json" } },
      300,
    );
    const matchesApi = typeof remote?.matches_api === "string" && /^https:\/\//i.test(remote.matches_api)
      ? remote.matches_api.trim()
      : fallback.matchesApi;
    const referers = Array.isArray(remote?.referers)
      ? remote.referers
          .filter((value) => typeof value === "string" && /^https:\/\//i.test(value))
          .map((value) => value.endsWith("/") ? value : `${value}/`)
      : [];
    return {
      enabled: remote?.enabled !== false,
      matchesApi,
      referers: [...new Set([...referers, ...XOILAC_REFERERS])],
    };
  } catch (_) {
    return fallback;
  }
}

function normalizeGvRows(providerId, entries, referer) {
  const provider = providerById(providerId);
  return entries
    .filter(([, match]) => {
      const sportId = Number(match.sportId ?? match.sport_id ?? 0);
      const status = Number(match.matchStatus ?? match.match_status ?? 0);
      return sportId === 1 && (status === 1 || status === 2);
    })
    .map(([key, match]) => {
      const anchors = Array.isArray(match.anchorAppointmentVoList)
        ? match.anchorAppointmentVoList.length
        : 0;
      return {
        key: String(key),
        provider: provider.id,
        provider_name: provider.name,
        name: `${match.homeTeamName || match.home_team || "Đội nhà"} - ${match.awayTeamName || match.away_team || "Đội khách"}`,
        home_name: match.homeTeamName || match.home_team || "Đội nhà",
        away_name: match.awayTeamName || match.away_team || "Đội khách",
        home_logo: match.homeTeamLogo || "",
        away_logo: match.awayTeamLogo || "",
        kickoff: matchTimeMs(match),
        live: Number(match.matchStatus ?? match.match_status ?? 0) === 2,
        commentator: `${match.competitionName || match.competition || "Bóng đá"}${anchors ? ` · ${anchors} BLV` : ""}`,
        _raw: match,
        _referer: referer,
      };
    });
}

async function fetchGvRows(providerId) {
  if (providerId === "xoilacxth") {
    const runtime = await footballRuntimeConfig();
    if (!runtime.enabled) return [];
    for (const referer of runtime.referers) {
      try {
        const payload = await fetchJson(`${runtime.matchesApi}?t=${Date.now()}`, {
          headers: { "user-agent": SPORT_USER_AGENT, accept: "application/json, text/plain, */*", referer },
        });
        if (payload?.data) return normalizeGvRows(providerId, Object.entries(payload.data), referer);
      } catch (_) {
        // Thử domain Xôi Lạc tiếp theo trong cấu hình từ xa.
      }
    }
    return [];
  }

  for (const api of COLA_APIS) {
    try {
      const referer = "https://colatv.live/";
      const payload = await fetchJson(`${api}?t=${Date.now()}`, {
        headers: { "user-agent": SPORT_USER_AGENT, accept: "application/json, text/plain, */*", referer },
      });
      if (payload?.data) return normalizeGvRows(providerId, Object.entries(payload.data), referer);
    } catch (_) {
      // Tự chuyển API COLA tiếp theo.
    }
  }
  return [];
}

function gvSources(match, providerName, referer) {
  const collector = sourceCollector(providerName, {
    Referer: referer,
    "User-Agent": SPORT_USER_AGENT,
  });
  collector.add("Nguồn tự động", match.videoUrl || match.video_url);
  const anchors = Array.isArray(match.anchorAppointmentVoList) ? match.anchorAppointmentVoList : [];
  for (const anchor of anchors) {
    const name = anchor.nickName || "Bình luận viên";
    collector.add(`${name} · HLS`, anchor.playStreamAddress2);
    if (Array.isArray(anchor.servers)) {
      anchor.servers.forEach((url, index) => collector.add(
        `${name} · Dự phòng${index ? ` ${index + 1}` : ""}`,
        url,
      ));
    }
    collector.add(`${name} · FLV`, anchor.playStreamAddress);
  }
  return collector.result();
}

async function fetchChuoiPayload() {
  const referers = ["https://live03.chuoichientv.me/", "https://live.chuoichien.tv/"];
  for (const referer of referers) {
    try {
      const payload = await fetchJson(CHUOI_API, {
        headers: {
          "user-agent": SPORT_USER_AGENT,
          accept: "application/json, text/plain, */*",
          referer,
          origin: new URL(referer).origin,
        },
      });
      if (Array.isArray(payload?.matches)) return { matches: payload.matches, referer };
    } catch (_) {
      // Thử domain trang chủ còn lại.
    }
  }
  return { matches: [], referer: referers[0] };
}

function chuoiBlvs(match, providerId) {
  if (providerId === "bonglau") return Array.isArray(match.blvs_bonglau) ? match.blvs_bonglau : [];
  return Array.isArray(match.blvs) ? match.blvs : [];
}

async function fetchChuoiRows(providerId) {
  const provider = providerById(providerId);
  const payload = await fetchChuoiPayload();
  return payload.matches
    .filter((match) => chuoiBlvs(match, providerId).some((blv) => Array.isArray(blv.streams) && blv.streams.length))
    .map((match) => {
      const home = match.teams?.home || {};
      const away = match.teams?.away || {};
      const blvs = chuoiBlvs(match, providerId);
      return {
        key: String(match._id || match.externalId),
        provider: provider.id,
        provider_name: provider.name,
        name: `${home.name || "Đội nhà"} - ${away.name || "Đội khách"}`,
        home_name: home.name || "Đội nhà",
        away_name: away.name || "Đội khách",
        home_logo: home.logo || "",
        away_logo: away.logo || "",
        kickoff: Date.parse(match.matchTime || "") || Date.now(),
        live: !["ns", "scheduled"].includes(String(match.status || "").toLowerCase()),
        commentator: `${match.league?.name || "Bóng đá"} · ${blvs.length} BLV`,
        _raw: match,
        _referer: payload.referer,
      };
    });
}

function chuoiSources(match, providerId, referer) {
  const provider = providerById(providerId);
  const collector = sourceCollector(provider.name, {
    Referer: referer,
    Origin: new URL(referer).origin,
    "User-Agent": SPORT_USER_AGENT,
  });
  for (const blv of chuoiBlvs(match, providerId)) {
    const name = blv.name || blv.username || "Bình luận viên";
    for (const stream of Array.isArray(blv.streams) ? blv.streams : []) {
      collector.add(`${name} · ${stream.label || "HD"}`, stream.url);
    }
  }
  return collector.result();
}

async function fetchGioVangRows() {
  const provider = providerById("giovang");
  const suffix = `?t=${Date.now()}`;
  const settled = await Promise.allSettled([
    fetchJson(`${GIOVANG_BASE}/storage/livestream/live.json${suffix}`),
    fetchJson(`${GIOVANG_BASE}/storage/livestream/all.json${suffix}`),
  ]);
  const all = settled.flatMap((item) => item.status === "fulfilled" && Array.isArray(item.value?.response)
    ? item.value.response
    : []);
  const seen = new Set();
  const rows = [];
  for (const match of all) {
    const id = String(match.id || match.fi || "");
    if (!id || seen.has(id) || /kết thúc/i.test(String(match.status || ""))) continue;
    seen.add(id);
    const home = match.teams?.home || {};
    const away = match.teams?.away || {};
    rows.push({
      key: id,
      provider: provider.id,
      provider_name: provider.name,
      name: `${home.name || "Đội nhà"} - ${away.name || "Đội khách"}`,
      home_name: home.name || "Đội nhà",
      away_name: away.name || "Đội khách",
      home_logo: home.logo || "",
      away_logo: away.logo || "",
      kickoff: matchTimeMs(match),
      live: match.is_live === true || /đang|live/i.test(String(match.status || "")),
      commentator: `${match.league?.title || "Bóng đá"}${Array.isArray(match.blv) && match.blv.length ? ` · ${match.blv.length} BLV` : ""}`,
    });
  }
  return rows;
}

async function resolveGioVang(key) {
  const payload = await fetchJson(`${GIOVANG_BASE}/api/fixtures/${encodeURIComponent(key)}?t=${Date.now()}`);
  const collector = sourceCollector("Giờ Vàng", {
    Referer: `${GIOVANG_BASE}/`,
    "User-Agent": SPORT_USER_AGENT,
  });
  for (const blv of Array.isArray(payload?.response?.blv) ? payload.response.blv : []) {
    const name = blv.blv_name || blv.blv_key || "Bình luận viên";
    collector.add(`${name} · Máy tính`, blv.pc_stream_url);
    collector.add(`${name} · Điện thoại`, blv.mobile_stream_url);
    collector.add(`${name} · HD`, blv.link_stream_hd);
    collector.add(`${name} · SD`, blv.link_stream_sd);
  }
  return collector.result();
}

async function fetchSoCoRows() {
  const provider = providerById("socolive");
  const payload = jsonpObject(await fetchText(`${SOCOLIVE_RECOMMEND}?v=${Date.now()}`));
  const matches = Array.isArray(payload?.data?.matches) ? payload.data.matches : [];
  return matches
    .filter((match) => match.categoryName === "Bóng đá" && Array.isArray(match.anchors) && match.anchors.length)
    .map((match) => ({
      key: String(match.scheduleId || match.matchId),
      provider: provider.id,
      provider_name: provider.name,
      name: `${match.hostName || "Đội nhà"} - ${match.guestName || "Đội khách"}`,
      home_name: match.hostName || "Đội nhà",
      away_name: match.guestName || "Đội khách",
      home_logo: match.hostIcon || "",
      away_logo: match.guestIcon || "",
      kickoff: Number(match.matchTime || Date.now()),
      live: Number(match.status) === 1,
      commentator: `${match.subCateName || "Bóng đá"} · ${match.anchors.length} BLV`,
      _raw: match,
    }));
}

async function resolveSoCo(key) {
  const rows = await fetchSoCoRows();
  const match = rows.find((row) => row.key === key)?._raw;
  if (!match) return [];
  const details = await Promise.allSettled(match.anchors.map(async (anchor) => {
    const room = anchor?.anchor?.roomNum;
    if (!room) return null;
    const payload = jsonpObject(await fetchText(`https://json.vnres.co/room/${encodeURIComponent(room)}/detail.json?v=${Date.now()}`));
    return { name: anchor.nickName || "Bình luận viên", stream: payload?.data?.stream };
  }));
  const collector = sourceCollector("SoCoLive", { "User-Agent": SPORT_USER_AGENT });
  for (const item of details) {
    if (item.status !== "fulfilled" || !item.value?.stream) continue;
    const { name, stream } = item.value;
    collector.add(`${name} · HLS HD`, stream.hdM3u8);
    collector.add(`${name} · HLS`, stream.m3u8);
    collector.add(`${name} · FLV HD`, stream.hdFlv);
    collector.add(`${name} · FLV`, stream.flv);
  }
  return collector.result();
}

async function gaVangApiBase() {
  const text = await fetchText(`${GAVANG_REMOTE_CONFIG}?t=${Math.floor(Date.now() / 300000)}`, {
    headers: { "user-agent": SPORT_USER_AGENT },
  }, 300);
  const api = text.split("|").map((part) => part.trim()).find((part) => /api\./i.test(part));
  if (!api || !/^https:\/\//i.test(api)) throw new Error("gavang_api_missing");
  return api.replace(/\/$/, "");
}

async function fetchGaVangRows() {
  const provider = providerById("gavang33");
  const api = await gaVangApiBase();
  const body = JSON.stringify({
    limit: 18,
    page: 1,
    order_asc: "start_date",
    queries: [
      { field: "is_top", type: "equal", value: true },
      { field: "blv", type: "not_equal", value: null },
      { field: "desc", type: "equal", value: "FOOTBALL" },
    ],
  });
  const payload = await fetchJson(`${api}/matches/graph`, {
    method: "POST",
    headers: { "user-agent": SPORT_USER_AGENT, "content-type": "application/json", accept: "application/json" },
    body,
  });
  return (Array.isArray(payload?.data) ? payload.data : []).map((match) => ({
    key: String(match.id || ""),
    provider: provider.id,
    provider_name: provider.name,
    name: `${match.team_1 || match.title || "Đội nhà"} - ${match.team_2 || "Đội khách"}`,
    home_name: match.team_1 || match.title || "Đội nhà",
    away_name: match.team_2 || "Đội khách",
    home_logo: match.team_1_logo || "",
    away_logo: match.team_2_logo || "",
    kickoff: Date.parse(match.start_date || "") || Date.now(),
    live: match.is_live === true,
    commentator: `${match.league || "Bóng đá"}${match.blv ? ` · ${match.blv}` : ""}`,
  })).filter((row) => row.key);
}

async function resolveGaVang(key) {
  const api = await gaVangApiBase();
  const payload = await fetchJson(`${api}/match/${encodeURIComponent(key)}/live`, {
    headers: { "user-agent": SPORT_USER_AGENT, accept: "application/json" },
  });
  const collector = sourceCollector("Gà Vàng 33", { "User-Agent": SPORT_USER_AGENT });
  collector.add("HD 1", payload?.hd_1);
  collector.add("HD 2", payload?.hd_2);
  collector.add("HD 3", payload?.hd_3);
  collector.add("SD 1", payload?.sd_1);
  collector.add("SD 2", payload?.sd_2);
  collector.add("SD 3", payload?.sd_3);
  collector.add("Nguồn chính", payload?.source);
  return collector.result();
}

async function fetchM3uRows() {
  const items = await sportStreamItems();
  const providerNames = Object.fromEntries(SPORT_STREAM_PROVIDERS.map((provider) => [provider.id, provider.name]));
  return items.map((item, index) => {
    const provider = providerFor(item);
    return {
      key: `m3u-${index}`,
      provider,
      provider_name: providerNames[provider] || provider,
      name: item.name,
      home_name: item.name,
      away_name: "",
      home_logo: item.logo,
      away_logo: "",
      kickoff: Date.now() + index,
      live: true,
      commentator: item.group,
      _raw: item,
    };
  });
}

function sortRows(rows) {
  return rows.sort((left, right) => {
    if (left.live !== right.live) return left.live ? -1 : 1;
    return Number(left.kickoff || 0) - Number(right.kickoff || 0);
  });
}

async function providerCatalogs() {
  const jobs = [
    fetchChuoiRows("chuoichien"),
    fetchChuoiRows("bonglau"),
    fetchGvRows("colatv"),
    fetchGaVangRows(),
    fetchGioVangRows(),
    fetchSoCoRows(),
    fetchGvRows("xoilacxth"),
    fetchM3uRows(),
  ];
  const settled = await Promise.allSettled(jobs);
  return settled.flatMap((item) => item.status === "fulfilled" ? item.value : []);
}

async function sportStreamCatalog(origin) {
  const allRows = await providerCatalogs();
  const grouped = new Map();
  for (const row of allRows) {
    if (!row.provider || !row.key) continue;
    if (!grouped.has(row.provider)) grouped.set(row.provider, []);
    const rows = grouped.get(row.provider);
    const duplicate = rows.some((old) => old.name === row.name && Math.abs(Number(old.kickoff) - Number(row.kickoff)) < 60000);
    if (!duplicate) rows.push(row);
  }

  const activeProviders = SPORT_STREAM_PROVIDERS.filter((provider) => grouped.get(provider.id)?.length);
  const matches = [];
  for (const provider of activeProviders) {
    for (const row of sortRows(grouped.get(provider.id)).slice(0, SPORT_STREAM_VISIBLE_MATCH_LIMIT)) {
      matches.push({
        id: `${provider.id}-${row.key}`,
        provider: row.provider,
        provider_name: row.provider_name,
        name: row.name,
        home_name: row.home_name,
        away_name: row.away_name,
        home_logo: row.home_logo,
        away_logo: row.away_logo,
        kickoff: row.kickoff,
        live: row.live,
        commentator: row.commentator,
        resolver: `${origin}/v1/sport-stream/resolve?match=${encodeURIComponent(row.key)}&provider=${encodeURIComponent(row.provider)}`,
      });
    }
  }
  return {
    ok: true,
    generated_at: new Date().toISOString(),
    source: "Bình Pro · GETOUT real providers",
    providers: activeProviders,
    matches,
    count: matches.length,
    active_provider_count: activeProviders.length,
    config_url: `${origin}/v1/sport-stream/config`,
  };
}

async function resolveM3u(key) {
  const match = /^m3u-(\d+)$/.exec(key || "");
  if (!match) return [];
  const items = await sportStreamItems();
  const index = Number(match[1]);
  return Number.isInteger(index) && items[index] ? [playbackSource(items[index])] : [];
}

async function sportStreamResolve(id, matchKey, providerId) {
  if (!matchKey && id) {
    const fallback = /^binhpro-(\d+)$/.exec(id);
    if (fallback) return { ok: true, sources: await resolveM3u(`m3u-${Number(fallback[1]) - 1}`) };
  }
  if (!matchKey || !providerId) return null;

  let sources = [];
  if (matchKey.startsWith("m3u-")) {
    sources = await resolveM3u(matchKey);
  } else if (providerId === "chuoichien" || providerId === "bonglau") {
    const rows = await fetchChuoiRows(providerId);
    const row = rows.find((item) => item.key === matchKey);
    if (row) sources = chuoiSources(row._raw, providerId, row._referer);
  } else if (providerId === "colatv" || providerId === "xoilacxth") {
    const rows = await fetchGvRows(providerId);
    const row = rows.find((item) => item.key === matchKey);
    if (row) sources = gvSources(row._raw, row.provider_name, row._referer);
  } else if (providerId === "gavang33") {
    sources = await resolveGaVang(matchKey);
  } else if (providerId === "giovang") {
    sources = await resolveGioVang(matchKey);
  } else if (providerId === "socolive") {
    sources = await resolveSoCo(matchKey);
  }

  return sources.length ? { ok: true, sources } : null;
}

export default {
  async fetch(request) {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return json({ ok: false, error: "method_not_allowed" }, 405);
    }

    const url = new URL(request.url);
    if (url.pathname === "/" || url.pathname === "/health") {
      return json({
        ok: true,
        service: "Bình Pro SportsTV Sources",
        version: 5,
        source_count: Object.values(SOURCES).filter((item) => item.enabled).length,
      });
    }

    if (url.pathname === "/v1/config") {
      const origin = url.origin;
      return json({
        ok: true,
        version: 1,
        playlists: Object.entries(SOURCES)
          .filter(([, item]) => item.enabled)
          .map(([id, item], order) => ({
            id,
            name: item.name,
            enabled: true,
            order,
            url: `${origin}/v1/playlist/${encodeURIComponent(id)}`,
          })),
      });
    }

    if (url.pathname === "/v1/sport-stream/config") {
      return json({
        ok: true,
        version: 2,
        providers: SPORT_STREAM_PROVIDERS,
      });
    }

    if (url.pathname === "/v1/sport-stream/catalog") {
      try {
        return json(await sportStreamCatalog(url.origin));
      } catch (error) {
        return json({ ok: false, error: "catalog_build_failed" }, 502);
      }
    }

    if (url.pathname === "/v1/sport-stream/resolve") {
      try {
        const result = await sportStreamResolve(
          url.searchParams.get("id"),
          url.searchParams.get("match"),
          url.searchParams.get("provider"),
        );
        return result
          ? json(result)
          : json({ ok: false, error: "stream_not_found" }, 404);
      } catch (error) {
        return json({ ok: false, error: "stream_resolve_failed" }, 502);
      }
    }

    const match = url.pathname.match(/^\/v1\/playlist\/([a-z0-9-]+)$/i);
    if (!match) return json({ ok: false, error: "not_found" }, 404);

    const id = match[1].toLowerCase();
    const source = SOURCES[id];
    if (!source || !source.enabled) {
      return json({ ok: false, error: "source_disabled" }, 404);
    }

    try {
      const upstream = await fetch(source.upstream, {
        redirect: "follow",
        headers: {
          "user-agent": "okhttp/5.0.0-alpha.11",
          accept: "application/vnd.apple.mpegurl, application/x-mpegURL, text/plain, */*",
        },
        cf: { cacheEverything: true, cacheTtl: 120 },
      });

      if (!upstream.ok) {
        return json({ ok: false, error: "upstream_error", status: upstream.status }, 502);
      }

      const headers = new Headers();
      headers.set("content-type", "application/vnd.apple.mpegurl; charset=utf-8");
      headers.set("cache-control", "public, max-age=120");
      headers.set("access-control-allow-origin", "*");
      headers.set("x-content-type-options", "nosniff");
      headers.set("x-binhpro-source", id);
      return new Response(request.method === "HEAD" ? null : upstream.body, {
        status: 200,
        headers,
      });
    } catch (error) {
      return json({ ok: false, error: "fetch_failed" }, 502);
    }
  },
};
