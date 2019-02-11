function kitBuilder(containerID,buttonIDs,bundleSelectorClass,plusClass,minusClass){
	this.kitContainer = document.getElementById(containerID);
	this.bundleButtons = this.getButtons(buttonIDs);
	this.plusButtons = document.getElementsByClassName(plusClass);
	this.minusButtons = document.getElementsByClassName(minusClass);
	this.bundleContentElements = document.getElementsByClassName(bundleSelectorClass);
	this.bundleHeights = this.getHeights();
	for(var i = 0;i < this.bundleButtons.length;i++){
		this.initButtons(this.bundleButtons[i]);
	}
	//this.bundleButtons.forEach(button => this.initButtons(button));
	this.bundleSelectorClass = bundleSelectorClass;
	this.initPlusButtons(this.plusButtons);
	this.initMinusButtons(this.minusButtons);
	this.initWindowListener();
}

kitBuilder.prototype.getHeights = function(isOpen){
	if(isOpen === undefined){
		isOpen = false;
	}
	var heights = [];
	for(var i = 0;i < this.bundleContentElements.length;i++){
		heights.push(this.bundleContentElements[i].scrollHeight);
		if(!isOpen){
			this.bundleContentElements[i].style.height = "0px";
		}			
	}

	return heights;
}

kitBuilder.prototype.getButtons = function(buttonIDs) {
	var buttonArr = [];
	for(var i = 0;i < buttonIDs.length;i++){
		buttonArr.push(document.getElementById(buttonIDs[i]));
	}

	return buttonArr;
}

kitBuilder.prototype.initPlusButtons = function(buttons){
	for(var i =0;i < buttons.length; i++){
		buttons[i].addEventListener("click",function(e){
			this.plusClicked(e);
		}.bind(this),false);
		//handles button click effect
		buttons[i].addEventListener("mousedown",function(e){
			this.plusDown(e);
		}.bind(this),false);

		buttons[i].addEventListener("mouseup",function(e){
			this.plusUp(e);
		}.bind(this),false);

		buttons[i].addEventListener("mouseleave",function(e){
			this.plusUp(e);
		}.bind(this),false);
	}
}

kitBuilder.prototype.initMinusButtons = function(buttons){
	for(var i =0;i < buttons.length; i++){
		buttons[i].addEventListener("click",function(e){
			this.minusClicked(e);
		}.bind(this),false);

		buttons[i].addEventListener("mousedown",function(e){
			this.minusDown(e);
		}.bind(this),false);

		buttons[i].addEventListener("mouseup",function(e){
			this.minusUp(e);
		}.bind(this),false);

		buttons[i].addEventListener("mouseleave",function(e){
			this.minusUp(e);
		}.bind(this),false);
	}
}

kitBuilder.prototype.initButtons = function(button){
	button.addEventListener("click",function(e){
		this.buttonClicked(e);
	}.bind(this),false);
}

kitBuilder.prototype.initWindowListener = function(){
	window.addEventListener('resize',function(e){
		this.windowResized(e);
	}.bind(this),false);
}
//use these to add button press effect
kitBuilder.prototype.plusDown = function(event){
	var plusButton = event.currentTarget;
	plusButton.style.position = "relative";
	plusButton.style.left = "3px";
	plusButton.style.top = "3px";
}

kitBuilder.prototype.plusUp = function(event){
	var plusButton = event.currentTarget;
	plusButton.style.position = "initial";
}

kitBuilder.prototype.plusLeave = function(event){
	var plusButton = event.currentTarget;
	plusButton.style.position = "initial";
}

kitBuilder.prototype.minusDown = function(event){
	var minusButton = event.currentTarget;
	minusButton.style.position = "relative";
	minusButton.style.left = "3px";
	minusButton.style.top = "3px";
}

kitBuilder.prototype.minusUp = function(event){
	var minusButton = event.currentTarget;
	minusButton.style.position = "initial";
}

//handle quantity buttons clicked
kitBuilder.prototype.plusClicked = function(event){
	console.log("plus clicked ", event.currentTarget);
	var valueLabel = parseInt(event.currentTarget.previousElementSibling.textContent);
	//console.log(valueLabel);
	valueLabel++;
	event.currentTarget.previousElementSibling.textContent = valueLabel.toString();
}

kitBuilder.prototype.minusClicked = function(event){
	console.log("minus clicked ", event.target);
	var valueLabel = parseInt(event.currentTarget.nextElementSibling.textContent);
	//console.log(valueLabel);
	if(valueLabel === 0){
		return;
	}
	else{
		valueLabel--;
		event.currentTarget.nextElementSibling.textContent = valueLabel.toString();
	}
}

kitBuilder.prototype.windowResized = function(event){

	//set heights to auto that are open
	for(var i =0; i < this.bundleContentElements.length;i++){
		
		if(this.bundleContentElements[i].style.height !== "0px"){
			console.log("first loop ",this.bundleContentElements[i].style.height);
			this.bundleContentElements[i].style.height = "auto";
		}
	}
	this.bundleHeights = this.getHeights(true);
	//then reassign these heights to keep animation effect
	for(var i =0; i < this.bundleContentElements.length;i++){
		
		if(this.bundleContentElements[i].style.height !== "0px"){
			console.log(this.bundleContentElements[i].scrollHeight);
			this.bundleContentElements[i].style.height = this.bundleContentElements[i].scrollHeight + "px";
		}
	}
	
}

kitBuilder.prototype.buttonClicked = function(event){
	event.stopPropagation();
	event.preventDefault();
	//console.log("clicked", event.currentTarget);
	//console.log("next sibling", event.currentTarget.nextElementSibling);
	var optionContent = event.currentTarget.nextElementSibling;
	console.log("button ", optionContent);
	var arrowIcon = event.currentTarget.children[1];

	if(optionContent.style.height === "0px"){
		arrowIcon.style.transform = "rotate(180deg)";
		var bundleId = event.currentTarget.dataset.bundleid;
		console.log(this.bundleHeights, bundleId);
		optionContent.style.height = this.bundleHeights[bundleId] + "px";
		optionContent.style.borderBottom = "1px solid #ddd";
	}
	else{
		arrowIcon.style.transform = "rotate(0deg)";
		optionContent.style.height = "0px";
		setTimeout(function(){
			optionContent.style.borderBottom = "none";
		},450);
	}	
	
}
/*
document.addEventListener( "DOMContentLoaded", function() {
	var kit1 = new kitBuilder("bundle-container1",["bundle-button1","bundle-button2","bundle-button3"],"bundle-selector-content","plusIcon","minusIcon");
});
*/

function initKit(){
	var kit1 = new kitBuilder("bundle-container1",["bundle-button1","bundle-button2","bundle-button3"],"bundle-selector-content","plusIcon","minusIcon");
}

window.onload = initKit;

//$(initKit);