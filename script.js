const checkbox = document.getElementById('checkbox');
const grid = document.getElementById('grid');
const gridItems = document.querySelectorAll('.grid-item');
const targetObject = document.getElementById('target-object');
const puzzles = [
    {
        targetObject: 'Cows',
        validPath: './images/cows/valid/',
        decoyPath: './images/cows/decoy/',
        numValidImages: 3, 
        numDecoyImages: 6,
        mode: 'random'
    },
    {
        targetObject: 'Mines (3)',
        mode: 'static',
        validMap: [
            [1, 0, 0],
            [0, 1, 0],
            [1, 0, 0]
        ],
        imageMap: [
            ['./images/mines/empty.png', './images/mines/2.png', './images/mines/empty.png'],
            ['./images/mines/empty.png', './images/mines/empty.png', './images/mines/1.png'],
            ['./images/mines/empty.png', './images/mines/2.png', './images/mines/1.png']
        ]
    },
    {
        targetObject: 'Something in common (either group)',
        validPath: './images/connections/valid/',
        decoyPath: './images/connections/decoy/',
        numValidImages: 5, 
        numDecoyImages: 5,
        mode: 'either'
    },
    {
        targetObject: 'Airbus aircraft',
        validPath: './images/airbus/valid/',
        decoyPath: './images/airbus/decoy/',
        numValidImages: 5, 
        numDecoyImages: 5,
        mode: 'random'
    },
    {
        targetObject: 'IKEA items',
        validPath: './images/ikea/valid/',
        decoyPath: './images/ikea/decoy/',
        numValidImages: 4, 
        numDecoyImages: 5,
        mode: 'random'
    },
    {
        targetObject: 'Light Grey Stained Glass Panes',
        validPath: './images/stained-glass/valid/',
        decoyPath: './images/stained-glass/decoy/',
        numValidImages: 1, 
        numDecoyImages: 1,
        mode: 'repeat'
    }
];

let selectedItems = new Set();
let correctAnswers = new Set();
let lives = 3;
let currentPuzzleIndex = 0;
let failed = false;
let completed = false;

checkbox.addEventListener('click', () => {
    if (failed || completed) return;
    
    grid.style.opacity = '1';
    grid.style.visibility = 'visible';
    currentPuzzleIndex = 0;
    setupGrid();
    selectedItems.clear();
    lives = 3;
    document.getElementById('lives-count').textContent = lives;
});

function getRandomImageFromFolder(basePath, numImages) {
    const randomIndex = Math.floor(Math.random() * numImages) + 1;
    return `${basePath}${randomIndex}.png`;  // Assumes images are named 1.png, 2.png, etc.
}

function getRandomUniqueImages(basePath, numImages, count) {
    // Make sure we don't request more images than available
    count = Math.min(count, numImages);
    
    // Create array of all possible indices
    let indices = Array.from({ length: numImages }, (_, i) => i + 1);
    // Shuffle array
    indices = indices.sort(() => Math.random() - 0.5);
    // Take only the number we need
    return indices.slice(0, count).map(index => `${basePath}${index}.png`);
}

function setupGrid() {
    currentPuzzle = puzzles[currentPuzzleIndex];
    
    document.getElementById('target-object').textContent = currentPuzzle.targetObject;
    
    correctAnswers.clear();
    
    if (currentPuzzle.mode === 'static') {
        // Handle static puzzles using the map
        let index = 0;
        currentPuzzle.validMap.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                if (cell === 1) {
                    correctAnswers.add(index);
                }
                index++;
            });
        });
        
        // Assign images based on the imageMap
        const gridItems = document.querySelectorAll('.grid-item');
        index = 0;
        currentPuzzle.imageMap.forEach((row, rowIndex) => {
            row.forEach((imagePath, colIndex) => {
                gridItems[index].style.backgroundImage = `url(${imagePath})`;
                index++;
            });
        });
    } else {
        // Random, repeat, and either modes
        let numCorrect;
        if (currentPuzzle.mode === 'repeat') {
            numCorrect = 4;
        } else {
            numCorrect = Math.min(4, currentPuzzle.numValidImages);
        }
        const numDecoyNeeded = 9 - numCorrect;
        
        // Get all available images first
        const baseValidImages = getRandomUniqueImages(currentPuzzle.validPath, currentPuzzle.numValidImages, currentPuzzle.numValidImages);
        const baseDecoyImages = getRandomUniqueImages(currentPuzzle.decoyPath, currentPuzzle.numDecoyImages, currentPuzzle.numDecoyImages);
        
        // Create arrays for the images we'll use
        let validImages = [];
        let decoyImages = [];
        
        if (currentPuzzle.mode === 'repeat') {
            // Repeat mode: use the first image multiple times but randomize order
            const validImage = baseValidImages[0];
            const decoyImage = baseDecoyImages[0];
            
            // Create arrays with duplicates
            validImages = Array(numCorrect).fill(validImage);
            decoyImages = Array(numDecoyNeeded).fill(decoyImage);
            
            // Shuffle both arrays
            validImages = validImages.sort(() => Math.random() - 0.5);
            decoyImages = decoyImages.sort(() => Math.random() - 0.5);
        } else {
            // Random and either modes: shuffle and take what we need
            validImages = [...baseValidImages]
                .sort(() => Math.random() - 0.5)
                .slice(0, numCorrect);
            
            decoyImages = [...baseDecoyImages]
                .sort(() => Math.random() - 0.5)
                .slice(0, numDecoyNeeded);
        }
        
        // Randomize positions
        let positions = Array.from({ length: 9 }, (_, i) => i);
        positions = positions.sort(() => Math.random() - 0.5);
        
        // For 'either' mode, we'll store both valid and decoy positions
        if (currentPuzzle.mode === 'either') {
            const validPositions = positions.slice(0, numCorrect);
            const decoyPositions = positions.slice(numCorrect);
            correctAnswers = new Set([validPositions, decoyPositions]);
            
            // Assign images to grid
            const gridItems = document.querySelectorAll('.grid-item');
            gridItems.forEach((item, index) => {
                if (validPositions.includes(index)) {
                    const validImageIndex = validPositions.indexOf(index);
                    item.style.backgroundImage = `url(${validImages[validImageIndex]})`;
                } else {
                    const decoyImageIndex = decoyPositions.indexOf(index);
                    item.style.backgroundImage = `url(${decoyImages[decoyImageIndex]})`;
                }
            });
        } else {
            // Take first numCorrect positions for correct answers (random mode)
            const correctPositions = positions.slice(0, numCorrect);
            correctAnswers = new Set(correctPositions);
            
            // Assign images to grid
            const gridItems = document.querySelectorAll('.grid-item');
            let validIndex = 0;
            let decoyIndex = 0;
            
            gridItems.forEach((item, index) => {
                if (correctAnswers.has(index)) {
                    item.style.backgroundImage = `url(${validImages[validIndex++]})`;
                } else {
                    item.style.backgroundImage = `url(${decoyImages[decoyIndex++]})`;
                }
            });
        }
    }

    // Add event listeners to all grid items
    const gridItems = document.querySelectorAll('.grid-item');
    gridItems.forEach((item, index) => {
        const newItem = item.cloneNode(true);
        item.parentNode.replaceChild(newItem, item);
        
        newItem.addEventListener('click', () => {
            if (selectedItems.has(index)) {
                selectedItems.delete(index);
                newItem.classList.add('removing-selection');
                setTimeout(() => {
                    newItem.classList.remove('selected');
                    newItem.classList.remove('removing-selection');
                }, 300);
            } else {
                selectedItems.add(index);
                newItem.classList.add('selected');
            }
        });
    });
}

function resetGame() {
    // Reset failed state
    failed = false;
    
    // Remove failed classes
    checkbox.classList.remove('failed');
    document.getElementById('outerbox').classList.remove('failed');
    
    // Hide play again button
    document.getElementById('play-again').style.display = 'none';
    
    // Reset lives
    lives = 3;
    document.getElementById('lives-count').textContent = lives;
    
    // Reset puzzle index
    currentPuzzleIndex = 0;
    
    // Clear selections
    selectedItems.clear();
    document.querySelectorAll('.grid-item').forEach(item => {
        item.classList.remove('selected');
    });
    
    // Reset checkbox
    checkbox.style.backgroundColor = '';
    checkbox.style.borderColor = '';
    
    // Reset completed state
    completed = false;
    
    // Setup new grid
    setupGrid();
}

function verify() {
    let isCorrect;
    
    if (currentPuzzle.mode === 'either') {
        // Check if selected items match either all valid or all decoy positions
        const [validPositions, decoyPositions] = correctAnswers;
        const selectedArray = Array.from(selectedItems);
        
        isCorrect = (
            // Check if matches all valid positions
            (selectedArray.length === validPositions.length && 
             selectedArray.every(item => validPositions.includes(item))) ||
            // Check if matches all decoy positions
            (selectedArray.length === decoyPositions.length && 
             selectedArray.every(item => decoyPositions.includes(item)))
        );
    } else {
        // Original verification for other modes
        isCorrect = Array.from(selectedItems).every(item => correctAnswers.has(item)) 
            && selectedItems.size === correctAnswers.size;
    }
    
    if (isCorrect) {
        // Add blue flash animation
        grid.classList.add('flash-blue');
        setTimeout(() => {
            grid.classList.remove('flash-blue');
        }, 500);
        
        // Regenerate a life if less than 3
        if (lives < 3) {
            lives++;
            document.getElementById('lives-count').textContent = lives;
        }
        
        currentPuzzleIndex = (currentPuzzleIndex + 1) % puzzles.length;
        
        if (currentPuzzleIndex === 0) {
            setTimeout(() => {
                grid.style.opacity = '0';
                grid.style.visibility = 'hidden';
                checkbox.style.backgroundColor = '#4285f4';
                checkbox.style.borderColor = '#4285f4';
                completed = true;
                checkbox.classList.add('failed');
                document.getElementById('outerbox').classList.add('failed');
            }, 500);
        } else {
            setTimeout(() => {
                selectedItems.clear();
                document.querySelectorAll('.grid-item').forEach(item => {
                    item.classList.remove('selected');
                });
                setupGrid();
            }, 500); // Wait for flash animation to complete
        }
    } else {
        lives--;
        document.getElementById('lives-count').textContent = lives;
        
        // Add flash animation
        grid.classList.add('flash-red');
        setTimeout(() => {
            grid.classList.remove('flash-red');
        }, 500);
        
        if (lives <= 0) {
            // Set failed state
            failed = true;
            
            // Show failure state
            checkbox.style.backgroundColor = '#dc3545';
            checkbox.style.borderColor = '#dc3545';
            
            // Add failed classes to change cursor
            checkbox.classList.add('failed');
            document.getElementById('outerbox').classList.add('failed');
            
            // Show play again button
            document.getElementById('play-again').style.display = 'block';
            
            // Close the popup
            grid.style.opacity = '0';
            grid.style.visibility = 'hidden';
            
            // Clear selections
            selectedItems.clear();
            document.querySelectorAll('.grid-item').forEach(item => {
                item.classList.remove('selected');
            });
        } else {
            selectedItems.clear();
            document.querySelectorAll('.grid-item').forEach(item => {
                item.classList.remove('selected');
            });
        }
    }
}
