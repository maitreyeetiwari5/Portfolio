/* Project data. Edit this file to add or change a project; main.js renders the cards and the detail view.

   Every project uses the same detail layout. Each field is optional, so a project only shows what you fill in:
     title, line (one sentence on the card), stack, cats, status,
     github (repo URL), links: [['Button label', 'https://...'], ...] for live dashboards,
     glance: [[value, label], ...]          up to 3 headline numbers
     sections: [{ h: 'Heading', p: 'text' } | { h, list: [...] } | { h, steps: [...] } | { h, demo: 'checker' }]
   cats: auto | controls | risk | strategy (a project can have more than one). */
var GH = 'https://github.com/maitreyeetiwari5';

window.PROJECTS = [
  {
    title: 'AI-Assisted Financial Narrative Generator',
    line: 'Drafts variance commentary with AI, then rejects anything the data cannot support.',
    stack: 'Python · Claude (Anthropic)',
    cats: ['auto'],
    status: 'In progress',
    glance: [['759 of 759', 'deliberately bad drafts rejected'], ['310 of 310', 'good drafts accepted'], ['3', 'attempts, then a safe fallback']],
    sections: [
      { h: 'The problem', p: 'Each month, finance teams compare budget with actual results, and every large variance needs a written explanation. AI writes these well, but it has a dangerous habit: it explains things it cannot know. A sentence like "costs rose due to supplier price increases" sounds credible, yet nobody told the model that. In month-end reporting, a confident wrong explanation is worse than no explanation.' },
      { h: 'What I built', p: 'An AI writing layer on top of my variance forecasting tool, which flags the unusual variances (69 of 540 rows in my synthetic data). For each flagged row, the system:' },
      { steps: [
        'Builds a "facts packet" with the only information the AI may use: budget, actual, forecast, the variances, and a logged reason if one exists.',
        'Asks Claude to draft one or two sentences.',
        'Checks the draft in code before accepting it.',
        'If the check fails, sends the exact reasons back and retries, up to three attempts.',
        'If every attempt fails, falls back to the plain rule-based commentary, so something safe always comes out.'
      ] },
      { p: 'Rows with no logged reason always end with "Driver: pending analyst review." The code adds that label, not the AI.' },
      { h: 'Try the checker', demo: 'checker' },
      { h: 'How the checks work', p: 'The rules are enforced in code rather than left to prompt instructions, because a model can ignore instructions. A draft is rejected if it:' },
      { list: [
        'states a number that isn\'t in the facts',
        'gives a cause when none is logged, or goes beyond the one logged',
        'speculates ("likely", "may") or gives advice or forecasts',
        'gets the direction wrong, such as saying "over budget" when spending was under',
        'names the wrong business unit, or borrows another row\'s reason',
        'attaches a number to the wrong label, such as calling the budget "the actual"',
        'contains a sentence with no figure behind it',
        'isn\'t a single short paragraph'
      ] },
      { p: 'Every attempt is saved to an audit log: the row, the draft, pass or fail, and the reasons.' },
      { h: 'Testing', p: 'I wrote 11 kinds of deliberately bad drafts for all 69 rows, 759 in total, and the checker rejected every one. It also accepted all 310 well-behaved drafts, and 20 automated tests pass. My first version missed two kinds of bad draft, including causes worded as "came from". I found them by probing it, fixed them, and added them to the tests.' },
      { h: 'Where it stands', p: 'Built and tested: the checker, retry and fallback logic, audit log, and two run modes (live API, or drafts pasted from a Claude chat). In progress: running real Claude-written drafts through all 69 rows and recording how many pass first time. Next: summaries per business unit.' },
      { h: 'Limits', p: 'All data is synthetic. The checker is rule-based, so it catches the patterns I listed but cannot prove a draft is free of every unsupported claim, and the review label exists for that reason. I wrote both the checker and the bad drafts, so the 759 result shows the rules work as designed, not that they would catch every real-world AI error.' }
    ]
  },
  {
    title: 'Finance Forecast & Variance Automation',
    line: 'Flags the variances that matter and explains only the ones with a known cause.',
    stack: 'Python · Excel · Chart.js',
    cats: ['auto'],
    github: GH + '/Finance-Forecast-Variance-Automation',
    links: [['Live dashboard', 'https://maitreyeetiwari5.github.io/Finance-Forecast-Variance-Automation/']],
    glance: [['34.8% to 12.8%', 'share of rows flagged'], ['6 of 6', 'known anomalies caught'], ['7.0%', 'forecast error (MAPE)']],
    sections: [
      { h: 'Why I built it', p: 'Reviewing budget against actuals across dozens of line items takes hours of scanning, or leans on one flat threshold. A flat threshold over-flags noisy lines like campaign spend and misses real problems in stable ones like salaries. Detecting what changed is a good job for automation. Explaining why it changed is not, and this tool does not pretend otherwise.' },
      { h: 'What it does', list: [
        'Forecasts each line with a trailing three-month average, simple enough for anyone to rebuild by hand.',
        'Learns a threshold for each line from its own history, using the median and a scaled MAD.',
        'Flags a month only when it breaks the threshold against both budget and forecast.',
        'Drafts commentary. It states a driver only when an analyst-kept event log names one, and otherwise marks the row "pending analyst review".'
      ] },
      { h: 'How I checked it', p: 'I generated 18 months of data for 5 business units and 6 line items, 540 rows in all, with 6 scripted anomalies such as a campaign overspend, a fuel cost spike and a hiring freeze. My first calibration found only 4 of the 6. The validation step caught that before it shipped, and the final thresholds find all 6.' },
      { h: 'What came out', p: 'The share of rows flagged fell from 34.8% with fixed thresholds to 12.8%. Of 69 flagged rows, 6 matched a documented driver and were explained, and the rest went to an analyst. Results appear in a live, filterable dashboard and a three-sheet Excel workbook (Summary, Variance Detail, Action Items) with the best-explained, largest rows first.' },
      { h: 'Limits', p: 'All data is synthetic, built so the right answers were known. Commentary is rule-based, not AI-written. I built it with AI assistance and checked every output against the known answers instead of trusting it.' }
    ]
  },
  {
    title: 'Fund Flow Forecasting & Segment Benchmarking',
    line: 'The variance engine applied to real mutual fund flow data.',
    stack: 'Python · Pandas · Tableau',
    cats: ['auto'],
    github: GH + '/Fund-Flow-Forecasting',
    links: [['Tableau dashboard', 'https://public.tableau.com/app/profile/maitreyee.tiwari4070/viz/FundFlowForecastingSegmentBenchmarking/FundFlowForecastingSegmentBenchmarking?publish=yes']],
    glance: [['2 of 27', 'months flagged (7.4%)'], ['$310B', 'July equity outflow, explained'], ['about $390B', 'index fund swing, 2024 to 2025']],
    sections: [
      { h: 'Why I built it', p: 'A team that tracks asset flows forecasts them, flags surprises and explains what drove them, month after month. I wanted to point my variance tool at that kind of problem, using real published numbers instead of another synthetic set.' },
      { h: 'What it does', list: [
        'Forecasts monthly net flows for three fund categories with the same trailing three-month average.',
        'Sets each category\'s threshold in dollars, not percent. Flows cross zero every month, so percentages blow up near zero.',
        'Flags on forecast deviation only, because macro fund flows have no budget.',
        'Writes a driver only when the event log has one on file.'
      ] },
      { h: 'What came out', list: [
        'Two of 27 scoreable months were flagged.',
        'July 2025 equity flows came in $310B below trend. The ICI Fact Book ties the outflow to a handful of collective investment trusts, so that driver was logged and used.',
        'April 2025 bond outflows had nothing on file, so they went to an analyst instead of getting a guessed cause.',
        'A benchmarking layer showed index mutual funds swinging from +$32B in 2024 to -$357B in 2025, about $390B. The wider industry moved differently, which points to a shift within fund wrappers rather than a simple move from passive to active.'
      ] },
      { h: 'The data', p: 'Real figures from the ICI 2026 Investment Company Fact Book. Nothing is synthetic. Firm-level flow data is not free, so benchmarking is at the market-segment level (active versus passive), not against named competitors. With 36 monthly data points across three categories, this shows the method working more than it proves it.' },
      { h: 'Output', p: 'A Tableau Public dashboard with flow against forecast by category, flagged months with drafted commentary, and the active-versus-passive benchmark.' }
    ]
  },
  {
    title: 'SQL Reconciliation & Exception Dashboard',
    line: 'Matches bank, AR and ledger records and ranks what is left by dollar exposure.',
    stack: 'SQL · Python · Excel · HTML/JS',
    cats: ['controls'],
    github: GH + '/SQL-Reconciliation-Exceptions',
    links: [['Live dashboard', 'https://maitreyeetiwari5.github.io/SQL-Reconciliation-Exceptions/']],
    glance: [['94.0%', 'of 4,425 records cleared'], ['128 of 128', 'planted breaks caught'], ['$555K', 'exposure in 130 exceptions']],
    sections: [
      { h: 'Why I built it', p: 'Every customer receipt should show up once in the bank statement, once in the AR subledger and once in the general ledger. In practice, references are formatted differently, postings lag, banks net off fees, and some receipts are missed or posted twice. Working through that by hand does not scale, and a single loose rule either buries analysts in false alarms or quietly absorbs real breaks.' },
      { h: 'How matching works', p: 'Three tiers, strictest first, applied to each pair of systems:' },
      { steps: [
        'Same reference, amount within tolerance: matched.',
        'Same reference, amount outside tolerance: linked and reported as an amount mismatch.',
        'No usable reference: match on amount and date, but only if the counterpart is unique. If several could fit, mark it ambiguous and leave it for a person.'
      ] },
      { p: 'Anything that does not agree across all three systems becomes one of ten exception types, such as missing in GL, duplicate posting or timing gap.' },
      { h: 'Design choices', list: [
        'No guessing. When more than one row could be the match, the engine matches none and says so.',
        'Notes describe what does not tie and never claim a cause.',
        'Tolerances live in a settings table, so the same SQL reruns at any setting.',
        'Control totals fail the whole run if any row is linked twice or any record goes missing.'
      ] },
      { h: 'How I tested it', p: 'I built 1,500 synthetic receipts across the three systems (4,425 records) and planted 128 breaks, with the answer key kept outside the database. All 128 were caught and labelled with the right type. The engine raised 130 exceptions, so precision is 98.5%. The two extras came from one receipt with a blank reference and a round $5,000 amount that the engine refused to guess at.' },
      { h: 'Choosing the tolerances', p: 'I ran 20 settings. With no amount tolerance, every bank fee became a mismatch (224 false alarms). At $5, six small short-pays were absorbed and missed. A 2-day date window flooded the queue with 394 false alarms, and 10 days absorbed two real timing gaps. $1.00 and 7 days missed nothing and raised only the two extras.' },
      { h: 'Limits', list: [
        'The data is synthetic and the breaks are planted, so this shows the logic works on known cases, not that it would find unexpected real ones.',
        'The 7-day setting comes from how I generated posting lag. On real data it should come from the observed spread.',
        'Matching is one-to-one. One deposit covering several invoices would show up as an exception, so one-to-many matching is the next step.'
      ] }
    ]
  },
  {
    title: 'Consumer Credit Risk & Risk-Based Pricing',
    line: 'Finds loans priced below their risk and sets an approval cutoff from expected profit.',
    stack: 'Python · scikit-learn · statsmodels · pandas',
    cats: ['risk'],
    github: GH + '/Consumer-Credit-Risk-Risk-Based-Pricing-Model-',
    glance: [['+45%', 'backtested profit'], ['16.0% to 13.2%', 'approved default rate'], ['20.7%', 'of loans under-priced']],
    sections: [
      { h: 'The question', p: 'Which borrowers are likely to default, and what should that change about who gets approved and what they are charged?' },
      { h: 'What I built', list: [
        'A default model on 9,578 public LendingClub loans (2007 to 2010), tested on a held-out 30%.',
        'Hypothesis tests on what actually drives default.',
        'A break-even interest rate for every loan, from its default risk, loss severity and funding cost.',
        'An approval cutoff chosen by expected profit, then checked against real outcomes.',
        'A monitoring plan that tracks drift with PSI.'
      ] },
      { h: 'What I found', list: [
        'Three models compared. Logistic regression scored an AUC of 0.656 against 0.623 for FICO alone. Gradient boosting scored 0.661, but the confidence interval on the difference includes zero, so I kept the simpler logistic model.',
        'The model is well calibrated: 16.0% predicted against 16.0% actual. The riskiest tenth defaults at 35.1% against 4.9% for the safest, about 7 times as often.',
        'Recent credit inquiries, FICO and payment-to-income are the strongest drivers of default.',
        '71% of loans in the riskiest fifth are priced below break-even. They are charged 14.6% on average and need 17.5%.',
        'Approving the lowest-risk 83.9% of applicants lifts backtested profit from $553K to $803K and cuts the approved default rate from 16.0% to 13.2%.'
      ] },
      { h: 'The assumption that matters most', p: 'Loss severity. At 30% the best cutoff approves 96.8% of applicants. At 70% it approves only 58.1%, and approving everyone loses money.' },
      { h: 'Monitoring', p: 'In a simulated deterioration (lower FICO, higher DTI and utilisation), the score PSI rose to 0.31, above the 0.25 investigate line, and average predicted risk climbed from 16.0% to 20.9%.' },
      { h: 'Limits', list: [
        'It does not beat LendingClub\'s own approval flag. At the same approval rate, the default rates are 13.1% against 13.3% (p = 0.83), which is not a significant difference.',
        'Discrimination is modest (AUC 0.66) on a small cleaned dataset.',
        'There are no dates, so I could not test on a later period.',
        'Loan term, loss severity and funding cost are stated assumptions, and backtested profit is not real lender profit.'
      ] }
    ]
  },
  {
    title: 'Bitcoin Transaction Data Quality & Anomaly Review',
    line: 'Proves a large transaction dataset can be trusted, then looks for what stands out.',
    stack: 'Python · SQL · Excel',
    cats: ['controls', 'risk'],
    github: GH + '/Bitcoin-Transaction-Data-Quality-Anomaly-Review',
    glance: [['13', 'data quality checks, all passed'], ['5.4x', 'lift on unseen later periods'], ['12,636', 'unlabeled flags sent to review']],
    sections: [
      { h: 'Why I built it', p: 'I wanted to build this the way an investigations team would need it: every record reconciled, every data problem logged with the fix applied, every flag tested against known outcomes, and anything unexplained handed to an analyst.' },
      { h: 'Data quality', p: 'Thirteen checks across structure, keys, labels and links on 203,769 transactions and 234,355 links from the public Elliptic dataset. Every problem is logged with the fix applied, and a reconciliation table accounts for each excluded record. Four key checks were recomputed with independent SQL queries, and both methods agreed.' },
      { h: 'Finding anomalies', steps: [
        'Score each transaction against the usual range for its own time period, using median-based scores.',
        'Pick the most useful features using only the first 34 time periods.',
        'Flag a transaction when two of the three chosen features are extreme.',
        'Report results only on periods 35 to 49, which the selection never saw.'
      ] },
      { h: 'What I got wrong first', p: 'My first version flagged the most extreme transactions, and its precision fell below the baseline. Unusually busy transactions here are mostly legitimate services. Letting the earlier data show which features separate illicit activity, then proving it on later data, fixed it.' },
      { h: 'Results', list: [
        'Precision of 35.4% against a 6.5% baseline (5.4x lift), with 50.4% recall.',
        'From period 43 on, precision drops to near zero. That matches a dark market shutdown described in the original Elliptic paper, and it shows why rules learned from the past need re-testing.',
        'The 12,636 flagged transactions with no label went to a ranked review queue. The pipeline labels none of them.'
      ] },
      { h: 'Raw JSON', p: 'I pulled 100 live transactions from the public Blockstream API, flattened the nested JSON into transaction, input and output tables, and reconciled fees on all 99 non-coinbase transactions with no breaks.' },
      { h: 'Limits', p: 'This is not a fraud classifier. A flag means a transaction looks unusual for its period, and whether it is illicit is an investigator\'s call. Most features are anonymized and labels are sparse.' }
    ]
  },
  {
    title: 'Commercial Partnership Business Case',
    line: 'A finance recommendation on how to structure an exclusive live-sports streaming deal.',
    stack: 'Excel · Python · hypothetical deal',
    cats: ['strategy'],
    github: GH + '/Commercial-Partnership-BusinessCase',
    glance: [['$122M', 'probability-weighted NPV'], ['Year 3', 'payback, base case'], ['0.72M', 'Year-1 subscribers to break even']],
    sections: [
      { h: 'The question', p: 'Should a video platform sign a five-year exclusive license for a mid-tier league\'s out-of-market games, and which deal structure creates the most value?' },
      { h: 'What I compared', p: 'Five-year NPV, probability-weighted across downside, base and upside cases:' },
      { list: [
        'Flat fee of $200M, rising 4% a year: -$193M.',
        'A $100M minimum guarantee plus 40% revenue share: +$122M.',
        'Pure 60% revenue share: -$53M.'
      ] },
      { h: 'My recommendation', p: 'Sign only under the guarantee plus revenue share. Negotiate the guarantee down or tie it to subscriber milestones, and add an exit right after Year 2. A flat fee destroys value unless the upside happens, and pure revenue share hands the partner too much of every outcome.' },
      { h: 'What drives it', p: 'Year-1 subscribers matter most. The deal breaks even at about 0.72M against 1.0M in the base case, a cushion of roughly 28%. Viewing hours and ad prices come next.' },
      { h: 'A detail I care about', p: 'The model keeps two revenue lines on purpose. The partner\'s share is paid on all deal revenue, but the platform\'s value counts only incremental revenue, after removing viewing that would have happened anyway. Treating them as one number would overstate the deal.' },
      { h: 'How I checked it', p: 'I rebuilt the Excel model independently in Python, and every NPV matches. I also set up quarterly plan-versus-actual tracking for subscribers, viewing hours, ad prices and incremental revenue, using the same threshold and event-log logic as my variance project.' },
      { h: 'Limits', p: 'The deal is hypothetical. Inputs are benchmarked from public data (NFL Sunday Ticket on YouTube, MLS on Apple) and are not disclosed terms. The model is pre-tax over five years, with no terminal value and no strategic value, and the tracking actuals are simulated.' }
    ]
  },
  {
    title: 'Operational Performance & Financial Efficiency Analysis',
    line: 'Route-level cost analysis for Amtrak, presented to Amtrak representatives.',
    stack: 'SQL · Tableau · Excel · MSBA coursework',
    cats: ['strategy'],
    sections: [
      { h: 'The question', p: 'Where in Amtrak\'s network are inefficiencies costing the most?' },
      { h: 'What I did', list: [
        'Analyzed route-level operational and cost data in SQL.',
        'Built Excel scenario models to test cost-saving options on underperforming routes.',
        'Designed Tableau KPI dashboards to track route performance.'
      ] },
      { h: 'What came out', p: 'Findings and recommendations were presented to Amtrak representatives, who reviewed the analysis.' }
    ]
  }
];

window.TICKER = [
  '34.8% to 12.8% of rows flagged after calibration',
  '128 of 128 planted reconciliation breaks caught',
  'About $3M in AR discrepancies resolved at Deloitte',
  '94.0% of records cleared automatically in SQL',
  '+45% backtested profit in a credit pricing model',
  '$122M probability-weighted NPV business case',
  '5.4x lift on Bitcoin anomaly review',
  '759 deliberately bad AI drafts rejected by the checker'
];
