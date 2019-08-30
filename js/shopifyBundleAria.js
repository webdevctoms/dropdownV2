//class to assist in handling base kits
function Base_Kit_Handler(variantSelector,kitInstance,productVariants,productKitOptions,variantClass,productInputClass){
	this.kitInstance = kitInstance;
	this.variantChangedEvent;
	//keys = variant index, values = metafield index
	this.metafieldMap;
	this.productVariants = productVariants;
	this.productKitOptions = productKitOptions;
	this.productInputs = document.getElementsByClassName(productInputClass);
	this.variantSelects = document.getElementsByClassName(variantClass);
	console.log('kitInstance.kitContainer',kitInstance.kitContainer,productVariants,productKitOptions);
 	if(variantSelector && variantSelector.includes('product__size')){
		this.variantSelector = document.getElementsByClassName(variantSelector);
	}
	else if(variantSelector && variantSelector.includes('single-option-selector')){
		this.variantSelector = this.findSelect(document.getElementsByClassName(variantSelector));
	}
	else{
		this.variantSelector = undefined;
	}
  
	if(this.variantSelector){
		this.metafieldMap = this.mapMetafields(productVariants,productKitOptions.base_kits);
		
		var selectedVariant = this.getCurrentVariant(this.variantSelector);
		this.initVariantSelector(this.variantSelector);
		console.log(this.metafieldMap);
		this.setBaseKit(this.productKitOptions.base_kits[this.metafieldMap[selectedVariant]]);
	}
}

//check if product is a variant
Base_Kit_Handler.prototype.checkVariantSelects = function(variantId,quantity){
	//new data to be placed in the kit builder
	var data = {};
	for(var i = 0;i < this.variantSelects.length;i++){
		//console.dir(this.variantSelects[i]);
		var currentSelect = this.variantSelects[i];
		for(var k = 0;k < currentSelect.children.length;k++){
			//0 will be variant_id, if it is not then would need to add for loop
			var optionValue = currentSelect.children[k];
			if(optionValue.attributes.variant_id.value == variantId){
				//console.log('option id',optionValue,variantId);
				data.quantity = quantity;
				data.variant_id = variantId;
				data.productIndex = currentSelect.dataset.selectid;
				data.price = optionValue.attributes.variant_price.value;
				return data;
			}
		}
	}

	return false;
};
//check inputs for the variant ID
Base_Kit_Handler.prototype.checkProductInputs = function(variantId,quantity){
	//new data to be placed in the kit builder
	var data = {};
	for(var i = 0;i < this.productInputs.length;i++){
		//console.dir(this.productInputs[i]);
		var currentInput = this.productInputs[i];
		if(currentInput.attributes.variant_id.value == variantId){
			data.quantity = quantity;
			data.variant_id = variantId;
			data.productIndex = currentInput.dataset.quantityid;	

			return data;
		}
	}

	return false;
};

//handle all functions from kit instance for updating the kit builder
Base_Kit_Handler.prototype.setBaseKit = function(kitOptions){
	//this.checkVariantSelects();
	console.log('kit options',kitOptions);
	var productData = [];
	for(var i = 0;i < kitOptions.products.length;i++){
		var currentVariant = kitOptions.products[i];
		var newProductData = this.checkProductInputs(currentVariant.id,currentVariant.quantity);
		if(newProductData){
			productData.push(newProductData);
		}
	}

	for (var i = 0; i < kitOptions.products.length; i++) {
		var currentVariant = kitOptions.products[i];
		var newProductData = this.checkVariantSelects(currentVariant.id,currentVariant.quantity);
		if(newProductData){
			productData.push(newProductData);
		}
	}

	//console.log('productData',productData);
	this.kitInstance.updateBaseKit(productData);
};

Base_Kit_Handler.prototype.mapMetafields = function(productVariants,baseKits){
	var mapVariants = {};

	for(var i = 0;i < productVariants.length;i++){
		for(var k = 0;k < baseKits.length;k++){
			if(productVariants[i].id === baseKits[k].variant_id){
				//i = product variant index, k = metafield index
				mapVariants[i] = k;
				break;
			}
		}
	}

	return mapVariants;
};

Base_Kit_Handler.prototype.getCurrentVariant = function(elements){
	for(var i = 0;i < elements.length;i++){
		var currentChild = elements[i].firstElementChild;
		if(currentChild.checked){
			//console.log('checked index: ',i);
			return i;
		}
	}
};

Base_Kit_Handler.prototype.handleSelect = function(event){
	console.log('select changed',event.currentTarget);
	var selectedVariant = this.getCurrentVariant(this.variantSelector);
	this.setBaseKit(this.productKitOptions.base_kits[this.metafieldMap[selectedVariant]]);
};

//initialze variant selector if there are varaints for the product
//use variants as base kits
Base_Kit_Handler.prototype.initVariantSelector = function(elements){
	console.log('init variant selector in new class',elements);
	//for swatch
	for(var i = 0;i < elements.length;i++){
		elements[i].addEventListener("click",function(e){
			this.handleSelect(e);
		}.bind(this),false);
	}
};
//find the select element if using dropdown
Base_Kit_Handler.prototype.findSelect = function(elements){
	console.log('find select');
};

//handle connecting a variant to a product
function ProductVariantHandler(options){
	this.selectContainers = document.getElementsByClassName(options.selectContainerClass);
	this.selects = document.getElementsByClassName(options.selectClass);
	this.singleInput = document.getElementById(options.inputId);
	this.singleQuantity = document.getElementById(options.quantityId);
	this.singlePrice = document.getElementById(options.priceId);
	//this.selectMap = options.selectMap;
	this.productVariants = options.productVariants;
	this.kitSettings = options.kitSettings;
	this.listElements = document.getElementsByClassName(options.listClass);
	this.variantMap = this.mapVariants(this.productVariants,this.kitSettings.select_map);
	
	var selectedVariant = this.findListIndex(this.listElements);
	this.selectPoductId = this.kitSettings.select_map[this.variantMap[selectedVariant]].id;
	//active select index
	this.activeSelect = this.displaySelect(this.selectContainers,this.selectPoductId);
	this.setInputFields(this.activeSelect);
	this.initListElements(this.listElements);
	console.log('variant map: ',this.variantMap,selectedVariant);
}

ProductVariantHandler.prototype.initListElements = function(listElements){
	for (var i = 0; i < listElements.length; i++) {
		listElements[i].addEventListener('click',function(e){
			this.listClicked(e);
		}.bind(this),false);
	}
};

ProductVariantHandler.prototype.listClicked = function(e){
	console.log('list clicked');
};

ProductVariantHandler.prototype.setInputFields = function(activeSelect){
	var variantId = activeSelect.options[activeSelect.selectedIndex].attributes.variant_id.value;
	var variantPrice = activeSelect.options[activeSelect.selectedIndex].attributes.variant_price.value;
	this.singleInput.attributes.variant_id.value = variantId;
	this.singleQuantity.value = 1;
	this.singlePrice.value = variantPrice;
	//will need to call funtion that updates price

};

ProductVariantHandler.prototype.findListIndex = function(listElements){
	for (var i = 0; i < listElements.length; i++) {
		var currentChild = listElements[i].firstElementChild;
		if(currentChild.checked){
			return i;
		}
	}
	return false;
};


ProductVariantHandler.prototype.mapVariants = function(variants,map){
	var mapVariants = {};
	for (var i = 0; i < variants.length; i++) {
		var variant_id = variants[i].id;
		for(var k = 0;k < map.length;k++){
			if(map[k].variant_id == variant_id){
				mapVariants[i] = k;
				break;
			}
		}
	}

	return mapVariants;
};

ProductVariantHandler.prototype.hideSelects = function(containers){
	for (var i = 0; i < containers.length; i++) {
		containers[i].classList.add('hideRope');
	}
};

ProductVariantHandler.prototype.displaySelect = function(containers,product_id){
	this.hideSelects(containers);
	var selectIndex = undefined;
	for (var i = 0; i < containers.length; i++) {
		var containerId = containers[i].attributes.product_id.value;
		console.log(containerId,product_id);
		if(containerId == product_id){
			containers[i].classList.remove('hideRope');
			selectIndex = i;
		}
	}
	if(selectIndex !== undefined){
		return this.selects[selectIndex];
	}
	else{
		return undefined;
	}
	
};

/*
initialize the kitbuilder class
takes in string arguments of ids/classes to target with this functionality
all the properties are set here and methods are defined below it
button initializers are used to add event listeners to the buttons
*/
function kitBuilder(containerID,buttonClass,bundleSelectorClass,plusClass,minusClass,quantityClass,variantClass,productInputClass,priceLabelClass,componentPriceLabelClass,quantityID,priceClass,baseKitClass,quantityLabelClass){
	
	this.kitContainer = document.getElementById(containerID);
	this.bundleButtons = document.getElementsByClassName(buttonClass);
	this.plusButtons = document.getElementsByClassName(plusClass);
	this.minusButtons = document.getElementsByClassName(minusClass);
  	this.quantities = document.getElementsByClassName(quantityClass);
  	
  	this.quantityLabels = document.getElementsByClassName(quantityLabelClass);
	this.bundleContentElements = document.getElementsByClassName(bundleSelectorClass);
  	this.variantSelects = document.getElementsByClassName(variantClass);
  	this.productInputs = document.getElementsByClassName(productInputClass);
  	this.priceLabelClass = priceLabelClass;
  	//0 is for small screen price label and 1 is for large screen price label
  	//these are the price labels on the product page
  	this.priceLabels = document.getElementsByClassName(priceLabelClass);
 	//prices are the hidden prices for calculations
  	this.prices = document.getElementsByClassName(componentPriceLabelClass);
  	//these are the price labels for each component only used for changing variant price
  	this.componentPriceLabels = document.getElementsByClassName(priceClass);
 	this.baseKitClass = baseKitClass;
	this.bundleHeights = this.getHeights();
	this.bundleSelectorClass = bundleSelectorClass;
  	this.kitQuantity = document.getElementById(quantityID).value;
    this.quantityID = quantityID;
    this.setPriceLabel(this.priceLabels,this.initPriceLabel(this.prices,this.quantities));
	this.initPlusButtons(this.plusButtons);
	this.initMinusButtons(this.minusButtons);
	this.initButtons(this.bundleButtons);
  	this.initSelects(this.variantSelects);
	this.initWindowListener();  
  	
}

//method called from base kit handler
kitBuilder.prototype.updateBaseKit = function(productData){
	console.log('updating base kit',productData);
	this.zeroInputs();
	this.zeroSelects();
	this.updateInputs(productData);
	this.updateSelects(productData);
	//reinit price
	this.setPriceLabel(this.priceLabels,this.initPriceLabel(this.prices,this.quantities));
};
//don't need to reset ids for most since most aren't variants
kitBuilder.prototype.zeroInputs = function(){
	for (var i = 0; i < this.productInputs.length; i++) {
		if(this.quantityLabels[i].textContent){
			this.quantities[i].value = 0;
			this.quantityLabels[i].textContent = 0;
		}
	}
};

kitBuilder.prototype.zeroSelects = function(){
	for (var i = 0; i < this.variantSelects.length; i++) {
		var currentSelect = this.variantSelects[i];
		var productId = currentSelect.options[0].attributes.selectid;
		var productIndex = currentSelect.dataset.selectid;
		var currentPrice = currentSelect.options[0].attributes.variant_price.value;
		//set select to first option
		currentSelect.selectedIndex = 0;
		//set input id to first option
		this.productInputs[productIndex].attributes.variant_id.value = productId;
		//set price input to first price
		this.prices[productIndex].value = currentPrice;
		//set price label to first price
		this.componentPriceLabels[productIndex].innerText = currentPrice;
	}
};

//update hidden inputs used for pushing to cart
//also updates quantity labels and price labels
kitBuilder.prototype.updateInputs = function(productData){
	//console.log('updating inputs',productData,this.priceLabels);
	for (var i = 0; i < productData.length; i++) {
		var currentData = productData[i];
		//update with the new id
		//console.dir(this.productInputs[currentData.productIndex]);
		this.productInputs[currentData.productIndex].attributes.variant_id.value = currentData.variant_id;
		//update with the new quantities
		this.quantities[currentData.productIndex].value = currentData.quantity;
		//update quantity label
		this.quantityLabels[currentData.productIndex].textContent = currentData.quantity;
		//update with the new price
		if(currentData.price){
			this.prices[currentData.productIndex].value = currentData.price;
			this.componentPriceLabels[currentData.productIndex].innerText = currentData.price;
		}
	}
};

kitBuilder.prototype.updateSelects = function(productData){
	//console.log('updating inputs',this.variantSelects);
	for (var i = 0; i < productData.length; i++) {
		var currentData = productData[i];
		for (var k = 0; k < this.variantSelects.length; k++) {
			var selectId = this.variantSelects[k].dataset.selectid;
			if(selectId == currentData.productIndex){
				for (var j = 0; j < this.variantSelects[k].options.length; j++) {
					var optionVariantId = this.variantSelects[k].options[j].attributes.variant_id.value;
					if(optionVariantId == currentData.variant_id){
						this.variantSelects[k].selectedIndex = j;
						break;
					}
				}
			}
		}
	}
};

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
          	this.bundleContentElements[i].style.visibility = "hidden";
		}			
	}
	return heights;
};

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
};
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
};

kitBuilder.prototype.initSelects = function(selects){
	for(var i = 0;i < selects.length;i++){
		selects[i].addEventListener("change",function(e){
			this.selectChanged(e);
		}.bind(this),false);
	}
};

kitBuilder.prototype.updateKitPrice = function(kitQuantity){

  var totalPrice = 0;
  for(var i = 0;i < this.quantities.length;i++){
    var componentPrice = parseFloat(this.prices[i].value.replace("$","")) * parseInt(this.quantities[i].value);
    totalPrice += componentPrice

  }

  var finalPrice = totalPrice * kitQuantity;
  finalPrice = Math.round(finalPrice * 100) / 100
  return finalPrice;

};

kitBuilder.prototype.setPriceLabel = function(priceLabels,newPrice){
  
  for(var i = 0;i < priceLabels.length;i++){
    if(newPrice % 1 === 0 ){
       priceLabels[i].innerText = "$" + (newPrice) + ".00";
       
    }
    else if((newPrice * 10) % 1 === 0){
      priceLabels[i].innerText = "$" + (newPrice) + "0";
    }
    else{
      priceLabels[i].innerText = "$" + (newPrice);
    }

    
  }

};

kitBuilder.prototype.initPriceLabel = function(prices,quantities){
  var newPrice = 0;
  for(var i =0;i < prices.length;i++){
    if(quantities[i].value !== "0"){
      var productPrice = parseFloat(prices[i].value.replace("$","")) * parseInt(quantities[i].value);
      newPrice += productPrice;
    }
  }
  
  var quantity = document.getElementById(this.quantityID).value;
  newPrice = newPrice * quantity;
  newPrice = Math.round(newPrice * 100) / 100;
  return newPrice;
  
};

//add event listeners to the dropdown buttons
kitBuilder.prototype.initButtons = function(buttons){
	for(var i = 0;i < buttons.length;i++){
		buttons[i].addEventListener("click",function(e){
			this.buttonClicked(e);
		}.bind(this),false);
	}
};
//add resize event
kitBuilder.prototype.initWindowListener = function(){
	window.addEventListener('resize',function(e){
		this.windowResized(e);
	}.bind(this),false);
};

kitBuilder.prototype.selectChanged = function(event){
	var selectID = event.currentTarget.dataset.selectid;
	this.productInputs[selectID].attributes.variant_id.value = event.currentTarget.options[event.currentTarget.selectedIndex].attributes.variant_id.value;
  	var oldPrice = this.prices[selectID].innerText;
  	var newPrice = event.currentTarget.options[event.currentTarget.selectedIndex].attributes.variant_price.value;
  	this.componentPriceLabels[selectID].innerText = event.currentTarget.options[event.currentTarget.selectedIndex].attributes.variant_price.value;
  	this.prices[selectID].value = newPrice;
    if(oldPrice !== newPrice){
      var kitQuantity = document.getElementById(this.quantityID).value;
      var finalPrice = this.updateKitPrice(kitQuantity);
      this.setPriceLabel(this.priceLabels,finalPrice); 
    }
  	
};
//use these methods to add button press effect
kitBuilder.prototype.plusDown = function(event){
	var plusButton = event.currentTarget;
	plusButton.style.position = "relative";
	plusButton.style.left = "3px";
	plusButton.style.top = "3px";
};

kitBuilder.prototype.plusUp = function(event){
	var plusButton = event.currentTarget;
	plusButton.style.position = "initial";
};

kitBuilder.prototype.plusLeave = function(event){
	var plusButton = event.currentTarget;
	plusButton.style.position = "initial";
};

kitBuilder.prototype.minusDown = function(event){
	var minusButton = event.currentTarget;
	minusButton.style.position = "relative";
	minusButton.style.left = "3px";
	minusButton.style.top = "3px";
};

kitBuilder.prototype.minusUp = function(event){
	var minusButton = event.currentTarget;
	minusButton.style.position = "initial";
};

kitBuilder.prototype.getQuantities = function(){
  	//use this to put closed bundles back to hidden
  	var closedBundles = [];
  	var currentValues = {
      quantities:[],
      prices:[]
    };
  	for(var i = 0;i < this.bundleContentElements.length;i++){
      if(this.bundleContentElements[i].style.visibility !== "visible"){
        this.bundleContentElements[i].style.visibility = "visible";
        closedBundles.push(i);
      }		
	}
    for(var i = 0;i < this.quantities.length;i++){
      //quantities.push(this.quantities[i].value);
      currentValues.quantities.push(this.quantities[i].value);
      currentValues.prices.push(this.prices[i].innerHTML);
    }
  
    for(var i = 0;i < closedBundles.length;i++){
      this.bundleContentElements[closedBundles[i]].style.visibility = "hidden";
    }
  
  return currentValues;
};

//handle plus button click events and increment counter
kitBuilder.prototype.plusClicked = function(event){
  	event.preventDefault();

	var valueLabel = parseInt(event.currentTarget.previousElementSibling.textContent);
	valueLabel++;
 	var plusID = event.currentTarget.dataset.plusid;
  	var inputQuantity = this.quantities[plusID];
  	var price = parseFloat(this.prices[plusID].innerText.replace("$",""));
  	//var labelPrice = this.getLabelPrice();	 
  	inputQuantity.value = valueLabel.toString();
	event.currentTarget.previousElementSibling.textContent = valueLabel.toString();
  	
  	//var quantityValues = this.getQuantities();
  	var kitQuantity = document.getElementById(this.quantityID).value;
 	var finalPrice = this.updateKitPrice(kitQuantity);
  	this.setPriceLabel(this.priceLabels,finalPrice);  
};

//handle minus button click events and decrement counter
kitBuilder.prototype.minusClicked = function(event){
  	event.preventDefault();
	var valueLabel = parseInt(event.currentTarget.nextElementSibling.textContent);
  	var nextSibling = event.currentTarget.nextElementSibling
    var kitMin = parseInt(nextSibling.dataset.minimum);

    if(valueLabel === kitMin && nextSibling.classList.contains(this.baseKitClass)){
      	return;
    }
	if(valueLabel === 0){
		return;
	}
	else{
		valueLabel--;
        var minusID = event.currentTarget.dataset.minusid;
      	var inputQuantity = this.quantities[minusID];
      	inputQuantity.value = valueLabel.toString();
        var price = parseFloat(this.prices[minusID].innerText.replace("$",""));
		event.currentTarget.nextElementSibling.textContent = valueLabel.toString();
      
      	var kitQuantity = document.getElementById(this.quantityID).value;
        var finalPrice = this.updateKitPrice(kitQuantity);
     	this.setPriceLabel(this.priceLabels,finalPrice); 
	}
};
//handle resize event by setting height of open dropdowns to auto so that content is not cut off,then recaclulate the heights of the dropdowns then assign 
//the auto height as the current height, need to do this to keep the closing animation effect
kitBuilder.prototype.windowResized = function(event){

	//set heights to auto that are open
	for(var i =0; i < this.bundleContentElements.length;i++){
		
		if(this.bundleContentElements[i].style.height !== "0px"){
			this.bundleContentElements[i].style.height = "auto";
		}
	}
	this.bundleHeights = this.getHeights(true);
	//then reassign these heights to keep animation effect
	for(var i =0; i < this.bundleContentElements.length;i++){
		
		if(this.bundleContentElements[i].style.height !== "0px"){
			this.bundleContentElements[i].style.height = this.bundleContentElements[i].scrollHeight + "px";
		}
	}
	
};
//this method handles when a dropdown button is clicked changes the height of the dropdown content and the rotation angle 
//of the of the arrow for the animation effects also removes the bottom border after a 450ms
kitBuilder.prototype.buttonClicked = function(event){

	event.preventDefault();
	var optionContent = event.currentTarget.nextElementSibling;
	var arrowIcon = event.currentTarget.children[1];
	if(optionContent.style.height === "0px"){
		arrowIcon.style.transform = "rotate(180deg)";
		var bundleId = event.currentTarget.dataset.bundleid;
      	optionContent.style.visibility="visible";
		event.currentTarget.attributes["aria-expanded"].value = "true";
      	setTimeout(function(){
			optionContent.style.height = this.bundleHeights[bundleId] + "px";
			optionContent.style.borderBottom = "1px solid #ddd";
		}.bind(this),8);
	}
	else{
		arrowIcon.style.transform = "rotate(0deg)";
		optionContent.style.height = "0px";
 		event.currentTarget.attributes["aria-expanded"].value = "false";
		setTimeout(function(){
			optionContent.style.borderBottom = "none";
          	//optionContent.style.display="none";
		},350);
      
		optionContent.style.visibility="hidden";

	}	
	
};
function checkLabels(labels,text){
	for (var i = 0; i < labels.length; i++) {
		if(labels[i].innerText.toUpperCase() === text.toUpperCase()){
			return true;
		}
	}
	return false;
}
//future just pass a options object with all these classes
function initKit(containerID,buttonClass,bundleSelectorClass,plusClass,minusClass,quantityClass,variantClass,productInputClass,priceLabelClass,componentPriceLabelClass,quantityID,priceClass,baseKitClass,variantSelector,productVariants,productKitOptions,quantityLabelClass){
	var kit1 = new kitBuilder(containerID,buttonClass,bundleSelectorClass,plusClass,minusClass,quantityClass,variantClass,productInputClass,priceLabelClass,componentPriceLabelClass,quantityID,priceClass,baseKitClass,quantityLabelClass);
	var variantCheck = document.getElementsByClassName(variantSelector).length === 0 ? false : true;
	var labels = document.getElementsByClassName('form__label');
	var baseKitCheck = checkLabels(labels,'base kit');
	var pouchCheck = checkLabels(labels,'pouch');
	if(variantCheck && baseKitCheck){
  		var base_kits = new Base_Kit_Handler(variantSelector,kit1,productVariants,productKitOptions,variantClass,productInputClass);
  	}
  	else if(variantCheck && pouchCheck){
  		var options = {
  			selectContainerClass:'single_product_container',
  			selectClass:'single_product_select',
  			productVariants,
  			kitSettings:productKitOptions,
  			listClass:'product__size',
  			inputId:'single_product_placeholder',
  			quantityId:'single_product_quantity',
  			priceId:'single_product_price'
  		};
  		var variantHandler = new ProductVariantHandler(options);
  	}
}
