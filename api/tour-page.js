const {readFile} = require('node:fs/promises');
const path = require('node:path');
function range(a,b,month='long',year=true) {
  const options = {day:'numeric', month, ...(year ? {year:'numeric'} : {}), timeZone:'UTC'};
  const formatter = new Intl.DateTimeFormat('en-AU',options);
  const d = x => new Date(x+'T12:00:00Z');
  if (a===b) return formatter.format(d(a));
  if (a.slice(0,7)===b.slice(0,7)) return Number(a.slice(8))+'–'+formatter.format(d(b));
  return formatter.format(d(a))+' – '+formatter.format(d(b));
}
const pages = new Set(['index','consultation','aftercare','policies','pre-appointment']);
module.exports = async function handler(req,res) {
  const page=req.query.page || 'index';
  if (!pages.has(page)) return res.status(404).end();
  try {
    const [html,response]=await Promise.all([readFile(path.join(process.cwd(),page+'.html'),'utf8'), fetch('https://hxunrhnljvfvcjpmdpnb.supabase.co/functions/v1/lemonade-tours?published=melbourne',{signal:AbortSignal.timeout(8000)})]);
    if (!response.ok) throw Error('schedule unavailable');
    const {current:c,cohorts}=await response.json();
    const first=range(c.first_start,c.first_end), last=range(c.return_start,c.return_end);
    const month=x=>new Intl.DateTimeFormat('en-AU',{month:'long',timeZone:'UTC'}).format(new Date(x+'T12:00:00Z'));
    const days=(Date.parse(c.first_end)-Date.parse(c.first_start))/86400000+1;
    const entries=[
      ["If your first appointment was in November 2026, your perfecting session is <strong>17–19 December 2026</strong>.<br>If your first appointment is in December 2026, your perfecting session is <strong>4–6 February 2027</strong>.",cohorts.map(row=>'First appointment <strong>'+range(row.first_start,row.first_end)+'</strong> · Included perfecting session <strong>'+range(row.return_start,row.return_end)+'</strong>.').join('<br>')],
      ['17–19<span>December 2026</span>',first],
      ['Thursday 17, Friday 18 or Saturday 19 December',first],
      ['17 to 19 December 2026',first],
      ['17–19 December 2026',first],['17–19 December',range(c.first_start,c.first_end,'long',false)],['17–19 Dec',range(c.first_start,c.first_end,'short',false)],
      ['4–6 February 2027',last],['2 December 2026',range(c.deadline,c.deadline)],
      ['2026-12-17',c.first_start],['2026-12-19',c.first_end],['2027-02-04',c.return_start],['2027-02-06',c.return_end],
      ['melbourne-december-2026','melbourne-first-'+c.first_start],['melbourne-february-2027','melbourne-perfecting-'+c.return_start],
      ['December',month(c.first_start)],['February',month(c.return_start)],['three days',days+' '+(days===1?'day':'days')]
    ];
    const values=new Map(entries);
    const escapeRegex=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    let output=html.replace(new RegExp(entries.map(([s])=>escapeRegex(s)).join('|'),'g'),s=>values.get(s));
    if(c.capacity) output=output.replace(/(<div class="announce">[\s\S]*?)(<\/div>)/,(_,bar,end)=>bar+'<span> · '+Number(c.capacity)+' new-client appointments</span>'+end);
    output=output.replace('</head>','<meta name="tour-revision" content="'+Number(c.revision)+'"></head>');
    res.setHeader('Cache-Control','public, max-age=0, must-revalidate');
    res.setHeader('Vercel-CDN-Cache-Control','public, s-maxage=15, stale-if-error=86400');
    res.setHeader('Content-Type','text/html; charset=utf-8');
    return res.status(200).send(output);
  } catch {res.setHeader('Retry-After','15'); return res.status(503).send('Tour details are temporarily unavailable. Please try again shortly.');}
};