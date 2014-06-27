var fs = require('fs');

function getStyleSheet(src,moduleName){
	var cssStr = fs.readFileSync(src,'UTF-8')
	
	//����ע��
	var txt = cssStr.replace(/\\*.+\*\//g,'');
	//���˻���
	var txt = txt.replace(/\r|\n/g,'');
	//���������ո�
	txt = txt.replace(/\s+/g,' ');
	//���˲���Ҫ�Ŀո�
	txt = txt.replace(/\s*{\s*/g,'{');
	txt = txt.replace(/\s*}\s*/g,'}');
	txt = txt.replace(/\s*;\s*/g,';');
	
	txt = '<style type="text/css" data-module="' + moduleName + '">' + txt + '</style>';
	return txt;
}

function getJS(src){
	var JsStr = fs.readFileSync(src,'UTF-8')
	return JsStr;
}

function getTemplate(src){
	var tmp = fs.readFileSync(src,'UTF-8')
	//���˻���
	var tmp = tmp.replace(/\r|\n/g,'');
	//���������ո�
	tmp = tmp.replace(/\s+/g,' ');
	//���˱�ǩ��Ŀո�
	tmp = tmp.replace(/\>\s+\</g,'><');
	tmp = "'" + tmp + "'";
	return tmp;
}



function checkMainFiles(src){
	var str = fs.readFileSync(src,'UTF-8');
	str = str.replace(/require\(((?:\,|\s|\w|\.|\'|\")+)\)/g,function(a,b){
		//����������Ŀո�
		b = b.replace(/\s*\,\s*/g,',');
		//��������
		b = b.replace(/\'|\"/g,'');
		
		//��ȡ����
		var args = b.split(/\,/g);
		
		console.log('find require',args);
		
		//�ж���Դ����
		if(args[0].match(/\.css$/)){
			console.log('loading and min css');
			return "'" + getStyleSheet(args[0],args[1] || '') + "'";
		}else if(args[0].match(/\.js$/)){
			console.log('loading js');
			return getJS(args[0]);
		}else if(args[0].match(/\.html$/)){
			console.log('loading template');
			return getTemplate(args[0]);
		}
	});
	
	console.log('build content over');
	return str;
}

function write(src,str){
	fs.writeFileSync(src,str);
}
//var txt = getStyleSheet('style.css','UI');
//var txt = getJS('utils.js');
//
//

var newContent = checkMainFiles('index.js');
write('dialog.js',newContent);
console.log('successful');