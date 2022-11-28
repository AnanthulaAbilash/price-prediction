$(document).ready(function () {
  var house_locations = JSON.parse(
    window.localStorage.getItem("house_locations")
  );

  if (house_locations) {
    /* console.log("options loading from local storage", new Date()); */
    $("#locField").empty();
    for (var i in house_locations) {
      var option = new Option(house_locations[i]);
      option.setAttribute("keyValue", i + 1);
      $("#locField").append(option);
    }
  } else {
    /* console.log("options loading from server", new Date()); */
    let api_key = `{{ env('APP_ENGINE_URL') }}`;
    var url_location = api_key + "/get_locations";
    //var url_location = "/api/get_locations";
    /* var url_location = "http://localhost:5000/get_locations"; */
    $.get(url_location, function (data, status) {
      if (data) {
        var house_locations = data.locations;
        window.localStorage.setItem(
          "house_locations",
          JSON.stringify(house_locations)
        );
        $("#locField").empty();
        for (var i in house_locations) {
          var option = new Option(house_locations[i]);
          option.setAttribute("keyValue", i + 1);
          $("#locField").append(option);
        }
      }
    });
  }

  var slider = document.getElementById("areaSlider");
  var output = document.getElementById("areaField");
  output.innerHTML = slider.value; // Display the default slider value

  // Update the current slider value (each time you drag the slider handle)
  slider.oninput = function () {
    output.value = this.value;
  };

  output.oninput = function () {
    slider.value = this.value;
  };

  $("#predPrice").click((event) => {
    event.preventDefault();
    var location = $("#locField").val() || "";
    var area = $("#areaField").val() || -1;
    var bhkNo = $("#bhkField").val() || -1;
    var bathRommNo = $("#bathField").val() || -1;
    var balconyNo = $("#balcField").val() || -1;
    /* console.log({
      total_sft: parseFloat(area),
      location: location,
      bhk: parseInt(bhkNo),
      bath: parseInt(bathRommNo),
      balcony: parseInt(balconyNo),
    }); */
    if (
      location === "" ||
      area === -1 ||
      bhkNo === -1 ||
      bathRommNo === -1 ||
      balconyNo === -1
    ) {
      console.log("enter all input fields");
    } else {
      let api_key = `{{ env('APP_ENGINE_URL') }}`;
      var url_prediction = api_key + "/predict_house_price";
      /* var url_prediction = "/api/predict_house_price"; */
      /* var url_prediction = "http://localhost:5000/predict_house_price"; */
      $.post(
        url_prediction,
        {
          total_sft: parseFloat(area),
          location: location.toString(),
          bhk: parseInt(bhkNo),
          bath: parseInt(bathRommNo),
          balcony: parseInt(balconyNo),
        },
        (data, status) => {
          /* console.log("fetched the result...", data); */
          if (data) {
            $(".priceDisplay").css("display", "flex");
            $(".priceDisplay > h2").text(data.housePrice_estimate.toString());
          }
        }
      );
    }
  });

  $("#resetForm").on("click", (event) => {
    event.preventDefault();
    $("#locField").prop("selectedIndex", 0);
    /* $("#locField>option:eq(0)").prop("selected", true); */
    $("#areaField").val(1250);
    $("#bhkField").val(2);
    $("#bathField").val(2);
    $("#balcField").val(1);
    $(".priceDisplay").css("display", "none");
    $(".priceDisplay > h2").empty();
  });
});
