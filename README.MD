# WonderWay

![WonderWay](./code/public/img/WonderWay.jpg)

**WonderWay** is a travel planning tool that helps you explore and organize visits to hotels, attractions, and restaurants with ease. It integrates the **Tripadvisor API** and uses a lightweight **local backend** powered by `json-server`, delivering a fast and seamless experience.

---

## Team Members

- **Patricio Tubio** - [soypato](https://github.com/soypato)
- **Enzo Güerci** - [Ruzito-San](https://github.com/Ruzito-San)
- **Juan Manuel Ciardi** - [JuaniiC07](https://github.com/JuaniiC07)
- **Chiara Ciardi** - [Chiari13](https://github.com/Chiari13)
- **Ignacio Acuña** - [iMonety](https://github.com/iMonety)

---

## Key Features

- 🔍 **Search hotels, restaurants, and attractions** with real-time data from the Tripadvisor API.  
- 💾 **Local data handling** through a fast mock backend powered by `json-server`.  
- 🖥️ **Clean and user-friendly UI** built with Angular.

---

## Prerequisites

Before installing, ensure you have the following installed globally:

- **[Node.js](https://nodejs.org/)** (v16+ recommended)
- **[Angular CLI](https://angular.io/cli)**
- **[json-server](https://www.npmjs.com/package/json-server)**

Install them (if needed) using:

```bash
npm install -g @angular/cli json-server
```

---

## Getting Started

Follow these steps to get WonderWay up and running:

1. **Add the Tripadvisor API Key file**:  
   Create a file named `tripKey.ts` **in the parent folder** of the main project directory.  
   This acts like a `.env` file to store your access token securely.

   Example content:

   ```ts
   export const tripkey = {
     production: true,
     token: 'your_tripadvisor_token_here'
   };
   ```

2. **Install project dependencies**:

   ```bash
   npm install
   ```

3. **Navigate to the Angular project folder**:

   ```bash
   cd code
   ```

4. **Start the Angular development server**:

   ```bash
   ng serve -o
   ```

5. **Start the JSON backend server**:  
   Open a new terminal window, navigate to the `code` folder again:

   ```bash
   cd code
   json-server db/db.json
   ```

6. 🎉 That’s it! Open your browser and start exploring **WonderWay**.

---

## Tech Stack

- **Frontend**: Angular
- **Backend (Mock API)**: json-server
- **External Data Source**: Tripadvisor API

---

## Contributing

WonderWay is a collaborative project created for learning and fun.  
Feel free to fork, suggest improvements, or open a pull request. We welcome feedback and contributions!

---

## License

This project does not currently use a formal license. If you'd like to use or adapt it, please contact any of the team members listed above.

