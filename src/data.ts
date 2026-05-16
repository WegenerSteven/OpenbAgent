export interface CountyDocument {
  id: string;
  title: string;
  type: 'Budget' | 'Audit' | 'Hansard';
  year: string;
  content: string;
}

export interface GazetteNotice {
  id: string;
  countyId: string;
  date: string;
  summary: string;
  impact: 'High' | 'Medium' | 'Low';
  rawText?: string;
}

export interface County {
  id: string;
  name: string;
  code: string;
  documents: CountyDocument[];
  gazetteNotices: GazetteNotice[];
}

export const COUNTIES: County[] = [
  {
    id: 'nairobi',
    name: 'Nairobi',
    code: '047',
    documents: [
      {
        id: 'nairobi-budget-2024',
        title: 'Nairobi County Annual Plan 2024/25',
        type: 'Budget',
        year: '2024/25',
        content: `Total Budget: KES 42.3 Billion.
Allocations:
- Health Services: KES 8.2 Billion. Focus on completion of Mama Lucy Kibaki Hospital expansion.
- Urban Planning & Lands: KES 3.1 Billion. Focus on digitizing land records.
- Environment & Water: KES 4.5 Billion. Projects: Waste to Energy plant in Dandora.
- Education & Social Services: KES 2.8 Billion. Focus on ECDE feeding program and bursaries.
- Roads & Transport: KES 6.4 Billion. Ward-level road rehabilitation projects.

Ward Specific Projects (Sample):
- Kibra: KES 150M for water borehole connectivity.
- Westlands: KES 200M for market renovation.
- Roysambu: KES 100M for street lighting.

Challenges: Pending bills of KES 10.5 Billion carryover.`
      },
      {
        id: 'nairobi-audit-2023',
        title: 'Auditor General Report - Nairobi 2022/23',
        type: 'Audit',
        year: '2022/23',
        content: `Opinion: Adverse Opinion.
Key Audit Findings:
- KES 1.2 Billion in unexplained withdrawals from the revenue account.
- KES 450 Million spent on legal fees without following public procurement protocols.
- Ghost workers: 14% of the payroll data does not match the IPPD system records.
- 56% of projects sampled had delayed completion despite 90% payment.`
      }
    ],
    gazetteNotices: [
      {
        id: 'nairobi-gz-1',
        countyId: 'nairobi',
        date: '2024-05-10',
        summary: 'Supplementary Budget I proposed: Reallocation of KES 450M from Health to Hospitality and Travel.',
        impact: 'High'
      }
    ]
  },
  {
    id: 'mombasa',
    name: 'Mombasa',
    code: '001',
    documents: [
      {
        id: 'mombasa-budget-2024',
        title: 'Mombasa County Budget Estimate 2024/25',
        type: 'Budget',
        year: '2024/25',
        content: `Total Budget: KES 14.8 Billion.
Allocations:
- Blue Economy & Agriculture: KES 1.2 Billion. Focus on fish landing sites in Liwatoni.
- Health: KES 3.9 Billion. Focus on Coast General Teaching and Referral Hospital equipment.
- Tourism: KES 800 Million. International marketing campaigns.
- Environment: KES 1.5 Billion. Solid waste management reorganization.

Specific Projects:
- Mvita: Urban regeneration - KES 300M.
- Nyali: Storm water drainage - KES 150M.`
      }
    ],
    gazetteNotices: []
  },
  {
    id: 'kisumu',
    name: 'Kisumu',
    code: '042',
    documents: [
      {
        id: 'kisumu-budget-2024',
        title: 'Kisumu CIDP & Annual Budget 2024/25',
        type: 'Budget',
        year: '2024/25',
        content: `Total Budget: KES 12.1 Billion.
Allocations:
- Agriculture & Livestock: KES 900 Million. Focus on dairy goats program.
- Trade & Industry: KES 750 Million. Construction of modern markets in peripheral wards.
- Infrastructure: KES 2.2 Billion. Improvement of "jua kali" sectors and rural roads.`
      }
    ],
    gazetteNotices: []
  }
];
