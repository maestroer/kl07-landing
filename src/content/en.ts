import type { Dict } from './ru'

export const en: Dict = {
  code: 'en',
  words: { plan: 'plan', architect: 'architect' },
  meta: {
    homeTitle: 'KL07 — project economics platform',
    investTitle: 'KL07 — investor material',
    homeDesc:
      'Platform for project profitability, invoicing and subscription tracking. For freelancers, solo specialists, teams and agencies.',
    investDesc:
      'Working MVP, modelled unit economics, three deal structures: convertible note, direct equity, revenue share.',
  },

  b2bMeta: {
    title: 'KL07 B2B — the honest cost of your own team',
    desc: 'What your own team really costs, including downtime and context switching. A cost and decision suite for companies without an in-house analyst.',
  },

  nav: {
    product: 'product',
    invest: 'investors',
    b2b: 'b2b',
    back: 'back home',
    tg: 'telegram',
  },

  chrome: {
    home: 'kl07 ~ product',
    invest: 'kl07 ~ investor',
    b2b: 'kl07 ~ b2b',
  },

  home: {
    tagline: 'financial utility for freelancers',
    headline: ['a platform that closes', 'the whole project economics loop'],
    whoami: [
      ['product', 'profitability, invoicing and subscription tracking'],
      ['for whom', 'freelancers, solo specialists, teams and agencies'],
      ['segments', 'b2b · b2c'],
    ],
    findme: 'contact',
    copyMail: { hint: 'click to copy the address', copied: 'copied', manual: 'copy it manually' },

    statusPanel: {
      star: ['status', 'mvp ready'],
      rows: [
        ['modules', '7 / 7'],
        ['plans', '3'],
        ['team', '1 person'],
      ],
    },

    donate: {
      window: 'kl07 ~ donate',
      trigger: 'support',
      raisedLabel: 'raised for the project',
      of: 'of',
      button: 'support with crypto',
      heading: 'support the project',
      body: 'kl07 is being built without outside money. if you want to help — here are the project wallets. every amount goes into the deploy and the build.',
      hint: 'click an address to copy it',
      copied: 'copied',
      selected: 'selected — press ctrl+c',
      soon: 'soon',
      close: 'close',
    },

    problem: {
      label: 'problem',
      note: 'why this exists',
      body: [
        'freelancers and small teams calculate project economics by hand — in spreadsheets and notebooks.',
        'real margin per project stays invisible, money leaks through unsent invoices',
        'and forgotten tool subscriptions. and before a project starts, nobody can quickly say',
        'what it costs: which stack, which team, how long, how much.',
      ],
      painsTitle: 'what hurts',
      pains: [
        ['blind margin', 'real project profitability gets calculated after the fact, if at all'],
        ['revenue leak', 'unsent and forgotten invoices, manual tax recalculation per region'],
        ['invisible subscriptions', 'a dozen tools in different currencies with different billing dates, nowhere to see them'],
        ['guesswork estimates', 'a quote is assembled from intuition, not from stack, phases and team composition'],
      ],
    },

    compare: {
      label: 'comparison',
      note: 'nobody put this into one flow',
      cols: ['KL07', 'Bonsai', 'HoneyBook', 'Harvest'],
      rows: [
        ['time tracking', 1, 1, 0, 1],
        ['invoices', 1, 1, 1, 1],
        ['crm and clients', 1, 1, 1, 0],
        ['project unit economics', 1, 0, 0, 0],
        ['tool subscription tracker', 1, 0, 0, 0],
        ['ai architecture and quote', 1, 0, 0, 0],
        ['russian taxes and regions', 1, 0, 0, 0],
      ],
      footnote:
        'based on public product descriptions, august 2026. bonsai, honeybook and harvest each cover separate functions — nobody offers the "idea → architecture → quote" chain with ai.',
    },

    modules: {
      label: 'modules',
      note: '7 of 7 screens wired to the live api',
      items: [
        {
          name: 'dashboard',
          kind: 'kpi and profitability',
          text: 'every project on one screen: margin, net per hour, gross total, workload. you see which project feeds you and which eats you.',
          tags: ['kpi', 'margin', 'net/hour', 'workload'],
        },
        {
          name: 'calculator',
          kind: 'live recalculation · waterfall',
          text: 'seven calculation modes for different jobs. any change to a rate, team composition or tool list recalculates the economics instantly.',
          tags: [
            'project',
            'team: outstaff / instaff',
            'tools per project',
            'service pricing',
            'turnkey development',
            'infrastructure',
            'presets for standard services',
          ],
        },
        {
          name: 'invoices',
          kind: 'builder · pdf',
          text: 'an invoice is assembled from project line items instead of being retyped. taxes and regions included, pdf export.',
          tags: ['builder', 'pdf', 'taxes', 'regions'],
        },
        {
          name: 'projects',
          kind: 'project database',
          text: 'a project from the calculator is saved to the database and then lives across every module — invoices, subtracker and dashboard.',
          tags: ['project card', 'history', 'statuses'],
        },
        {
          name: 'subtracker',
          kind: 'subscriptions and tools',
          text: 'one place that shows how much leaves per month, which subscriptions go unused, when the next charge hits and in which currency.',
          tags: ['multi-currency', 'billing dates', 'unused', 'split per project'],
        },
        {
          name: 'ai architect',
          kind: 'chat + artifact',
          text: 'describe a project in plain words — ai builds the stack, phases, team composition and a finished quote. saved as a project.',
          tags: ['stack', 'phases', 'team', 'quote', '→ save as project'],
        },
        {
          name: 'profile',
          kind: 'account and plans',
          text: 'account hub: 2fa, plan switching, personal stats across projects and hours.',
          tags: ['2fa', 'plans', 'stats'],
        },
      ],
    },

    ai: {
      label: 'ai architect',
      note: 'the flagship feature',
      headline: ['describe any project in one prompt —', 'ai builds its architecture for you'],
      body: [
        'you do not need to be a technical expert and you do not need to know how to price a project.',
        'the ai architect designs it and calculates the economics for you — the only feature on the market',
        'that closes the path from idea to quote fully automatically.',
      ],
      steps: [
        ['prompt', '"i want a telegram bot with payments and ai matching" — in free form'],
        ['architecture', 'ai builds the stack, development phases and the team you need'],
        ['quote and budget', 'a finished cost and timeline estimate — ready to send to the client'],
      ],
      punchA: 'one feature that replaces',
      punchB: 'an architect, an estimator and an analyst',
    },

    pricing: {
      label: 'pricing',
      note: 'annual billing — 17–21% off',
      plans: [
        {
          name: 'free',
          price: '0 ₽',
          per: '',
          priceNote: 'forever',
          alt: '',
          text: 'basic access to the dashboard, the calculator and 1 invoice per month',
          feats: ['dashboard', 'project calculator', '1 invoice / mo'],
          accent: 'white' as const,
        },
        {
          name: 'pro',
          price: '790 ₽',
          per: '/mo',
          priceNote: 'billed annually · −20%',
          alt: '990 ₽/mo billed monthly',
          text: 'unlimited invoices, subtracker, full analytics across projects',
          feats: ['everything in free', 'unlimited invoices', 'subtracker', 'full analytics', 'all calculators'],
          accent: 'violet' as const,
        },
        {
          name: 'business',
          price: '2 290 ₽',
          per: '/mo',
          priceNote: 'billed annually · −21%',
          alt: '2 890 ₽/mo billed monthly',
          text: 'team, unlimited ai architect, priority support',
          feats: ['everything in pro', 'team and roles', 'unlimited ai architect', 'priority support'],
          accent: 'orange' as const,
        },
      ],
    },

    status: {
      label: 'build status',
      note: 'honestly, as of today',
      headlineA: 'the product already works,',
      headlineB: 'it is not a mockup',
      log: [
        ['first commit', '03.08.2026'],
        ['current frontend', 'rewritten from scratch 19–20.08.2026 (liquid glass)'],
        ['backend', 'fastify + drizzle + postgresql, live api'],
        ['frontend', 'react 18 + vite + tailwind'],
        ['design system', 'liquid glass — in-house, one visual language'],
      ],
      stats: [
        ['7 / 7', 'screens wired to the live api'],
        ['18 days', 'from first commit to the current version'],
        ['0 ₽', 'outside money — the mvp was built by the founder alone'],
      ],
      left: 'still to do: production deploy (railway + vercel, runbook ready) and live payment / email / llm integrations.',
    },

    cta: {
      label: 'early access',
      note: 'waitlist',
      headline: 'take the early access',
      body: [
        'the product ships to production with the next release. leave your email — you get access in the first wave',
        'and we lock the launch price of pro for your first year.',
      ],
      emailLabel: 'your email',
      emailPlaceholder: 'you@mail.com',
      segmentLabel: 'you are',
      segments: ['freelancer', 'team', 'agency', 'investor'],
      submit: 'join',
      sending: 'sending…',
      ok: 'done — you are on the list. we will write as soon as access opens.',
      err: 'did not go through. message us directly on telegram — that always lands.',
      invalid: 'check the email',
      or: 'or right away',
      tg: 'message on telegram',
    },

    investBanner: {
      label: 'for investors',
      text: 'unit economics, development status and three deal structures',
      link: 'open the material',
    },
  },

  invest: {
    tagline: 'investor material · august 2026',
    headlineA: 'a working product',
    headlineB: 'and economics that add up',
    lead: [
      'kl07 is a profitability, invoicing and subscription-tracking platform for the russian market.',
      'the mvp was built by the founder alone, with no outside money: a real backend and database,',
      'all 7 frontend modules wired to the live api.',
    ],
    docs: { label: 'documents', onepager: 'one-pager (pdf)', deck: 'deck (pdf)' },

    profile: {
      label: 'profile',
      note: 'the project today',
      cells: [
        ['team', '1 person', 'solo founder, full-stack'],
        ['product modules', '7 of 7', 'screens wired to the api'],
        ['plans', '3', 'free / pro / business'],
        ['year 1 round', '3.2–5.1 m ₽', 'mvp + growth capex'],
        ['ltv', '36 600 ₽', 'at churn ~4%/mo'],
        ['target cac', '≤ 12 200 ₽', 'ltv:cac 3:1'],
      ],
    },

    market: {
      label: 'market',
      note: 'and entry price',
      head: ['metric', 'value'],
      rows: [
        ['target user', 'freelancer, 1–3 years of experience, 250k — 1.2m ₽/mo income'],
        ['arpu at recommended prices (990 ₽ / 2 890 ₽)', '1 465 ₽/mo'],
        ['ltv (at churn ~4%/mo)', '≈ 36 600 ₽'],
        ['target cac (ltv:cac 3:1)', '≤ 12 200 ₽'],
        ['operating break-even', 'mo. 9–10, ≈ 150 paying'],
        ['full payback of year 1 capex (5.1 m ₽)', 'mo. 20–22'],
      ],
    },

    forecast: {
      label: 'unit economics',
      note: 'forecast 2026–2028 · modelled, no historical data',
      usersTitle: 'paying users',
      mrrTitle: 'mrr, thousand ₽/mo',
      marginTitle: 'margin (mrr − opex) / opex, %',
      profitTitle: 'cumulative profit, m ₽',
      punch: ['by month 18 revenue reaches a margin of', '250%', 'at', '500', 'paying users'],
      punch2A: 'operating break-even at',
      punch2B: 'months 9–10',
      punch2C: 'full capex payback in',
      punch2D: 'months 20–22',
      monthShort: 'mo',
    },

    strengths: {
      label: 'strengths',
      note: 'why this is not an idea on a napkin',
      items: [
        ['a working product, not a mockup', 'a real backend and database, all 7 frontend modules wired to the api and running'],
        ['economics that add up', 'several pricing scenarios, ltv:cac 3:1, operating break-even at months 9–10'],
        [
          'nobody put this into one flow',
          'bonsai, honeybook and harvest cover separate functions; nobody offers the "idea → architecture → quote" chain with ai',
        ],
        ['low cash burn', 'the mvp was built by the founder alone, outside money in the project is 0 ₽'],
      ],
    },

    risks: {
      label: 'risks',
      note: 'open questions, no varnish',
      items: [
        'the product is not deployed anywhere — zero live users and zero conversion metrics',
        'solo founder: some secondary features and file storage (avatars / pdf) are in the backlog',
        'the funnel forecast in unit economics is modelled, with no historical data',
        'payments, email and llm currently run on stub drivers and need live integration',
      ],
    },

    terms: {
      label: 'deal structures',
      note: 'three options',
      items: [
        {
          key: 'option A',
          badge: 'preferred',
          accent: 'violet' as const,
          name: 'convertible note',
          amount: '1–3 m ₽',
          text: '1–3 m ₽ now, with no valuation argument at the start. 25% discount to the next round, valuation cap 50 m ₽.',
          text2:
            'conversion into equity happens at the next round — once real metrics exist. the investor does not pay for belief but enters at a price confirmed by traction; the founder does not give away equity at an undervalued price before launch.',
          facts: [
            ['discount', '25%'],
            ['cap', '50 m ₽'],
            ['conversion', 'next round'],
          ],
        },
        {
          key: 'option B',
          badge: 'equity',
          accent: 'white' as const,
          name: 'direct equity',
          amount: '1 000 000 ₽',
          text: '1 000 000 ₽ = 7–10% of the company (valuation 10–14 m ₽ pre-money) — a fair entry price before traction. executed via a notary, the stake is recorded in the state register.',
          text2: 'a transparent option for an investor who wants to lock the position now instead of waiting for the next round.',
          facts: [
            ['stake', '7–10%'],
            ['pre-money', '10–14 m ₽'],
            ['execution', 'notary · state register'],
          ],
        },
        {
          key: 'option C',
          badge: 'no dilution',
          accent: 'orange' as const,
          name: 'revenue share',
          amount: '≈ 3–7.3 m ₽',
          text: 'monthly financing of operations and development: 490 000 ₽/mo (lean) or 810 000 ₽/mo (with a contractor on the backlog), over 6–9 months.',
          text2:
            'a 2.5–3x return on the invested amount through revenue share with payment priority: the first revenue goes to the investor, not into growth. no capital dilution, no equity transferred.',
          facts: [
            ['return', '2.5–3x'],
            ['term', '6–9 months'],
            ['equity', 'not transferred'],
          ],
        },
      ],
      allTitle: 'in every option',
      all: [
        ['kpi-gated tranches', 'tranche 1 — deploy and the first 50 paying users; tranche 2 — marketing once conversion is confirmed'],
        ['transparent reporting', 'a monthly report on funnel metrics, mrr and spend'],
        ['pro-rata at the next round', 'the right to keep your stake in the next raise'],
      ],
    },

    contact: {
      label: 'contact',
      note: 'what is needed from an investor now',
      headline: 'feedback on one of the options — or a counter-offer',
      body: 'from there we fix the term sheet and move to legal execution. i reply on telegram within a day.',
      tg: 'message on telegram',
      mail: 'send an email',
      mailSubject: 'KL07 — discussing terms',
    },

    disclaimer:
      'all amounts are in rubles. the figures are an illustrative estimate based on the internal unit economics of the project and do not constitute legal or financial advice; consulting a lawyer is recommended before signing any terms (in particular regarding the equity structure).',
  },

  b2b: {
    tagline: 'kl07 b2b · cost & decision suite',
    headlineA: 'let us count what your own team',
    headlineB: 'really costs you',
    lead: [
      'a business rarely has an analyst at hand every time it needs to know what a feature, project or rollout will cost.',
      'kl07 b2b is a set of lenses on top of one calculation engine: the honest cost of "build it / skip it / who builds it"',
      'without a separate research round.',
    ],
    status: 'onboarding the first companies into a pilot',
    ctaPilot: 'join the pilot on telegram',
    forWho: {
      label: 'for whom',
      note: 'companies without an in-house analyst',
      items: [
        ['product managers and team leads', 'deciding whether to take a feature and who builds it — now, not after a week of research'],
        ['founders', 'comparing their own team, outstaff and an off-the-shelf solution in money, not gut feeling'],
        ['overloaded analysts', 'offloading routine estimates so analysts keep the work that needs judgement'],
      ],
    },
    calc: {
      label: 'calculator',
      note: '',
      title: 'own team vs outstaff — including downtime',
      intro:
        'a regular calculator prices your team as hours × rate. it does not see that the developer is already busy on another project: that project stalls, and context switching eats part of the time on both tasks.',
      hours: 'hours needed for the task',
      cost: 'full hourly cost of your developer, ₽',
      costHint: 'with taxes and overhead, not bare salary',
      outstaff: 'outstaff rate, ₽/hour',
      allocation: 'currently busy on another project',
      criticality: 'criticality of the project that stalls',
      crit: ['low', 'medium', 'high'],
      penalty: 'context-switch tax',
      own: 'own team',
      out: 'outstaff',
      hidden: 'of which hidden cost of downtime and switching',
      verdictOwn: 'own team is cheaper by',
      verdictOut: 'outstaff is cheaper by',
      rows: {
        naive: 'naive cost (hours × rate)',
        switch: 'context-switch tax',
        delay: 'downtime cost of the other project',
        total: 'honest cost',
      },
      naiveNote: 'this is what a regular calculator shows',
      assumptions:
        'assumptions are visible and adjustable: the context-switch tax is a well-known effect, not a measured fact, default 20–30%. without data on project value, a day of downtime is a team day × criticality factor (×1 / ×2 / ×4). this is a demo model, not a calculation for your company.',
    },
    how: {
      label: 'how we count',
      note: 'four steps, no magic',
      steps: [
        ['base cost', 'required hours × full hourly cost for everyone needed on the task'],
        ['context-switch tax', 'with partial allocation you need more effective hours: hours / (1 − penalty)'],
        ['downtime cost', 'days of delay for the project the time is taken from × that project cost per day'],
        ['honest comparison', 'the total next to outstaff: "own team X ₽, of which Y ₽ is hidden downtime cost"'],
      ],
    },
    engine: {
      label: 'tools',
      note: 'all on one estimation engine · live',
      groups: [
        {
          title: 'cost and team',
          items: [
            ['cost with your current team', 'including downtime of other projects and the context-switch tax — the flagship feature nobody else has'],
            ['team and allocation', 'team card: who works on which project and at what share — the foundation of an honest calculation'],
            ['feature-level calculator', 'estimate a single feature to prioritise the backlog; features roll up into a project quote'],
            ['team: outstaff / instaff', 'your own team compared with external contractors'],
            ['rollout: build / buy / adapt', 'build it, buy it or adapt it — in money'],
            ['project and profitability', 'project calculator and dashboard: kpi, margin, net/hour, workload'],
            ['tools per team', 'subscriptions and services aggregated across the whole team, not a single account'],
            ['gpu cluster cost', 'cost of your own ai infrastructure on cloud instances'],
          ],
        },
        {
          title: 'decisions and discovery',
          items: [
            ['llm orchestrator', 'describe the task in words — the model picks the calculation and calls the engine; numbers always come from the calculation, not a model guess'],
            ['ai idea analyser', 'breaks down a product or feature idea before development starts'],
            ['necessity validator', 'helps decide whether a feature is needed at all before budget goes into it'],
            ['discovery manager', 'structures discovery: checklists, interview templates, hypothesis tracking'],
            ['cross-team impact estimator', 'shows how one team task affects the workload and deadlines of other teams'],
          ],
        },
      ],
    },
    pilot: {
      label: 'pilot',
      note: 'for the first companies',
      headline: 'want to count your team on real data?',
      body: 'we are taking a few companies into a pilot: we set up your team and allocation, calculate a couple of real decisions and check the estimate against the outcome. write to us — we reply within a day.',
      tg: 'message on telegram',
    },
  },

  footer: {
    rights: '© 2026 KL07',
    built: 'built by the founder · no outside money',
  },
}
