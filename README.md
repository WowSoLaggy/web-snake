
# Snake Game

This is a modern implementation of the classic Snake game built with HTML, CSS, and JavaScript made with the help of ChatGPT 4o. The game features a leaderboard that displays the top 10 scores, which are stored in a MongoDB database. The snake starts from the center of the canvas and speeds up with each apple it eats. The project also includes a responsive design and an elegant UI with a gradient-styled leaderboard and footer signature.

## Features

- **Classic Gameplay**: Enjoy the nostalgic gameplay of the classic Snake game.
- **Leaderboard**: The top 10 scores are saved in a MongoDB database and displayed on the leaderboard.
- **Responsive Design**: The game adjusts to different screen sizes for optimal user experience.
- **UI Enhancements**: Gradient backgrounds, smooth animations, and a stylish footer signature.
- **Speed Increase**: The snake speeds up slightly with each apple it consumes.
- **Anti-Self Collision**: Prevents the snake from making 180-degree turns to avoid self-collisions.

## Getting Started

### Prerequisites

- Node.js and npm installed on your local machine.
- MongoDB installed locally or use MongoDB Atlas for cloud database.

### Installation

1. **Clone the repository**:
    \`\`\`bash
    git clone https://github.com/WowSoLaggy/web-snake.git
    cd snake-game
    \`\`\`

2. **Install server dependencies**:
    \`\`\`bash
    npm install
    \`\`\`

3. **Start the MongoDB server**:
    \`\`\`bash
    mongod
    \`\`\`

4. **Run the server**:
    \`\`\`bash
    node server.js
    \`\`\`

5. **Open the game in your browser**:
    Navigate to `http://localhost:3000` to start playing.

## Usage

- Use arrow keys or `WASD` keys to control the snake.
- Eat the apples to grow the snake and increase your score.
- Avoid running into the walls or the snake's own body.
- Submit your score at the end of the game to see if you made it to the leaderboard.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

## License

This project is licensed under the MIT License.

## Contact

If you have any questions or suggestions, feel free to open an issue or contact me directly at dohxehapo@gmail.com.
