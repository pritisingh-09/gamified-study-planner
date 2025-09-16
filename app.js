// Enhanced Gamified Smart Study Planner with AI Chatbot Companion - Fixed
class GamifiedStudyPlanner {
    constructor() {
        this.tasks = [];
        this.userProgress = {
            level: 1,
            xp: 0,
            totalXP: 0,
            currentStreak: 0,
            bestStreak: 0,
            totalTasksCompleted: 0,
            rank: 'Beginner',
            lastStudyDate: null,
            totalPoints: 0
        };
        
        this.badges = [
            {
                id: 'first_steps',
                name: 'First Steps',
                description: 'Complete your first task',
                icon: '🎯',
                unlocked: false,
                condition: (progress) => progress.totalTasksCompleted >= 1
            },
            {
                id: 'on_fire',
                name: 'On Fire',
                description: 'Maintain a 7-day streak',
                icon: '🔥',
                unlocked: false,
                condition: (progress) => progress.currentStreak >= 7
            },
            {
                id: 'scholar',
                name: 'Scholar',
                description: 'Complete 25 tasks',
                icon: '🎓',
                unlocked: false,
                condition: (progress) => progress.totalTasksCompleted >= 25
            },
            {
                id: 'master_planner',
                name: 'Master Planner',
                description: 'Complete 100 tasks',
                icon: '👑',
                unlocked: false,
                condition: (progress) => progress.totalTasksCompleted >= 100
            },
            {
                id: 'speed_runner',
                name: 'Speed Runner',
                description: 'Complete 5 tasks in one day',
                icon: '⚡',
                unlocked: false,
                condition: () => this.getTasksCompletedToday() >= 5
            },
            {
                id: 'night_owl',
                name: 'Night Owl',
                description: 'Complete tasks after 10PM',
                icon: '🦉',
                unlocked: false,
                condition: () => this.hasCompletedTaskAfter(22)
            },
            {
                id: 'early_bird',
                name: 'Early Bird',
                description: 'Complete tasks before 8AM',
                icon: '🐦',
                unlocked: false,
                condition: () => this.hasCompletedTaskBefore(8)
            },
            {
                id: 'perfectionist',
                name: 'Perfectionist',
                description: 'Complete all tasks on time for a week',
                icon: '💎',
                unlocked: false,
                condition: () => this.hasWeeklyPerfectRecord()
            }
        ];
        
        // Updated categories with "Other" option
        this.categories = [
            {name: "Mathematics", color: "#1FB8CD"},
            {name: "Physics", color: "#FFC185"},
            {name: "Chemistry", color: "#B4413C"},
            {name: "Biology", color: "#ECEBD5"},
            {name: "History", color: "#5D878F"},
            {name: "English", color: "#DB4545"},
            {name: "Computer Science", color: "#D2BA4C"},
            {name: "Other", color: "#999999"}
        ];
        
        // Chatbot characters from the provided data
        this.chatbotCharacters = [
            {
                id: "studybot",
                name: "StudyBot",
                emoji: "🤖",
                personality: "tech-savvy and logical",
                greeting: "Hello! I'm StudyBot, your AI study companion. I'll help you optimize your learning with data-driven insights!",
                responses: {
                    motivation: [
                        "Based on your progress data, you're doing great! Keep maintaining that momentum.",
                        "Your completion rate shows consistent improvement. That's the power of systematic learning!",
                        "I've analyzed your study patterns - you perform best during your scheduled peak hours."
                    ],
                    advice: [
                        "Try the Pomodoro Technique: 25 minutes focused study, 5-minute breaks.",
                        "Based on cognitive science, spacing out your reviews improves retention by 40%.",
                        "Your brain processes information better when you switch between subjects every 90 minutes."
                    ]
                }
            },
            {
                id: "wiseowl", 
                name: "WiseOwl",
                emoji: "🦉",
                personality: "scholarly and wise",
                greeting: "Greetings, young scholar! I am WiseOwl, here to guide you on your academic journey with wisdom from ages past.",
                responses: {
                    motivation: [
                        "Remember, every master was once a beginner. Your dedication today shapes tomorrow's expertise.",
                        "The path of learning is long, but each step brings you closer to wisdom.",
                        "In the words of ancient scholars: 'Knowledge is the only treasure that increases when shared.'"
                    ],
                    advice: [
                        "True learning comes from understanding, not memorization. Seek to comprehend the 'why' behind each concept.",
                        "Create connections between new knowledge and what you already know - this builds lasting understanding.",
                        "Regular review is the key to retention. What you learn today, revisit tomorrow, next week, and next month."
                    ]
                }
            },
            {
                id: "studycat",
                name: "StudyCat", 
                emoji: "😸",
                personality: "playful and encouraging",
                greeting: "Hey there! I'm StudyCat, your fun study buddy! Let's make learning an adventure together! 🎉",
                responses: {
                    motivation: [
                        "You're pawsome! Look at all those tasks you've completed! 🐾",
                        "Every small step counts - you're building amazing study habits!",
                        "I'm so proud of your progress! You're becoming a study superstar! ⭐"
                    ],
                    advice: [
                        "Make studying fun! Try turning facts into songs or creating colorful mind maps.",
                        "Take breaks to play and move around - your brain needs time to process all that learning!",
                        "Celebrate your wins, no matter how small! You deserve recognition for your hard work!"
                    ]
                }
            },
            {
                id: "starguide",
                name: "StarGuide",
                emoji: "⭐", 
                personality: "inspiring and motivational",
                greeting: "Welcome, future achiever! I'm StarGuide, here to illuminate your path to academic excellence!",
                responses: {
                    motivation: [
                        "Your potential is unlimited! Every challenge is an opportunity to shine brighter.",
                        "You have the power to achieve anything you set your mind to. Believe in yourself!",
                        "Your consistent effort is building the foundation for extraordinary success!"
                    ],
                    advice: [
                        "Set clear, specific goals for each study session. Clarity breeds excellence.",
                        "Visualize your success - see yourself mastering each subject with confidence.",
                        "Transform obstacles into stepping stones. Every difficulty overcome makes you stronger!"
                    ]
                }
            },
            {
                id: "studypup",
                name: "StudyPup",
                emoji: "🐶",
                personality: "energetic and friendly", 
                greeting: "Woof! Hi there! I'm StudyPup, your energetic study companion! Ready to learn and have fun?",
                responses: {
                    motivation: [
                        "You're doing fantastic! Your energy and enthusiasm are contagious!",
                        "Way to go! You're tackling those tasks like a champion!",
                        "I'm so excited about your progress! You're learning so much every day!"
                    ],
                    advice: [
                        "Stay active while studying! Try walking around when you read or do jumping jacks between topics.",
                        "Study with friends sometimes - learning together can be super fun and effective!",
                        "Don't forget to reward yourself! You've earned treats for all your hard work!"
                    ]
                }
            }
        ];
        
        this.motivationalQuotes = [
            "The expert in anything was once a beginner. 🌟",
            "Success is the sum of small efforts repeated daily. 💪",
            "Don't watch the clock; do what it does. Keep going! ⏰",
            "The future depends on what you do today. 🚀",
            "Education is the key to unlocking your potential! 🔑",
            "Every master was once a disaster. Keep practicing! ✨",
            "Progress, not perfection, is the goal. 🎯",
            "Your only limit is your mind. Think bigger! 🧠",
            "Great things never come from comfort zones. 🌈",
            "Believe in yourself and you're halfway there! 💫"
        ];
        
        this.currentView = 'dashboard';
        this.currentTaskId = null;
        this.isEditing = false;
        this.charts = {};
        
        this.levelThresholds = [0, 100, 250, 500, 1000, 1750, 2750, 4250, 6500, 10000, 15000];
        this.rankNames = ['Beginner', 'Student', 'Scholar', 'Expert', 'Master', 'Guru', 'Legend', 'Mythic', 'Immortal', 'Transcendent'];
        
        // Chatbot system
        this.chatHistory = [];
        this.currentCharacter = null;
        this.isChatOpen = false;
        this.isTyping = false;
        
        // Calendar navigation
        this.currentCalendarDate = new Date();
    }

    // Initialization
    init() {
        this.loadData();
        this.setupEventListeners();
        this.populateSelects();
        this.updateAllUI();
        this.checkAndUpdateStreak();
        this.initializeChatbot();
        this.showWelcomeMessage();
    }

    loadData() {
        try {
            // Load tasks
            const savedTasks = localStorage.getItem('gamifiedPlannerTasks');
            if (savedTasks) {
                this.tasks = JSON.parse(savedTasks);
            } else {
                this.loadSampleData();
            }

            // Load user progress
            const savedProgress = localStorage.getItem('gamifiedPlannerProgress');
            if (savedProgress) {
                this.userProgress = { ...this.userProgress, ...JSON.parse(savedProgress) };
            }

            // Load badges
            const savedBadges = localStorage.getItem('gamifiedPlannerBadges');
            if (savedBadges) {
                const savedBadgeData = JSON.parse(savedBadges);
                this.badges.forEach(badge => {
                    const savedBadge = savedBadgeData.find(b => b.id === badge.id);
                    if (savedBadge) {
                        badge.unlocked = savedBadge.unlocked;
                        badge.unlockedDate = savedBadge.unlockedDate;
                    }
                });
            }

            // Load theme
            const savedTheme = localStorage.getItem('gamifiedPlannerTheme');
            if (savedTheme) {
                this.applyTheme(savedTheme);
            }

            // Load chatbot data
            const savedChatHistory = localStorage.getItem('gamifiedPlannerChatHistory');
            if (savedChatHistory) {
                this.chatHistory = JSON.parse(savedChatHistory);
            }

            const savedCharacter = localStorage.getItem('gamifiedPlannerChatCharacter');
            if (savedCharacter) {
                this.currentCharacter = this.chatbotCharacters.find(char => char.id === savedCharacter) || this.chatbotCharacters[0];
            } else {
                this.currentCharacter = this.chatbotCharacters[0];
            }

        } catch (error) {
            console.error('Error loading data:', error);
            this.loadSampleData();
            this.currentCharacter = this.chatbotCharacters[0];
        }
    }

    loadSampleData() {
        this.tasks = [
            {
                id: 1,
                title: "Mathematics Assignment",
                description: "Complete calculus problems chapter 5",
                category: "Mathematics",
                priority: "high",
                deadline: "2025-09-20",
                estimatedTime: "2 hours",
                completed: false,
                createdDate: "2025-09-16",
                xpReward: 50
            },
            {
                id: 2,
                title: "Physics Lab Report",
                description: "Write lab report on motion experiments",
                category: "Physics",
                priority: "medium",
                deadline: "2025-09-22",
                estimatedTime: "3 hours",
                completed: false,
                createdDate: "2025-09-16",
                xpReward: 30
            },
            {
                id: 3,
                title: "Personal Project",
                description: "Work on portfolio website",
                category: "Other",
                priority: "low",
                deadline: "2025-09-25",
                estimatedTime: "4 hours",
                completed: true,
                createdDate: "2025-09-10",
                completedDate: "2025-09-15",
                xpReward: 20
            }
        ];
        this.saveData();
    }

    saveData() {
        try {
            localStorage.setItem('gamifiedPlannerTasks', JSON.stringify(this.tasks));
            localStorage.setItem('gamifiedPlannerProgress', JSON.stringify(this.userProgress));
            localStorage.setItem('gamifiedPlannerBadges', JSON.stringify(this.badges));
            localStorage.setItem('gamifiedPlannerChatHistory', JSON.stringify(this.chatHistory));
            if (this.currentCharacter) {
                localStorage.setItem('gamifiedPlannerChatCharacter', this.currentCharacter.id);
            }
        } catch (error) {
            console.error('Error saving data:', error);
        }
    }

    // Event Listeners - Fixed
    setupEventListeners() {
        // Theme toggle
        this.bindEvent('themeToggle', 'click', () => this.toggleTheme());

        // Navigation - Fixed event handling
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const view = tab.getAttribute('data-view');
                if (view) {
                    this.switchView(view);
                }
            });
        });

        // Task management
        this.bindEvent('addTaskBtn', 'click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.openTaskModal();
        });
        
        this.bindEvent('fab', 'click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.openTaskModal();
        });
        
        this.bindEvent('modalClose', 'click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.closeTaskModal();
        });
        
        this.bindEvent('cancelBtn', 'click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.closeTaskModal();
        });
        
        this.bindEvent('taskForm', 'submit', (e) => this.handleTaskSubmit(e));

        // Filters
        this.bindEvent('categoryFilter', 'change', () => this.updateTasksList());
        this.bindEvent('priorityFilter', 'change', () => this.updateTasksList());
        this.bindEvent('statusFilter', 'change', () => this.updateTasksList());

        // XP preview
        this.bindEvent('taskPriority', 'change', () => this.updateXPPreview());

        // Quote refresh
        this.bindEvent('refreshQuote', 'click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.refreshQuote();
        });

        // Modal backdrop clicks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-backdrop')) {
                this.closeAllModals();
            }
        });

        this.bindEvent('levelUpClose', 'click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.closeLevelUpModal();
        });
        
        this.bindEvent('achievementClose', 'click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.closeAchievementModal();
        });

        // Task actions - using event delegation with fixed handling
        document.addEventListener('click', (e) => {
            const actionBtn = e.target.closest('[data-action]');
            if (actionBtn) {
                e.preventDefault();
                e.stopPropagation();
                this.handleTaskAction(actionBtn);
            }
        });

        // Chatbot events - Fixed
        this.setupChatbotEvents();
        
        // Calendar navigation
        this.bindEvent('prevMonth', 'click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.navigateCalendar(-1);
        });
        
        this.bindEvent('nextMonth', 'click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.navigateCalendar(1);
        });

        // Escape key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    bindEvent(elementId, eventType, handler) {
        const element = document.getElementById(elementId);
        if (element) {
            element.addEventListener(eventType, handler);
        }
    }

    // Chatbot System - Fixed
    initializeChatbot() {
        this.updateChatbotUI();
        this.renderChatHistory();
        
        // Show initial greeting if no chat history
        if (this.chatHistory.length === 0) {
            setTimeout(() => {
                this.addChatMessage('bot', this.currentCharacter.greeting);
                this.showChatNotification();
            }, 2000);
        }
    }

    setupChatbotEvents() {
        // Chatbot toggle - Fixed
        this.bindEvent('chatbotToggle', 'click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleChatbot();
        });
        
        // Character settings
        this.bindEvent('chatbotSettings', 'click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.openCharacterSelection();
        });
        
        // Minimize chat
        this.bindEvent('chatbotMinimize', 'click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.minimizeChatbot();
        });
        
        // Send message
        this.bindEvent('chatbotSend', 'click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.sendChatMessage();
        });
        
        // Enter key to send
        this.bindEvent('chatbotInput', 'keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.sendChatMessage();
            }
        });
        
        // Character selection modal
        this.bindEvent('characterModalClose', 'click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.closeCharacterSelection();
        });
        
        // Character selection - Fixed
        document.addEventListener('click', (e) => {
            const characterCard = e.target.closest('.character-card');
            if (characterCard) {
                e.preventDefault();
                e.stopPropagation();
                const characterId = characterCard.getAttribute('data-character-id');
                this.selectCharacter(characterId);
            }
        });
    }

    toggleChatbot() {
        const chatWindow = document.getElementById('chatbotWindow');
        if (!chatWindow) return;
        
        this.isChatOpen = !this.isChatOpen;
        
        if (this.isChatOpen) {
            chatWindow.classList.remove('hidden');
            this.hideChatNotification();
            setTimeout(() => {
                const input = document.getElementById('chatbotInput');
                if (input) input.focus();
            }, 100);
        } else {
            chatWindow.classList.add('hidden');
        }
    }

    minimizeChatbot() {
        const chatWindow = document.getElementById('chatbotWindow');
        if (!chatWindow) return;
        
        chatWindow.classList.toggle('minimized');
    }

    sendChatMessage() {
        const input = document.getElementById('chatbotInput');
        if (!input) return;
        
        const message = input.value.trim();
        if (!message) return;
        
        // Add user message
        this.addChatMessage('user', message);
        input.value = '';
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Simulate AI response delay
        setTimeout(() => {
            const response = this.generateChatResponse(message);
            this.hideTypingIndicator();
            this.addChatMessage('bot', response);
        }, 1000 + Math.random() * 2000);
    }

    addChatMessage(sender, message) {
        const messageData = {
            sender,
            message,
            timestamp: new Date().toISOString(),
            character: sender === 'bot' ? this.currentCharacter.id : null
        };
        
        this.chatHistory.push(messageData);
        this.renderChatMessage(messageData);
        this.scrollChatToBottom();
        this.saveData();
    }

    renderChatMessage(messageData) {
        const messagesContainer = document.getElementById('chatbotMessages');
        if (!messagesContainer) return;
        
        const messageElement = document.createElement('div');
        messageElement.className = `chat-message ${messageData.sender}`;
        
        const avatar = messageData.sender === 'bot' ? this.currentCharacter.emoji : '👤';
        
        messageElement.innerHTML = `
            <div class="chat-message-avatar">${avatar}</div>
            <div class="chat-message-content">${messageData.message}</div>
        `;
        
        messagesContainer.appendChild(messageElement);
    }

    renderChatHistory() {
        const messagesContainer = document.getElementById('chatbotMessages');
        if (!messagesContainer) return;
        
        messagesContainer.innerHTML = '';
        this.chatHistory.forEach(message => {
            this.renderChatMessage(message);
        });
        this.scrollChatToBottom();
    }

    scrollChatToBottom() {
        const messagesContainer = document.getElementById('chatbotMessages');
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    showTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.classList.remove('hidden');
            this.scrollChatToBottom();
        }
    }

    hideTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.classList.add('hidden');
        }
    }

    generateChatResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Context-aware responses based on user input
        if (message.includes('help') || message.includes('stuck') || message.includes('difficult')) {
            return this.getRandomResponse('advice');
        } else if (message.includes('motivation') || message.includes('tired') || message.includes('give up')) {
            return this.getRandomResponse('motivation');
        } else if (message.includes('task') || message.includes('assignment')) {
            return this.getTaskRelatedResponse();
        } else if (message.includes('streak') || message.includes('progress')) {
            return this.getProgressResponse();
        } else if (message.includes('schedule') || message.includes('time') || message.includes('plan')) {
            return this.getScheduleResponse();
        } else {
            // Default response mixing advice and motivation
            const responseType = Math.random() > 0.5 ? 'motivation' : 'advice';
            return this.getRandomResponse(responseType);
        }
    }

    getRandomResponse(type) {
        const responses = this.currentCharacter.responses[type];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    getTaskRelatedResponse() {
        const pendingTasks = this.tasks.filter(task => !task.completed);
        const completedToday = this.getTasksCompletedToday();
        
        if (pendingTasks.length === 0) {
            return "Wow! You've completed all your tasks! Time to add some new challenges to keep growing! 🎉";
        } else if (completedToday > 0) {
            return `You've already completed ${completedToday} task${completedToday > 1 ? 's' : ''} today! Keep up the momentum with your remaining ${pendingTasks.length} task${pendingTasks.length > 1 ? 's' : ''}!`;
        } else {
            const highPriorityTasks = pendingTasks.filter(task => task.priority === 'high');
            if (highPriorityTasks.length > 0) {
                return `I suggest starting with your high-priority tasks first. You have ${highPriorityTasks.length} urgent task${highPriorityTasks.length > 1 ? 's' : ''} waiting!`;
            } else {
                return "Why not tackle that next task on your list? Every completed task brings you closer to your goals! 💪";
            }
        }
    }

    getProgressResponse() {
        const completionRate = this.tasks.length > 0 ? 
            Math.round((this.tasks.filter(t => t.completed).length / this.tasks.length) * 100) : 0;
        
        return `Your current completion rate is ${completionRate}%! Your ${this.userProgress.currentStreak}-day streak shows real dedication. Level ${this.userProgress.level} ${this.userProgress.rank} - you're making excellent progress! 🌟`;
    }

    getScheduleResponse() {
        const now = new Date().getHours();
        
        if (now < 8) {
            return "Early bird! Morning is a great time for focused study. Your brain is fresh and ready to absorb new information! ⏰";
        } else if (now < 12) {
            return "Perfect morning study time! Try using the Pomodoro Technique - 25 minutes of focus followed by a 5-minute break. 📚";
        } else if (now < 18) {
            return "Afternoon study session? Great choice! Consider reviewing material from earlier today to reinforce your learning. 🧠";
        } else {
            return "Evening study time! Perfect for reviewing the day's material and preparing for tomorrow. Don't forget to take breaks! 🌙";
        }
    }

    openCharacterSelection() {
        const modal = document.getElementById('characterModal');
        const grid = document.getElementById('charactersGrid');
        
        if (!modal || !grid) return;
        
        // Populate characters
        grid.innerHTML = this.chatbotCharacters.map(character => `
            <div class="character-card ${character.id === this.currentCharacter.id ? 'selected' : ''}" data-character-id="${character.id}">
                <span class="character-emoji">${character.emoji}</span>
                <div class="character-name">${character.name}</div>
                <div class="character-personality">${character.personality}</div>
            </div>
        `).join('');
        
        modal.classList.remove('hidden');
    }

    closeCharacterSelection() {
        const modal = document.getElementById('characterModal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    selectCharacter(characterId) {
        const newCharacter = this.chatbotCharacters.find(char => char.id === characterId);
        if (!newCharacter || newCharacter.id === this.currentCharacter.id) {
            this.closeCharacterSelection();
            return;
        }
        
        this.currentCharacter = newCharacter;
        this.updateChatbotUI();
        
        // Add character change message
        this.addChatMessage('bot', this.currentCharacter.greeting);
        
        this.showNotification(`Switched to ${this.currentCharacter.name}! 🎭`, 'success');
        this.closeCharacterSelection();
        this.saveData();
    }

    updateChatbotUI() {
        this.updateElement('chatbotIcon', this.currentCharacter.emoji);
        this.updateElement('chatbotCharacterEmoji', this.currentCharacter.emoji);
        this.updateElement('chatbotCharacterName', this.currentCharacter.name);
    }

    showChatNotification() {
        const notification = document.getElementById('chatNotification');
        if (notification && !this.isChatOpen) {
            notification.classList.add('show');
        }
    }

    hideChatNotification() {
        const notification = document.getElementById('chatNotification');
        if (notification) {
            notification.classList.remove('show');
        }
    }

    // Calendar Navigation
    navigateCalendar(direction) {
        this.currentCalendarDate.setMonth(this.currentCalendarDate.getMonth() + direction);
        this.updateStreakCalendar();
        this.updateCalendarHeader();
    }

    updateCalendarHeader() {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        this.updateElement('calendarMonth', monthNames[this.currentCalendarDate.getMonth()]);
        this.updateElement('calendarYear', this.currentCalendarDate.getFullYear());
    }

    // Enhanced UI Updates
    updateAllUI() {
        this.updateUserStats();
        this.updateDashboard();
        if (this.currentView === 'tasks') this.updateTasksList();
        if (this.currentView === 'achievements') this.updateAchievements();
        if (this.currentView === 'analytics') this.updateAnalytics();
    }

    updateUserStats() {
        this.updateElement('userLevel', this.userProgress.level);
        this.updateElement('userRank', this.userProgress.rank);
        this.updateElement('currentXP', this.userProgress.xp);
        this.updateElement('streakNumber', this.userProgress.currentStreak);
        this.updateElement('totalPoints', this.userProgress.totalPoints);

        // Calculate XP needed for next level
        const nextLevelXP = this.levelThresholds[this.userProgress.level] || this.levelThresholds[this.levelThresholds.length - 1];
        this.updateElement('neededXP', nextLevelXP);

        // Update XP bar
        const xpProgress = (this.userProgress.xp / nextLevelXP) * 100;
        const xpFill = document.getElementById('xpFill');
        if (xpFill) {
            xpFill.style.width = `${Math.min(xpProgress, 100)}%`;
        }
    }

    updateDashboard() {
        const today = new Date().toISOString().split('T')[0];
        const todayTasks = this.tasks.filter(task => task.deadline === today);
        const completedToday = todayTasks.filter(task => task.completed);
        const dailyProgress = todayTasks.length > 0 ? (completedToday.length / todayTasks.length) * 100 : 0;

        // Update stats
        this.updateElement('tasksToday', todayTasks.length);
        this.updateElement('completedToday', completedToday.length);
        this.updateElement('dailyProgress', `${Math.round(dailyProgress)}%`);

        const dailyProgressFill = document.getElementById('dailyProgressFill');
        if (dailyProgressFill) {
            dailyProgressFill.style.width = `${dailyProgress}%`;
        }

        // Update focus tasks
        const priorityTasks = this.tasks
            .filter(task => !task.completed)
            .sort((a, b) => {
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            })
            .slice(0, 3);

        this.updateTaskContainer('focusTasks', priorityTasks, 'All caught up! 🎉', 'No urgent tasks right now', '✅');

        // Update recent achievements
        const recentBadges = this.badges
            .filter(badge => badge.unlocked)
            .sort((a, b) => new Date(b.unlockedDate) - new Date(a.unlockedDate))
            .slice(0, 3);

        this.updateRecentAchievements(recentBadges);
    }

    updateTaskContainer(containerId, tasks, emptyMessage, emptyDescription, emptyIcon) {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (tasks.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">${emptyIcon}</div>
                    <div class="empty-state-message">${emptyMessage}</div>
                    <div class="empty-state-description">${emptyDescription}</div>
                </div>
            `;
        } else {
            container.innerHTML = tasks.map(task => this.createTaskCardHTML(task, true)).join('');
        }
    }

    updateRecentAchievements(badges) {
        const container = document.getElementById('recentAchievements');
        if (!container) return;

        if (badges.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🏆</div>
                    <div class="empty-state-message">No achievements yet</div>
                    <div class="empty-state-description">Complete tasks to unlock badges!</div>
                </div>
            `;
        } else {
            container.innerHTML = badges.map(badge => `
                <div class="mini-badge" style="display: inline-flex; align-items: center; gap: 8px; background: var(--color-bg-3); padding: 8px 12px; border-radius: 20px; margin: 4px;">
                    <span class="mini-badge-icon">${badge.icon}</span>
                    <span class="mini-badge-name" style="font-size: 14px; font-weight: 500;">${badge.name}</span>
                </div>
            `).join('');
        }
    }

    // Task Management
    createTaskCardHTML(task, compact = false) {
        const isOverdue = !task.completed && new Date(task.deadline) < new Date();
        
        return `
            <div class="task-card ${task.completed ? 'completed' : ''} ${task.priority}-priority ${isOverdue ? 'overdue' : ''}" data-task-id="${task.id}">
                <div class="task-header">
                    <h4 class="task-title">${task.title}</h4>
                    <span class="task-priority ${task.priority}">${task.priority}</span>
                </div>
                ${!compact ? `<p class="task-description">${task.description || 'No description'}</p>` : ''}
                <div class="task-meta">
                    <div class="task-info">
                        <span class="task-deadline">📅 ${this.formatDate(task.deadline)}</span>
                        ${task.estimatedTime ? `<span class="task-time">⏱️ ${task.estimatedTime}</span>` : ''}
                        <span class="task-xp">💎 ${task.xpReward} XP</span>
                    </div>
                    ${!compact ? `
                        <div class="task-actions">
                            <button class="task-action-btn complete-btn" data-action="toggle" data-task-id="${task.id}" title="${task.completed ? 'Mark as incomplete' : 'Mark as complete'}">
                                ${task.completed ? '↶' : '✓'}
                            </button>
                            <button class="task-action-btn edit-btn" data-action="edit" data-task-id="${task.id}" title="Edit task">✏️</button>
                            <button class="task-action-btn delete-btn" data-action="delete" data-task-id="${task.id}" title="Delete task">🗑️</button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    updateTasksList() {
        const categoryFilter = this.getInputValue('categoryFilter');
        const priorityFilter = this.getInputValue('priorityFilter');
        const statusFilter = this.getInputValue('statusFilter');

        let filteredTasks = [...this.tasks];

        if (categoryFilter) {
            filteredTasks = filteredTasks.filter(task => task.category === categoryFilter);
        }

        if (priorityFilter) {
            filteredTasks = filteredTasks.filter(task => task.priority === priorityFilter);
        }

        if (statusFilter === 'pending') {
            filteredTasks = filteredTasks.filter(task => !task.completed);
        } else if (statusFilter === 'completed') {
            filteredTasks = filteredTasks.filter(task => task.completed);
        }

        // Sort tasks
        filteredTasks.sort((a, b) => {
            if (a.completed !== b.completed) {
                return a.completed ? 1 : -1;
            }
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            if (a.priority !== b.priority) {
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            }
            return new Date(a.deadline) - new Date(b.deadline);
        });

        this.updateTaskContainer('tasksList', filteredTasks, 'No tasks found', 'Try adjusting your filters or add a new task', '📝');
    }

    // Task Actions
    handleTaskAction(button) {
        const action = button.getAttribute('data-action');
        const taskId = parseInt(button.getAttribute('data-task-id'));

        switch(action) {
            case 'toggle':
                this.toggleTask(taskId);
                break;
            case 'edit':
                this.editTask(taskId);
                break;
            case 'delete':
                this.deleteTask(taskId);
                break;
        }
    }

    toggleTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;

        const wasCompleted = task.completed;
        task.completed = !task.completed;

        if (task.completed) {
            task.completedDate = new Date().toISOString().split('T')[0];
            task.completedTime = new Date().toISOString();
            this.awardXP(task.xpReward);
            this.incrementTaskCount();
            this.updateStreak();
            this.showTaskCompletionEffects(task);
        } else {
            task.completedDate = null;
            task.completedTime = null;
            this.subtractXP(task.xpReward);
            this.decrementTaskCount();
        }

        this.checkAchievements();
        this.saveData();
        this.updateAllUI();

        const message = task.completed ? `Task completed! +${task.xpReward} XP 🎉` : 'Task marked as incomplete';
        this.showNotification(message, task.completed ? 'success' : 'warning');
    }

    editTask(taskId) {
        this.openTaskModal(taskId);
    }

    deleteTask(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.tasks = this.tasks.filter(t => t.id !== taskId);
            this.saveData();
            this.updateAllUI();
            this.showNotification('Task deleted successfully', 'warning');
        }
    }

    // Gamification System
    awardXP(amount) {
        this.userProgress.xp += amount;
        this.userProgress.totalXP += amount;
        this.userProgress.totalPoints += amount;

        // Check for level up
        const currentLevel = this.userProgress.level;
        const newLevel = this.calculateLevel(this.userProgress.totalXP);
        
        if (newLevel > currentLevel) {
            this.userProgress.level = newLevel;
            this.userProgress.rank = this.rankNames[Math.min(newLevel - 1, this.rankNames.length - 1)];
            this.userProgress.xp = this.userProgress.totalXP - this.levelThresholds[newLevel - 1];
            this.showLevelUpModal(newLevel, this.userProgress.rank);
        }

        this.animateXPGain(amount);
    }

    subtractXP(amount) {
        this.userProgress.xp = Math.max(0, this.userProgress.xp - amount);
        this.userProgress.totalXP = Math.max(0, this.userProgress.totalXP - amount);
        this.userProgress.totalPoints = Math.max(0, this.userProgress.totalPoints - amount);

        // Recalculate level
        const newLevel = this.calculateLevel(this.userProgress.totalXP);
        if (newLevel < this.userProgress.level) {
            this.userProgress.level = newLevel;
            this.userProgress.rank = this.rankNames[Math.min(newLevel - 1, this.rankNames.length - 1)];
            const prevLevelXP = newLevel > 0 ? this.levelThresholds[newLevel - 1] : 0;
            this.userProgress.xp = this.userProgress.totalXP - prevLevelXP;
        }
    }

    calculateLevel(totalXP) {
        for (let i = this.levelThresholds.length - 1; i >= 0; i--) {
            if (totalXP >= this.levelThresholds[i]) {
                return i + 1;
            }
        }
        return 1;
    }

    incrementTaskCount() {
        this.userProgress.totalTasksCompleted++;
    }

    decrementTaskCount() {
        this.userProgress.totalTasksCompleted = Math.max(0, this.userProgress.totalTasksCompleted - 1);
    }

    updateStreak() {
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (this.userProgress.lastStudyDate === yesterdayStr || this.userProgress.lastStudyDate === today) {
            if (this.userProgress.lastStudyDate !== today) {
                this.userProgress.currentStreak++;
                this.userProgress.lastStudyDate = today;
            }
        } else if (this.userProgress.lastStudyDate !== today) {
            this.userProgress.currentStreak = 1;
            this.userProgress.lastStudyDate = today;
        }

        if (this.userProgress.currentStreak > this.userProgress.bestStreak) {
            this.userProgress.bestStreak = this.userProgress.currentStreak;
        }
    }

    checkAndUpdateStreak() {
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (this.userProgress.lastStudyDate && 
            this.userProgress.lastStudyDate !== today && 
            this.userProgress.lastStudyDate !== yesterdayStr) {
            this.userProgress.currentStreak = 0;
        }
    }

    // Achievement System
    checkAchievements() {
        this.badges.forEach(badge => {
            if (!badge.unlocked && badge.condition(this.userProgress)) {
                this.unlockAchievement(badge);
            }
        });
    }

    unlockAchievement(badge) {
        badge.unlocked = true;
        badge.unlockedDate = new Date().toISOString().split('T')[0];
        
        // Award bonus XP for achievement
        const bonusXP = 100;
        this.awardXP(bonusXP);
        
        this.showAchievementModal(badge);
        this.saveData();
    }

    // Helper Methods for Achievement Conditions
    getTasksCompletedToday() {
        const today = new Date().toISOString().split('T')[0];
        return this.tasks.filter(task => task.completed && task.completedDate === today).length;
    }

    hasCompletedTaskAfter(hour) {
        return this.tasks.some(task => {
            if (!task.completed || !task.completedTime) return false;
            const completedHour = new Date(task.completedTime).getHours();
            return completedHour >= hour;
        });
    }

    hasCompletedTaskBefore(hour) {
        return this.tasks.some(task => {
            if (!task.completed || !task.completedTime) return false;
            const completedHour = new Date(task.completedTime).getHours();
            return completedHour < hour;
        });
    }

    hasWeeklyPerfectRecord() {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const weekTasks = this.tasks.filter(task => 
            new Date(task.createdDate) >= oneWeekAgo &&
            task.completed
        );
        
        return weekTasks.length >= 7 && weekTasks.every(task => 
            new Date(task.completedDate) <= new Date(task.deadline)
        );
    }

    // Modal Management
    openTaskModal(taskId = null) {
        this.currentTaskId = taskId;
        this.isEditing = !!taskId;

        const modal = document.getElementById('taskModal');
        const modalTitle = document.getElementById('modalTitle');

        if (modalTitle) {
            modalTitle.textContent = this.isEditing ? '✏️ Edit Task' : '✨ Add New Task';
        }

        if (this.isEditing && taskId) {
            const task = this.tasks.find(t => t.id === taskId);
            if (task) {
                this.setInputValue('taskTitle', task.title);
                this.setInputValue('taskDescription', task.description);
                this.setInputValue('taskCategory', task.category);
                this.setInputValue('taskPriority', task.priority);
                this.setInputValue('taskDeadline', task.deadline);
                this.setInputValue('taskEstimatedTime', task.estimatedTime);
            }
        } else {
            const form = document.getElementById('taskForm');
            if (form) form.reset();
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            this.setInputValue('taskDeadline', tomorrow.toISOString().split('T')[0]);
        }

        this.updateXPPreview();
        
        if (modal) {
            modal.style.display = 'flex';
            modal.classList.remove('hidden');
        }
        
        setTimeout(() => {
            const titleInput = document.getElementById('taskTitle');
            if (titleInput) titleInput.focus();
        }, 100);
    }

    closeTaskModal() {
        const modal = document.getElementById('taskModal');
        if (modal) {
            modal.style.display = 'none';
            modal.classList.add('hidden');
        }
        
        const form = document.getElementById('taskForm');
        if (form) form.reset();
        
        this.currentTaskId = null;
        this.isEditing = false;
    }

    showLevelUpModal(level, rank) {
        this.updateElement('newLevel', level);
        this.updateElement('newRank', rank);
        const modal = document.getElementById('levelUpModal');
        if (modal) {
            modal.style.display = 'flex';
            modal.classList.remove('hidden');
        }
        this.createConfetti();
    }

    closeLevelUpModal() {
        const modal = document.getElementById('levelUpModal');
        if (modal) {
            modal.style.display = 'none';
            modal.classList.add('hidden');
        }
    }

    showAchievementModal(badge) {
        this.updateElement('achievementBadge', badge.icon);
        this.updateElement('achievementName', badge.name);
        this.updateElement('achievementDescription', badge.description);
        const modal = document.getElementById('achievementModal');
        if (modal) {
            modal.style.display = 'flex';
            modal.classList.remove('hidden');
        }
        this.createConfetti();
    }

    closeAchievementModal() {
        const modal = document.getElementById('achievementModal');
        if (modal) {
            modal.style.display = 'none';
            modal.classList.add('hidden');
        }
    }

    closeAllModals() {
        this.closeTaskModal();
        this.closeLevelUpModal();
        this.closeAchievementModal();
        this.closeCharacterSelection();
    }

    // Form Handling
    handleTaskSubmit(e) {
        e.preventDefault();
        e.stopPropagation();

        const priority = this.getInputValue('taskPriority') || 'medium';
        const xpReward = this.getXPForPriority(priority);

        const taskData = {
            title: this.getInputValue('taskTitle') || 'Untitled Task',
            description: this.getInputValue('taskDescription'),
            category: this.getInputValue('taskCategory') || 'Other',
            priority: priority,
            deadline: this.getInputValue('taskDeadline') || this.getDefaultDeadline(),
            estimatedTime: this.getInputValue('taskEstimatedTime'),
            xpReward: xpReward
        };

        if (this.isEditing && this.currentTaskId) {
            this.updateTask(this.currentTaskId, taskData);
        } else {
            this.addTask(taskData);
        }

        this.closeTaskModal();
    }

    addTask(taskData) {
        const newTask = {
            id: Date.now() + Math.random(),
            ...taskData,
            completed: false,
            createdDate: new Date().toISOString().split('T')[0],
            completedDate: null
        };

        this.tasks.push(newTask);
        this.saveData();
        this.updateAllUI();
        this.showNotification('Task added successfully! 🎯', 'success');
    }

    updateTask(taskId, taskData) {
        const taskIndex = this.tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...taskData };
            this.saveData();
            this.updateAllUI();
            this.showNotification('Task updated successfully! ✅', 'success');
        }
    }

    getXPForPriority(priority) {
        const xpMap = { low: 10, medium: 30, high: 50 };
        return xpMap[priority] || 30;
    }

    updateXPPreview() {
        const priority = this.getInputValue('taskPriority') || 'medium';
        const xp = this.getXPForPriority(priority);
        this.updateElement('xpPreview', xp);
    }

    // View Management - Fixed
    switchView(viewName) {
        // Update active tab
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.getAttribute('data-view') === viewName) {
                tab.classList.add('active');
            }
        });

        // Update active view
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
            if (view.id === `${viewName}View`) {
                view.classList.add('active');
            }
        });

        this.currentView = viewName;

        // Update view-specific content
        setTimeout(() => {
            switch(viewName) {
                case 'dashboard':
                    this.updateDashboard();
                    break;
                case 'tasks':
                    this.updateTasksList();
                    break;
                case 'achievements':
                    this.updateAchievements();
                    break;
                case 'analytics':
                    this.updateAnalytics();
                    break;
            }
        }, 50);
    }

    updateAchievements() {
        const container = document.getElementById('badgesGrid');
        if (!container) return;

        container.innerHTML = this.badges.map(badge => `
            <div class="badge-card ${badge.unlocked ? 'unlocked' : 'locked'}">
                <span class="badge-icon">${badge.icon}</span>
                <h3 class="badge-name">${badge.name}</h3>
                <p class="badge-description">${badge.description}</p>
                ${badge.unlocked ? `<div class="badge-unlock-date">Unlocked: ${this.formatDate(badge.unlockedDate)}</div>` : '<div class="badge-unlock-date">Locked</div>'}
            </div>
        `).join('');

        // Update achievement stats
        const unlockedCount = this.badges.filter(b => b.unlocked).length;
        this.updateElement('unlockedBadges', unlockedCount);
        this.updateElement('totalBadges', this.badges.length);

        // Update level milestones
        this.updateLevelMilestones();
    }

    updateLevelMilestones() {
        const container = document.getElementById('levelMilestones');
        if (!container) return;

        const maxLevel = Math.min(10, this.levelThresholds.length);
        const milestones = [];

        for (let i = 1; i <= maxLevel; i++) {
            const isAchieved = this.userProgress.level > i;
            const isCurrent = this.userProgress.level === i;
            
            milestones.push(`
                <div class="level-milestone ${isAchieved ? 'achieved' : ''} ${isCurrent ? 'current' : ''}">
                    ${i}
                </div>
            `);
        }

        container.innerHTML = milestones.join('');
    }

    updateAnalytics() {
        this.updateProductivityStats();
        this.updateWeeklyChart();
        // Removed category chart as requested
        this.updateStreakCalendar();
        this.updateCalendarHeader();
    }

    updateProductivityStats() {
        const container = document.getElementById('productivityStats');
        if (!container) return;

        const totalTasks = this.tasks.length;
        const completedTasks = this.tasks.filter(t => t.completed).length;
        const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        
        const weeklyStats = this.getWeeklyStats();
        const averageDaily = weeklyStats.averageDaily;

        container.innerHTML = `
            <div class="productivity-item">
                <span class="productivity-value">${completionRate}%</span>
                <span class="productivity-label">Completion Rate</span>
            </div>
            <div class="productivity-item">
                <span class="productivity-value">${averageDaily}</span>
                <span class="productivity-label">Avg Daily Tasks</span>
            </div>
            <div class="productivity-item">
                <span class="productivity-value">${this.userProgress.bestStreak}</span>
                <span class="productivity-label">Best Streak</span>
            </div>
            <div class="productivity-item">
                <span class="productivity-value">${this.userProgress.totalXP}</span>
                <span class="productivity-label">Total XP</span>
            </div>
        `;
    }

    updateWeeklyChart() {
        const ctx = document.getElementById('weeklyChart');
        if (!ctx) return;

        // Destroy existing chart
        if (this.charts.weekly) {
            this.charts.weekly.destroy();
        }

        const weeklyData = this.getWeeklyChartData();

        this.charts.weekly = new Chart(ctx, {
            type: 'line',
            data: {
                labels: weeklyData.labels,
                datasets: [{
                    label: 'Tasks Completed',
                    data: weeklyData.completed,
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    tension: 0.4,
                    fill: true
                }, {
                    label: 'Tasks Created',
                    data: weeklyData.created,
                    borderColor: '#FFC185',
                    backgroundColor: 'rgba(255, 193, 133, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Enhanced Calendar with Navigation
    updateStreakCalendar() {
        const container = document.getElementById('streakCalendar');
        if (!container) return;

        const today = new Date();
        const currentMonth = this.currentCalendarDate.getMonth();
        const currentYear = this.currentCalendarDate.getFullYear();
        
        // Get first day of month and number of days
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();
        
        // Calculate previous month days to show
        const prevMonth = new Date(currentYear, currentMonth - 1, 0);
        const daysFromPrevMonth = startingDayOfWeek;
        
        const calendarDays = [];
        
        // Previous month days
        for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
            const date = new Date(currentYear, currentMonth - 1, prevMonth.getDate() - i);
            calendarDays.push(this.createCalendarDay(date, true));
        }
        
        // Current month days
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentYear, currentMonth, day);
            calendarDays.push(this.createCalendarDay(date, false));
        }
        
        // Next month days to fill grid
        const totalCells = Math.ceil((daysFromPrevMonth + daysInMonth) / 7) * 7;
        const daysFromNextMonth = totalCells - (daysFromPrevMonth + daysInMonth);
        
        for (let day = 1; day <= daysFromNextMonth; day++) {
            const date = new Date(currentYear, currentMonth + 1, day);
            calendarDays.push(this.createCalendarDay(date, true));
        }
        
        container.innerHTML = calendarDays.join('');
    }

    createCalendarDay(date, isOtherMonth) {
        const dateStr = date.toISOString().split('T')[0];
        const today = new Date().toISOString().split('T')[0];
        
        const hasTask = this.tasks.some(task => 
            task.completed && task.completedDate === dateStr
        );
        
        const isToday = dateStr === today;
        
        let classes = ['calendar-day'];
        if (isOtherMonth) classes.push('other-month');
        if (isToday) classes.push('today');
        if (hasTask && !isToday) classes.push('streak');
        
        return `
            <div class="${classes.join(' ')}" title="${dateStr}${hasTask ? ' - Study completed!' : ''}">
                ${date.getDate()}
            </div>
        `;
    }

    // Data Processing for Charts
    getWeeklyChartData() {
        const labels = [];
        const completed = [];
        const created = [];

        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
            
            const completedCount = this.tasks.filter(task => 
                task.completed && task.completedDate === dateStr
            ).length;
            
            const createdCount = this.tasks.filter(task => 
                task.createdDate === dateStr
            ).length;
            
            completed.push(completedCount);
            created.push(createdCount);
        }

        return { labels, completed, created };
    }

    getWeeklyStats() {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const thisWeekTasks = this.tasks.filter(task => 
            new Date(task.createdDate) >= oneWeekAgo
        );

        const completedThisWeek = thisWeekTasks.filter(task => 
            task.completed && task.completedDate && new Date(task.completedDate) >= oneWeekAgo
        );

        const averageDaily = thisWeekTasks.length > 0 ? (thisWeekTasks.length / 7).toFixed(1) : 0;

        return {
            thisWeek: thisWeekTasks.length,
            completedThisWeek: completedThisWeek.length,
            averageDaily: parseFloat(averageDaily)
        };
    }

    // Animation and Effects
    showTaskCompletionEffects(task) {
        this.createConfetti();
        setTimeout(() => {
            this.animateXPGain(task.xpReward);
        }, 500);
    }

    animateXPGain(amount) {
        // Create floating XP text
        const xpFloat = document.createElement('div');
        xpFloat.textContent = `+${amount} XP`;
        xpFloat.style.cssText = `
            position: fixed;
            top: 20%;
            left: 50%;
            transform: translateX(-50%);
            color: #ffd700;
            font-size: 2rem;
            font-weight: bold;
            pointer-events: none;
            z-index: 9999;
            animation: floatUp 2s ease-out forwards;
        `;

        document.body.appendChild(xpFloat);

        setTimeout(() => {
            if (document.body.contains(xpFloat)) {
                document.body.removeChild(xpFloat);
            }
        }, 2000);

        // Add CSS animation if not exists
        if (!document.querySelector('#xpFloatAnimation')) {
            const style = document.createElement('style');
            style.id = 'xpFloatAnimation';
            style.textContent = `
                @keyframes floatUp {
                    0% { opacity: 0; transform: translateX(-50%) translateY(0); }
                    20% { opacity: 1; }
                    100% { opacity: 0; transform: translateX(-50%) translateY(-100px); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    createConfetti() {
        const container = document.getElementById('confettiContainer');
        if (!container) return;

        const colors = ['#1FB8CD', '#FFC185', '#B4413C', '#5D878F', '#DB4545'];
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti-piece';
            confetti.style.cssText = `
                left: ${Math.random() * 100}%;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                animation-delay: ${Math.random() * 1}s;
                animation-duration: ${2 + Math.random() * 1}s;
            `;
            
            container.appendChild(confetti);
            
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 3000);
        }
    }

    // Theme Management
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-color-scheme') || 
                           (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        this.applyTheme(newTheme);
        localStorage.setItem('gamifiedPlannerTheme', newTheme);
        this.showNotification(`Switched to ${newTheme} theme ✨`, 'success');
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-color-scheme', theme);
        this.updateThemeIcon(theme);
    }

    updateThemeIcon(theme) {
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
        }
    }

    // Utility Functions
    populateSelects() {
        const categoryFilter = document.getElementById('categoryFilter');
        const taskCategory = document.getElementById('taskCategory');

        [categoryFilter, taskCategory].forEach(select => {
            if (select) {
                const isFilter = select.id.includes('Filter');
                if (isFilter) {
                    select.innerHTML = '<option value="">All Categories</option>';
                } else {
                    select.innerHTML = '<option value="">Select Category</option>';
                }

                this.categories.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.name;
                    option.textContent = category.name;
                    select.appendChild(option);
                });
            }
        });
    }

    refreshQuote() {
        const randomQuote = this.motivationalQuotes[Math.floor(Math.random() * this.motivationalQuotes.length)];
        this.updateElement('dailyQuote', randomQuote);
        this.showNotification('Quote refreshed! 🌟', 'info');
    }

    updateElement(id, content) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = content;
        }
    }

    setInputValue(id, value) {
        const input = document.getElementById(id);
        if (input) {
            input.value = value || '';
        }
    }

    getInputValue(id) {
        const input = document.getElementById(id);
        return input ? input.value.trim() : '';
    }

    getDefaultDeadline() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    }

    formatDate(dateString) {
        if (!dateString) return 'No date';

        const date = new Date(dateString);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return 'Tomorrow';
        } else {
            return date.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
            });
        }
    }

    showNotification(message, type = 'info') {
        const container = document.getElementById('notificationContainer');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        notification.innerHTML = `
            <span class="notification-icon">${icons[type]}</span>
            <span class="notification-text">${message}</span>
        `;

        container.appendChild(notification);

        requestAnimationFrame(() => {
            notification.classList.add('show');
        });

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    showWelcomeMessage() {
        setTimeout(() => {
            this.showNotification(`Welcome back! ${this.currentCharacter.emoji} ${this.currentCharacter.name} is ready to help! 🚀`, 'success');
        }, 500);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.studyPlanner = new GamifiedStudyPlanner();
    window.studyPlanner.init();
});