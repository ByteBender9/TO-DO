TaskFlow

A modern, responsive personal productivity and task management web app.

TaskFlow is a lightweight, browser-based task manager designed to make everyday planning simple and organized. It provides a clean productivity dashboard with task management, priorities, categories, due dates, search, progress tracking, and theme customization.

No backend or account is required for the current version. Tasks are stored locally in the browser using localStorage.

✨ Features

* Task Management
    * Create, edit, complete, and delete tasks
    * Add task descriptions
    * Set priority levels
    * Assign categories
    * Set due dates and times
* Productivity Dashboard
    * Total task count
    * Pending tasks
    * Completed tasks
    * Overall completion percentage
    * Today’s progress
* Task Organization
    * All tasks
    * Today’s tasks
    * Upcoming tasks
    * Overdue tasks
    * Completed tasks
    * Custom categories
* Search & Sorting
    * Search tasks instantly
    * Sort tasks by creation order
    * Drag and drop tasks to rearrange them
* User Experience
    * Responsive design
    * Dark and light themes
    * Focus mode
    * Keyboard shortcuts
    * Smooth animations
    * Glassmorphism-inspired interface
* Local Storage
    * Tasks are automatically saved
    * Data remains available after refreshing or reopening the browser
    * No account or server required

🖥️ Preview

Dashboard

The dashboard provides an overview of your tasks and daily progress.

Task Management

Create tasks with:

* Title
* Description
* Category
* Priority
* Due date
* Due time

🛠️ Built With

* HTML5 — Application structure
* CSS3 — Responsive UI and visual design
* JavaScript (ES6+) — Application logic and interactions
* LocalStorage API — Persistent browser storage
* Google Fonts — Inter typography

📁 Project Structure

TaskFlow/
│
├── index.html       # Main application page
├── style.css        # Application styling
├── script.js        # Application logic
├── README.md        # Project documentation
└── LICENSE          # MIT License

🚀 Getting Started

1. Clone the repository

git clone https://github.com/ByteBender9/taskflow-todo.git

2. Navigate to the project

cd taskflow-todo

3. Run the application

No build tools or dependencies are required.

Simply open:

index.html

in your preferred browser.

For a better local development experience, you can also use VS Code’s Live Server extension.

⌨️ Keyboard Shortcuts

Shortcut	Action
N	Create a new task
/	Focus search
Esc	Close task editor

💾 Data Storage

TaskFlow currently uses the browser’s localStorage API.

This means:

* No backend is required.
* No account is required.
* Tasks are stored locally on the current browser/device.
* Clearing browser storage can remove saved tasks.
* Tasks are not automatically synchronized between devices.

Cloud synchronization can be added in a future version.

🔮 Future Improvements

Planned improvements may include:

* Cloud synchronization
* User authentication
* Cross-device task sync
* Progressive Web App (PWA) support
* Push notifications
* Recurring tasks
* Advanced task filtering
* Productivity analytics
* Calendar integration
* Import/export tasks
* Backup and restore
* Supabase integration

🎯 Project Goals

TaskFlow was created as a practical frontend project focused on:

* Building a polished responsive interface
* Managing application state with JavaScript
* Working with browser storage
* Creating reusable UI interactions
* Designing a practical productivity tool

🤝 Contributing

Contributions, suggestions, and improvements are welcome.

1. Fork the repository.
2. Create a feature branch:

git checkout -b feature/your-feature

3. Make your changes.
4. Commit your changes:

git commit -m "Add your feature"

5. Push the branch:

git push origin feature/your-feature

6. Open a Pull Request.

📄 License

This project is licensed under the MIT License.

See the LICENSE file for details.

👨‍💻 Author

Kushal Sarkar

Computer Science & Engineering

GitHub: ByteBender9

⸻

If you find TaskFlow useful, consider giving the repository a ⭐.