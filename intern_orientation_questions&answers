// Earth Engine Training Tasks

/*

EASY -- Print the area of land and the area of water, respectively,
        in Franklin County, TN to the console. Both should be printed
        to the console in square miles.
        
        Dataset to use: ee.FeatureCollection("TIGER/2018/Counties")
========================================================================
MEDIUM -- Generate an NDVI band for every Landsat 8 image over 
          Cleveland, OH with less than 10% calculated cloud cover 
          in 2020. Add these calculated NDVIs to each image. 
          (Hint: try using .map() on a function).
          
          Bonus: Make a qualityMosaic() of these images, based
          upon the derived NDVI bands. Add this to the UI map below.
          
          Datasets to use: 
          Cleveland Metropolitan Area --> ee.FeatureCollection("TIGER/2018/Counties")
          Landsat 8 --> ee.ImageCollection("LANDSAT/LC08/C01/T1_SR")
========================================================================          
HARD -- Go to an area of your choice and select two images from a
        dataset of your choice (ex: Landsat 8, Landsat 5, Sentinel 2).
        Create a ui.SplitPanel() which compares two cloudless NDVI images 
        from at least a year apart on the map.
        
        Bonus: Make a ui.Panel() and add it to the map. In the panel, 
        print out the latitude, longitude, and the NDVIs from each image
        at the selected pixel. Alternatively, print out the difference
        in NDVI values between the first and second images.
========================================================================
HARD -- Using a similar approach to the one listed under the second task,
        write a function that will cloud/shadow mask every image in a Landsat 8
        time series (not a filter!), calculate an EVI band (https://on.doi.gov/39u5SLA),
        and reduce the Cleveland region to get the median EVI value for each image
        in the stack. Once you have this information, pass it into a ui.Chart()
        and print the chart to the console. The chart should show the values as a
        function of time over the duration of the period you choose.
        (Hint: Use .expression() to calculate the EVI, .reduceRegion() for the reduction step.)
        
*/

// // Question #1 (Area question)
// var counties = ee.FeatureCollection("TIGER/2018/Counties");

// // First, we filter for our particular county of interest.
// /*
// These can both be found either by Google search, or by
// printing out the full feature collection and checking the
// properties saved for each feature in the collection.
// */
// var state = ee.Filter.eq('STATEFP','47');
// var county = ee.Filter.eq('NAME', 'Franklin');

// // Combine filters into one.
// var fullFilt = ee.Filter.and(state,county);

// // Apply the filter.
// var filteredCounties = counties.filter(fullFilt);

// // Let's get out the info we need.
// var franklin = ee.Feature(filteredCounties.first());
// var areaLand = franklin.get('ALAND');
// var areaWater = franklin.get('AWATER');

// // Writing a function to do the conversion from sq.m. to sq.mi. for us!
// function sqMToSqMi(property){
  
//   return ee.Number.expression({
    
//     expression: 'sqM / sqMi',
    
//     vars:{'sqM':ee.Number(property),
//           'sqMi':ee.Number(2.59).multiply(1000000)}
           
//   }).round();
  
// }

// // Apply the function to our two properties.
// areaLand = sqMToSqMi(areaLand);
// areaWater = sqMToSqMi(areaWater);

// // Print them!
// print('Area of land in Franklin County, TN (sq.mi.):', areaLand);
// print('Area of water in Franklin County, TN (sq.mi.):', areaWater);
//======================================================================
// Question #2 (NDVI question)

// var counties = ee.FeatureCollection("TIGER/2018/Counties");
// var l8 = ee.ImageCollection("LANDSAT/LC08/C01/T1_SR");

// /*
// We need to first filter down our collection based upon the constraints
// described in the question.
// */ 
// var cleveland = counties.filterMetadata('NAME','equals','Cuyahoga');

// // Remember, filtering and clipping are mutually exclusive. 
// l8 = l8.filterDate('2020-01-01','2021-01-01')
//       .filterBounds(cleveland)
//       .filterMetadata('CLOUD_COVER','less_than',10);
       
// // If you want to see what you've filtered, uncomment the line below.
// // Map.addLayer(l8.median(),{bands:['B4','B3','B2'],min:0,max:2000})       

// function ndvi(image){
  
//   return image.addBands(image.normalizedDifference(['B5','B4']).rename('NDVI'));
  
// }

// var l8_wNDVI = l8.map(ndvi);

// /* 
// Side note: notice how the calculation of an NDVI w/o
// a cloud mask added could potentially skew the results
// high if looking at aggregated spatial statistics.
// */
// // Map.addLayer(l8_wNDVI,{bands:['NDVI'],min:0,max:1});

// var redToGreen = ['FF0000',
// 'FF1000',
// 'FF2000',
// 'FF3000',
// 'FF4000',
// 'FF5000',
// 'FF6000',
// 'FF7000',
// 'FF8000',
// 'FF9000',
// 'FFA000',
// 'FFB000',
// 'FFC000',
// 'FFD000',
// 'FFE000',
// 'FFF000',
// 'FFFF00',
// 'F0FF00',
// 'E0FF00',
// 'D0FF00',
// 'C0FF00',
// 'B0FF00',
// 'A0FF00',
// '90FF00',
// '80FF00',
// '70FF00',
// '60FF00',
// '50FF00',
// '40FF00',
// '30FF00',
// '20FF00',
// '10FF00'];

// // BONUS!
// var ndviMosaic = l8_wNDVI.qualityMosaic('NDVI');
// Map.addLayer(ndviMosaic,{bands:['NDVI'],palette:redToGreen,min:0,max:1});
//======================================================================
// Question #3 (SplitPanel question)

// var l8 = ee.ImageCollection("LANDSAT/LC08/C01/T1_SR");

// // Create a region of interest to filter down our images.
// var roi = ee.Geometry.Point(-84.51,39.101)
//           .buffer(100)
//           .bounds();
// // Bring in two arbitrary date ranges.
// var dtRng1 = ee.DateRange('2014-01-01','2014-03-01');
// var dtRng2 = ee.DateRange('2016-01-01','2016-03-01');

// // Function to mask clouds.
// function l8_bitmask(image){
//   // Select the pixel_qa band.
//   var pixelQA = image.select('pixel_qa');
//   // Bit 3 --> Cloud shadow
//   var shadow = pixelQA.bitwiseAnd(1 << 3);
//   // Bit 5 --> Cloud
//   var cloud = pixelQA.bitwiseAnd(1 << 5);
//   // Mask where the condition here is met.
//   var cldMask = shadow.eq(0).and(cloud.eq(0));
//   // Return the masked image.
//   return image.mask(cldMask);
// }

// // Bring in our before and after images to compare.
// var before = ee.Image(l8.filterDate(dtRng1)
//                         .filterBounds(roi)
//                         .filter(ee.Filter.lt('CLOUD_COVER',10))
//                         .first());
// var after = ee.Image(l8.filterDate(dtRng2)
//                       .filterBounds(roi) 
//                       .filter(ee.Filter.lt('CLOUD_COVER',10))
//                       .first());

// // Apply the cloud mask to both of the produced images.
// before = l8_bitmask(before);
// after = l8_bitmask(after);

// // Calculate our NDVI images.
// function ndvi(image){
  
//   return image.expression("(NIR-RED)/(NIR+RED)",{'NIR':image.select('B5'),'RED':image.select('B4')}).rename('NDVI');
  
// }

// var ndviPre = ee.Image(ndvi(before));
// var ndviPost = ee.Image(ndvi(after));

// // Now, let's create our UI elements.
// var map_ctr = roi.centroid(1);
// // List of controls that we're removing from the map.
// var ctrls = {layerList:false,fullscreenControl:false,mapTypeControl:false};

// // Make our map objects for the split panel.
// var map1 = ui.Map().setControlVisibility(ctrls);
// var map2 = ui.Map().setControlVisibility({layerList:false,fullscreenControl:false,
//                                           mapTypeControl:false,zoomControl:false});
// // Links the maps for panning and zooming.
// var linked = ui.Map.Linker([map1,map2]);

// var smallPalette = ['blue','white','green'];
// // Create an NDVI visualization.
// var ndviViz = {min:0,max:0.6,palette:smallPalette};

// map1.addLayer(ndviPre,ndviViz);
// map2.addLayer(ndviPost,ndviViz);
// // Create our SplitPanel object.
// var split = ui.SplitPanel(map1,map2,'vertical');
// // Clear the existing UI to make room for our custom one.
// ui.root.clear();
// ui.root.add(split);

// // Center the two maps on our roi.
// map1.centerObject(map_ctr,13);

// // BONUS
// // Begin by creating our panel object.
// var panel = ui.Panel({style:{width:'180px'}});
// map1.add(panel);

// // Making a bunch of labels and textboxes for the panel on the map.
// var title = ui.Label('NDVI Inspector',{'font-weight':'bold','padding':'0px 0px 0px 25px'});
// panel.add(title);

// var label_pre = ui.Label('2014 NDVI value',{'font-size':'11px','font-weight':'bold','padding':'0px 0px 0px 29px'});
// panel.add(label_pre);
// var preBox = ui.Textbox({
//   placeholder: 'Click map for value',
// });
// panel.add(preBox);

// var label_post = ui.Label('2016 NDVI value',{'font-size':'11px','font-weight':'bold','padding':'0px 0px 0px 29px'});
// panel.add(label_post);
// var postBox = ui.Textbox({
//   placeholder: 'Click map for value',
// });
// panel.add(postBox);

// var label_difference = ui.Label('Difference between values',{'font-size':'11px','font-weight':'bold','padding':'0px 0px 0px 7px',
//                                                             'text-align':'center'});
// panel.add(label_difference);
// var differenceBox = ui.Textbox({
//   placeholder: 'Click map for value',
// });
// panel.add(differenceBox);

// // These functions use a reduceRegion call to grab the NDVI values from each image based on a derived point.
// function preTextChange(pt){
//   var greenVal = ndviPre.reduceRegion({
//                   reducer:ee.Reducer.mean(),
//                   geometry:pt,
//                   scale:30
//                   }).get('NDVI');
//   // Asyncronous call to print the computed objects to the textbox in a human-interpretable format.
//   greenVal.evaluate(function(derived){preBox.setValue(derived.toFixed(3))});
  
// }
// function postTextChange(pt){
//   var greenVal = ndviPost.reduceRegion({
//                   reducer:ee.Reducer.mean(),
//                   geometry:pt,
//                   scale:30
//                   }).get('NDVI');
  
//   greenVal.evaluate(function(derived){postBox.setValue(derived.toFixed(3))});

// }
// function greenDifference(pt){
//   var preGreen = ndviPre.reduceRegion({
//                   reducer:ee.Reducer.mean(),
//                   geometry:pt,
//                   scale:30
//                   }).get('NDVI');
//   var postGreen = ndviPost.reduceRegion({
//                     reducer:ee.Reducer.mean(),
//                     geometry:pt,
//                     scale:30
//                     }).get('NDVI');
  
//   var difference = ee.Number(postGreen).subtract(ee.Number(preGreen));
  
//   difference.evaluate(function(derived){differenceBox.setValue(derived.toFixed(3))});
// }

// map1.onClick(function(coords){
//   var clickedPt = ee.Geometry.Point(coords.lon,coords.lat);
  
//   preTextChange(clickedPt);
//   postTextChange(clickedPt);
//   greenDifference(clickedPt);
  
// });
// map2.onClick(function(coords){
//   var clickedPt = ee.Geometry.Point(coords.lon,coords.lat);
  
//   preTextChange(clickedPt);
//   postTextChange(clickedPt);
//   greenDifference(clickedPt);
  
// });
//======================================================================
// Question #4 (Time series question)

// Bring in our image collection.
// var counties = ee.FeatureCollection('TIGER/2018/Counties');
// var l8 = ee.ImageCollection('LANDSAT/LC08/C01/T1_SR');

// // Get county in which Cleveland lies once more.
// var cleveland = counties.filterMetadata('NAME','equals','Cuyahoga');

// function l8_bitmask(image){
  
//   var pixelQA = image.select('pixel_qa');
  
//   var shadow = pixelQA.bitwiseAnd(1 << 3);
//   var cloud = pixelQA.bitwiseAnd(1 << 5);
  
//   var masker = shadow.eq(0).and(cloud.eq(0));
  
//   return image.updateMask(masker);
// }

// l8 = l8.filterBounds(cleveland)
//       .filterDate('2017-01-01','2021-01-01')
//       .map(l8_bitmask);
       
// // Let's calculate our EVI band for each image.
// function eviCalc(image){
//   return image.addBands(
//   image.expression({
//       expression:'G * ((NIR - RED)/(NIR + C1 * RED - C2 * BLUE + L))',
//       map:{
//         'G': 2.5,
//         'NIR': image.select('B5'),
//         'RED': image.select('B4'),
//         'C1': 6,
//         'C2': 7.5,
//         'BLUE': image.select('B2'),
//         'L': 1
//         }
//     }).rename('EVI'));
// }
// // Apply it to our image collection.
// var l8wEVI = l8.map(eviCalc).select('EVI');

// // Finally, let's make our chart.
// var EVISeries = ui.Chart.image.series({
//   imageCollection: l8wEVI, 
//   region: cleveland, 
//   reducer: ee.Reducer.median(), 
//   scale: 30
// }).setSeriesNames(['EVI'])
//   .setOptions({
//     title:'Median EVI value -- 2017-2021',
//     hAxis:{title:'Date'},
//     vAxis:{title:'Band Value'},
//     colors:['green']
//   });
// print(EVISeries);
