QUnit.test( "hello test", function( assert ) {
  assert.ok( 1 == "1", "Passed!" );
});

QUnit.test( "Click Test", function( assert ) {
  assert.expect( 1 );
  var $body = $( "body" );
  $body.on( "click", function() {
    assert.ok( true, "body was clicked!" ); //то що чекаєм
  });
  $body.trigger( "click" );
});

// QUnit.test( "Click Test22", function( assert ) {
//   assert.expect( 1 );
//   var btn_name = $( "#btn_name" );
//   console.log(btn_name);
  // var btn_capasity = $( "#btn_capasitty" );
  // btn_capasity.on( "click", function() {
  //   assert.ok( true, "body was clicked!" ); //то що чекаєм
  // });
  // btn_capasity.trigger( "click" );
// });
