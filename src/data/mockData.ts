import { Book, User, BorrowRecord, SeatReservation, BookExchangeItem, ReadingCompanion, ShelfInfo, NotificationItem, ActivityTimelineItem } from '../types';

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'b-1',
    isbn: '978-0132350884',
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    category: 'Software Engineering',
    description: 'Even bad code can function. But if code isn’t clean, it can bring a development organization to its knees. Every year, countless hours and significant resources are lost because of poorly written code. Clean Code presents principles, patterns, and practices of writing clean code with case studies.',
    rating: 4.8,
    reviewsCount: 342,
    pages: 464,
    readingTimeHours: 14,
    shelfLocation: 'Floor 2 · Shelf SE-01',
    shelfId: 'shelf-se',
    totalCopies: 8,
    availableCopies: 3,
    condition: 'Good',
    conditionNotes: 'Spine slightly relaxed; all pages intact and pristine',
    lastCheckedDate: '2026-09-12',
    publicationYear: 2008,
    publisher: 'Prentice Hall',
    coverGradient: 'from-violet-950 via-purple-900 to-amber-950',
    coverAccent: '#f97316',
    popularityScore: 98,
    aiSummary: {
      summary: 'Clean Code is an industry-standard guide focusing on craftsmanship, readability, meaningful naming, concise functions, and disciplined test-driven refactoring.',
      keyIdeas: [
        'Functions should do one thing, and do it well.',
        'Meaningful naming reduces cognitive load more than any code comment.',
        'Boy Scout Rule: Always leave the code cleaner than you found it.',
        'Error handling is important, but if it obscures logic, it is wrong.'
      ],
      importantConcepts: [
        'Single Responsibility Principle (SRP)',
        'Test-Driven Development (TDD) cycles',
        'Command-Query Separation',
        'DRY (Don’t Repeat Yourself)'
      ],
      mainTakeaways: [
        'Code is read 10 times more often than it is written.',
        'Small functions under 20 lines are exponentially easier to test and maintain.',
        'Eliminate flags and switch statements through polymorphism.'
      ],
      whyRead: 'Essential foundational reading for every computer science undergraduate before building enterprise-scale software.'
    }
  },
  {
    id: 'b-2',
    isbn: '978-0135957059',
    title: 'The Pragmatic Programmer: Your Journey to Mastery',
    author: 'David Thomas & Andrew Hunt',
    category: 'Software Engineering',
    description: 'The Pragmatic Programmer cuts through the increasing specialization and technicalities of modern software development to examine the core process: taking a requirement and producing working, maintainable code that delights its users.',
    rating: 4.9,
    reviewsCount: 289,
    pages: 352,
    readingTimeHours: 11,
    shelfLocation: 'Floor 2 · Shelf SE-02',
    shelfId: 'shelf-se',
    totalCopies: 6,
    availableCopies: 2,
    condition: 'Excellent',
    conditionNotes: 'Like new, 20th Anniversary Edition',
    lastCheckedDate: '2026-09-18',
    publicationYear: 2019,
    publisher: 'Addison-Wesley',
    coverGradient: 'from-slate-900 to-blue-950',
    coverAccent: '#60a5fa',
    popularityScore: 96,
    aiSummary: {
      summary: 'A philosophical yet deeply practical roadmap covering career agency, software entropy, orthogonality, automation, and continuous pragmatism.',
      keyIdeas: [
        'Care about your craft; why spend your life developing software unless you care?',
        'Provide options, don’t make lame excuses when bugs occur.',
        'Don’t live with broken windows; fix bad designs and bad code immediately.',
        'Stone soup and boiled frogs: remember the big picture.'
      ],
      importantConcepts: [
        'Orthogonality and decoupled system architecture',
        'Tracer bullets vs. throwaway prototyping',
        'Design by Contract (DbC)',
        'Domain-specific languages and automation tooling'
      ],
      mainTakeaways: [
        'Invest systematically in your knowledge portfolio like a financial investor.',
        'Critically analyze everything you read and hear in tech.',
        'Automate routine procedures so human memory is reserved for creativity.'
      ],
      whyRead: 'Teaches engineering discipline and mindset beyond syntactical language trivia.'
    }
  },
  {
    id: 'b-3',
    isbn: '978-0262046305',
    title: 'Introduction to Algorithms (CLRS)',
    author: 'Thomas H. Cormen, Charles Leiserson, Ronald Rivest, Clifford Stein',
    category: 'Computer Science',
    description: 'The definitive textbook widely acclaimed as the Bible of algorithm analysis. Covers comprehensive treatments of algorithms, asymptotic notation, divide-and-conquer, dynamic programming, greedy algorithms, and graph theory.',
    rating: 4.7,
    reviewsCount: 512,
    pages: 1312,
    readingTimeHours: 48,
    shelfLocation: 'Floor 1 · Shelf CS-01',
    shelfId: 'shelf-cs',
    totalCopies: 12,
    availableCopies: 4,
    condition: 'Good',
    conditionNotes: 'Minor corner wear on hardcover binding; pages clean',
    lastCheckedDate: '2026-09-01',
    publicationYear: 2022,
    publisher: 'MIT Press',
    coverGradient: 'from-indigo-950 to-slate-900',
    coverAccent: '#818cf8',
    popularityScore: 99,
    aiSummary: {
      summary: 'Comprehensive, rigorous, and mathematical reference detailing algorithmic problem solving, asymptotic growth, data structures, and NP-completeness.',
      keyIdeas: [
        'Algorithms are technology just as hardware is; efficient algorithms multiply compute power.',
        'Asymptotic analysis allows comparing efficiency independent of machine architecture.',
        'Optimal substructure and overlapping subproblems indicate dynamic programming opportunities.'
      ],
      importantConcepts: [
        'Recurrence relations & Master Theorem',
        'Amortized analysis (Aggregate, Accounting, Potential methods)',
        'B-Trees and Red-Black balanced trees',
        'Network flow and Dijkstra / Bellman-Ford shortest paths'
      ],
      mainTakeaways: [
        'Mathematical precision in proving algorithm correctness is as vital as implementation.',
        'Understanding lower bounds guides whether to pursue exact or heuristic polynomial solutions.'
      ],
      whyRead: 'Mandatory standard reference for competitive programming, gate exams, and core DBMS algorithms.'
    }
  },
  {
    id: 'b-4',
    isbn: '978-0078022159',
    title: 'Database System Concepts',
    author: 'Abraham Silberschatz, Henry F. Korth, S. Sudarshan',
    category: 'Computer Science',
    description: 'The premier textbook for database education. Presents fundamental concepts of relational models, relational algebra, SQL querying, storage architecture, indexing structures (B+ trees, hashing), and ACID transaction processing.',
    rating: 4.8,
    reviewsCount: 310,
    pages: 1376,
    readingTimeHours: 42,
    shelfLocation: 'Floor 1 · Shelf CS-02',
    shelfId: 'shelf-cs',
    totalCopies: 10,
    availableCopies: 5,
    condition: 'Excellent',
    conditionNotes: 'Seventh edition; crisp hardcover, pristine pages',
    lastCheckedDate: '2026-09-15',
    publicationYear: 2020,
    publisher: 'McGraw-Hill',
    coverGradient: 'from-emerald-950 via-teal-900 to-emerald-900',
    coverAccent: '#10b981',
    popularityScore: 97,
    aiSummary: {
      summary: 'The authoritative cornerstone for DBMS theory, relational algebra, ACID transactions, two-phase locking, crash recovery, and query optimization.',
      keyIdeas: [
        'Data abstraction hides physical storage complexity through logical and physical data independence.',
        'ACID properties ensure financial and mission-critical integrity amidst server crashes.',
        'Query evaluation plans turn declarative SQL into high-throughput pipelined relational operators.'
      ],
      importantConcepts: [
        'Entity-Relationship modeling & Boyce-Codd Normal Form (BCNF)',
        'B+ Tree index search and split dynamics',
        'Strict 2-Phase Locking (S2PL) & Deadlock Detection',
        'ARIES recovery algorithm and Write-Ahead Logging (WAL)'
      ],
      mainTakeaways: [
        'Normalization eliminates update anomalies and data redundancies.',
        'Transactions must preserve consistency even when power fails mid-write.'
      ],
      whyRead: 'Direct core textbook for your College DBMS course and institutional library management database schema design.'
    }
  },
  {
    id: 'b-5',
    isbn: '978-1119456339',
    title: 'Operating System Concepts (The Dinosaur Book)',
    author: 'Abraham Silberschatz, Peter B. Galvin, Greg Gagne',
    category: 'Computer Science',
    description: 'Known worldwide as the Dinosaur Book, this classic text provides a clear description of the concepts that underlie operating systems: processes, threads, CPU scheduling, synchronization primitives, memory virtualization, and file systems.',
    rating: 4.6,
    reviewsCount: 275,
    pages: 1024,
    readingTimeHours: 36,
    shelfLocation: 'Floor 1 · Shelf CS-03',
    shelfId: 'shelf-cs',
    totalCopies: 8,
    availableCopies: 1,
    condition: 'Good',
    conditionNotes: 'Library barcode stamped on endleaf; very good condition',
    lastCheckedDate: '2026-08-28',
    publicationYear: 2018,
    publisher: 'Wiley',
    coverGradient: 'from-emerald-950 to-slate-900',
    coverAccent: '#10b981',
    popularityScore: 94,
    aiSummary: {
      summary: 'Explains how the operating system acts as the hardware resource allocator and control program coordinating processes, threads, virtual memory, and secondary storage.',
      keyIdeas: [
        'The OS abstracts messy hardware specifics into uniform, secure process environments.',
        'Context switching introduces latency; scheduling algorithms must balance fairness vs. throughput.',
        'Virtual memory uses paging to grant processes the illusion of contiguous, limitless RAM.'
      ],
      importantConcepts: [
        'Peterson’s solution, Semaphores, Mutex locks, and Monitors',
        'Banker’s Algorithm for deadlock avoidance',
        'Translation Lookaside Buffers (TLB) and Page Replacement (LRU, FIFO)',
        'Virtual File Systems and Inode storage maps'
      ],
      mainTakeaways: [
        'Race conditions occur whenever multiple concurrent threads manipulate shared data without atomic synchronization.',
        'Memory management requires hardware MMU assistance for zero-overhead address translation.'
      ],
      whyRead: 'Crucial for understanding how DBMS storage engines interface with low-level page caches and kernel threads.'
    }
  },
  {
    id: 'b-6',
    isbn: '978-0132126953',
    title: 'Computer Networks',
    author: 'Andrew S. Tanenbaum, David J. Wetherall',
    category: 'Computer Science',
    description: 'The world’s best-selling networking text, organized layer-by-layer starting from the Physical Layer up through Application Layer protocols like HTTP, DNS, and TLS security.',
    rating: 4.7,
    reviewsCount: 220,
    pages: 960,
    readingTimeHours: 32,
    shelfLocation: 'Floor 1 · Shelf CS-04',
    shelfId: 'shelf-cs',
    totalCopies: 7,
    availableCopies: 2,
    condition: 'Needs Attention',
    conditionNotes: 'Front cover edge slightly creased, binding intact',
    lastCheckedDate: '2026-09-10',
    publicationYear: 2021,
    publisher: 'Pearson',
    coverGradient: 'from-sky-950 to-blue-900',
    coverAccent: '#38bdf8',
    popularityScore: 91,
    aiSummary: {
      summary: 'Structured exploration of the 5-layer OSI / TCP/IP stack explaining packet routing, congestion control, wireless protocols, and cryptographic transport security.',
      keyIdeas: [
        'Layering isolates functional concerns so lower layer upgrades don’t break upper applications.',
        'The End-to-End argument places reliability logic at application edges rather than intermediate routers.',
        'Packet switching provides superior resource utilization compared to dedicated circuit switching.'
      ],
      importantConcepts: [
        'Sliding window protocols & Go-Back-N',
        'Dijkstra Link-State & Bellman-Ford Distance-Vector routing',
        'TCP 3-way handshake & AIMD congestion window',
        'Public-Key infrastructure, asymmetric RSA/ECC, and TLS handshakes'
      ],
      mainTakeaways: [
        'Bandwidth-delay product dictates transmission pipe volume.',
        'DNS and BGP represent the decentralized routing backbone of global cyberspace.'
      ],
      whyRead: 'Foundational for building distributed client-server applications and modern web services.'
    }
  },
  {
    id: 'b-7',
    isbn: '978-0134610993',
    title: 'Artificial Intelligence: A Modern Approach',
    author: 'Stuart Russell, Peter Norvig',
    category: 'Artificial Intelligence',
    description: 'The global standard textbook used in over 1,500 universities. Explores intelligent agents, heuristic search, constraint satisfaction, adversarial games, Bayesian reasoning, reinforcement learning, and ethical safety.',
    rating: 4.9,
    reviewsCount: 440,
    pages: 1152,
    readingTimeHours: 45,
    shelfLocation: 'Floor 2 · Shelf AI-01',
    shelfId: 'shelf-ai',
    totalCopies: 9,
    availableCopies: 2,
    condition: 'Excellent',
    conditionNotes: 'Fourth Global Edition, pristine condition',
    lastCheckedDate: '2026-09-17',
    publicationYear: 2020,
    publisher: 'Pearson',
    coverGradient: 'from-purple-950 to-indigo-950',
    coverAccent: '#a855f7',
    popularityScore: 99,
    aiSummary: {
      summary: 'The definitive survey of intelligent rational agents spanning search algorithms, probabilistic graphical models, natural language processing, and robotics.',
      keyIdeas: [
        'An intelligent agent perceives its environment through sensors and acts rationally via actuators.',
        'Rationality means selecting actions expected to maximize an objective performance measure.',
        'Heuristic evaluations drastically prune exponential decision trees in high-dimensional spaces.'
      ],
      importantConcepts: [
        'A* Search with admissible heuristics',
        'Minimax and Alpha-Beta game tree pruning',
        'Markov Decision Processes (MDPs) & Bellman Optimality',
        'Probabilistic reasoning via Bayesian networks'
      ],
      mainTakeaways: [
        'Machine learning is not merely statistical fitting but rational decision making under uncertainty.',
        'Value alignment and ethical safety must be engineered into objective functions.'
      ],
      whyRead: 'The gold standard theoretical baseline for AI research and machine learning engineering.'
    }
  },
  {
    id: 'b-8',
    isbn: '978-1492032649',
    title: 'Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow',
    author: 'Aurélien Géron',
    category: 'Artificial Intelligence',
    description: 'A deeply pragmatic, code-first walkthrough of building end-to-end machine learning pipelines. Covers linear regression, SVMs, random forests, neural networks, CNNs, RNNs, and Transformers with production best practices.',
    rating: 4.9,
    reviewsCount: 388,
    pages: 856,
    readingTimeHours: 30,
    shelfLocation: 'Floor 2 · Shelf AI-02',
    shelfId: 'shelf-ai',
    totalCopies: 8,
    availableCopies: 4,
    condition: 'Excellent',
    conditionNotes: 'Third edition; includes online code companion references',
    lastCheckedDate: '2026-09-14',
    publicationYear: 2022,
    publisher: 'O’Reilly Media',
    coverGradient: 'from-amber-950 to-slate-900',
    coverAccent: '#f59e0b',
    popularityScore: 98,
    aiSummary: {
      summary: 'Hands-on, highly applied guide converting abstract machine learning theory into deployable Python pipelines using Scikit-Learn and TensorFlow.',
      keyIdeas: [
        'Data hygiene, feature engineering, and cross-validation matter more than algorithm complexity.',
        'Always establish a baseline heuristic model before training deep neural networks.',
        'Regularization (L1/L2, Dropout) is vital to combat overfitting on training splits.'
      ],
      importantConcepts: [
        'Bias-variance tradeoff and learning curves',
        'Ensemble methods (Bagging, Boosting, Gradient Boosted Trees)',
        'Backpropagation and gradient descent optimizers (Adam, RMSprop)',
        'Convolutional receptive fields & Attention mechanisms'
      ],
      mainTakeaways: [
        'A machine learning project is 80% data preparation and validation, 20% modeling.',
        'Continuous monitoring for data drift and concept drift is mandatory after deployment.'
      ],
      whyRead: 'The best companion for students transitioning from theoretical coursework to applied Kaggle projects.'
    }
  },
  {
    id: 'b-9',
    isbn: '978-0262035613',
    title: 'Deep Learning',
    author: 'Ian Goodfellow, Yoshua Bengio, Aaron Courville',
    category: 'Artificial Intelligence',
    description: 'Often referred to as the Deep Learning Bible, written by pioneers of the field. Synthesizes applied math, linear algebra, probability, information theory, deep feedforward networks, convolutional architectures, and generative modeling.',
    rating: 4.7,
    reviewsCount: 260,
    pages: 800,
    readingTimeHours: 35,
    shelfLocation: 'Floor 2 · Shelf AI-03',
    shelfId: 'shelf-ai',
    totalCopies: 5,
    availableCopies: 1,
    condition: 'Good',
    conditionNotes: 'Hardcover bound, clean text margins',
    lastCheckedDate: '2026-09-05',
    publicationYear: 2016,
    publisher: 'MIT Press',
    coverGradient: 'from-violet-950 to-slate-950',
    coverAccent: '#8b5cf6',
    popularityScore: 93,
    aiSummary: {
      summary: 'Rigorous mathematical formulation of deep learning mechanisms from first-principles linear algebra and calculus to generative models.',
      keyIdeas: [
        'Deep representations allow hierarchical feature extraction without manual hand-crafting.',
        'Gradient-based optimization in non-convex landscapes succeeds through high-dimensional saddle point properties.'
      ],
      importantConcepts: [
        'Vanishing/exploding gradients & Batch Normalization',
        'Autoencoders and representation learning',
        'Generative Adversarial Networks (GANs)',
        'Monte Carlo methods in deep generative models'
      ],
      mainTakeaways: [
        'Deep neural networks function as universal approximators capable of modeling arbitrarily complex manifolds.',
        'Optimization requires understanding numerical stability and matrix decomposition.'
      ],
      whyRead: 'Provides the profound mathematical foundations needed for research-grade AI contributions.'
    }
  },
  {
    id: 'b-10',
    isbn: '978-1593279288',
    title: 'Python Crash Course: A Hands-On, Project-Based Introduction',
    author: 'Eric Matthes',
    category: 'Computer Science',
    description: 'The world’s best-selling guide to the Python programming language. Walks beginners through fundamentals like lists, dictionaries, classes, and loops before building three real-world projects: a 2D Space Invaders arcade game, a data visualization suite, and a Django web app.',
    rating: 4.8,
    reviewsCount: 395,
    pages: 544,
    readingTimeHours: 18,
    shelfLocation: 'Floor 1 · Shelf CS-05',
    shelfId: 'shelf-cs',
    totalCopies: 10,
    availableCopies: 6,
    condition: 'Excellent',
    conditionNotes: 'Third Edition, clean paperback',
    lastCheckedDate: '2026-09-19',
    publicationYear: 2023,
    publisher: 'No Starch Press',
    coverGradient: 'from-teal-950 to-blue-950',
    coverAccent: '#14b8a6',
    popularityScore: 95,
    aiSummary: {
      summary: 'A fast-paced, highly accessible tutorial taking learners from basic syntax to object-oriented programming, data visualization with Matplotlib, and web deployment.',
      keyIdeas: [
        'Learn syntax by immediately applying it to interactive projects.',
        'Pythonic readability and clean indentation make debugging accessible.',
        'Modular functions and classes build habits for large codebase design.'
      ],
      importantConcepts: [
        'Object-oriented inheritance and encapsulation',
        'File I/O and JSON serialization',
        'Pygame game loops and collision detection',
        'Matplotlib & Plotly interactive scatter plots'
      ],
      mainTakeaways: [
        'Python is the lingua franca of data analysis and modern backend APIs.',
        'Writing tests with Pytest early prevents regression headaches.'
      ],
      whyRead: 'Ideal for 1st and 2nd year students needing rapid practical proficiency in Python.'
    }
  },
  {
    id: 'b-11',
    isbn: '978-0735211292',
    title: 'Atomic Habits: An Easy & Proven Way to Build Good Habits & Break Bad Ones',
    author: 'James Clear',
    category: 'Self-Improvement',
    description: 'No matter your goals, Atomic Habits offers a proven framework for improving every day. James Clear reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.',
    rating: 4.9,
    reviewsCount: 620,
    pages: 320,
    readingTimeHours: 8,
    shelfLocation: 'Floor 3 · Shelf SI-01',
    shelfId: 'shelf-si',
    totalCopies: 15,
    availableCopies: 5,
    condition: 'Excellent',
    conditionNotes: 'Special hardbound academic edition',
    lastCheckedDate: '2026-09-20',
    publicationYear: 2018,
    publisher: 'Avery',
    coverGradient: 'from-amber-950 to-orange-950',
    coverAccent: '#f97316',
    popularityScore: 100,
    aiSummary: {
      summary: 'Atomic Habits demonstrates how tiny 1% daily improvements compound into transformative personal and academic achievements using behavioral psychology.',
      keyIdeas: [
        'You do not rise to the level of your goals. You fall to the level of your systems.',
        'Habits are the compound interest of self-improvement.',
        'True habit change is identity change: decide who you want to be, then prove it with small wins.',
        'Environment is the invisible hand that shapes human behavior.'
      ],
      importantConcepts: [
        'The Four Laws of Behavior Change: Make it Obvious, Attractive, Easy, Satisfying',
        'Habit Stacking & Implementation Intentions',
        'The 2-Minute Rule to defeat procrastination',
        'The Goldilocks Rule of peak motivation'
      ],
      mainTakeaways: [
        'Small habits don’t add up; they compound exponentially over semesters.',
        'Focus on designing frictionless study environments rather than relying on sheer willpower.'
      ],
      whyRead: 'Transformative reading for university students balancing heavy engineering course loads.'
    }
  },
  {
    id: 'b-12',
    isbn: '978-0857197689',
    title: 'The Psychology of Money: Timeless Lessons on Wealth, Greed, and Happiness',
    author: 'Morgan Housel',
    category: 'Finance & Business',
    description: 'Doing well with money isn’t necessarily about what you know. It’s about how you behave. And behavior is hard to teach, even to really smart people. 19 short stories exploring the strange ways people think about money and how to make better sense of one of life’s most important topics.',
    rating: 4.8,
    reviewsCount: 450,
    pages: 256,
    readingTimeHours: 7,
    shelfLocation: 'Floor 3 · Shelf FB-01',
    shelfId: 'shelf-fb',
    totalCopies: 8,
    availableCopies: 3,
    condition: 'Good',
    conditionNotes: 'Clean copy, crisp margins',
    lastCheckedDate: '2026-09-11',
    publicationYear: 2020,
    publisher: 'Harriman House',
    coverGradient: 'from-emerald-950 to-teal-950',
    coverAccent: '#10b981',
    popularityScore: 96,
    aiSummary: {
      summary: 'Explains that financial success is not a hard science like physics, but a soft skill where your emotional control and patience matter far more than spreadsheet math.',
      keyIdeas: [
        'Doing well with money has a little to do with how smart you are and a lot to do with how you behave.',
        'Spending money to show people how much money you have is the fastest way to have less money.',
        'The highest form of wealth is the ability to wake up every morning and say, "I can do whatever I want today."',
        'Compounding is the secret engine of wealth.'
      ],
      importantConcepts: [
        'Wealth is what you do not see (unspent options)',
        'Reasonable vs. Rational decision making',
        'Margin of safety and room for error',
        'The seductive optimism of market volatility'
      ],
      mainTakeaways: [
        'Financial independence grants control over your personal time.',
        'Avoid catastrophic debt risks that can interrupt the power of compounding.'
      ],
      whyRead: 'A must-read for young engineers preparing to earn competitive tech salaries.'
    }
  },
  {
    id: 'b-13',
    isbn: '978-0143130727',
    title: 'Ikigai: The Japanese Secret to a Long and Happy Life',
    author: 'Héctor García & Francesc Miralles',
    category: 'Self-Improvement',
    description: 'Discover the Japanese concept of Ikigai — the intersection of what you love, what you are good at, what the world needs, and what you can get paid for. Based on research in Okinawa, the centenarian blue zone.',
    rating: 4.6,
    reviewsCount: 310,
    pages: 208,
    readingTimeHours: 5,
    shelfLocation: 'Floor 3 · Shelf SI-02',
    shelfId: 'shelf-si',
    totalCopies: 6,
    availableCopies: 2,
    condition: 'Excellent',
    conditionNotes: 'Mint condition clothbound',
    lastCheckedDate: '2026-09-16',
    publicationYear: 2017,
    publisher: 'Penguin Life',
    coverGradient: 'from-rose-950 to-pink-950',
    coverAccent: '#f43f5e',
    popularityScore: 92,
    aiSummary: {
      summary: 'Explores the philosophical intersection of passion, mission, vocation, and profession for sustained longevity, mindfulness, and purpose.',
      keyIdeas: [
        'Find your flow in deep work and daily rituals.',
        'Stay active and never fully retire from purposeful learning.',
        'Surround yourself with good friends and nurture unhurried meals.'
      ],
      importantConcepts: [
        'The 4 Ikigai circles (Passion, Vocation, Profession, Mission)',
        'Hara Hachi Bu: 80% fullness rule',
        'Antifragility through steady routine and community connection'
      ],
      mainTakeaways: [
        'Purpose isn’t found in grand solitary achievements, but in everyday presence and connection.',
        'Resilience comes from daily gratitude and active intellectual engagement.'
      ],
      whyRead: 'Brings calm perspective to students facing examination stress and future anxiety.'
    }
  },
  {
    id: 'b-14',
    isbn: '978-0062315007',
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    category: 'Classic Literature',
    description: 'Paulo Coelho\'s masterpiece tells the mystical story of Santiago, an Andalusian shepherd boy who yearns to travel in search of a worldly treasure. His quest will lead him to riches far different and far more satisfying than he ever imagined.',
    rating: 4.7,
    reviewsCount: 520,
    pages: 208,
    readingTimeHours: 6,
    shelfLocation: 'Floor 3 · Shelf CL-01',
    shelfId: 'shelf-cl',
    totalCopies: 9,
    availableCopies: 4,
    condition: 'Good',
    conditionNotes: 'Classic 25th anniversary cover, clean interior',
    lastCheckedDate: '2026-09-02',
    publicationYear: 1988,
    publisher: 'HarperOne',
    coverGradient: 'from-amber-950 to-yellow-950',
    coverAccent: '#eab308',
    popularityScore: 95,
    aiSummary: {
      summary: 'An evocative allegorical fable about listening to your heart, recognizing omens, and pursuing your personal legend without fear of failure.',
      keyIdeas: [
        'When you want something, all the universe conspires in helping you to achieve it.',
        'The fear of suffering is far worse than the suffering itself.',
        'No heart has ever suffered when it goes in search of its dreams.'
      ],
      importantConcepts: [
        'The Soul of the World and universal language',
        'Personal Legend and overcoming the four obstacles',
        'Recognizing everyday omens and gratitude'
      ],
      mainTakeaways: [
        'The treasure you seek abroad is often realized through the transformation of the journey itself.',
        'Live in the present moment rather than dwelling on past mistakes.'
      ],
      whyRead: 'A beloved, timeless literary escape that rekindles ambition and creative faith.'
    }
  },
  {
    id: 'b-15',
    isbn: '978-0451524935',
    title: '1984',
    author: 'George Orwell',
    category: 'Classic Literature',
    description: 'The definitive dystopian novel. Winston Smith toes the Party line, rewriting history to satisfy the Ministry of Truth. With every lie he writes, he grows to hate the Party that seeks power for its own sake and persecutes individualism.',
    rating: 4.8,
    reviewsCount: 490,
    pages: 328,
    readingTimeHours: 9,
    shelfLocation: 'Floor 3 · Shelf CL-02',
    shelfId: 'shelf-cl',
    totalCopies: 8,
    availableCopies: 3,
    condition: 'Excellent',
    conditionNotes: 'Centennial edition paperback, uncreased spine',
    lastCheckedDate: '2026-09-13',
    publicationYear: 1949,
    publisher: 'Signet Classic',
    coverGradient: 'from-stone-950 to-slate-900',
    coverAccent: '#ef4444',
    popularityScore: 97,
    aiSummary: {
      summary: 'A chilling depiction of totalitarian surveillance, psychological control, doublethink, and the erasure of historical truth by the Party.',
      keyIdeas: [
        'Who controls the past controls the future: who controls the present controls the past.',
        'War is peace. Freedom is slavery. Ignorance is strength.',
        'The ultimate purpose of Newspeak is to narrow the range of thought.'
      ],
      importantConcepts: [
        'Doublethink and cognitive dissonance enforcement',
        'Thoughtcrime and ideological surveillance (Telescreens)',
        'Linguistic engineering and censorship of free expression'
      ],
      mainTakeaways: [
        'Language and free inquiry are the core ramparts protecting human autonomy from tyranny.',
        'Technological surveillance requires rigorous societal and democratic accountability.'
      ],
      whyRead: 'Ever more pertinent in an era of algorithmic censorship, data profiling, and surveillance capitalism.'
    }
  },
  {
    id: 'b-16',
    isbn: '978-0060935467',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    category: 'Classic Literature',
    description: 'The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it. Compassionate, dramatic, and deeply moving, it explores racial injustice and the destruction of innocence through the eyes of young Scout Finch.',
    rating: 4.8,
    reviewsCount: 410,
    pages: 336,
    readingTimeHours: 9,
    shelfLocation: 'Floor 3 · Shelf CL-03',
    shelfId: 'shelf-cl',
    totalCopies: 6,
    availableCopies: 2,
    condition: 'Good',
    conditionNotes: 'Gently read copy, intact binding',
    lastCheckedDate: '2026-08-30',
    publicationYear: 1960,
    publisher: 'Harper Perennial',
    coverGradient: 'from-amber-950 to-stone-900',
    coverAccent: '#f59e0b',
    popularityScore: 93,
    aiSummary: {
      summary: 'A timeless exploration of moral courage, prejudice, empathy, and justice embodied by lawyer Atticus Finch and observed by his daughter Scout.',
      keyIdeas: [
        'You never really understand a person until you consider things from his point of view — until you climb into his skin and walk around in it.',
        'Real courage is when you know you\'re licked before you begin, but you begin anyway and see it through no matter what.',
        'People generally see what they look for, and hear what they listen for.'
      ],
      importantConcepts: [
        'Empathy as the foundation of civil society',
        'Institutional injustice vs. personal integrity',
        'The symbolism of the harmless mockingbird'
      ],
      mainTakeaways: [
        'Stand for truth and justice even when peer consensus is hostile.',
        'Integrity requires defending the vulnerable without compromise.'
      ],
      whyRead: 'A pillar of English literary education that builds empathy and civic conscience.'
    }
  },
  {
    id: 'b-17',
    isbn: '978-0743273565',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    category: 'Classic Literature',
    description: 'The exemplary novel of the Jazz Age, telling the tragic story of the fabulously wealthy Jay Gatsby and his obsessive love for the beautiful Daisy Buchanan on Long Island.',
    rating: 4.5,
    reviewsCount: 380,
    pages: 180,
    readingTimeHours: 5,
    shelfLocation: 'Floor 3 · Shelf CL-04',
    shelfId: 'shelf-cl',
    totalCopies: 7,
    availableCopies: 3,
    condition: 'Good',
    conditionNotes: 'Classic cover art, minor corner scuff',
    lastCheckedDate: '2026-09-08',
    publicationYear: 1925,
    publisher: 'Scribner',
    coverGradient: 'from-blue-950 to-slate-900',
    coverAccent: '#38bdf8',
    popularityScore: 90,
    aiSummary: {
      summary: 'A critique of the American Dream, reckless excess, disillusionment, and the illusions of memory set in 1920s New York.',
      keyIdeas: [
        'So we beat on, boats against the current, borne back ceaselessly into the past.',
        'Wealth cannot buy genuine connection or erase history.'
      ],
      importantConcepts: [
        'The green light as an emblem of unattainable aspiration',
        'The valley of ashes and spiritual exhaustion',
        'Old wealth versus new money hypocrisy'
      ],
      mainTakeaways: [
        'Obsession with idealizing the past blinds us to the authenticity of the present.',
        'Character outweighs material spectacle.'
      ],
      whyRead: 'Exquisite prose styling and literary mastery in concise format.'
    }
  },
  {
    id: 'b-18',
    isbn: '978-1612680194',
    title: 'Rich Dad Poor Dad: What the Rich Teach Their Kids About Money',
    author: 'Robert T. Kiyosaki',
    category: 'Finance & Business',
    description: 'Advocates the importance of financial literacy, financial independence, and building wealth through investing in assets, real estate, starting and owning businesses, as well as increasing one’s financial intelligence.',
    rating: 4.6,
    reviewsCount: 540,
    pages: 336,
    readingTimeHours: 8,
    shelfLocation: 'Floor 3 · Shelf FB-02',
    shelfId: 'shelf-fb',
    totalCopies: 11,
    availableCopies: 4,
    condition: 'Excellent',
    conditionNotes: '25th Anniversary edition',
    lastCheckedDate: '2026-09-14',
    publicationYear: 1997,
    publisher: 'Plata Publishing',
    coverGradient: 'from-purple-950 to-slate-900',
    coverAccent: '#c084fc',
    popularityScore: 94,
    aiSummary: {
      summary: 'Contrasts the financial mindsets of two father figures to explain cash flow, assets versus liabilities, and escaping the salaried rat race.',
      keyIdeas: [
        'The rich don’t work for money; they have their money work for them.',
        'An asset puts money in your pocket. A liability takes money out of your pocket.',
        'Financial literacy is distinguishing an asset from a liability.'
      ],
      importantConcepts: [
        'Cash flow quadrants (Employee, Self-employed, Business owner, Investor)',
        'Reinvesting profits rather than scaling lifestyle liabilities',
        'Overcoming fear of financial risk'
      ],
      mainTakeaways: [
        'Acquire income-generating assets before consumer luxuries.',
        'Financial education is the single most valuable long-term asset.'
      ],
      whyRead: 'A thought-provoking catalyst for understanding personal cash flow early in college.'
    }
  },
  {
    id: 'b-19',
    isbn: '978-0804139298',
    title: 'Zero to One: Notes on Startups, or How to Build the Future',
    author: 'Peter Thiel with Blake Masters',
    category: 'Finance & Business',
    description: 'The great secret of our time is that there are still uncharted frontiers to explore and new inventions to create. In Zero to One, legendary entrepreneur and investor Peter Thiel shows how we can find singular ways to create those new things.',
    rating: 4.7,
    reviewsCount: 360,
    pages: 224,
    readingTimeHours: 6,
    shelfLocation: 'Floor 3 · Shelf FB-03',
    shelfId: 'shelf-fb',
    totalCopies: 7,
    availableCopies: 2,
    condition: 'Good',
    conditionNotes: 'Clean, highlighted quotes in Chapter 3',
    lastCheckedDate: '2026-09-04',
    publicationYear: 2014,
    publisher: 'Crown Business',
    coverGradient: 'from-blue-950 to-indigo-950',
    coverAccent: '#60a5fa',
    popularityScore: 95,
    aiSummary: {
      summary: 'Argues that true innovation creates vertical progress (0 to 1, technology) rather than horizontal replication (1 to n, globalization).',
      keyIdeas: [
        'Competition is for losers: aim to create a creative monopoly with 10x differentiation.',
        'What important truth do very few people agree with you on?',
        'Definite optimism: plan for a better future rather than expecting random chance to deliver it.'
      ],
      importantConcepts: [
        'Proprietary technology, network effects, economies of scale, branding',
        'The Power Law in venture capital distributions',
        'Sales and distribution matter as much as product engineering'
      ],
      mainTakeaways: [
        'Focus on small, addressable niche markets before attempting expansion.',
        'Secrets still exist in technology waiting to be discovered by bold founders.'
      ],
      whyRead: 'Essential contrarian thinking for engineering students aiming to launch tech startups.'
    }
  },
  {
    id: 'b-20',
    isbn: '978-0307887894',
    title: 'The Lean Startup',
    author: 'Eric Ries',
    category: 'Finance & Business',
    description: 'Most startups fail. But many of those failures are preventable. The Lean Startup is a new approach being adopted across the globe, changing the way companies are built and new products are launched through validated learning and rapid experimentation.',
    rating: 4.6,
    reviewsCount: 310,
    pages: 336,
    readingTimeHours: 9,
    shelfLocation: 'Floor 3 · Shelf FB-04',
    shelfId: 'shelf-fb',
    totalCopies: 6,
    availableCopies: 1,
    condition: 'Needs Attention',
    conditionNotes: 'Spine loose, book tape applied neatly on binding',
    lastCheckedDate: '2026-08-25',
    publicationYear: 2011,
    publisher: 'Crown Business',
    coverGradient: 'from-sky-950 to-teal-950',
    coverAccent: '#0ea5e9',
    popularityScore: 91,
    aiSummary: {
      summary: 'Applies lean manufacturing principles to entrepreneurship, emphasizing rapid Build-Measure-Learn feedback loops and Minimum Viable Products.',
      keyIdeas: [
        'Startups exist to learn how to build a sustainable business, not just write code.',
        'Eliminate waste by testing assumptions with a Minimum Viable Product (MVP).',
        'Pivot or persevere based on actionable metrics rather than vanity metrics.'
      ],
      importantConcepts: [
        'Build-Measure-Learn feedback loop',
        'Validated learning versus speculative business plans',
        'The Five Whys for root-cause operational analysis',
        'Cohort analysis and split A/B testing'
      ],
      mainTakeaways: [
        'Failure is not tragic if it delivers validated empirical learning.',
        'Speed of iteration through customer feedback determines startup survival.'
      ],
      whyRead: 'Framework for turning student semester engineering projects into customer-ready products.'
    }
  },
  {
    id: 'b-21',
    isbn: '978-0062316097',
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    category: 'Science & Physics',
    description: 'One hundred thousand years ago, at least six different species of humans inhabited Earth. Yet today there is only one. Homo sapiens. How did our species succeed in the battle for dominance? An epic journey spanning the Cognitive, Agricultural, and Scientific Revolutions.',
    rating: 4.8,
    reviewsCount: 580,
    pages: 464,
    readingTimeHours: 15,
    shelfLocation: 'Floor 2 · Shelf SC-01',
    shelfId: 'shelf-sc',
    totalCopies: 11,
    availableCopies: 4,
    condition: 'Excellent',
    conditionNotes: 'Illustrated international edition',
    lastCheckedDate: '2026-09-18',
    publicationYear: 2014,
    publisher: 'Harper',
    coverGradient: 'from-yellow-950 to-stone-900',
    coverAccent: '#eab308',
    popularityScore: 98,
    aiSummary: {
      summary: 'A sweeping interdisciplinary history showing that Sapiens rule the world because we are the only animal that can cooperate flexibly in large numbers via shared myths.',
      keyIdeas: [
        'Shared fictions (religions, nations, corporations, money) allow millions of strangers to cooperate.',
        'The Agricultural Revolution was a trap that increased total population at the cost of individual health.',
        'The Scientific Revolution succeeded because humans admitted their ignorance.'
      ],
      importantConcepts: [
        'The Cognitive Revolution and abstract storytelling',
        'Intersubjective reality vs. objective physical reality',
        'The marriage of imperial power, science, and capitalism'
      ],
      mainTakeaways: [
        'Human civilization is constructed from collective myths that can be renegotiated.',
        'Happiness does not linearly correlate with technological power.'
      ],
      whyRead: 'Expands intellectual horizons and connects technology to the deep arc of human history.'
    }
  },
  {
    id: 'b-22',
    isbn: '978-0553380163',
    title: 'A Brief History of Time',
    author: 'Stephen Hawking',
    category: 'Science & Physics',
    description: 'A landmark volume in science writing by one of the great minds of our time. Stephen Hawking explores profound questions: How did the universe begin? Can time run backward? Is the universe limitless? Covers black holes, quantum mechanics, and the search for a unified theory.',
    rating: 4.7,
    reviewsCount: 410,
    pages: 256,
    readingTimeHours: 8,
    shelfLocation: 'Floor 2 · Shelf SC-02',
    shelfId: 'shelf-sc',
    totalCopies: 8,
    availableCopies: 3,
    condition: 'Good',
    conditionNotes: 'Includes clear astronomical diagrams, clean pages',
    lastCheckedDate: '2026-09-09',
    publicationYear: 1988,
    publisher: 'Bantam Books',
    coverGradient: 'from-indigo-950 to-slate-950',
    coverAccent: '#818cf8',
    popularityScore: 94,
    aiSummary: {
      summary: 'Hawking introduces cosmology, spacetime curvature, the Big Bang, thermodynamics, and black hole radiation without heavy mathematical jargon.',
      keyIdeas: [
        'The universe has no boundary in imaginary time, meaning it is completely self-contained.',
        'General relativity and quantum mechanics must be reconciled into a quantum theory of gravity.',
        'Black holes are not completely black; they emit Hawking radiation due to quantum particle-antiparticle pairs.'
      ],
      importantConcepts: [
        'The arrow of time (thermodynamic, psychological, cosmological)',
        'Event horizons and gravitational singularity',
        'String theory and extra spacetime dimensions'
      ],
      mainTakeaways: [
        'Human inquiry can comprehend cosmic laws spanning billions of light years.',
        'Time itself is a physical dimension interwoven with space and gravity.'
      ],
      whyRead: 'Inspires deep wonder and reverence for theoretical physics and the cosmos.'
    }
  },
  {
    id: 'b-23',
    isbn: '978-0198788607',
    title: 'The Selfish Gene',
    author: 'Richard Dawkins',
    category: 'Science & Physics',
    description: 'Dawkins articulates a gene\'s eye view of evolution. A monumental work that transformed evolutionary biology and coined the term "meme" to describe the cultural transmission of ideas across human networks.',
    rating: 4.6,
    reviewsCount: 290,
    pages: 360,
    readingTimeHours: 11,
    shelfLocation: 'Floor 2 · Shelf SC-03',
    shelfId: 'shelf-sc',
    totalCopies: 6,
    availableCopies: 2,
    condition: 'Good',
    conditionNotes: '40th Anniversary edition, crisp paper',
    lastCheckedDate: '2026-09-03',
    publicationYear: 1976,
    publisher: 'Oxford University Press',
    coverGradient: 'from-emerald-950 to-slate-950',
    coverAccent: '#34d399',
    popularityScore: 89,
    aiSummary: {
      summary: 'Argues that the fundamental unit of natural selection is not the species or the organism, but the replicating gene, with organisms serving as survival machines.',
      keyIdeas: [
        'Organisms are survival machines programmed to propagate their genes into future generations.',
        'Altruistic behavior can be explained through kin selection and reciprocal game theory.',
        'Memes replicate through culture in an analogous manner to biological genes.'
      ],
      importantConcepts: [
        'Evolutionarily Stable Strategies (ESS)',
        'Kin selection and Hamilton’s Rule',
        'Tit-for-Tat cooperation in the Iterated Prisoner\'s Dilemma',
        'The Extended Phenotype'
      ],
      mainTakeaways: [
        'Cooperation and social altruism are mathematically stable evolutionary adaptations.',
        'Culture and ideas evolve through variation, selection, and replication.'
      ],
      whyRead: 'A masterclass in analytical modeling, biological game theory, and logical clarity.'
    }
  },
  {
    id: 'b-24',
    isbn: '978-1285740621',
    title: 'Calculus: Early Transcendentals',
    author: 'James Stewart',
    category: 'Mathematics',
    description: 'The standard collegiate calculus textbook praised for mathematical precision, accuracy, and outstanding examples. Covers limits, derivatives, integrals, infinite series, vectors, and multivariable calculus.',
    rating: 4.8,
    reviewsCount: 340,
    pages: 1368,
    readingTimeHours: 50,
    shelfLocation: 'Floor 1 · Shelf MT-01',
    shelfId: 'shelf-mt',
    totalCopies: 12,
    availableCopies: 5,
    condition: 'Excellent',
    conditionNotes: '8th Edition hardcover; comprehensive solution references',
    lastCheckedDate: '2026-09-15',
    publicationYear: 2015,
    publisher: 'Cengage Learning',
    coverGradient: 'from-blue-950 to-indigo-950',
    coverAccent: '#3b82f6',
    popularityScore: 96,
    aiSummary: {
      summary: 'Comprehensive, pedagogical foundation covering single and multivariable differential and integral calculus with geometric and physical applications.',
      keyIdeas: [
        'Limits resolve indeterminate rates of change and infinite sums into rigorous finite numbers.',
        'The Fundamental Theorem of Calculus establishes integration as the exact inverse of differentiation.',
        'Multivariable gradients and Hessians form the core optimization calculus behind neural network loss functions.'
      ],
      importantConcepts: [
        'Epsilon-Delta definitions & Mean Value Theorem',
        'Taylor series expansions and radius of convergence',
        'Green’s, Stokes’, and Divergence theorems in vector fields'
      ],
      mainTakeaways: [
        'Calculus is the mathematical language of change across physics and engineering.',
        'Rigorous problem solving develops analytical stamina required for algorithmic proofs.'
      ],
      whyRead: 'The indispensable mathematical bedrock for engineering mathematics and machine learning backprop.'
    }
  },
  {
    id: 'b-25',
    isbn: '978-0073383095',
    title: 'Discrete Mathematics and Its Applications',
    author: 'Kenneth H. Rosen',
    category: 'Mathematics',
    description: 'The definitive text for computer science students worldwide. Bridges propositional logic, set theory, induction, combinatorics, discrete probability, relations, graph theory, trees, and Boolean algebra.',
    rating: 4.7,
    reviewsCount: 310,
    pages: 1072,
    readingTimeHours: 40,
    shelfLocation: 'Floor 1 · Shelf MT-02',
    shelfId: 'shelf-mt',
    totalCopies: 10,
    availableCopies: 4,
    condition: 'Good',
    conditionNotes: '8th Global Edition; intact binding',
    lastCheckedDate: '2026-09-12',
    publicationYear: 2018,
    publisher: 'McGraw-Hill Education',
    coverGradient: 'from-slate-900 to-indigo-950',
    coverAccent: '#6366f1',
    popularityScore: 97,
    aiSummary: {
      summary: 'The primary mathematical foundation for computer science, teaching formal proof techniques, logic gates, combinatorics, and graph algorithms.',
      keyIdeas: [
        'Mathematical induction and recurrence relations mirror recursive algorithms.',
        'Relational calculus is the theoretical underpinning of relational database query languages.',
        'Graph theory provides the abstractions for computer networks, routing, and dependency graphs.'
      ],
      importantConcepts: [
        'Propositional and Predicate Logic & Proof by Contradiction',
        'Pigeonhole Principle and Generating Functions',
        'Equivalence relations, Partial orders, and Hasse diagrams',
        'Eulerian and Hamiltonian graph traversals'
      ],
      mainTakeaways: [
        'Discrete mathematics provides the formal proof techniques necessary to verify software invariants.',
        'Understanding relations and sets directly enables mastering SQL join semantics.'
      ],
      whyRead: 'Direct foundational companion for Data Structures, Formal Languages, and DBMS relational algebra.'
    }
  },
  {
    id: 'b-26',
    isbn: '978-0198099307',
    title: 'Data Structures and Algorithms in C',
    author: 'Reema Thareja',
    category: 'Computer Science',
    description: 'A student-friendly textbook designed according to Indian engineering university syllabi. Covers arrays, linked lists, stacks, queues, binary trees, AVL trees, graphs, sorting, hashing, and dynamic memory allocation with clean C programs.',
    rating: 4.6,
    reviewsCount: 280,
    pages: 560,
    readingTimeHours: 20,
    shelfLocation: 'Floor 1 · Shelf CS-06',
    shelfId: 'shelf-cs',
    totalCopies: 14,
    availableCopies: 6,
    condition: 'Excellent',
    conditionNotes: 'Second Edition, clean textbook',
    lastCheckedDate: '2026-09-16',
    publicationYear: 2014,
    publisher: 'Oxford University Press India',
    coverGradient: 'from-cyan-950 to-blue-950',
    coverAccent: '#06b6d4',
    popularityScore: 95,
    aiSummary: {
      summary: 'A structured, accessible walkthrough of elementary and advanced data structures implemented in ANSI C, with step-by-step memory pointer diagrams.',
      keyIdeas: [
        'Data structure selection determines runtime execution efficiency and memory footprints.',
        'Pointers provide direct access to hardware memory addresses in C.',
        'Recursive divide-and-conquer simplifies tree traversals and sorting algorithms.'
      ],
      importantConcepts: [
        'Single, Doubly, and Circular Linked Lists',
        'Infix to Postfix conversion using Stacks',
        'AVL Tree rotations and balance factors',
        'Open addressing and chaining in Hash Tables'
      ],
      mainTakeaways: [
        'Manual memory management via malloc and free requires vigilance against memory leaks.',
        'Mastering tree balancing and graph traversals is essential for technical interviews.'
      ],
      whyRead: 'Specifically aligned with college semester examinations and university lab practicals.'
    }
  },
  {
    id: 'b-27',
    isbn: '978-9388511391',
    title: 'Let Us C',
    author: 'Yashavant Kanetkar',
    category: 'Computer Science',
    description: 'The legendary book that introduced C programming to generations of Indian engineering students. Known for lucid explanations, real-world analogies, and challenging exercises that build logical problem-solving skills.',
    rating: 4.5,
    reviewsCount: 420,
    pages: 512,
    readingTimeHours: 16,
    shelfLocation: 'Floor 1 · Shelf CS-07',
    shelfId: 'shelf-cs',
    totalCopies: 18,
    availableCopies: 8,
    condition: 'Good',
    conditionNotes: '19th Edition, light wear on cover corner',
    lastCheckedDate: '2026-09-11',
    publicationYear: 2020,
    publisher: 'BPB Publications',
    coverGradient: 'from-amber-950 to-red-950',
    coverAccent: '#ef4444',
    popularityScore: 96,
    aiSummary: {
      summary: 'The iconic introductory text demystifying C programming fundamentals, pointer mechanics, preprocessor directives, and file operations through straightforward examples.',
      keyIdeas: [
        'Programming is an art of breaking complex challenges into sequential logical steps.',
        'Pointers are not scary when visualized as memory locker addresses.',
        'Functions promote modular reusability and maintainability.'
      ],
      importantConcepts: [
        'Control instructions (loops, decision making)',
        'Pointer arithmetic & Call by Reference',
        'Structures, Unions, and Bit Fields',
        'Low-level file input/output handling'
      ],
      mainTakeaways: [
        'C forces the programmer to think at the machine architecture level.',
        'Solid C fundamentals make learning C++, Java, and Rust intuitive.'
      ],
      whyRead: 'A beloved Indian engineering rite of passage that builds foundational logic from first semester.'
    }
  },
  {
    id: 'b-28',
    isbn: '978-0596009205',
    title: 'Head First Java',
    author: 'Kathy Sierra & Bert Bates',
    category: 'Software Engineering',
    description: 'A brain-friendly guide that uses visual puzzles, engaging dialogues, and humor to teach object-oriented programming in Java. Covers inheritance, polymorphism, abstract classes, collections, generics, threads, and GUI programming.',
    rating: 4.7,
    reviewsCount: 330,
    pages: 720,
    readingTimeHours: 24,
    shelfLocation: 'Floor 2 · Shelf SE-03',
    shelfId: 'shelf-se',
    totalCopies: 8,
    availableCopies: 3,
    condition: 'Good',
    conditionNotes: 'Third Edition, clean inside',
    lastCheckedDate: '2026-09-07',
    publicationYear: 2022,
    publisher: 'O’Reilly Media',
    coverGradient: 'from-orange-950 to-slate-900',
    coverAccent: '#f97316',
    popularityScore: 92,
    aiSummary: {
      summary: 'A multi-sensory cognitive learning approach to object-oriented Java programming, making tricky concepts like garbage collection and multithreading sticky.',
      keyIdeas: [
        'Objects hold state (instance variables) and behavior (methods).',
        'Polymorphism lets you write code that doesn’t have to change when new subclasses are added.',
        'Exceptions are first-class objects enabling graceful failure management.'
      ],
      importantConcepts: [
        'Heap versus Stack memory allocation',
        'Interface implementation vs. Abstract classes',
        'Java Collections Framework (ArrayList, HashMap, TreeSet)',
        'Synchronized thread safety and lock monitors'
      ],
      mainTakeaways: [
        'Design interfaces to program to an abstraction, not a concrete implementation.',
        'The JVM sandbox provides automatic memory garbage collection and platform portability.'
      ],
      whyRead: 'The most fun, zero-intimidation way to master Java for semester projects and enterprise backends.'
    }
  },
  {
    id: 'b-29',
    isbn: '978-1449373320',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    category: 'Computer Science',
    description: 'The modern masterpiece on distributed systems and data engineering. Delves deep into data models, query languages, storage engines, serialization formats, replication, partitioning, transactions, consensus, and stream processing.',
    rating: 4.9,
    reviewsCount: 460,
    pages: 616,
    readingTimeHours: 26,
    shelfLocation: 'Floor 1 · Shelf CS-08',
    shelfId: 'shelf-cs',
    totalCopies: 10,
    availableCopies: 2,
    condition: 'Excellent',
    conditionNotes: 'Pristine copy, high-demand book',
    lastCheckedDate: '2026-09-17',
    publicationYear: 2017,
    publisher: 'O’Reilly Media',
    coverGradient: 'from-blue-950 to-slate-950',
    coverAccent: '#3b82f6',
    popularityScore: 100,
    aiSummary: {
      summary: 'The ultimate guide to the principles and trade-offs of modern distributed databases, stream processors, and fault-tolerant system architecture.',
      keyIdeas: [
        'Reliability, Scalability, and Maintainability are the three golden pillars of data systems.',
        'There are no magic solutions in distributed systems, only trade-offs (CAP theorem, PACELC).',
        'Log-structured storage (LSM-trees) excels at high write workloads; B-trees excel at fast random reads.'
      ],
      importantConcepts: [
        'Single-leader, multi-leader, and leaderless replication (Dynamo)',
        'SSTables, LSM-Trees, and Bloom filters',
        'Isolation levels: Read Committed, Snapshot Isolation, Serializable',
        'Raft / Paxos consensus and atomic broadcast'
      ],
      mainTakeaways: [
        'Network partitions and clock skews are inevitable in distributed clusters; design for failure.',
        'Event sourcing and stream processing provide reproducible, audit-proof data architectures.'
      ],
      whyRead: 'Essential for students aspiring to crack senior systems architecture and backend engineering roles.'
    }
  },
  {
    id: 'b-30',
    isbn: '978-1585424337',
    title: 'Think and Grow Rich',
    author: 'Napoleon Hill',
    category: 'Self-Improvement',
    description: 'Published in 1937, this foundational philosophy of individual achievement synthesized 20 years of research studying more than 500 successful individuals including Andrew Carnegie, Thomas Edison, and Henry Ford.',
    rating: 4.6,
    reviewsCount: 410,
    pages: 320,
    readingTimeHours: 9,
    shelfLocation: 'Floor 3 · Shelf SI-03',
    shelfId: 'shelf-si',
    totalCopies: 8,
    availableCopies: 3,
    condition: 'Good',
    conditionNotes: 'Classic edition, clean pages',
    lastCheckedDate: '2026-09-08',
    publicationYear: 1937,
    publisher: 'The Ralston Society',
    coverGradient: 'from-amber-950 to-stone-900',
    coverAccent: '#d97706',
    popularityScore: 92,
    aiSummary: {
      summary: 'Outlines the 13 steps toward riches and personal achievement based on burning desire, faith, specialized knowledge, and organized planning.',
      keyIdeas: [
        'Whatever the mind can conceive and believe, it can achieve.',
        'Desire is the starting point of all achievement, not a hope, not a wish, but a keen pulsating desire.',
        'Temporary defeat is not failure; it is only a message that your plan was not sound.'
      ],
      importantConcepts: [
        'The Master Mind alliance principle',
        'Transmutation of thought energy into definite goals',
        'Persistent execution across obstacles'
      ],
      mainTakeaways: [
        'Clarity of purpose with definite deadlines overcomes subconscious hesitation.',
        'Surround yourself with a dedicated peer group that shares high aspirations.'
      ],
      whyRead: 'Timeless motivational classic on mindset, focus, and deliberate long-term ambition.'
    }
  }
];

export const INITIAL_USER: User = {
  id: 'usr-sarthak',
  name: 'Sarthak Gujar',
  studentId: 'SIT-2024-CS-089',
  email: 'sarthakgujar63@gmail.com',
  department: 'Computer Science & Engineering',
  year: '3rd Year · Semester VI',
  readingStreak: 7,
  booksCompleted: 12,
  booksBorrowed: 4,
  pendingReturns: 2,
  totalReadingHours: 84,
  longestStreak: 18,
  favoriteGenre: 'Computer Science',
  preferences: {
    genres: ['Computer Science', 'Software Engineering', 'Artificial Intelligence', 'Self-Improvement'],
    dailyGoalMinutes: 45,
    preferredTime: 'Evening'
  }
};

export const INITIAL_BORROW_RECORDS: BorrowRecord[] = [
  {
    id: 'br-1',
    bookId: 'b-4',
    bookTitle: 'Database System Concepts',
    author: 'Abraham Silberschatz, Henry F. Korth',
    category: 'Computer Science',
    coverGradient: 'from-emerald-950 via-teal-900 to-emerald-900',
    borrowDate: '2026-09-10',
    dueDate: '2026-09-24',
    status: 'Currently Reading',
    progressPercent: 68,
    pagesRead: 935,
    totalPages: 1376
  },
  {
    id: 'br-2',
    bookId: 'b-1',
    bookTitle: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    category: 'Software Engineering',
    coverGradient: 'from-violet-950 via-purple-900 to-amber-950',
    borrowDate: '2026-09-12',
    dueDate: '2026-09-26',
    status: 'Currently Reading',
    progressPercent: 45,
    pagesRead: 208,
    totalPages: 464
  },
  {
    id: 'br-3',
    bookId: 'b-29',
    bookTitle: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    category: 'Computer Science',
    coverGradient: 'from-blue-950 to-slate-950',
    borrowDate: '2026-09-08',
    dueDate: '2026-09-22',
    status: 'Borrowed',
    progressPercent: 30,
    pagesRead: 184,
    totalPages: 616
  },
  {
    id: 'br-4',
    bookId: 'b-11',
    bookTitle: 'Atomic Habits',
    author: 'James Clear',
    category: 'Self-Improvement',
    coverGradient: 'from-amber-950 to-orange-950',
    borrowDate: '2026-09-14',
    dueDate: '2026-09-28',
    status: 'Borrowed',
    progressPercent: 82,
    pagesRead: 262,
    totalPages: 320
  },
  {
    id: 'br-5',
    bookId: 'b-2',
    bookTitle: 'The Pragmatic Programmer',
    author: 'David Thomas & Andrew Hunt',
    category: 'Software Engineering',
    coverGradient: 'from-slate-900 to-blue-950',
    borrowDate: '2026-08-15',
    dueDate: '2026-08-29',
    status: 'Completed',
    progressPercent: 100,
    pagesRead: 352,
    totalPages: 352,
    rating: 5
  },
  {
    id: 'br-6',
    bookId: 'b-12',
    bookTitle: 'The Psychology of Money',
    author: 'Morgan Housel',
    category: 'Finance & Business',
    coverGradient: 'from-emerald-950 to-teal-950',
    borrowDate: '2026-08-01',
    dueDate: '2026-08-15',
    status: 'Completed',
    progressPercent: 100,
    pagesRead: 256,
    totalPages: 256,
    rating: 5
  }
];

export const INITIAL_SEAT_RESERVATIONS: SeatReservation[] = [
  {
    id: 'res-1',
    seatNumber: 'A-14',
    floor: 2,
    section: 'Tech & Digital Research Carrels',
    date: '2026-09-24',
    timeSlot: '04:00 PM - 06:00 PM',
    status: 'Confirmed',
    createdAt: '2026-09-23 10:30 AM'
  },
  {
    id: 'res-2',
    seatNumber: 'B-08',
    floor: 1,
    section: 'Silent Individual Study Zone',
    date: '2026-09-22',
    timeSlot: '10:00 AM - 01:00 PM',
    status: 'Completed',
    createdAt: '2026-09-21 04:15 PM'
  }
];

export const INITIAL_EXCHANGE_ITEMS: BookExchangeItem[] = [
  {
    id: 'ex-1',
    title: 'Operating System Concepts (9th Ed)',
    author: 'Silberschatz & Galvin',
    ownerName: 'Priya Sharma',
    ownerId: 'SIT-2024-IT-045',
    department: 'Information Technology',
    year: '3rd Year',
    category: 'Computer Science',
    condition: 'Good',
    description: 'Clean textbook with highlighted notes in chapters 4 & 5. Willing to exchange for Computer Networks (Tanenbaum) or Algorithms.',
    status: 'Available',
    postedDate: '2026-09-21'
  },
  {
    id: 'ex-2',
    title: 'Deep Learning with Python',
    author: 'François Chollet',
    ownerName: 'Rohan Deshmukh',
    ownerId: 'SIT-2023-CS-112',
    department: 'Computer Science & Engineering',
    year: '4th Year',
    category: 'Artificial Intelligence',
    condition: 'Excellent',
    description: 'First edition in mint condition. Seeking Clean Code or System Design books for placement prep.',
    status: 'Available',
    postedDate: '2026-09-20'
  },
  {
    id: 'ex-3',
    title: 'Microprocessor Architecture & 8085',
    author: 'Ramesh Gaonkar',
    ownerName: 'Ananya Verma',
    ownerId: 'SIT-2025-EC-029',
    department: 'Electronics & Communication',
    year: '2nd Year',
    category: 'Computer Science',
    condition: 'Good',
    description: 'Covers whole Semester IV hardware lab syllabus with handwritten opcode sheet included.',
    status: 'Available',
    postedDate: '2026-09-19'
  }
];

export const INITIAL_COMPANIONS: ReadingCompanion[] = [
  {
    id: 'comp-1',
    name: 'Aarav Patel',
    department: 'Computer Science & Engineering',
    year: '3rd Year',
    avatarBg: 'bg-blue-800',
    avatarInitials: 'AP',
    favoriteGenre: 'Computer Science',
    readingGoal: 'Master Distributed Systems & DBMS internals for gate',
    preferredReadingTime: '4:00 PM - 7:00 PM',
    readingLevel: 'Advanced',
    compatibility: 94,
    currentlyReading: 'Designing Data-Intensive Applications',
    bio: 'Passionate about backend architectures, Kafka pipelines, and database query planning.',
    connectionStatus: 'none'
  },
  {
    id: 'comp-2',
    name: 'Neha Kulkarni',
    department: 'Artificial Intelligence & Data Science',
    year: '3rd Year',
    avatarBg: 'bg-indigo-800',
    avatarInitials: 'NK',
    favoriteGenre: 'Artificial Intelligence',
    readingGoal: 'Finish 2 research books per month and implement CNNs from scratch',
    preferredReadingTime: '6:00 PM - 9:00 PM',
    readingLevel: 'Intermediate',
    compatibility: 89,
    currentlyReading: 'Hands-On Machine Learning',
    bio: 'Working on computer vision research in SIT AI lab. Looking for co-study partner for deep learning.',
    connectionStatus: 'none'
  },
  {
    id: 'comp-3',
    name: 'Vikramaditya Rao',
    department: 'Information Technology',
    year: '2nd Year',
    avatarBg: 'bg-teal-800',
    avatarInitials: 'VR',
    favoriteGenre: 'Software Engineering',
    readingGoal: 'Daily 45 minutes coding literature & clean design patterns',
    preferredReadingTime: '10:00 AM - 1:00 PM',
    readingLevel: 'Intermediate',
    compatibility: 85,
    currentlyReading: 'Clean Code',
    bio: 'Competitive programmer and full-stack developer. Striving for solid software architecture discipline.',
    connectionStatus: 'none'
  },
  {
    id: 'comp-4',
    name: 'Tanvi Iyer',
    department: 'Computer Science & Engineering',
    year: '3rd Year',
    avatarBg: 'bg-amber-800',
    avatarInitials: 'TI',
    favoriteGenre: 'Self-Improvement',
    readingGoal: 'Build high-focus morning reading habits before lectures',
    preferredReadingTime: '8:00 AM - 10:00 AM',
    readingLevel: 'Advanced',
    compatibility: 82,
    currentlyReading: 'Atomic Habits',
    bio: 'Combining behavioral psychology with algorithmic problem solving.',
    connectionStatus: 'none'
  }
];

export const INITIAL_SHELVES: ShelfInfo[] = [
  {
    id: 'shelf-cs',
    code: 'CS-01',
    name: 'Computer Science & Core Systems',
    category: 'Computer Science',
    floor: 1,
    section: 'North Wing, Stacks 100-140',
    totalBooks: 184,
    availableBooks: 72,
    qrPayload: 'SIT-LIB-FL1-CS01-SYS',
    description: 'Algorithms, Database Systems, Operating Systems, Computer Networks, and Architecture.'
  },
  {
    id: 'shelf-ai',
    code: 'AI-01',
    name: 'Artificial Intelligence & Machine Learning',
    category: 'Artificial Intelligence',
    floor: 2,
    section: 'East Research Atrium, Stacks 200-230',
    totalBooks: 126,
    availableBooks: 48,
    qrPayload: 'SIT-LIB-FL2-AI01-RES',
    description: 'Neural Networks, Deep Learning, Computer Vision, Natural Language Processing, and Robotics.'
  },
  {
    id: 'shelf-se',
    code: 'SE-01',
    name: 'Software Engineering & Clean Architecture',
    category: 'Software Engineering',
    floor: 2,
    section: 'Tech Stacks 240-260',
    totalBooks: 98,
    availableBooks: 39,
    qrPayload: 'SIT-LIB-FL2-SE01-PAT',
    description: 'Agile methodologies, Refactoring, Design Patterns, DevOps, and Testing.'
  },
  {
    id: 'shelf-mt',
    code: 'MT-01',
    name: 'Mathematics & Computational Sciences',
    category: 'Mathematics',
    floor: 1,
    section: 'South Stacks 150-180',
    totalBooks: 142,
    availableBooks: 65,
    qrPayload: 'SIT-LIB-FL1-MT01-CAL',
    description: 'Calculus, Discrete Mathematics, Linear Algebra, Probability, and Numerical Analysis.'
  },
  {
    id: 'shelf-fb',
    code: 'FB-01',
    name: 'Business, Economics & Entrepreneurship',
    category: 'Finance & Business',
    floor: 3,
    section: 'West Mezzanine, Stacks 300-330',
    totalBooks: 110,
    availableBooks: 52,
    qrPayload: 'SIT-LIB-FL3-FB01-BUS',
    description: 'Personal Finance, Startup Strategy, Economics, Venture Capital, and Operations.'
  },
  {
    id: 'shelf-cl',
    code: 'CL-01',
    name: 'Classic Literature & Humanities',
    category: 'Classic Literature',
    floor: 3,
    section: 'Humanities Corner, Stacks 340-380',
    totalBooks: 215,
    availableBooks: 98,
    qrPayload: 'SIT-LIB-FL3-CL01-LIT',
    description: 'World literature, philosophy, dystopias, drama, and historical essays.'
  },
  {
    id: 'shelf-sc',
    code: 'SC-01',
    name: 'Science & Theoretical Physics',
    category: 'Science & Physics',
    floor: 2,
    section: 'Science Stacks 270-290',
    totalBooks: 88,
    availableBooks: 41,
    qrPayload: 'SIT-LIB-FL2-SC01-SCI',
    description: 'Astrophysics, Quantum Mechanics, Evolutionary Biology, and History of Science.'
  },
  {
    id: 'shelf-si',
    code: 'SI-01',
    name: 'Self-Improvement & Cognitive Psychology',
    category: 'Self-Improvement',
    floor: 3,
    section: 'Quiet Lounge Stacks 390-410',
    totalBooks: 104,
    availableBooks: 46,
    qrPayload: 'SIT-LIB-FL3-SI01-DEV',
    description: 'Habit formation, Focus, Mindfulness, Time Management, and Leadership.'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Upcoming Book Return Due',
    message: 'Database System Concepts (Silberschatz) is due in 24 hours. Please return or renew via portal.',
    type: 'due',
    timestamp: '20 minutes ago',
    read: false,
    linkPage: 'my-books'
  },
  {
    id: 'notif-2',
    title: 'Seat Reservation Confirmed',
    message: 'Your seat A-14 on Floor 2 (Tech & Digital Hub) is confirmed for tomorrow 4:00 PM - 6:00 PM.',
    type: 'seat',
    timestamp: '2 hours ago',
    read: false,
    linkPage: 'seat-reservation'
  },
  {
    id: 'notif-3',
    title: 'Reading Streak Milestone',
    message: 'Outstanding discipline! Your reading streak has officially reached 7 consecutive days 🔥',
    type: 'streak',
    timestamp: '5 hours ago',
    read: false,
    linkPage: 'reading-streak'
  },
  {
    id: 'notif-4',
    title: 'Recommended Book Available',
    message: 'Hands-On Machine Learning (Aurélien Géron) matching your AI interests has copies available on Shelf AI-02.',
    type: 'recommendation',
    timestamp: '1 day ago',
    read: true,
    linkPage: 'browse-books'
  },
  {
    id: 'notif-5',
    title: 'Book Exchange Match',
    message: 'Priya Sharma from IT department listed Operating System Concepts in the student exchange corner.',
    type: 'exchange',
    timestamp: '2 days ago',
    read: true,
    linkPage: 'book-exchange'
  }
];

export const INITIAL_ACTIVITIES: ActivityTimelineItem[] = [
  {
    id: 'act-1',
    title: 'Seat Reserved',
    description: 'Reserved Seat A-14 on Floor 2 for Sep 24, 04:00 PM',
    timestamp: 'Today, 10:30 AM',
    type: 'seat'
  },
  {
    id: 'act-2',
    title: 'Reading Progress Updated',
    description: 'Completed Chapter 14 of Database System Concepts (68%)',
    timestamp: 'Yesterday, 08:45 PM',
    type: 'review'
  },
  {
    id: 'act-3',
    title: 'Reading Streak Maintained',
    description: 'Achieved Day 7 of your active daily reading streak',
    timestamp: 'Yesterday, 09:30 PM',
    type: 'streak'
  },
  {
    id: 'act-4',
    title: 'Book Borrowed',
    description: 'Borrowed Atomic Habits from Central Digital Library',
    timestamp: 'Sep 14, 2026',
    type: 'borrow'
  },
  {
    id: 'act-5',
    title: 'Book Returned',
    description: 'Returned The Pragmatic Programmer on time in Good condition',
    timestamp: 'Aug 29, 2026',
    type: 'return'
  }
];

export const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "When you open a book during an open afternoon, what draws your focus first?",
    options: [
      { text: "Architectural blueprints, mathematical proofs, and system logic", personality: "The Thinker" },
      { text: "Uncharted worlds, deep historical sagas, and mysterious horizons", personality: "The Explorer" },
      { text: "Strategic leverage, competitive advantage, and building scalable ventures", personality: "The Strategist" },
      { text: "Poetic imagery, human empathy, philosophical quests, and deep prose", personality: "The Dreamer" },
      { text: "High-stakes leadership, organizational culture, and historical biographies", personality: "The Leader" }
    ]
  },
  {
    id: 2,
    question: "What is your primary intellectual motivation for studying?",
    options: [
      { text: "Deconstructing how complex systems function from first principles", personality: "The Thinker" },
      { text: "Discovering fresh paradigms that alter how I interpret civilization", personality: "The Explorer" },
      { text: "Optimizing my time, habits, and financial compounding systems", personality: "The Strategist" },
      { text: "Experiencing emotional resonance and understanding the human psyche", personality: "The Dreamer" },
      { text: "Equipping myself with command presence to lead engineering teams", personality: "The Leader" }
    ]
  },
  {
    id: 3,
    question: "How do you prefer to spend 2 hours of quiet unstructured time?",
    options: [
      { text: "Tinkering with an algorithm, coding challenge, or terminal setup", personality: "The Thinker" },
      { text: "Browsing diverse bookshelves and picking whatever sparks curiosity", personality: "The Explorer" },
      { text: "Reviewing weekly progress, refining personal OKRs and budgets", personality: "The Strategist" },
      { text: "Sitting with tea or coffee in a quiet corner with a classic novel", personality: "The Dreamer" },
      { text: "Debating ideas with ambitious peers or listening to masterclass lectures", personality: "The Leader" }
    ]
  },
  {
    id: 4,
    question: "Which quote resonates most strongly with your personal philosophy?",
    options: [
      { text: "\"Code never lies; comments sometimes do.\" — First principles clarity", personality: "The Thinker" },
      { text: "\"Somewhere, something incredible is waiting to be known.\" — Discovery", personality: "The Explorer" },
      { text: "\"You fall to the level of your systems.\" — Operational leverage", personality: "The Strategist" },
      { text: "\"When you want something, all the universe conspires in helping you.\" — Faith", personality: "The Dreamer" },
      { text: "\"A leader is a dealer in hope and coordinated vision.\" — Command", personality: "The Leader" }
    ]
  },
  {
    id: 5,
    question: "What kind of project would you most eagerly lead in college?",
    options: [
      { text: "A custom distributed database engine or low-latency compiler", personality: "The Thinker" },
      { text: "A multidisciplinary research paper synthesizing AI and biology", personality: "The Explorer" },
      { text: "A high-growth student SaaS startup with real paying users", personality: "The Strategist" },
      { text: "A campus literary journal or community storytelling festival", personality: "The Dreamer" },
      { text: "The college technical symposium or robotics team delegation", personality: "The Leader" }
    ]
  }
];

export const PERSONALITY_RESULTS: Record<string, {
  title: string;
  badge: string;
  description: string;
  strengths: string[];
  recommendedBookIds: string[];
}> = {
  "The Thinker": {
    title: "The Analytical Thinker",
    badge: "🧠 The Thinker",
    description: "You thrive on intellectual rigor, logic, and dissecting complex problems down to their fundamental elements. You read not merely to pass exams, but to master how the world and its systems are engineered.",
    strengths: ["First-principles deduction", "Algorithmic clarity", "Technical endurance"],
    recommendedBookIds: ['b-3', 'b-4', 'b-29', 'b-7']
  },
  "The Explorer": {
    title: "The Visionary Explorer",
    badge: "🧭 The Explorer",
    description: "You possess an unquenchable curiosity about the universe, human origins, and emerging frontiers. You connect disparate domains and find unexpected synergies across disciplines.",
    strengths: ["Cross-disciplinary intuition", "Openness to novel ideas", "Deep curiosity"],
    recommendedBookIds: ['b-21', 'b-22', 'b-23', 'b-8']
  },
  "The Strategist": {
    title: "The Pragmatic Strategist",
    badge: "♟️ The Strategist",
    description: "You believe that intentional systems triumph over raw willpower. You gravitate toward actionable knowledge, financial intelligence, scalable architectures, and disciplined habits.",
    strengths: ["Systems design", "Compounding habit discipline", "Strategic patience"],
    recommendedBookIds: ['b-11', 'b-12', 'b-19', 'b-20']
  },
  "The Dreamer": {
    title: "The Empathetic Dreamer",
    badge: "🌙 The Dreamer",
    description: "You read to understand the depths of human soul, philosophical quests, and moral courage. You appreciate aesthetic prose, metaphor, and emotional authenticity.",
    strengths: ["Emotional intelligence", "Creative perspective", "Ethical discernment"],
    recommendedBookIds: ['b-14', 'b-15', 'b-16', 'b-13']
  },
  "The Leader": {
    title: "The Inspiring Leader",
    badge: "👑 The Leader",
    description: "You look at books as blueprints for building high-performing teams, executing grand visions, and creating enduring impact in technology and society.",
    strengths: ["Visionary communication", "Organizational execution", "Inspirational resolve"],
    recommendedBookIds: ['b-30', 'b-19', 'b-2', 'b-1']
  }
};

export const INITIAL_SEARCH_HISTORY = [
  {
    id: 'sh-1',
    query: 'Distributed Systems',
    timestamp: '15 mins ago',
    category: 'Computer Science',
    resultsCount: 6
  },
  {
    id: 'sh-2',
    query: 'Clean Code',
    timestamp: '2 hours ago',
    category: 'Software Engineering',
    resultsCount: 4
  },
  {
    id: 'sh-3',
    query: 'Database Normalization',
    timestamp: 'Yesterday',
    category: 'Computer Science',
    resultsCount: 5
  },
  {
    id: 'sh-4',
    query: 'Artificial Intelligence Agents',
    timestamp: '2 days ago',
    category: 'Artificial Intelligence',
    resultsCount: 8
  },
  {
    id: 'sh-5',
    query: 'Discrete Mathematics',
    timestamp: '3 days ago',
    category: 'Mathematics',
    resultsCount: 3
  }
];
