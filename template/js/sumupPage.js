<script>

    $(document).ready(function(){

        $( ".accountRow" ).click(function(event) {
          let accountCode = event.target.attributes[0].value;
          $(".transactionRow").each(function(index, elem){
            if(elem.attributes.code.value == accountCode){
                var transactionsTable = $(elem).find(".transactionsTable");
                if(transactionsTable.hasClass("visible")){
                    transactionsTable.removeClass("visible");
                } else {
                    transactionsTable.addClass("visible");
                }
            }
          });

        });


        $( "#myRange").on( "input", function() {
            $( "#myRangeNumber").val($("#myRange").get(0).value);
        });
        $( "#myRangeNumber").on( "change", function() {
            $( "#myRange").val($("#myRangeNumber").get(0).value);
        });

        $(".createNewAccountOverlay .popupContainer .accountSelector #account").on( "change", function() {
            let elem = $(".createNewAccountOverlay .popupContainer .accountSelector #account").get(0);
            let availableBalance = 0;
            if(elem.options[elem.selectedIndex].attributes.balance){
                availableBalance = elem.options[elem.selectedIndex].attributes.balance.value
            }
            $( "#myRange").get(0).max = availableBalance;
            $( "#myRangeNumber").val(0);
        });


        $( ".openNewAccountButton").click(function(event) {
            $( ".createNewAccountOverlay").show();
        });

        $(".createNewAccountOverlay .popupContainer .closePopupButton").click(function(event) {
            $( ".createNewAccountOverlay").hide();
        });


        $( ".validButton").click(function(event) {

            $.post("/account", {
                "userCode"           : $(".userCode .value").get(0).innerHTML,
                "initialCredit"      : $("#myRangeNumber").get(0).value,
                "initialAccountCode" : $(".createNewAccountOverlay .popupContainer .accountSelector #account").get(0).value
            }).done(function( data ) {
                location.reload();
            }).fail(function(err) {
                alert("ERROR : "+err.responseText);
            });
        });




    });

</script>