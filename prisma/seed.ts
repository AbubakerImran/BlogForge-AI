import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Clean existing data
  await prisma.rolePermission.deleteMany();
  await prisma.permission.deleteMany();
  await prisma.siteSettings.deleteMany();
  await prisma.pageView.deleteMany();
  await prisma.newsletter.deleteMany();
  await prisma.post.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.category.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // Seed permissions
  const permissionNames = [
    { name: "Dashboard", slug: "dashboard" },
    { name: "Posts", slug: "posts" },
    { name: "Categories (Dashboard)", slug: "categories-dashboard" },
    { name: "Analytics", slug: "analytics" },
    { name: "Newsletter", slug: "newsletter" },
    { name: "Settings", slug: "settings" },
    { name: "Users", slug: "users" },
    { name: "Permissions", slug: "permissions" },
    { name: "Roles", slug: "roles" },
    { name: "Home", slug: "home" },
    { name: "Blog", slug: "blog" },
    { name: "Categories (Site)", slug: "categories-site" },
    { name: "About", slug: "about" },
    { name: "Contact", slug: "contact" },
  ];

  for (const perm of permissionNames) {
    await prisma.permission.create({ data: perm });
  }
  console.log("✅ Permissions created");

  // Seed role permissions
  const userPerms = ["home", "blog", "categories-site", "about", "contact"];
  const adminPerms = [
    "dashboard", "posts", "categories-dashboard", "analytics", "settings",
    "home", "blog", "categories-site", "about", "contact",
  ];
  const superadminPerms = [
    "dashboard", "posts", "categories-dashboard", "analytics", "newsletter",
    "settings", "users", "home", "blog", "categories-site", "about", "contact",
  ];

  for (const perm of userPerms) {
    await prisma.rolePermission.create({ data: { role: Role.USER, permission: perm } });
  }
  for (const perm of adminPerms) {
    await prisma.rolePermission.create({ data: { role: Role.ADMIN, permission: perm } });
  }
  for (const perm of superadminPerms) {
    await prisma.rolePermission.create({ data: { role: Role.SUPERADMIN, permission: perm } });
  }
  console.log("✅ Role permissions created");

  // Create site settings
  await prisma.siteSettings.create({
    data: {
      siteName: "BlogForge AI",
      siteDescription: "An AI-powered blogging platform built with Next.js",
      siteUrl: "http://localhost:3000",
      siteAuthor: "BlogForge AI Team",
    },
  });
  console.log("✅ Site settings created");

  // Create superadmin user
  const hashedPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.create({
    data: {
      name: "BlogForge Admin",
      email: "admin@blogforge.ai",
      password: hashedPassword,
      role: Role.SUPERADMIN,
    },
  });
  console.log("✅ Superadmin user created");

  // Auto-subscribe superadmin to newsletter
  await prisma.newsletter.create({
    data: { email: "admin@blogforge.ai" },
  });

  // Create categories
  const categoriesData = [
    {
      name: "Technology",
      slug: "technology",
      description: "Latest trends and innovations in the tech world",
      color: "#3B82F6",
    },
    {
      name: "AI & Machine Learning",
      slug: "ai-machine-learning",
      description:
        "Exploring artificial intelligence and machine learning breakthroughs",
      color: "#8B5CF6",
    },
    {
      name: "Web Development",
      slug: "web-development",
      description: "Frontend, backend, and full-stack web development topics",
      color: "#10B981",
    },
    {
      name: "Digital Marketing",
      slug: "digital-marketing",
      description: "SEO, content marketing, and digital growth strategies",
      color: "#F59E0B",
    },
    {
      name: "Cybersecurity",
      slug: "cybersecurity",
      description: "Security best practices, threats, and protection strategies",
      color: "#EF4444",
    },
    {
      name: "Startup & Business",
      slug: "startup-business",
      description: "Entrepreneurship, startup culture, and business growth",
      color: "#EC4899",
    },
  ];

  const categories: Record<string, { id: string }> = {};
  for (const cat of categoriesData) {
    categories[cat.slug] = await prisma.category.create({ data: cat });
  }
  console.log("✅ Categories created");

  // Create tags
  const tagsData = [
    { name: "React", slug: "react" },
    { name: "Next.js", slug: "nextjs" },
    { name: "JavaScript", slug: "javascript" },
    { name: "Python", slug: "python" },
    { name: "SEO", slug: "seo" },
    { name: "AI", slug: "ai" },
    { name: "Machine Learning", slug: "machine-learning" },
    { name: "Startup", slug: "startup" },
    { name: "Productivity", slug: "productivity" },
    { name: "Design", slug: "design" },
  ];

  const tags: Record<string, { id: string }> = {};
  for (const tag of tagsData) {
    tags[tag.slug] = await prisma.tag.create({ data: tag });
  }
  console.log("✅ Tags created");

  // Create 12 blog posts
  const postsData = [
    {
      title: "The Future of AI in Software Development",
      slug: "future-of-ai-in-software-development",
      content: `Artificial intelligence is fundamentally reshaping how software is built, tested, and deployed. Developers around the world are beginning to integrate AI-powered tools into every stage of their workflow, from code generation to automated testing and deployment pipelines.

One of the most significant changes has been the rise of AI coding assistants. Tools like GitHub Copilot and ChatGPT have demonstrated that large language models can understand code context and generate meaningful suggestions. These tools are not replacing developers but rather augmenting their capabilities, allowing them to focus on higher-level architecture and problem-solving while the AI handles boilerplate and repetitive tasks.

Beyond code generation, AI is transforming software testing. Machine learning models can now analyze codebases to identify potential bugs before they reach production. Predictive analytics help teams prioritize which tests to run, significantly reducing CI/CD pipeline times while maintaining quality.

The impact on DevOps has been equally profound. AI-driven monitoring systems can detect anomalies in real-time, predict infrastructure failures before they occur, and automatically scale resources based on demand patterns. This shift toward AIOps is enabling teams to manage increasingly complex distributed systems with greater confidence.

However, the integration of AI into development workflows also raises important questions about code ownership, security, and the potential for AI-generated vulnerabilities. As the industry continues to evolve, developers must stay informed about both the capabilities and limitations of these powerful tools.

Looking ahead, we can expect AI to become even more deeply embedded in the development lifecycle. From AI-powered code reviews to automated documentation generation, the future of software development is one where human creativity and artificial intelligence work in tandem to build better software faster.`,
      excerpt:
        "Exploring how artificial intelligence is transforming every stage of the software development lifecycle.",
      aiSummary:
        "This article examines the growing role of AI in software development, covering coding assistants, automated testing, and AIOps. It discusses both the benefits and challenges of integrating AI into development workflows.",
      published: true,
      featured: true,
      views: 4520,
      readTime: 8,
      categorySlug: "ai-machine-learning",
      tagSlugs: ["ai", "machine-learning", "productivity"],
    },
    {
      title: "Building Scalable Web Apps with Next.js 14",
      slug: "building-scalable-web-apps-nextjs-14",
      content: `Next.js 14 represents a major leap forward in the React ecosystem, introducing server actions, improved streaming, and a more intuitive approach to building full-stack web applications. For developers looking to build scalable, production-ready applications, Next.js 14 offers an unparalleled developer experience.

The App Router, now stable in Next.js 14, fundamentally changes how we think about routing and data fetching in React applications. With React Server Components at its core, the App Router enables developers to build applications that are both fast and SEO-friendly. Server components reduce the amount of JavaScript sent to the client, resulting in faster page loads and better Core Web Vitals scores.

Server Actions are one of the most exciting features in Next.js 14. They allow developers to define server-side functions directly alongside their components, eliminating the need for separate API routes in many cases. This simplifies the architecture of full-stack applications and reduces the amount of boilerplate code needed to handle form submissions and data mutations.

Partial prerendering is another game-changing feature that combines static and dynamic rendering in a single page. The static shell of a page is served instantly from the CDN, while dynamic content is streamed in as it becomes available. This approach provides the best of both worlds: the speed of static sites with the flexibility of dynamic applications.

When it comes to scalability, Next.js 14 excels through its built-in support for edge computing. By deploying your application to edge networks, you can serve content from locations geographically close to your users, dramatically reducing latency and improving the user experience.

Data caching and revalidation strategies in Next.js 14 give developers fine-grained control over how data is fetched and cached. From time-based revalidation to on-demand cache invalidation, these features enable developers to build applications that are both performant and up-to-date.

For teams working on large-scale projects, Next.js 14 also offers improved build times through turbopack integration and better code splitting. These optimizations make it practical to build and maintain large applications without sacrificing development speed.`,
      excerpt:
        "A deep dive into Next.js 14 features that enable building scalable, production-ready web applications.",
      aiSummary:
        "This comprehensive guide covers Next.js 14's key features including the App Router, Server Actions, and partial prerendering. It explains how these features enable developers to build scalable, high-performance web applications.",
      published: true,
      featured: true,
      views: 3890,
      readTime: 10,
      categorySlug: "web-development",
      tagSlugs: ["react", "nextjs", "javascript"],
    },
    {
      title: "Understanding Large Language Models: A Technical Deep Dive",
      slug: "understanding-large-language-models-technical-deep-dive",
      content: `Large Language Models (LLMs) have captured the imagination of both the tech industry and the general public. But what actually makes these models work? In this technical deep dive, we'll explore the architecture, training process, and capabilities that make LLMs so powerful.

At their core, LLMs are built on the transformer architecture, introduced in the seminal paper "Attention Is All You Need" by Vaswani et al. in 2017. The key innovation of transformers is the self-attention mechanism, which allows the model to weigh the importance of different parts of the input when generating each token of the output.

The training process for LLMs typically occurs in two phases. The first phase, pre-training, involves exposing the model to vast amounts of text data from the internet. During this phase, the model learns to predict the next token in a sequence, developing a rich understanding of language patterns, grammar, facts, and reasoning abilities. The second phase, fine-tuning, adapts the pre-trained model for specific tasks using smaller, curated datasets.

Reinforcement Learning from Human Feedback (RLHF) has emerged as a crucial technique for aligning LLMs with human preferences. In this process, human evaluators rank different model outputs, and these rankings are used to train a reward model. The LLM is then fine-tuned using reinforcement learning to generate outputs that maximize the reward model's score.

One of the most important concepts in working with LLMs is the context window. This refers to the maximum number of tokens the model can process at once. Recent advances have significantly expanded context windows, with some models now supporting hundreds of thousands of tokens. This enables applications like long document analysis and multi-turn conversations.

Prompt engineering has become an essential skill for getting the most out of LLMs. Techniques like few-shot learning, chain-of-thought prompting, and retrieval-augmented generation (RAG) can dramatically improve model performance on specific tasks without any additional training.

The future of LLMs lies in multimodal capabilities, improved reasoning, and more efficient architectures. As research continues to advance, we can expect these models to become more capable, more accessible, and more integrated into everyday tools and workflows.`,
      excerpt:
        "A technical exploration of how large language models work, from transformer architecture to RLHF.",
      aiSummary:
        "This article provides a technical overview of Large Language Models, explaining transformer architecture, training processes including RLHF, and practical concepts like context windows and prompt engineering.",
      published: true,
      featured: true,
      views: 5120,
      readTime: 12,
      categorySlug: "ai-machine-learning",
      tagSlugs: ["ai", "machine-learning", "python"],
    },
    {
      title: "SEO Strategies for Modern Web Applications",
      slug: "seo-strategies-modern-web-applications",
      content: `Search engine optimization for modern web applications presents unique challenges that traditional SEO practices don't fully address. With the rise of single-page applications, client-side rendering, and dynamic content, developers and marketers need to adapt their strategies to ensure their applications are discoverable by search engines.

The foundation of modern web SEO starts with server-side rendering (SSR) or static site generation (SSG). Search engine crawlers have improved their ability to render JavaScript, but relying solely on client-side rendering can still lead to indexing issues. Frameworks like Next.js, Nuxt.js, and Remix provide built-in SSR capabilities that ensure your content is available to crawlers on the initial page load.

Core Web Vitals have become a significant ranking factor in Google's algorithm. These metrics, including Largest Contentful Paint (LCP), First Input Delay (FID), and Cumulative Layout Shift (CLS), measure the real-world user experience of your website. Optimizing these metrics requires attention to image optimization, font loading strategies, JavaScript bundle sizes, and layout stability.

Structured data markup using Schema.org vocabulary helps search engines understand the content and context of your pages. By implementing JSON-LD structured data, you can qualify for rich results in search engine results pages, including featured snippets, knowledge panels, and article carousels. This can significantly increase your click-through rates.

Technical SEO for web applications also involves proper handling of routing, canonical URLs, and sitemaps. For applications with dynamic routes, generating XML sitemaps programmatically ensures that all your content is discoverable. Implementing proper canonical tags prevents duplicate content issues that can arise from URL parameters and query strings.

Content strategy remains the backbone of any successful SEO approach. Creating high-quality, comprehensive content that addresses user intent is more important than ever. AI-powered tools can assist with content planning and optimization, but the focus should always be on providing genuine value to your audience.

Mobile optimization is no longer optional. With Google's mobile-first indexing, the mobile version of your site is the primary version that gets indexed and ranked. Responsive design, touch-friendly interfaces, and fast mobile load times are essential for maintaining strong search rankings.`,
      excerpt:
        "Modern SEO strategies tailored for web applications built with JavaScript frameworks.",
      aiSummary:
        "This guide covers SEO strategies specific to modern web applications, including SSR/SSG, Core Web Vitals optimization, structured data, and technical SEO considerations for JavaScript-heavy applications.",
      published: true,
      featured: false,
      views: 2340,
      readTime: 9,
      categorySlug: "digital-marketing",
      tagSlugs: ["seo", "nextjs", "javascript"],
    },
    {
      title: "Cybersecurity Best Practices for Startups",
      slug: "cybersecurity-best-practices-startups",
      content: `Startups often prioritize speed and growth over security, but this approach can lead to devastating consequences. A single data breach can destroy customer trust, result in regulatory fines, and even shut down a young company. Implementing cybersecurity best practices from day one is essential for building a resilient business.

The first step in securing your startup is adopting a security-first mindset throughout your organization. This means making security a consideration in every decision, from choosing cloud providers to designing your application architecture. Security should not be an afterthought but a fundamental aspect of your company culture.

Authentication and access control form the foundation of application security. Implementing multi-factor authentication (MFA) for all user accounts, using role-based access control (RBAC), and following the principle of least privilege are essential practices. Password policies should enforce strong passwords, and sensitive operations should require re-authentication.

Data encryption is another critical layer of security. All data should be encrypted both in transit (using TLS) and at rest (using AES-256 or similar algorithms). Sensitive data like passwords should be hashed using modern algorithms like bcrypt or Argon2, never stored in plain text.

Secure coding practices help prevent common vulnerabilities like SQL injection, cross-site scripting (XSS), and cross-site request forgery (CSRF). Regular code reviews, automated security scanning tools, and dependency auditing are essential parts of a secure development workflow. Keeping your dependencies up to date is particularly important, as many breaches exploit known vulnerabilities in outdated libraries.

Incident response planning is something every startup should have, even before experiencing an incident. Your plan should outline how to detect, contain, and recover from security incidents, as well as communication procedures for notifying affected users and relevant authorities.

Regular security audits and penetration testing help identify vulnerabilities before attackers do. Even with limited budgets, startups can leverage automated security scanning tools and bug bounty programs to improve their security posture. As your company grows, investing in dedicated security personnel becomes increasingly important.`,
      excerpt:
        "Essential cybersecurity practices that every startup should implement from day one.",
      aiSummary:
        "This article outlines critical cybersecurity practices for startups, covering authentication, encryption, secure coding, and incident response planning. It emphasizes building a security-first culture from the beginning.",
      published: true,
      featured: false,
      views: 1870,
      readTime: 8,
      categorySlug: "cybersecurity",
      tagSlugs: ["startup", "productivity"],
    },
    {
      title: "React Server Components: A Complete Guide",
      slug: "react-server-components-complete-guide",
      content: `React Server Components (RSC) represent one of the most significant architectural shifts in the React ecosystem since the introduction of hooks. They fundamentally change how we think about rendering, data fetching, and the boundary between server and client code in React applications.

Server Components are React components that execute exclusively on the server. Unlike traditional React components that run in the browser, Server Components never ship their JavaScript to the client. This means they can directly access server-side resources like databases, file systems, and internal APIs without exposing any of this logic to the client bundle.

The primary benefit of Server Components is reduced bundle size. In a traditional React application, every component and its dependencies are sent to the client as JavaScript. With Server Components, only the rendered output is sent, dramatically reducing the amount of JavaScript the browser needs to download, parse, and execute.

Data fetching with Server Components is remarkably straightforward. Since they run on the server, you can use async/await directly in your component functions to fetch data from databases or APIs. There's no need for useEffect, useState, or external data fetching libraries for server-side data. This simplifies your code and eliminates many common bugs related to loading states and stale data.

The interplay between Server Components and Client Components is where the architecture gets interesting. Client Components are marked with the "use client" directive and can use hooks, event handlers, and browser APIs. Server Components can import and render Client Components, passing serializable props to them. However, Client Components cannot import Server Components directly.

Streaming and Suspense work beautifully with Server Components. You can wrap parts of your component tree in Suspense boundaries, allowing the shell of the page to be sent immediately while slower data fetches complete. This progressive rendering approach provides a much better user experience than waiting for all data to load before showing anything.

For developers transitioning to Server Components, the key mental model shift is thinking about where each piece of your application should run. Interactive elements, form handlers, and components using browser APIs belong on the client. Data-heavy components, access control logic, and anything that benefits from server-side execution belong on the server.`,
      excerpt:
        "Everything you need to know about React Server Components and how they change React development.",
      aiSummary:
        "A comprehensive guide to React Server Components explaining their architecture, benefits for bundle size reduction, data fetching patterns, and the interplay between server and client components.",
      published: true,
      featured: true,
      views: 4100,
      readTime: 11,
      categorySlug: "web-development",
      tagSlugs: ["react", "nextjs", "javascript"],
    },
    {
      title: "Python for Machine Learning: Getting Started",
      slug: "python-machine-learning-getting-started",
      content: `Python has established itself as the dominant programming language for machine learning, and for good reason. Its readable syntax, extensive library ecosystem, and strong community support make it the ideal choice for both beginners and experienced practitioners in the field.

Getting started with machine learning in Python begins with setting up your environment. Anaconda and virtual environments are the recommended approaches for managing Python packages and avoiding dependency conflicts. Key libraries you'll need include NumPy for numerical computing, Pandas for data manipulation, Matplotlib and Seaborn for visualization, and Scikit-learn for machine learning algorithms.

Understanding your data is the first step in any machine learning project. Exploratory data analysis (EDA) involves examining the statistical properties of your dataset, identifying patterns and correlations, and handling missing values and outliers. Pandas provides powerful tools for data manipulation, while Matplotlib and Seaborn offer flexible visualization capabilities to help you understand your data.

Feature engineering is often the most impactful step in improving model performance. This involves creating new features from existing data, encoding categorical variables, scaling numerical features, and selecting the most relevant features for your model. Scikit-learn provides preprocessing tools and feature selection methods that streamline this process.

Supervised learning algorithms form the backbone of many ML applications. Linear regression and logistic regression are excellent starting points for understanding the fundamentals. Decision trees and random forests offer interpretable models that handle non-linear relationships well. For more complex problems, gradient boosting methods like XGBoost and LightGBM often achieve state-of-the-art performance on tabular data.

Model evaluation goes beyond simple accuracy metrics. Understanding precision, recall, F1 score, and AUC-ROC is essential for properly evaluating classification models. Cross-validation helps ensure your model generalizes well to unseen data, while learning curves can diagnose overfitting and underfitting issues.

Deep learning with frameworks like TensorFlow and PyTorch has opened up possibilities in areas like computer vision, natural language processing, and generative AI. While these frameworks have steeper learning curves, they enable solutions to problems that traditional ML methods cannot handle. Starting with transfer learning, using pre-trained models as a foundation, is an excellent way to get practical results quickly.`,
      excerpt:
        "A beginner-friendly guide to starting your machine learning journey with Python.",
      aiSummary:
        "This beginner's guide covers the essentials of machine learning with Python, from environment setup and data analysis to supervised learning algorithms and deep learning frameworks.",
      published: true,
      featured: false,
      views: 3210,
      readTime: 10,
      categorySlug: "ai-machine-learning",
      tagSlugs: ["python", "machine-learning", "ai"],
    },
    {
      title: "Building a Successful SaaS Product in 2024",
      slug: "building-successful-saas-product-2024",
      content: `The SaaS landscape in 2024 is both exciting and challenging. With lower barriers to entry than ever before, founders can launch products quickly, but standing out in an increasingly crowded market requires a thoughtful approach to product development, marketing, and customer success.

Finding product-market fit remains the most critical early-stage challenge for SaaS founders. This requires deep understanding of your target market's pain points, not just what customers say they want, but what they actually need. Conducting customer discovery interviews, analyzing competitor gaps, and building minimum viable products to test hypotheses are essential steps in this journey.

Pricing strategy can make or break a SaaS business. The trend toward usage-based pricing has accelerated, with companies like Vercel and OpenAI demonstrating that aligning costs with customer value can drive rapid adoption. However, predictable subscription pricing still works well for many categories. The key is testing different pricing models early and iterating based on conversion data.

Technical architecture decisions in the early stages have long-lasting implications. Choosing the right technology stack, designing for multi-tenancy, implementing proper observability, and planning for scale are all important considerations. Modern frameworks like Next.js, combined with managed services from AWS, GCP, or Vercel, allow small teams to build sophisticated applications with minimal infrastructure overhead.

Customer acquisition for SaaS products requires a multi-channel approach. Content marketing and SEO provide long-term organic growth, while targeted advertising and partnership programs can accelerate initial traction. Product-led growth, where the product itself drives acquisition through free tiers and viral features, has become the dominant strategy for developer tools and productivity applications.

Retention is where SaaS businesses are truly built. Reducing churn requires continuous investment in customer success, product quality, and feature development. Monitoring metrics like Net Revenue Retention (NRR), Customer Health Score, and Time to Value helps identify at-risk accounts before they churn.

Building a strong company culture is essential for long-term success. Remote work has expanded the talent pool, but it also requires intentional effort to maintain team cohesion, communication, and alignment. Documenting processes, investing in asynchronous communication tools, and creating regular opportunities for team connection are key practices for remote SaaS teams.`,
      excerpt:
        "Strategic insights for building and scaling a SaaS product in today's competitive market.",
      aiSummary:
        "This article provides strategic guidance for SaaS founders in 2024, covering product-market fit, pricing strategies, technical architecture, customer acquisition, and retention metrics.",
      published: true,
      featured: false,
      views: 1560,
      readTime: 9,
      categorySlug: "startup-business",
      tagSlugs: ["startup", "productivity"],
    },
    {
      title: "Modern CSS Techniques Every Developer Should Know",
      slug: "modern-css-techniques-every-developer-should-know",
      content: `CSS has evolved dramatically in recent years, with new features that would have seemed impossible just a few years ago. Modern CSS provides powerful tools for layout, animation, and responsive design that reduce the need for JavaScript and third-party libraries.

CSS Grid and Flexbox have revolutionized web layout. Grid excels at two-dimensional layouts, allowing you to define both rows and columns simultaneously. Features like auto-fit, auto-fill, and the minmax function make it easy to create responsive layouts without media queries. Flexbox is perfect for one-dimensional layouts and component-level alignment, handling spacing and distribution with elegant simplicity.

Container Queries represent a paradigm shift in responsive design. Unlike media queries, which respond to viewport size, container queries allow components to adapt based on the size of their parent container. This enables truly reusable components that look great regardless of where they're placed in the layout.

CSS Custom Properties, also known as CSS variables, enable dynamic theming and reduce repetition in your stylesheets. Combined with the new color-mix function and relative color syntax, you can create sophisticated color systems that adapt dynamically. The oklch color space provides perceptually uniform colors that look consistent across different hue values.

The :has() selector, often called the "parent selector," enables selecting elements based on their descendants. This long-requested feature opens up possibilities for styling that previously required JavaScript. Combined with :is() and :where(), these selectors make your CSS more readable and maintainable.

Scroll-driven animations are one of the most exciting recent additions to CSS. Using the animation-timeline property and scroll() function, you can create animations that respond to scroll position without any JavaScript. This includes parallax effects, progress indicators, and reveal animations that feel smooth and performant.

Logical properties like margin-inline, padding-block, and inline-size make your CSS more adaptable to different writing modes and text directions. Using logical properties instead of physical ones ensures your layouts work correctly for right-to-left languages without additional CSS.

The @layer rule helps manage specificity by organizing your CSS into named layers. This is particularly useful when working with third-party CSS frameworks, as you can ensure your custom styles always take precedence without resorting to !important or overly specific selectors.`,
      excerpt:
        "Discover the latest CSS features that are changing how we build web interfaces.",
      aiSummary:
        "This article explores modern CSS features including Container Queries, the :has() selector, scroll-driven animations, and CSS layers. These techniques reduce JavaScript dependency and improve responsive design.",
      published: true,
      featured: false,
      views: 2780,
      readTime: 8,
      categorySlug: "web-development",
      tagSlugs: ["javascript", "design"],
    },
    {
      title: "The Rise of Edge Computing: What Developers Need to Know",
      slug: "rise-of-edge-computing-developers-need-to-know",
      content: `Edge computing is transforming how we think about application architecture and deployment. By moving computation closer to end users, edge computing reduces latency, improves performance, and enables new categories of applications that weren't possible with centralized cloud architectures.

At its core, edge computing refers to running code on servers distributed across global networks, positioned physically close to users. Major cloud providers and platforms like Cloudflare Workers, Vercel Edge Functions, and Deno Deploy have made edge computing accessible to everyday developers, not just infrastructure engineers.

The performance benefits of edge computing are immediate and measurable. When a user in Tokyo requests data from an edge server in the same city rather than a centralized server in Virginia, the reduction in latency can be dramatic. For applications where every millisecond counts, like e-commerce checkout flows or real-time collaboration tools, this performance improvement translates directly to better conversion rates and user satisfaction.

Edge computing introduces new architectural patterns that developers need to understand. The edge runtime is more constrained than a traditional Node.js server. There's no file system access, limited memory, and execution time limits. This means developers need to think carefully about which parts of their application logic can run at the edge and which need a full server environment.

Data management at the edge presents unique challenges. Traditional databases are centralized, which creates a tension with the distributed nature of edge computing. Solutions like Cloudflare D1, Turso, and PlanetScale provide distributed database solutions designed for edge deployments. Edge-compatible key-value stores and caching layers help bridge the gap between edge compute and centralized data stores.

Authentication and authorization at the edge require careful consideration. JWT verification is well-suited to edge environments since it can be performed without database access. Session-based auth, on the other hand, typically requires a centralized store. Many developers adopt hybrid approaches, performing lightweight auth checks at the edge while delegating complex authorization to origin servers.

The future of edge computing lies in combining it with AI inference. Running machine learning models at the edge enables real-time personalization, content moderation, and intelligent routing without the latency of round-trips to centralized servers. As models become smaller and more efficient, edge AI will become an increasingly practical option for a wide range of applications.`,
      excerpt:
        "Understanding edge computing and how it's changing application architecture for modern developers.",
      aiSummary:
        "This article explains edge computing fundamentals for developers, covering performance benefits, architectural patterns, data management challenges, and the emerging convergence of edge computing with AI.",
      published: true,
      featured: false,
      views: 1950,
      readTime: 9,
      categorySlug: "technology",
      tagSlugs: ["javascript", "nextjs", "ai"],
    },
    {
      title: "Designing User Interfaces with AI-Powered Tools",
      slug: "designing-user-interfaces-ai-powered-tools",
      content: `The intersection of artificial intelligence and user interface design is creating a new paradigm in how digital products are designed and built. AI-powered design tools are accelerating workflows, enabling rapid prototyping, and making design more accessible to non-designers while giving experienced designers superpowers.

AI design tools have matured significantly in the past year. Tools like Figma's AI features, Galileo AI, and Uizard can generate complete UI designs from text descriptions. While these generated designs often need refinement, they provide excellent starting points that can save hours of initial design work. The ability to describe a layout in natural language and see it materialize in seconds fundamentally changes the ideation process.

Design systems benefit enormously from AI assistance. Maintaining consistency across large design systems is challenging, and AI can help by automatically checking components for accessibility compliance, suggesting color palette variations that maintain contrast ratios, and generating component variants based on existing design patterns. This automated quality assurance helps teams maintain high standards as their design systems scale.

Personalization at scale is one of the most impactful applications of AI in UI design. AI can analyze user behavior patterns and dynamically adjust interfaces to match individual preferences and needs. This goes beyond simple A/B testing to create truly adaptive interfaces that evolve with each user over time.

Accessibility has been transformed by AI tools that can automatically audit designs for WCAG compliance, suggest improvements for color contrast and text sizing, and even generate alternative text for images. These tools make it easier for teams to build inclusive products, even when they lack dedicated accessibility expertise.

The prototyping process has been accelerated by AI tools that can generate interactive prototypes from sketches or wireframes. Designers can sketch an idea on paper, photograph it, and have an AI tool transform it into a working prototype within minutes. This rapid iteration capability allows teams to test more ideas and gather user feedback earlier in the design process.

Despite these advances, AI design tools work best when guided by human creativity and judgment. Understanding user needs, making strategic design decisions, and ensuring emotional resonance in interfaces remain distinctly human skills. The most effective approach is treating AI as a powerful collaborator that handles routine tasks while designers focus on strategy, empathy, and innovation.`,
      excerpt:
        "How AI is transforming the UI design process and empowering designers with intelligent tools.",
      aiSummary:
        "This article explores how AI-powered tools are transforming UI design, from generating layouts from text descriptions to automated accessibility auditing and personalized user interfaces.",
      published: false,
      featured: false,
      views: 890,
      readTime: 8,
      categorySlug: "technology",
      tagSlugs: ["ai", "design", "productivity"],
    },
    {
      title: "Zero Trust Security Architecture for Web Applications",
      slug: "zero-trust-security-architecture-web-applications",
      content: `Zero Trust has evolved from a buzzword to a practical security architecture that organizations of all sizes are implementing. The core principle is simple yet powerful: never trust, always verify. Every request, whether from inside or outside the network, must be authenticated, authorized, and continuously validated.

Traditional network security relied on perimeter-based defenses, creating a hard outer shell around a soft interior. Once inside the network, users and applications were largely trusted. This model has proven inadequate in an era of cloud computing, remote work, and sophisticated cyber attacks that can easily bypass perimeter defenses.

Implementing Zero Trust for web applications starts with strong identity management. Every user, device, and service must have a verified identity. Modern identity providers support standards like OAuth 2.0, OpenID Connect, and SAML, enabling secure authentication across distributed systems. Implementing passwordless authentication using WebAuthn and passkeys provides even stronger security with better user experience.

Micro-segmentation is a key Zero Trust principle that limits lateral movement within your infrastructure. Instead of flat networks where any compromised component can access everything, micro-segmentation creates granular boundaries around individual workloads. In a web application context, this means your API server cannot access your database directly but must go through an authenticated gateway.

Continuous monitoring and verification are essential components of a Zero Trust architecture. Rather than granting long-lived access tokens, Zero Trust systems continuously evaluate the risk level of each session. Factors like device health, user behavior patterns, geographic location, and time of access all contribute to real-time risk assessments that can trigger additional authentication steps or revoke access entirely.

API security is particularly critical in Zero Trust architectures. Every API endpoint should validate authentication tokens, enforce rate limiting, validate input data, and log all access attempts. Implementing mutual TLS between services ensures that both the client and server verify each other's identity, preventing man-in-the-middle attacks.

The journey to Zero Trust is gradual and iterative. Most organizations start by implementing strong identity management and multi-factor authentication, then progressively add micro-segmentation, continuous monitoring, and automated response capabilities. The key is to begin with your most critical assets and expand your Zero Trust perimeter over time.`,
      excerpt:
        "A practical guide to implementing Zero Trust security architecture for modern web applications.",
      aiSummary:
        "This article explains Zero Trust security architecture for web applications, covering identity management, micro-segmentation, continuous monitoring, and API security. It provides a practical roadmap for gradual implementation.",
      published: false,
      featured: false,
      views: 67,
      readTime: 10,
      categorySlug: "cybersecurity",
      tagSlugs: ["startup", "productivity"],
    },
  ];

  const createdPosts: { id: string }[] = [];
  for (const post of postsData) {
    const { categorySlug, tagSlugs, ...postData } = post;
    const created = await prisma.post.create({
      data: {
        ...postData,
        authorId: admin.id,
        categoryId: categories[categorySlug].id,
        tags: {
          connect: tagSlugs.map((slug) => ({ id: tags[slug].id })),
        },
      },
    });
    createdPosts.push(created);
  }
  console.log("✅ 12 blog posts created");

  // Create 50 newsletter subscribers
  const domains = [
    "gmail.com",
    "outlook.com",
    "yahoo.com",
    "protonmail.com",
    "icloud.com",
    "hey.com",
    "fastmail.com",
    "hotmail.com",
    "aol.com",
    "mail.com",
  ];
  const firstNames = [
    "james",
    "sarah",
    "michael",
    "emma",
    "david",
    "olivia",
    "daniel",
    "sophia",
    "chris",
    "ava",
    "matthew",
    "isabella",
    "andrew",
    "mia",
    "joshua",
    "charlotte",
    "ryan",
    "amelia",
    "brandon",
    "harper",
    "kevin",
    "evelyn",
    "jason",
    "abigail",
    "tyler",
    "ella",
    "mark",
    "scarlett",
    "adam",
    "grace",
    "nathan",
    "lily",
    "paul",
    "aria",
    "peter",
    "chloe",
    "alex",
    "riley",
    "brian",
    "nora",
    "scott",
    "zoey",
    "eric",
    "hannah",
    "kyle",
    "victoria",
    "sean",
    "luna",
    "jake",
    "stella",
  ];

  const newsletterEmails = firstNames.map(
    (name, i) => `${name}${i + 1}@${domains[i % domains.length]}`
  );

  for (const email of newsletterEmails) {
    await prisma.newsletter.create({
      data: {
        email,
        active: Math.random() > 0.1,
      },
    });
  }
  console.log("✅ 50 newsletter subscribers created");

  // Create 500 page views spread across the last 30 days
  const pages = [
    "/",
    "/blog",
    "/about",
    "/contact",
    "/dashboard",
    ...postsData.map((p) => `/blog/${p.slug}`),
  ];
  const referrers = [
    "https://google.com",
    "https://twitter.com",
    "https://linkedin.com",
    "https://reddit.com",
    "https://github.com",
    "https://dev.to",
    "https://hackernews.com",
    null,
    null,
    null,
  ];
  const countries = [
    "US",
    "UK",
    "DE",
    "FR",
    "IN",
    "BR",
    "CA",
    "AU",
    "JP",
    "KR",
  ];
  const devices = ["desktop", "mobile", "tablet"];

  const pageViewsData = [];
  const now = Date.now();
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;

  for (let i = 0; i < 500; i++) {
    const daysAgo = Math.random() * thirtyDaysMs;
    const page = pages[Math.floor(Math.random() * pages.length)];
    const isPostPage = page.startsWith("/blog/") && page !== "/blog";
    const postSlug = isPostPage ? page.replace("/blog/", "") : null;
    const matchingPost = postSlug
      ? createdPosts[postsData.findIndex((p) => p.slug === postSlug)]
      : null;

    pageViewsData.push({
      postId: matchingPost?.id ?? null,
      page,
      referrer: referrers[Math.floor(Math.random() * referrers.length)],
      country: countries[Math.floor(Math.random() * countries.length)],
      device:
        Math.random() > 0.5
          ? "desktop"
          : devices[Math.floor(Math.random() * devices.length)],
      createdAt: new Date(now - daysAgo),
    });
  }

  await prisma.pageView.createMany({ data: pageViewsData });
  console.log("✅ 500 page views created");

  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
