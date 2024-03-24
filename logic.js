// JavaScript is primarily used for implementing the logic and functionaility of web applications

// Variables

let board;
let score = 0;
let rows = 4;
let columns = 4;

// These variables will become true once the player achieves a value 2048, 4096, 8192, in one of his/her tiles.
let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;

// Declaring variable to be used for input
let startX = 0;
let startY = 0;


// Functions are callable programmed tasks

// setGame() function sets the game board to have tiles, and these tiles should have corressponding colors based on their values and this is through the help of updateTile() function
function setGame(){

	// Initialize the 4x4 game board with all tiles set to 0
	// Multidimensionals
	board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]; // Goal, we will use the backend board to add and move the tiles of the frontend board.

   	for(let r=0; r<rows; r++){
   		for(let c=0; c<columns; c++){

   			let tile = document.createElement("div");
   			tile.id = r.toString() + "-" + c.toString();
   			let num = board[r][c];

   			// We call updateTile() to update the appearance and color of the tiles
   			updateTile(tile, num);

   			document.getElementById("board").append(tile);
   		}
   	}

   	setTwo();
   	setTwo();
}

// Update Tile, updates the appearance and color of the tile
function updateTile(tile, num){

	tile.innerText = "";
	tile.classList.value = "";
	tile.classList.add("tile");

	if(num > 0){
		tile.innerText = num.toString();

		if(num <= 4096){
			tile.classList.add("x"+num.toString());
		}
		else{
			tile.classList.add("x8192");
		}
	}
}

// This code ensures that our application will wait until everything on the page is ready before using setGame function to load the tiles
window.onload = function(){
	setGame();
}

// handleSlide() function is responsible for the logic whenever arrow  keys are being pressed.
function handleSlide(e){

	// Displays what key is being pressed
	// console.log(e.code);

	e.preventDefault(); // This code is to disable the default behavior of the browser when clicking ArrowUp ArrowDown causing scroll up or scroll down
	// This code prevents scrolling.

	if(e.code == "ArrowLeft" && canMoveLeft() == true){
		slideLeft();
		setTwo();
	}
	else if(e.code == "ArrowRight" && canMoveRight() == true){
		slideRight();
		setTwo();
	}
	else if(e.code == "ArrowUp" && canMoveUp() == true){
		slideUp();
		setTwo();
	}
	else if(e.code == "ArrowDown" && canMoveDown() == true){
		slideDown();
		setTwo();
	}

	// This code replaces the score in the html document with the updated score.
	document.getElementById("score").innerText = score;

	checkWin();

	if(hasLost() == true){
		setTimeout(() => {
			alert("Game Over! You have lost the game. Game will restart" );
			restartGame();
			alert("Click any arrow key to restart");
		})
	}
}

document.addEventListener("keydown", handleSlide);

// filterZero() function removes the zero from the board, to make merging possible
function filterZero(row){
	return row.filter(num => num != 0); 
}

// slideFunction() is responsible for the merging of the tiles
function slide(row){ 
	row = filterZero(row);

	for(let i=0; i<row.length -1; i++){
		if(row[i] == row[i+1]){
			row[i] *= 2; 
			row[i+1] = 0;
			// Everytime the player merge a tile, the score will be updated
			score += row[i];
		}
	}

	while(row.length < columns){
		row.push(0);
	}

	return row;
}

// slideLeft() function is responsible in sliding  the tiles to the left and merging matching adjecent tiles with the help of slide() function
function slideLeft(){
	for(let r=0; r<rows; r++){
		let row = board[r];

		let originalRow = row.slice();

		row = slide(row); 
		board[r] = row;

		for(let c = 0; c<columns; c++){

			let tile= document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];
			updateTile(tile, num);

			if(originalRow[c] !== num && num !== 0){
				// If the current tile is not equal to the the original tile, let's apply animation

				tile.style.animation = "slide-from-right 0.3s";

				setTimeout(() => {
					tile.style.animation = "";
				}, 300)

			}

		}
	}
}

// slideRight() function is responsible in sliding  the tiles to the right and merging matching adjecent tiles with the help of slide() function
function slideRight(){
    for(let r=0; r<rows; r++){

		let row = board[r];
		let originalRow = row.slice();
		row.reverse();
		row = slide(row);
		row.reverse();

		board[r] = row;

		for(let c = 0; c<columns; c++){

			let tile= document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];
			updateTile(tile, num);

			if(originalRow[c] !== num && num !== 0){
				// If the current tile is not equal to the the original tile, let's apply animation

				tile.style.animation = "slide-from-left 0.3s";

				setTimeout(() => {
					tile.style.animation = "";
				}, 300)

			}

		}
	}
    

}


// slideUp() function is responsible in sliding  the tiles to the top and merging matching adjecent tiles with the help of slide() function
function slideUp(){
    // Loops repeats programmed task
	for(let c=0; c<columns; c++){
		let col = [board[0][c], board[1][c], board[2][c], board[3][c]];
		let originalCol = col.slice();
		col = slide(col);

		let changedIndeces = [];
		for(let r=0; r<rows; r++){
			if(originalCol[r] !== col[r]){
				changedIndeces.push(r);
			}
		}

		for(let r=0; r<rows; r++){
			board[r][c] = col[r];
			let tile = document.getElementById( r.toString() + "-" + c.toString());
			let num = board[r][c];
			updateTile(tile, num);

			if(changedIndeces.includes(r) && num !== 0){

				tile.style.animation = "slide-from-bottom 0.3s";

				setTimeout(() => {
					tile.style.animation = "";
				}, 300)
			}
		}
	}
}


// slideDown() function is responsible in sliding  the tiles to  bottom and merging matching adjecent tiles with the help of slide() function
function slideDown(){
	for(let c=0; c<columns; c++){
		let col = [board[0][c], board[1][c], board[2][c], board[3][c]];

		let originalCol = col.slice();

		col.reverse();
		col = slide(col);
		col.reverse();

		let changedIndeces = [];
		for(let r=0; r<rows; r++){
			if(originalCol[r] !== col[r]){
				changedIndeces.push(r);
			}
		}

		for(let r=0; r<rows; r++){
			board[r][c] = col[r];
			let tile= document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];
			updateTile(tile, num);

			if(changedIndeces.includes(r) && num !== 0){

				tile.style.animation = "slide-from-top 0.3s";

				setTimeout(() => {
					tile.style.animation = "";
				}, 300)
			}
		}
	}
}


// function hasEmptyTile() checks if there is vacant slot / empty tile in the board.
function hasEmptyTile(){
	for(let r = 0; r<rows; r++){
		for(let c= 0; c<columns; c++){

			if(board[r][c] == 0){
				return true;
			}
		}
	}
	return false;
}

// setTwo() function is responsible for generating a tile with number 2
function setTwo(){

	if(hasEmptyTile() == false){
		return;
	}

	// Code to generate a new tile
	let found = false

	while(!found){
		let r = Math.floor(Math.random() * rows);
		let c = Math.floor(Math.random() * columns);

		if(board[r][c] == 0){
			board[r][c] = 2;
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			tile.innerText = "2";
			tile.classList.add("x2");

			found = true;
		}

	}

}

// checkWin() function checks if there is tile that has 2048,4096, or 8192, so that the application will congratulate the user/player.
function checkWin(){
	for(let r = 0; r<rows; r++){
		for(let c= 0; c<columns; c++){
			if(board[r][c] == 2048 && is2048Exist == false){
				alert("You Win! You got the 2048");
				is2048Exist = true;
			}

			else if(board[r][c] == 4096 && is4096Exist == false){
				alert("You are unstoppable at 4096!");
				is4096Exist = true;
			}

			else if(board[r][c] == 8192 && is8192Exist == false){
				alert("Victory! You have reached 8192! You are incredibly awesome");
				is8192Exist = true;
			}
		}
	}
}

// hasLost() function checks if there is a vacant tile
		// because if there is, the player is not yet lost
	// hasLost() function also checks if there are tiles that could be merged
		// because if it is possible, then the player is not yet lost. 
function hasLost(){
	for(let r = 0; r<rows; r++){
		for(let c= 0; c<columns; c++){

			if(board[r][c] === 0){
				return false;
			}

			const currentTile = board[r][c];

			if (
               r > 0 && board[r - 1][c] === currentTile ||
               r < rows - 1 && board[r + 1][c] === currentTile ||
               c > 0 && board[r][c - 1] === currentTile ||
               c < columns - 1 && board[r][c + 1] === currentTile
           ) {
               // Found adjacent cells with the same value, user has not lost
               return false;
           }

		}

	}

	return true;
}

// restartGame() function restarts the game board and the score
function restartGame(){
	for(let r = 0; r<rows; r++){
		for(let c= 0; c<columns; c++){

			board[r][c] = 0;
			score = 0;
		}
	}

	setTwo();
}

// This will document the x and y coordinates where the touch start
document.addEventListener('touchstart', (e) => {
	startX = e.touches[0].clientX;
	startY = e.touches[0].clientY;
})


document.addEventListener('touchend', (e) => {

	if(!e.target.className.includes("tile")){
		return;
	}
	// Formula of diffX and diffY =  touchstart - touchend
	let diffX = startX - e.changedTouches[0].clientX;
	let diffY = startY - e.changedTouches[0].clientY;

	if(Math.abs(diffX) > Math.abs(diffY)){
		if(diffX > 0){ // If diffX is a positive number
			slideLeft();
			setTwo();
		}
		else{ // If diffX is a zero or negative number
			slideRight();
			setTwo();
		}
	}
	else{
		if(diffY > 0){ // If diffY is a positive number
			slideUp();
			setTwo();
		}
		else{  // If diffY is a zero or negative number
			slideDown();
			setTwo();
		}
	}

	document.getElementById("score").innerText = score;

	checkWin();

	if(hasLost() == true){
		setTimeout(() => {
			alert("Game Over! You have lost the game. Game will restart" );
			restartGame();
			alert("Click any arrow key to restart");
		})
	}

})

document.addEventListener('touchmove', (e) => {
	if(!e.target.className.includes("tile")){
		return;
	}
	e.preventDefault(); // This line prevents scrolling
}, {passive: false}); // Use passive: false to make preventDefault() work


function canMoveLeft(){

	for(let r=0; r<rows; r++){
		for(let c=1; c<columns; c++){

			if(board[r][c] !== 0){
				if(board[r][c-1] === 0 || board[r][c-1] === board[r][c]){
					return true;
				}
			}

		}
	}
	return false;
}


function canMoveRight(){
	for(let r=0; r<rows; r++){
		for(let c=columns - 2; c>=0; c--){

			if(board[r][c] !== 0){
				if(board[r][c+1] === 0 || board[r][c+1] === board[r][c]){
					return true;
				}
			}

		}
	}

	return false;

}

function canMoveUp(){
	for(let c = 0; c<columns; c++){
		for(let r=1; r<rows; r++){

			if(board[r][c] !== 0){
				if(board[r-1][c] === 0 || board[r-1][c] === board[r][c]){
					return true;
				}
			}
		}
	}
	return false;
}

function canMoveDown(){
	for(let c = 0; c<columns; c++){
		for(let r=rows-2; r>=0; r--){
			if(board[r][c] !== 0){
				if(board[r+1][c] === 0 || board[r+1][c] === board[r][c]){
					return true;
				}
			}
		}
	}
	return false;
}




















