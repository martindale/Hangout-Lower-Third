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
		 * @ApllicationController.canvas - defines the canvas container 
		 * @private
		 * @type {null | HTMLCanvasElement}
		*/
		this.canvas = null;

		/**
		 * @ApllicationController.name - defines the name variable used as an overlay on the canvas
		 * @protected
		 * @type {String}
		*/
		this.name = "";

		/**
		 * @ApllicationController.fileReader - Create  a new HTML5 file reader
		 * @protected
		 * @type {String}
		*/
		this.fileReader = new FileReader();
		
		/*
		 * Bind gapi events when API is ready
		*/
		gapi.hangout.onApiReady.add(this.onApiReady.bind(this));
		
		/*
		 * Bind window events when window size has changed
		*/
		jQuery(window).resize(this.onWindowResize.bind(this));
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
	 * @readImageFromInput - Fired when the #body is scrolled
	 * @private
	*/
	ApplicationController.prototype.readImageFromInput = function(input, callback){
		if(input.files.length == 0){
			callback.call(this, false);
			return false;
		}

		this.fileReader.onload = function(evt){
			callback.call(this, evt.target.result)
		}.bind(this);
		/*
		 * @TODO Validate file input
		*/
		return this.fileReader.readAsDataURL(input.files[0]);
	}
	
	/**
	 * @buildDOM - Building the DOM structure
	 * @private
	*/
	ApplicationController.prototype.buildDOM = function(){
		this.log("Building DOM");
		
		/*
		 * Create empty elements
		*/
		var div = this.createElement("div");
		var label = this.createElement("label");
		var span = this.createElement("span");
		var option = this.createElement("option");
		var inputText = this.createElement("input", {"class": "input", "type": "text"});
		var cleardiv = this.createElement("div", {"class": "clear"});

		/*
		 * Create pane header
		*/
		var header = this.createElement("div", {"id": "header"});

		/*
		 * Create On/Off Switch link
		*/		
		var onoffswitch = this.createElement("a",{"id": "onoffswitch", "class": "onoffswitch"});

		/*
	 	 * Append icon and title to header
		*/
		header.append(this.createElement("span", {"class": "header_icon"}));
		header.append(this.createElement("span", {"class": "header_title"}).html("Lower Third Overlay  v0.0.2-dev"));
		header.append(onoffswitch);

		/*
		 * Creates the shadow Div
		*/
		var shadow = div.clone().attr({"class":"shadow"}).css({"opacity": "1"}).hide();
		var shadow_bottom = div.clone().attr({"class":"shadow_bottom"}).css({"opacity": "1"});
		
		/*
		 * Create pane body
		*/
		var body = div.clone().attr({"id": "body"}).css({"height": (this.maxHeight-162)+"px"});

		/*
		 * Creates the form element
		*/
		var form = this.createElement("form", {"id": "form"});

		/*
		 * Creates the form element
		*/
		var fieldset 			= this.createElement("fieldset", {"id": "fieldset"});
		var fieldrow_name 		= div.clone().attr({"class": "fieldrow"});
		var fieldrow_tagline 	= div.clone().attr({"class": "fieldrow"});
		var fieldrow_select 	= div.clone().attr({"class": "fieldrow"});
		var fieldrow_logo 		= div.clone().attr({"class": "fieldrow"});
		var label_name 			= label.clone().attr({"for": "name"}).text("Enter name");
		var label_tageline 		= label.clone().attr({"for": "name"}).text("Enter tagline");
		var label_select 		= label.clone().attr({"for": "name"}).text("Select Lower Third");
		var label_logo 			= label.clone().attr({"for": "name"}).text("Select logo");
		var span_required 		= span.clone().attr({"class": "required"}).text("*");
		var inputText_name 		= inputText.clone().attr({"id": "Name", "class": "box", "name": "name"});
		var inputText_tagline 	= inputText.clone().attr({"id": "Tag", "class": "box", "name": "tagline"});
		var inputSelect 		= this.createElement("select", {"class": "box"});
		var inputFile_logo 		= this.createElement("input", {"type": "file", "id": "iconfile", "class": "box", "name": "logo"});
		var optionRed 			= option.clone().attr({"value": "red"}).text("Red");
		var optionBlue 			= option.clone().attr({"value": "blue"}).text("Blue");
		var optionGreen 		= option.clone().attr({"value": "green"}).text("Green");
		var optionYellow 		= option.clone().attr({"value": "yellow"}).text("Yellow");
		var optionCustom 		= option.clone().attr({"value": "custom"}).text("Custom Lower Third");

		/*
		 * Create the footer Div
		*/
		var footer = div.clone().attr({id: "footer"}).html("&copy 2012 ");
		footer.append(this.createElement("a",{"href": "https://plus.google.com/117596712775912423303", "target": "_blank"}).html("Moritz"));

		/*
		 * Append inner HTML elements to parrent DOM
		*/
		label_name.append(span_required.clone());
		label_tageline.append(span_required.clone());
		label_select.append(span_required.clone());
		label_logo.append(span_required.clone());

		inputSelect.append(optionRed, optionBlue, optionGreen, optionYellow, optionCustom);

		fieldrow_name.append(label_name, inputText_name);
		fieldrow_tagline.append(label_tageline, inputText_tagline);
		fieldrow_select.append(label_select, inputSelect);
		fieldrow_logo.append(label_logo, inputFile_logo);

		fieldset.append(fieldrow_name,fieldrow_tagline,fieldrow_select,fieldrow_logo);

		form.append(fieldset);
		body.append(shadow, form);

		/*
		 * Create canvas element for the lower third
		*/
		this.canvas = this.createElement("canvas", {"id":"canvas"}).height("75").width("640")[0];

		/*
		 * Append DOM structure to container
		*/
		jQuery("#container").append(header, body, footer);

		/*
		 * Bind click event to the On/Off switch
		*/	
		onoffswitch.click(this.toggleShow.bind(this));

		/*
		 * Bind scroll event to toggle shadow
		*/
		body.on("scroll", this.bodyOnScroll.bind(this));
	}

	/**
	 * @getCanvas - Get canvas from DOM
	 * @private
	 * @returns {HTMLCanvasElement}
	*/
	ApplicationController.prototype.getCanvas = function(){
		return this.canvas;
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
		canvas.canvas.width = 640;
		canvas.canvas.height = 75;
		canvas.clearRect(0, 0, canvas.canvas.width, canvas.canvas.height);
		canvas.textAlign = "left";
		canvas.textBaseline = "top";
	}

	/**
	 * @drawImageToCanvas - Draws an image to a canvas
	 * @private
	 * @param data {string}, x {int}, y {int}, w {int}, h {int}, 
	*/
	ApplicationController.prototype.drawImageToCanvas = function(data, x, y, w, h, callback){
		var img = new Image(w, h);

		img.onload = function(){
			this.getCanvas().getContext("2d").drawImage(img, x, y, w, h);
			callback.call(this);
		}.bind(this)
		img.src = data;
	}

	/**
	 * @drawTextToCanvas - Draws text to a canvas
	 * @private
	 * @param data {string}, x {int}, y {int}, w {int}, h {int}, 
	*/
	ApplicationController.prototype.drawTextToCanvas = function(text, x, y, size, color, font){
		var canvasContext = this.getCanvas().getContext("2d");
		canvasContext.font = size + "px " + (font ? font : "Arial");
		canvasContext.fillStyle = color || "black";
		canvasContext.fillText(text, x, y);
	}

	/**
	 * @createCanvas - Creates the canvas
	 * @private
	*/
	ApplicationController.prototype.createCanvas = function(){
		/*
		 * Get 2d context for canvas elements
		*/	
		var canvasContext = this.getCanvas().getContext("2d");

		/*
		 * Prepare canvas elements for manipulation
		*/
		this.prepareCanvasContext(canvasContext);
		var template_1 = "data:image/png;base64,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";
		var template_2 = "";
		var template_3 = "";
		var template_4 = "";

		this.drawImageToCanvas(template_1, 0, 0, 640, 75, function(){
			this.readImageFromInput(document.getElementById("iconfile"), function(data){
				if(data === false){
					return;
				}
				this.drawImageToCanvas(data, 480, 2, 70, 70, function(){

					this.drawTextToCanvas(this.getInputValue("Name"), 60, 10, 28);
					this.drawTextToCanvas(this.getInputValue("Tag"), 60, 47, 15, "white");

					/*
					 * Convert canvas elements to image resources
					*/
					var canvasImage = this.createImageResourceFromCanvas(canvasContext.canvas);
					
					/*
					 * Create face tracking overlay from image resource
					*/
					this.canvasOverlays['canvasOverlay'] = canvasImage.createFaceTrackingOverlay({
						'trackingFeature': gapi.hangout.av.effects.FaceTrackingFeature.NOSE_ROOT,
						'scale': 1.0
					});

					/*
					 * Set face tracking overlay parameters and toggle between Show/Hide
					*/
					this.canvasOverlays['canvasOverlay'].setOffset(0, 0.5);
					if(this.globalShow === true){
						this.canvasOverlays['canvasOverlay'].setVisible(true);
					}else{
						this.canvasOverlays['canvasOverlay'].setVisible(false);
						delete this.canvasOverlays['canvasOverlay'];
					}
				});
				
			});
		});	
	}
	
	/**
	 * @scale - Scales the body for different resolutions
	 * @public
	*/
	ApplicationController.prototype.scale = function(){
		/*
		 * Set the maximum height of the body minus header, input div and footer
		*/
		jQuery("#body").height(this.maxHeight-75);
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
		/*
		 * validate input data
		*/
		if(this.globalShow === false){
			jQuery("#onoffswitch").removeClass("onoffswitch").addClass("onoffswitch_active");
			this.globalShow = true;
			this.createCanvas();
			return;
		}

		jQuery("#onoffswitch").removeClass("onoffswitch_active").addClass("onoffswitch");
		this.globalShow = false;

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