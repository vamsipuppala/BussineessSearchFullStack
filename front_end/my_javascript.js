var yelp_data =[];
        var asc_dsc = [0,0,0]
        function mySort(ind)
        {   if(asc_dsc[ind] == 0){
            yelp_data.sort(sortFunction1);
            asc_dsc[ind] = 1;
             }
            else{
            yelp_data.sort(sortFunction2);
            asc_dsc[ind] = 0;
            }

            function sortFunction1(a, b) {
                if (a[ind] === b[ind]) {
                    return 0;
                }
                else {
                    return (a[ind] < b[ind]) ? -1 : 1;
                }
            }
            function sortFunction2(a, b) {
                if (a[ind] === b[ind]) {
                    return 0;
                }
                else {
                    return (a[ind] < b[ind]) ? 1 : -1;
                }
            }
            fill_the_table(yelp_data);
        }
        function fill_the_table(yelp_data)
        {   var i,j,n,m;
            var tab = ` <table>
                         <tr>
                         <th style="width:35px;">No.</th>
                        <th style="width:80px;">Image</th>
                        <th  style="width:550px;"><p onclick="mySort(0)" style="cursor: pointer;">Business Name</p></th>
                        <th style="width:140px;"><p onclick="mySort(1)" style="cursor: pointer;">Rating</p></th>
                        <th><p onclick="mySort(2)" style="cursor: pointer;">Distance (miles)</p></th>
                        </tr>`;
            n=yelp_data.length;
            m=yelp_data[0].length;
            for(i=0;i<n;i++)
            {
                
                    tab += `<tr> 
                    <td class=td_id>${i+1} </td>
                    <td > <div class="td_img"><img class="image_inside_table" src=${yelp_data[i][3]}> </div></td>
                    <td ><div class="td_name" ><span class="my_business_names"onclick="myBusiness('${yelp_data[i][4]}')" style="cursor: pointer;">${yelp_data[i][0]}</span></td>
                    <td class="td_rating" >${yelp_data[i][1]}</td> 
                    <td class="td_miles">${yelp_data[i][2]}</td>  
                </tr>`;
               
                
                
                }
                tab +=`</table>`;
                document.getElementById("table1_block").innerHTML = tab;
            document.getElementById("table1_block").scrollIntoView(true);
        }
        function myCancel(event)
        {   
            
            event.preventDefault();
            var txt1 =  document.getElementById("Location");
            txt1.value = "";
            txt1.disabled = false;
            txt1 =  document.getElementById("Options");
            txt1.value = "Default";
            txt1 =  document.getElementById("Keyword");
            txt1.value = "";
            document.getElementById("get_loc").checked = false;
            txt1 =  document.getElementById("Distance");
            txt1.value = 10;
            document.getElementById("table1_block").innerHTML="";
            document.getElementById("details_block").innerHTML="";
            document.getElementById("button_cancel").focus();

        }
        function yelpTableDetails(lat, long, term, cat, rad_mts)
        {
            // const url = (
            // "http://127.0.0.1:8080/search?" +
            // new URLSearchParams({'lat':lat, 'long':long, 'term':term, 'category':cat, 'radius':rad_mts}).toString());
            const url = (
            "https://yelp-vamsi-1.uw.r.appspot.com/search?" +
            new URLSearchParams({'lat':lat, 'long':long, 'term':term, 'category':cat, 'radius':rad_mts}).toString());
            console.log(url);
            var i=1;
            var tab;
            var cars = [];
            fetch(url)
            .then(res => res.json())
            .then(data => {
                cars = data;
                if(cars.length == 0)
                {
                    tab = `<div class='No_records'> No record has been found<div>`;
                        document.getElementById("details_block").innerHTML="";
                        document.getElementById("table1_block").innerHTML = tab;
                        document.getElementById("table1_block").scrollIntoView(true);
                        yelp_data = [];
                }
                else{
                
                yelp_data = [];
                for(let c in cars){
                
                var each_row_data = [];
                each_row_data.push(cars[c].name);
                each_row_data.push(cars[c].rating);
                each_row_data.push(cars[c].distance);
                each_row_data.push(cars[c].image_url);
                each_row_data.push(cars[c].id);
                
                yelp_data.push(each_row_data);
                }
                tab = fill_the_table(yelp_data);
                }
            });
        }
        function myCheckBox() {
         const txt =  document.getElementById("get_loc");
         var txt1 =  document.getElementById("Location");
         if(txt.checked)
         {   //document.getElementById("Location").reset();
            txt1.value = "";
            txt1.disabled=true;
            
         }
         else{
           
            txt1.disabled=false;
         }
        //  alert(txt)
         console.log(txt);
        }
        function mySubmit(event) {
            document.getElementById("button_span").focus();
            var lat,long,term, cat, rad;
            console.log(document.getElementById("Keyword").value);
            if(document.getElementById("Keyword").value == "" || document.getElementById("Distance").value == "")
            { 
                 var a=1;
            }
            else
            { if(document.getElementById("Location").value == ""  && document.getElementById("get_loc").checked==false)
            { console.log("Inside Keyword");
                var a1=1;
            }
            else{ event.preventDefault();
                document.getElementById("details_block").innerHTML = "";
                term = document.getElementById("Keyword").value;
                var cate_value = document.getElementById("Options").value;
                if (cate_value=="Arts & Entertainment")
                {
                        cat = 'arts';
                }
                else if(cate_value=="Health & Medical")
                {
                    cat = 'health';
                }
                else if(cate_value=="Hotels & Travel")
                {
                    cat = 'hotelstravel';
                }
                else if(cate_value=='Food')
                {
                    cat = 'food';
                }
                else if(cate_value=="Professional Services")
                {
                    cat = 'professional';
                }
                else
                {
                    cat = 'all';
                }
                rad = document.getElementById("Distance").value*1609.34;
                var rad_mts = Math.ceil( rad );
                if(rad_mts>=40000){
                rad_mts=40000;}
                if(document.getElementById("get_loc").checked==false)
                {   
                    var str = document.getElementById("Location").value;
                    var stringArray = str.split(" ");
                    var s = "https://maps.googleapis.com/maps/api/geocode/json?address=";
                    s += stringArray[0]
                    for(let i in stringArray)
                    {
                        if(stringArray[i]!=" " && i!=0)
                        {
                            s += "+";
                            s+=stringArray[i];
                        }
                    }
                    s+="&key=AIzaSyAN-C0jPArxqWHWdIyZVDtpE2UfwvgRBS0";
                    console.log(s);
                    fetch(s)
                    .then(res => res.json())
                    .then(data => {
                        console.log(data);
                        if(data.status == 'OK'){
                        lat = data.results[0].geometry.location.lat;
                        long = data.results[0].geometry.location.lng;
                        yelpTableDetails(lat,long,term,cat, rad_mts);}
                        else{
                            document.getElementById("details_block").innerHTML="";
                            
                            document.getElementById("table1_block").innerHTML=`<div class='No_records'> No record has been found<div>`;
                        }

                    })
                    
                }
                else{
                    var s = "https://ipinfo.io/?token=d3c6a17410f175";
                    
                    fetch(s)
                    .then(res => res.json())
                    .then(data => {
                        
                        var stringArray = data.loc.split(",");
                        lat = stringArray[0];
                        long = stringArray[1];
                        yelpTableDetails(lat,long,term,cat, rad_mts);
                    })
                }
            }
            
        }
             }
        function myBusiness(id) {
        console.log(id);
        
        var tab;
        
        // const url = (
        //     "http://127.0.0.1:8080/deatils?" +
        //     new URLSearchParams({'id': id}).toString());
        const url = (
            "https://yelp-vamsi-1.uw.r.appspot.com/deatils?" +
            new URLSearchParams({'id': id}).toString());
            fetch(url)
            .then(res => res.json())
            .then(data => { 
                
                var d = data[0];
                tab = `<div class = "details_block1">
                <div class="detail_block_head" style="textalign: center";><p class=details_headings>${d.name}</p></div>
                <div style="width:800px; height:3px; margin:2px;    background-color:  whitesmoke;"">&nbsp;</div>
                        <div class="grid-container">`
                
                
                var tab;
                console.log(d);
                if(d.Status == 'Closed')
                {
                        tab += `<div><p class=details_headings>Status</p><p class="status_label_red">${d.Status}</p></div>`
                }
                else if(d.Status == 'Open Now')
                {
                    tab += `<div><p class=details_headings>Status</p><p class="status_label_green">${d.Status}</p></div>`
                }

                if(d.Category)
                {
                    tab += `<div><p class=details_headings>Category</p><p class="details_sub_headings" style="width:320px;">${d.Category}</p></div>`
                }
                if(d.display_address)
                {
                    tab += `<div><p class=details_headings>Address</p><p class="details_sub_headings">${d.display_address}</p></div>`
                }
                if(d.display_phone)
                {
                    tab += `<div><p class=details_headings>Phone Number</p><p class="details_sub_headings">${d.display_phone}</p></div>`
                }
                if(d.transactions)
                { 
                    tab += `<div><p class=details_headings>Transactions Supported</p><p class="details_sub_headings">${d.transactions}</p></div>`
                }
                if(d.price)
                {
                    tab += `<div><p class=details_headings>Price</p><p class="details_sub_headings">${d.price}</p></div>`
                }
                if(d.url)
                {  
                    tab += `<div><p class=details_headings>More info</p><a href="${d.url}" target="_blank"><p class="details_sub_headings">Yelp</p></a></div>`
                }
                // for(let c in d)
                // {
                //     console.log(tab);
                // }
                tab += `</div> <div class="flex-container">`;
                
                if (d.photos.length > 0){
                    console.log("inside");
                tab +=  `<div class="business_img_details"><div class="image_div"><img class ="business_img" src="${d.photos[0]}"></div><p style="text-align: center; font-size: 13px;">Photo 1</p></div>`;
            }
                if (d.photos.length>1){
                tab +=  `<div class="business_img_details"><div class="image_div"><img class ="business_img" src="${d.photos[1]}"></div><p style="text-align: center; font-size: 13px;">Photo 2</p></div>`;}
                if (d.photos.length>2){
                tab +=  `<div class="business_img_details"><div class="image_div"><img class ="business_img" src="${d.photos[2]}"></div><p style="text-align: center; font-size: 13px;">Photo 3</p></div>`;}
                tab += `</div></div>`;
                return tab;
            }).then(tab => {document.getElementById("details_block").innerHTML = tab;
                            document.getElementById("details_block").scrollIntoView(true);})

    }