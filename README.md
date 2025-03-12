# MatchMe

A full-stack chatting and matching application consisting of a Spring Boot backend and a React frontend. Users can connect with each other in real time, apply various filters for matching, manage their profiles, upload photos, add or remove friends, and ignore or un-ignore other users.

---

## Table of Contents
1. [Features](#features)
2. [Prerequisites](#prerequisites)
3. [Database Setup](#database-setup)
4. [Project Structure](#project-structure)
5. [Setup and Run](#setup-and-run)
6. [Additional Notes](#additional-notes)
7. [Troubleshooting](#troubleshooting)

---

## Features
- Real-time chat
- Matching engine with adjustable filters
- Personal profile with editable info and profile picture upload
- Friends management (add, delete, ignore)

---

## Prerequisites

### General
- **Git** (if you are cloning this repository)
- **PostgreSQL** (with PostGIS extension)
- **Java 23** (or a JDK suitable for your environment)
- **Maven** (to build and run the Spring Boot backend)
- **Node.js** + **npm** (for the React frontend)

Below are basic installation guides for each platform. Refer to official documentation if you need more detailed instructions.

---

### Linux Installation Guides

1. **Java 23 & Maven**  
   - Install OpenJDK 23 (command may differ depending on your distro):
     ```bash
     sudo apt-get update
     sudo apt-get install openjdk-23-jdk
     ```
   - Verify Java:
     ```bash
     java -version
     ```
   - Install Maven:
     ```bash
     sudo apt-get install maven
     ```
   - Verify Maven:
     ```bash
     mvn -v
     ```

2. **Node.js & npm**
   - You can install Node.js (which comes with npm) using your package manager:
     ```bash
     sudo apt-get install nodejs npm
     ```
   - Verify Node.js and npm:
     ```bash
     node -v
     npm -v
     ```

3. **PostgreSQL & PostGIS**
   - Install PostgreSQL:
     ```bash
     sudo apt-get install postgresql postgresql-contrib
     ```
   - Install PostGIS:
     ```bash
     sudo apt-get install postgis
     ```
   - Start PostgreSQL service:
     ```bash
     sudo service postgresql start
     ```

---

### macOS Installation Guides

1. **Java 23 & Maven**
   - Install Homebrew if you don’t have it:  
     ```bash
     /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
     ```
   - Install Java 23:
     ```bash
     brew install openjdk@23
     ```
     *(Adjust for your system if a stable tap is different.)*
   - Verify Java:
     ```bash
     java -version
     ```
   - Install Maven:
     ```bash
     brew install maven
     ```
   - Verify Maven:
     ```bash
     mvn -v
     ```

2. **Node.js & npm**
   - Using Homebrew:
     ```bash
     brew install node
     ```
   - Verify Node.js and npm:
     ```bash
     node -v
     npm -v
     ```

3. **PostgreSQL & PostGIS**
   - Install via Homebrew:
     ```bash
     brew install postgresql
     brew install postgis
     ```
   - Start PostgreSQL service:
     ```bash
     brew services start postgresql
     ```

---

### Windows Installation Guides

1. **Java 23 & Maven**
   - Download and install Java 23 (JDK) from [Oracle](https://www.oracle.com/java/technologies/downloads/).
   - Set your `JAVA_HOME` environment variable (usually done automatically if you check the box during setup).
   - Download Maven from the [official website](https://maven.apache.org/download.cgi) and follow the instructions.
   - Add the Maven `bin` directory to your `PATH`.

2. **Node.js & npm**
   - Download the Node.js installer from [nodejs.org](https://nodejs.org/).
   - Run the installer; npm comes bundled with Node.js.
   - Verify via `Command Prompt` or `PowerShell`:
     ```shell
     node -v
     npm -v
     ```

3. **PostgreSQL & PostGIS**
   - Download PostgreSQL installer from [postgresql.org](https://www.postgresql.org/download/).
   - During the setup, choose the option to include **PostGIS** if available, or install PostGIS separately.
   - Open **pgAdmin** or use the **psql** command-line tool to manage your database.

---

## Database Setup

1. **Create the Database**  
   Regardless of OS, once PostgreSQL is up and running:
   ```sql
   CREATE DATABASE my_database;
   ```

2. **Create the User**  
   ```sql
   CREATE USER my_user WITH ENCRYPTED PASSWORD 'kood';
   ```

3. **Grant Privileges**  
   ```sql
   GRANT ALL PRIVILEGES ON DATABASE my_database TO my_user;
   ```
4. **Enable PostGIS**  
   Go into the database
   ```
   \c my_database
   ```
   In your `my_database`:
   ```sql
   CREATE EXTENSION postgis;
   GRANT ALL ON SCHEMA public TO my_user;
   ```

---

## Project Structure

```
root
├── backend
│   └── match
│       ├── src
│       ├── pom.xml
│       └── ...
└── frontend
    └── match
        ├── src
        ├── package.json
        └── ...
```

**Backend**: Spring Boot application (Java 23, Maven).  
**Frontend**: React application (Node.js + npm).  

---

## Setup and Run

### 1. Clone the repository
```bash
git clone https://github.com/arwar001/matchme
cd match-me
```

### 2. Set up the Database
Ensure `my_database` exists in PostgreSQL, and that PostGIS is enabled. The user credentials in the Spring Boot config should match what you created in PostgreSQL.

### 3. Install Dependencies

#### Backend
```bash
cd backend/match
mvn clean install
```
*(This will download all necessary backend dependencies.)*

#### Frontend
```bash
cd ../../frontend/match
npm install
```
*(This will install all necessary frontend dependencies.)*

### 4. Run the Application

1. **Run the Backend**  
   In a terminal:
   ```bash
   cd backend/match
   mvn spring-boot:run
   ```
   The **first run** might take 40–100 seconds to initialize (populating user data, applying migrations, etc.).

2. **Run the Frontend**  
   In a separate terminal:
   ```bash
   cd frontend/match
   npm start
   ```

### 5. Access the Application
- Once both are running, open your browser at [https://localhost:3000](https://localhost:3000/) (default React dev port).
- The backend typically runs at [https://localhost:8443](https://localhost:8443/) by default (unless changed in Spring Boot config).

---

## Additional Notes
- If you change the database name, user, or password, be sure to update `application.properties` or `application.yml` in your Spring Boot project.
- The default database name is `my_database` and the password is `kood`. **This is for demonstration and review purposes**; use more secure passwords in production.
- The PostGIS extension is crucial for any location-based or geospatial features.

---

## Troubleshooting

1. **Port Conflicts**  
   - If port 8080 or 3000 is in use, modify the ports in the Spring Boot config or the React `package.json` (or `.env`) accordingly.

2. **Database Connection Errors**  
   - Make sure the database is running and the credentials in `application.properties` match.

3. **NPM or Maven Install Fails**  
   - Ensure your environment variables (`PATH`, `JAVA_HOME`) are correct.
   - Check that your version of Node.js, npm, Java, or Maven is up to date.

4. **Firewall Issues on Windows**  
   - If the backend is not reachable, ensure that Windows firewall allows inbound connections on the relevant port (usually 8080).

If you encounter any other issues, please check the logs or create an issue in the repository.

**Enjoy using MatchMe!**


