# Smart Todo 

A modern, responsive Todo application built using the **React + Vite** stack, designed to help users efficiently manage their daily tasks with **real-time updates**, **smart status tracking**, and a **clean, minimal UI**.



##  Live Demo
 **[View the Live App on Vercel](https://smart-todo-eight.vercel.app)**

> **Note:** The deployed app uses a hosted mock API (via [MockAPI.io](https://mockapi.io)) for persistent data storage.  
> Local development uses **JSON Server** for simulation.

---

##  Overview

**Smart Todo** helps you stay organized and productive by:
-  Creating,  Editing, and  Deleting tasks  
-  Marking tasks as complete or ongoing  
-  Setting deadlines with **live countdown timers** (“Due in 2h”, “Overdue by 1d”)  
-  Automatically categorizing tasks into **Ongoing**, **Success**, or **Failure**  
-  Updating task status **every 30 seconds** — no manual refresh needed  

This project focuses on **clarity**, **maintainability**, and **real-time logic** using modern React practices.

---

##  Tech Stack & Technical Choices

 Tool / Library 

 **React + Vite** 
 **Tailwind CSS** 
 **React Query** 
 **Axios** 
 **JSON Server** 
 **MockAPI.io** 
 **Date-fns** 

 This stack ensures **performance**, **scalability**, and **clean modular code** that fits production-grade best practices.

---

##  Key Features Implemented

-  Add, edit, delete, and complete tasks  
-  Deadline-based **automatic status updates** (Ongoing → Failure)  
-  **Real-time countdown refresh** every 30 seconds  
-  Inline Add/Edit task form with smooth focus & validation  
-  Toast notifications for user actions  
-  Responsive design with subtle card shadows & adaptive layout  

---

##  Proposed Innovative Feature — “Smart Task Insights”

An upcoming enhancement that transforms Smart Todo into a **personal productivity dashboard** by providing:

-  **Task completion analytics** (on-time vs delayed)  
-  **Weekly progress visualization** (chart-based insights)  
-  **Consistency Score** – tracks your discipline (e.g., 82%)  

This feature adds a motivational layer — encouraging consistent task completion and better time management.

---

##  Setup Instructions (Local Development)

### 

1️⃣ Clone the Repository

git clone https://github.com/Mukesh07-R/smart-todo.git
cd smart-todo

2️⃣ Install Dependencies

npm install

3️⃣ Start the Mock Backend (Local JSON Server)

npm run server
The backend runs on 👉 http://localhost:5000/tasks

4️⃣ Start the React Frontend

npm run dev
Frontend runs on 👉 http://localhost:5173


Author 

Mukesh 

Frontend Developer | MERN Stack Enthusiast