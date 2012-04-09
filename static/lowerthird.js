(function(){
	/*
	 * Lower Third for Google+ Hangouts
	 * Copyright 2012 Moritz Tolxdorff
	 * Version: 1.0.0
	 * Release date: 20.04.2012
	 * Developers:
	 ** Moritz Tolxdorff
	 *
	 * Thanks:
	 ** Robert Pitt
	*/	
	

	/**
	 * @ApplicationController
	 * @constructor
	*/
	function ApplicationController(){
		if(!gapi){
			throw "gapi not loaded!";
		}	
		
		/**
		 * @ApplicationController.DEBUGGING - defines if debugging is enabled
		 * @private
		 * @type {boolean}
		*/
		this.DEBUGGING = true;

		/**
		 * @ApllicationController.maxHeight - defines the maximum window height
		 * @public
		 * @const 
		 * @type {Number}
		*/
		this.maxHeight = $(window).height();

		/**
		 * @ApllicationController.globalShow - defines the initial state of globalShow 
		 * @private
		 * @type {boolean}
		*/
		this.globalShow = false;

		/**
		 * @ApllicationController.canvasOverlays - defines the canvasOverlay container 
		 * @private
		 * @type {Array}
		*/
		this.canvasOverlays = [];

		/**
		 * @ApllicationController.backgroundOverlay - defines the overlay container 
		 * @private
		 * @type {Array}
		*/
		this.backgroundOverlay = [];

		/**
		 * @ApllicationController.logoOverlay - defines the overlay container 
		 * @private
		 * @type {Array}
		*/
		this.logoOverlay = [];

		/**
		 * @ApllicationController.name - defines the name variable used as an overlay on the canvas
		 * @protected
		 * @type {String}
		*/
		this.name = "";
		
		/*
		 * Bind gapi events when API is ready
		*/
		gapi.hangout.onApiReady.add(this.onApiReady.bind(this));
		
		/*
		 * Bind window events when window size has changed
		*/
		$(window).resize(this.onWindowResize.bind(this));
	}
	
	/**
	 * @onWindowResize - Fired when window resizes
	 * @private
	 * @param evt {jQueryEventObject}
	*/
	ApplicationController.prototype.onWindowResize = function(evt){
		this.log("Window resized");
		this.maxHeight = $(window).height();
		this.scale();
	}
	
	/**
	 * @buildDOM - Building the DOM structure
	 * @private
	*/
	ApplicationController.prototype.buildDOM = function(){
		this.log("Building DOM");
		
		/*
		 *Create pane header
		*/
		var header = this.createElement("div", {"id": "header"});

		/*
	 	 * Append icon and title to header
		*/
		header.append(this.createElement("span", {"class": "icon_header"}));
		header.append(this.createElement("span", {"class": "header_title"}).html("Lower Third Overlay  v1.0.0-beta"));
		
		/*
		 * Creates an empty input element
		*/
		var inputdiv = $("<div>").attr({"class":"inputdiv", "id":"input"});
		
		/*
		 * Creates an empty input element
		*/
		var input = this.createElement("input", {"class": "input", "type": "text"});

		/*
		 * Creates an empty div element
		*/
		var div = this.createElement("div");

		/*
		 * Creates an empty label element
		*/
		var label = this.createElement("label");

		/*
		 * Creates input areas for the form
		*/
		var inputURL = input.clone().attr({"id":"URL"});
		var inputName = input.clone().attr({"id":"Name"});
		var inputTag = input.clone().attr({"id":"Tag"});

		/*
		 * Creates the form element
		*/
		var form = this.createElement("form", {"id": "inputForm", "class": "form"});
	
		/*
		 * Creates the shadow Div
		*/
		var shadow = div.clone().attr({"class":"shadow"}).css({"opacity": "1"}).hide();

		/*
		 * Append the form elements to the form
		*/
		form.append(div.clone().append(label.clone().text("Icon URL"))).append(inputURL);
		form.append(div.clone().append(label.clone().text("Name"))).append(inputName);
		form.append(div.clone().append(label.clone().text("Tagline"))).append(inputTag);

		/*
		 * Append the form to the input Div
		*/
		inputdiv.append(form);

		/*
		 * Create the body Div
		*/
		var body = div.clone().attr({"id": "body"}).css({"height": (this.maxHeight-162)+"px"});
		
		/*
		 * Create the template Div
		*/
		var templatediv = div.clone().attr({"id": "templatediv"}).css({"height": (this.maxHeight-163)+"px"});


		/*
		 * Create the ul element for the template list
		*/
		var ul = this.createElement("ul").attr({"id": "templates"});
		

		/*
		 * Create empty elements for the template list
		*/
		var li = this.createElement("li", {"class":"listitem"});
		var img = this.createElement("img", {"width": "275"}).css({"margin-top":"6px"});
		var url = "//hangoutlowerthird.appspot.com/static/templates/template_#.png";

		/*
		 * Fill the ul with compiled templates
		*/
		for(var i = 1; i <= 4; i++){
			ul.append(li.clone().attr({"id":"template_" + i}).append(img.clone().attr({"src":url.replace("#", i)})));
		}

		/*
		 * Fill the ul with compiled templates
		*/
		ul.append(li.clone().attr({"id":"custom"}).append(label.clone().text("Custom URL")).append(input.clone().attr({"id": "customURL"})));

		/*
		 * Bind click event to all li element
		*/
		jQuery("li", ul).on("click", this.onSelectItem.bind(this));
		
		/*
		 * Append the ul to the templateDiv and the templateDiv to the body
		*/
		templatediv.append(ul).appendTo(body);

		/*
		 * Create the footer Div
		*/
		var footer = div.clone().attr({id: "footer"});

		/*
		 * Create On/Off Switch link
		*/		
		var button = this.createElement("a",{"id": "button", "class": "button"});

		/*
		 * Append button to footer
		*/	
		footer.append(button);

		/*
		 * Append footer note to footer
		*/	
		footer.append(this.createElement("span",{"class":"footer_note"}).html("&copy 2012").append(this.createElement("a",{"href": "https://plus.google.com/117596712775912423303", "target": "_blank"}).html("Moritz")));
		
		/*
		 * Bind click event to the On/Off switch
		*/	
		button.click(this.toggleShow.bind(this));
		button.click(this.createOverlay.bind(this));
		button.click(this.createCanvas.bind(this));
		
		/*
		 * Create canvas elements for the name and tagline
		*/
		this.createElement("canvas", {"id":"canvasName"}).appendTo("body").height("50").width("640").hide();
		this.createElement("canvas", {"id":"canvasTag"}).appendTo("body").height("30").width("640").hide();

		/*
		 * Append DOM structure to container
		*/
		jQuery("#container").append(header, inputdiv, shadow, body, footer);
		
		/*
		 * Bind scroll event to toggle shadow
		*/
		body.on("scroll", this.bodyOnScroll.bind(this));
	}
	
	/**
	 * @scale - Scales the body for different resolutions
	 * @public
	*/
	ApplicationController.prototype.scale = function(){
		/*
		 * Set the maximum height of the body minus header, input div and footer
		*/
		jQuery("#body").height(this.maxHeight-162);
	}
	
	/**
	 * @onSelectItem - Fired when a lower third is selected
	 * @private
	 * @param evt {jQueryEventObject}
	*/
	ApplicationController.prototype.onSelectItem = function(evt){
		jQuery("li.selected", evt.currentTarget.parentNode).removeClass("selected");
		jQuery(evt.currentTarget).addClass("selected");
	}
	
	/**
	 * @bodyOnScroll - Fired when the #body is scrolled
	 * @private
	 * @param evt {jQueryEventObject}
	*/
	ApplicationController.prototype.bodyOnScroll = function(evt){
		/*
		 * Hide/Show shadow depending on scroll position
		*/
		jQuery("#body").scrollTop() > 0 ? jQuery(".shadow", "#container").show() : jQuery(".shadow", "#container").hide(); 
	}
	
	/**
	 * @toggleShow - Fired when #button is clicked
	 * @public
	 * @see ApplicationController.buildDOM
	*/
	ApplicationController.prototype.toggleShow = function(){
		if(this.globalShow === false){
			jQuery("#button").removeClass("button").addClass("button_active");
			this.globalShow = true;
			return;
		}

		jQuery("#button").removeClass("button_active").addClass("button");
		this.globalShow = false;

		for(var index in this.backgroundOverlay){
			this.backgroundOverlay[index].setVisible(false);
			delete this.backgroundOverlay[index];
		}
		this.log(this.backgroundOverlay);

		for(var index in this.canvasOverlays){
			this.canvasOverlays[index].setVisible(false);
			delete this.canvasOverlays[index];
		}
	}

	/**
	 * @getInputValue - Get Input values from form
	 * @public
	 * @param id {string}
	 * @returns {String}
	*/
	ApplicationController.prototype.getInputValue = function(id){
		return jQuery("#" + id).val();
	}

	/**
	 * @getCanvasName - Get canvasName from DOM
	 * @private
	 * @returns {HTMLCanvasElement}
	*/
	ApplicationController.prototype.getCanvasName = function(){
		return jQuery("#canvasName")[0];
	}

	/**
	 * @getCanvasTag - Get canvasTag from DOM
	 * @private
	 * @returns {HTMLCanvasElement}
	*/
	ApplicationController.prototype.getCanvasTag = function(){
		return jQuery("#canvasTag")[0];
	}
	
	/**
	 * @createImageResourceFromCanvas - Creates a image resource from a canvas element
	 * @private
	 * @param canvas {HTMLCanvasElement}
	*/
	ApplicationController.prototype.createImageResourceFromCanvas = function(canvas){
		return gapi.hangout.av.effects.createImageResource(canvas.toDataURL());
	}

	/**
	 * @prepareCanvasContext - Prepares a canvas for manipulation
	 * @private
	 * @param canvas {HTMLCanvasElement}
	*/
	ApplicationController.prototype.prepareCanvasContext = function(canvas){
		canvas.clearRect(0, 0, canvas.canvas.width, canvas.canvas.height);
		canvas.textAlign = "left";
	}

	/**
	 * @createCanvas - Creates the canvas
	 * @private
	*/
	ApplicationController.prototype.createCanvas = function(){
		/*
		 * Get 2d context for canvas elements
		*/	
		var canvasNameContext = this.getCanvasName().getContext("2d");
		var canvasTagContext = this.getCanvasTag().getContext("2d");

		/*
		 * Prepare canvas elements for manipulation
		*/
		this.prepareCanvasContext(canvasNameContext);
		this.prepareCanvasContext(canvasTagContext);

		/*
		 * Set font, sizes, and type for canvases 
		*/
		canvasNameContext.font = "38px Arial";
		canvasTagContext.font = "16px Arial";

		/*
		 * Set Text values and positions for canvas elements
		*/
		canvasNameContext.fillText(this.getInputValue("Name"), 50, 28);
		canvasTagContext.fillText(this.getInputValue("Tag"), 50, 28);

		/*
		 * Convert canvas elements to image resources
		*/
		var canvasNameImage = this.createImageResourceFromCanvas(canvasNameContext.canvas);
		var canvasTagImage = this.createImageResourceFromCanvas(canvasTagContext.canvas);
		
		/*
		 * Create face tracking overlay from image resource
		*/
		this.canvasOverlays['canvasNameOverlay'] = canvasNameImage.createFaceTrackingOverlay({
			'trackingFeature': gapi.hangout.av.effects.FaceTrackingFeature.NOSE_ROOT,
			'scale': 1.0
		});
		this.canvasOverlays['canvasTagOverlay'] = canvasTagImage.createFaceTrackingOverlay({
			'trackingFeature': gapi.hangout.av.effects.FaceTrackingFeature.NOSE_ROOT,
			'scale': 1.0
		});

		/*
		 * Set face tracking overlay parameters and toggle between Show/Hide
		*/
		this.canvasOverlays['canvasNameOverlay'].setOffset(0, 0.5);
		if(this.globalShow === true){
			this.canvasOverlays['canvasNameOverlay'].setVisible(true);
		}else{
			this.canvasOverlays['canvasNameOverlay'].setVisible(false);
			delete this.canvasOverlays['canvasNameOverlay'];
		}

		this.canvasOverlays['canvasTagOverlay'].setOffset(0, 0.5);
		if(this.globalShow === true){
			this.canvasOverlays['canvasTagOverlay'].setVisible(true);
		}else{
			this.canvasOverlays['canvasTagOverlay'].setVisible(false);
			delete this.canvasOverlays['canvasTagOverlay'];
		}	
	}
	
	/**
	 * @createOverlay - Creates the Overlays
	 * @private
	 * @param evt {jQueryEventObject}
	*/
	ApplicationController.prototype.createOverlay = function(evt){
		var id = $("#templates li.selected").eq(0).attr("id");
		var image = gapi.hangout.av.effects.createImageResource("//hangoutlowerthird.appspot.com/static/templates/" + id + ".png");
		
		this.backgroundOverlay['background'] = image.createFaceTrackingOverlay({
			'trackingFeature': gapi.hangout.av.effects.FaceTrackingFeature.NOSE_ROOT,
			'scale': 1.0
		});
		this.backgroundOverlay['background'].setOffset(0, 0.5);
		if(this.globalShow === true){
			this.backgroundOverlay['background'].setVisible(true);
		}else{
			this.backgroundOverlay['background'].setVisible(false);
			delete this.backgroundOverlay['background'];
		}	
	}
	
	/**
	 * @createElement - Creates a new element
	 * @public
	 * @param type {String} 
	 * @param attr {Object} 
	*/
	ApplicationController.prototype.createElement = function(type, attr){
		return jQuery("<" + type + ">").attr(attr || {});
	}

	/**
	 * @log - Writes to console.log if DEBUGGING is enabled
	 * this.log(...)
	 * @private
	 * @param {Mixed}
	*/
	ApplicationController.prototype.log = function(){
		if(this.DEBUGGING === true){
			console.log(Array.prototype.slice.call(arguments))
		}
	}

	/**
	 * @onApiReady - Fired by gapi when it's ready
	 * @private
	 * @param event {gapi.hangout.apiReadyEvent}
	*/
	ApplicationController.prototype.onApiReady = function(event){
		if(event.isApiReady){
			try {
				this.buildDOM();
				this.scale();
				console.log("Lower Third App loaded!");
			}
			catch(err) {
				console.log(err);
			}
		}
	}

	// Export instantiated ApplicationController to main window
	window["appController"] = new ApplicationController();
})()