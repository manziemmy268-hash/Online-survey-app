/**
 * SurveyPay Rwanda - Core Application Logic
 * Senior Developer Refactor v2.0
 */

// --- State Management ---
const state = {
    user: null,
    currentView: 'login',
    surveys: [],
    activeSurvey: null,
    activeSurveyStep: 0,
    responses: []
};

// --- Storage Service ---
const Storage = {
    KEYS: {
        USERS: 'sp_users',
        SURVEYS: 'sp_surveys',
        LOGGED_IN: 'sp_logged_in'
    },
    save(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    },
    get(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    },
    clear(key) {
        localStorage.removeItem(key);
    }
};

// --- Initial Data Seeding ---
const seedSurveys = () => {
    const defaultSurveys = [
        {
            id: 's1',
            title: 'Consumer Habits in Kigali',
            category: 'LIFESTYLE',
            image: 'assets/consumer_habits_kigali_1776080953749.png',
            reward: 1200,
            questions: [
                { type: 'radio', text: 'Where do you shop most often for groceries?', options: ['Kimironko Market', 'Simba Supermarket', 'Sawa City', 'Local Boutique'] },
                { type: 'radio', text: 'What is your preferred payment method in retail?', options: ['Cash', 'MTN MoMo', 'Airtel Money', 'Bank Card'] },
                { type: 'radio', text: 'How often do you visit modern shopping malls in Kigali?', options: ['Daily', 'Weekly', 'Monthly', 'Rarely'] },
                { type: 'radio', text: 'Which product category do you spend most on?', options: ['Food & Beverage', 'Electronics', 'Clothing', 'Home Goods'] },
                { type: 'radio', text: 'Do you prefer local brands or international imports?', options: ['Local Brands', 'International Imports', 'No Preference'] },
                { type: 'radio', text: 'How important is brand loyalty to you when shopping?', options: ['Very Important', 'Somewhat Important', 'Not Important'] },
                { type: 'radio', text: 'Have you ever used online grocery delivery services in Kigali?', options: ['Yes, frequently', 'Yes, once or twice', 'No, never'] },
                { type: 'radio', text: 'What influences your buying decisions the most?', options: ['Price', 'Quality', 'Friends/Family Recommendations', 'Advertisement'] }
            ]
        },
        {
            id: 's2',
            title: 'Digital Literacy 2024',
            category: 'TECHNOLOGY',
            image: 'assets/digital_literacy_rwanda_1776081035409.png',
            reward: 850,
            questions: [
                { type: 'radio', text: 'How many hours a day do you spend online?', options: ['1-2 hours', '3-5 hours', '6+ hours', 'Rarely'] },
                { type: 'radio', text: 'Which primary device do you use for work?', options: ['Smartphone', 'Laptop', 'Tablet', 'Desktop'] },
                { type: 'radio', text: 'Have you ever taken an online course (Coursera, etc)?', options: ['Yes, completed', 'Yes, started', 'No, never'] },
                { type: 'radio', text: 'What is your main source of news?', options: ['Social Media', 'News Websites', 'Radio/TV', 'Newspapers'] },
                { type: 'radio', text: 'Do you use AI tools like ChatGPT in your daily life?', options: ['Yes, daily', 'Yes, occasionally', 'No, never'] },
                { type: 'radio', text: 'How reliant are you on cloud storage for your data?', options: ['Extremely reliant', 'Somewhat reliant', 'Not reliant, I use local storage'] },
                { type: 'radio', text: 'Do you know how to identify a phishing email?', options: ['Yes, completely confident', 'Somewhat confident', 'Not confident at all'] }
            ]
        },
        {
            id: 's3',
            title: 'Public Transport Satisfaction',
            category: 'TRANSPORT',
            image: 'assets/public_transport_kigali_1776081127322.png',
            reward: 1500,
            questions: [
                { type: 'radio', text: 'How often do you use public transport in Kigali?', options: ['Daily', 'Weekly', 'Occasinally', 'Never'] },
                { type: 'radio', text: 'How do you rate the Tap&Go card system convenience?', options: ['Excellent', 'Good', 'Fair', 'Poor'] },
                { type: 'radio', text: 'What is the biggest challenge in your daily commute?', options: ['Long Queues', 'Bus Delays', 'Bus Condition', 'Pricing'] },
                { type: 'radio', text: 'Would you support more electric buses in the city?', options: ['Strongly Support', 'Support', 'Neutral', 'Opposed'] },
                { type: 'radio', text: 'Do you feel safe when using public buses late at night?', options: ['Very Safe', 'Somewhat Safe', 'Unsafe', 'I don\'t travel at night'] },
                { type: 'radio', text: 'Have you ever used a motorcycle taxi (Moto) for daily commute?', options: ['Yes, often', 'Yes, occasionally', 'No'] },
                { type: 'radio', text: 'What is your opinion on dedicated bus lanes?', options: ['Would greatly improve traffic', 'Would partially help', 'Unnecessary'] }
            ]
        },
        {
            id: 's4',
            title: 'Modern Agriculture & AgTech',
            category: 'AGRICULTURE',
            image: 'assets/agriculture_rwanda_modern_1776081557127.png',
            reward: 2000,
            questions: [
                { type: 'radio', text: 'Do you or your family own farming land?', options: ['Yes', 'No'] },
                { type: 'radio', text: 'Are you aware of modern irrigation techniques used in Rwanda?', options: ['Very aware', 'Somewhat aware', 'Not aware'] },
                { type: 'radio', text: 'Would you invest in a Rwandan AgTech startup?', options: ['Yes', 'Maybe', 'No'] },
                { type: 'radio', text: 'Which crop do you think has the most export potential?', options: ['Coffee', 'Tea', 'Macadamia', 'Chili'] },
                { type: 'radio', text: 'Do you believe smart farming (IoT) is the future of African agriculture?', options: ['Strongly Agree', 'Agree', 'Disagree', 'Not Sure'] },
                { type: 'radio', text: 'How can youth be encouraged to join the agriculture sector?', options: ['Better funding', 'Technology integration', 'Training programs', 'Higher wages'] },
                { type: 'radio', text: 'Do you consume organic products regularly?', options: ['Yes, always', 'Sometimes', 'Never', 'Cannot distinguish'] }
            ]
        },
        {
            id: 's5',
            title: 'Environment & Conservation',
            category: 'NATURE',
            image: 'assets/environment_conservation_rwanda_1776081588341.png',
            reward: 1800,
            questions: [
                { type: 'radio', text: 'How often do you visit Rwanda\'s National Parks?', options: ['Once a year', 'Every few years', 'Never'] },
                { type: 'radio', text: 'How important is Gorilla conservation to our economy?', options: ['Critical', 'Important', 'Moderate', 'Not sure'] },
                { type: 'radio', text: 'Do you practice plastic waste separation at home?', options: ['Always', 'Sometimes', 'Never'] },
                { type: 'radio', text: 'What is the most beautiful park in Rwanda?', options: ['Akagera', 'Nyungwe', 'Volcanoes', 'Gishwati-Mukura'] },
                { type: 'radio', text: 'Are you involved in local Umuganda activities?', options: ['Always', 'Usually', 'Rarely', 'Never'] },
                { type: 'radio', text: 'Do you think tree planting initiatives are sufficient?', options: ['Yes, they are enough', 'We need to do more', 'I am unaware of them'] },
                { type: 'radio', text: 'How concerned are you about climate change impacts locally?', options: ['Very Concerned', 'Somewhat Concerned', 'Not Concerned'] }
            ]
        },
        {
            id: 's6',
            title: 'Banking & Fintech Trends',
            category: 'FINANCE',
            image: 'assets/banking_fintech_rwanda_1776081780645.png',
            reward: 1400,
            questions: [
                { type: 'radio', text: 'Do you have a traditional bank account?', options: ['Yes', 'No'] },
                { type: 'radio', text: 'Which mobile money service do you use most?', options: ['MTN MoMo', 'Airtel Money', 'Both equally'] },
                { type: 'radio', text: 'How often do you use a physical ATM?', options: ['Weekly', 'Monthly', 'Rarely'] },
                { type: 'radio', text: 'Is digital banking safer than carrying cash?', options: ['Strongly Agree', 'Agree', 'Disagree', 'Strongly Disagree'] },
                { type: 'radio', text: 'Do you use digital lending services (e.g. MoMo Advance)?', options: ['Frequently', 'Sometimes', 'Never'] },
                { type: 'radio', text: 'How do you prefer to pay utility bills (water, electricity)?', options: ['Mobile Money', 'Bank App', 'Agent Outlet', 'Bank Branch'] },
                { type: 'radio', text: 'Do you invest in government bonds or local stocks?', options: ['Yes', 'Planning to', 'No'] }
            ]
        },
        {
            id: 's7',
            title: 'E-commerce & Online Shopping',
            category: 'SHOPPING',
            image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=800&auto=format&fit=crop',
            reward: 1600,
            questions: [
                { type: 'radio', text: 'Have you ever bought an item online from a local e-commerce platform?', options: ['Yes, multiple times', 'Yes, once', 'No, never'] },
                { type: 'radio', text: 'What is your biggest concern when buying products online?', options: ['Quality differs from photo', 'Delivery delays', 'Payment security', 'Return policies'] },
                { type: 'radio', text: 'Do you prefer paying before or after delivery?', options: ['Pay before (Card/MoMo)', 'Pay on Delivery'] },
                { type: 'radio', text: 'Do you purchase goods from international sites (Amazon, AliExpress)?', options: ['Yes, frequently', 'Sometimes', 'Rarely', 'Never'] },
                { type: 'radio', text: 'How much are you willing to pay for same-day delivery?', options: ['Above 2000 RWF', '1000 - 2000 RWF', 'Below 1000 RWF', 'Nothing, it should be free'] },
                { type: 'radio', text: 'What items do you mostly buy online?', options: ['Electronics/Gadgets', 'Clothing/Fashion', 'Groceries', 'Beauty Products'] }
            ]
        },
        {
            id: 's8',
            title: 'Entertainment & Streaming Media',
            category: 'MEDIA',
            image: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?q=80&w=800&auto=format&fit=crop',
            reward: 1300,
            questions: [
                { type: 'radio', text: 'Which streaming service do you use the most?', options: ['Netflix', 'YouTube Premium', 'Spotify/Apple Music', 'Free/Local platforms'] },
                { type: 'radio', text: 'How do you usually watch movies or series?', options: ['Smart TV', 'Laptop', 'Smartphone', 'Cinema'] },
                { type: 'radio', text: 'Do you pay for premium subscriptions?', options: ['Yes, multiple', 'Yes, only one', 'No, I use free tiers/sharing'] },
                { type: 'radio', text: 'How often do you listen to local Rwandan music?', options: ['Daily', 'Weekly', 'Occasionally', 'Rarely'] },
                { type: 'radio', text: 'Do you play video games on console, PC, or mobile?', options: ['Mobile Games', 'Console/PC Games', 'Both', 'Neither'] },
                { type: 'radio', text: 'Do you prefer dubbing or subtitles when watching foreign content?', options: ['Subtitles', 'Dubbing', 'I only watch content in languages I understand'] }
            ]
        },
        {
            id: 's9',
            title: 'Healthcare & Wellness',
            category: 'HEALTH',
            image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=800&auto=format&fit=crop',
            reward: 1750,
            questions: [
                { type: 'radio', text: 'Do you have health insurance (Mutuelle de Santé, RSSB, private)?', options: ['Yes, public', 'Yes, private', 'No'] },
                { type: 'radio', text: 'How often do you go for a general medical check-up?', options: ['Twice a year or more', 'Once a year', 'Only when I am sick', 'Never'] },
                { type: 'radio', text: 'Do you regularly engage in physical exercise (gym, running, Car Free Day)?', options: ['3+ times a week', '1-2 times a week', 'Rarely', 'Never'] },
                { type: 'radio', text: 'How do you track your health and fitness?', options: ['Smartwatch/Fitness Tracker', 'Mobile Apps', 'Mental tracking', 'I do not track'] },
                { type: 'radio', text: 'What is your opinion on telemedicine (consulting a doctor via phone/app)?', options: ['Extremely useful', 'Somewhat useful', 'Prefer in-person visits'] },
                { type: 'radio', text: 'How would you rate your typical quality of sleep?', options: ['Excellent', 'Good', 'Fair', 'Poor'] }
            ]
        },
        {
            id: 's10',
            title: 'Education Technologies (EdTech)',
            category: 'EDUCATION',
            image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=800&auto=format&fit=crop',
            reward: 1900,
            questions: [
                { type: 'radio', text: 'Do you think E-learning platforms can fully replace physical classrooms?', options: ['Yes, fully', 'No, only partially', 'No, physical classrooms are essential'] },
                { type: 'radio', text: 'What is the biggest barrier to online education in Rwanda?', options: ['Internet Cost', 'Lack of Devices', 'Quality of Content', 'Language Barriers'] },
                { type: 'radio', text: 'Have you paid for an online certificate or course in the past year?', options: ['Yes', 'No, but I plan to', 'No, I use free resources'] },
                { type: 'radio', text: 'Do you believe coding should be a mandatory subject in primary schools?', options: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree'] },
                { type: 'radio', text: 'Which skill do you think is currently most valuable in the job market?', options: ['Software Development', 'Data Analysis', 'Digital Marketing', 'Soft Skills/Communication'] }
            ]
        }
    ];

    // Merge with any existing surveys in storage to preserve admin-added ones
    const stored = Storage.get(Storage.KEYS.SURVEYS) || [];
    const merged = [...defaultSurveys];
    
    stored.forEach(s => {
        if (!merged.find(m => m.id === s.id)) merged.push(s);
    });

    Storage.save(Storage.KEYS.SURVEYS, merged);
    state.surveys = merged;
};

// --- View Controllers ---

const navigate = (view) => {
    state.currentView = view;
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

const showToast = (message, type = 'success') => {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${type === 'success' ? '✅' : '❌'}</span> ${message}`;
    container.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

// --- UI Components ---

const Navbar = () => {
    const nav = document.createElement('nav');
    nav.className = 'navbar';
    nav.innerHTML = `
        <div class="nav-logo" style="cursor: pointer">SurveyPay Rwanda</div>
        <div class="nav-user">
            <span style="font-weight: 600; font-size: 0.9rem">${state.user.name}</span>
            <div class="avatar">${state.user.name.charAt(0)}</div>
            <button id="logout-btn" style="background: none; border: none; font-size: 1.2rem; cursor: pointer; padding: 5px">Logout</button>
        </div>
    `;

    nav.querySelector('.nav-logo').addEventListener('click', () => navigate('dashboard'));
    nav.querySelector('#logout-btn').addEventListener('click', () => {
        state.user = null;
        Storage.clear(Storage.KEYS.LOGGED_IN);
        navigate('login');
        showToast('Logged out successfully');
    });

    return nav;
};

const LoginView = () => {
    const div = document.createElement('div');
    div.className = 'auth-card slide-up';
    div.innerHTML = `
        <div style="text-align: center; margin-bottom: 2rem">
            <h1 style="color: var(--primary); margin-bottom: 0.5rem">Welcome Back</h1>
            <p style="color: var(--text-soft)">Sign in to continue earning RWF</p>
        </div>
        <form id="login-form">
            <div class="form-group">
                <label>Email Address</label>
                <input type="email" id="login-email" placeholder="name@example.com" required>
            </div>
            <div class="form-group">
                <label>Password</label>
                <input type="password" id="login-password" placeholder="••••••••" required>
            </div>
            <button type="submit" class="btn btn-primary" style="width: 100%">Sign In</button>
        </form>
        <p style="text-align: center; margin-top: 1.5rem; font-size: 0.9rem; color: var(--text-soft)">
            Don't have an account? <a href="#" id="to-register" style="color: var(--primary); font-weight: 700">Join Now</a>
        </p>
    `;

    div.querySelector('#to-register').addEventListener('click', (e) => {
        e.preventDefault();
        navigate('register');
    });

    div.querySelector('#login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const users = Storage.get(Storage.KEYS.USERS) || [];

        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            state.user = user;
            Storage.save(Storage.KEYS.LOGGED_IN, user);
            navigate('dashboard');
            showToast(`Welcome back, ${user.name.split(' ')[0]}!`);
        } else {
            showToast('Invalid email or password', 'error');
        }
    });

    return div;
};

const RegisterView = () => {
    const div = document.createElement('div');
    div.className = 'auth-card slide-up';
    div.innerHTML = `
        <div style="text-align: center; margin-bottom: 2rem">
            <h1 style="color: var(--secondary); margin-bottom: 0.5rem">Join the Community</h1>
            <p style="color: var(--text-soft)">Start getting paid for your opinions</p>
        </div>
        <form id="reg-form">
             <div class="form-group">
                <label>Full Name</label>
                <input type="text" id="reg-name" placeholder="John Doe" required>
            </div>
            <div class="form-group">
                <label>Email Address</label>
                <input type="email" id="reg-email" placeholder="name@example.com" required>
            </div>
            <div class="form-group">
                <label>MTN/Airtel Phone</label>
                <input type="tel" id="reg-phone" placeholder="078..." required>
            </div>
            <div class="form-group">
                <label>Password</label>
                <input type="password" id="reg-password" placeholder="••••••••" required>
            </div>
            <button type="submit" class="btn btn-primary" style="width: 100%; background: var(--secondary)">Create Account</button>
        </form>
        <p style="text-align: center; margin-top: 1.5rem; font-size: 0.9rem; color: var(--text-soft)">
            Already have an account? <a href="#" id="to-login" style="color: var(--secondary); font-weight: 700">Sign In</a>
        </p>
    `;

    div.querySelector('#to-login').addEventListener('click', (e) => {
        e.preventDefault();
        navigate('login');
    });

    div.querySelector('#reg-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const users = Storage.get(Storage.KEYS.USERS) || [];
        const newUser = {
            id: Date.now().toString(),
            name: document.getElementById('reg-name').value,
            email: document.getElementById('reg-email').value,
            phone: document.getElementById('reg-phone').value,
            password: document.getElementById('reg-password').value,
            balance: 0,
            completedSurveys: [],
            isAdmin: document.getElementById('reg-email').value.includes('admin')
        };

        if (users.find(u => u.email === newUser.email)) {
            showToast('Email already in use', 'error');
            return;
        }

        users.push(newUser);
        Storage.save(Storage.KEYS.USERS, users);
        state.user = newUser;
        Storage.save(Storage.KEYS.LOGGED_IN, newUser);
        navigate('dashboard');
        showToast('Registration successful!');
    });

    return div;
};

const DashboardView = () => {
    const dash = document.createElement('div');
    dash.className = 'slide-up';
    
    const available = state.surveys.filter(s => !state.user.completedSurveys.includes(s.id));

    dash.innerHTML = `
        <header style="margin-bottom: 2rem">
            <h2 style="font-size: 1.75rem">Hello, ${state.user.name.split(' ')[0]}! 👋</h2>
            <p style="color: var(--text-soft)">You have ${available.length} potential rewards waiting.</p>
        </header>

        <div class="card balance-card">
            <div style="opacity: 0.8; font-size: 0.9rem; font-weight: 600">WALLET BALANCE</div>
            <div class="balance-amount">${state.user.balance.toLocaleString()} RWF</div>
            <button class="btn" id="withdraw-btn" style="background: rgba(255,255,255,0.15); color: white; border: 1px solid rgba(255,255,255,0.3); padding: 0.5rem 1.25rem; font-size: 0.85rem">
                Withdraw Earnings
            </button>
        </div>

        <h3 style="margin: 2.5rem 0 1.5rem 0; display: flex; align-items: center; gap: 0.5rem">
            <span style="color: var(--primary)">🔥</span> Premium Surveys
        </h3>

        <div id="survey-grid" style="display: grid; gap: 1.5rem">
            ${available.length === 0 ? `
                <div class="card" style="text-align: center; padding: 3rem">
                    <p style="color: var(--text-soft)">All caught up! Check back later for new surveys.</p>
                </div>
            ` : available.map(s => `
                <div class="card survey-card fade-in" data-id="${s.id}">
                    <img src="${s.image || 'https://via.placeholder.com/400x200?text=Survey'}" class="survey-img" alt="${s.title}">
                    <div class="survey-content">
                        <span class="survey-badge">${s.category || 'GENERAL'}</span>
                        <h3 style="margin-bottom: 0.5rem">${s.title}</h3>
                        <div style="display: flex; justify-content: space-between; align-items: center">
                            <span style="color: var(--secondary); font-weight: 800; font-size: 1.1rem">${s.reward} RWF</span>
                            <button class="btn btn-primary start-btn" data-id="${s.id}">Start Survey</button>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    dash.querySelector('#withdraw-btn').addEventListener('click', () => navigate('wallet'));
    
    dash.querySelectorAll('.start-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const sid = btn.getAttribute('data-id');
            state.activeSurvey = state.surveys.find(s => s.id === sid);
            state.activeSurveyStep = 0;
            state.responses = [];
            navigate('survey');
        });
    });

    return dash;
};

const SurveyView = () => {
    const div = document.createElement('div');
    const survey = state.activeSurvey;
    const current = state.activeSurveyStep;
    const total = survey.questions.length;
    const question = survey.questions[current];
    const progress = ((current + 1) / total) * 100;

    div.className = 'slide-up';
    div.innerHTML = `
        <div class="card" style="padding: 2rem">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem">
                <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-soft)">STEP ${current + 1} OF ${total}</span>
                <span style="font-size: 0.85rem; font-weight: 700; color: var(--primary)">${Math.round(progress)}%</span>
            </div>
            
            <div class="progress-container">
                <div class="progress-bar" style="width: ${progress}%"></div>
            </div>

            <h2 style="margin-bottom: 2rem; line-height: 1.4">${question.text}</h2>

            <div class="option-group">
                ${question.options.map((opt, i) => `
                    <label class="radio-option" for="q-${i}">
                        <input type="radio" name="response" id="q-${i}" value="${opt}">
                        <span style="font-weight: 500">${opt}</span>
                    </label>
                `).join('')}
            </div>

            <button class="btn btn-primary" id="next-btn" disabled style="width: 100%; height: 56px">
                ${current === total - 1 ? 'Finish Survey & Claim' : 'Continue'}
            </button>
        </div>
    `;

    const nextBtn = div.querySelector('#next-btn');
    div.querySelectorAll('input[name="response"]').forEach(input => {
        input.addEventListener('change', () => {
            div.querySelectorAll('.radio-option').forEach(el => el.classList.remove('selected'));
            input.parentElement.classList.add('selected');
            nextBtn.disabled = false;
        });
    });

    nextBtn.addEventListener('click', () => {
        const val = div.querySelector('input[name="response"]:checked').value;
        state.responses.push(val);

        if (state.activeSurveyStep < total - 1) {
            state.activeSurveyStep++;
            render();
        } else {
            completeSurvey();
        }
    });

    return div;
};

const completeSurvey = () => {
    const reward = state.activeSurvey.reward;
    state.user.balance += reward;
    state.user.completedSurveys.push(state.activeSurvey.id);

    // Persist
    const users = Storage.get(Storage.KEYS.USERS);
    const idx = users.findIndex(u => u.id === state.user.id);
    users[idx] = state.user;
    Storage.save(Storage.KEYS.USERS, users);
    Storage.save(Storage.KEYS.LOGGED_IN, state.user);

    const app = document.getElementById('app');
    const success = document.createElement('div');
    success.className = 'container slide-up';
    success.innerHTML = `
        <div class="card" style="text-align: center; padding: 4rem 2rem">
            <div style="font-size: 5rem; margin-bottom: 1.5rem">🎉</div>
            <h2 style="color: var(--secondary); font-size: 2rem; margin-bottom: 1rem">Awesome Work!</h2>
            <p style="color: var(--text-soft); margin-bottom: 2rem">You've successfully earned <strong>${reward.toLocaleString()} RWF</strong>.</p>
            <div style="background: var(--bg-main); padding: 1.5rem; border-radius: var(--radius-sm); margin-bottom: 2rem">
                <span style="display: block; font-size: 0.75rem; color: var(--text-soft); font-weight: 700; margin-bottom: 0.5rem">NEW BALANCE</span>
                <span style="font-size: 1.5rem; font-weight: 800; color: var(--text-deep)">${state.user.balance.toLocaleString()} RWF</span>
            </div>
            <button class="btn btn-primary" id="done-btn" style="width: 100%">Back to Dashboard</button>
        </div>
    `;

    success.querySelector('#done-btn').addEventListener('click', () => navigate('dashboard'));
    app.querySelector('.container').replaceWith(success);
    showToast('Reward added to your wallet!');
};

const WalletView = () => {
    const div = document.createElement('div');
    div.className = 'slide-up';
    div.innerHTML = `
        <div class="card" style="padding: 2.5rem">
            <h2 style="margin-bottom: 0.5rem">Withdraw Cash</h2>
            <p style="color: var(--text-soft); margin-bottom: 2rem">Instant transfer to MTN/Airtel Wallet</p>

            <div style="background: #1e293b; color: #fbbf24; padding: 0.75rem 1.25rem; border-radius: 8px; font-weight: 800; font-size: 0.85rem; width: fit-content; margin-bottom: 2rem">
                📱 MOBILE MONEY ONLY
            </div>

            <form id="withdraw-form">
                <div class="form-group">
                    <label>Amount (Min 500 RWF)</label>
                    <input type="number" id="w-amount" min="500" max="${state.user.balance}" value="${state.user.balance}" required>
                </div>
                <div class="form-group">
                    <label>Recipient Number</label>
                    <input type="tel" id="w-phone" value="${state.user.phone}" required>
                </div>
                <button type="submit" class="btn btn-primary" style="width: 100%; height: 56px" ${state.user.balance < 500 ? 'disabled' : ''}>
                    ${state.user.balance < 500 ? 'Insufficient Balance' : 'Confirm Withdrawal'}
                </button>
            </form>
            <button class="btn btn-outline" style="width: 100%; margin-top: 1rem" id="w-back">Cancel</button>
        </div>
    `;

    div.querySelector('#w-back').addEventListener('click', () => navigate('dashboard'));
    
    div.querySelector('#withdraw-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const amt = parseInt(document.getElementById('w-amount').value);
        
        const btn = div.querySelector('button[type="submit"]');
        btn.disabled = true;
        btn.innerHTML = '<div class="spinner"></div> Processing...';

        setTimeout(() => {
            state.user.balance -= amt;
            const users = Storage.get(Storage.KEYS.USERS);
            const idx = users.findIndex(u => u.id === state.user.id);
            users[idx] = state.user;
            Storage.save(Storage.KEYS.USERS, users);
            Storage.save(Storage.KEYS.LOGGED_IN, state.user);

            div.innerHTML = `
                <div class="card slide-up" style="text-align: center; padding: 3rem">
                    <div style="font-size: 4rem; margin-bottom: 1.5rem">✅</div>
                    <h2 style="margin-bottom: 1rem">Transfer Initiated</h2>
                    <p style="color: var(--text-soft); margin-bottom: 2rem">${amt.toLocaleString()} RWF is on its way to ${document.getElementById('w-phone').value}.</p>
                    <button class="btn btn-primary" id="final-back" style="width: 100%">Dashboard</button>
                </div>
            `;
            div.querySelector('#final-back').addEventListener('click', () => navigate('dashboard'));
            showToast('Transfer successful!');
        }, 2000);
    });

    return div;
};

// --- Core Renderer ---

const render = () => {
    const app = document.getElementById('app');
    app.innerHTML = '';

    if (state.user) {
        app.appendChild(Navbar());
    }

    const container = document.createElement('div');
    container.className = 'container';

    let view;
    switch (state.currentView) {
        case 'login': view = LoginView(); break;
        case 'register': view = RegisterView(); break;
        case 'dashboard': view = DashboardView(); break;
        case 'survey': view = SurveyView(); break;
        case 'wallet': view = WalletView(); break;
        default: view = LoginView();
    }

    container.appendChild(view);
    app.appendChild(container);
};

// --- Initialization ---

const init = () => {
    seedSurveys();
    
    const saved = Storage.get(Storage.KEYS.LOGGED_IN);
    if (saved) {
        const users = Storage.get(Storage.KEYS.USERS) || [];
        const refreshed = users.find(u => u.id === saved.id);
        if (refreshed) {
            state.user = refreshed;
            state.currentView = 'dashboard';
        }
    }

    render();
    
    // Remove loader
    const loader = document.querySelector('.initial-loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 500);
    }
};

document.addEventListener('DOMContentLoaded', init);
