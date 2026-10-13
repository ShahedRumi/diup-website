export const books = [
  {
    id: '1', slug: 'research-methods-for-emerging-economies',
    title: 'Research Methods for Emerging Economies', subtitle: 'Evidence, Context, and Responsible Inquiry',
    authors: ['Dr. Farhana Rahman'], year: 2026, category: 'Research & Methodology', isbn: '978-984-000-001-4',
    pages: 328, language: 'English', edition: '1st Edition', featured: true,
    price: 650, originalPrice: 780, type: 'Monograph', format: 'Hardcover',
    description: 'A practical and reflective guide to designing rigorous research in fast-changing social, technological, and economic contexts.',
    abstract: 'This volume brings together contemporary research design, data ethics, mixed methods, and field-grounded examples for scholars working across South Asia and comparable emerging economies.',
    keywords: ['Research Methods', 'Data Ethics', 'Mixed Methods', 'South Asia'],
    cover: { bg: '#0B2D63', accent: '#43B649', text: '#FFFFFF', code: 'RM' },
    sampleExcerpt: {
      chapter: 'Chapter 1: The Epistemology of Emerging Contexts',
      pages: 'pp. 12–28',
      quote: '“Rigorous empirical inquiry in emerging societies requires not merely borrowing Western paradigms, but interrogating how local institutions mediate reality.”',
      paragraphs: [
        'Research methodologies in the Global South have long navigated between universal standardisation and local contextual fidelity. In this opening chapter, we construct an inquiry matrix that balances quantitative replicability with deep qualitative fieldwork.',
        'Scholars investigating transitional markets frequently encounter fragmented institutional databases, informal networks, and rapid technological diffusion. Designing responsible inquiry mandates ethical transparency, robust triangulation, and collaborative participant engagement.',
        'Through four field cases examined across Bangladesh, India, and Vietnam, this volume establishes how mixed-methods methodologies illuminate socio-economic transformations that conventional surveys consistently overlook.'
      ]
    }
  },
  {
    id: '2', slug: 'sustainable-bangladesh-2041',
    title: 'Sustainable Bangladesh 2041', subtitle: 'Policy, Innovation, and Inclusive Growth',
    authors: ['Prof. Md. Sabur Khan', 'Dr. Nusrat Jahan'], year: 2026, category: 'Sustainability', isbn: '978-984-000-002-1',
    pages: 284, language: 'English', edition: '1st Edition', featured: true,
    price: 820, originalPrice: 950, type: 'Edited Volume', format: 'Hardcover',
    description: 'A multidisciplinary collection examining pathways to an innovative, equitable and climate-resilient Bangladesh.',
    abstract: 'Contributors explore policy systems, green enterprise, digital inclusion, climate adaptation and the role of universities in long-term national development.',
    keywords: ['Sustainability', 'Bangladesh', 'Policy', 'Innovation'],
    cover: { bg: '#173C8A', accent: '#8CCB5E', text: '#FFFFFF', code: 'SB' },
    sampleExcerpt: {
      chapter: 'Introduction: Blueprint for an Equitable Green Future',
      pages: 'pp. 1–19',
      quote: '“True sustainable development is neither a technological luxury nor an ecological afterthought—it is the foundational prerequisite for national resilience.”',
      paragraphs: [
        'As Bangladesh approaches the milestone year 2041, the intersection of industrial expansion, climate vulnerability, and human capital development defines the critical policymaking frontier.',
        'This volume gathers leading economists, environmental scientists, and university leaders to chart a cohesive roadmap. From circular garment manufacturing to solar-powered coastal irrigation, each chapter emphasizes locally scalable solutions.',
        'Crucially, the authors argue that tertiary academic institutions must evolve into living laboratories for climate adaptation and entrepreneurial talent incubation.'
      ]
    }
  },
  {
    id: '3', slug: 'digital-transformation-in-higher-education',
    title: 'Digital Transformation in Higher Education', subtitle: 'Learning Systems for the Next Decade',
    authors: ['Dr. M. Shamsul Alam'], year: 2025, category: 'Education', isbn: '978-984-000-003-8',
    pages: 246, language: 'English', edition: '1st Edition', featured: true,
    price: 540, originalPrice: 620, type: 'Monograph', format: 'Paperback',
    description: 'A strategic account of how universities can design human-centered digital learning ecosystems.',
    abstract: 'From learning analytics to AI-supported advising, this book links institutional strategy with practical implementation and responsible technology use.',
    keywords: ['Higher Education', 'Digital Learning', 'AI', 'Transformation'],
    cover: { bg: '#F1F4F9', accent: '#174EA6', text: '#071A3D', code: 'DT' },
    sampleExcerpt: {
      chapter: 'Chapter 2: Designing Human-Centered Digital Classrooms',
      pages: 'pp. 34–52',
      quote: '“Technology is never a substitute for pedagogical empathy; rather, it provides the scaffold that frees educators to mentor more deeply.”',
      paragraphs: [
        'Higher education institutions across Asia are redesigning their instructional frameworks in response to pervasive automation and student-centered delivery modalities.',
        'This excerpt explores how blended learning environments can transcend passive video lectures. By integrating synchronous collaborative problem-solving with automated feedback loops, university departments have seen substantial gains in student retention.',
        'The chapter concludes with actionable governance principles for ensuring digital accessibility across diverse socioeconomic student groups.'
      ]
    }
  },
  {
    id: '4', slug: 'entrepreneurship-from-campus-to-market',
    title: 'Entrepreneurship: From Campus to Market', subtitle: 'Building Ventures with Purpose',
    authors: ['Dr. Tanvir Ahmed'], year: 2025, category: 'Business & Entrepreneurship', isbn: '978-984-000-004-5',
    pages: 312, language: 'English', edition: '2nd Edition', featured: false,
    price: 480, originalPrice: 580, type: 'Textbook', format: 'Paperback',
    description: 'An applied entrepreneurship text connecting opportunity discovery, venture design, finance, and market execution.',
    abstract: 'Designed for students and early founders, the book blends core entrepreneurial frameworks with cases drawn from Bangladesh and emerging markets.',
    keywords: ['Entrepreneurship', 'Startups', 'Business', 'Innovation'],
    cover: { bg: '#0F6B54', accent: '#D8EC63', text: '#FFFFFF', code: 'EM' }
  },
  {
    id: '5', slug: 'applied-computing-and-ai',
    title: 'Applied Computing & Artificial Intelligence', subtitle: 'Contemporary Perspectives and Practice',
    authors: ['Dr. Sharif Noor', 'Tasnim Akter'], year: 2024, category: 'Computing & AI', isbn: '978-984-000-005-2',
    pages: 368, language: 'English', edition: '1st Edition', featured: false,
    price: 950, originalPrice: 1100, type: 'Reference', format: 'Hardcover',
    description: 'A broad introduction to applied computing, data-driven systems, AI foundations and deployment considerations.',
    abstract: 'The volume emphasizes responsible computing, practical architecture, machine learning fundamentals and the relationship between technical systems and society.',
    keywords: ['AI', 'Computing', 'Machine Learning', 'Responsible Technology'],
    cover: { bg: '#101D3F', accent: '#EF3035', text: '#FFFFFF', code: 'AI' }
  },
  {
    id: '6', slug: 'public-health-and-community-resilience',
    title: 'Public Health & Community Resilience', subtitle: 'Practice, Systems, and Local Evidence',
    authors: ['Dr. Lamia Chowdhury'], year: 2024, category: 'Health Sciences', isbn: '978-984-000-006-9',
    pages: 296, language: 'English', edition: '1st Edition', featured: false,
    price: 590, type: 'Monograph', format: 'Paperback',
    description: 'A systems-oriented guide to public health practice, community participation and resilience planning.',
    abstract: 'Case-led chapters connect health promotion, epidemiology, local capacity building and emergency preparedness with community realities.',
    keywords: ['Public Health', 'Community', 'Resilience', 'Health Systems'],
    cover: { bg: '#EAF1FF', accent: '#174EA6', text: '#071A3D', code: 'PH' }
  },
  {
    id: '7', slug: 'bangla-language-and-cultural-memory',
    title: 'Bangla Language & Cultural Memory', subtitle: 'Texts, Identity, and Contemporary Readings',
    authors: ['Prof. Samia Sultana'], year: 2023, category: 'Humanities', isbn: '978-984-000-007-6',
    pages: 224, language: 'Bangla & English', edition: '1st Edition', featured: false,
    price: 420, originalPrice: 500, type: 'Monograph', format: 'Paperback',
    description: 'Essays on literature, language, cultural memory and the changing forms of Bengali identity.',
    abstract: 'The collection moves between textual scholarship and contemporary cultural analysis, connecting archives, language politics and lived memory.',
    keywords: ['Bangla', 'Literature', 'Culture', 'Memory'],
    cover: { bg: '#7D2433', accent: '#F2C66D', text: '#FFFFFF', code: 'BL' }
  },
  {
    id: '8', slug: 'designing-for-people-and-planet',
    title: 'Designing for People & Planet', subtitle: 'Human-Centered Design for Social Impact',
    authors: ['Nafisa Karim'], year: 2023, category: 'Design & Innovation', isbn: '978-984-000-008-3',
    pages: 208, language: 'English', edition: '1st Edition', featured: false,
    price: 750, originalPrice: 880, type: 'Textbook', format: 'Hardcover',
    description: 'A visual, practical introduction to human-centered design for education, enterprise and social innovation.',
    abstract: 'Frameworks for research, ideation, prototyping and evaluation are paired with practical examples grounded in social impact contexts.',
    keywords: ['Design Thinking', 'Innovation', 'Social Impact', 'UX'],
    cover: { bg: '#F5EFE2', accent: '#174EA6', text: '#071A3D', code: 'DP' }
  }
]

export const news = [
  { id: '1', slug: 'diu-press-announces-new-research-series', category: 'Announcement', date: '2026-09-02', title: 'DIU Press announces a new interdisciplinary research series', excerpt: 'The series will bring together scholarship across technology, sustainability, business, health and the humanities.', image: '/news/news-1.svg', featured: false, body: ['DIU Press is preparing a new interdisciplinary research series designed to make high-quality academic work more accessible to scholars, students and practitioners.', 'The series will invite monographs, edited volumes and research-led professional titles that connect rigorous scholarship with real-world relevance.', 'Editorial guidelines, proposal templates and submission windows will be published through the Submission section.'] },
  { id: '2', slug: 'author-workshop-on-academic-publishing', category: 'Event', date: '2026-08-18', title: 'Author workshop: preparing a manuscript for academic publication', excerpt: 'A practical session on proposals, peer review, editorial preparation and publication ethics.', image: '/news/news-2.svg', featured: true, body: ['DIU Press hosted an author development workshop focused on the journey from manuscript idea to publication-ready proposal.', 'The session covered audience definition, structure, evidence, citation practice, peer review, permissions and ethical authorship.', 'Future workshops will continue to support early-career researchers and faculty authors.'] },
  { id: '3', slug: 'new-titles-in-education-and-sustainability', category: 'Publications', date: '2026-07-30', title: 'New titles expand the Press list in education and sustainability', excerpt: 'Two new academic titles join the DIU Press catalogue with a focus on future-ready institutions and inclusive development.', image: '/news/news-3.svg', featured: false, body: ['The latest DIU Press list adds new work in education transformation and sustainable development.', 'Both titles reflect the Press commitment to regionally grounded scholarship with relevance beyond Bangladesh.', 'Publication pages include metadata, descriptions and author information for researchers and institutional readers.'] },
  { id: '4', slug: 'editorial-board-review-framework', category: 'Editorial', date: '2026-06-12', title: 'Strengthening editorial review and publication quality', excerpt: 'DIU Press introduces a clearer editorial pathway for proposal screening, review and production readiness.', image: '/news/news-4.svg', featured: false, body: ['DIU Press is refining its editorial review framework to provide authors with clearer expectations and a more consistent publication pathway.', 'The updated process emphasizes scope fit, scholarly contribution, research integrity and production readiness.', 'The framework is intended to strengthen quality while making communication with authors more transparent.'] },
  { id: '5', slug: 'international-scholarly-exchange-symposium', category: 'Symposium', date: '2026-05-24', title: 'DIU Press co-hosts international symposium on regional knowledge production', excerpt: 'Scholars from across South Asia gathered to discuss open access monographs, regional citation networks, and collaborative publishing.', image: '/news/news-1.svg', featured: false, body: ['Scholars from prominent universities across Bangladesh and the region gathered at Daffodil International University for an interdisciplinary discussion on academic publishing.', 'Panels focused on overcoming barriers to open access publishing, elevating local case studies in global discourse, and collaborative peer-review models.', 'Proceedings and selected papers will be published under the DIU Press Academic Monograph series in early 2027.'] },
  { id: '6', slug: 'monograph-grant-program-2026', category: 'Announcement', date: '2026-04-15', title: 'Annual Monograph Grant program opens for early-career faculty', excerpt: 'Grants to support developmental editing, indexing, and open access publication for promising faculty research manuscripts.', image: '/news/news-2.svg', featured: false, body: ['DIU Press is delighted to announce the 2026 Monograph Publication Support Grant, designed to assist emerging researchers in transforming doctoral dissertations and research reports into publication-ready books.', 'Recipients receive dedicated editorial mentorship, professional copy-editing, indexing support, and complete digital production.', 'Submissions are accepted across all active research disciplines until 30 November 2026.'] },
  { id: '7', slug: 'crossref-doi-system-upgrade', category: 'Editorial', date: '2026-03-20', title: 'Enhanced CrossRef DOI and digital preservation infrastructure deployed', excerpt: 'Upgraded persistent identifiers and metadata feeds to improve global discoverability of university publications in major indexes.', image: '/news/news-3.svg', featured: false, body: ['To ensure maximum global discoverability and persistent preservation of academic scholarship, DIU Press has deployed an upgraded metadata automation pipeline with CrossRef.', 'All published books and chapters will automatically receive persistent digital object identifiers (DOIs) and rich Dublin Core metadata feeds.', 'This advancement makes DIU Press research effortlessly discoverable in university library discovery layers, Scopus, Google Scholar, and worldwide citation indices.'] },
  { id: '8', slug: 'sustainable-development-reading-circle', category: 'Event', date: '2026-02-10', title: 'University reading circle launches discussion on Sustainable Bangladesh 2041', excerpt: 'Faculty and graduate students host monthly seminar series engaging key policy recommendations from recent press publications.', image: '/news/news-4.svg', featured: false, body: ['The Department of Development Studies and DIU Press held the inaugural session of the Campus Reading Circle, centering discussion around the newly released volume Sustainable Bangladesh 2041.', 'The session featured co-authors and invited policy analysts reflecting on climate-resilient enterprise and institutional governance.', 'Future sessions will explore digital transformation in higher education and applied artificial intelligence for social development.'] }
]

export const team = [
  { id: 1, name: 'Prof. Dr. M. Lutfar Rahman', role: 'Editorial Advisor', image: '/team/team-1.svg', bio: 'Provides strategic academic guidance for the Press and supports standards of scholarship, integrity and institutional relevance.' },
  { id: 2, name: 'Dr. Farhana Rahman', role: 'Executive Editor', image: '/team/team-2.svg', bio: 'Leads editorial development, publication planning and author engagement across the DIU Press academic list.' },
  { id: 3, name: 'Md. Arif Hasan', role: 'Publication Manager', image: '/team/team-3.svg', bio: 'Coordinates editorial production, schedules, metadata, print readiness and publication operations.' },
  { id: 4, name: 'Nusrat Jahan', role: 'Assistant Editor', image: '/team/team-4.svg', bio: 'Supports manuscript review, copy preparation, author communication and publication quality assurance.' }
]

export const writers = [
  {
    id: 'w-1',
    name: 'Prof. Dr. Md. Sabur Khan',
    slug: 'prof-dr-md-sabur-khan',
    designation: 'Founder & Chairman, Board of Trustees, Daffodil International University',
    bio: 'Pioneering educational entrepreneur, corporate leader, and visionary author advocating sustainable development, institutional innovation, and youth empowerment across Asia.',
    image: '/team/Dr. Md. Sabur Khan.png',
    order: 1,
    bookCount: 1,
    active: true
  },
  {
    id: 'w-2',
    name: 'Dr. Farhana Rahman',
    slug: 'dr-farhana-rahman',
    designation: 'Associate Professor & Senior Research Fellow',
    bio: 'Specializes in qualitative research methodologies, sustainable socio-economic development, and emerging economic transformation in South Asia.',
    image: '/team/team-2.svg',
    order: 2,
    bookCount: 1,
    active: true
  },
  {
    id: 'w-3',
    name: 'Dr. Nusrat Jahan',
    slug: 'dr-nusrat-jahan',
    designation: 'Assistant Professor & Policy Analyst',
    bio: 'Focuses on environmental sustainability, clean energy transitions, green financing, and inclusive economic growth frameworks.',
    image: '/team/team-4.svg',
    order: 3,
    bookCount: 1,
    active: true
  },
  {
    id: 'w-4',
    name: 'Dr. M. Shamsul Alam',
    slug: 'dr-m-shamsul-alam',
    designation: 'Professor of Development Economics',
    bio: 'Author and senior researcher investigating microeconomic resilience, rural enterprise ecosystems, and contemporary public policy in Bangladesh.',
    image: '/team/team-1.svg',
    order: 4,
    bookCount: 1,
    active: true
  },
  {
    id: 'w-5',
    name: 'Dr. Tanvir Ahmed',
    slug: 'dr-tanvir-ahmed',
    designation: 'Professor, Department of Computer Science & Engineering',
    bio: 'Leading scholar in machine learning, human-centered computational systems, and digital pedagogy across higher education curricula.',
    image: '/team/team-3.svg',
    order: 5,
    bookCount: 1,
    active: true
  },
  {
    id: 'w-6',
    name: 'Dr. Sharif Noor',
    slug: 'dr-sharif-noor',
    designation: 'Associate Professor of Business Administration',
    bio: 'Author and consultant researching corporate strategy, startup venture formation, and digital commerce models in frontier markets.',
    image: '/team/team-1.svg',
    order: 6,
    bookCount: 1,
    active: true
  }
]

export const categories = [...new Set(books.map((book) => book.category))]
