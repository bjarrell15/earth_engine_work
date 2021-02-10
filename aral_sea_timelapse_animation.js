// Set up our AOI, our image collection, and our starting date variables.
var geo = ee.Geometry.Rectangle({coords:[[57.395, 47.047],[61.635, 43.659]],geodesic:false});
var l4 = ee.ImageCollection('LANDSAT/LT04/C01/T1_TOA').filterBounds(geo);
var l5 = ee.ImageCollection('LANDSAT/LT05/C01/T1_TOA').filterBounds(geo);
var l7 = ee.ImageCollection('LANDSAT/LE07/C01/T1_TOA').filterBounds(geo);
var l8 = ee.ImageCollection('LANDSAT/LC08/C01/T1_TOA').filterBounds(geo);
var date = ee.Date.fromYMD(1985,1,1);

// A simple cloud masking function, using the Landsat mission's QA band.
function mask(image)
{
  var masker = image.select('BQA').bitwiseAnd(1<<4);
  
  return image.updateMask(masker.eq(0));
}
// Select RGB from L4, L5, and L7.
function selectOldLS(image)
{
  return image.select(['B3','B2','B1']).rename('r','g','b');
}
// Select RGB from L8.
function selectL8(image)
{
  return image.select(['B4','B3','B2']).rename('r','g','b');
}
// Apply functions written above.
l4 = l4.map(mask).map(selectOldLS);
l5 = l5.map(mask).map(selectOldLS);
l7 = l7.map(mask).map(selectOldLS);
l8 = l8.map(mask).map(selectL8);
// Make one giant Landsat image collection.
var merged = l4.merge(l5).merge(l7).merge(l8);

// This creates a sequence of numbers, representing 35 years.
// This will be mapped over.
var indexList = ee.List.sequence(0,34);

// Make our date filters, shove them in a list.
function getDate(index)
{
  var initial = ee.Number(1).multiply(index);
  var begin = date.advance(initial,'year');
  var end = begin.advance(1,'year');
  return ee.DateRange(begin,end);
}

var dateRanges = indexList.map(getDate);

// Make images given our AOI and our date range.
function makeImages(dateRange)
{
  dateRange = ee.DateRange(dateRange);
  var filt = merged.filterDate(dateRange.start(),dateRange.end());
  var median = filt.median();
  return median.clip(geo);
}

// Map our date ranges over the merged collection.
var filmRoll = dateRanges.map(makeImages);
var filmColl = ee.ImageCollection(filmRoll);

// Create a ui.Thumbnail, which will generate a GIF of our AOI.
var timelapse = ui.Thumbnail({
  image:filmColl,
  params:{dimensions:900,region:geo,bands:['r','g','b'],min:0,max:0.34,framesPerSecond:6}
                            });
print(timelapse);
