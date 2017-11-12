	
	
	
	var myWindow = new Window("dialog");
		var myInputGroup = myWindow.add("group");
		
			var ScaleCheck = myWindow.add ("checkbox", undefined, "Use Scale");
			ScaleCheck.value = true;
			myInputGroup.add("statictext",[5,5,60,25],"Start scale");
			var StartScale = myInputGroup.add("edittext",[60,5,110,25],"100");
			//myInputGroup.add("statictext", undefined,"Start scale")
			//var StartScale = myInputGroup.add("edittext", undefined,"100");
			StartScale.Characters = 5;
			StartScale.active = true;	
			//
			myInputGroup.add("statictext",[5,30,60,50],"End scale");
			var EndScale = myInputGroup.add("edittext",[60,30,110,50],"115");
			//myInputGroup.add("statictext", undefined,"End scale")
			//var EndScale = myInputGroup.add("edittext", undefined,"115");
			EndScale.Characters = 5;
			EndScale.active = true;
			//
			myInputGroup.add("statictext",[5,55,60,75],"Speed divisor");
			var Div = myInputGroup.add("edittext",[60,55,90,75],"3");
			//myInputGroup.add("statictext", undefined,"Duration")
			//var EndScale = myInputGroup.add("edittext", undefined,"5");
			EndScale.Characters = 3;
			EndScale.active = true;
			//
			
			var okButton = myWindow.add("button",undefined,"OK"); 
//okButton.chortcutKey = "enter";
			okButton.onClick = function(){
kek();
myWindow.close();
}				
		myWindow.show();
		
		
function on_textInput_changed() {
	// Set the duplicate number based on the text.
	//alert("In text change");// debug
	var _scCheck = ScaleCheck.value;
	var _stScale = StartScale.text;
	var _endScale = EndScale.text;
	var _div = parseFloat(Div.text);
	if (isNaN(_stScale)) {
	alert(_stScalee + " is not a number. Please enter a number.", scriptName);
	} else {
	//alert("Value is "+value);//debugging
		ScaleCheckbox = _scCheck;
		StScale = _stScale;
		EndScale = _endScale;
		Divisor = _div;
		
	}
}


function kek(){
	var undoStr = "Duplicate Layers";
	app.beginUndoGroup(undoStr);// begin UNDO group
	// do some checking if we have a comp and a layer selected
	var curComp = app.project.activeItem;
	  if (!curComp || !(curComp instanceof CompItem)) {
		// alert and end the script
		alert("please select a composition and at least a layer");
		return;
	  }
	//  
	on_textInput_changed();
	//
	var selectedLayer = curComp.selectedLayers[0]; 
	var Duration = (curComp.duration / Divisor)/curComp.numLayers;
	var rep = curComp.duration / (curComp.numLayers * Duration);
	
	for (var i = 0; i < curComp.numLayers; i++){
		//var index = i+1;
		//curComp.layer(index).inPoint = Duration * i ;
		//curComp.layer(index).outPoint =  curComp.layer(index).inPoint + Duration + 1;
		
		curComp.selectedLayers[i].inPoint = Duration * i ;
		curComp.selectedLayers[i].outPoint =  curComp.selectedLayers[i].inPoint + Duration + 1;
		//opacity
			//fadein
		curComp.selectedLayers[i].property("opacity").setValueAtTime(curComp.selectedLayers[i].inPoint, 0.0);
		curComp.selectedLayers[i].property("opacity").setValueAtTime(curComp.selectedLayers[i].inPoint+1, 100.0);
		
			//fadeout
		curComp.selectedLayers[i].property("opacity").setValueAtTime(curComp.selectedLayers[i].outPoint-1, 100.0);
		curComp.selectedLayers[i].property("opacity").setValueAtTime(curComp.selectedLayers[i].outPoint, 0.0);
		if (ScaleCheckbox == true) {
			//scale
				//start
			curComp.selectedLayers[i].property("scale").setValueAtTime(curComp.selectedLayers[i].inPoint, [StScale,StScale]);
				//end
			curComp.selectedLayers[i].property("scale").setValueAtTime(curComp.selectedLayers[i].outPoint, [EndScale,EndScale]);
		}	
	}
	
	var newInPoint = curComp.selectedLayers[0].inPoint;
    var newOutPoint = curComp.selectedLayers[curComp.numLayers-1].outPoint; 
	
	var newCompName = "comp ";
      var layerName = curComp.selectedLayers[0].name;
      if(layerName.length > 26) {
        layerName = layerName.substring(0, 26);
      }
      newCompName += layerName;
	
	var layerIndices = new Array();
    for (var i = 0; i < curComp.selectedLayers.length; i++) {
      layerIndices[layerIndices.length] = curComp.selectedLayers[i].index;

      // make sure new comp in point is in point of earliest layer
      // and new comp out point is out point of latest layer

      if (curComp.selectedLayers[i].inPoint < newInPoint) newInPoint = curComp.selectedLayers[i].inPoint;
      if (curComp.selectedLayers[i].outPoint > newOutPoint) newOutPoint = curComp.selectedLayers[i].outPoint;
    }
	
	// create the new comp
	var newComp = curComp.layers.precompose(layerIndices, newCompName, true );
	
	// set in and out points of new comp
	var preCompLayer = curComp.selectedLayers[0];
	
    preCompLayer.inPoint = newInPoint;
    preCompLayer.outPoint = newOutPoint;
	var PrecompDur = newOutPoint - newInPoint;
	//alert(rep);
	for (var i = 0; i < rep; i++){
		preCompLayer.duplicate();	
	}	
	
	for (var i = 1; i <= curComp.numLayers; i++){
		//var index = i+1;
		//curComp.layer(index).inPoint = Duration * i ;
		//curComp.layer(index).outPoint =  curComp.layer(index).inPoint + Duration + 1;
		
		curComp.layer(i).startTime = (PrecompDur-1) * (i-1) - 1;

	}
	
	
	
	app.endUndoGroup();			
}