// ══════════════════════════════════════════════════════════════════════════
//  GITHUB — живые данные без токена
//
//  Неавторизованный API даёт 60 запросов в час на IP, поэтому ответы
//  кладутся в localStorage на полчаса. Если сети нет или лимит выбран —
//  блок активности честно пишет об этом, а не рисует выдуманные цифры.
// ══════════════════════════════════════════════════════════════════════════

const TTL = 30 * 60 * 1000;
const API = 'https://api.github.com';

async function cached(key, url) {
	const ck = 'arc.gh.' + key;
	try {
		const hit = JSON.parse(localStorage.getItem(ck) || 'null');
		if (hit && Date.now() - hit.at < TTL) return hit.data;
	} catch { /* ignore */ }

	const res = await fetch(url, { headers: { Accept: 'application/vnd.github+json' } });
	if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
	const data = await res.json();

	try { localStorage.setItem(ck, JSON.stringify({ at: Date.now(), data })); } catch { /* ignore */ }
	return data;
}

export async function fetchGitHub(user) {
	const [profile, repos, events] = await Promise.all([
		cached(`u.${user}`, `${API}/users/${user}`),
		cached(`r.${user}`, `${API}/users/${user}/repos?per_page=100&sort=pushed`),
		cached(`e.${user}`, `${API}/users/${user}/events/public?per_page=100`),
	]);

	const counts = new Map();
	for (const ev of events) {
		const d = new Date(ev.created_at);
		const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
		counts.set(key, (counts.get(key) ?? 0) + 1);
	}

	const langs = new Map();
	for (const r of repos) {
		if (!r.language || r.fork) continue;
		langs.set(r.language, (langs.get(r.language) ?? 0) + 1);
	}

	return {
		ok: true,
		user: profile.login,
		publicRepos: profile.public_repos ?? repos.length,
		followers: profile.followers ?? 0,
		since: profile.created_at ? new Date(profile.created_at) : null,
		events: events.length,
		counts,
		languages: [...langs.entries()].sort((a, b) => b[1] - a[1]),
		repos: repos
			.filter((r) => !r.fork)
			.slice(0, 6)
			.map((r) => ({
				name: r.name,
				url: r.html_url,
				desc: r.description,
				lang: r.language,
				stars: r.stargazers_count,
				pushed: r.pushed_at,
			})),
	};
}
