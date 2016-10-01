$("#form").submit(function() {
  $('#load').toggle();
	var url = "https://script.google.com/macros/s/AKfycby02iKFGzFNXBIax0en4VpoEGp6Pm40wFmfkBhE0OWUVokwMZTF/exec";
    $.ajax({
        type: "POST",
        url: url,
        data: $("#form").serialize(),
        dataType: "json",
        success: function(data) {
			if(!data.err){
				$('#total1').text(data.pip);
				$('#total2').text(data.obl);
				$('#total3').text(data.sta);
			}else{
				$('#total1').text(data.err);
				$('#total2').text('');
				$('#total3').text('');
			}
        }
    })
    .fail(function() {
        $('#total1').text("Ошибка");
		$('#total2').text('');
		$('#total3').text('');
    })
    .always(function() {
        $('#load').toggle();
    });
    return false;
});
