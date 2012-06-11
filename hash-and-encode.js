var str;
var secret;
var hash = '';

function data_wrap() {
	str ='';
	$('input').each(function(){
		if( $(this).attr('name') != 'secret' && $(this).val() != '')
		{
			str += $(this).val() + "\n";
		}
		else { 
			secret = $(this).val();
		}
	});
}


function qrencode () {

	data_wrap();

	alert(str);

	var size = 320;

	$('#qroutput').qrcode({width:size,height:size,text:str});
};


function SHAencode() {

	data_wrap();
	
	hash = HMAC_SHA256_MAC(secret,str);
	
	$('#shaoutput').text(hash);
};


function shaColors() {
	
	data_wrap();
	
	SHA256_init(secret);
	SHA256_write(str);
	digest = SHA256_finalize();  

	$('#shaColors').text(digest);
	
	//	digest_hex = array_to_hex_string(digest);
	
	var rows = new Array();
	
	for(i=0;i<digest.length;i++)
	{
		var bin = digest[i].toString(2);
		var len = bin.length;
		var num = 8 - len;
		var prefix = '';
		for(j=0;j<num;j++)
		{
			prefix += '0';
		}
		rows[i] = ''+prefix+''+bin;
	}
	
	var t = '';
	for(i=0;i<rows.length;i+=2)
	{
		t += rows[i] + ' ' + rows[i+1];
		
		var sum = '';
		for(j=0;j<8;j++)
		{
			if(rows[i][j]==1 || rows[i+1][j]==1)
			{
				sum += ''+'1';
			}
			else {
				sum += ''+'0';
			}
		}
		t += ' ' + sum;
		t += "\n";
	}
	var p = $('<p/>').text(t);
	$("#shaGrid").append(p);

	

}



function color64Hash() {

	if( hash == '') {
		SHAencode();
	}

	// alert(hash);

	for(j=0;j< hash.length;j++)
	{	
		var c = '#'+hash[j];
		
		if(j+5<hash.length) {
			c += hash[j+1] + hash[j+2]+ hash[j+3]+ hash[j+4]+ hash[j+5];
		}
		else if(j+4<hash.length) {
			c += hash[j+1] + hash[j+2]+ hash[j+3]+ hash[j+4]+hash[0];
		}
		else if(j+3<hash.length) {
			c += hash[j+1]+hash[j+2]+ hash[j+3]+hash[0]+hash[1];
		}
		else if(j+2<hash.length) {
			c += hash[j+1] + hash[j+2]+hash[0]+hash[1]+hash[2];
		}
		else if(j+1<hash.length) {
			c += hash[j+1]+hash[0]+hash[1]+hash[2]+hash[3];
		}
		else {
			c += hash[0]+hash[1]+hash[2]+hash[3]+hash[4];
		}
		var d = document.createElement("div");
		$(d).css('background-color',c);
		$(d).addClass('colortile');
		$('#colorbox').append(d);
	}
};





jQuery().ready(function(){

	$('#qrdo').bind('click',qrencode);
	$('#shado').bind('click',SHAencode);
	$('#color64do').bind('click',color64Hash);
	$('#shacolorsdo').bind('click',shaColors);
	
});