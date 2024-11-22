
# WonderWay

**WonderWay** is a travel management tool designed to help you discover and organize visits to hotels, attractions, and restaurants efficiently. We use the Tripadvisor API and a local server based on `json-server` to provide a fast and reliable experience.

## Team Members

- **Patricio Tubio** - [soypato](https://github.com/soypato)
- **Enzo Güerci** - [Ruzito-San](https://github.com/Ruzito-San)
- **Juan Manuel Ciardi** - [JuaniiC07](https://github.com/JuaniiC07)
- **Chiara Ciardi** - [Chiari13](https://github.com/Chiari13)
- **Ignacio Acuña** - [iMonety](https://github.com/iMonety)

---

## Main Features

- **Search hotels, restaurants, and attractions**: Detailed and real-time information provided by the Tripadvisor API.
- **Local management**: Data stored and handled using `json-server`.
- **User-friendly interface**: Designed for a simple and direct user experience.

---

## Installation and Usage Instructions

1. **Prepare the project environment**:
   - Place the file `tripKey.ts` one folder above the repository. This file contains the access token required to interact with the Tripadvisor API.

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Navigate to the code directory**:
   ```bash
   cd code
   ```

4. **Start the Angular server**:
   ```bash
   ng s -o
   ```

5. **Start the JSON server**:
   - Open a new terminal and navigate again to the code directory:
     ```bash
     cd code
     ```
   - Run the following command:
     ```bash
     json-server db/db.json
     ```

6. Done! Now you can explore **WonderWay** in your browser.

---

## Technologies Used

- **Frontend**: Angular
- **Backend**: JSON-Server
- **Data API**: Tripadvisor

---

## Contributions

This project was developed to learn, collaborate, and provide a useful tool. If you have suggestions or want to contribute, feel free to contact us or create a pull request.

---

## License

This project is not currently under any specific license. If you have any questions about its use, please contact any of the team members listed above.
