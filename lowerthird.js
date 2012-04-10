(function(){
	/*
	 * Lower Third for Google+ Hangouts
	 * Copyright 2012 Moritz Tolxdorff
	 * Version: 0.1.0
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

		this.fileReader.onloadend = function(evt){
			callback.call(this, evt.target)
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
		header.append(this.createElement("span", {"class": "header_title"}).html("Lower Third Overlay"));
		header.append(onoffswitch);

		/*
		 * Creates the shadow Div
		*/
		var shadow = div.clone().attr({"class":"shadow"}).css({"opacity": "1"});
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
		var inputSelect 		= this.createElement("select", {"id": "Select", "class": "box"});
		var inputFile_logo 		= this.createElement("input", {"type": "file", "id": "iconfile", "class": "box", "name": "logo"});
		var optionRed 			= option.clone().attr({"value": "red"}).text("Red");
		var optionBlue 			= option.clone().attr({"value": "blue"}).text("Blue");
		var optionGreen 		= option.clone().attr({"value": "green"}).text("Green");
		var optionYellow 		= option.clone().attr({"value": "yellow"}).text("Yellow");
		var optionCustom 		= option.clone().attr({"value": "custom", "disabled": "disabled"}).text("Custom Lower Third");
		var info 				= div.clone().attr({"class": "info"}).html("Upcoming features");
		var preview				= div.clone().attr({"class": "preview"}).html("Preview: Testing Only!");

		/*
		 * Create the footer Div
		*/
		var footer = div.clone().attr({id: "footer"}).html("&copy 2012 ");
		footer.append(this.createElement("a",{"href": "https://plus.google.com/117596712775912423303", "target": "_blank"}).html("Moritz"));
		footer.append(this.createElement("span").html(" &amp; "));
		footer.append(this.createElement("a",{"href": "https://plus.google.com/u/0/110106586947414476573", "target": "_blank"}).html("Robert"));
		footer.append(this.createElement("span", {"class":"version"}).text("v 0.2.0-alpha"));

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
		body.append(preview, preview,shadow, form);

		/*
		 * Create canvas element for the lower third
		*/
		this.canvas = this.createElement("canvas", {"id":"canvas"}).height("75").width("640")[0];

		/*
		 * Append DOM structure to container
		*/
		jQuery("#container").append(header, body, shadow_bottom, footer);

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
	ApplicationController.prototype.drawImageToCanvas = function(data, x, y, w, h, callback, prepcall){
		var img = new Image();

		img.onload = function(){
			(prepcall || function(){}).call(this, img, w, h);
			this.getCanvas().getContext("2d").drawImage(img, x, y, img.width, img.height);
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
		var template_2 = "data:image/png;base64,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";
		var template_3 = "data:image/png;base64,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";
		var template_4 = "data:image/png;base64,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";

		this.log(this.getInputValue("Select option:selected"));
		switch(this.getInputValue("Select option:selected")){
			case "red":
				var logo = template_1;
				break;
			case "blue":
				var logo = template_2;
				break;
			case "green":
				var logo = template_3;
				break;
			case "yellow":
				var logo = template_4;
				break;
			default:
				var logo = template_1;
		}

		var finish = function(){
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
		}.bind(this)

		this.drawImageToCanvas(logo, 0, 0, 640, 75, function(){
			this.readImageFromInput(document.getElementById("iconfile"), function(data){
				if(data === false || data.result === false){
					gapi.hangout.layout.displayNotice("No logo selected!");
					finish();
					return;
				}

				this.drawImageToCanvas(data.result, 480, 2, 70, 70, function(){
					finish();
					
				}, function(img, w, h){
					//resizing
					var newSize = this.scaleSize(70, 70, img.width, img.height);
					img.width = newSize[0];
					img.height = newSize[1];
					this.log(img.width, img.height);
				});
				
			});
		});	
	}
	
	/**
	 * @scaleSize - Scales the size of something
	 * @public
	*/
	ApplicationController.prototype.scaleSize = function(maxWidth, maxHeight, width, height){
		var ratio = height / width;
		if(width >= maxWidth && ratio <= 1){
			width = maxWidth;
			height = width * ratio;
		}else if(height >= maxHeight){
			height = maxHeight;
			width = height / ratio
		}
		return[width, height];
	}


	/**
	 * @scale - Scales the body for different resolutions
	 * @public
	*/
	ApplicationController.prototype.scale = function(){
		/*
		 * Set the maximum height of the body minus header, input div and footer
		*/
		jQuery("#body").height(this.maxHeight-84);
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
			jQuery("#Name").attr({"disabled": "disabled"});
			jQuery("#Tag").attr({"disabled": "disabled"});
			jQuery("#Select").attr({"disabled": "disabled"});
			jQuery("#iconfile").attr({"disabled": "disabled"});
			return;
		}

		jQuery("#onoffswitch").removeClass("onoffswitch_active").addClass("onoffswitch");
		this.globalShow = false;

		for(var index in this.canvasOverlays){
			this.canvasOverlays[index].setVisible(false);
			delete this.canvasOverlays[index];
			jQuery("#Name").removeAttr("disabled");
			jQuery("#Tag").removeAttr("disabled");
			jQuery("#Select").removeAttr("disabled");
			jQuery("#iconfile").removeAttr("disabled");
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