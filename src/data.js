/* ==========================================
   AETHERPATH PRE-POPULATED KNOWLEDGE BASE
   ========================================== */

export const TRACKS = {
  frontend: {
    id: "frontend",
    name: "Frontend Web Developer",
    description: "Learn to build modern, responsive, and highly interactive user interfaces from the ground up.",
    estimatedHours: 145,
    skills: ["HTML5", "CSS3", "JavaScript", "DOM Manipulation", "Vite", "React", "State Management", "Responsive Design", "Git & GitHub"],
    phases: [
      {
        id: "fe-phase-1",
        name: "Phase 1: Semantic Structures & Styling Foundations",
        nodes: [
          {
            id: "fe-node-1",
            name: "HTML5 & CSS3 Basics",
            type: "course",
            duration: "15 hrs",
            difficulty: "Beginner",
            cost: "Free",
            description: "Learn how to structure pages using semantic HTML5 tags and style them using modern CSS layout tools like Flexbox and CSS Grid.",
            skills: ["HTML5", "CSS3", "Semantic HTML", "Flexbox", "CSS Grid"],
            prerequisites: [],
            resources: [
              { title: "MDN Web Docs: HTML basics", url: "https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/HTML_basics" },
              { title: "freeCodeCamp: Responsive Web Design", url: "https://www.freecodecamp.org/learn/2022/responsive-web-design/" },
              { title: "CSS-Tricks: A Guide to Flexbox", url: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/" }
            ]
          },
          {
            id: "fe-node-2",
            name: "Portfolio Layout Challenge",
            type: "project",
            duration: "8 hrs",
            difficulty: "Beginner",
            cost: "Free",
            description: "Build a responsive personal portfolio landing page showcasing your details and past works using pure HTML/CSS without frameworks.",
            skills: ["Responsive Design", "CSS Layouts", "Media Queries"],
            prerequisites: ["fe-node-1"],
            resources: [
              { title: "Frontend Mentor: Landing Page challenges", url: "https://www.frontendmentor.io/challenges" }
            ]
          },
          {
            id: "fe-node-3",
            name: "Foundations Assessment",
            type: "assessment",
            duration: "1 hr",
            difficulty: "Beginner",
            cost: "Free",
            description: "A comprehensive assessment testing semantic HTML tags, CSS box model, positioning, Flexbox, and Grid principles.",
            skills: ["HTML5 Validation", "CSS Layout Debugging"],
            prerequisites: ["fe-node-2"],
            resources: []
          }
        ]
      },
      {
        id: "fe-phase-2",
        name: "Phase 2: Modern JavaScript & Dynamic DOM",
        nodes: [
          {
            id: "fe-node-4",
            name: "Modern JavaScript (ES6+)",
            type: "course",
            duration: "25 hrs",
            difficulty: "Beginner",
            cost: "Free",
            description: "Master JavaScript variables, control flows, arrays, arrow functions, promises, async/await, and fetching API data.",
            skills: ["JavaScript (ES6)", "Asynchronous JS", "Fetch API", "JSON"],
            prerequisites: ["fe-node-3"],
            resources: [
              { title: "JavaScript.info: The JavaScript Language", url: "https://javascript.info/" },
              { title: "Eloquent JavaScript (Online Book)", url: "https://eloquentjavascript.net/" },
              { title: "freeCodeCamp: JavaScript Algorithms", url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures-v8/" }
            ]
          },
          {
            id: "fe-node-5",
            name: "Interactive Dashboard App",
            type: "project",
            duration: "16 hrs",
            difficulty: "Intermediate",
            cost: "Free",
            description: "Build an interactive Weather Dashboard or Task Planner. Connect to a public web API, parse JSON data, and update the webpage dynamically using Javascript DOM manipulation.",
            skills: ["DOM Manipulation", "API Integration", "Event Handling"],
            prerequisites: ["fe-node-4"],
            resources: [
              { title: "Public APIs Repo", url: "https://github.com/public-apis/public-apis" }
            ]
          }
        ]
      },
      {
        id: "fe-phase-3",
        name: "Phase 3: React Framework & Core Tooling",
        nodes: [
          {
            id: "fe-node-6",
            name: "React & Vite Tooling",
            type: "course",
            duration: "30 hrs",
            difficulty: "Intermediate",
            cost: "Free",
            description: "Understand React components, JSX syntax, props, hooks (useState, useEffect, useRef, useContext), custom hooks, and npm bundlers.",
            skills: ["ReactJS", "Vite Bundler", "React Hooks", "JSX"],
            prerequisites: ["fe-node-5"],
            resources: [
              { title: "React Official Documentation (New Docs)", url: "https://react.dev/" },
              { title: "Scrimba: Learn React for Free", url: "https://scrimba.com/learn/learnreact" }
            ]
          },
          {
            id: "fe-node-7",
            name: "Personal Learning App",
            type: "project",
            duration: "20 hrs",
            difficulty: "Intermediate",
            cost: "Free",
            description: "Build a stateful application (like a Kanban board or a flashcard learning tool) with complex state workflows, local storage caching, and component modularity.",
            skills: ["React State Management", "Component Design", "Local Storage"],
            prerequisites: ["fe-node-6"],
            resources: []
          },
          {
            id: "fe-node-8",
            name: "Production Packaging & Git",
            type: "course",
            duration: "10 hrs",
            difficulty: "Intermediate",
            cost: "Free",
            description: "Learn version control, Git branching strategies, setting up CI/CD via GitHub Actions, and deploying SPA apps on Netlify, Vercel, or GitHub Pages.",
            skills: ["Git & Version Control", "CI/CD Basics", "Vercel Deployment"],
            prerequisites: ["fe-node-7"],
            resources: [
              { title: "Git Flight Rules", url: "https://github.com/k88hudson/git-flight-rules" },
              { title: "GitHub Learning Lab", url: "https://lab.github.com/" }
            ]
          },
          {
            id: "fe-node-9",
            name: "React Final Project Review",
            type: "assessment",
            duration: "20 hrs",
            difficulty: "Advanced",
            cost: "Free",
            description: "Final capstone portfolio review. Optimize rendering cycles using React.memo/useMemo, write unit tests with Jest/React Testing Library, and analyze web performance vitals.",
            skills: ["Performance Profiling", "React Testing", "Lighthouse Audit"],
            prerequisites: ["fe-node-8"],
            resources: []
          }
        ]
      }
    ]
  },
  
  datascience: {
    id: "datascience",
    name: "Data Science Track",
    description: "Learn to clean datasets, extract insights, perform statistical modeling, and visualize data trends.",
    estimatedHours: 130,
    skills: ["Python Programming", "Pandas", "NumPy", "Matplotlib & Seaborn", "SQL Databases", "Statistics", "Data Cleaning", "Jupyter Notebooks"],
    phases: [
      {
        id: "ds-phase-1",
        name: "Phase 1: Programming & Data Foundations",
        nodes: [
          {
            id: "ds-node-1",
            name: "Python for Data Analysis",
            type: "course",
            duration: "20 hrs",
            difficulty: "Beginner",
            cost: "Free",
            description: "Master Python fundamentals, basic data types, lists, dictionaries, list comprehensions, writing functions, and utilizing the Anaconda ecosystem.",
            skills: ["Python", "Jupyter Notebook", "Anaconda"],
            prerequisites: [],
            resources: [
              { title: "Kaggle: Python Course", url: "https://www.kaggle.com/learn/python" },
              { title: "Python for Everybody (PY4E)", url: "https://www.py4e.com/" }
            ]
          },
          {
            id: "ds-node-2",
            name: "Structured Query Language (SQL)",
            type: "course",
            duration: "15 hrs",
            difficulty: "Beginner",
            cost: "Free",
            description: "Write database queries using SQL. Learn SELECT statements, joins, aggregation functions, filtering, subqueries, and window functions.",
            skills: ["SQL", "Relational Databases", "Data Aggregation"],
            prerequisites: [],
            resources: [
              { title: "SQLBolt: Interactive SQL Tutorials", url: "https://sqlbolt.com/" },
              { title: "Kaggle: Intro to SQL", url: "https://www.kaggle.com/learn/intro-to-sql" }
            ]
          },
          {
            id: "ds-node-3",
            name: "E-Commerce Database Queries",
            type: "project",
            duration: "10 hrs",
            difficulty: "Beginner",
            cost: "Free",
            description: "Analyze a mock retail transactional database. Write 10 complex SQL queries to identify top customers, churn rates, and seasonal product sales trends.",
            skills: ["SQL Joins", "Aggregations", "Report Writing"],
            prerequisites: ["ds-node-2"],
            resources: []
          }
        ]
      },
      {
        id: "ds-phase-2",
        name: "Phase 2: Wrangling, Analysis & Math",
        nodes: [
          {
            id: "ds-node-4",
            name: "NumPy & Pandas Wrangling",
            type: "course",
            duration: "25 hrs",
            difficulty: "Intermediate",
            cost: "Free",
            description: "Use NumPy for multi-dimensional arrays, and Pandas for reading CSVs, joining dataframes, handling missing data, and processing datetime operations.",
            skills: ["Pandas Dataframes", "NumPy Vectorization", "Data Cleansing"],
            prerequisites: ["ds-node-1", "ds-node-3"],
            resources: [
              { title: "Kaggle: Pandas Tutorials", url: "https://www.kaggle.com/learn/pandas" },
              { title: "Pandas User Guide", url: "https://pandas.pydata.org/docs/user_guide/index.html" }
            ]
          },
          {
            id: "ds-node-5",
            name: "Applied Statistics & Analytics",
            type: "course",
            duration: "15 hrs",
            difficulty: "Intermediate",
            cost: "Free",
            description: "Core statistics: mean, median, standard deviation, probability distributions, hypothesis testing (Z-tests, T-tests), correlation coefficients, and regression foundations.",
            skills: ["Hypothesis Testing", "Probability", "Statistical Modeling"],
            prerequisites: ["ds-node-4"],
            resources: [
              { title: "OpenIntro Statistics (Free Textbook)", url: "https://www.openintro.org/book/os/" }
            ]
          },
          {
            id: "ds-node-6",
            name: "Data Visualization & Reporting",
            type: "course",
            duration: "15 hrs",
            difficulty: "Intermediate",
            cost: "Free",
            description: "Learn how to build compelling plots with Matplotlib and Seaborn. Understand chart design, visual hierarchies, and storytelling with data.",
            skills: ["Matplotlib", "Seaborn", "Data Storytelling"],
            prerequisites: ["ds-node-4"],
            resources: [
              { title: "Python Graph Gallery", url: "https://python-graph-gallery.com/" }
            ]
          }
        ]
      },
      {
        id: "ds-phase-3",
        name: "Phase 3: Exploratory Data Analysis & Project",
        nodes: [
          {
            id: "ds-node-7",
            name: "Exploratory Data Analysis (EDA) Capstone",
            type: "project",
            duration: "20 hrs",
            difficulty: "Advanced",
            cost: "Free",
            description: "Take a raw, messy dataset from Kaggle. Clean it, formulate 5 analytical hypotheses, write pandas scripts, and output a notebook containing 10 rich visualizations defending your findings.",
            skills: ["Exploratory Data Analysis", "Feature Engineering", "Data Cleaning"],
            prerequisites: ["ds-node-5", "ds-node-6"],
            resources: [
              { title: "Kaggle Datasets", url: "https://www.kaggle.com/datasets" }
            ]
          },
          {
            id: "ds-node-8",
            name: "EDA Technical Presentation",
            type: "assessment",
            duration: "5 hrs",
            difficulty: "Advanced",
            cost: "Free",
            description: "Peer-review level presentation. Format your Jupyter Notebook into a report, and create a slide deck explaining key business insights.",
            skills: ["Business Communication", "Markdown Presentation"],
            prerequisites: ["ds-node-7"],
            resources: []
          }
        ]
      }
    ]
  },

  aiml: {
    id: "aiml",
    name: "AI & Machine Learning Engineering",
    description: "Build, train, evaluate, and deploy predictive models using Scikit-Learn, TensorFlow, and large language model tools.",
    estimatedHours: 170,
    skills: ["Python", "Machine Learning", "Scikit-Learn", "Deep Learning", "TensorFlow / PyTorch", "NLP", "Neural Networks", "LLM APIs"],
    phases: [
      {
        id: "ai-phase-1",
        name: "Phase 1: Core Machine Learning & Scikit-Learn",
        nodes: [
          {
            id: "ai-node-1",
            name: "Python for ML Foundations",
            type: "course",
            duration: "15 hrs",
            difficulty: "Beginner",
            cost: "Free",
            description: "Ensure basic Python and math structures are ready: matrix mathematics (Linear Algebra) and basic Calculus concepts used in optimization algorithms.",
            skills: ["Linear Algebra", "Calculus Basics", "Python Vectors"],
            prerequisites: [],
            resources: [
              { title: "Khan Academy: Linear Algebra", url: "https://www.khanacademy.org/math/linear-algebra" }
            ]
          },
          {
            id: "ai-node-2",
            name: "Classical ML with Scikit-Learn",
            type: "course",
            duration: "30 hrs",
            difficulty: "Intermediate",
            cost: "Free",
            description: "Master regression (linear, logistic), classification (decision trees, random forests, SVMs), clustering (k-means), feature scaling, and train/test splits.",
            skills: ["Scikit-Learn", "Supervised Learning", "Unsupervised Learning", "Cross-Validation"],
            prerequisites: ["ai-node-1"],
            resources: [
              { title: "Kaggle: Intro to Machine Learning", url: "https://www.kaggle.com/learn/intro-to-machine-learning" },
              { title: "Kaggle: Intermediate Machine Learning", url: "https://www.kaggle.com/learn/intermediate-machine-learning" },
              { title: "Scikit-Learn Getting Started", url: "https://scikit-learn.org/stable/getting_started.html" }
            ]
          },
          {
            id: "ai-node-3",
            name: "Housing Price Predictor Project",
            type: "project",
            duration: "15 hrs",
            difficulty: "Intermediate",
            cost: "Free",
            description: "Build a predictive model using Scikit-Learn to estimate housing prices. Preprocess categorical features, tune hyperparameters, and evaluate using Mean Absolute Error (MAE).",
            skills: ["Hyperparameter Tuning", "Data Pipelines", "Model Validation"],
            prerequisites: ["ai-node-2"],
            resources: []
          }
        ]
      },
      {
        id: "ai-phase-2",
        name: "Phase 2: Deep Learning & Neural Networks",
        nodes: [
          {
            id: "ai-node-4",
            name: "Deep Learning Foundations (TensorFlow/PyTorch)",
            type: "course",
            duration: "35 hrs",
            difficulty: "Intermediate",
            cost: "Free",
            description: "Learn artificial neural networks (ANNs), backpropagation, activation functions (ReLU, Sigmoid), loss functions, and optimization strategies (SGD, Adam).",
            skills: ["Deep Learning", "TensorFlow", "Neural Networks"],
            prerequisites: ["ai-node-3"],
            resources: [
              { title: "Fast.ai: Practical Deep Learning for Coders", url: "https://course.fast.ai/" },
              { title: "TensorFlow Tutorials", url: "https://www.tensorflow.org/tutorials" },
              { title: "DeepLearning.AI courses (Coursera audit option)", url: "https://www.coursera.org/specializations/deep-learning" }
            ]
          },
          {
            id: "ai-node-5",
            name: "Image Classification Model",
            type: "project",
            duration: "20 hrs",
            difficulty: "Intermediate",
            cost: "Free",
            description: "Build and train a Convolutional Neural Network (CNN) to classify images (e.g. fashion items or digits) using TensorFlow or PyTorch. Implement data augmentation.",
            skills: ["CNNs", "Computer Vision", "Tensor Manipulation"],
            prerequisites: ["ai-node-4"],
            resources: []
          }
        ]
      },
      {
        id: "ai-phase-3",
        name: "Phase 3: Natural Language Processing & LLMs",
        nodes: [
          {
            id: "ai-node-6",
            name: "Natural Language Processing (NLP)",
            type: "course",
            duration: "20 hrs",
            difficulty: "Advanced",
            cost: "Free",
            description: "Understand text preprocessing, tokenization, word embeddings (Word2Vec), recurrent neural networks (RNNs), and Transformer architectures.",
            skills: ["NLP", "Transformers", "Text Preprocessing"],
            prerequisites: ["ai-node-4"],
            resources: [
              { title: "Hugging Face Course: NLP Basics", url: "https://huggingface.co/learn/nlp-course" }
            ]
          },
          {
            id: "ai-node-7",
            name: "RAG Q&A Bot with Gemini API",
            type: "project",
            duration: "25 hrs",
            difficulty: "Advanced",
            cost: "Free",
            description: "Create a Retrieval-Augmented Generation (RAG) system using vector databases and LLM APIs to answer questions from a custom corpus of documents.",
            skills: ["RAG System", "Gemini API", "Vector Databases", "Prompt Engineering"],
            prerequisites: ["ai-node-6"],
            resources: [
              { title: "Google Gemini API Developer Guide", url: "https://ai.google.dev/" }
            ]
          },
          {
            id: "ai-node-8",
            name: "AI Engine Capstone Assessment",
            type: "assessment",
            duration: "10 hrs",
            difficulty: "Advanced",
            cost: "Free",
            description: "Deploy your RAG model as a microservice (using Flask/FastAPI), perform model evaluation metrics (precision, recall, BLEU score), and document your pipeline.",
            skills: ["Model Deployment", "API Design", "Evaluation Metrics"],
            prerequisites: ["ai-node-7"],
            resources: []
          }
        ]
      }
    ]
  },

  backend: {
    id: "backend",
    name: "Backend Web Development",
    description: "Learn Node.js, server architectures, API design, database modeling, and server deployment.",
    estimatedHours: 140,
    skills: ["Node.js", "Express.js", "MongoDB", "SQL / PostgreSQL", "REST APIs", "Authentication", "Security", "Docker"],
    phases: [
      {
        id: "be-phase-1",
        name: "Phase 1: Server Logic & REST APIs",
        nodes: [
          {
            id: "be-node-1",
            name: "Node.js & Express Foundations",
            type: "course",
            duration: "25 hrs",
            difficulty: "Beginner",
            cost: "Free",
            description: "Understand the event loop, node package manager (npm), building HTTP servers, routing, middleware patterns, and CORS configurations.",
            skills: ["Node.js", "Express.js", "Routing", "Middleware"],
            prerequisites: [],
            resources: [
              { title: "freeCodeCamp: Back End Development and APIs", url: "https://www.freecodecamp.org/learn/back-end-development-and-apis/" },
              { title: "The Odin Project: Node.js Track", url: "https://www.theodinproject.com/paths/full-stack-javascript/courses/nodejs" }
            ]
          },
          {
            id: "be-node-2",
            name: "RESTful Task API Project",
            type: "project",
            duration: "15 hrs",
            difficulty: "Beginner",
            cost: "Free",
            description: "Build a complete REST API using Express. Support CRUD operations for task objects, input validation, and proper HTTP response status codes.",
            skills: ["API Design", "CRUD Operations", "Postman Testing"],
            prerequisites: ["be-node-1"],
            resources: [
              { title: "REST API Design Best Practices", url: "https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/" }
            ]
          }
        ]
      },
      {
        id: "be-phase-2",
        name: "Phase 2: Database Storage & Modeling",
        nodes: [
          {
            id: "be-node-3",
            name: "SQL & NoSQL Databases",
            type: "course",
            duration: "30 hrs",
            difficulty: "Intermediate",
            cost: "Free",
            description: "Master database connectivity. Learn table relations in PostgreSQL (1-to-many, many-to-many) and document structures in MongoDB using Mongoose.",
            skills: ["MongoDB", "PostgreSQL", "Mongoose ORM", "Database Schema Design"],
            prerequisites: ["be-node-2"],
            resources: [
              { title: "MongoDB University (Free)", url: "https://learn.mongodb.com/" },
              { title: "Prisma Schema Reference", url: "https://www.prisma.io/docs/concepts/components/prisma-schema" }
            ]
          },
          {
            id: "be-node-4",
            name: "E-Commerce Database Layer",
            type: "project",
            duration: "20 hrs",
            difficulty: "Intermediate",
            cost: "Free",
            description: "Design the database schema for a shopping application. Write scripts to populate seed data and model products, user shopping carts, and order details.",
            skills: ["Schema Modeling", "Database Indexing", "Transactions"],
            prerequisites: ["be-node-3"],
            resources: []
          }
        ]
      },
      {
        id: "be-phase-3",
        name: "Phase 3: Authentication & Systems Deployment",
        nodes: [
          {
            id: "be-node-5",
            name: "Authentication & Security",
            type: "course",
            duration: "20 hrs",
            difficulty: "Intermediate",
            cost: "Free",
            description: "Learn JSON Web Tokens (JWT), session cookies, hashing passwords with bcrypt, protecting routes, and protecting against common OWASP attacks.",
            skills: ["JWT Authentication", "Cryptography Basics", "OWASP Security"],
            prerequisites: ["be-node-4"],
            resources: [
              { title: "OWASP Top Ten Cheatsheets", url: "https://cheatsheetseries.owasp.org/" }
            ]
          },
          {
            id: "be-node-6",
            name: "Docker Containers & Cloud Deployment",
            type: "course",
            duration: "20 hrs",
            difficulty: "Advanced",
            cost: "Free",
            description: "Understand Docker containers, writing Dockerfiles, docker-compose configuration, environment variable management, and deploying servers to Render or AWS EC2.",
            skills: ["Docker", "Containers", "AWS Deployment", "Environment Management"],
            prerequisites: ["be-node-5"],
            resources: [
              { title: "Docker Curriculum", url: "https://docker-curriculum.com/" }
            ]
          },
          {
            id: "be-node-7",
            name: "Backend Operations Assessment",
            type: "assessment",
            duration: "10 hrs",
            difficulty: "Advanced",
            cost: "Free",
            description: "Perform load-testing on your server using clinic.js or autocannon, configure rate-limiting, set up database indexing, and write integration tests.",
            skills: ["Load Testing", "Rate Limiting", "Integration Tests", "Profiling"],
            prerequisites: ["be-node-6"],
            resources: []
          }
        ]
      }
    ]
  }
};
