// Real vault asset download links and content
export const VAULT_DOWNLOAD_URLS: Record<string, string> = {
  v1: 'https://flowfund-v3.vercel.app/vault/flowfund-notion-template.md',
  v2: 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms/template/preview',
  v3: 'https://flowfund-v3.vercel.app/vault/business-expense-analyzer.xlsx',
  v4: 'https://flowfund-v3.vercel.app/vault/30-day-wealth-blueprint.pdf',
  v5: 'https://flowfund-v3.vercel.app/dashboard',
  v6: 'https://flowfund-v3.vercel.app/dashboard/growth',
};

export const VAULT_CONTENT: Record<string, {
  preview: string;
  fullDescription: string;
  includes: string[];
  howToUse: string;
}> = {
  v1: {
    preview: 'The complete FlowFund Command Center Notion template with all 16 modules pre-built and ready to use.',
    fullDescription: 'A comprehensive financial operating system built in Notion.',
    includes: ['Goals & Savings tracker','Monthly budget planner','Net worth tracker','Debt elimination template','Investment portfolio tracker','Income & expense log','Financial health score','Annual review template','Cashflow forecast model','30-day challenge tracker'],
    howToUse: 'Click Download, then click Duplicate in Notion to add to your workspace.',
  },
  v2: {
    preview: 'A powerful 30-day goal tracking spreadsheet with built-in formulas and progress charts.',
    fullDescription: 'Track up to 5 financial goals simultaneously with auto-calculations.',
    includes: ['Multi-goal tracking dashboard','Daily savings calculator','Progress charts','Milestone tracker','Weekly review template','Goal category breakdown'],
    howToUse: 'Download and open in Google Sheets or Excel. Enter goals in the Goals tab.',
  },
  v3: {
    preview: 'AI-powered expense categorizer for businesses.',
    fullDescription: 'Upload your bank CSV export and this tool automatically categorizes expenses.',
    includes: ['CSV import for major banks','Auto-categorization','Tax deduction identifier','Burn rate calculator','Spending heatmap','Year-over-year comparison','Export ready reports'],
    howToUse: 'Export your bank statement as CSV. Open the analyzer and import your CSV.',
  },
  v4: {
    preview: 'Step-by-step 30-day action plan to transform your finances.',
    fullDescription: 'A structured 30-day program based on behavioral finance research.',
    includes: ['30 daily action steps','Week 1: Financial audit','Week 2: Cut costs','Week 3: Debt attack','Week 4: Investment foundation','90-day continuation plan','Progress worksheets'],
    howToUse: 'Read intro on Day 0, then complete one action per day. Do not skip ahead.',
  },
  v5: {
    preview: 'Web-based AI budget planner integrated directly into your FlowFund dashboard.',
    fullDescription: 'Your FlowFund dashboard IS the AI Budget Planner.',
    includes: ['Real-time spending analysis','AI savings recommendations','Category budget suggestions','Cash flow modeling','Bill reminders','Net worth projection'],
    howToUse: 'Navigate to AutoPilot and enable Smart Save for AI-powered recommendations.',
  },
  v6: {
    preview: 'Real-time investment portfolio tracker with risk analysis.',
    fullDescription: 'Track all your investments in one place.',
    includes: ['Multi-asset tracking','Performance analytics','Asset allocation chart','Risk score calculator','Rebalancing alerts','Dividend income tracker','Tax-loss harvesting'],
    howToUse: 'Navigate to Growth Engine and use Revenue tracking to log investment income.',
  },
};
