// Gamified Smart Study Planner - Complete JavaScript Application (Fixed)
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
        
        this.categories = [
            {name: "Mathematics", color: "#FF6B6B", gradient: "linear-gradient(135deg, #FF6B6B, #4ECDC4)"},
            {name: "Physics", color: "#4ECDC4", gradient: "linear-gradient(135deg, #4ECDC4, #45B7D1)"},
            {name: "Chemistry", color: "#45B7D1", gradient: "linear-gradient(135deg, #45B7D1, #96CEB4)"},
            {name: "Biology", color: "#96CEB4", gradient: "linear-gradient(135deg, #96CEB4, #FFEAA7)"},
            {name: "History", color: "#FFEAA7", gradient: "linear-gradient(135deg, #FFEAA7, #DDA0DD)"},
            {name: "English", color: "#DDA0DD", gradient: "linear-gradient(135deg, #DDA0DD, #98D8C8)"},
            {name: "Computer Science", color: "#98D8C8", gradient: "linear-gradient(135deg, #98D8C8, #FF6B6B)"}
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
    }

    // Initialization
    init() {
        this.loadData();
        this.setupEventListeners();
        this.populateSelects();
        this.updateAllUI();
        this.checkAndUpdateStreak();
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

        } catch (error) {
            console.error('Error loading data:', error);
            this.loadSampleData();
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
                title: "History Essay",
                description: "Research and write essay on World War II",
                category: "History",
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
        } catch (error) {
            console.error('Error saving data:', error);
        }
    }

    // Event Listeners
    setupEventListeners() {
        // Theme toggle
        this.bindEvent('themeToggle', 'click', () => this.toggleTheme());

        // Navigation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                const view = tab.getAttribute('data-view');
                if (view) this.switchView(view);
            });
        });

        // Task management
        this.bindEvent('addTaskBtn', 'click', (e) => {
            e.preventDefault();
            this.openTaskModal();
        });
        
        this.bindEvent('fab', 'click', (e) => {
            e.preventDefault();
            this.openTaskModal();
        });
        
        this.bindEvent('modalClose', 'click', (e) => {
            e.preventDefault();
            this.closeTaskModal();
        });
        
        this.bindEvent('cancelBtn', 'click', (e) => {
            e.preventDefault();
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
            this.closeLevelUpModal();
        });
        
        this.bindEvent('achievementClose', 'click', (e) => {
            e.preventDefault();
            this.closeAchievementModal();
        });

        // Task actions - using event delegation
        document.addEventListener('click', (e) => {
            const actionBtn = e.target.closest('[data-action]');
            if (actionBtn) {
                e.preventDefault();
                e.stopPropagation();
                this.handleTaskAction(actionBtn);
            }
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

    // UI Updates
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
        const category = this.categories.find(cat => cat.name === task.category);
        
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
            document.getElementById('taskForm')?.reset();
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
            document.getElementById('taskTitle')?.focus();
        }, 100);
    }

    closeTaskModal() {
        const modal = document.getElementById('taskModal');
        if (modal) {
            modal.style.display = 'none';
            modal.classList.add('hidden');
        }
        
        document.getElementById('taskForm')?.reset();
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
    }

    // Form Handling
    handleTaskSubmit(e) {
        e.preventDefault();

        const priority = this.getInputValue('taskPriority') || 'medium';
        const xpReward = this.getXPForPriority(priority);

        const taskData = {
            title: this.getInputValue('taskTitle') || 'Untitled Task',
            description: this.getInputValue('taskDescription'),
            category: this.getInputValue('taskCategory') || 'General',
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

    // View Management
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
        this.updateCategoryChart();
        this.updateStreakCalendar();
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

    updateCategoryChart() {
        const ctx = document.getElementById('categoryChart');
        if (!ctx) return;

        // Destroy existing chart
        if (this.charts.category) {
            this.charts.category.destroy();
        }

        const categoryData = this.getCategoryChartData();

        if (categoryData.labels.length === 0) {
            // No data case
            ctx.getContext('2d').clearRect(0, 0, ctx.width, ctx.height);
            return;
        }

        this.charts.category = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: categoryData.labels,
                datasets: [{
                    data: categoryData.data,
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                    }
                }
            }
        });
    }

    updateStreakCalendar() {
        const container = document.getElementById('streakCalendar');
        if (!container) return;

        // Simple calendar showing last 28 days
        const today = new Date();
        const days = [];

        for (let i = 27; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            const hasTask = this.tasks.some(task => 
                task.completed && task.completedDate === dateStr
            );

            days.push(`
                <div class="calendar-day ${hasTask ? 'streak' : ''}" title="${dateStr}">
                    ${date.getDate()}
                </div>
            `);
        }

        container.innerHTML = days.join('');
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

    getCategoryChartData() {
        const categoryCounts = {};
        
        this.tasks.forEach(task => {
            if (task.completed) {
                categoryCounts[task.category] = (categoryCounts[task.category] || 0) + 1;
            }
        });

        return {
            labels: Object.keys(categoryCounts),
            data: Object.values(categoryCounts)
        };
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
        const completionRate = thisWeekTasks.length > 0 ? 
            Math.round((completedThisWeek.length / thisWeekTasks.length) * 100) : 0;

        return {
            thisWeek: thisWeekTasks.length,
            completedThisWeek: completedThisWeek.length,
            averageDaily: parseFloat(averageDaily),
            completionRate
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
        const xpBar = document.getElementById('xpFill');
        if (!xpBar) return;

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

        // Add CSS animation for floating up
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
            this.showNotification('Welcome to your gamified study journey! 🚀', 'success');
        }, 500);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.studyPlanner = new GamifiedStudyPlanner();
    window.studyPlanner.init();
});