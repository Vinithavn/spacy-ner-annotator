var full_text_array = []
var full_text = "";
var text_file_all_text = [];
var page_num = 0;
var selected_text = "";
var training_datas = [];
var training_data = {};
var entities = [];
var entities_values = [];
var entity_count = 0;
var class_names = []
function l(message){
	console.log(message);
}
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
function myFunction(){
	setTimeout(function() {
		$("#editor").html($("#editor").text());
	}, 0);
	// alert();
}
function getCorrectedText(){
	if($(".gsc-results.gsc-webResult").children().length > 3){
		corrected_text = $(".gs-spelling a").first().text();
		l(corrected_text)
	}
}
function getFilename(myFile){
	if(myFile.files.length > 0){
		var file = myFile.files[0];  
	   	var filename = file.name;
	   	$(".custom-file-label").text(filename);
	   	l(filename);
   }
   else{
   		$(".custom-file-label").text('Choose file...');
   }
}
function onPaste(e){
  e.preventDefault();

  if( e.clipboardData ){
    full_text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, full_text);
    l(full_text);
    return false;
  }
  else if( window.clipboardData ){
    full_text = window.clipboardData.getData('Text');
    l(full_text);
    if (window.getSelection)
      window.getSelection().getRangeAt(0).insertNode( document.createTextNode(full_text) );
  }
}
// document.querySelector('[contenteditable]').addEventListener('paste', onPaste);
function setEntityOutput(value,color, count){
	console.log(value,color,'setEntityOutput');
	$("#entity").append('<div class="entityval" data-id="'+count+'"><div style="background-color:'+color+'">'+value+'</div></div>');
}
function clearSelection()
{
 if (window.getSelection) {window.getSelection().removeAllRanges();}
 else if (document.selection) {document.selection.empty();}
}
function prepareAnnotations(entities){
	prepare_html = $("#editor").text()
	entities = entities.sort((a, b) => (a[0] > b[0] ? -1 : 1))
	entities.forEach(function(data, val){
	    // console.log(data, val)
	    [str_idx, end_idx, cls_name, count, color_rgb] = data
	    span_html = '<span id="'+count+'" style="background-color:'+color_rgb+';">'+prepare_html.slice(str_idx, end_idx)+'<i class="fa fa-close ent-close"></i></span>';
	    prepare_html = prepare_html.slice(0, str_idx)+span_html+prepare_html.slice(end_idx, )
	})
	// console.log(prepare_html)
	$("#bk-editor").html(prepare_html)
	$("#editor").attr('contenteditable',false);
	$("#bk-editor").attr('contenteditable',false);
}
$(document).ready(function(){
	l('ok');
	$("#edit").hide();
	$('textarea').attr('readonly',false);
	$("#fileUpload").click()


    $("#editor").scroll(function() {
        $("#bk-editor").prop("scrollTop", this.scrollTop).prop("scrollLeft", this.scrollLeft);
    });

	// var cx = '011558942542564350974:nldba-ydc7g'; // Insert your own Custom Search engine ID here
	// var gcse = document.createElement('script');
	// gcse.type = 'text/javascript';
	// gcse.async = true;
	// gcse.src = 'https://cse.google.com/cse.js?cx=' + cx;
	// var s = document.getElementsByTagName('script')[0];
	// s.parentNode.insertBefore(gcse, s);


	// var inputText = prompt('Please enter the training dataset(filename.txt)');
	// l("MANI"+inputText+"vannan");
	// if((inputText != null) && (inputText.length > 0)){
	// 	l(inputText);
	// 	var rawFile = new XMLHttpRequest();
	//     rawFile.open("GET", inputText, false);
	//     rawFile.onreadystatechange = function ()
	//     {
	//         if(rawFile.readyState === 4)
	//         {
	//             if(rawFile.status === 200 || rawFile.status == 0)
	//             {
	//                 text_file_all_text = rawFile.responseText.split('\n');
	//                 l('success');
	//     			l(text_file_all_text);
	//     			$('#editor').text(text_file_all_text[page_num]);
	//     			setTimeout(function(){ 
	//     				$("#gsc-i-id1.gsc-input").val(text_file_all_text[page_num]);
	//     				$(".gsc-search-button").click();
	//     			}, 500);
	//     			// $("#gsc-i-id1.gsc-input").val(text_file_all_text[page_num]);
	//             }
	//             else{
	//             	alert(inputText+" doest not exist");
	//             }
	//         }
	//     }
	//     rawFile.send(null);
	// }
});


$("#edit").click(function(){
	$("#editor").attr('contenteditable',true);
	$("#edit").hide();
	$("#save").show();
});
$("#addclass").click(function(){
	classname = $('input').val();
	if(class_names.indexOf(classname) != -1){
		alert("Class names is already saved");
		$('input').val("");
		return;
	}
	class_names.push(classname);
	$(".classes").append('<div class="row pdn"><div class="col-9"><button class="class" style="background-color:'+getRandomColor()+'"><span>'+classname+'</span></button></div><div class="col-3"><button class="btn pull-right delete_btn"><i class="fa fa-trash"></i></button></div></div>')
	$('input').val("");
});
$("input").keypress(function(e){
	var key = e.which;
	if(key == 13){
		$("#addclass").click();
		return false;  
	}
});
$( ".classes" ).on("click",".class",function addEntity(){
	entity = [];
	var startdict=[];
	var enddict = [];
	var text1 =[];
	var labels =[];
	if($("#editor").attr('contenteditable') == 'true'){
		alert("Please save the content");
		return;
	}
	selection = window.getSelection();
	selected_text = selection.toString();
	if(selected_text == ""){
		alert("Please select atleast one entity");
		return;
	}
	iniidx = full_text.indexOf(selected_text);
	lgth = selected_text.length;
	if(iniidx == -1){
		alert("Please select entity inside the content");
		return;
	}
	color_rgb = $(this).css('background-color');
	var start = selection.anchorOffset;
	var end = selection.focusOffset;
	console.log(start, end)
	setEntityOutput(selected_text,color_rgb, entity_count);
	startdict.push ({start:start})
	enddict.push ({end:end})
	text1.push ({word:selected_text})
	labels.push ({label:$(this).text()})
	entities.push([startdict,enddict,labels, text1]);

	// alert(window.getSelection().toString());
	prepareAnnotations(entities)
	l(selected_text)
	l($(this).text());
	$("#editor").attr('contenteditable',true);
	if (selection.rangeCount && selection.getRangeAt) {
	    range = selection.getRangeAt(0);
	}
	// Set design mode to on
	document.designMode = "on";
	if (range) {
	  selection.removeAllRanges();
	  selection.addRange(range);
	}
	// Colorize text
	// document.execCommand("BackColor", false, color_rgb);
	// Set design mode to off
	document.designMode = "off";
	entities_values.push(selected_text);
	entities_values.push(color_rgb);
	selected_text = "";
	$("#editor").attr('contenteditable',false);
	clearSelection();
	entity_count++;
});
$( "#entity" ).on("dblclick",".entityval",function(){
	var data_id = $(this).attr('data-id')
	var delete_text = $(this).text();
	var e_v_idx = entities_values.indexOf(delete_text);
	var color_txt = entities_values[e_v_idx+1];
	var tag_string = '<span style="background-color: '+color_txt+';">'+delete_text+'</span>';
	$("#editor").html($("#editor").html().replace(tag_string,delete_text));
	entities_values.splice(e_v_idx,1);
	entities_values.splice(e_v_idx,1);
	en_del_idx = full_text.indexOf(delete_text);
	en_len_cnt = en_del_idx+delete_text.length;
	del_idx = -1;
	console.log(entities)
	$.each(entities,function(idx,val){
		[str_idx, end_idx, cls_name, count, color_rgb] = val
		if(count == parseInt(data_id)){
			console.log(idx, count, data_id)
			del_idx = idx;
		}
		// if((en_del_idx == val[0]) && (en_len_cnt == val[1])){
		// 	del_idx = idx;
		// }
	});
	if(del_idx != -1){
		entities.splice(del_idx,1);
	}
	prepareAnnotations(entities)
	l(en_del_idx,en_len_cnt,delete_text,color_txt,tag_string); 
	$(this).remove();
});

$("#bk-editor").on("click",".ent-close",function(){
	console.log($(this).parent().attr('id'))
	var data_id = $(this).parent().attr('id');
	del_idx = -1;
	console.log(entities)
	$.each(entities,function(idx,val){
		[str_idx, end_idx, cls_name, count, color_rgb] = val
		if(count == parseInt(data_id)){
			console.log(idx, count, data_id)
			del_idx = idx;
		}
		// if((en_del_idx == val[0]) && (en_len_cnt == val[1])){
		// 	del_idx = idx;
		// }
	});
	if(del_idx != -1){
		entities.splice(del_idx,1);
	}
	prepareAnnotations(entities)
	$("#editor").attr('contenteditable',false);
	// $(this).remove();
})


$( ".classes" ).on("click",".delete_btn",function(){
	if(confirm("Are you sure want to delete entity name?")){
		l('deleted');
		tt = $('.delete_btn').parent().parent().text();
		class_names.splice(class_names.indexOf(tt),1);
		$(this).parent().parent().remove();
	}
});
$("#upload").click(function(){
	l('upload clicked');
	var fileInput = $('#validatedCustomFile');
	var input = fileInput.get(0);
	if(input.files.length > 0){
		var textFile = input.files[0];
		var reader = new FileReader();
		reader.onload = function(e) {
		   // The file's text will be printed here
		    text_file_all_text = e.target.result.split('\n');
		    $("#total_page_num").text(text_file_all_text.length);
		    $("#page_num").text(page_num+1);
		    $('#editor').text(text_file_all_text[page_num]);
	    	$("#gsc-i-id1.gsc-input").val(text_file_all_text[page_num]);
	    	$(".gsc-search-button").click();
		};
		reader.readAsText(textFile);
	}
});

function saveFn(){
	full_text = document.getElementById('editor').innerText.replace(/\n/g,' ');
	if(full_text != $("#gsc-i-id1").val()){
		$("#gsc-i-id1.gsc-input").val(full_text);
	    $(".gsc-search-button").click();
	}
	$("#editor").attr('contenteditable',false);
	$("#save").hide();
	$("#edit").show();
	$("#editor").text(full_text)
	$("#bk-editor").text(full_text)
	entities = []
	prepareAnnotations(entities)
}

function skipFn(){
	page_num++;
	$("#page_num").text(page_num+1);
	$('#editor').text(text_file_all_text[page_num]);
	$('#bk-editor').text(text_file_all_text[page_num]);
	$("#gsc-i-id1.gsc-input").val(text_file_all_text[page_num]);
	$(".gsc-search-button").click();
	entity_count = 0;
	entities = [];
}

function nextFn(){
	if(entities.length == 0){
		alert("Please select atleast one entity");
		return;
	}
	training_data = {};
	training_data['content'] = full_text;
	training_data['entities'] = entities;
	training_datas.push(training_data);
	page_num++;
	$("#page_num").text(page_num+1);
	entities = [];
	full_text = "";
	$("#editor").text("");
	$("#editor").attr('contenteditable',true);
	$("#save").show();
	$("#edit").hide();
	$("#entity").empty();
	if(page_num < text_file_all_text.length){
		$('#editor').text(text_file_all_text[page_num]);
		$("#bk-editor").text(text_file_all_text[page_num])
		$("#gsc-i-id1.gsc-input").val(text_file_all_text[page_num]);
		$(".gsc-search-button").click();
	}
	else{
		alert("Completed Annotation");
	}
	entity_count = 0;
}

function completeFn(){
	if(entities.length > 0){
		training_data = {};
		training_data['content'] = full_text;
		training_data['entities'] = entities;	
		training_datas.push(training_data);
	}
	if ('Blob' in window) {
		var fileName = prompt('Please enter file name to save with(.json)', 'Untitled.json');
		if(fileName != null){
			l(fileName);
			var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(training_datas));
			var dlAnchorElem = document.createElement('a');
			dlAnchorElem.setAttribute("href",     dataStr     );
			dlAnchorElem.setAttribute("download", fileName);
			dlAnchorElem.click();
			training_datas = []
			page_num = 0;
			entities = [];
			full_text = "";
			$("#editor").text("");
			$("#editor").attr('contenteditable',true);
			$("#save").show();
			$("#edit").hide();
			$("#entity").empty();
			entity_count = 0;
		}
	}
	else{
		alert('Your browser does not support the HTML5 Blob.');
	}
	
}

// keypress events  
/* 	alt + g = save 
	alt + x = skip
	alt + z = next
	alt + o = complete
*/
document.addEventListener('keydown', function(event) {
    if (event.altKey || event.metaKey) {
        switch (String.fromCharCode(event.which).toLowerCase()) {
        case 'g':
            event.preventDefault();
            document.getElementById("save").click();
            break;
        case 'x':
            event.preventDefault();
	    document.getElementById("skip").click();
	    break;
        case 'z':
            event.preventDefault();
	    document.getElementById("next").click();
	    break;
	case 'o':
	    event.preventDefault();
	    document.getElementById("complete").click();
	    break;
        }
    }
});
