/*
initialize the kitbuilder class
takes in string arguments of ids/classes to target with this functionality
all the properties are set here and methods are defined below it
button initializers are used to add event listeners to the buttons
*/
function kitBuilder(containerID,buttonClass,bundleSelectorClass,plusClass,minusClass,quantityClass,variantClass,productInputClass,priceLabelClass,priceClass,quantityID){
	this.kitContainer = document.getElementById(containerID);
	this.bundleButtons = document.getElementsByClassName(buttonClass);
	this.plusButtons = document.getElementsByClassName(plusClass);
	this.minusButtons = document.getElementsByClassName(minusClass);
  	this.quantities = document.getElementsByClassName(quantityClass);
	this.bundleContentElements = document.getElementsByClassName(bundleSelectorClass);
  	this.variantSelects = document.getElementsByClassName(variantClass);
  	this.productInputs = document.getElementsByClassName(productInputClass);
  	this.priceLabelClass = priceLabelClass;
  	//0 is for small screen price label and 1 is for large screen price label
  	this.priceLabels = document.getElementsByClassName(priceLabelClass);
  	this.prices = document.getElementsByClassName(priceClass);
  	this.basePrice = parseFloat(this.priceLabels[0].innerText.replace("$",""));
	this.bundleHeights = this.getHeights();
	this.bundleSelectorClass = bundleSelectorClass;
  	this.kitQuantity = document.getElementById(quantityID).value;
    this.quantityID = quantityID;
	this.initPlusButtons(this.plusButtons);
	this.initMinusButtons(this.minusButtons);
	this.initButtons(this.bundleButtons);
  	this.initSelects(this.variantSelects);
	this.initWindowListener();
  	this.setPriceLabel(this.priceLabels,this.initPriceLabel(this.prices,this.quantities),0);
  
  
}
//used to get the heights of the dropdown sections then set the heights to zero if none of them are open, parameter is required becuase this method is reused to recalculate heights when window size is changed, 
//use the scroll height because content is being cut off and hidden
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

//this method adds the event listeners to the plus buttons
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

		buttons[i].addEventListener("touchstart",function(e){
			this.plusDown(e);
		}.bind(this),false);

		buttons[i].addEventListener("touchend",function(e){
			this.plusUp(e);
		}.bind(this),false);

		buttons[i].addEventListener("mouseleave",function(e){
			this.plusUp(e);
		}.bind(this),false);
	}
}
//this method adds the event listeners to the minus buttons
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

		buttons[i].addEventListener("touchstart",function(e){
			this.minusDown(e);
		}.bind(this),false);

		buttons[i].addEventListener("touchend",function(e){
			this.minusUp(e);
		}.bind(this),false);

		buttons[i].addEventListener("mouseleave",function(e){
			this.minusUp(e);
		}.bind(this),false);
	}
}

kitBuilder.prototype.initSelects = function(selects){
	for(var i = 0;i < selects.length;i++){
		selects[i].addEventListener("click",function(e){
			this.selectChanged(e);
		}.bind(this),false);
	}
}
/*
kitBuilder.prototype.getLabelPrice = function(){
  var priceLabels = document.getElementsByClassName(this.priceLabelClass);
  var labelPrice = parseFloat(this.priceLabels[0].innerText.replace("$",""));
  return labelPrice;
}
*/
kitBuilder.prototype.updateKitPrice = function(kitQuantity){

  var totalPrice = 0;

  for(var i = 0;i < this.quantities.length;i++){
    var componentPrice = parseFloat(this.prices[i].innerText.replace("$","")) * parseInt(this.quantities[i].value);
    totalPrice += componentPrice

  }

  var finalPrice = totalPrice * kitQuantity;
  //console.log(finalPrice,kitQuantity);
  return finalPrice;

}

kitBuilder.prototype.setPriceLabel = function(priceLabels,newPrice){
  
  for(var i = 0;i < priceLabels.length;i++){
    if(newPrice % 1 === 0 ){
       priceLabels[i].innerText = "$" + (newPrice) + ".00";
       
    }
    else{
      priceLabels[i].innerText = "$" + (newPrice);
    }

    
  }

}

kitBuilder.prototype.initPriceLabel = function(prices,quantities){
  var newPrice = 0;
  for(var i =0;i < prices.length;i++){
    if(quantities[i].value !== "0"){
      var productPrice = parseFloat(prices[i].innerText.replace("$","")) * parseInt(quantities[i].value);
      newPrice += productPrice;
    }
  }
  //console.log("newPrice",newPrice);
  return newPrice;
  
}

//add event listeners to the dropdown buttons
kitBuilder.prototype.initButtons = function(buttons){
	for(var i = 0;i < buttons.length;i++){
		buttons[i].addEventListener("click",function(e){
			this.buttonClicked(e);
		}.bind(this),false);
	}
}
//add resize event
kitBuilder.prototype.initWindowListener = function(){
	window.addEventListener('resize',function(e){
		this.windowResized(e);
	}.bind(this),false);
}

kitBuilder.prototype.selectChanged = function(event){
	var selectID = event.currentTarget.dataset.selectid;
	this.productInputs[selectID].attributes.variant_id.value = event.currentTarget.options[event.currentTarget.selectedIndex].attributes.variant_id.value;
  	var oldPrice = this.prices[selectID].innerText;
  	var newPrice = event.currentTarget.options[event.currentTarget.selectedIndex].attributes.variant_price.value;
  	this.prices[selectID].innerText = event.currentTarget.options[event.currentTarget.selectedIndex].attributes.variant_price.value;
    if(oldPrice !== newPrice){
      var kitQuantity = document.getElementById(this.quantityID).value;
      var finalPrice = this.updateKitPrice(kitQuantity);
      this.setPriceLabel(this.priceLabels,finalPrice); 
    }
  	
}
//use these methods to add button press effect
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

//handle plus button click events and increment counter
kitBuilder.prototype.plusClicked = function(event){
	//console.log("plus clicked ", event.currentTarget);
	var valueLabel = parseInt(event.currentTarget.previousElementSibling.textContent);
	//console.log(valueLabel);
	valueLabel++;
 	var plusID = event.currentTarget.dataset.plusid;
  	var inputQuantity = this.quantities[plusID];
  	var price = parseFloat(this.prices[plusID].innerText.replace("$",""));
  	//var labelPrice = this.getLabelPrice();	 
  	inputQuantity.value = valueLabel.toString();
	event.currentTarget.previousElementSibling.textContent = valueLabel.toString();
  	
  	var kitQuantity = document.getElementById(this.quantityID).value;
 	var finalPrice = this.updateKitPrice(kitQuantity);
  	this.setPriceLabel(this.priceLabels,finalPrice);  
}
//handle minus button click events and decrement counter
kitBuilder.prototype.minusClicked = function(event){
	//console.log("minus clicked ", event.target);
	var valueLabel = parseInt(event.currentTarget.nextElementSibling.textContent);
	//console.log(valueLabel);
	if(valueLabel === 0){
		return;
	}
	else{
		valueLabel--;
        var minusID = event.currentTarget.dataset.minusid;
      	var inputQuantity = this.quantities[minusID];
      	inputQuantity.value = valueLabel.toString();
        var price = parseFloat(this.prices[minusID].innerText.replace("$",""));
      	//var labelPrice = this.getLabelPrice();
		event.currentTarget.nextElementSibling.textContent = valueLabel.toString();
      	
      	var kitQuantity = document.getElementById(this.quantityID).value;
        var finalPrice = this.updateKitPrice(kitQuantity);
     	this.setPriceLabel(this.priceLabels,finalPrice); 
	}
}
//handle resize event by setting height of open dropdowns to auto so that content is not cut off,then recaclulate the heights of the dropdowns then assign 
//the auto height as the current height, need to do this to keep the closing animation effect
kitBuilder.prototype.windowResized = function(event){

	//set heights to auto that are open
	for(var i =0; i < this.bundleContentElements.length;i++){
		
		if(this.bundleContentElements[i].style.height !== "0px"){
			//console.log("first loop ",this.bundleContentElements[i].style.height);
			this.bundleContentElements[i].style.height = "auto";
		}
	}
	this.bundleHeights = this.getHeights(true);
	//then reassign these heights to keep animation effect
	for(var i =0; i < this.bundleContentElements.length;i++){
		
		if(this.bundleContentElements[i].style.height !== "0px"){
			//console.log(this.bundleContentElements[i].scrollHeight);
			this.bundleContentElements[i].style.height = this.bundleContentElements[i].scrollHeight + "px";
		}
	}
	
}
//this method handles when a dropdown button is clicked changes the height of the dropdown content and the rotation angle 
//of the of the arrow for the animation effects also removes the bottom border after a 450ms
kitBuilder.prototype.buttonClicked = function(event){
	//event.stopPropagation();
	event.preventDefault();
	var optionContent = event.currentTarget.nextElementSibling;
	//console.log("button ", optionContent);
	var arrowIcon = event.currentTarget.children[1];

	if(optionContent.style.height === "0px"){
		arrowIcon.style.transform = "rotate(180deg)";
		var bundleId = event.currentTarget.dataset.bundleid;
		//console.log(this.bundleHeights, bundleId);
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

function initKit(){
	var kit1 = new kitBuilder("bundle-container1","bundle-button","bundle-selector-content","plusIcon","minusIcon","kit_quantity","variantSelect","product_placeholder","product__price","price","currentQuantity");
}

